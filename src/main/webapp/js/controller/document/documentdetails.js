/**
 * 
 */
angular.module("rocchi.documents")
 .controller('RocchiHeadDetailCtrl',function($scope,$http,$q,$stateParams,$location,$rootScope,$state,$modal,AppConfig,AlertsFactory,LoaderFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$rootScope.issaved = true;
	$scope.headDetailsView = false;
	$scope.headTotalView = false;
	$scope.location = $location;
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
			$state.reload(); 
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
		
	});
	
	$scope.show_qta = false;
	$scope.isOrder = false;
	$scope.isLoadSerialN = false;
	$scope.isUnloadSerialN = false;
	$scope.idhead= $stateParams.idhead;
	$scope.fillHead = function(){
		$scope.fillCustomer();
		for (var i=0;i<$scope.documents.length;i++){
			if ($scope.head.document != null && $scope.head.document.idDocument == $scope.documents[i].idDocument){
				var flow = angular.copy($scope.head.document.flows)
				$scope.head.document = $scope.documents[i]; 
				$scope.head.document.flows = flow;
			}
		}
	}
	LoaderFactory.loader = true;
	$q.all([$http.get(AppConfig.ServiceUrls.ListOfCustomer),
	        $http.get(AppConfig.ServiceUrls.DocumentList),
	        $http.get(AppConfig.ServiceUrls.Promoter)])
	 .then(function(data){
		$scope.customers= data[0].data;
		$scope.documents= data[1].data;
		$scope.promoters= data[2].data;
		$http.get(AppConfig.ServiceUrls.HeadList+$scope.idhead).success(function(data){
			$scope.head= data;
			LoaderFactory.loader = false;
			
			$scope.fillHead();
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
	});
	$scope.fillCustomer = function(){
		if ($scope.customers != undefined && $scope.customers.length >0 && $scope.head != null && $scope.head.customer != null && $scope.currentCustomer == null){
			for (var itx=0;itx<$scope.customers.length;itx++){
				if ($scope.head.customer.idCustomer == $scope.customers[itx].idCustomer){
					$scope.head.customer = $scope.customers[itx]; 
					$scope.destinations = $scope.head.customer.destinations;
					if ($scope.destinations != undefined && $scope.destinations.length >0 && $scope.head.destination != null && $scope.currentDestination == null){
						for (var d=0;d<$scope.destinations.length;d++){
							if ($scope.head.destination != null && $scope.head.destination.idDestination == $scope.destinations[d].idDestination){
								$scope.currentDestination = $scope.destinations[d];
							}
						}
					}
					/*$scope.lists = $scope.head.customer.lists;
					if ($scope.head.customer.lists != null  ){
						if ($scope.lists.length == 1){
							$scope.head.list = $scope.lists[0];
						}else{
							for (var d=0;d<$scope.lists.length;d++){
								//$scope.lists.push($scope.head.customer.lists[d].list);
								if ($scope.lists[d].list != null && $scope.head.list != null && $scope.head.list.idList == $scope.head.customer.lists[d].list.idList){
									$scope.head.list = $scope.head.customer.lists[d].list;
								}
								
							}
						}
						
					}*/
					$http.get(AppConfig.ServiceUrls.ListOfCustomer+$scope.head.customer.idCustomer).success(function(data){
						$scope.lists = [];
						if (data != null){
							
							for (var d=0;d<data.lists.length;d++){
							$scope.lists.push(data.lists[d].list)
								
								
							}
							if ($scope.lists.length == 1){
								$scope.head.list = $scope.lists[0];
							}
						}
				});
					if ($scope.head.customer && $scope.head.customer.promoter){
						$($scope.promoters).each(function(index,item){
							if (item.idPromoter ==  $scope.head.customer.promoter.idPromoter ){
								$scope.head.promoter = item;
							}
						});
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
	
	
	$scope.changeCustomer = function(){
		
		
		/* TODO $http.get('rest/registry/destination/customer/'+idCustomer).success(function(data){
				$scope.destinations= data;
				if ($scope.currentDestination != null){
					for (var d=0;d<$scope.destinations.length;d++){
						if ($scope.currentDestination != null && $scope.currentDestination.idDestination == $scope.destinations[d].idDestination){
							$scope.currentDestination = $scope.destinations[d];
						}
					}
				}
		});*/
		$http.get(AppConfig.ServiceUrls.ListOfCustomer+$scope.head.customer.idCustomer).success(function(data){
				$scope.lists = [];
				if (data != null){
					
					for (var d=0;d<data.lists.length;d++){
					$scope.lists.push(data.lists[d].list)
						
						
					}
					if ($scope.lists.length == 1){
						$scope.head.list = $scope.lists[0];
					}
				}
		});
		if ($scope.head.document != null){
			if (($scope.head.document.credit == true || $scope.head.document.debit == true) && $scope.payments ){
				for(var i=0;i<$scope.payments.length;i++){
					if ($scope.payments[i].idPayment == $scope.currentCustomer.payment.idPayment){
						$scope.currentPayment = $scope.payments[i] 
						//$(".selpayment").trigger("chosen:update");
					}
				}
			}
		}
		if ($scope.head.customer && $scope.head.customer.promoter){
			$($scope.promoters).each(function(index,item){
				if (item.idPromoter ==  $scope.head.customer.promoter.idPromoter ){
					$scope.head.promoter = item;
				}
			});
		}
		if ($scope.head.customer){
			$scope.head.taxrate = $scope.head.customer.taxrate;
		}
	}
	$scope.changeSupplier = function(){
		if ($scope.currentDocument != null){
			if ($scope.currentDocument.credit == true || $scope.currentDocument.debit == true){
				for(var i=0;i<$scope.payments.length;i++){
					if ($scope.payments[i].idPayment == $scope.currentSupplier.payment.idPayment){
						$scope.currentPayment = $scope.payments[i];
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
			$scope.addProduct = true;
			$scope.showRowDetail = true;
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
			$http.post(AppConfig.ServiceUrls.SearchProductCode+code+"/"+idList,$scope.head).success(function(data){
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
					
					$scope.showSearch = true;
				}
			
			})
			/*$.ajax({
					url:AppConfig.ServiceUrls.SearchProductCode+code+"/"+idList,
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
			});*/
			
		}
	}
	$scope.calculateRow = function(row){
		if (row.quantity != "" && row.quantity != null  ){
			$rootScope.setModified();
			$scope.totrowobj = {};
			$scope.totrowobj.qta = parseFloat(row.quantity);
			$scope.totrowobj.taxrate = parseFloat(row.product.taxrate.value);
			$scope.totrowobj.price = parseFloat(row.price);
		}
		$http.post(AppConfig.ServiceUrls.RowTotal,$scope.totrowobj).success(function(result){
			
			
			row.total = result.total;
			row.amount = result.amount;
			row.taxamount = result.taxamount;
			$scope.calculateTotal();
		});
	}
	$scope.setCurrentRow = function(row){
		
		$scope.currentRow = row;
	} 
	$scope.calculateTotal = function(){
		$scope.totrowobj = {};
		$scope.totrowobj.rows = $scope.head.rows;
		$http.post(AppConfig.ServiceUrls.HeadTotal,$scope.totrowobj).success(function(result){
			$scope.head.total =result.total;
			$scope.head.total4 =result.total4;
			$scope.head.total10 =result.total10;
			$scope.head.total20 =result.total20;
			$scope.head.amount =result.amount;
			$scope.head.amount4 =result.amount4;
			$scope.head.amount10 =result.amount10;
			$scope.head.amount20 =result.amount20;
			$scope.head.taxamount =result.taxamount;
			$scope.head.taxamount4 =result.taxamount4;
			$scope.head.taxamount10 =result.taxamount10;
			$scope.head.taxamount20 =result.taxamount20;
			$scope.addRow=true;
		});
	}
	
	$scope.saveHead = function(){
		$scope.checkHead();
	};
	$scope.checkHead = function(){
		$http.post(AppConfig.ServiceUrls.CheckHead,$scope.head).success(function(result){
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
		}).error(function(){
			$scope.isSaving = false;
			$scope.errorMessage(data);
		});
		/*$.ajax({
			url:AppConfig.ServiceUrls.CheckHead,
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
		});*/
	}
	
	$scope.saveHeadChecked = function(){
		LoaderFactory.loader = true;
		$scope.head.payment = $scope.head.customer.payment;
		if ($scope.head.withholdingtax === undefined || $scope.head.withholdingtax === null ){
			$scope.head.withholdingtax = 0;
		}
	     if ($scope.isSaving == false){  
			$scope.isSaving = true;	
			$http.put(AppConfig.ServiceUrls.HeadList,$scope.head).success(function(result){
				if (result.type == "success"){	
					$scope.head = result.success;
					$scope.idhead = $scope.head.idHead;
					$scope.fillHead();
					$rootScope.selectedSection = $scope.selectedSection
					$rootScope.issaved = true;
					LoaderFactory.loader = false;
					$scope.msg.successMessage("Documento salvato con successo")
				}else{
					LoaderFactory.loader = false;
					$scope.errorMessage(result.errorMessage);
				}
                $scope.isSaving = false;
			}).error(function(data){
				$scope.isSaving = false;
				$scope.errorMessage(data);
				LoaderFactory.loader = false;
			}	)
				/*$.ajax({
					url:AppConfig.ServiceUrls.HeadList,
					type:"PUT",
					data:"heads="+JSON.stringify($scope.head),
					success:function(data){
						
						result = JSON.parse(data);
						if (result.type == "success"){	
							$scope.head = result.success;
							$scope.idhead = $scope.head.idHead;
							$scope.fillHead();
							$scope.$apply();
							$rootScope.selectedSection = $scope.selectedSection
							$rootScope.issaved = true;
							LoaderFactory.loader = false;
							$scope.msg.successMessage("Documento salvato con successo")
						}else{
							LoaderFactory.loader = false;
							$scope.errorMessage(result.errorMessage);
						}
                        $scope.isSaving = false;						
					},
					error:function(data){
						$scope.isSaving = false;
						$scope.errorMessage(data);
						LoaderFactory.loader = false;
					}		
				});*/
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
					    $scope.head.number = yearsvalue[i].value;
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
			$http.get(AppConfig.ServiceUrls.PrintHead+$scope.head.idHead).success(function(result){
				var deviceAgent = navigator.userAgent;
				// Set var to iOS device name or null
				var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
				if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				 // some code..
				}
				if (ios) {
					// This is the line that matters
					$scope.openTab(result.url);
				} else {
					// Your code that works for desktop browsers
					window.open(result.url);
				}
			})
		/*$.ajax({
				url:AppConfig.ServiceUrls.PrintHead+$scope.head.idHead,
				type:"GET",
				success:function(data){
					result = JSON.parse(data);
					
					var deviceAgent = navigator.userAgent;
							// Set var to iOS device name or null
							var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
							if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
							 // some code..
							}
							if (ios) {
								// This is the line that matters
								$scope.openTab(result.url);
							} else {
								// Your code that works for desktop browsers
								window.open(result.url);
							}
				}	
			});*/
		}
	}
	$scope.search = "";
	$scope.searchProd = function(code){
		
		var modalInstance = $modal.open({
		      templateUrl: 'template/document/SearchProduct.html',
		      controller: 'ProductSearchCtrl',
		      resolve: {
		    	  searchstring: function () {
		          return code;
		        },head:function(){
		        	return $scope.head;
		        }
		      }
		    });

		    modalInstance.result.then(function (products) {
		      angular.forEach(products,function(value,index){
		    	  //var newRow = {};
		    	  if (index > 0){
		    		  $scope.head.rows.push($scope.currentRow);
		    	  }
		    	  $scope.currentRow.product = value.product;
		    	  $scope.currentRow.productcode = value.code;
		    	  $scope.currentRow.productdescription = value.product.description;
		    	  $scope.currentRow.price = value.product.listprice;
		    	  $scope.currentRow.taxrate = value.product.taxrate;
		    	  $scope.currentRow.productum = value.um.code;
		    	  $scope.currentRow.um = value.um;
		    	  $scope.currentRow.type = "V";
		    	  $scope.currentRow.quantity  = value.quantity;
				  //$scope.calculateRow($scope.currentRow);
				  $scope.currentRow = {};
		      });
		      $http.post(AppConfig.ServiceUrls.HeadAllTotal,$scope.head).success(function(result){
		    	  $scope.head = result;
		    	  $scope.fillHead();
		      });
		    }, function () {
		      //$log.info('Modal dismissed at: ' + new Date());
		    });
		
	}
	$scope.insertProduct = function(code){
		$scope.getProduct(code);
		$scope.showSearch = false;
	}
	$scope.closeSearch = function(){
		$scope.showSearch = false;
	}
	$scope.goBack = function(){
    	$location.path("/welcome_customer")
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
			$state.reload();
		}
	}
	$scope.addNewRowFromQuantity = function(e){
		if (e.keyCode == 13 && $scope.currentRow.quantity != ""){
			$scope.addRowElement();
			$scope.$apply();
			$("#prod_code").focus();
		}
	};
	$scope.addNewProduct = function(){
		$rootScope.headScope = $scope;
		$scope.showSearch = false;
		$rootScope.newProductToAdd = $scope.currentRow.productcode;
		$location.path("/product/0");
	};
	$scope.updateRow = function(row){
		$scope.currentRow = row;
		$scope.showRowDetail = true;
	}
	$scope.generateDocument = function(document){
		var generateobj = {};
		generateobj.generateDoc = document;
		generateobj.heads=[];
		generateobj.heads.push($scope.head);
		generateobj.customer = $scope.head.customer;
		generateobj.date = $scope.head.date;
		generateobj.groupByCustomer = document.customer;
		$scope.head.generate = true;
		angular.forEach($scope.head.rows,function(value){value.generate = true;})
		$http.post(AppConfig.ServiceUrls.GenerateHeads,generateobj).success(function(result){
			$http.get(AppConfig.ServiceUrls.HeadList+$scope.idhead).success(function(data){
				$scope.head= data;
			});
		})
	}
}).controller("ProductSearchCtrl",function($scope,$http,$modalInstance,AppConfig,searchstring,head){
	$scope.search = searchstring;
	if ($scope.search != "" && $scope.search != undefined){
		$http.post(AppConfig.ServiceUrls.SearchProduct+$scope.search,head).success(function(data){
			if (data.length >0){
				
				$scope.products = data;
				
			}else{
				alert("Nessun prodotto trovato");
			}
		})
	}
	$scope.selectProduct = function(prod){
		prod.added= true;
		prod.quantity = 1;
	}
	$scope.unselectProduct = function(prod){
		prod.added= false;
		prod.quantity = 0;
	}
	$scope.addProducts = function() {
		var products = $.grep($scope.products,function(item){return item.added == true;});
	    $modalInstance.close(products);
	  };
	$scope.close = function() {
	    $modalInstance.dismiss('cancel');
	  };
});

