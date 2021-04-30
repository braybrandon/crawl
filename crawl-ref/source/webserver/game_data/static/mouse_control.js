define(["jquery", "comm", "./dungeon_renderer", "./tileinfo-gui", "./player", "./map_knowledge",
        "./enums", "./ui-layouts"],
function ($, comm, dr, gui, player, map_knowledge, enums, ui) {
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
	    $("#inventory").click (function(ev){
		var filtered_inv = Object.values(player.inv).filter(function(item) {
		    if(!item.quantity) {
			return false
		    }
		    else if (item.hasOwnProperty("qty_field" && item.qty_field))
			return true;
		});
		var inventory = Object.values(player.inv);

		filtered_inv.sort(function(a, b) {
		
			if(a.base_type === b.base_type)
				return a.sub_type - b.sub_type;

			return a.base_type - b.base_type;

		});
		
		var x = Math.floor((ev.pageX - $(this).offset().left) / 32);
		var y = Math.floor((ev.pageY - $(this).offset().top) / 32);
		var index = x + y * 13;
		var item = index + "a".charCodeAt(0);
		    if (index > 25) 
			    item = index - 25 + "A".charCodeAt(0);
		if(ev.which == 1) {
		    if (index <= filtered_inv.length) {
		        comm.send_message("key", { keycode: 63 });
		    	comm.send_message("key", { keycode: 47 });
		    	$.when(comm.send_message("key", { keycode: 73 })).then(function(){
			$("#logan").val("+0 rapier");
			});
		        //comm.send_message("key", { keycode: 105 });
		    	//comm.send_message("key", { keycode: item });
			//comm.send_message("key", { keycode: 119 });
		    }
		}else if(ev.which == 3) {
		    if (index <= filtered_inv.length) {
		        comm.send_message("key", { keycode: 105 });
		    	comm.send_message("key", { keycode: item });
			comm.send_message("key", { keycode: 100 });
			ev.preventDefault();
		    }
		}
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
