var gecoBasicControllers = angular.module("gecoBasicControllers",[]);

/*****
TAXRATE
***/
gecoBasicControllers.controller('TaxrateCtrl',function($scope,$http,$modal,$rootScope){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.taxratesaved = true;
	$http.get('rest/basic/taxrate').success(function(data){
		$scope.taxrates= data;
	});
	$scope.modifyid = 0;
	$scope.modifyTaxrateElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addTaxrateElement = function(id){
		$scope.taxratesaved = false;
		$scope.taxrates.push({idtaxrate:0});
	}
	$scope.deleteTaxrateElement = function(id){
		for(var i=0;i<$scope.taxrates.length;i++){
			if (id == $scope.taxrates[i].idtaxrate){
				$scope.deleteTaxrate = $scope.taxrates[i];
				$.ajax({
						url:"rest/basic/taxrate/",
						type:"DELETE",
						data:"taxrateobj="+JSON.stringify($scope.deleteTaxrate),
						success:function(data){
								$http.get('rest/basic/taxrate').success(function(data){
										$scope.taxrates= data;
										$scope.$apply();
								});
								
						}	
					})
			}	
		}
	}
	$scope.saveTaxrates = function(){
		$.ajax({
			url:"rest/basic/taxrate",
			type:"PUT",
			data:"taxrates="+JSON.stringify($scope.taxrates),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.taxratesaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$rootScope.confirmSaved();
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}	
					
			},
			error:function(date){
				alert("Errore nel salvataggio");
			}
			
		})
		
	}
	$scope.deleteElement = function (id) {

	    var modalInstance = $modal.open({
	      templateUrl: 'template/alert/cancelalert.html',
	      controller: 'ModalCancelCtrl',
	      resolve: {
	    	  cancelObj: function () {
	          return id;
	        }
	      }
	    });

	    modalInstance.result.then(function (id) {
	    	$scope.deleteTaxrateElement(id);
	    });
	  };
	
});
/*****
Store Movement
***/
gecoBasicControllers.controller('StoreMovementCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.storemovementsaved = true;
	$http.get('rest/basic/storemovement').success(function(data){
		$scope.storemovements= data;
	});
	$scope.modifyid = 0;
	$scope.modifystoremovementElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addstoremovementElement = function(id){
		$scope.storemovementsaved = false;
		$scope.storemovements.push({idstoremovement:0});
	}
	$scope.deletestoremovementElement = function(id){
		for(var i=0;i<$scope.storemovements.length;i++){
			if (id == $scope.storemovements[i].idstoremovement){
				$scope.deletestoremovement = $scope.storemovements[i];
				$.ajax({
						url:"rest/basic/storemovement/",
						type:"DELETE",
						data:"smobj="+JSON.stringify($scope.deletestoremovement),
						success:function(data){
								$http.get('rest/basic/storemovement').success(function(data){
										$scope.storemovements= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savestoremovements = function(){
		$.ajax({
			url:"rest/basic/storemovement",
			type:"PUT",
			data:"sms="+JSON.stringify($scope.storemovements),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.storemovementsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/storemovement').success(function(data){
						$scope.storemovements= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
					
					
			}	
		})
		
	}
	
	
}]);

/*****
Counter
***/
gecoBasicControllers.controller('CounterCtrl',function($scope,$http,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
    $scope.countersaved = true;
	$scope.orderYear="year";
	
	$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
		$scope.counters= data;
	});
	$scope.modifyid = 0;
	$scope.modifycounterElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
			$scope.detailViewOpen(id);
		}else{
			$scope.modifyid = 0;
			$scope.detailViewClose(id);
		}
	}
	$scope.addcounterElement = function(id){
		$scope.countersaved = false;
		$scope.counters.push({idCounter:0});
	}
	$scope.deletecounterElement = function(id){
		for(var i=0;i<$scope.counters.length;i++){
			if (id == $scope.counters[i].idCounter){
				$scope.deletecounter = $scope.counters[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Counter,
						type:"DELETE",
						data:"counterobj="+JSON.stringify($scope.deletecounter),
						success:function(data){
								$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
										$scope.counters= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savecounters = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.CounterSave,
			type:"PUT",
			data:"counters="+JSON.stringify($scope.counters),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.countersaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
										$scope.counters= data;
								});

				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
			}	
		})
	}
	$scope.detailView = function(id){
		
		if ($("#detail"+id).hasClass("open")){
			$scope.detailViewOpen(id);
		}else{
			$scope.detailViewClose(id);
		}
	}
	$scope.detailViewOpen = function(id){
		$("#detail"+id).removeClass("open");
		$("#detail"+id).addClass("close");
		$("#detailview"+id).css("display","");
	}
	$scope.detailViewClose = function(id){
		$("#detail"+id).removeClass("close");
			$("#detail"+id).addClass("open");
			$("#detailview"+id).css("display","none");
	}
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".detailview").css("display","none")
	});
});
/*****
Payment
***/
gecoBasicControllers.controller('PaymentCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.paymentsaved = true;
	$http.get('rest/basic/payment').success(function(data){
		$scope.payments= data;
	});
	$scope.modifyid = 0;
	$scope.modifypaymentElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
			$scope.detailViewOpen(id);
		}else{
			$scope.modifyid = 0;
			$scope.detailViewClose(id);
		}
	}
	
	$scope.addpaymentElement = function(id){
		$scope.paymentsaved = false;
		$scope.payments.push({idPayment:0});
	}
	$scope.addDeadlineElement = function(payment){
		if ($scope.paymentsaved == true){
			$scope.paymentsaved = false;
			payment.deadlines.push({idPaymentDeadline:0});
			$scope.detailViewOpen(payment.idPayment);
		}
	}
	$scope.deletepaymentElement = function(id){
		for(var i=0;i<$scope.payments.length;i++){
			if (id == $scope.payments[i].idPayment){
				$scope.deletepayment = $scope.payments[i];
				$.ajax({
						url:"rest/basic/payment/",
						type:"DELETE",
						data:"paymentobj="+JSON.stringify($scope.deletepayment),
						success:function(data){
								$http.get('rest/basic/payment').success(function(data){
										$scope.payments= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savepayments = function(){
		$.ajax({
			url:"rest/basic/payment",
			type:"PUT",
			data:"payments="+JSON.stringify($scope.payments),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.paymentsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/payment').success(function(data){
						$scope.payments= data;
					});

				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}



									
			}	
		})
		
	}
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".detailview").css("display","none")
	});
	$scope.detailView = function(id){
		
		if ($("#detail"+id).hasClass("open")){
			$scope.detailViewOpen(id);
		}else{
			$scope.detailViewClose(id);
		}
	}
	$scope.detailViewOpen = function(id){
		$("#detail"+id).removeClass("open");
		$("#detail"+id).addClass("close");
		$("#detailview"+id).css("display","");
	}
	$scope.detailViewClose = function(id){
		$("#detail"+id).removeClass("close");
			$("#detail"+id).addClass("open");
			$("#detailview"+id).css("display","none");
	}
}]);
/*****
Document
***/
gecoBasicControllers.controller('DocumentCtrl',function($scope,$http,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
    $scope.documentsaved = true;
	$scope.currentStore = null;
	$scope.currentCounter = null;
	$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
		$scope.counters= data;
	});
	$http.get(AppConfig.ServiceUrls.StoreMovement).success(function(data){
		$scope.storemovements= data;
	});
	$http.get(AppConfig.ServiceUrls.Document).success(function(data){
		$scope.documents= data;
	});
	$scope.modifyid = 0;
	$scope.modifydocumentElement = function(doc){
		if ($scope.modifyid != doc.idDocument){
			for(var i=0;i<$scope.storemovements.length;i++){
				if($scope.storemovements[i].idstoremovement == doc.storemovement.idstoremovement){
					$scope.currentStore = $scope.storemovements[i];
					
				}
			}
			for(var i=0;i<$scope.counters.length;i++){
				if($scope.counters[i].idCounter == doc.counter.idCounter){
					$scope.currentCounter = $scope.counters[i];
					
				}
			}
			$scope.modifyid = doc.idDocument;
		}else{
			$scope.modifyid = 0;
		}
		
		
		
	}
	$scope.changeCounter = function(doc){
		doc.counter = $scope.currentCounter;
	}
	$scope.changeStore = function(doc){
		doc.storemovement = $scope.currentStore;
	}
	$scope.adddocumentElement = function(id){
		$scope.documentsaved = false;
		$scope.documents.push({idDocument:0});
	}
	$scope.deletedocumentElement = function(id){
		for(var i=0;i<$scope.documents.length;i++){
			if (id == $scope.documents[i].idDocument){
				$scope.deletedocument = $scope.documents[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Document,
						type:"DELETE",
						data:"documentobj="+JSON.stringify($scope.deletedocument),
						success:function(data){
								$http.get(AppConfig.ServiceUrls.Document).success(function(data){
										$scope.documents= data;
								});
								
						}	
					})
			}	
		}
	}
	
	$scope.savedocuments = function(){
		
		$.ajax({
			url:AppConfig.ServiceUrls.Document,
			type:"PUT",
			data:"documents="+JSON.stringify($scope.documents),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.documentsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get(AppConfig.ServiceUrls.Document).success(function(data){
							$scope.documents= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
					
					
			}	
		})
		
	}
	
	
});
/*****
Unit Measure
***/
gecoBasicControllers.controller('UnitmeasureCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.umsaved = true;
	$http.get('rest/basic/unitmeasure').success(function(data){
		$scope.ums= data;
	});
	$scope.modifyid = 0;
	$scope.modifyUmElement = function(id){
		$scope.modifyid = id;
	}
	$scope.addUmElement = function(id){
		$scope.umsaved = false;
		$scope.ums.push({idUnitMeasure:0});
	}
	$scope.deleteUmElement = function(id){
		for(var i=0;i<$scope.ums.length;i++){
			if (id == $scope.ums[i].idUnitMeasure){
				$scope.deleteUm = $scope.ums[i];
				$.ajax({
						url:"rest/basic/unitmeasure/",
						type:"DELETE",
						data:"umobj="+JSON.stringify($scope.deleteUm),
						success:function(data){
								$http.get('rest/basic/unitmeasure').success(function(data){
										$scope.ums= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.saveUms = function(){
		$.ajax({
			url:"rest/basic/unitmeasure",
			type:"PUT",
			data:"ums="+JSON.stringify($scope.ums),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.umsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/unitmeasure').success(function(data){
							$scope.ums= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}		
			}	
		})
		
	}
	
	
}]);

/*****
Group Product
***/
gecoBasicControllers.controller('GroupProductCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.groupproductsaved = true;
	$http.get('rest/basic/groupproduct').success(function(data){
		$scope.groupproducts= data;
	});
	$scope.modifyid = 0;
	$scope.modifygroupproductElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addgroupproductElement = function(id){
		$scope.groupproductsaved = false;
		$scope.groupproducts.push({idGroupProduct:0});
	}
	$scope.deletegroupproductElement = function(id){
		for(var i=0;i<$scope.groupproducts.length;i++){
			if (id == $scope.groupproducts[i].idGroupProduct){
				$scope.deletegroupproduct = $scope.groupproducts[i];
				$.ajax({
						url:"rest/basic/groupproduct/",
						type:"DELETE",
						data:"groupproductobj="+JSON.stringify($scope.deletegroupproduct),
						success:function(data){
								$http.get('rest/basic/groupproduct').success(function(data){
										$scope.groupproducts= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savegroupproducts = function(){
		$.ajax({
			url:"rest/basic/groupproduct",
			type:"PUT",
			data:"groupproducts="+JSON.stringify($scope.groupproducts),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.groupproductsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/groupproduct').success(function(data){
						$scope.groupproducts= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}	
					
					
			}	
		})
		
	}
	
	
}]);
/*****
categoryproduct
***/
gecoBasicControllers.controller('CategoryProductCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.categoryproductsaved = true;
	$http.get('rest/basic/categoryproduct').success(function(data){
		$scope.categoryproducts= data;
	});
	$scope.modifyid = 0;
	$scope.modifycategoryproductElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
			$scope.detailViewOpen(id);
		}else{
			$scope.modifyid = 0;
			$scope.detailViewClose(id);
		}
	}
	
	$scope.addcategoryproductElement = function(id){
		$scope.categoryproductsaved = false;
		$scope.categoryproducts.push({idcategoryproduct:0});
	}
	$scope.addSubCategoryElement = function(categoryproduct){
		if ($scope.categoryproductsaved == true){
			$scope.categoryproductsaved = false;
			categoryproduct.subcategories.push({idSubCategoryProduct:0});
			$scope.detailViewOpen(categoryproduct.idCategoryProduct);
		}
	}
	$scope.deletecategorycustomerElement = function(id){
		for(var i=0;i<$scope.categoryproducts.length;i++){
			if (id == $scope.categoryproducts[i].idcategoryproduct){
				$scope.deletecategoryproduct = $scope.categoryproducts[i];
				$.ajax({
						url:"rest/basic/categoryproduct/",
						type:"DELETE",
						data:"categoryproductobj="+JSON.stringify($scope.deletecategoryproduct),
						success:function(data){
								$http.get('rest/basic/categoryproduct').success(function(data){
										$scope.categoryproducts= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savecategoryproducts = function(){
		$.ajax({
			url:"rest/basic/categoryproduct",
			type:"PUT",
			data:"categoryproducts="+JSON.stringify($scope.categoryproducts),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.categoryproductsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/categoryproduct').success(function(data){
						$scope.categoryproducts= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}	
					
					
			}	
		})
		
	}
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".detailview").css("display","none")
	});
	$scope.detailView = function(id){
		
		if ($("#detail"+id).hasClass("open")){
			$scope.detailViewOpen(id);
		}else{
			$scope.detailViewClose(id);
		}
	}
	$scope.detailViewOpen = function(id){
		$("#detail"+id).removeClass("open");
		$("#detail"+id).addClass("close");
		$("#detailview"+id).css("display","");
	}
	$scope.detailViewClose = function(id){
		$("#detail"+id).removeClass("close");
			$("#detail"+id).addClass("open");
			$("#detailview"+id).css("display","none");
	}
}]);






/*****
Customer Category
***/
gecoBasicControllers.controller('CustomerCategoryListCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.customercategorysaved = true;
	$http.get('rest/basic/categorycustomer').success(function(data){
		$scope.customercategorys= data;
	});
	$scope.modifyid = 0;
	$scope.modifycustomercategoryElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addcustomercategoryElement = function(id){
		$scope.customercategorysaved = false;
		$scope.customercategorys.push({idCategoryCustomer:0});
	}
	$scope.deletecustomercategoryElement = function(id){
		for(var i=0;i<$scope.customercategorys.length;i++){
			if (id == $scope.customercategorys[i].idCategoryCustomer){
				$scope.deletecustomercategory = $scope.customercategorys[i];
				$.ajax({
						url:"rest/basic/categorycustomer/",
						type:"DELETE",
						data:"categorycustomerobj="+JSON.stringify($scope.deletecustomercategory),
						success:function(data){
								$http.get('rest/basic/categorycustomer').success(function(data){
										$scope.customercategorys= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savecustomercategorys = function(){
		$.ajax({
			url:"rest/basic/categorycustomer",
			type:"PUT",
			data:"categorycustomers="+JSON.stringify($scope.customercategorys),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.customercategorysaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/categorycustomer').success(function(data){
						$scope.customercategorys= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
										
			}	
		})
		
	}
	
	
}]);


/*****
Group Category
***/
gecoBasicControllers.controller('CustomerGroupListCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.customergroupsaved = true;
	$http.get('rest/basic/groupcustomer').success(function(data){
		$scope.customergroups= data;
	});
	$scope.modifyid = 0;
	$scope.modifycustomergroupElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addcustomergroupElement = function(id){
		$scope.customergroupsaved = false;
		$scope.customergroups.push({idGroupCustomer:0});
	}
	$scope.deletecustomergroupElement = function(id){
		for(var i=0;i<$scope.customergroups.length;i++){
			if (id == $scope.customergroups[i].idGroupCustomer){
				$scope.deletecustomergroup = $scope.customergroups[i];
				$.ajax({
						url:"rest/basic/groupcustomer/",
						type:"DELETE",
						data:"groupcustomerobj="+JSON.stringify($scope.deletecustomergroup),
						success:function(data){
								$http.get('rest/basic/groupcustomer').success(function(data){
										$scope.customergroups= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savecustomergroups = function(){
		$.ajax({
			url:"rest/basic/groupcustomer",
			type:"PUT",
			data:"groupcustomers="+JSON.stringify($scope.customergroups),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.customergroupsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/groupcustomer').success(function(data){
						$scope.customergroups= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
				
					
			}	
		})
		
	}
	
	
}]);







/*****
Supplier Category
***/
gecoBasicControllers.controller('SupplierCategoryListCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.suppliercategorysaved = true;
	$http.get('rest/basic/categorysupplier').success(function(data){
		$scope.suppliercategorys= data;
	});
	$scope.modifyid = 0;
	$scope.modifysuppliercategoryElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addsuppliercategoryElement = function(id){
		$scope.suppliercategorysaved = false;
		$scope.suppliercategorys.push({idCategorySupplier:0});
	}
	$scope.deletesuppliercategoryElement = function(id){
		for(var i=0;i<$scope.suppliercategorys.length;i++){
			if (id == $scope.suppliercategorys[i].idCategorySupplier){
				$scope.deletesuppliercategory = $scope.suppliercategorys[i];
				$.ajax({
						url:"rest/basic/categorysupplier/",
						type:"DELETE",
						data:"categorysupplierobj="+JSON.stringify($scope.deletesuppliercategory),
						success:function(data){
								$http.get('rest/basic/categorysupplier').success(function(data){
										$scope.suppliercategorys= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savesuppliercategorys = function(){
		$.ajax({
			url:"rest/basic/categorysupplier",
			type:"PUT",
			data:"categorysuppliers="+JSON.stringify($scope.suppliercategorys),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.suppliercategorysaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/categorysupplier').success(function(data){
						$scope.suppliercategorys= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
				
					
			}	
		})
		
	}
	
	
}]);


/*****
Group Category
***/
gecoBasicControllers.controller('SupplierGroupListCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.suppliergroupsaved = true;
	$http.get('rest/basic/groupsupplier').success(function(data){
		$scope.suppliergroups= data;
	});
	$scope.modifyid = 0;
	$scope.modifysuppliergroupElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addsuppliergroupElement = function(id){
		$scope.suppliergroupsaved = false;
		$scope.suppliergroups.push({idGroupSupplier:0});
	}
	$scope.deletesuppliergroupElement = function(id){
		for(var i=0;i<$scope.suppliergroups.length;i++){
			if (id == $scope.suppliergroups[i].idGroupSupplier){
				$scope.deletesuppliergroup = $scope.suppliergroups[i];
				$.ajax({
						url:"rest/basic/groupsupplier/",
						type:"DELETE",
						data:"groupsupplierobj="+JSON.stringify($scope.deletesuppliergroup),
						success:function(data){
								$http.get('rest/basic/groupsupplier').success(function(data){
										$scope.suppliergroups= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savesuppliergroups = function(){
		$.ajax({
			url:"rest/basic/groupsupplier",
			type:"PUT",
			data:"groupsuppliers="+JSON.stringify($scope.suppliergroups),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.suppliergroupsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/groupsupplier').success(function(data){
						$scope.suppliergroups= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
				
			}	
		})
		
	}

}]);	
/*****
Brand
***/
gecoBasicControllers.controller('BrandCtrl',["$scope","$http",function($scope,$http){
    //$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.brandsaved = true;
	$http.get('rest/basic/brand').success(function(data){
		$scope.brands= data;
	});
	$scope.modifyid = 0;
	$scope.modifybrandElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addbrandElement = function(id){
		$scope.brandsaved = false;
		$scope.brands.push({idBrand:0});
	}
	$scope.deletebrandElement = function(id){
		for(var i=0;i<$scope.brands.length;i++){
			if (id == $scope.brands[i].idBrand){
				$scope.deletebrand = $scope.brands[i];
				$.ajax({
						url:"rest/basic/brand/",
						type:"DELETE",
						data:"brandobj="+JSON.stringify($scope.deletebrand),
						success:function(data){
								$http.get('rest/basic/brand').success(function(data){
										$scope.brands= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.savebrands = function(){
		$.ajax({
			url:"rest/basic/brand",
			type:"PUT",
			data:"brands="+JSON.stringify($scope.brands),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.brandsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get('rest/basic/brand').success(function(data){
						$scope.brands= data;
					});
				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
				
			}	
		})
		
	}	
	
}]);