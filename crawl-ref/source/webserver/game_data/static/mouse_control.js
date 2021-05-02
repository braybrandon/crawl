define(["jquery", "comm", "./cell_renderer", "./dungeon_renderer","./inventory", "./tileinfo-gui", "./tileinfo-icons", "./player", "./map_knowledge",
        "./enums", "./ui-layouts"],
function ($, comm, cr, dr, inventory, gui, icons, player, map_knowledge, enums, ui) {
    function handle_cell_click(ev)
    {
        if (ev.which == 1) // Left click
        {
            comm.send_message("click_travel", {
                x: ev.cell.x,
                y: ev.cell.y
            });
        }
        else if (ev.which == 3) // Right click
        {
            comm.send_message("click_travel", {
                x: ev.cell.x,
                y: ev.cell.y
            });
        }
    }

    function show_tooltip(text, x, y)
    {
        $("#tooltip")
            .html(text)
            .css({ left: x, top: y })
            .show();
    }

    function hide_tooltip()
    {
        $("#tooltip").hide();
    }

    function handle_cell_tooltip(ev)
    {
        var map_cell = map_knowledge.get(ev.cell.x, ev.cell.y);

        if (map_cell.mon)
            show_tooltip(map_cell.mon.name, ev.pageX + 10, ev.pageY + 10);
    }


    $(document)
        .off("game_init.mouse_control")
        .on("game_init.mouse_control", function () {
            $("#dungeon")
                .on("cell_click", handle_cell_click)
                .on("cell_tooltip", handle_cell_tooltip);
	    $('#inventory').bind('contextmenu', function(e){
		    return false;
	    });
	    $("#inventory").on("mouseup", function(ev){
		
		var x = Math.floor((ev.pageX - $(this).offset().left) / 32);
		var y = Math.floor((ev.pageY - $(this).offset().top) / 32);
		var index = x + y * 10;
		var filtered_inv = Object.values(player.inv).filter(function(item) {
		    if(!item.quantity) { 
			return false;
		    }
			else if (item.hasOwnProperty("qty_field" && item.qty_field))
				return true
		    
		});
			filtered_inv.sort(function(a,b) {
				if(a.base_type === b.base_type)
					return a.sub_type - b.sub_type;
				return a.base_type - b.base_type;
			});

		if(filtered_inv[index] != null)
			var slot = filtered_inv[index].slot - 97;
		if(ev.which == 1) {
			    if(ev.shiftKey) {
				if(filtered_inv[index] != null) {
		        		comm.send_message("drop", { keycode: slot, size: 0 });
					comm.send_message("input", { text: "." });
				}
			    }
			else {
				comm.send_message("equip", { keycode: slot });
				comm.send_message("input", { text: "." });
			}

		}
		else if(ev.which == 3) {

		        comm.send_message("describe-inventory", { keycode: slot });
		}
	    });
		$("#inventory").on("mousemove", function(ev) {
			var x = Math.floor((ev.pageX - $(this).offset().left) / 32);
			var y = Math.floor((ev.pageY - $(this).offset().top) / 32);
			var $canvas = $("#inventory");
			var renderer = new cr.DungeonCellRenderer();
			renderer.init($canvas[0]);
			$("#inventory").triggerHandler("update");
			renderer.draw_icon(icons.CURSOR, x * 32, y * 32);
			
		});
        });
    $(window)
        .off("mouseup.mouse_control mousemove.mouse_control mousedown.mouse_control")
        .on("mousemove.mouse_control mousedown.mouse_control", function (ev) {
            hide_tooltip();
        });

    return {
        show_tooltip: show_tooltip,
        hide_tooltip: hide_tooltip
    };
});
