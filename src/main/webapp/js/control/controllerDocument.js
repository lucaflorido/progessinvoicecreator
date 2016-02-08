var gecoDocumentControllers = angular.module("gecoDocumentControllers",[]);
gecoDocumentControllers.controller('HeadListCtrl',["$scope","$http","$routeParams","$rootScope","ModalFactory",function($scope,$http,$routeParams,$rootScope,ModalFactory){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.pagesize = 1000;
	$scope.pageArray = [];
	$scope.headamount = 0;
	$scope.headtaxamount = 0;
	$scope.headtotal = 0;
	//$scope.headfilter={};
	$scope.heads = [];
	if ($scope.headfilter == null){
		$scope.headfilter = {};
		$scope.currentCustomer = {};
		$scope.currentDocument = {};
		$scope.currentSuppllier = {};
	}else{
		$scope.currentCustomer = $scope.headfilter.customer;
		$scope.currentDocument = $scope.headfilter.document;
		$scope.currentSuppllier = $scope.headfilter.supplier;
		if($scope.headfilter.pageSize)
			$scope.pagesize = $scope.headfilter.pageSize;
	}
	if ($routeParams.section == 1){
		$scope.headfilter.isCustomer = true;
		$scope.headfilter.isSupplier = false;
	}else{
		$scope.headfilter.isCustomer = false;
		$scope.headfilter.isSupplier = true;
	}
	if ($routeParams.type == 1){
		$scope.headfilter.isOrder = true;
		$scope.headfilter.isInvoice = false;
		$scope.headfilter.isTransport = false;
	}else{
		if ($routeParams.type == 2){
			$scope.headfilter.isInvoice = true;
			$scope.headfilter.isOrder = false;
			$scope.headfilter.isTransport = false;
		}else if ($routeParams.type == 3){
			$scope.headfilter.isOrder = false;
			$scope.headfilter.isTransport = true;
			$scope.headfilter.isInvoice = false;
		}
		
	}
	$http.get('rest/registry/supplier').success(function(data){
				$scope.suppliers= data;
	});
	$http.get('rest/registry/customer').success(function(data){
		$scope.customers= data;
	});
	$http.get('rest/basic/document').success(function(data){
		$scope.documents= data;
	});
	$scope.sendDocumentByEmail = function(head){
		ModalFactory.sendDocument($rootScope.user,head,$scope.sendByEmail);
	}
	$scope.sendByEmail = function(user,head,mailconfig){
		$.ajax({
				url:"rest/email/document/",
				type:"POST",
				data:"head="+JSON.stringify(head)+"&user="+JSON.stringify(user)+"&mailconfig="+JSON.stringify(mailconfig),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						
						alert("ok");
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}
				})
	}
	$scope.getHeads = function(page){
			$(".pag").removeClass("selected");
			$("#pag"+page).addClass("selected");
			$(".checkbox_all").prop('checked',false);
			$scope.headsToPrint	= [];
			$scope.headfilter.startelement = (page - 1 ) * $scope.pagesize;
			$scope.headfilter.pageSize = $scope.pagesize;
			$rootScope.headfilter = $scope.headfilter;
			$.ajax({
				url:"rest/head/head/",
				type:"POST",
				data:"filter="+JSON.stringify($scope.headfilter),
				success:function(data){
					$scope.heads= JSON.parse(data);
					for(var i=0;i<$scope.heads.length;i++){
						$scope.headamount = $scope.headamount + $scope.heads[i].amount;
						$scope.headtaxamount = $scope.headtaxamount + $scope.heads[i].taxamount;
						$scope.headtotal = $scope.headtotal + $scope.heads[i].total;
						$scope.headamount = Math.round($scope.headamount * 100)/100;
						$scope.headtaxamount = Math.round($scope.headtaxamount * 100)/100;
						$scope.headtotal = Math.round($scope.headtotal * 100)/100;
					}
					$scope.$apply();
					}	
				})
	}
	
	$scope.getHeadsNumber = function(){
		if ($scope.heads.length != $scope.pagesize){
		$scope.pages = [];
		$scope.pageArray = [];
		$scope.headfilter.pageSize = $scope.pagesize;
			$.ajax({
				url:"rest/head/pages/"+$scope.pagesize,
				type:"POST",
				data:"filter="+JSON.stringify($scope.headfilter),
				success:function(data){
						$scope.pages= JSON.parse(data);
						for (var i=0;i<$scope.pages;i++){
							$scope.pageArray.push(i+1);
						}
						$scope.$apply();
						$scope.getHeads(1);
					}
				
						
				});
		}
	}
	$scope.getHeadsNumber();
	$rootScope.deleteElement = function(){
		$.ajax({
			url:"rest/head/head/",
			type:"DELETE",
			data:"headobj="+JSON.stringify($rootScope.deleteObj),
			success:function(data){
				//alert("Utente eliminato con successo");
				$scope.getHeadsNumber();
			}	
		})
			
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data);
		});
	}
	$scope.printMassElements = function(){
		$.ajax({
						url:"rest/print/heads/",
						type:"POST",
						data:"ids="+JSON.stringify($scope.headsToPrint),
						success:function(data){
							var deviceAgent = navigator.userAgent;
							// Set var to iOS device name or null
							var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
							if (ios) {
								// This is the line that matters
								$scope.openTab(JSON.parse(data));
							} else {
								// Your code that works for desktop browsers
								//$scope.openTab(JSON.parse(data));
								window.open(JSON.parse(data));
								//$scope.openTab(JSON.parse(data));
							}
							//window.open(JSON.parse(data));
							//window.location.replace(JSON.parse(data));
						}	
					})
	}
	
	$scope.headsToPrint = [];
	$scope.addRemoveHeadId = function(id){
		var found = false;
		var indexToRemove = 0;
		for (var i=0;i<$scope.headsToPrint.length;i++ ){
			if ($scope.headsToPrint[i] == id ){
				found = true;
			}
		}
		if (found == false){
			$scope.headsToPrint.push(id);
		}else{
			$scope.headsToPrint = jQuery.grep($scope.headsToPrint, function(value) {
			  return value != id;
			});
		}
	}
	$scope.getRowsWithSerialNumbers = function(id){
		$scope.idHeadSN = id;
		$.ajax({
				url:"rest/head/serialnumberList/"+id,
				type:"POST",
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$( "#dialog" ).dialog( "option", "minWidth", 550 );
						$( "#dialog" ).dialog( "option", "minHeight", 350 );
						$("#dialog").dialog("open")
						$scope.prods = result.success;
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
	$scope.getRowSerialNumber = function(row){
		$.ajax({
				url:"rest/head/copyrowserialnumber/",
				type:"POST",
				data:"row="+JSON.stringify(row),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.prods.push( result.success);
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
	$scope.saveRowSerialNumber = function(){
		$.ajax({
				url:"rest/head/saverowsserialnumber/"+$scope.idHeadSN,
				type:"PUT",
				data:"row="+JSON.stringify($scope.prods),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.$apply();
						alert("success")
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
	$scope.dateSortFunction = function(head) {
		var date = head.date.split("/");
		return date[2]+date[1]+date[0];
	};
	$scope.dateSortReverseFunction = function(head) {
		var date = head.date.split("/");
		return "-"+date[2]+date[1]+date[0];
	};
	$scope.addRemoveHeads = function(){
		$scope.headsToPrint	= [];
		if ($(".checkbox_all").prop('checked') == true){
			for (var i=0;i<$scope.heads.length;i++ ){
				$scope.headsToPrint.push($scope.heads[i].idHead);
			}
			$(".checkbox_single").prop("checked",true);
		}else{
			$(".checkbox_single").prop("checked",false);
		}
	}
}]);
gecoDocumentControllers.controller('HeadDetailCtrl',["$scope","$http","$routeParams","$location","$rootScope","$route",function($scope,$http,$routeParams,$location,$rootScope,$route){
	$rootScope.issaved = true;
	$(document).unbind("keydown");
	$(document).keydown(function(e){
      //ALT + N
      if(e.altKey && e.keyCode == 78 ){
			if($scope.selectedSection == $scope.listsections[1]){
				$scope.addRowElement();
				$scope.$apply();
				$("#prod_code").focus();
			}
      }
	  //ALT + R
	   if(e.altKey && e.keyCode == 82 ){
			$route.reload(); 
		}
	  //ALT + J
	   if(e.altKey && e.keyCode == 74 ){
			$scope.openNewDocument(); 
		}
		//ALT+Q
	   if(e.altKey && e.keyCode == 81 ){
			$scope.saveHead();
		}
		//ALT+V
		if(e.altKey && e.keyCode == 87 ){
			if($scope.selectedSection == $scope.listsections[1] && $scope.currentRow != null){
				$scope.search="";
				$scope.prodFound = [];
				$scope.$apply();
				$( "#dialog" ).dialog( "option", "minWidth", 550 );
				$( "#dialog" ).dialog("option","position","['center',20]"); 
				$("#dialog").dialog("open");
			}	
		}
		if(e.altKey && e.keyCode == 49 ){
			$scope.selectedSection = $scope.listsections[0];
			$scope.$apply();
		}
		if(e.altKey && e.keyCode == 50 ){
			$scope.selectedSection = $scope.listsections[1];
			$scope.$apply();
		}
		if(e.altKey && e.keyCode == 51 ){
			$scope.selectedSection = $scope.listsections[2];
			$scope.$apply();
		}
	});
	$scope.show_qta = false;
	$scope.listsections = ["Testa [Alt + 1]","Righe [Alt + 2]","Totali [Alt + 3]"];
		$scope.isOrder = false;
		$scope.isLoadSerialN = false;
		$scope.isUnloadSerialN = false;
		$scope.idhead= $routeParams.idhead;
    GECO_validator.startupvalidator();
	
	if ($routeParams.rows == null){
		if ($scope.selectedSection == null)
			$scope.selectedSection = $scope.listsections[0];
	}else{
	$("#maincontainer_productdetail").focus();
		switch ($routeParams.rows){
			case "1":
				$scope.isOrder = true;
				$scope.selectedSection = $scope.listsections[1];
				break;
			case "2":
				$scope.isLoadSerialN = true;
				$scope.selectedSection = $scope.listsections[1];
				break;	
			case "3":
				$scope.isUnloadSerialN = true;
				$scope.selectedSection = $scope.listsections[1];
				break;	
		}
	}
	
		$http.get('rest/head/head/'+$scope.idhead).success(function(data){
		$scope.head= data;
		$http.get('rest/basic/payment').success(function(data){
			$scope.payments= data;
			for (var i=0;i<$scope.payments.length;i++){
				if ($scope.head.payment != null && $scope.head.payment.idPayment == $scope.payments[i].idPayment){
					$scope.currentPayment = $scope.payments[i]; 
				}
			}
		});
		$http.get('rest/registry/supplier').success(function(data){
			$scope.suppliers= data;
			for (var i=0;i<$scope.suppliers.length;i++){
				if ($scope.head.supplier != null && $scope.head.supplier.idSupplier == $scope.suppliers[i].idSupplier){
					$scope.currentSupplier = $scope.suppliers[i]; 
				}
			}
		});
		$http.get('rest/basic/document').success(function(data){
			$scope.documents= data;
			for (var i=0;i<$scope.documents.length;i++){
				if ($scope.head.document != null && $scope.head.document.idDocument == $scope.documents[i].idDocument){
					$scope.currentDocument = $scope.documents[i]; 
				}
			}
		});		
		$http.get('rest/registry/customer').success(function(data){
			$scope.customers= data; 
			$scope.fillCustomer();
		});
		$http.get('rest/registry/transporter').success(function(data){
					$scope.transporters= data;
					$scope.setTransporter();
		});
		$scope.setTransporter();
		if ($rootScope.headScope == null){
			$scope.isSaving = false;
			$scope.addRow=true;
		}else{
			$scope.selectedSection = $rootScope.headScope.selectedSection;
			$scope.head = $rootScope.headScope.head;
			$scope.head.rows = $rootScope.headScope.head.rows;
			$scope.currentRow = $rootScope.headScope.currentRow;
			$scope.currentRow.productcode = $rootScope.newProductToAdd;
			$scope.getProduct($scope.currentRow.productcode); 
			$scope.addRow=true;
			$scope.isSaving = false;	
			$rootScope.headScope = null;
			
		}
	});
	$scope.fillCustomer = function(){
		if ($scope.customers != undefined && $scope.customers.length >0 && $scope.head != null && $scope.head.customer != null && $scope.currentCustomer == null){
			for (var itx=0;itx<$scope.customers.length;itx++){
				if ($scope.head.customer.idCustomer == $scope.customers[itx].idCustomer){
					$scope.currentCustomer = $scope.customers[itx]; 
					$scope.destinations = $scope.head.customer.destinations;
					if ($scope.destinations != undefined && $scope.destinations.length >0 && $scope.head.destination != null && $scope.currentDestination == null){
						for (var d=0;d<$scope.destinations.length;d++){
							if ($scope.head.destination != null && $scope.head.destination.idDestination == $scope.destinations[d].idDestination){
								$scope.currentDestination = $scope.destinations[d];
							}
						}
					}
					$scope.lists = $scope.head.customer.lists;
					if ($scope.head.customer.lists != null  && $scope.currentList == null){
						for (var d=0;d<$scope.head.customer.lists.length;d++){
							//$scope.lists.push($scope.head.customer.lists[d].list);
							if ($scope.head.customer.lists[d].list != null && $scope.head.list != null && $scope.head.list.idList == $scope.head.customer.lists[d].list.idList){
								$scope.currentList = $scope.head.customer.lists[d].list;
							}
							
						}
					}
					break;
					
				}
			}
		}
	}
	$scope.setTransporter = function(){
		if ($scope.head != null && $scope.transporters != null){
			for (var i=0;i<$scope.transporters.length;i++){
							if ($scope.head.transporter != null && $scope.head.transporter.idTransporter == $scope.transporters[i].idTransporter){
								$scope.currentTransporter = $scope.transporters[i]; 
							}
						}
		}
	}
	
	
	$scope.changeCustomer = function(idCustomer){
		$rootScope.setModified();
		
		$http.get('rest/registry/destination/customer/'+idCustomer).success(function(data){
				$scope.destinations= data;
				if ($scope.currentDestination != null){
					for (var d=0;d<$scope.destinations.length;d++){
						if ($scope.currentDestination != null && $scope.currentDestination.idDestination == $scope.destinations[d].idDestination){
							$scope.currentDestination = $scope.destinations[d];
						}
					}
				}
		});
		$http.get('rest/registry/list/customer/'+idCustomer).success(function(data){
				$scope.lists = [];
				if (data != null){
					for (var d=0;d<data.length;d++){
					$scope.lists.push(data[d].list)
						if (data[d].list != null && $scope.currentList != null && $scope.currentList.idList == data[d].list.idList){
							$scope.currentList = data[d].list;
						}
						
					}
				}
		});
		if ($scope.currentDocument != null){
			if ($scope.currentDocument.credit == true || $scope.currentDocument.debit == true){
				for(var i=0;i<$scope.payments.length;i++){
					if ($scope.payments[i].idPayment == $scope.currentCustomer.payment.idPayment){
						$scope.currentPayment = $scope.payments[i] 
						//$(".selpayment").trigger("chosen:update");
					}
				}
			}
		}
		if ($scope.currentCustomer){
			$scope.head.taxrate = $scope.currentCustomer.taxrate;
		}
	}
	$scope.changeSupplier = function(){
		if ($scope.currentDocument != null){
			if ($scope.currentDocument.credit == true || $scope.currentDocument.debit == true){
				for(var i=0;i<$scope.payments.length;i++){
					if ($scope.payments[i].idPayment == $scope.currentSupplier.payment.idPayment){
						$scope.currentPayment = $scope.payments[i] 
						//$(".selpayment").trigger("chosen:update")
					}
				}
			}
		}
	}
	$scope.addRowElement = function(){
		//if ($scope.currentRow == null){
			if($scope.head.rows == null){
				$scope.head.rows = [];
			}
			var newobj = {idRow:0,type:"V"};
			$scope.currentRow = newobj;
			$scope.head.rows.push(newobj);
			$rootScope.issaved = false;
			$("#prod_code").focus();
			
		//}
	}
	$scope.confirmRowElement = function(){
		if ($scope.currentRow != null){
			if($scope.head.rows == null){
				$scope.head.rows = [];
			}
			
			$scope.$apply();
		}
	}
	$scope.checkKeyCode = function(){
		alert($event.keyCode);
	}
	
	$scope.getProduct = function(code){
		if (code != "" && code != undefined){
			$rootScope.setModified();
			var idList = 0;
			if ($scope.head.list!= null){
				idList = $scope.head.list.idList
			}
			$.ajax({
					url:'rest/registry/product/code/'+code+"/"+idList,
					type:"POST",
					data:"head="+JSON.stringify($scope.head),
					success:function(data){
					data = JSON.parse(data);
					if (data.idProduct != 0){
						$scope.currentRow.product = data;
						$scope.currentRow.productcode = code;
						$scope.currentRow.productdescription = data.description;
						$scope.currentRow.price = data.listprice;
						$scope.currentRow.taxrate = data.taxrate;
						if($scope.currentRow.product.storage){
							$scope.currentRow.product.stockqta = Math.round($scope.currentRow.product.storage.stock/$scope.currentRow.product.conversionrate *100) /100;
						}
						if (data.umselected !== undefined && data.umselected != null){
							$scope.currentRow.productum = data.umselected.code;
							$scope.currentRow.um = data.umselected;
							if ($scope.currentRow.quantity == 0 || $scope.currentRow.quantity == "" ){
								$scope.currentRow.quantity  = 1;
							}
							$scope.$apply();
							$("#qta").focus();
						}else{
							$scope.currentRow.quantity  = 1;
							$scope.$apply();
							$("#price").focus();
							$scope.calculateRow($scope.currentRow);
						}
						
						
					}else{
						$scope.search=code;
						$scope.prodFound = [];
						$scope.searchProd(code);
						$scope.$apply();
						$scope.showSearch = true;
					}
				}
			});
			
		}
	}
	$scope.calculateRow = function(row){
		if (row.quantity != "" && row.quantity != null  ){
			$rootScope.setModified();
			$scope.totrowobj = {};
			$scope.totrowobj.qta = row.quantity;
			$scope.totrowobj.taxrate = row.product.taxrate.value;
			$scope.totrowobj.price = row.price;
			$.ajax({
					url:"rest/documenthelp/rowtotal",
					type:"POST",
					data:"row="+JSON.stringify($scope.totrowobj),
					success:function(data){
						$scope.totrow = $.parseJSON(data);
						row.total = $scope.totrow.total;
						row.amount = $scope.totrow.amount;
						row.taxamount = $scope.totrow.taxamount;
						$scope.$apply();
						$scope.calculateTotal();
					}	
				});
		}
	}
	$scope.setCurrentRow = function(row){
		
		$scope.currentRow = row;
	} 
	$scope.calculateTotal = function(){
		$scope.totrowobj = {};
		$scope.totrowobj.rows = $scope.head.rows;
		$.ajax({
				url:"rest/documenthelp/headtotal",
				type:"POST",
				data:"head="+JSON.stringify($scope.totrowobj),
				success:function(data){
					$scope.totrow = $.parseJSON(data);
					$scope.head.total =$scope.totrow.total;
					$scope.head.total4 =$scope.totrow.total4;
					$scope.head.total10 =$scope.totrow.total10;
					$scope.head.total20 =$scope.totrow.total20;
					$scope.head.amount =$scope.totrow.amount;
					$scope.head.amount4 =$scope.totrow.amount4;
					$scope.head.amount10 =$scope.totrow.amount10;
					$scope.head.amount20 =$scope.totrow.amount20;
					$scope.head.taxamount =$scope.totrow.taxamount;
					$scope.head.taxamount4 =$scope.totrow.taxamount4;
					$scope.head.taxamount10 =$scope.totrow.taxamount10;
					$scope.head.taxamount20 =$scope.totrow.taxamount20;
					$scope.addRow=true;
					$scope.$apply();
				}	
			})
	}
	
	$scope.saveHead = function(){
		$scope.checkHead();
	};
	$scope.checkHead = function(){
		$.ajax({
			url:"rest/head/checkhead",
			type:"POST",
			data:"head="+JSON.stringify($scope.head),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.saveHeadChecked();
				}else{
					$.confirm({
						text: result.errorMessage,
						confirm: function(button) {
								$scope.$apply();
								$scope.saveHeadChecked();
								},							
						cancel: function(button) {
							
						},
						
						confirmButton:"Continua" ,
						cancelButton: "No"
					});

				}
				$scope.isSaving = false;						
			},
			error:function(data){
				$scope.isSaving = false;
				$scope.errorMessage(data);
			}		
		});
	}
	
	$scope.saveHeadChecked = function(){
		$scope.head.payment = $scope.currentPayment;
		if ($scope.head.withholdingtax === undefined || $scope.head.withholdingtax === null ){
			$scope.head.withholdingtax = 0;
		}
	     if ($scope.isSaving == false){  
			$scope.isSaving = true;	
				$.ajax({
					url:"rest/head/head",
					type:"PUT",
					data:"heads="+JSON.stringify($scope.head),
					success:function(data){
						
						result = JSON.parse(data);
						if (result.type == "success"){	
							$scope.head = result.success;
							$scope.idhead = $scope.head.idHead;
							$scope.$apply();
							$rootScope.selectedSection = $scope.selectedSection
							$rootScope.issaved = true;
							$scope.confirmSaved();
						}else{
							$scope.errorMessage(result.errorMessage);
						}
                        $scope.isSaving = false;						
					},
					error:function(data){
						$scope.isSaving = false;
						$scope.errorMessage(data);
					}		
				})
		}
	}
	$rootScope.saveFuntion = $scope.saveHeadChecked;
	$scope.calculateNumber = function(){
		if ($scope.head.date != null && $scope.head.document != null && ($scope.head.idHead === null || $scope.head.idHead === undefined || $scope.head.idHead === 0) ){
			$rootScope.setModified();
			var year = $scope.head.date.split("/");
			year = year[2];
			if ($scope.head.document.counter != null && $scope.head.document.counter.yearsvalue != null   ){
				var yearsvalue = $scope.head.document.counter.yearsvalue;
				for (var i=0; i< yearsvalue.length;i++){
					if (year == yearsvalue[i].year){
					    $scope.head.number = yearsvalue[i].value
					}
				}
				if ($scope.head.number == 0){
					$scope.head.number = 1;
				}
			}
			
			
		}
	}
	$scope.printElements = function(){
		if ($scope.head.idHead != 0 && $scope.head.idHead != null ){
		$.ajax({
				url:"rest/print/head/"+$scope.head.idHead,
				type:"GET",
				success:function(data){
					//result = JSON.parse(data);
					var deviceAgent = navigator.userAgent;
							// Set var to iOS device name or null
							var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
							if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // some code..
}
							if (ios) {
								// This is the line that matters
								$scope.openTab(JSON.parse(data));
							} else {
								// Your code that works for desktop browsers
								
								window.open(JSON.parse(data));
							}
					//window.open(result);
				}	
			});
		}
	}
	$scope.search = "";
	$scope.searchProd = function(code){
		if (code != null && code != undefined){
			$scope.search = code;
		}
		if ($scope.search != "" && $scope.search != undefined){
			$http.get("rest/registry/product/search/"+$scope.search).success(function(data){
				if (data.length >0){
					$scope.prodFound = data;
					
				}else{
					alert("Nessun prodotto trovato");
				}
			})
		}
		var phase = this.$root.$$phase;
		if(phase != '$apply' && phase != '$digest') {
			$scope.$apply();
		}
	}
	$scope.insertProduct = function(code){
		$scope.getProduct(code);
		$scope.showSearch = false;
	}
	$scope.closeSearch = function(){
		$scope.showSearch = false;
	}
	$scope.forceSerialNumbers = function(){
		var serialnumber = $("#forceserial").val();
		var expireddate = $("#forceexpiredate").val();
		for (var i=0; i< $scope.head.rows.length;i++){
			if ($scope.head.rows[i].product.manageserialnumber == true && ($scope.head.rows[i].serialnumber == "" || $scope.head.rows[i].serialnumber == null) && ($scope.head.rows[i].expiredate == "" || $scope.head.rows[i].expiredate == null )){
				$scope.head.rows[i].serialnumber = serialnumber;
				$scope.head.rows[i].expiredate = expireddate;
			}
		}
		$scope.$apply();
	}
	$scope.forceLoadSerialNumbers = function(){
		$.ajax({
				url:"rest/head/serialnumberList/"+$scope.head.idHead,
				type:"POST",
				success:function(data){
					result = JSON.parse(data);
					var store = [];
					if  (result.success.length > 0){
						for(var i=0;i<result.success.length;i++){
							var found = false;
							for(var k=0;k<$scope.head.rows.length;k++){
								
								if (result.success[i].idRow == $scope.head.rows[k].idRow){
									$scope.head.rows[k].quantity = result.success[i].quantity;
									$scope.head.rows[k].serialnumber = result.success[i].serialnumber;
									$scope.head.rows[k].expiredate = result.success[i].expiredate;
									found = true;
									break;
								}
							}
							if (found == false){
								store.push(result.success[i]);
							}
						}
						if (store.length >0){
							for(var y=0;y<store.length;y++){
								$scope.head.rows.push(store[y]);
							}
						}
						$scope.$apply();
					}
					
				}	
			});
		}
	$rootScope.deleteElement = function(){
		if ($rootScope.deleteObj.idRow == 0){
			$scope.head.rows = $.grep($scope.head.rows,function(a){  return a != $rootScope.deleteObj;})
			$scope.currentRow = null;
			$scope.$apply();
		}else{
			$.ajax({
				url:"rest/head/removerow/"+$rootScope.deleteObj.idRow,
				type:"DELETE",
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
							$scope.head.rows = $.grep($scope.head.rows,function(a){  return a != $rootScope.deleteObj;})
							$scope.currentRow = null;
							$scope.$apply();
							
						}else{
							alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
						}
				}	
			});
		}
	}
	$scope.openNewDocument = function(){
		$scope.selectedSection = $scope.listsections[0];
		var url = $location.url();
		if (url.indexOf("/head/0") < 0){
			$location.path("/head/0")
		}else{
			$route.reload();
		}
	}
	$scope.addNewRowFromQuantity = function(e){
		if (e.keyCode == 13 && $scope.currentRow.quantity != ""){
			$scope.addRowElement();
			$scope.$apply();
			$("#prod_code").focus();
		}
	}
	$scope.addNewProduct = function(){
		$rootScope.headScope = $scope;
		$scope.showSearch = false;
		$rootScope.newProductToAdd = $scope.currentRow.productcode;
		
		$location.path("/product/0")
	}
	
}]);

gecoDocumentControllers.controller('GenerateDocsCtrl',["$scope","$http","$routeParams","$rootScope","$location",function($scope,$http,$routeParams,$rootScope,$location){
	$scope.filter = {};
	$scope.generateobj = {};
	$http.get('rest/registry/customer').success(function(data){
				$scope.customers= data;
	});
	$http.get('rest/registry/supplier').success(function(data){
				$scope.suppliers= data;
	});
	$http.get('rest/registry/transporter').success(function(data){
				$scope.transporters= data;
	});
	
	$http.get('rest/basic/document').success(function(data){
		$scope.documents= data;
	});
	$scope.selectDocs = function(){
		$scope.heads = [];
		$.ajax({
				url:"rest/head/generationdocs/filterdocs",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filter),
				success:function(data){
					$scope.heads= JSON.parse(data);
					$scope.selectedSection = $scope.listsections[1];
					$scope.$apply();
				}	
			})
			
		
	}
	$scope.setGenerate = function(head){
		if (head.generate == null || head.generate == false){
			head.generate = true;
			for (var i=0;i< head.rows.length;i++){
				head.rows[i].generate = true;
			}
		}else{
			head.generate = false;
			for (var i=0;i< head.rows.length;i++){
				head.rows[i].generate = false;
			}
		}
	}
	$scope.setGenerateRow = function(row,head){
		if (row.generate == null || row.generate == false){
			row.generate = true;
			var generate = true;
			for (var i=0;i< head.rows.length;i++){
				if (head.rows[i].generate == false){
					generate = false
				}
			}
			head.generate = generate;
		}else{
			row.generate = false;
			head.generate = false;
		}
	}
	$scope.detailView = function(idHead){
		if ($("#det"+idHead).css("display") == "none"){
			$("#det"+idHead).css("display","");
		}else{
			$("#det"+idHead).css("display","none");
		}
	}
	$scope.listsections = ["Seleziona","Genera"];
	$scope.selectedSection = $scope.listsections[0];
	$scope.generateDocs = function(){
		$scope.generateobj.heads = $scope.heads;
		$.ajax({
				url:"rest/head/generationdocs/objectdocs",
				type:"POST",
				data:"generateobj="+JSON.stringify($scope.generateobj),
				success:function(data){
					$rootScope.headfilter = {};
					$rootScope.showFilter = true;
					$rootScope.headfilter.fromDate = $scope.generateobj.date;
					$rootScope.headfilter.toDate = $scope.generateobj.date;
					if ($scope.generateobj.generateDoc.customer == true){
						if ($scope.generateobj.generateDoc.order == true){
							$location.path("/headlist/1/1");
						}else if ($scope.generateobj.generateDoc.invoice == true){
							$location.path("/headlist/1/2");
						}else if ($scope.generateobj.generateDoc.transport == true){
							$location.path("/headlist/1/3");
						}
					}else if ($scope.generateobj.generateDoc.supplier == true){
						if ($scope.generateobj.generateDoc.order == true){
							$location.path("/headlist/2/1");
						}else if ($scope.generateobj.generateDoc.invoice == true){
							$location.path("/headlist/2/2");
						}else if ($scope.generateobj.generateDoc.transport == true){
							$location.path("/headlist/2/3");
						}
					}
					$scope.$apply();
				}	
		})
	}
}]);



