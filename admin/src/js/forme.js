$(function() {
	
	var mouse = { click : false, hover : false, lastPos : {x:0, y:0}, dragLock : true },
		$menuProjets = $('#menu .articles'),
		$articleMain = $('.article-main'),
		$container = $('#form-container'),
		$preview = $('#preview'),
		tDate = new Date(),
		squares = [],
		mode = 1;
	
	
	
	/*
		|| Square ||
		$ Objet gérant les carrés coloré et l'interaction avec le menu
		$ ainsi que le chargement des articles.
		$ Objet essentiel et central du site !
	*/
	var Square = function (name, pos, color, size, titre, categorie) {
		
		var name = name,
			menu = {titre: titre, categorie: categorie},
			position = {x: pos[0], y: pos[1]},
			animating = true,
			isReady = false,
			color = color,
			size = size,
			$cover,
			$menu,
			$this;
		
		function init() {
			
			if(isReady) return;
			
			/* Création du code des éléments */
			var htmlCube = '<div class="cube '+ (( size === 1 ) ? 'small-cube' : 'big-cube') +'" projet="'+ name +'" style="display:none;"><div class="rest" style="background-color:#'+ color +'"></div><div class="hovered" style="border: 5px solid #'+ color +';"></div></div>',
				htmlPreview = '<img projet="'+ name +'" toLoad="admin/src/interface/couv-projets/' + name + '.jpg" alt="converture '+ name +'" />',
				htmlMenu = '<li projet="'+ name +'" class="link">'+ menu.titre +'</li>';
			
			/* Injection des éléments */
			$container.append(htmlCube);
			$preview.append(htmlPreview);
			$('#menu li[categorie=' + menu.categorie + ']').after(htmlMenu);
			
			/* Récupération des objets */
			$this = $('.cube[projet='+ name +']');
			$cover = $preview.find('img[projet='+ name+']');
			$menu = $('#menu li[projet=' + name + ']');
			
			/* Mise en place des Events */
			$this
				.on('mouseenter', Emouseenter)
				.on('mouseleave', Emouseleave)
				.on('click', Emouseclick);
			$('#menu li[projet='+ name +']')
				.on('mouseenter', Emouseenter)
				.on('click', Emouseclick);
			
		}
		
		/* Fonction appelée pour charger et afficher l'article associé à l'objet Square */
		function loadArticle() {
			$.ajax({
				dataType: "json",
				url: 'admin/src/articles/' + name + '/content.json?time=' + tDate.getDate() + tDate.getMonth() + tDate.getFullYear()
			}).done(function(e) {
				var pages = e.pages,
					$articlePages = $articleMain.find('.projets .content tr');
				$articleMain.find('.projets .titre').html(e.title);
				for(var i = 0; i < pages.length; i++) {
					var page = pages[i],
						html = '<td class="page" index="' + i + '" >';
					if(page.type === 1) {
						html += '<div class="text" '+ ((page.endOfDesc) ? 'style="border-right: 2px solid #'+ color +';"' : '') +'>';
						html += '<p>'+ page.content +'</p>';
					} else if (page.type === 2) {
						html += '<div class="img" '+ ((page.endOfDesc) ? 'style="border-right: 2px solid #'+ color +';"' : '') +'>';
						html += '<img toLoad="admin/src/articles/' + name + '/img/'+ page.content.src +'" alt="visuel '+ name +'" />';	
					}
					html += '</div></td>';
					$articlePages.append(html);	
				}
				loadImages(true, function(){
					$this.animate({ left: -10, opacity: 0 }, 300, function() {
						$articleMain.find('.projets').show();
						$articleMain.fadeIn(function() {
							document.body.style.cursor = 'move';
							mouse.dragLock = false;
							$('#menu .backFromArticles').fadeIn();
						});
						animating = false;
					}).removeClass('loading-cube');;
					
				});
				
			});
		}
		
		
		function popIn(callback) {
			
			animating = true;
			
			$this
				.removeClass('loading-cube')
				.css('opacity', 0)
				.width( 0 )
				.height( 0 )
				.css('left', (( size === 1 ) ? position.x + 25 : position.x + 50))
				.css('top', (( size === 1 ) ? position.y + 25 : position.y + 50));
			
			$this.animate({
				left: position.x,
				top: position.y,
				width: (( size === 1 ) ? 50 : 100),
				height: (( size === 1 ) ? 50 : 100),
				opacity: 1
			}, 300, function() { animating = false; }).show();
			
			mode = 1;
			isReady = true;
			
		}
		
		/* EVENTS */
		function Emouseenter() {
			
			if(animating || mode === 2) return;
			
			$('.cube .hovered').show();
			$('.cube .rest').hide();
			$this.find('.rest').show();
			$cover.show();
			$menu.addClass('hovered');
			
		}
		
		function Emouseleave() {
			
			if(animating || mode === 2) return;
			
			$('.cube .hovered').hide();
			$('.cube .rest').show();
			$cover.hide();
			$('#menu li[projet]').removeClass('hovered');
		}
		
		function Emouseclick() {
			
			if(animating || mode === 2) return;
			
			animating = true;
			mode = 2;
			
			$('.cube .hovered').hide();
			$('.cube .rest').show();
			$cover.fadeOut(450);
			$('#menu li[projet]').removeClass('hovered');
			
			$this.addClass('loading-cube');
			
			$menuProjets.fadeOut();
			$('.cube').not($this).animate({
				
				opacity: 0
				
			}, 450);
			setTimeout(loadArticle, 450);
			
		}
		
		this.mouseenter = Emouseenter;
		this.mouseleave = Emouseleave;
		this.click = Emouseclick;
		this.popIn = popIn;
		this.name = name;
		this.init = init;
		
	} /* Fin de l'objet Square */
	
	
	
	/*
		|| loadImages ||
		$ Cette fonction gère et affiche le chargement d'images
		$ elle le fait automatiquement, dès son appel.
		$ C'est effectif sur les images contenant l'attribut
		$ "toLoad" où y est inséré le lien du fichier.
	*/
	function loadImages(adjust, callback) {
		
		var elements = $('img[toLoad]'), // On récupère les éléments à charger
			actualElement,
			iteration = 0;
		
		if(elements.length === 0) { if(callback) callback(); return; } // On vérifie qu'il y a bien des éléments à charger
		$('#loading-indicator').show().find('span').html('0'); // On reset le HUD
		load(); // On lance le chargement
		
		/* La fonction de chargement automatique */
		function load() {
			actualElement = $(elements[iteration]);
			var img = new Image();
			img.onload = function() {
				if(adjust) {
					if( img.width / img.height <=  395 / 250) actualElement.css('width', '100%').css('top', - (( ((395 / img.width) * img.height) - 250) / 2) + 'px' );
					else actualElement.css('height', '100%').css('left', - (( ((250 / img.height) * img.width)  - 395) / 2) + 'px' );
				}
				actualElement.attr('src', this.src).removeAttr('toLoad');
				$('#loading-indicator span').html(Math.round( (100 * (iteration + 1)) / elements.length ));
				console.log((iteration + 1) + '/' + elements.length + ' - loaded' );
				iteration++;
				if(iteration < elements.length) { // Il reste des éléments à charger ?
					load(); // Oui, on relance la fonction
				} else { // Non, on exécute les finalités
					$('#loading-indicator').fadeOut(150);
					if(callback) callback();
					return;
				}
			}
			img.src = actualElement.attr('toLoad');
		}
		
	}
	
	
	
	/*
		|| START ||
		$ Cette fonction permet de démarrer le code
		$ (rien que ça !)
	*/
	function START() {
		
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
					setTimeout(squareBySquare, 50);
				else {
					loadImages(false, function(){
						
						$('.loading-cube').fadeOut(500).remove();
						
						for(var i=0; i < squares.length; i++)
							squares[i].popIn();
						
						setTimeout(function(){ $menuProjets.fadeIn(300); }, (squares.length * 50) + 300);
							
					});
					
				}
					
			}
			
			setTimeout(squareBySquare, 300);
			
		}).fail(function(a,f,e) {
			alert('Erreur de chargement ! :(')
		});
			
	}
	
	
	
	
	
	/* 
		||			  ||
		||   EVENTS   ||
		||			  ||
	 */
	$('.article-main *').on('mousedown', function(event) {
		event.preventDefault ? event.preventDefault() : event.returnValue = false;});
	
	$(document).on('mousedown', function(e) {
		mouse.click = true;
		mouse.lastPos = {x: e.pageX, y: e.pageY};});
	
	$(document).on('mouseup', function() {
		mouse.click = false;});
	
	$articleMain.on('mousemove', function(e) {
		if(!mouse.click || mouse.dragLock) return;
		var delta = e.pageX - mouse.lastPos.x;
		$articleMain.scrollLeft( $articleMain.scrollLeft() - (delta * 2) );
		mouse.lastPos = {x: e.pageX, y: e.pageY};});
	
	/* EVENTS */
	$('#menu').on('mouseleave', 'li[projet]', function() {
		$('.cube .hovered').hide();
		$('.cube .rest').show();
		$preview.find('img').hide();
		$('#menu li[projet]').removeClass('hovered');});
	
	$('#menu .backFromArticles li').click(function() {
		
		document.body.style.cursor = 'auto';
		mouse.dragLock = true;
		
		$('#menu .backFromArticles').fadeOut(300);
		$articleMain.fadeOut(300, function() {
			
			
			$articleMain.find('.projets table tr').html('').scrollLeft(0);
			$('.cube').hide();
			$container.show();
			
			var carret = 0;
			
			function squareBySquare() {
			
				squares[carret].popIn();
				carret++;
				
				if(carret < squares.length)
					setTimeout(squareBySquare, 50);
				else
					setTimeout(function(){ $menuProjets.fadeIn(300); }, 350);
					
					
			}
			
			setTimeout(squareBySquare, 300);
			
		});
				
	});
	
	
	$('#menu .backFromPages li').click(function() {
		
		$('#menu .backFromPages').fadeOut(300);
		$articleMain.fadeOut(300, function() {
			
			$articleMain.find('.amis, .connaitre, .contact').hide();
			$container.show();
			$('#form-main').fadeIn(300);
			$('.articles').fadeIn(300);
			
		});
				
	});
	
	$('.projets').on('click', 'img', function() {
		$('.lightbox-main img').attr('src', $(this).attr('src'));
		$('.lightbox-main').fadeIn(300);});
	
	$('.lightbox-main').click(function() {
		$(this).fadeOut(300);});
	
	$('.link[page]').click(function() {
		
		$this = $(this);
		
		$menuProjets.fadeOut(function() {
			
			$('#menu .backFromPages').fadeIn(300);
			
		});
		$('#form-main').fadeOut(300);
		$articleMain.find('.projets').hide();
		$articleMain.find('.' + $this.attr('page')).show();
		$articleMain.fadeIn(300);
		
	});
	
	
	
	
		
	
	START();
	
	
});