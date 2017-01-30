
var CTabManager = function(formData)
{
	var main = this;
	this.tabViews 			= [];
	this.tab_num			= 3;
	this.formData = formData;

	this.init = function()
	{
		var tabs = 2;
		if(this.formData)
		{
			if(this.formData.tabs.length > 0)
				tabs = this.formData.tabs.length;
		}
		this.tab_num = tabs + 1;

		for(var i = 0; i < tabs; i++)
		{
			var tab_data = null;
			if(this.formData)
				tab_data = this.formData.tabs[i];
			this.addTabView(i + 1, false, tab_data);
		}
		this.selectTabView(0, true);
		this.initEvents();
	}

	this.getview = function(index)
	{
		return this.tabViews[index].view;
	}

	this.getTabNum = function()
	{
		return this.tabViews.length;
	}

	this.getRow = function(index)
	{
		if(index)
			return this.tabViews[index].getRow();
		else
			return this.getCurTabview().getRow();
	}

	this.getCol = function(index)
	{
		if(index)
			return this.tabViews[index].getCol();
		else
			return this.getCurTabview().getCol();
	}

	this.getCurTabview = function()
	{
		var curTab = $('#form_tabview').children('.active');
		return this.tabViews[curTab.index()];
	}

	this.addTabView = function(tabIndex, isActive, tab_data)
	{
		var tabNum = this.getTabNum();
		var tab_name = 'Tab' + tabIndex;
		if(tab_data)
			tab_name = tab_data.tab_name;
		var html = '<li>\
						<a data-toggle="tab" href="#tab' + tabIndex + '"><span>' + tab_name + '</span></a>\
						<input type="text" placeholder="" class="form-control">\
						<i class="fs-14 pg-close"></i>\
					</li>';
		
		$('#btn_new_tab').parent('li').before(html);
		var newTabView = new CTabView(tabIndex, tab_data);
		this.tabViews.push(newTabView);

		if(isActive)
			newTabView.view.addClass('active');
		return newTabView.view;
	}

	this.selectTabView = function(index, isActive)
	{
		if(isActive)
		{
			$('#form_tab').children('li').removeClass('active');
			$('#form_tab').children('li').eq(index).addClass('active');
		}

		var tabView = this.tabViews[index];
		if(isActive)
		{
			$('#form_tabview').children('.tab-pane').removeClass('active');
			tabView.view.addClass('active');
		}

		var row = tabView.getRow();
		var col = tabView.getCol();
		$('#txt_rows').val(row);
		$('#txt_cols').val(col);
	}

	this.removeTavView = function(index)
	{
		$('#form_tab').children('li').eq(index).remove();
		var curTabview = this.tabViews[index].view;
		if(curTabview.hasClass('active'))
			this.selectTabView(0, true);
		curTabview.remove();
		this.tabViews.splice(index, 1);
	}

	this.changeDropArea = function(new_rows, new_cols)
	{
		// var curTab = $('#form_tabview').children('.active');
		var curTabView = this.getCurTabview();
		curTabView.changeDropArea(new_rows, new_cols);
		api_component.onResize();
	}


	this.initEvents = function()
	{
		$('#form_tab').on('mouseenter', 'li', function(e)
		{
			var close = $(this).find('i').first();

			var ul = $(this).closest('ul');
			var tab_num = main.getTabNum();
			if(tab_num <= 1)
				close.hide();
			else
				close.show();
		});

		$('#form_tab').on('mouseleave', 'li', function(e)
		{
			var close = $(this).find('i').first();
			close.hide();
		});

		$('#form_tab').on('click', 'i', function(e)
		{
			if(main.getTabNum() <= 1)
				return;

			var tab_index = $(this).closest('li').index();
			main.removeTavView(tab_index);
			$('#component_toolbar').appendTo('body');

			e.stopPropagation();
		});

		$('#form_tab').on('click', 'li', function(e)
		{
			var tab_num = main.getTabNum();
			var tab_index = $(this).index();
			if(tab_index == tab_num)
			{
				// mainView.createTabView(main.tab_num);
				main.addTabView(main.tab_num, false);
				main.selectTabView(tab_index, true);
				main.tab_num++;
			}
			else
			{
				main.selectTabView(tab_index);
			}

			if(e.target.nodeName != 'INPUT')
			{
				$('#form_tab li').find('a').show();
				$('#form_tab li').find('input').hide();
			}

			api_component.onResize();
		});

		$('#form_tab').on('dblclick', 'li', function(e)
		{
			var text = $(this).find('span').first();
			var input = $(this).find('input');
			input.val(text.text());
			input.show();
			input.focus();
			// input.select();
			$(this).find('a').hide();
		});

		$('#form_tab').on('focus', 'li input', function(e) {
			$(this).select();
		});

		$('#form_tab').on('blur', 'li input', function(e) {
			var text = $(this).val();
			if(text.length > 0)
			{
				var curTab = $(this).closest('li');
				var span = curTab.find('span').first();
				span.text(text);
			}
		});

		$('#form_tab').on('keyup', 'li input', function(e) {
			if(e.which == 13)
			{
				var text = $(this).val();
				if(text.length > 0)
				{
					var curTab = $(this).closest('li');
					var span = curTab.find('span').first();
					span.text(text);
					curTab.find('a').show();
					curTab.find('input').hide();
				}
			}
		});

		$(window).resize(function(e)
		{
			api_component.onResize();
		})
	}

	this.init();
}

