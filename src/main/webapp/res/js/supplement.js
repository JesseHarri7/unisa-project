$(document).ready(function()
{
	var dataSet = [];
	var count = 0;
	
	//All data fields on start up
	findAll();
	
	//Get data from the supplier table
	populateSuppDropDown();
	
	//Add temps html files
	includeHTML();
	
	//find all
	function findAll() {
		$.ajax({
			url:"/altHealth/supplement/findAll", 
			dataType: "json",
			type: "GET",
			success: function(data)
			{
				dataSet = data;
				
				suppList(dataSet);
				
			}
		});
	}		
	
	function suppList(dataSet) {
		var suppTable = $("#supplement-table").DataTable({
			dom: '<f<t>lip>',
			retrieve: true,
			select: true,
			data: dataSet,
			columns: 
			[
				{data: 'supplementId'},
				{data: 'supplierId'},
				{data: 'supplementDescription'},
				{data: 'costExcl', render: $.fn.dataTable.render.number( ' ', '.', 2, 'R ' )},
				{data: 'costIncl', render: $.fn.dataTable.render.number( ' ', '.', 2, 'R ' )},
				{data: 'minLevels'},
				{data: 'currentStockLevels'},
				{data: 'nappiCode'}
			]
		});
		
		return suppTable;
	}
	
	//Select
	$('#supplement-table tbody').on('click','tr', function() {
		$(this).toggleClass('selected');
	} );
	
	//Create button
	$('#create-btn').click(function(event) {		
		//Clear form red border css
		clearFormBorder();
		
		//Clear form content if any
		document.getElementById("create").reset();
		
		$('.notifyjs-corner').remove();
	});
	
	//Modal form create button
	$('#form-create-btn').click(function(event) {
		//Clear form red border css
		clearFormBorder();
		$('.notifyjs-corner').remove();
		
		//var requiredFields = validateEmptyFields();
		
		if(validateEmptyFields() && validateNumberFields()){
			create();
		}
	});
	
	function create() {
		dataSet = [];
		var table = $('#supplement-table').DataTable();
		
		var supplementId = $('#id').val();
		var supplierId = $('#supplierId').val();
		var supplementDescription = $('#supplementDescription').val();
		var costExcl = $('#costExcl').val();
		var minLevels = $('#minLevels').val();
		var currentStockLevels = $('#currentStockLevels').val();
		var nappiCode = $('#nappiCode').val();
		
		costExcl = costExcl.substr(1);
		
		//Set as object
		var supplement = {supplementId, supplierId, supplementDescription, costExcl, minLevels, currentStockLevels, nappiCode};
		
		//Translate so that JSON can read it
		var data_json = JSON.stringify(supplement);
		
		$.ajax( {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			url:"/altHealth/supplement/formCreateBtn", 
			dataType: "json",
			data: data_json,
			type: "POST",
			success: function(response)
			{
				if(response.status == "true") {
					$.notify(response.msg, "success");
				
					table.row.add(response.result).draw()
					
					//Clear data from the modal form
					document.getElementById("create").reset();
					$('#createModal').modal('hide');
				}else {
					for (x of response.result) {
						$.notify(x, "error");
					}
					
					for (x of response.idTags) {
						$(x).addClass("form-fill-error");
					}
				}
			},
			error : function(e) {
				console.log("ERROR: ", e);
				$.notify("Status 405", "error");
			}
		});

	}
	
	//Update button
	$('#edit-btn').click(function(event) {		
		//Clear form red border css
		clearFormBorder();
		
		//Clear form content if any
		document.getElementById("update").reset();
		
		$('.notifyjs-corner').remove();
		
		var table = $('#supplement-table').DataTable();

		//Get data of the selected row
		var update = table.rows( '.selected' ).data();
		
		if(update.length != 0) {
			if (update.length > 1) {
				$.notify("Heads up! Please select only one supplement to update.", "error");
			}else{
				//Data in the update variable gets saved as an object
				//Take that data and display it in the modal form
				displaySupplement(update[0]);
				$('#updateModal').modal('show');
			}
		}else {	
			$.notify("Heads up! Please select a supplement to edit.", "error");
		}
	});
	
	//Modal form update button
	$('#form-update-btn').click(function(event) {
		//Clear form red border css
		clearFormBorder();
		$('.notifyjs-corner').remove();
		
		var requiredFields = validateUpdateEmptyFields();
		
		if(requiredFields){
			update();
		}
	});
	
	function update() {
		dataSet = [];
		var table = $('#supplement-table').DataTable();
		
		var supplementId = $('#uid').val();
		var supplierId = $('#usupplierId').val();
		var supplementDescription = $('#usupplementDescription').val();
		var costExcl = $('#ucostExcl').val();
		var minLevels = $('#uminLevels').val();
		var currentStockLevels = $('#ucurrentStockLevels').val();
		var nappiCode = $('#unappiCode').val();
		
		costExcl = costExcl.substr(1);
		
		//Set as object
		var supplement = {supplementId, supplierId, supplementDescription, costExcl, minLevels, currentStockLevels, nappiCode};
		
		//Translate so that JSON can read it
		var data_json = JSON.stringify(supplement);
		
		$.ajax( {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			url:"/altHealth/supplement/formUpdateBtn", 
			dataType: "json",
			data: data_json,
			type: "POST",
			success: function(response) {
				if(response.status == "true") {
					$.notify(response.msg, "success");
				
					table.row( '.selected' ).data(response.result).draw();
					
					//Clear data from the modal form
					document.getElementById("update").reset();
					$('#updateModal').modal('hide');
				}else {
					for (x of response.result) {
						$.notify(x, "error");
					}
					
					for (x of response.idTags) {
						$(x).addClass("form-fill-error");
					}
				}
			},
			error : function(e) {
				console.log("ERROR: ", e);
				$.notify("Status 405", "error");
			}
		});

	}
	
	//Add Supp to cart
	$('#addToCart-btn').click(function(event) {
		var table = $('#supplement-table').DataTable();			

		//Returns an array of the selected rows
		var itemsToAdd = table.rows( '.selected' ).data();
		
		$('.notifyjs-corner').remove();
		
		if (itemsToAdd.length == 0) {
			$.notify("Heads up! Please select supplement/s to add to the cart.", "error");
		}else {
			addItemsToSession(itemsToAdd);
		}
		$('tr.selected').toggleClass('selected');
	});
	
	function addItemsToSession(itemsToAdd){
		
		var supplement = [];
		
		//Set as object
		for (i = 0; i < itemsToAdd.length; i++) {
			supplement.push(itemsToAdd[i]);
		}
		
		//Translate so that JSON can read it
		var data_json = JSON.stringify(supplement);
		
		$.ajax(
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json' 
			},
			url:"/altHealth/supplement/addCartItems", 
			dataType: "json",
			data: data_json,
			type: "POST",
			success: function(response) {
				if(response.status == "true") {
					$.notify(response.msg, "success");
				}else {
					for (x of response.result) {
						$.notify(x, "warn");
					}
					
					for (x of response.resultList) {
						$.notify(x, "success");
					}
				}
			},
			error : function(e) {
				console.log("ERROR: ", e);
				$.notify("Status 405", "error");
			}
		});
	}
	
	function populateSuppDropDown(){
		$.ajax({
			url:"/altHealth/supplier/findAll", 
			dataType: "json",
			type: "GET",
			success: function(data) {
				var li="";
				for (supp of data) {
					li+='<option>'+supp.supplierId+'</option>';
				}
				
				$('#supplierId').append(li);
				$('#usupplierId').append(li);
			}
		});
	}
	
	function validateEmptyFields() {
		var id = document.forms["create"]["id"].value;
		var supplierId = document.forms["create"]["supplierId"].value;
		var supplementDescription = document.forms["create"]["supplementDescription"].value;		
		var costExcl = document.forms["create"]["costExcl"].value;
		var minLevels = document.forms["create"]["minLevels"].value;
		var currentStockLevels = document.forms["create"]["currentStockLevels"].value;
		//var nappiCode = document.forms["create"]["nappiCode"].value;
		
		if (id == "" || supplierId == "" || supplementDescription == "" || costExcl == "" || minLevels == "" || currentStockLevels == "" || nappiCode == "") {
			displayFormBorder(id, supplierId, supplementDescription, costExcl, minLevels, currentStockLevels);
			$.notify("Heads up! All required fields must be filled out.", "error");
			return false;
		}else {
			return true;
		}	
	}
	
	function validateUpdateEmptyFields() {
		var id = document.forms["update"]["uid"].value;
		var supplierId = document.forms["update"]["usupplierId"].value;
		var supplementDescription = document.forms["update"]["usupplementDescription"].value;		
		var costExcl = document.forms["update"]["ucostExcl"].value;
		var minLevels = document.forms["update"]["uminLevels"].value;
		var currentStockLevels = document.forms["update"]["ucurrentStockLevels"].value;
		//var nappiCode = document.forms["update"]["unappiCode"].value;
		
		if (id == "" || supplierId == "" || supplementDescription == "" || costExcl == "" || minLevels == "" || currentStockLevels == "" || nappiCode == "") {
			displayFormBorder(id, supplierId, supplementDescription, costExcl, minLevels, currentStockLevels);
			$.notify("Heads up! All required fields must be filled out.", "error");
			return false;
		}else {
			return true;
		}	
	}
	
	function displayFormBorder(id, supplierId, supplementDescription, costExcl, minLevels, currentStockLevels) {
		if(!id) {
			$('#id').addClass("form-fill-error");
			$('#uId').addClass("form-fill-error");
		}	
		
		if(!supplierId) {
			$('#supplierId').addClass("form-fill-error");
			$('#usupplierId').addClass("form-fill-error");
		}
		
		if(!supplementDescription) {
			$('#supplementDescription').addClass("form-fill-error");
			$('#usupplementDescription').addClass("form-fill-error");
		}
		
		if(!costExcl) {
			$('#costExcl').addClass("form-fill-error");
			$('#ucostExcl').addClass("form-fill-error");
		}
		
		if(!minLevels) {
			$('#minLevels').addClass("form-fill-error");
			$('#uminLevels').addClass("form-fill-error");
		}
		
		if(!currentStockLevels) {
			$('#currentStockLevels').addClass("form-fill-error");
			$('#ucurrentStockLevels').addClass("form-fill-error");
		}

	}
	
	function validateNumberFields() {
		//var costExcl = document.forms["create"]["costExcl"].value;
		var minLevels = document.forms["create"]["minLevels"].value;
		var currentStockLevels = document.forms["create"]["currentStockLevels"].value;
		
		var valid = true;
		var numbers = /^[0-9]+$/;
		
/*		if(!costExcl.match(numbers)) {
			$('#costExcl').addClass("form-fill-error");
			valid = false;
		} */
		
		if(!minLevels.match(numbers)) {
			$('#minLevels').addClass("form-fill-error");
			valid = false;
		}
		
		if(!currentStockLevels.match(numbers)) {
			$('#currentStockLevels').addClass("form-fill-error");
			valid = false;
		}
		
		if(!valid){
			$.notify("Heads up! Please input numeric characters only.", "error");
		}
			
		return valid;
	}
	
	function displaySupplement(supplement){
		document.forms["update"]["uid"].value = supplement.supplementId;
		document.forms["update"]["usupplierId"].value = supplement.supplierId;
		document.forms["update"]["usupplementDescription"].value = supplement.supplementDescription;
		document.forms["update"]["ucostExcl"].value = "R"+supplement.costExcl;
		document.forms["update"]["uminLevels"].value = supplement.minLevels;
		document.forms["update"]["ucurrentStockLevels"].value = supplement.currentStockLevels;
		document.forms["update"]["unappiCode"].value = supplement.nappiCode;
	}
	
	function clearFormBorder() {
		//create form
		$('#id').removeClass("form-fill-error");
		$('#supplierId').removeClass("form-fill-error");
		$('#supplementDescription').removeClass("form-fill-error");
		$('#costExcl').removeClass("form-fill-error");
		$('#minLevels').removeClass("form-fill-error");
		$('#currentStockLevels').removeClass("form-fill-error");
		$('#nappiCode').removeClass("form-fill-error");
		
		//Update form
		$('#uId').removeClass("form-fill-error");
		$('#usupplierId').removeClass("form-fill-error");
		$('#usupplementDescription').removeClass("form-fill-error");
		$('#ucostExcl').removeClass("form-fill-error");
		$('#uminLevels').removeClass("form-fill-error");
		$('#ucurrentStockLevels').removeClass("form-fill-error");
		$('#unappiCode').removeClass("form-fill-error");
	}
	
	function includeHTML() {
		  var z, i, elmnt, file, xhttp;
		  /*loop through a collection of all HTML elements:*/
		  z = document.getElementsByTagName("*");
		  for (i = 0; i < z.length; i++) 
		  {
		    elmnt = z[i];
		    /*search for elements with a certain atrribute:*/
		    file = elmnt.getAttribute("w3-include-html");
		    if (file) 
		    {
		      /*make an HTTP request using the attribute value as the file name:*/
		      xhttp = new XMLHttpRequest();
		      xhttp.onreadystatechange = function() 
		      {
		        if (this.readyState == 4) 
		        {
		          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
		          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
		          /*remove the attribute, and call this function once more:*/
		          elmnt.removeAttribute("w3-include-html");
		          includeHTML();
		        }
		      }
		      xhttp.open("GET", file, true);
		      xhttp.send();
		      /*exit the function:*/
		      return;
		    }
		  }
		  showActiveNav();
	}
	
	function showActiveNav() {
		$('#supplementNav').addClass('active');
		/*var url = window.location.pathname;
		
		if(url == "/assetManagement/pages/asset")
		{
			$('#aNav').addClass('active');
		}*/
	}

});