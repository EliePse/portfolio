$(function(){
	
	var $container = $('#form-container'),
		offset = $container.offset(),
		wContainer = $container.width(),
		hContainer = $container.height();
	
	
	
	
	
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
	
});