var CTabView = function(tabIndex, tab_data)
{
	this.view;
	this.drop_areas;
	this.init = function()
	{
		// var html = '<div class="tab-pane slide" id="tab' + tabIndex + '">\
		// 				<div class="form_view">\
		// 					<section class="actions_drop">\
		// 						<dl class="sortable">'
		// 							+ html_empty_drop +
		// 							'<div class="clear_both"></div>\
		// 						</dl>\
		// 					</section>\
		// 					<section class="middle_drop_area">\
		// 						<dl class="sortable" row="3" col="2"></dl>\
		// 					</section>\
		// 					<section class="actions_drop">\
		// 						<dl class="sortable">'
		// 							+ html_empty_drop +
		// 							'<div class="clear_both"></div>\
		// 						</dl>\
		// 					</section>\
		// 				</div>\
		// 			</div>';
		var html = '<div class="tab-pane slide" id="tab' + tabIndex + '">\
						<div class="form_view">\
						</div>\
					</div>';

		this.view = $(html);
		$('#form_tabview').append(this.view);

		var form_view = this.view.find('.form_view');

		var header_data = null;
		var middle_data = null;
		var footer_data = null;
		var row = 3;
		var col = 2;
		if(tab_data)
		{
			header_data = tab_data.header;
			middle_data = tab_data.middle;
			footer_data = tab_data.footer;
			if(tab_data.middle && tab_data.column)
			{
				row = tab_data.middle.length / tab_data.column;
				col = tab_data.column;
			} 
		}
		var drop1 = new CSectionView(form_view, header_data);

		var dropAreas = new CSectionViews(form_view, row, col, middle_data);
		var drop2 = new CSectionView(form_view, footer_data);


		var sortable_view = this.view.find('.middle_drop_area .drop_areas_sortable');
		sortable_view.attr('row', row);
		var sortable_view = this.view.find('.middle_drop_area .drop_areas_sortable');
		sortable_view.attr('col', col);
	}

	this.getRow = function()
	{
		var sortable_view = this.view.find('.middle_drop_area .drop_areas_sortable');
		return sortable_view.attr('row');
	}

	this.getCol = function()
	{
		var sortable_view = this.view.find('.middle_drop_area .drop_areas_sortable');
		return sortable_view.attr('col');
	}

	this.changeDropArea = function(new_rows, new_cols)
	{
		var sortable_view = this.view.find('.middle_drop_area .drop_areas_sortable');
		var num_rows = sortable_view.attr('row') * 1;
		var num_cols = sortable_view.attr('col') * 1;

		if(new_rows != num_rows)
		{
			if(new_rows > num_rows)
			{
				for(var col = 0; col < num_cols * (new_rows - num_rows); col++)
				{
					var drop = new CSectionView();
					var obj = sortable_view.append(drop.view);
				}
				var width 	 = "calc(" + (Math.floor(100 / new_cols)) + "%)";
				sortable_view.find(".actions_drop").css("width", width);
				var clearBoth = sortable_view.children('.clear_both');
				clearBoth.detach().appendTo(sortable_view);
			}
			else
			{
				for(var i = new_rows * num_cols; i < num_rows * num_cols; i++)
					sortable_view.children('.actions_drop').last().remove();
			}
			// var height = 102 * new_rows + 'px';
			// $('.middle_drop_area').css('height', height);
			sortable_view.attr('row', new_rows);
		}
		if(new_cols != num_cols)
		{
			if(new_cols > num_cols)
			{
				var objs = [];
				for(var row = 0; row < num_rows; row++)
					objs.push(sortable_view.children().eq(num_cols * (row + 1) - 1));
				for(var col = 0; col < new_cols - num_cols; col++)
				{
					for(var row = 0; row < num_rows; row++)
					{
						var drop = new CSectionView();
						objs[row].after(drop.view);
					}
				}
				objs = [];
			}
			else
			{
				var objs = [];
				for(var col = new_cols; col < num_cols; col++)
				{
					for(var row = 0; row < num_rows; row++)
						objs.push(sortable_view.children().eq(col + row * num_cols));
				}
				$.each(objs, function(index, value)
				{
					value.remove();
				})
			}
			var width 	 = "calc(" + (Math.floor(100 / new_cols)) + "%)";
			sortable_view.find(".actions_drop").css("width", width);
			sortable_view.attr('col', new_cols);
		}
	}

	this.init();
}




