$(function() {
	
	
	var $container = $('#form-container'),
		$preview = $('#preview'),
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
			$this;
		
		
		
		function init() {
			
			if(isReady) return;
			
			var html = '<div class="cube '+ (( size === 1 ) ? 'small-cube' : 'big-cube') +'" projet="'+ name +'" style="display:none;"><div></div></div>';
			
			$container.append(html);
			$('#menu li[categorie=' + menu.categorie + ']').after('<li projet="'+ name +'" class="link">'+ menu.titre +'</li>');
			
			$this = $('.cube[projet='+ name +']');
			$this.on('mouseenter', Emouseenter);
			$this.on('mouseleave', Emouseleave);
			$('#menu li[projet='+ name +']').on('mouseenter', Emouseenter);
			
			$this.css('opacity', 0).width( 0 ).height( 0 ).find('div').css('background-color', color);
			$this.css('left', (( size === 1 ) ? position.x + 25 : position.x + 50)).css('top', (( size === 1 ) ? position.y + 25 : position.y + 50));
			$this.animate({
				left: position.x,
				top: position.y,
				width: (( size === 1 ) ? 50 : 100),
				height: (( size === 1 ) ? 50 : 100),
				opacity: 1
			}, 300);
			$this.show();
			
			isReady = true;
			
		}
		
		
		
		this.update = function(force) {
			
			if(isReady && !force) return;
			
			$this.css('left', position.x + 'px').css('top', position.y + 'px').find('div').css('background-color', color);
			
		};
		
		
		this.mouseenter = Emouseenter;
		this.mouseleave = Emouseleave;
		this.name = name;
		this.init = init;
		
		
		
		/* EVENTS */
		function Emouseenter() {
			
			$('.cube').css('opacity', .3);
			$('#form-container div div div').fadeIn(200);
			$this.css('opacity', 1);
			$preview.hide();
			$preview.css('background-image', 'url(admin/src/interface/couv-projets/' + name + '.jpg)').fadeIn(150);
			$('#menu li[projet=' + name + ']').addClass('hovered');
			
		}
		
		function Emouseleave() {
			
			$('.cube').css('opacity', 1);
			$preview.css('background', 'none');
			$('#menu li[projet]').removeClass('hovered');
			
		}
		
	}
	
	
	
	
	
	$.ajax({
		dataType: "json",
		url: 'admin/src/articles/articles.json?time=' + new Date().getTime()
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
				
		}
		
		setTimeout(squareBySquare, 300);
		
		
	}).fail(function(a,f,e) {
		
		alert('Erreur de chargement ! :(')
		
	});
	
	
	
	$('#menu').on('mouseleave', 'li[projet]', function() {
		
		$('.cube').css('opacity', 1).removeClass('hovered');
		$preview.css('background', 'none');
		$('#menu li[projet]').removeClass('hovered');
		
	});
	
	
	
	
	
	// var projets = [
	// 	{n: 'a', p: [50, 150], c: '#eb7a5e', s: 2},
	// 	{n: 'pixels', p: [150, 100], c: '#f2956d', s: 2},
	// 	{n: 'walang', p: [250, 150], c: '#48a7bd', s: 2},
	// 	{n: 'd', p: [150, 250], c: '#449fc9', s: 2},
	// 	{n: 'e', p: [200, 200], c: '#e1634e', s: 1},
	// 	{n: 'tiroirs', p: [150, 200], c: '#58abcc', s: 1},
	// 	{n: 'g', p: [250, 100], c: '#de9959', s: 1},
	// 	{n: 'h', p: [250, 250], c: '#308fba', s: 1}
	// ];	
	
	
	
});