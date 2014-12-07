$(function(){
	
	var $container = $('#form-container'),
		offset = $container.offset();
	
	
	
	
	
	function Child(color, size) {
		
		var color = color,
			size = size,
			position = [0,0]; // en coordonée modulaire
			
		var d = new Date();
		var fixed = false;
		var $this,
			seed = d.getTime();
		
		$container.append('<div id="' + seed + '" class="cube ' + ((size === 98) ? 'small' : 'big') + '-cube" style="left: 1px;top: 1px;opacity:0.8;background-color:' + color + ';"></div>');
		$this = $('#' + seed);
		var that = this;
		
		this.x = function(arg) {
			
			if(fixed) return;
			
			if(arg != undefined) position[0] = arg;
			else return position[0];
			
		};
		
		this.y = function(arg) {
			
			if(fixed) return;
			
			if(arg != undefined) position[1] = arg;
			else return position[1];
			
		};
		
		this.color = function(arg) {
			
			if(fixed) return;
			
			if(arg) color = arg;
			else return color;
			
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
			}else{
				fixed = true;
				$this.css('opacity', 1);
			}
			
		}
		
		$this.click(function(){
			that.fix();
		});
		
	}
	
	
	
	
	
	var c = new Child('#e1634e', 48);
	
	$container.mousemove(function(e){
		
		var mouseX = e.pageX - offset.left,
			mouseY = e.pageY - offset.top;
		
		c.x(Math.floor(mouseX / 50)); 
		c.y(Math.floor(mouseY / 50));
		
		c.update();
		
	});
	
});