var CSectionViews = function(form_view, new_row, new_col, drops_data)
{
	var main = this;
	this.row = new_row;
	this.col = new_col;
	
	this.init = function()
	{
		var html =	'<section class="middle_drop_area">\
						<dl class="drop_areas_sortable" row="3" col="2"></dl>\
					</section>';
		this.view = $(html);


		for(var row = 0; row < new_row; row++)
		{
			for(var col = 0; col < new_col; col++)
			{
				var count = row * new_col + col;
				var data = null;
				if(drops_data)
					data = drops_data[count];
				var drop = new CSectionView(form_view, data);
				this.addDropArea(drop);
			}
		}
		if(form_view)
			form_view.append(this.view);

		var sortable_view = this.view.find('.drop_areas_sortable');
		sortable_view.append("<div class='clear_both'></div>");
		// sortable_view.sortable(sortoption_drops);

		this.reLayoutDrop();
	}

	this.addDropArea = function(dropArea)
	{
		var sortable_view = this.view.find('.drop_areas_sortable');
		sortable_view.append(dropArea.view);

	}

	this.drops = function()
	{
		return this.view.find('.actions_drop');
	}

	this.reLayoutDrop = function()
	{
		var width 	 = "calc(" + (Math.floor(100 / this.col)) + "%)";
		this.drops().css("width", width);
	}

	this.init();
}

var CSectionView = function(form_view, section_data)
{
	var main = this;
	this.view = null;
	this.init = function()
	{
		var html = 
			'<section class="actions_drop">\
				<dl class="sortable" row="1" col="1">\
					<dd><section class="drop_area disabled"><div class="border"><p class="placeholder">Drag & Drop Here</p></div></section></dd>\
					<div class="clear_both"></div>\
				</dl>\
				<div class="clear_both"></div>\
			</section>';
		this.view = $(html);
		if(form_view)
			form_view.append(this.view);
		createSectionData(this.view, section_data);
	}

	this.init();
}


var CSectionToolBar = function()
{
	var main = this;
	this.init = function()
	{
	}

	this.toolbar = function()
	{
		var toolbar = $('#comp_toolbar_section');
		if(toolbar.length == 0)
		{
			var html = '<div id="comp_toolbar_section" class="comp_toolbar">\
							<i class="fs-14 fa fa-cube" id="go_logic_section"></i>\
							<i class="fa fa-align-left" aria-hidden="true" id="justify_left"></i>\
							<i class="fa fa-align-center" aria-hidden="true" id="justify_center"></i>\
							<i class="fa fa-align-right" aria-hidden="true" id="justify_right"></i>\
							<i class="fa fa-trash" id="delete_section" aria-hidden="true"></i>\
						</div>';
			toolbar = $(html);
		}
		return toolbar;
	}

	this.show = function(section)
	{
		var toolbar = this.toolbar();
		// if(obj.length > 0)
		{
			// var firstDiv = section.find('dd').first().find('.compponent_div').first();
			// toolbar.appendTo(firstDiv);
			toolbar.appendTo(section);
			// if($(this).find('#component_toolbar').length == 0)
			{
				toolbar.show();
				section.css('background-color', '#FEFEBB');
			}
		}
	}

	this.hide = function()
	{
		var section = $('#comp_toolbar_section').closest('.actions_drop');
		if(section.length > 0)
		{
			section.css('background-color', 'transparent');
		}
		$('#comp_toolbar_section').hide();
		$('#comp_toolbar_section').appendTo('body');
	}

	this.init();
}

