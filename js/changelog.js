$(document).ready(function()
{
	var main 	= new classMain();
});

var classMain 	= function()
{
	var main 				= this;
	this.table				= null;

	this.init 			= function()
	{
		this.initControls();
		this.initEvents();
	}

	this.initControls = function()
	{
		this.table = $('#myDataTable').dataTable(
		{
		    "sDom": 			"<'table-responsive't><'row'<p i>>",
		    "sPaginationType": 	"bootstrap",
		    "destroy": 			true,
		    "scrollCollapse": 	false,
		    "iDisplayLength": 	5,
		    "searching": 		true,
		    "oLanguage":
		    {
		        "sLengthMenu": "_MENU_ ",
		        "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
		    },
		});
	}

	this.initEvents = function()
	{
		$('#prop_dlg_ok').click(function() {
		    $('#myDataTable').dataTable().fnAddData([
		        "Foo",
		        "Bar"
		    ]);			
		})

		$('#search_table').on( 'keyup', function () {
			main.table.fnFilter($(this).val());
		} );
	}

	this.init();
};
