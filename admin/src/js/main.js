$(function(){
	
	function log (txt) { console.log(txt); }
	
	var $container = $('#form-container'),
		offset = $container.offset(),
		wContainer = $container.width(),
		hContainer = $container.height();
	
	var cursor = {x: 0, y: 0};
	
	
	function Child(color, size) {
		
		var color = color,
			size = size,
			position = [0,0]; // en coordonée modulaire
			
		var d = new Date();
		var fixed = false;
		var $this,
			seed = d.getTime();
		
		$container.append('<div id="' + seed + '" class="cube ' + ((size === 48) ? 'small' : 'big') + '-cube" style="left: 1px;top: 1px;opacity:0.8;background-color:' + color + ';"></div>');
		$this = $('#' + seed);
		var that = this;
		
		this.x = function(arg) {
			
			if(arg != undefined && !fixed) position[0] = arg;
			else return position[0];
			
		};
		
		this.y = function(arg) {
			
			if(arg != undefined && !fixed) position[1] = arg;
			else return position[1];
			
		};
		
		this.color = function(arg) {
			
			if(arg && !fixed) color = arg;
			else return color;
			
		}
		
		this.size = function(arg) {
			
			if(arg && !fixed) size = arg;
			else return size;
			
		}
		
		this.update = function() {
			
			if(fixed) return;
			
			$this.css('background-color', color);
			
			$this.css('left', ((position[0] * 50) + 1) + 'px');
			$this.css('top', ((position[1] * 50) + 1) + 'px');
			
		}
		
		this.fix = function() {
			
			if(fixed){
				fixed = false;
				$this.css('opacity', .8);
				$container.css('border', '1px solid #bfbfbf');
			}else{
				fixed = true;
				$this.css('opacity', 1);
				$container.css('border', '0px solid #bfbfbf');
			}
			
		}
		
		$this.click(function(){
			that.fix();
		});
		
	}
	
	var c = new Child('#e1634e', 98);
	
	$container.mousemove(function(e){
		
		var mouseX = e.pageX - offset.left,
			mouseY = e.pageY - offset.top;
		
		var x = Math.floor(mouseX / 50);
		var y = Math.floor(mouseY / 50);
		
		if( (x * 50) + c.size() <= wContainer )
			c.x(x); 
		if( (y * 50) + c.size() <= hContainer )
			c.y(y);
		
		c.update();
		
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	var article = {
		
		current: 0,
		title: '',
		pages: []
		
	};
	
	$('#edit-tools .type li[type=texte]').click(function(){
		$('#edit-tools .tool').hide();
		$('#edit-tools .tool[atype=texte]').show();
		var page = { type: 1, content: '' };
		article.pages[ article.current ] = page;
		$('.article .content td[index=' + article.current + ']').html( '<div class="text"><p></p></div>' ); });
	
	$('#edit-tools .type li[type=image]').click(function(){
		$('#edit-tools .tool').hide();
		$('#edit-tools .tool[atype=image]').show();
		var page = { type: 2, content: '' };
		
		var $this = $('.article .content td[index=' + article.current + ']');
		if($this.find('img').length == 0)
			$this.append('<div class="img"><img type="image" alt="visuel du projet" /></div>');
		
		article.pages[ article.current ] = page; });
	
	$('#edit-tools .type li[type=code]').click(function(){
		$('#edit-tools .tool').hide();
		$('#edit-tools .tool[atype=code]').show();
		var page = { type: 3, content: '' };
		article.pages[ article.current ] = page; });
	
	
	
	
	
	
	
	$('#edit-tools .titre').on('keyup', function(){
		$('.article .titre').html( $(this).val() );
		article.title = $(this).val(); });
	
	$('#edit-tools .tool[atype=texte]').on('keyup', function(){
		$('.article .content td[index=' + article.current + '] .text p').html( $(this).val().replace(/(?:\r\n|\r|\n)/g, '<br />') );
		article.pages[ article.current ].content = $(this).val(); });
	
	$('#edit-tools .tool[atype=image]').on('change', function(){
		
		if(this.disabled) return alert('File upload not supported!');
		var F = this.files;
		if(F.length == 0) return;
		readImage( F[0] );
		
	});
	
	
	
	
	
	
	$('.article .content').on('click', 'td', function(){
		
		var $this = $(this);
		
		article.current = $this.attr('index');
		$('#edit-tools .tool').hide().val();
		
		if(article.pages[ article.current ].type == 1)
			$('#edit-tools .tool[atype=texte]').val( article.pages[ article.current ].content ).show();
		if(article.pages[ article.current ].type == 2)
			$('#edit-tools .tool[atype=image]').show();
		if(article.pages[ article.current ].type == 3)
			$('#edit-tools .tool[atype=texte]').show();
		
		
	});
	
	
	
	
	
	$('#choice input[action=add]').click(function() {
		$('#edit-tools .tool').hide();
		$('.article .content tr').append('<td index="' + article.pages.length + '"></td>');
		article.pages.push({ type: 0, content: '' });
		article.current = article.pages.length - 1; });
	
	$('#choice input[action=bor]').click(function() {
		$('#edit-tools .tool').hide();
		$('.article .content td[index=' + article.current + '] div').toggleClass('desc-end');
		
		if(article.pages[ article.current ])
			article.pages[ article.current ] = false;
		else
			article.pages[ article.current ] = true;
			
		article.current = article.pages.length - 1; });
	
	$('#choice input[action=sup]').click(function() {
		
		if( article.current == 0 ) return;
			
		$('.article .content td[index=' + article.current + ']').remove();
		article.pages[ article.current ] = { type:-1, content:'' };
		
		article.current = 0;
		
		$('#edit-tools .tool').hide();
		if(article.pages[ article.current ].type == 1)
			$('#edit-tools .tool[type=texte]').val( article.pages[ article.current ].content ).show();
		
	});
	
	
	
	
	
	
	
	function readImage(file) {

		var reader = new FileReader();
		var image  = new Image();

		reader.readAsDataURL(file);  
		
		reader.onload = function(_file) {
			
			image.src    = _file.target.result;              // url.createObjectURL(file);
			
			image.onload = function() {
				
				var w = this.width,
					h = this.height,
					t = file.type,                           // ext only: // file.type.split('/')[1],
					n = file.name,
					s = file.size;
				
				article.pages[ article.current ].content = {
					
					src: _file.target.result,
					width: w,
					height: h,
					name: n,
					size: s
					
					
				}
				
				$('.article .content td[index=' + article.current + '] img').attr('src', article.pages[ article.current ].content.src); 
				
			};
			
			image.onerror= function() {
				alert('Invalid file type: '+ file.type);
			};
			    
		};

	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});