var CCompToolBar = function()
{
	var main = this;
	this.init = function()
	{
	}

	this.toolbar = function()
	{
		var toolbar = $('#component_toolbar');
		if(toolbar.length == 0)
		{
			var html = '<div id="component_toolbar" class="comp_toolbar">\
							<i class="fs-14 fa fa-cube" id="go_logic"></i>\
							<i class="fa fa-files-o" id="duplicate" aria-hidden="true"></i>\
							<i class="fa fa-arrows" id="move" aria-hidden="true"></i>\
							<i class="fa fa-trash" id="delete" aria-hidden="true"></i>\
						</div>';
			toolbar = $(html);
		}
		return toolbar;
	}

	this.show = function(comp_div)
	{
		var toolbar = this.toolbar();
		toolbar.appendTo(comp_div);

		var section = toolbar.closest('.compponent_div');
		var parent = toolbar.closest('.component_in');
		var pos = section.offset();
		toolbar.css('right', 0);
		toolbar.show();
	}

	this.hide = function()
	{
		$('#component_toolbar').hide();
		$('#component_toolbar').appendTo('body');
	}

	this.init();
}


var CDlgProperty = function()
{
	var main = this;
	this.components;

	this.init = function()
	{
		this.initEvents();
		this.initControls();
	}

	this.initControls = function()
	{
		$('.prop_colorpicker').kendoColorPicker(
		{
  			value: "#fff",
			buttons: false,
 			select: this.previewComponent
		});
		$('.prop_colorpallete').kendoColorPalette({
			columns: 5,
			tileSize: {
				width: 24,
				height: 16
			},
			palette: [
				"#e53935", "#d81b60", "#8e24aa", "#5e35b1", "#3949ab",
				"#1e88e5", "#039be5", "#00acc1", "#00897b", "#43a047",
				"#7cb342", "#c0ca33", "#fdd835", "#ffb300", "#fb8c00",
				"#f4511e", "#6d4c41", "#757575", "#546e7a"
			],
			change: this.previewComponent
		});

		$.each($('#font_list li'), function(index, obj)
		{
			var val = $(obj).children('input').val();
			$(obj).find('.content').css('font-family', val);
		});
	}

	this.initEvents = function()
	{
		$('#dlg_property #font_list li').click(function()
		{
			$('#font_list li').removeClass('active');
			$(this).addClass('active');
			var font = $(this).children('input').val();
			$('.prop_preview').css('font-family', font);
			// var comp = $('.prop_preview').find('.component_in').children().eq(2);
			// comp.css('font-family', font);
			$('#dlg_property').attr('_font', font);
		})

		$('#dlg_property #prop_dlg_ok').click(function()
		{
			var changedComp = $('.prop_preview').find('.compponent_div');

			var color_comp = $('#dlg_property').attr('_color_comp');
			var color_desc = $('#dlg_property').attr('_color_desc');
			var color_bg = $('#dlg_property').attr('_color_bg');
			var font = $('#dlg_property').attr('_font');

			var comps = main.components.find('.component_in');
			if(main.components.hasClass('actions_drop'))
			{
				$.each(comps, function(index, comp_in)
				{
					var comp = $(comp_in).children().eq(2);
					comp.css('background-color', color_comp);
				});
			}
			else if(main.components.hasClass('drop_area'))
			{
				var comp = comps.children().eq(2);
				comp.css('background-color', color_comp);
			}

			var span_desc = comps.find('.help_label');
			span_desc.css('color', color_desc);
			span_desc.css('font-family', font);
			comps.css('background-color', color_bg);
		})
	}

	this.previewComponent = function(e)
	{
		var id = e.sender.element.closest('.prop_color').prop('id');
		if(id == 'changecolor_comp')
		{
			var comp = $('.prop_preview').find('.component_in').children().eq(2);
			comp.css('background-color', e.value);
			$('#dlg_property').attr('_color_comp', e.value);
		}
		else if(id == 'changecolor_desc')
		{
			$('.prop_preview').find('.component_in').children('.help_label').css('color', e.value);
			$('#dlg_property').attr('_color_desc', e.value);
		}
		else if(id == 'changecolor_bg')
		{
			$('.prop_preview').css('background-color', e.value);
			$('#dlg_property').attr('_color_bg', e.value);
		}
	}

	this.show = function(component, components)
	{
		component.css('background-color', 'transparent');
		var comp_clone = component.clone();
		comp_clone.find('#component_toolbar').remove();
		comp_clone.find('#comp_toolbar_section').remove();

		$('#dlg_property').modal();
		var prop_preview = $('#dlg_property').find('.prop_preview');
		prop_preview.empty();
		prop_preview.append(comp_clone);

		this.components = components;
	}

	this.init();
}

