define(["jquery", "./cell_renderer", "./enums", "./options", "./player", 
	"./tileinfo-icons", "./util"], 
function ($, cr, enums, options, player, icons, util) {

	var renderer;
	var $canvas;
	var borders_width;

	var scale;

	$(document).bind("game_init", function() {
		$canvas = $("#inventory");
		renderer = new cr.DungeonCellRenderer();
		borders_width = (parseInt($canvas.css("border-left-width"), 10) || 0) * 2;
		$canvas.on("update", update);
	});

	function update() {
		var filtered_inv = Object.values(player.inv).filter(function(item) {
			if(!item.quantity) {
				return false
			}
			else if (item.hasOwnProperty("qty_field" && item.qty_field))
				return true;
		});

		/*filtered_inv.sort(function(a, b) {
		
			if(a.base_type === b.base_type)
				return a.sub_type - b.sub_type;

			return a.base_type - b.base_type;

		});*/

		var cell_length = renderer.cell_width;
		var panel_length = renderer.cell_width * 13;


		util.init_canvas($canvas[0], panel_length, renderer.cell_height * 4);
		renderer.init($canvas[0]);

		renderer.ctx.fillStyle = "green";
		renderer.ctx.fillRect(0, 0, panel_length, renderer.cell_height*4);
		filtered_inv.slice(0, filtered_inv.length).forEach(function(item, idx) {
		
			var i = idx % 13;
			var offset = cell_length * i;
			var yoffset = 0;
			if(idx > 12 && idx < 26)
				yoffset = renderer.cell_height * 1;
			else if ( idx > 25 && idx < 39)
				yoffset = renderer.cell_height * 2;
			else if ( idx > 38 && idx < 52)
				yoffset = renderer.cell_height * 3;
			item.tile.forEach(function(tile) {

				renderer.draw_main(tile, offset, yoffset, scale); 

			});

		});

		$canvas.removeClass("empty");
	}

	options.add_listener(function() {
		var update_required = false;

		var new_scale = options.get("consumables_panel_scale") / 100;
		if (scale != new_scale) {
			scale = new_scale;
			update_required = true;
		}

		if(update_required) {
			update();
		}
	});
});
