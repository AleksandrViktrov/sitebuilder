$(document).ready(function()
{
	var main 	= new classMain();
});

var classMain 	= function()
{
	var main 				= this;

	this.init 			= function()
	{
		this.initControls();
		this.initEvents();
	}

	this.initControls = function()
	{
		var form_name = localStorage.getItem('create_form_name');
		var text = $('#_form_name');
		text.val(form_name);

		$('#select_languge').val('item_6');

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
		$('#select_font').val('item_1');
	}

	this.initEvents = function()
	{
	}

	this.init();
};
