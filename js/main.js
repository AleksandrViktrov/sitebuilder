

$(document).ready(function()
{
	mainView 	= new classMain();
});


var html_empty_drop = '<dd><section class="drop_area disabled"><div class="border"><p class="placeholder">Drag & Drop Here</p></div></section></dd><div class="clear_both"></div>';

var sortable_option = 
{
	handle:			"#component_toolbar",
	cancel:			".disabled, :input, button, .dropzone, textarea",
	connectWith: 	".column",
	start: function(e, ui)
	{
		var sortable = $(e.target).closest('.sortable');
		var new_cols = sortable.attr('col') * 1;
		ui.item.width($(e.target).width() / new_cols);
		ui.placeholder.width($(e.target).width() / new_cols);
		ui.placeholder.css('height', '97px !important');
	}
};
var sortoption_drops = 
{
	handle:			".compponent_div",
	cancel:			".disabled",
	// connectWith: 	".column",
	start: function(e, ui)
	{
		var sortable = $(e.target).closest('.drop_areas_sortable');
		var new_cols = sortable.attr('col') * 1;
		ui.item.width($(e.target).width() / new_cols);
		ui.placeholder.width($(e.target).width() / new_cols);
		ui.placeholder.css('height', '97px !important');
	}
};

var classMain 	= function()
{
	var main 				= this;
	this.selectedDropArea	= null;
	var formData = JSON.parse(localStorage.getItem('built_form'));
	// localStorage.setItem('built_form', null);
	var first_data = null;
	if(formData)
		first_data = formData.first_section;
	createSectionData($('#first_drop_area'), first_data);

	var m_TabView 			= new CTabManager(formData);

	var m_Toolbar_section 	= new CSectionToolBar();
	var m_Toolbar_component	= new CCompToolBar();
	var m_Dlg_Property		= new CDlgProperty();

	this.init 			= function()
	{		
		this.initForm();
		this.initEvents();
		this.initControls();

		// $('#first_drop_area').find('.drop_area').droppable({
		// 	drop: function(event, ui)
		// 	{
		// 		var draggable = ui.draggable;
		// 		// draggable.clone().appendTo(droppable);
		// 		api_component.component_dropped($(draggable), $(this));
		// 	}
		// });
		//testing____
		// $("#overlay").css("display", "none");
		// $("#over_overlay").css("display", "none");
		// $("#form_builder").fadeIn();
		api_component.onResize();
	}

	this.initControls = function()
	{
	}

	main.initEvents = function()
	{
		$(".new_form").click(function()
		{
			$("#overlay_new").css("display", "block");
			$("#overlay_scratch").animate({top : "0px"});
			$("#overlay_template").animate({top : "50%"});
		});

		$("#overlay_new").on("mouseleave", function()
		{
			$("#overlay_scratch").animate({top : "-50%"});
			$("#overlay_template").animate({top : "100%"});
		});

		$("#overlay_scratch").click(function()
		{
			$("#overlay").css("display", "block");
			$("#over_overlay").fadeIn();
		});

		$("#overlay_newform").click(function(evt)
		{
			evt.stopPropagation();
		});

		$("#over_overlay").click(function()
		{
			$("#overlay").css("display", "none");
			$("#over_overlay").css("display", "none");
		});

		$("#btn_start").click(function()
		{
			$("#overlay").css("display", "none");
			$("#over_overlay").css("display", "none");
			$("#form_builder").fadeIn();
		});

		$("#change_tbl").click(function()
		{
			var row = m_TabView.getRow();
			var col = m_TabView.getCol();
			$('#txt_rows').val(row);
			$('#txt_cols').val(col);
			$("#mini-popup").toggle();
		});

		$("#txt_rows").on("change", function()
		{
			var new_rows = $(this).val() * 1;
			var new_cols = $(txt_cols).val() * 1;
			main.change_dropArea(new_rows, new_cols);
		});

		$("#txt_cols").on("change", function()
		{
			var new_rows = $(txt_rows).val() * 1;
			var new_cols = $(this).val() * 1;

			var max_num_col = Math.floor($('#form_tabview').width() / 210);
			if(new_cols <= max_num_col)
				main.change_dropArea(new_rows, new_cols);
			else
				$(this).val(max_num_col);
		});

		$('#btn_change_tbl').click(function()
		{
			$("#mini-popup").toggle();
		});

		$('.draggable-item').draggable(
		{
			revert: "invalid",
			stack: ".draggable",        
	        helper: "clone",
	        opacity: 0.55,
	        zIndex: 100
	    });

		$('#form_right').on('mousemove', '.actions_drop', function(e)
		{
			var component_in = $(e.target).closest('.component_in');
			if(component_in.length > 0)
			{
				// m_Toolbar_component.show(component_in);
				// m_Toolbar_section.hide();
			}
			else
			{
				m_Toolbar_component.hide();
				if($(e.target).hasClass('compponent_div') || $(e.target).hasClass('actions_drop'))
				{
					if($(this).find('.border').length == 0)
						m_Toolbar_section.show($(this));
				}
			}
		});

		// $('#form_right').on('mouseenter', '.actions_drop', function(e)
		// {
		// 	//if($(e.target).hasClass('compponent_div'))
		// 		m_Toolbar_section.show($(this));
		// });
		$('#form_right').on('mouseleave', '.actions_drop', function(e)
		{
			m_Toolbar_section.hide();
			m_Toolbar_component.hide();
			// var drops = $(this).find('.drop_area').css('z-index', 0);
		});

		// $('#form_right').on('mouseenter', '.drop_area', function(e)
		// {
		// 	var dd = $(this).closest('dd');
		// 	if(dd.index() == 0)
		// 		$(this).css('z-index', 10000);
		// 	else
		// 		$(this).css('z-index', 1000);
		// });
		// $('#form_right').on('mouseleave', '.drop_area', function(e)
		// {
		// 	var dd = $(this).closest('dd');
		// 	if(dd.index() > 0)
		// 		$(this).css('z-index', 100);
		// });

		$('#form_right').on('mouseenter', '.component_in', function(e)
		{
			m_Toolbar_component.show($(this));
			m_Toolbar_section.hide();
		});
		// $('#form_right').on('mouseleave', '.component_in', function(e)
		// {
		// 	var isHover = $('#component_toolbar').hasClass('_hover');
		// 	if(isHover == 0)
		// 	{
		// 		m_Toolbar_component.hide();
		// 		var obj = $(this).closest('.actions_drop');
		// 		if(obj.length > 0)
		// 		{
		// 			// m_Toolbar_section.show(obj);
		// 		}
		// 	}
		// });

		// $('#form_right').on('mouseenter', '#component_toolbar', function(e)	
		// {
		// 	$('#component_toolbar').addClass('_hover');
		// });		
		// $('#form_right').on('mouseleave', '#component_toolbar', function(e)	
		// {
		// 	$('#component_toolbar').removeClass('_hover');
		// });

		$('#form_right').on('click', '.comp_toolbar', function(e)
		{
			main.onClick_component_toolbar(e);
		});

		$('#form_header li').click(function(e)
		{
			main.onSaveData();
		});
		$('#tab_myform').click(function(e)
		{
			
		});
		$('#sub-nav').on('click', 'li', function(e)
		{
			var li = e.target.closest('li');
			if(li.id == 'tab_mine')
			{
				$('#btn_suggest_widget').hide();
				$('#btn_new_form').show();
			}
			else if(li.id == 'tab_myform')
			{
				$('#btn_suggest_widget').show();
				$('#btn_new_form').hide();
			}
			else if(li.id == 'btn_new_form')
			{
				$('#dlg_create_form').modal();
			}
			else
			{
				$('#btn_suggest_widget').show();
				$('#btn_new_form').hide();
			}
		});
		// $('#myform_list').on('click', '.myform_section', function(e)
		// {
		// 	window.location.href = 'myform.html?mode=build';
		// })
		// $('#form_templates').on('click', '.widget-item', function(e)
		// {
		// 	window.location.href = 'myform.html?mode=build';
		// 	e.stopPropagation();
		// })
		$('#dlg_create_form #prop_dlg_ok').click(function()
		{
			window.location.href = 'myform.html?mode=build';
			var form_name = $('#txt_form_name').val();
			localStorage.setItem('create_form_name', form_name);
			localStorage.setItem('built_form', null);
		});
	}

	main.initForm	 	= function()
	{
		var param = getURLParameter("mode");
		if(param == 'build')
		{
			$("#form_list").css("display", "none");
			$("#form_builder").css("display", "block");
		    $(".sortable").sortable(sortable_option);
		    $(".drop_areas_sortable").sortable(sortoption_drops);
		}
		else
		{
			$("#form_builder").css("display", "none");
			$('#btn_suggest_widget').show();
			$('#btn_new_form').hide();
			// $('#form_templates').hide();

			var data_myform = 
			[
				{
					category: "MyForm",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "My Form1",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
				{
					category: "MyForm",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "My Form2",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
				{
					category: "MyForm",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "My Form3",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
				{
					category: "MINE",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "MINE1",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
				{
					category: "MINE",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "MINE2",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
				{
					category: "MINE",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "MINE3",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
				{
					category: "MINE",
					createdAt: "2016-11-21T06:11:06.894Z",
					description: "My Form",
					height: 0,
					id: "56a9b0fad458528b1bb22474",
					path: "preview_thumbnail.html",
					tags: [
						"graph, sales, stats",
						],
					thumbnail: "assets/img/thumbnail_myform.jpg",
					title: "MINE4",
					updatedAt: "2016-11-21T06:11:06.894Z",
					width: "col-sm-5 col-sm-offset-4",
				},
			];


			// var categories = data.categories;
			var widgetElements = '';

			for (var i in data_myform) {
			    var widget = data_myform[i];
			    var category = widget['category'];
			    var tagClasses = widget['tags'][0].split(',').join(' ');

			    var newItem = '<!-- START WIDGET ITEM --> \
			        <div class="widget-item '+ ['category-',category].join('') + ' b-a b-grey bg-master-lightest" data-width="1" data-height="1" \
			        data-createdat="' + widget['createdAt'] + '" \
			        data-description="' + widget['description'] + '" \
			        data-category="' + widget['category'] + '" \
			        data-wheight="' + widget['height'] + '" \
			        data-wwidth="' + widget['width'] + '" \
			        data-id="' + widget['id'] + '" \
			        data-path="' + widget['path'] + '" \
			        data-tags="' + '' + '" \
			        data-thumbnail="' + widget['thumbnail'] + '" \
			        data-title="' + widget['title'] + '" \
			        style="background-image:url('+ widget['thumbnail'] + ')"> \
			            <!-- START ITEM OVERLAY DESCRIPTION --> \
			            <div class="overlayer widget-detail bottom-left full-width"> \
			                <img src="assets/img/wm-logo.svg" class="wm-logo"> \
			                <div class="overlayer-wrapper item-info"> \
			                    <div class="p-l-20 p-r-20 p-t-20 p-b-5"> \
			                        <div class="item-footer"> \
			                            <h5 class="text-center text-white semi-bold m-b-0">' + widget['title'] + '</h5> \
			                            <p class="fs-12 text-white text-center"><span class="hint-text">Added on </span>'+ moment(widget['createdAt']).format("D MMM YYYY") + '</p> \
			                            <div class="clearfix"></div> \
			                        </div> \
			                    </div> \
			                </div> \
			            </div> \
			            <!-- END PRODUCT OVERLAY DESCRIPTION --> \
			            <p style="font-size:0">'+category+' '+tagClasses+'</p> \
			        </div> \
			        <!-- END WIDGET ITEM -->';
			    widgetElements += newItem;
			}

			var allItems = $(widgetElements).appendTo('.widgets-container');
			// $("#tab_myform").trigger('click');
		}
	}

	this.onClick_component_toolbar = function(e)
	{
		if(e.target.id == 'go_logic')
		{
			var component = $(e.target).closest('.compponent_div');
			var dropArea = component.closest('.drop_area');
			m_Dlg_Property.show(component, dropArea);
			e.stopPropagation();
		}
		else if(e.target.id == 'go_logic_section')
		{
			var section = $(e.target).closest('.actions_drop');
			var component = section.find('.compponent_div').first();
			m_Dlg_Property.show(component, section);
			e.stopPropagation();
		}
		else if(e.target.id == 'duplicate')
		{
			this.onDuplicateComponent(e.target);
			e.stopPropagation();
		}
		else if(e.target.id == 'move')
		{
		}
		else if(e.target.id == 'delete_section')
		{
			var section = $(e.target).closest('.actions_drop');
			if(section.length > 0)
			{
				$('#comp_toolbar_section').appendTo('body');
				$('#comp_toolbar_section').hide();
				section.css('background-color', 'transparent');
				this.clear_section(section);
				api_component.onResizeWhenRemove(section);
			}
			e.stopPropagation();
		}
		else if(e.target.id == 'delete')
		{
			var section = $(e.target).closest('.actions_drop');
			if(section.length > 0)
			{
				var num = section.find('dd').length
				if(num == 1)
				{
					this.clear_section(section);
				}
				else
				{
					var obj = $(e.target).closest('dd');
					$('#component_toolbar').appendTo('body');
					$('#component_toolbar').hide();
					obj.remove();
					num = section.find('dd').length;
					// var width 	 = Math.floor(100 / num) + "%";
					// actions_drop.find("dd").css("width", width);
					section.children('.sortable').attr('col', num);
				}
				api_component.onResizeWhenRemove(section);
			}
			else
			{
				// var obj = $(e.target).closest('.drop_area');
				// this.clear_section(obj);
			}
			e.stopPropagation();
		}
		else if(e.target.id == 'justify_left')
		{
			var sortable_view = $(e.target).closest('.actions_drop').find('.sortable');
			sortable_view.css('float', 'left');
			sortable_view.attr('justify', 'left');
			// sortable_view.css('margin', '0px 0px');
			var dds = sortable_view.find('dd');
			$.each(dds, function(index, obj)
			{
				var dd = $(obj);
				var type = dd.find('.compponent_div').attr('_type');
				var width = api_component.getCompWidth(type);
				dd.css('width', width);
			})
		}
		else if(e.target.id == 'justify_center')
		{
			var sortable_view = $(e.target).closest('.actions_drop').find('.sortable');
			sortable_view.attr('justify', 'center');
			sortable_view.css('float', 'none');
			// var dds = sortable_view.find('dd');
			// var new_cols = sortable_view.attr('col') * 1;
			// dds.css('width', "calc(" + (Math.floor(100 / new_cols)) + "%)");
			sortable_view.css('display', 'inline-block');
			// sortable_view.css('margin', '-1px 0px');
		}
		else if(e.target.id == 'justify_right')
		{
			var sortable_view = $(e.target).closest('.actions_drop').find('.sortable');
			sortable_view.attr('justify', 'right');
			sortable_view.css('float', 'right');
			var dds = sortable_view.find('dd');
			$.each(dds, function(index, obj)
			{
				var dd = $(obj);
				var type = dd.find('.compponent_div').attr('_type');
				var width = api_component.getCompWidth(type);
				dd.css('width', width);
			})
			// sortable_view.css('padding', '4px 0px');
		}
	};

	this.change_dropArea = function(new_rows, new_cols)
	{
		if(new_rows < 1)
			return;
		if(new_cols < 1)
			return;

		m_TabView.changeDropArea(new_rows, new_cols);
		// main.initDropEvent();
	}

	this.getCompsFromSection = function(section)
	{
		var json = {};
		var justify = section.find('.sortable').attr('justify');
		json.justify = justify;
		json.props = [];
		var divs = section.find('.compponent_div');
		if(divs.length == 0)
			return null;

		$.each(divs, function(index, comp)
		{
			var component = $(comp);
			var type = component.attr('_type');

			var comp = component.find('.component_in').children().eq(2);
			var color_comp = comp.css('background-color');
			var comp_desc = component.find('.component_in').children('.help_label');
			var color_desc = comp_desc.css('color');
			var color_bg = component.css('background-color');

			var prop = {};
			prop.type = type;
			prop.color_comp = color_comp;
			prop.color_desc = color_desc;
			prop.color_bg = color_bg;
			prop.font = comp_desc.css('font-family');
			json.props.push(prop);
		});
		return json;
	}

	this.onSaveData = function()
	{
		var json = {};

		json.first_section = this.getCompsFromSection($('#first_drop_area'));

		json.tabs = [];
		var tab_items = $('#form_tab').children('li').find('span');
		$.each(m_TabView.tabViews, function(index, tabView)
		{
			if(index < tab_items.length)
			{
				var tab_json = {};
				tab_json.tab_name = $(tab_items[index]).text();

				var formview = tabView.view.find('.form_view');
				var header = formview.children('section').first();
				tab_json.header = main.getCompsFromSection(header);
				var footer = formview.children('section').last();
				tab_json.footer = main.getCompsFromSection(footer);

				var middle = [];
				var middle_views = formview.children('.middle_drop_area');
				var middle_sections = middle_views.find('.actions_drop');
				$.each(middle_sections, function(index, section)
				{
					middle.push(main.getCompsFromSection($(section)));
				});
				tab_json.middle = middle;
				tab_json.column = middle_views.find('.drop_areas_sortable').attr('col');

				json.tabs.push(tab_json);
			}
		});

		var str = JSON.stringify(json);
		localStorage.setItem('built_form', str);
	}

	main.init();
}

function getURLParameter(name)
{
	return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

classMain.prototype.clear_section = function(section)
{
	$('#component_toolbar').appendTo('body');
	$('#component_toolbar').hide();
	// obj.children().first().remove();
	var sortable_view = section.find('.sortable');
	sortable_view.empty();
	sortable_view.append(html_empty_drop);
	sortable_view.find('.border').addClass('disabled');
	// $('.sortable').disableSelection();
	// obj.find('.compponent_div').remove();
	section.find('dd').css('width', '100%');
	section.find('dl').css('width', '100%');
}

classMain.prototype.onMouseDown_component_toolbar = function(e)
{
	if(e.target.id == 'move')
	{
		// var section = $(e.target).closest('.actions_drop');
		// section.children('.sortable').addClass('disabled');
	}
	else
	{
		e.stopPropagation();
	}
}

classMain.prototype.onDuplicateComponent = function(obj)
{
	var section = $(obj).closest('.actions_drop');
	var curDD = $(obj).closest('dd');
	if(section.length > 0)
	{
		var sortable_view = curDD.closest('.sortable');
		var num = sortable_view.find('dd').length;
		if(num < 10)
		{
			$('#component_toolbar').appendTo('body');
			var newDrop = curDD.clone();
			curDD.after(newDrop);
			// var width 	 = Math.floor(100 / (num + 1)) + "%";
			// sortable_view.find("dd").css("width", width);
			var clearBoth = sortable_view.children('.clear_both');
			clearBoth.detach().appendTo(sortable_view);
			sortable_view.attr('col', num + 1);
		}
	}
}