gecoDocumentControllers.controller('CopyRowsCtrl',["$scope","$http","$routeParams","$rootScope","$location",function($scope,$http,$routeParams,$rootScope,$location){
	$scope.filter = {};
	$scope.generateobj = {};
	$(".datepicker").datepicker({ dateFormat: "dd/mm/yy" });
	$http.get('rest/registry/customer').success(function(data){
				$scope.customers= data;
	});
	$http.get('rest/registry/list').success(function(data){
				$scope.lists= data;
	});
	$http.get('rest/registry/supplier').success(function(data){
				$scope.suppliers= data;
	});
	$http.get('rest/registry/transporter').success(function(data){
				$scope.transporters= data;
	});
	
	$http.get('rest/basic/document').success(function(data){
		$scope.documents= data;
	});
	$scope.selectDocs = function(){
		$scope.heads = [];
		$.ajax({
				url:"rest/head/generationdocs/filterdocs",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filter),
				success:function(data){
					$scope.heads= JSON.parse(data);
					if ($scope.heads.length > 0)
					$scope.selectedSection = $scope.listsections[1];
					$scope.$apply();
				}	
			})
			
		
	}
	$scope.setGenerate = function(head){
		if (head.generate == null || head.generate == false){
			head.generate = true;
			for (var i=0;i< head.rows.length;i++){
				head.rows[i].generate = true;
			}
		}else{
			head.generate = false;
			for (var i=0;i< head.rows.length;i++){
				head.rows[i].generate = false;
			}
		}
	}
	$scope.setGenerateRow = function(row,head){
		if (row.generate == null || row.generate == false){
			row.generate = true;
			var generate = true;
			for (var i=0;i< head.rows.length;i++){
				if (head.rows[i].generate == false){
					generate = false
				}
			}
			head.generate = generate;
		}else{
			row.generate = false;
			head.generate = false;
		}
	}
	$scope.detailView = function(idHead){
		if ($("#det"+idHead).css("display") == "none"){
			$("#det"+idHead).css("display","");
		}else{
			$("#det"+idHead).css("display","none");
		}
	}
	$scope.listsections = ["Seleziona","Genera"];
	$scope.selectedSection = $scope.listsections[0];
	$scope.generateDocs = function(){
		$scope.generateobj.heads = $scope.heads;
		$.ajax({
				url:"rest/head/copyrows/objectdocs",
				type:"POST",
				data:"generateobj="+JSON.stringify($scope.generateobj),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$rootScope.headfilter = {};
					$rootScope.showFilter = true;
					$rootScope.headfilter.fromDate = $scope.generateobj.date;
					$rootScope.headfilter.toDate = $scope.generateobj.date;
					if ($scope.generateobj.generateDoc.customer == true){
						if ($scope.generateobj.generateDoc.order == true){
							$location.path("/headlist/1/1");
						}else if ($scope.generateobj.generateDoc.invoice == true){
							$location.path("/headlist/1/2");
						}else if ($scope.generateobj.generateDoc.transport == true){
							$location.path("/headlist/1/3");
						}
					}else if ($scope.generateobj.generateDoc.supplier == true){
						if ($scope.generateobj.generateDoc.order == true){
							$location.path("/headlist/2/1");
						}else if ($scope.generateobj.generateDoc.invoice == true){
							$location.path("/headlist/2/2");
						}else if ($scope.generateobj.generateDoc.transport == true){
							$location.path("/headlist/2/3");
						}
					}
						$scope.$apply();
						
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
		})
	}
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".detailview").css("display","none")
	});
}]);
gecoDocumentControllers.controller('CreateOrdersCtrl',["$scope","$http","$routeParams","$location","$rootScope",function($scope,$http,$routeParams,$location,$rootScope){
	$scope.filter = {};
	$scope.generateobj = {};
	
	$http.get('rest/basic/document').success(function(data){
		$scope.documentsTo= data;
	});
	$http.get('rest/basic/groupcustomer').success(function(data){
				$scope.groups= data;
	});
	$scope.generateDocs = function(){
		$scope.generateobj.heads = $scope.heads;
		$.ajax({
				url:"rest/head/createorders",
				type:"POST",
				data:"orders="+JSON.stringify($scope.generateobj),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.heads = result.success;
						$rootScope.headfilter = {};
						$rootScope.showFilter = true;
						$rootScope.headfilter.fromDate = $scope.generateobj.date;
						$rootScope.headfilter.toDate = $scope.generateobj.date;
						$location.path("headlist/1/1");
						$scope.$apply();
						
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
		})
	}
}]);