var api_component = 
{
	getNewComponent: function(type)
	{
		var html = this.getComponentHTML(type);
		if(html)
		{
			// var drop_area = drop_obj.find('.drop_area');
			// var actions_drop = drop_area.closest('.actions_drop');
			var header_html =	
				'<div class="compponent_div">\
					<div class="component_in">'
			var footer_html =
					'<div>\
				</div>';
			var newComp = $(header_html + html + footer_html);
			newComp.hide();
			newComp.attr('_type', type);
			return newComp;
		}
		return null;
	},

	addNewComponent: function(section, type)
	{
		var sortable_view = section.find('.sortable');
		sortable_view.empty();
		sortable_view.css('display', 'inline-block');

		return this.pushComponent(section, type, true);
	},

	pushComponent: function(section, type, dropped)
	{
		var sortable_view = section.find('.sortable');
		var num = sortable_view.find('dd').length;
		if(num < 10)
		{
			sortable_view.css('width', 'auto');
			var newComp = this.getNewComponent(type);
			var newDD = $('<dd><section class="drop_area"></section></dd>');
			sortable_view.append(newDD);
			var newBox = newDD.find('.drop_area');
			newBox.append(newComp);
			var width = api_component.getCompWidth(type);
			newDD.css('width', width);
			// var width 	 = Math.floor(100 / (num + 1)) + "%";
			// sortable_view.find("dd").css("width", width);
			var clearBoth = sortable_view.children('.clear_both');
			clearBoth.detach().appendTo(sortable_view);
			sortable_view.attr('col', num + 1);
			var prop = {};
			prop.type = type;
			this.initComponent(newBox, prop);

			var comp_div_out = newBox.find('.compponent_div');
			var comp_div_in = newBox.find('.component_in');
			comp_div_in.css('min-width', width - 5);

			if(type == 'CKEditor')
			{
				comp_div_out.height(97 * 3);
				// comp_div_in.width(180);
			}
			if(type == 'Image')
			{
				comp_div_out.height(97 * 2);
				comp_div_in.width(180);
			}
			if(dropped)
				api_component.onResize(comp_div_out);
			newComp.hide();

			return newComp;
		}

		return null;
	},

	component_dropped: function(drag_obj, drop_obj)
	{
		var section = drop_obj;
		var type = drag_obj.prop('nodeName');
		var className = drag_obj.prop('class');

		if(type == 'LI' && drag_obj.hasClass('draggable-item'))
		{
			var text = drag_obj.prop('innerText');
			text = text.replace('\r\n', '');
			var comp_type = text.replace(' ', '');

			var newComp = null;

			var border = section.find('.border');
			if(border.length > 0)
				newComp = this.addNewComponent(section, comp_type);
			else
				newComp = this.pushComponent(section, comp_type, true);
			if(newComp)
				newComp.fadeIn();
		}
	},

	initComponent : function(obj, prop)
	{
		var type = prop.type;
		var color_comp = prop.color_comp;
		var color_desc = prop.color_desc;
		var color_bg = prop.color_bg;
		var font = prop.font;

		if(type == 'CheckBox')
		{
			var check = $('.checkbox label').addClass("_checkbox");
			check.css('left', '2px');
		}
		else if(type == 'Switches')
		{
			var obj = obj.find('.switchery');
			new Switchery(obj[0], {color: '#10CFBD'});
			// var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
			// // Success color: #10CFBD
			// elems.forEach(function(html) {
			// 	var switchery = new Switchery(html, {color: '#10CFBD'});
			// });
		}
		else if(type == 'Select')
		{
			var el = obj.find('.cs-select').get(0);
	    	$(el).wrap('<div class="cs-wrapper" style="width:140px"></div>');
	    	new SelectFx(el);
	    	// obj.find('.cs-select').val('Web-safe');
	    	obj.find('.cs-select').css('width', '100%');
		}
		else if(type == 'TextBox')
		{
			obj.find('input').first().focus();
		}
		else if(type == 'TimePicker')
		{
			obj.find("input[type='text']").timepicker();
		}
		else if(type == 'DatePicker')
		{
			obj.find('.date').datepicker();
		}
		else if(type == 'PhoneNumber')
		{
			obj.find("input[type='text']").mask('(999) 999-9999');
		}
		else if(type == 'DateInput')
		{
			obj.find("input[type='text']").mask('99/99/9999');
		}
		else if(type == 'Slider')
		{
			var slider = obj.find('.noUiSlider');
			if(slider.length > 0)
			{
				slider.css('min-width', '100px');
				slider.noUiSlider({
				    start: 40,
				    connect: "lower",
				    range: {
				    	'min': 0,
				    	'max': 100
					}
				});
			}
		}
		else if(type == 'DateRange')
		{
			obj.find('.input-daterange').datepicker();
		}
		else if(type == 'Image')
		{
			var imageObj = obj.find('.dropzone');
			imageObj.dropzone();
			// imageObj.find('.dz-default').hide();
		}
		else if(type == 'CKEditor')
		{
			var text = obj.find('.wysiwyg5');
			text.wysihtml5({
				"font-styles": 		true, //Font styling, e.g. h1, h2, etc. Default true
				"emphasis": 		true, //Italics, bold, etc. Default true
				"lists": 			false, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
				"html": 			false, //Button which allows you to edit the generated HTML. Default false
				"link": 			false, //Button to insert a link. Default true
				"image": 			false, //Button to insert an image. Default true,
				"color": 			false, //Button to change color of font  
				"blockquote": 		false, //Blockquote  
				"size": 			18, //default: none, other options are xs, sm, lg
			});
		}

		if(color_comp)
		{
			var comp = obj.find('.component_in').children().eq(2);
			comp.css('background-color', color_comp);
		}
		var span_desc = obj.find('.help_label');
		if(color_desc)
			span_desc.css('color', color_desc);
		if(font)
			span_desc.css('font-family', font);
		if(color_bg)
			obj.css('background-color', color_bg);
	},
	getComponentHTML: function(type)
	{
		var html = '';
		var label = '';
		if(type == 'Button')
		{
			label = '<span class="help_label">This is Button.</span><br>';
			html = '<button class="btn btn-primary btn-cons">Button</button>';
		}
		else if(type == 'CheckBox')
		{
			label = '<span class="help_label">Check Box</span><br>';
			html += '<div class="checkbox check-success  ">\
	    				<input type="checkbox" checked="checked" value="check2" id="checkbox2">\
	    				<label for="checkbox2">I agree</label>\
					</div>';
		}
		else if(type == 'Switches')
		{
			label = '<span class="help_label">Switch</span><br>';
			html += '<input type="checkbox" class="switchery" checked />';
		}
		else if(type == 'RadioButtons')
		{
			label = '<span class="help_label">Radio Button</span><br>';
			html += '<div class="radio radio-success">\
					    <input type="radio" checked="checked" value="yes" name="radio1" id="radio1Yes">\
					    <label for="radio1Yes">Agree</label>\
					    <input type="radio" value="no" name="radio1" id="radio1No">\
					    <label for="radio1No">Disagree</label>\
					</div>';
		}
		else if(type == 'Select')
		{
			label = '<span class="help_label">Dropdown List</span><br>';
			html +=	'<select class="cs-select cs-skin-slide" data-init-plugin="cs-select">\
			    		<option value="Web-safe">Text1.....</option>\
			    		<option value="Helvetica">Text2.....</option>\
			    		<option value="SegeoUI">Text3.....</option>\
					</select>';
		}
		else if(type == 'Slider')
		{
			label = '<span class="help_label">Slider</span><br>';
			html += '<div class="noUiSlider" class="bg-master"></div>';
		}
		else if(type == 'TextBox')
		{
			label = '<span class="help_label">Standard input elements</span><br>';
			html += '<input type="text" placeholder="Default input" class="form-control">';
		}
		else if(type == 'PhoneNumber')
		{
			label = '<span class="help_label">input phone number.</span><br>';
			html += '<input type="text" id="phone" class="form-control">';
		}
		else if(type == 'DateInput')
		{
			label = '<span class="help_label">input Date.</span><br>';
			html += '<input type="text" id="date" class="form-control">';
		}
		else if(type == 'TimePicker')
		{
			label = '<span class="help_label">Time picker</span><br>';
			html += '<div class="input-group bootstrap-timepicker">\
	                          <input id="timepicker" type="text" class="form-control">\
	                          <span class="input-group-addon"><i class="pg-clock"></i></span>\
	                        </div>';
		}
		else if(type == 'DatePicker')
		{
			label = '<span class="help_label">Date picker</span><br>';
			html += '<div id="myDatepicker" class="input-group date">';
	    	html += '<input type="text" class="form-control">';
	    	html += '<span class="input-group-addon"><i class="fa fa-calendar"></i></span></div>';
		}
		else if(type == 'DateRange')
		{
			label = '<span class="help_label">Date Range</span><br>';
	        html += '<div class="input-daterange input-group" id="datepicker-range">\
						<input type="text" class="input-sm form-control" name="start" />\
						<span class="input-group-addon">to</span>\
						<input type="text" class="input-sm form-control" name="end" />\
					</div>';
		}
		else if(type == 'TextArea')
		{
			label = '<span class="help_label">Multi line Text.</span><br>';
			html += '<textarea id="" class="" placeholder="Enter text ..." style="width:100%;height:60px"></textarea>';
		}
		else if(type == 'Image')
		{
			label = '<span class="help_label">Image upload</span><br>';
			html += '<form action="/file-upload" class="dropzone">\
					    <div class="fallback">\
					        <input name="file" type="file" multiple />\
					    </div>\
					</form>';
		}
		else if(type == 'CKEditor')
		{
			label = '<span class="help_label">CKEditor</span><br>';
			html += '<textarea class="wysiwyg5" class="wysiwyg" placeholder="Enter text ..." style="height:100px; width:100%"></textarea>';
		}
		else if(type == 'CharCounterTextBox')
		{
			// html += '<input id="#tagsinput" type="text" value="Amsterdam,Washington" data-role="tagsinput" />';
		}
		else if(type == 'ColorPicker')
		{
		}
		else if(type == 'SSN')
		{
		}
	    return label + html;
	},

	getCompWidth : function(type)
	{
		var width = 130;

		if(type == 'Button')
		{
			width = 130;
		}
		else if(type == 'CheckBox')
		{
			width = 90;//90;
		}
		else if(type == 'Switches')
		{
			width = 70;//60;
		}
		else if(type == 'RadioButtons')
		{
			width = 90;
		}
		else if(type == 'Select')
		{
			width = 150;
		}
		else if(type == 'Slider')
		{
			width = 130;//110;
		}
		else if(type == 'TextBox')
		{
			width = 160;
		}
		else if(type == 'PhoneNumber')
		{
			width = 150;
		}
		else if(type == 'DateInput')
		{
			width = 150;
		}
		else if(type == 'TimePicker')
		{
			width = 150;
		}
		else if(type == 'DatePicker')
		{
			width = 150;
		}
		else if(type == 'DateRange')
		{
			width = 130;
		}
		else if(type == 'TextArea')
		{
			width = 200;
		}
		else if(type == 'Image')
		{
			width = 190;
		}
		else if(type == 'CKEditor')
		{
			width = 180;
		}
		else if(type == 'CharCounterTextBox')
		{
			width = 200;
		}
		else if(type == 'ColorPicker')
		{
		}
		else if(type == 'SSN')
		{
		}
		return width;
	},
	onResize : function(newComp)
	{
		var comps = $('.compponent_div');
		$.each(comps, function(index, obj)
		{
			var comp = $(obj);
			var type = comp.attr('_type');
			var min_width = api_component.getCompWidth(type);
			var actions_drop = comp.closest('.actions_drop');
			var w = actions_drop.width();
			var ww = actions_drop.css('width');
			if(ww.indexOf('%') >= 0)
			{
				var parentWidth = actions_drop.offsetParent().width();
				w = parentWidth * w / 100;
			}
			nCol = comp.closest('dl').attr('col');

			var dls = actions_drop.find('dd');
			var curDlIndex = comp.closest('dd').index();
			var left = 0;
			$.each(dls, function(k, obj)
			{
				if(k < curDlIndex)
					left += $(obj).width();
			})
			if(w < left + min_width)
			{
				comp.hide();
			}
			else
			{
				comp.show();
			}

			if(type == 'CKEditor')
			{
				var dd = comp.closest('dd');
				var comp_in = comp.find('.component_in')
				if(nCol == 1)
				{
					dd.width(w);
					comp_in.width(w - 5);
				}
				else
				{
					dd.width(min_width);
					comp_in.css('width', 'auto');
				}
			}
		})

		if(newComp)
		{
			var type = newComp.attr('_type');
			if(type == 'CKEditor' || type == 'Image')
			{
				var middle = newComp.closest('.middle_drop_area');
				if(middle.length > 0)
				{
					var dl = middle.children('dl').first();
					var nCol = dl.attr('col');
					var nRow = dl.attr('row');
					var curSection = newComp.closest('.actions_drop');
					var curIndex = curSection.index();
					var row = Math.floor(curIndex / nCol);
					var max_height = 0;
					for(var col = 0; col < nCol; col++)
					{
						var section = dl.children('.actions_drop').eq(row * nCol + col);
						if(section.height() > max_height)
							max_height = section.height();
					}
					var h = newComp.height();
					if(h > max_height)
						max_height = h;
					for(var col = 0; col < nCol; col++)
					{
						var section = dl.children('.actions_drop').eq(row * nCol + col);
						section.height(max_height);
					}
				}
			}
		}
		else
		{
			$.each($('.middle_drop_area'), function(index, obj)
			{
				var middle = $(obj);
				var dl = middle.children('dl').first();
				var nCol = dl.attr('col');
				var nRow = dl.attr('row');
				if(!nCol)
				{
					nCol = middle.attr('col');
					nRow = middle.attr('row');
					dl = middle;
				}
				for(var row = 0; row < nRow; row++)
				{
					var max_height = 97;
					for(var col = 0; col < nCol; col++)
					{
						var curSection = dl.children('.actions_drop').eq(row * nCol + col);
						if(curSection.height() > max_height)
							max_height = curSection.height();
					}
					for(var col = 0; col < nCol; col++)
					{
						var curSection = dl.children('.actions_drop').eq(row * nCol + col);
						curSection.height(max_height);
					}
				}
			})
		}
	},
	onResizeWhenRemove : function(curSection)
	{
		var middle = curSection.closest('.middle_drop_area');
		if(middle.length > 0)
		{
			var dl = middle.children('dl').first();
			var nCol = dl.attr('col');
			var nRow = dl.attr('row');
			var curIndex = curSection.index();
			var row = Math.floor(curIndex / nCol);
			var max_height = 0;
			for(var col = 0; col < nCol; col++)
			{
				var section = dl.children('.actions_drop').eq(row * nCol + col);
				var dll = section.children('dl').first();
				if(dll.height() > max_height)
					max_height = dll.height();
			}
			for(var col = 0; col < nCol; col++)
			{
				var section = dl.children('.actions_drop').eq(row * nCol + col);
				section.height(max_height);
			}
		}
	}
}



