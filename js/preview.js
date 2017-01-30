

$(document).ready(function()
{
	mainView 	= new classMain();
});



var classMain 	= function()
{
	var main 				= this;
	// this.selectedDropArea	= null;
	// var m_TabView 			= new CTabManager();

	// var m_Toolbar_section 	= new CSectionToolBar();
	// var m_Toolbar_component	= new CCompToolBar();
	// var m_Dlg_Property		= new CDlgProperty();

	this.init 			= function()
	{
		this.initForm();
		api_component.onResize();
	}

	$(window).resize(function(e)
	{
		api_component.onResize();
	})


	this.createSection = function(section, json)
	{
		if(json && json.props && json.props.length > 0)
		{
			section.empty();
			section.append('<dl></dl>');
			var dl = section.find('dl');
			if(json.justify == 'left')
			{
				dl.css('float', 'left');
			}
			else if(json.justify == 'right')
			{
				dl.css('float', 'right');
			}
			else if(json.justify == 'center')
			{
				dl.css('float', 'none');
				dl.css('display', 'inline-block');
			}
			else
			{
				dl.css('float', 'none');
				dl.css('display', 'inline-block');
			}

			$.each(json.props, function(index, prop)
			{
				var comp_type = prop.type;

				var html = api_component.getComponentHTML(comp_type);
				var header_html = 
					'<dd>\
						<section class="drop_area">\
							<div class="compponent_div">\
								<div class="component_in">'
				var footer_html =
								'</div>\
							</div>\
						</section>\
					</dd>';
				var newComp = $(header_html + html + footer_html);
				dl.append(newComp);
				api_component.initComponent(newComp, prop);
				var comp_div_out = newComp.find('.compponent_div');
				if(comp_type == 'CKEditor')
				{
					var comp_div_in = newComp.find('.component_in');
					comp_div_out.height(97 * 3);
					comp_div_in.width(180);
				}
				else if(comp_type == 'Image')
				{
					var comp_div_in = newComp.find('.component_in');
					comp_div_out.height(97 * 2);
					comp_div_in.width(150);
				}
				newComp.find('.compponent_div').attr('_type', comp_type);
				var width = api_component.getCompWidth(comp_type);
				newComp.css('width', width);
				newComp.find('.component_in').css('min-width', width - 5);
				comp_div_out.show();
			});
			// var width 	 = Math.floor(100 / json.props.length) + "%";
			// dl.find('dd').css('width', width);
			dl.append('<div class="clear_both"></div>');
			dl.attr('col', json.props.length);
		}
	}

	this.createTab = function(json)
	{
		var tabs = $('#form_tab');
		tabs.empty();
		var tab_views = $('#form_tabview');
		tab_views.empty();

		$.each(json, function(index, obj)
		{
			var html = '<li>\
							<a data-toggle="tab" href="#tab' + index + '"><span>' + obj.tab_name + '</span></a>\
						</li>';
			tabs.append(html);

			var tabview_html = '<div class="tab-pane slide" id="tab' + index + '">\
							<div class="form_view">\
								<section class="actions_drop">\
								</section>\
								<section class="middle_drop_area">\
								</section>\
								<div class="clear_both"></div>\
								<section class="actions_drop">\
								</section>\
							</div>\
						</div>';
			var tab_view = $(tabview_html);
			tab_views.append(tab_view);
			
			var header = tab_view.find('section').first();
			main.createSection(header, obj.header);
			var footer = tab_view.find('section').last();
			main.createSection(footer, obj.footer);

			var middle = tab_view.find('.middle_drop_area');
			$.each(obj.middle, function(index, json_section)
			{
				var htm = '<section class="actions_drop"></section>';
				var section = $(htm);
				middle.append(section);
				main.createSection(section, json_section);
			});
			var width 	 = Math.floor(100 / obj.column) + "%";
			middle.find('.actions_drop').css('width', width);
			middle.attr('col', obj.column);
			middle.attr('row', obj.middle.length / obj.column);
		});
		tabs.children('li').first().addClass('active');
		tab_views.children('.tab-pane').first().addClass('active');
	}

	this.initForm	 	= function()
	{
		var json = JSON.parse(localStorage.getItem('built_form'));
		if(json)
		{
			this.createSection($('#first_drop_area'), json.first_section);
			this.createTab(json.tabs);
		}
	}

	main.init();
}
