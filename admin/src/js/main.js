$(function(){
	
	function log (txt) { console.log(txt); }
	
	var $container = $('#form-container'),
		offset = $container.offset(),
		wContainer = $container.width(),
		hContainer = $container.height();
	
	var cursor = {x: 0, y: 0};
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