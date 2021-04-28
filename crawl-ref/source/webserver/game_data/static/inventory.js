define(["jquery", "./cell_renderer", "./enums", "./options", "./player", 
	"./tileinfo-icons", "./util"], 
function ($, cr, enums, options, player, icons, util) {

	var renderer;
	var $canvas;
	var borders_width;

	var scale;

	$(document).bind("game_init", function() {
		$canvas = $("#inventory");
		renderer - new cr.DungeonCellRenderer();
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

		filtered_inv.sort(function(a, b) {
		
			if(a.base_type === b.base_type)
				return a.sub_type - b.sub_type;

			return a.base_type - b.base_type;

		});

		var required_length = renderer.cell_width * filtered_inv.lenght;
		var available_length = $("#dungeon").width();

		available_length -= borders_width;
		var max_cells = Math.floor(available_length / cell_length);
		var panel_length = Math.min(required_length, available_length);

		util.init_canvas($canvas[0], panel_length, renderer.cell_height);
		renderer.init($canvas[0]);

		renderer.ctx.fillStyle = "black";
		renderer.ctx.fillRect(0, 0, panel_length, renderer.cell_height);

		filtered_inv.slice(0, max_cells).forEach(function(item, idx) {
			
			var offset = clee_length * idx;
			item.tile.forEach(function(tile) {

				renderer.draw_main(tile, offset, 0, scale); 

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
