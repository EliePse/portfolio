$(function() {
	
	
	
	var $container = $('#form-container'),
		$preview = $('#preview'),
		$articleMain = $('.article-main'),
		mode = 1,
		squares = [];
	
	
	
	function Square(name, pos, color, size, titre, categorie) {
		
		var name = name,
			position = {x: pos[0], y: pos[1]},
			color = color,
			isReady = false,
			size = size,
			menu = {
				titre: titre,
				categorie: categorie
			},
			animating = true,
			$this;
		
		
		
		function init() {
			
			if(isReady) return;
			
			var html = '<div class="cube '+ (( size === 1 ) ? 'small-cube' : 'big-cube') +'" projet="'+ name +'" style="display:none;"><div class="rest" style="background-color:#'+ color +'"></div><div class="hovered" style="border: 5px solid #'+ color +';"></div></div>';
			
			$container.append(html);
			$('#menu li[categorie=' + menu.categorie + ']').after('<li projet="'+ name +'" class="link">'+ menu.titre +'</li>');
			
			$this = $('.cube[projet='+ name +']');
			$this.on('mouseenter', Emouseenter);
			$this.on('mouseleave', Emouseleave);
			$this.on('click', Emouseclick);
			$('#menu li[projet='+ name +']').on('mouseenter', Emouseenter);
			
			popIn();
			isReady = true;
			
		}
		
		function loadArticle() {
			
			$.ajax({
				
				dataType: "json",
				url: 'admin/src/articles/' + name + '/content.json?time=' + tDate.getDate() + tDate.getMonth() + tDate.getFullYear()
				
			}).done(function(e) {
				
				var pages = e.pages;
				var $articlePages = $articleMain.find('.content tr');
				
				$articleMain.find('.titre').html(e.title);
				for(var i = 0; i < pages.length; i++) {
					var page = pages[i];
					var html = '<td class="page" index="' + i + '" >';
						if(page.type === 1) {
							
							html += '<div class="text" '+ ((page.endOfDesc) ? 'style="border-right: 2px solid #'+ color +';"' : '') +'>';
							html += '<p>'+ page.content +'</p>';
							html += '</div>';
							
						} else if (page.type === 2) {
							
							html += '<div class="img" '+ ((page.endOfDesc) ? 'style="border-right: 2px solid #'+ color +';"' : '') +'>';
							html += '<img toLoad="admin/src/articles/' + name + '/img/'+ page.content.src +'" />';
							html += '</div>';
							
						}
						html+= '</td>';
					
					$articlePages.append(html);
					
				}
				
				loadImages(function(){
					
					$this.animate({
						
						left: -10,
						opacity: 0
						
					}, 300, function() {
						
						$articleMain.fadeIn(function() {
							
							$('#menu .backFromArticles').fadeIn();
							
						});
						animating = false;
						
					});
					
				});
				
			});

		}
		
		function popIn() {
			
			animating = true;
			
			$this.css('opacity', 0).width( 0 ).height( 0 );
			$this.css('left', (( size === 1 ) ? position.x + 25 : position.x + 50)).css('top', (( size === 1 ) ? position.y + 25 : position.y + 50));
			
			$this.animate({
				left: position.x,
				top: position.y,
				width: (( size === 1 ) ? 50 : 100),
				height: (( size === 1 ) ? 50 : 100),
				opacity: 1
			}, 300, function() {
				animating = false;
			});
			
			$this.show();
			mode = 1;
			
		}
		
		this.mouseenter = Emouseenter;
		this.mouseleave = Emouseleave;
		this.click = Emouseclick;
		this.popIn = popIn;
		this.name = name;
		this.init = init;
		
		
		
		/* EVENTS */
		function Emouseenter() {
			
			if(animating || mode === 2) return;
			
			$('.cube .hovered').show();
			$('.cube .rest').hide();
			$this.find('.rest').show();
			$preview.hide();
			$preview.css('background-image', 'url(admin/src/interface/couv-projets/' + name + '.jpg)').fadeIn(150);
			$('#menu li[projet=' + name + ']').addClass('hovered');
			
		}
		
		function Emouseleave() {
			
			if(animating || mode === 2) return;
			
			$('.cube .hovered').hide();
			$('.cube .rest').show();
			$preview.css('background', 'none');
			$('#menu li[projet]').removeClass('hovered');
		}
		
		function Emouseclick() {
			
			if(animating || mode === 2) return;
			
			animating = true;
			mode = 2;
			
			$('.cube .hovered').hide();
			$('.cube .rest').show();
			$preview.css('background', 'none');
			$('#menu li[projet]').removeClass('hovered');
			
			$('#menu .articles').fadeOut();
			$('.cube').not($this).animate({
				
				opacity: 0
				
			}, 450);
			setTimeout(loadArticle, 450);
			console.log(mode);
			
		}
		
	}
	
	
	
	
	/* LOADING */
	
	var tDate = new Date();
	
	$.ajax({
		dataType: "json",
		url: 'admin/src/articles/articles.json?time=' + tDate.getDate() + tDate.getMonth() + tDate.getFullYear()
	}).done(function(e) {
		
		
		var projets = e.data,
			carret = 0;
		
		function squareBySquare() {
		
			var p = projets[carret],
				o = new Square( p.name, p.position, p.couleur, p.taille, p.titre, p.categorie);
			
			squares.push( o );
			
			o.init();
			carret++;
			
			if(carret < projets.length)
				setTimeout(squareBySquare, 33);
			else
				setTimeout(function(){ $('#menu .articles').fadeIn(300); }, 350);
				
		}
		
		setTimeout(squareBySquare, 300);
		
		
	}).fail(function(a,f,e) {
		
		alert('Erreur de chargement ! :(')
		
	});
	
	
	
	function loadImages(callback) {
		
		var elements = $('img[toLoad]');
		
		if(elements.length === 0) {
			if(callback) callback();
			return;
		}
		
		var	actualElement,
			iteration = 0;
		
		function load() {
			
			
			actualElement = $(elements[iteration]);
			var img = new Image();
			
			console.log((iteration + 1) + '/' + elements.length + ' - loading' );
			
			img.onload = function() {
				
				actualElement.attr('src', this.src);
				console.log((iteration + 1) + '/' + elements.length + ' - loaded' );
				
				iteration++;
				
				if(iteration < elements.length) {
					load();
				} else {
					if(callback) callback();
					return;
				}
				
			}
			
			img.src = actualElement.attr('toLoad');
		}
		
		load();
		
	}
	
	
	
	/* EVENTS */
	$('#menu').on('mouseleave', 'li[projet]', function() {
		
		$('.cube .hovered').hide();
		$('.cube .rest').show();
		$preview.css('background', 'none');
		$('#menu li[projet]').removeClass('hovered');
		
	});
	
	$('#menu .backFromArticles').click(function() {
		
		$(this).fadeOut(300);
		$articleMain.fadeOut(300, function() {
			
			$articleMain.find('.content tr').html('');
			$('.cube').hide();
			$container.show();
			
			var carret = 0;
			
			function squareBySquare() {
			
				squares[carret].popIn();
				carret++;
				
				if(carret < squares.length)
					setTimeout(squareBySquare, 33);
				else
					setTimeout(function(){ $('#menu .articles').fadeIn(300); }, 350);
					
					
			}
			
			setTimeout(squareBySquare, 300);
			
		});
				
	});
	
	
	
});