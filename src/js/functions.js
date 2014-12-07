
function Family() {
	
	var children = [];
	
	this.addChild = function(child) {
		children.push(child);
	};
	this.removeChild = function(child) {};
	this.printFamily = function($element) {
		
		var width = $element.width(),
			height = $element.height();
		
		var grid = {
			w: $element.width(),
			h: $element.height(),
			ax: Math.floor(width / 51),
			ay: Math.floor(height / 51),
			margin: {
				x: Math.ceil((width % 51) / 2),
				y: Math.ceil((height % 51) / 2)
			},
			center: {
				x: Math.ceil(width / 2),
				y: Math.ceil(height / 2)
			}
		}
		
		var html = '';
		
		for(var i=0; i<children.length; i++){
			
			var child = children[i],
				x = child.getX(),
				y = child.getY(),
				txt = '<div class="cube ';
			
			if(x > grid.ax ||y > grid.yx) continue;
			
			txt += (child.getSize()) ? 'small-cube' : 'big-cube';
			txt += ' c' + i + '" style="';
			txt += 'left:' + (grid.center.x + (x * 51) + 1) + 'px;';
			txt += 'top:' + (grid.center.y + (y * 51) + 1) + 'px;"';
			txt += '></div>';
			
			html += txt;
			
		}
		
		$element.html(html);
		
		
	};
	
	// $(document).on('mouseenter', '.cube', function(){
		
	// 	$('.cube').style('border', '3px').css('width', '46px').css('height', '46px').('background-color', 'none');
		
	// })
	
}

function Child() {
	
	var color = '#2f2f2f',
		size = 49,				// 49 ou 100
		position = [0,0],		// par rapport à la grille
		link = '',
		preview = '';
	
	this.getX = function() {return position[0];};
	this.getY = function() {return position[1];};
	this.getSize = function() {return size;};
	// this.get = function() {};
	
}

var family = new Family();

family.addChild(new Child());
family.printFamily($('#form-container'));