function createSectionData(section, section_data)
{	
	var success = true;
	if(section_data && section_data.props.length > 0)
	{
		section.empty();
		section.append('<dl class="sortable" row="1" col="' + section_data.props.length + '"></dl>');
		var sortable_view = section.find('dl');

		if(section_data.justify == 'left')
		{
			sortable_view.css('float', 'left');
			sortable_view.attr('justify', 'left');
		}
		else if(section_data.justify == 'right')
		{
			sortable_view.css('float', 'right');
			sortable_view.attr('justify', 'right');
		}
		else if(section_data.justify == 'center')
		{
			sortable_view.css('float', 'none');
			sortable_view.css('display', 'inline-block')
			sortable_view.attr('justify', 'center');
		}
		else
		{
			sortable_view.css('float', 'none');
			sortable_view.css('display', 'inline-block')
		}

		$.each(section_data.props, function(index, prop)
		{
			var comp_type = prop.type;
			if(!comp_type)
			{
				success = false;
			}
			else
			{
				var newComp = api_component.pushComponent(section, comp_type);
				newComp.show();
			}
		});
		// var width 	 = Math.floor(100 / section_data.props.length) + "%";
		// section.find('dd').css('width', width);
		section.append('<div class="clear_both"></div>');
	}
	else
	{
		success = false;
	}

	if(!success)
	{
		section.empty();
		var html = '\
			<dl class="sortable" row="1" col="1">\
				<dd><section class="drop_area disabled"><div class="border"><p class="placeholder">Drag & Drop Here</p></div></section></dd>\
			</dl>\
			<div class="clear_both"></div>';
		section.append(html);
	}

	section.droppable({
		drop: function(event, ui)
		{
			var draggable = ui.draggable;
			// draggable.clone().appendTo(droppable);
			api_component.component_dropped($(draggable), $(this));
		}
	});
}