$(document).ready(function()
{
	var main 	= new classMain();
});

var classMain 	= function()
{
	var main 				= this;
	this.table_group 		= null;
	this.table_groupBI 		= null;

	this.init 			= function()
	{
		this.initControls();
		this.initEvents();

	}

	this.initControls = function()
	{
		main.table_group = $('#datatable_group').dataTable(
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
			"aoColumnDefs":
			[
				{ "bSortable": false, 'aTargets': [1] },
				{ "bSortable": false, 'aTargets': [3] },
			],
		});

		main.table_groupBI = $('#datatable_groupBI').dataTable(
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
			"aoColumnDefs": [
				{ "bSortable": false, 'aTargets': [1] },
				{ "bSortable": false, 'aTargets': [5] },
			],
		});
	}

	this.initEvents = function()
	{
		$('#add_user').click(function()
		{
			$('#create_user_dlg').modal();
		});

		$('#create_user_dlg #prop_dlg_ok').click(function()
		{
		    $('#myDataTable').DataTable().fnAddData([
		        "Foo",
		        "Bar"
		    ]);			
		})

		$('#search_table').on('keyup', function()
		{
			main.table_group.fnFilter($(this).val(), 0);
		});

		// $('#myDataTable tbody').on( 'click', 'tr', function () {
  //       if ( $(this).hasClass('selected') ) {
  //           $(this).removeClass('selected');
  //       }
  //       else {
  //           main.table.$('tr.selected').removeClass('selected');
  //           $(this).addClass('selected');
  //       }
  //   	});
		$('#datatable_group tbody').on( 'click', 'td', function(e)
		{
			//$(this).toggleClass('selected');
			if($(this).index() == 0)
			{
				$('#_group_form').hide();
				$('#_BI_group_form').fadeIn();
			}
		});

		// $('#button').click( function () {
		// 	alert( table.rows('.selected').data().length +' row(s) selected' );
		// });

		$('#btn_create_group').click(function()
		{
			$('#dlg_create_group').modal();
		})
		$('#btn_edit_group').click(function()
		{
			$('#dlg_edit_group').modal();
		})
		$('#btn_add_group').click(function()
		{
			$('#dlg_add_group').modal();
		})
	}

	this.onClickMenuItem = function(index)
	{
		index = 1;
	}

	this.init();
};

show_dropmenu = function() {
	document.getElementById("myDropdown").classList.toggle("show");
}