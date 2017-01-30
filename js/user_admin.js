$(document).ready(function()
{
	var main 	= new classMain();
});

var classMain 	= function()
{
	var main 				= this;
	this.table_users		= null;
	this.table_group		= null;

	this.init 			= function()
	{
		this.initControls();
		this.initEvents();

	}

	this.initControls = function()
	{
		main.table_group = $('#table_users').dataTable(
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
				{ "bSortable": false, 'aTargets': [4] },
			],
		});

		main.table_group = $('#table_group').dataTable(
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
	}

	this.initEvents = function()
	{
		$('#add_user').click(function() {
			$('#create_user_dlg').modal();
		});

		$('#create_user_dlg #prop_dlg_ok').click(function() {
		    $('#myDataTable').dataTable().fnAddData([
		        "Foo",
		        "Bar"
		    ]);			
		})

		$('#_search_table').on('keyup', function()
		{
			main.table.fnFilter($(this).val(), 0);
		});

		/* When the user clicks on the button, 
		toggle between hiding and showing the dropdown content */

		// Close the dropdown menu if the user clicks outside of it
		window.onclick = function(event)
		{
			if (!event.target.matches('._dropbtn'))
			{
				var dropdowns = document.getElementsByClassName("_dropdown-content");
				var i;
				for (i = 0; i < dropdowns.length; i++)
				{
					var openDropdown = dropdowns[i];
					if (openDropdown.classList.contains('show'))
					{
						openDropdown.classList.remove('show');
					}
				}
				var item = $(event.target).closest('._dropmenu_item');
				main.onClickMenuItem(item.attr('id'));
			}
		}

		// $('#myDataTable tbody').on( 'click', 'tr', function () {
  //       if ( $(this).hasClass('selected') ) {
  //           $(this).removeClass('selected');
  //       }
  //       else {
  //           main.table.$('tr.selected').removeClass('selected');
  //           $(this).addClass('selected');
  //       }
  //   	});
		$('#table_users tbody').on( 'click', 'td', function (e) {
			//$(this).toggleClass('selected');
			if($(this).index() == 0)
			{
				$('#_form_users').hide();
				$('#_form_group').fadeIn();
			}
		});

		// $('#button').click( function () {
		// 	alert( table.rows('.selected').data().length +' row(s) selected' );
		// });

		$('#_create_user').click(function()
		{
			$('#create_user_dlg').modal();
		})
		$('#_bulk_create').click(function()
		{
			$('#bulk_create_dlg').modal();
		})
		$('#_export_user').click(function()
		{
		})

		$('#btn_login_user').click(function()
		{
		})
		$('#btn_edit_user').click(function()
		{
			$('#dlg_edit_user').modal();
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
	document.getElementById("menu_active_user").classList.toggle("show");
}