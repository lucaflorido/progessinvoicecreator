var gecoRegistryControllers = angular.module("gecoRegistryControllers",[]);

/*****
REGISTRY
***/
gecoRegistryControllers.controller('CompanyCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$scope.companysaved = true;
	$http.get(AppConfig.ServiceUrls.Company+AppConfig.Const.CompanyId).success(function(result){
		$scope.company = result;
	});
	$scope.savecompany = function(){
		$http.post(AppConfig.ServiceUrls.Company,$scope.company).success(function(result){
			if (result.type == "success"){
				$http.get(AppConfig.ServiceUrls.Company+AppConfig.Const.CompanyId).success(function(result){
					$scope.company = result;
					$scope.msg.successMessage("AZIENDA SALVATA CON SUCCESSO");
				});
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
		}).error(function(error){
			$scope.msg.alertMessage(error);
		});
	}
	$scope.addMailObject = function(){
		if (!$scope.company.mailconfig){
			$scope.company.mailconfig = [];
		}
		$scope.company.mailconfig.push({});
	}
	$scope.deleteMailConfig = function(mc){
		$http.post(AppConfig.ServiceUrls.CompanyMailConfigDelete,mc).success(function(result){
			if (result.type == "success"){
				$scope.msg.successMessage("EMAIL ELIMINATA CON SUCCESSO");
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
			$http.get(AppConfig.ServiceUrls.Company+AppConfig.Const.CompanyId).success(function(result){
				$scope.company = result;
			});
		});
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
	    	$scope.deleteMailConfig(id);
	    });
	  };
});
gecoRegistryControllers.controller('CompanyEcCtrl',function($scope,$http,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$scope.companysaved = true;
	$scope.draftaddress = {};
	$http.get(AppConfig.ServiceUrls.Company+AppConfig.Const.CompanyId).success(function(result){
		$scope.company = result;
		$http.get(AppConfig.ServiceUrls.Currency).success(function(result){
			$scope.currencies = result;
			if($scope.company.currency){
				angular.forEach($scope.currencies,function(value){
					if (value.idcurrency == $scope.company.currency.idcurrency){
						$scope.company.currency = value;
					}
				});
			}
			
		});
		angular.forEach($scope.company.ecdelivery.deliverycountry,function(value){
			if (value.deliveryzones && value.deliveryzones.length > 0){
				value.showZoneRule = true;
			}
			if (value.deliverycities && value.deliverycities.length > 0){
				value.showCityRule = true;
			}
		});
	});
	$scope.savecompany = function(){
		$http.post(AppConfig.ServiceUrls.Delivery,$scope.company).success(function(result){
			if (result.type == "success"){
				$http.get(AppConfig.ServiceUrls.Company+AppConfig.Const.CompanyId).success(function(result){
					$scope.company = result;
					angular.forEach($scope.company.ecdelivery.deliverycountry,function(value){
						if (value.deliveryzones){
							value.showZoneRule = true;
						}
					});
					$scope.msg.successMessage("CONFIGURAZIONE SALVATA CON SUCCESSO");
				});
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
		}).error(function(error){
			$scope.msg.alertMessage(error);
		});
	}
	$scope.addPaymentConfig = function(payment){
		if(!$scope.company.ecpayments){
			$scope.company.ecpayments = [];
		}
		$scope.company.ecpayments.push({ecpayment:{paysolution:payment}});
	}
	$scope.addMailObject = function(){
		if (!$scope.company.mailconfig){
			$scope.company.mailconfig = [];
		}
		$scope.company.mailconfig.push({});
	}
	$scope.initialize = function(){
		$http.get(AppConfig.ServiceUrls.Country).success(function(result){
			$scope.countries = result;
		});
		$http.get(AppConfig.ServiceUrls.PaymentsSolution).success(function(result){
			$scope.paymentsols = result;
		});
		
	}
	$scope.initialize();
	$scope.addRule = function(){
		if (!$scope.company.ecdelivery.deliverycountry){
			$scope.company.ecdelivery.deliverycountry = [];
		}
		$scope.company.ecdelivery.deliverycountry.push({deliverycountry:{country:$scope.countrySelected}});
	}
	$scope.showZones = function(dc){
		dc.showZoneRule = true;
		$http.get(AppConfig.ServiceUrls.Zone+dc.deliverycountry.country.idCountry).success(function(result){
			dc.zones = result;
		});
	}
	$scope.addZoneRule = function(dc){
		if (!dc.deliveryzones){
			dc.deliveryzones = [];
		}
		dc.deliveryzones.push({zone:dc.zoneSelected});
	}
	
	$scope.showCities = function(dc){
		dc.showCityRule = true;
		$http.get(AppConfig.ServiceUrls.CityCountry+dc.deliverycountry.country.idCountry).success(function(result){
			dc.cities = result;
		});
	}
	$scope.addCityRule = function(dc){
		if (!dc.deliverycities){
			dc.deliverycities = [];
		}
		dc.deliverycities.push({city:dc.citySelected});
	}
	
});
gecoRegistryControllers.controller('BankListCtrl',["$scope","$http",function($scope,$http){
    
	$http.get('rest/registry/bank').success(function(data){
		$scope.banks= data;
	});
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.banks.length;i++){
			if (id == $scope.banks[i].idBank){
				$scope.deletebank = $scope.banks[i];
				$.ajax({
						url:"rest/registry/bank/",
						type:"DELETE",
						data:"bankobj="+JSON.stringify($scope.deletebank),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/bank').success(function(data){
								$scope.banks= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data, '_blank');
		});
	}
	
}]);
gecoRegistryControllers.controller('BankDetailCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    GECO_LOGGEDUSER.checkloginuser();
	GECO_validator.startupvalidator();
	$scope.idbank= $routeParams.idbank ;
	
	$http.get('rest/registry/bank/'+$scope.idbank).success(function(data){
		$scope.bank= data;
	});
	
	$scope.saveBank = function(){
	//if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			$.ajax({
				url:"rest/registry/bank",
				type:"PUT",
				data:"banks="+JSON.stringify($scope.bank),
				success:function(data){
					alert("success");
				}	
			})
		//}
	} ;
	
}]);


gecoRegistryControllers.controller('ProductListCtrl',["$scope","$rootScope","$http","ScopeFactory","$location",function($scope,$rootScope,$http,ScopeFactory,$location){
    $("#maincontainer_productlist").focus();
	$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	
	$(document).unbind("keydown");
	$(document).keydown(function(e){
		if(e.altKey && e.keyCode == 78 ){
			$location.path("/product/0");
			$scope.$apply();
		}
		if(e.altKey && e.keyCode == 80 ){
		    $scope.printElements();
			$scope.$apply();
	   }
	});
	
	if ($scope.pagesize == null ){
		$scope.pagesize = 99;
		
	}else{
		//$scope.pagesize = ScopeFactory.factory.productList.pagesize
	}
	$scope.pageArray = [];
	if ($scope.showFilter == null){
		$scope.showFilter = false;
	}
	if ($scope.filter == null){
		$scope.filter = {"pagefilter":{}};
		$scope.currentGroup = {};
		$scope.currentBrand = {};
		$scope.currentCategory = {};
		$scope.currentSubCategory = {};
		$scope.currentSupplier = {};
	}else{
		$scope.currentGroup = $scope.filter.group;
		$scope.currentBrand = $scope.filter.brand;
		$scope.currentCategory = $scope.filter.category;
		$scope.currentSubCategory = $scope.filter.subcategory;
		$scope.currentSupplier = $scope.filter.supplier;
	}
	$scope.products = [];
	$scope.updateProd = {};
	$http.get('rest/basic/categoryproduct').success(function(data){
		$scope.categorys= data;
		/*for (var i=0;i<$scope.categorys.length;i++){
			if ($scope.currentCategory.idCategoryProduct == $scope.categorys[i].idCategoryProduct){
				$scope.currentCategory = $scope.categorys[i];
				$scope.subcategories = $scope.currentCategory.subcategories		
				if ($scope.filter.subcategory != null){
					for (var y=0;y<$scope.subcategories.length;y++){
						if ($scope.currentSubCategory.idSubCategoryProduct == $scope.subcategories[i].idSubCategoryProduct){
							$scope.currentSubCategory = $scope.subcategories[i];
						}
					}
				}else{
					$scope.currentSubCategory = null;
				}
			}
		}*/
	});
	
	$http.get('rest/basic/brand').success(function(data){
		$scope.brands= data;
		/*for (var i=0;i<$scope.brands.length;i++){
			if ($scope.currentBrand.idBrand == $scope.brands[i].idBrand){
				$scope.currentBrand = $scope.brands[i];
			}
		}*/
	});
	$http.get('rest/registry/supplier').success(function(data){
		$scope.suppliers= data;
		/*for (var i=0;i<$scope.suppliers.length;i++){
			if ($scope.currentSupplier.idSupplier == $scope.suppliers[i].idSupplier){
				$scope.currentSupplier = $scope.suppliers[i];
			}
		}*/
	});	
	$http.get('rest/basic/groupproduct').success(function(data){
		$scope.groups= data;
		/*for (var i=0;i<$scope.groups.length;i++){
			if ($scope.currentGroup.idGroupProduct == $scope.groups[i].idGroupProduct){
				$scope.currentGroup = $scope.groups[i];
			}
		}*/
	});
	
	$scope.getProducts = function(page){
			$(".pag").removeClass("selected");
			$("#pag"+page).addClass("selected");
			$scope.filter.pagefilter.startelement = (page - 1 ) * $scope.pagesize;
			$scope.filter.pagefilter.pageSize = $scope.pagesize;
			$rootScope.filter = $scope.filter
			$.ajax({
				url:"rest/registry/products",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filter),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.products = result.success;
						$scope.$apply();
						$("#maincontainer_productlist").focus();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
					
				}
				});
	}
	
	$scope.getProductsNumber = function(){
		$rootScope.pagesize = $scope.pagesize;
		if ($scope.products.length != $scope.pagesize){
		$scope.pages = [];
		$scope.pageArray = [];
			$.ajax({
				url:"rest/registry/product/pages/"+$scope.pagesize,
				type:"GET",
				success:function(data){
						$scope.pages= JSON.parse(data);
						for (var i=0;i<$scope.pages;i++){
							$scope.pageArray.push(i+1);
						}
						$scope.$apply();
						$scope.getProducts(1);
						$("#maincontainer_productlist").focus();
					}
				
						
				})
		}
	}
	$scope.getProductsNumber();
	
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.products.length;i++){
			if (id == $scope.products[i].idProduct){
				$scope.deleteproduct = $scope.products[i];
				$.ajax({
						url:"rest/registry/product/",
						type:"DELETE",
						data:"productobj="+JSON.stringify($scope.deleteproduct),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/product').success(function(data){
								$scope.products= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$.ajax({
						url:"rest/print/products/",
						type:"POST",
						data:"filter="+JSON.stringify($scope.filter),
						success:function(data){
							//alert("Utente eliminato con successo");
							window.open(JSON.parse(data), '_blank');
						}	
					})
	}
	$scope.openIncrement = function(){
		if ($scope.showIncrement == true){
			$scope.showIncrement = false;
			$scope.showFilter = false;
		}else{
			$scope.showIncrement = true;
			$scope.showFilter = true;
		}
		$rootScope.showFilter = $scope.showFilter;
		$rootScope.showIncrement = $scope.showIncrement;
	}
	$scope.incrementPrices = function(){
		$.ajax({
				url:"rest/registry/product/increment/",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filter),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						
						$scope.getProductsNumber();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			});
	}
	$scope.changeCategory = function(){
		$scope.filter.category = $scope.currentCategory;
		$scope.subcategories = $scope.currentCategory.subcategories		
		$scope.currentSubCategory = null;
	}
}]);
gecoRegistryControllers.controller('ProductDetailCtrl',["$scope","$http","$routeParams","$location","$rootScope",function($scope,$http,$routeParams,$location,$rootScope){
    GECO_LOGGEDUSER.checkloginuser();
	GECO_validator.startupvalidator();
	$("#maincontainer_productdetail").focus();
	$scope.currentBrand = {};
	$scope.currentSupplier = {};
	$scope.currentGroup = {};
	$scope.currentTaxRate = {};
	
	$(document).unbind("keydown");
	$(document).keydown(function(e){
		if(e.altKey && e.keyCode == 81 ){
		    $scope.saveProduct();
			$scope.$apply();
		}
		if(e.altKey && e.keyCode == 78 ){
			$location.path("/product/0");
			$scope.$apply();
		}
		if(e.altKey && e.keyCode == 69 ){
			$location.path("/product");
			$scope.$apply();
		}
		if(e.altKey && e.keyCode == 85 ){
			$scope.product.ums.push({idUnitMeasureProduct:0});
			$scope.umpid = $scope.product.ums.length-1;
			$scope.$apply();
		}
	});
	$scope.idproduct= $routeParams.idproduct;
	$scope.isNew = false
	if ($scope.idproduct == 0){
		$scope.isNew = true;
		$scope.umpid = 0;
	}else{
		$scope.isNew = false;
	}
	
	$http.get('rest/basic/unitmeasure').success(function(data){
		$scope.ums= data;
					$http.get('rest/registry/product/'+$scope.idproduct).success(function(data){
						$scope.product= data;
						if ($rootScope.newProductToAdd != null)
							$scope.product.code = $rootScope.newProductToAdd;
						if ($scope.product.idProduct == 0){
							$scope.product.ums = [];
							$scope.product.ums.push({idUnitMeasureProduct:0,preference:true,um:$scope.ums[0],conversion:1});
						}
						$http.get('rest/basic/groupproduct').success(function(data){
							$scope.groups= data;
								if($scope.product.group){
									for (var i=0;i<$scope.groups.length;i++){
										if ($scope.product.group.idGroupProduct == $scope.groups[i].idGroupProduct){
											$scope.currentGroup = $scope.groups[i]; 
										}
									}
								}
						});
						$http.get('rest/registry/supplier').success(function(data){
							$scope.suppliers= data;
							if($scope.product.supplier != null){
								for (var i=0;i<$scope.suppliers.length;i++){
									if ($scope.product.supplier.idSupplier == $scope.suppliers[i].idSupplier){
										$scope.currentSupplier = $scope.suppliers[i]; 
									}
									
								}
							}
						});
						$http.get('rest/basic/taxrate').success(function(data){
				$scope.taxrates= data;
						for (var itx=0;itx<$scope.taxrates.length;itx++){
							if($scope.product.taxrate){
								if ($scope.product.taxrate.idtaxrate == $scope.taxrates[itx].idtaxrate){
									$scope.currentTaxRate = $scope.taxrates[itx]; 
								}
							}
						}
						});
						$http.get('rest/basic/categoryproduct').success(function(data){
							$scope.categorys= data;
							if($scope.product.category){
								for (var ig=0;ig<$scope.categorys.length;ig++){
									if ($scope.product.category.idCategoryProduct == $scope.categorys[ig].idCategoryProduct){
										$scope.currentCategory = $scope.categorys[ig];
										$scope.subcategories = $scope.currentCategory.subcategories		
										$scope.currentSubCategory = null;
									}
								}
								for (var igs=0;igs<$scope.subcategories.length;igs++){
									if ($scope.product.subcategory == null){
										$scope.product.subcategory = {};
									}
									if ($scope.product.subcategory.idSubCategoryProduct == $scope.subcategories[igs].idSubCategoryProduct){
										$scope.currentSubCategory = $scope.subcategories[igs]; 
									}
								}
							}
						});
						$http.get('rest/basic/brand').success(function(data){
								$scope.brands= data;
								for (var itx=0;itx<$scope.brands.length;itx++){
									if ($scope.product != null && $scope.product.brand != null && $scope.brands != null){
										if ($scope.product.brand.idBrand == $scope.brands[itx].idBrand){
											$scope.currentBrand = $scope.brands[itx]; 
										}
									}
								}
								//$("#selbrand").trigger("chosen:updated");
						});
						//$(".combobox").trigger("chosen:updated");
					
					
				
				
			
		});
	});
	$scope.changeCategory = function(){
		$scope.subcategories = $scope.currentCategory.subcategories		
		$scope.currentSubCategory = null;
	}
	$scope.addUMElement = function(product){
		product.ums.push({idUnitMeasureProduct:0});
		$scope.umpid = product.ums.length-1 ;
	}
	$scope.changeUMElement = function(ump){
	    $scope.umpid = ump; //ump.idUnitMeasureProduct
	}
	
	$scope.saveProduct = function(){
		$scope.product.taxrate = $scope.currentTaxRate;
		$.ajax({
				url:"rest/registry/product",
				type:"PUT",
				data:"products="+JSON.stringify($scope.product),
				success:function(data){
					
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.product.idProduct = result.success;
						$scope.idproduct = result.success;
						
						$scope.$apply();
						if ($rootScope.headScope != null){
							$rootScope.newProductToAdd = $scope.product.code;
							$scope.isNew = false;
						}else{
							$scope.isNew = false;
							//$location.path("/product/"+$scope.product.idProduct);
						}
						$http.get('rest/registry/product/'+$scope.idproduct).success(function(data){
							$scope.product= data;
						});
						$scope.confirmSaved();
					}else{
						$scope.errorMessage(result.errorMessage);
					}	
				},error:function(data){
					$scope.errorMessage(data);
				}	
			})
		//}
	} ;
	$rootScope.setSaveControl($scope.saveProduct);
	$scope.newProduct = function(){
		$location.path("/product/0");
	} 
	$scope.mainPage = function(){
		$location.path("/product");
	} 
	$scope.calculatePrices = function(type){
		$scope.basicPrices = {};
		$scope.basicPrices.sellprice = $scope.product.sellprice;
		$scope.basicPrices.percentage = $scope.product.percentage;
		$scope.basicPrices.purchaseprice = $scope.product.purchaseprice;
		$.ajax({
				url:"rest/util/prodbasicprice/"+type,
				type:"POST",
				data:"prices="+JSON.stringify($scope.basicPrices),
				success:function(data){
					
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.product.sellprice = result.success.sellprice;
						$scope.product.percentage = result.success.percentage;
						$scope.product.purchaseprice = result.success.purchaseprice;
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
}]);
/***
	LIST
*/

gecoRegistryControllers.controller('ListListCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	
	
	$http.get('rest/registry/list').success(function(data){
		$scope.lists= data;
	});
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.lists.length;i++){
			if (id == $scope.lists[i].idList){
				$scope.deletelist = $scope.lists[i];
				$.ajax({
						url:"rest/registry/list/",
						type:"DELETE",
						data:"listobj="+JSON.stringify($scope.deletelist),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/list').success(function(data){
								$scope.lists= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElement = function(id){
		$.ajax({
						url:"rest/print/list/"+id,
						type:"POST",
						success:function(data){
							//alert("Utente eliminato con successo");
							window.open(JSON.parse(data), '_blank');
						}	
					})
	}
	$scope.dateSortFunction = function(list) {
		var date = list.startdate.split("/");
		return date[2]+date[1]+date[0];
	};
}]);
gecoRegistryControllers.controller('ListDetailCtrl',["$scope","$http","$routeParams","ScopeFactory",function($scope,$http,$routeParams,ScopeFactory){
    GECO_LOGGEDUSER.checkloginuser();
	GECO_validator.startupvalidator();
	$scope.newList = {isPercentage:false};
	$(".datepicker").datepicker({ dateFormat: "dd/mm/yy" });
	$scope.idlist= $routeParams.idlist;
	$http.get('rest/registry/product').success(function(data){
		$scope.products= data;
		$http.get('rest/registry/list/'+$scope.idlist).success(function(data){
			$scope.list= data;
		});
	});
	$scope.addProdElement = function(list){
		$scope.prodid = 0
		list.listproduct.push({idListProduct:0});
	}
	$scope.changeProdElement = function(ump){
	    
		if (ump.product != null){
			for(var i=0;i<$scope.products.length;i++){
				if (ump.product.idProduct == $scope.products[i].idProduct){
					$scope.currentProd = $scope.products[i];
				}
			}
		}
		$scope.prodid = ump.idListProduct
	}
	$scope.saveProduct = function(){
	//if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			
			
			$scope.newList.list = $scope.list;
			$scope.value = 0;
			$.ajax({
				url:"rest/registry/list",
				type:"PUT",
				data:"lists="+JSON.stringify($scope.newList),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.list.idList = result.success;
						$scope.idlist = result.success;
						$scope.confirmSaved();
						$http.get('rest/registry/list/'+$scope.idlist).success(function(data){
							$scope.list= data;
						});
					}else{
						$scope.errorMessage(result.errorMessage);
					}	
				},error:function(data){
					$scope.errorMessage(result.errorMessage);
				}	
			})
		//}
	} ;
	
}]);



/****
	CUSTOMER
**/
gecoRegistryControllers.controller('CustomerListCtrl',["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    //$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	if ($scope.pagesize == null ){
		$scope.pagesize = 99;
		//ScopeFactory.factory.productList.pagesize = 100;
	}else{
		//$scope.pagesize = ScopeFactory.factory.productList.pagesize
	}
	$scope.pageArray = [];
	if ($scope.showFilter == null){
		$scope.showFilter = false;
	}
	if ($scope.filterCustomer == null){
		$scope.filterCustomer = {"pagefilter":{}};
		$scope.currentCustomerGroup = {};
		$scope.currentBrand = {};
		$scope.currentCategory = {};
		$scope.currentSubCategory = {};
		$scope.currentSupplier = {};
	}else{
		$scope.currentCustomerGroup = $scope.filterCustomer.group;
		$scope.currentBrand = $scope.filterCustomer.brand;
		$scope.currentCategory = $scope.filterCustomer.category;
		$scope.currentSubCategory = $scope.filterCustomer.subcategory;
		$scope.currentSupplier = $scope.filterCustomer.supplier;
	}
	$http.get('rest/basic/groupcustomer').success(function(data){
		$scope.groups= data;
		if ($scope.currentCategory != null){
			for (var i=0;i<$scope.groups.length;i++){
				if ($scope.currentCustomerGroup.idGroupCustomer == $scope.groups[i].idGroupCustomer){
					$scope.currentCustomerGroup = $scope.groups[i];
				}
			}
		}
	});
	$http.get('rest/basic/categorycustomer').success(function(data){
		$scope.categorys= data;
		if ($scope.currentCategory != null){
			for (var i=0;i<$scope.categorys.length;i++){
				if ($scope.currentCategory.idCategoryCustomer == $scope.categorys[i].idCategoryCustomer){
					$scope.currentCategory = $scope.categorys[i];
				}
			}
		}
	});
	$scope.getCustomers = function(){
		$scope.filterCustomer.pagefilter.startelement = (1 - 1 ) * $scope.pagesize;
			$scope.filterCustomer.pagefilter.pageSize = $scope.pagesize;
			$rootScope.filterCustomer = $scope.filterCustomer
		$.ajax({
			url:"rest/registry/customer/",
			type:"POST",
			data:"filter="+JSON.stringify($scope.filterCustomer),
			success:function(data){
				
				$scope.customers= JSON.parse(data);
				
				$scope.$apply();
			}	
		})
	}
	$scope.getCustomers();
	
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.customers.length;i++){
			if (id == $scope.customers[i].idCustomer){
				$scope.deletecustomer = $scope.customers[i];
				$.ajax({
						url:"rest/registry/customer/",
						type:"DELETE",
						data:"customerobj="+JSON.stringify($scope.deletecustomer),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/customer').success(function(data){
								$scope.customers= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data, '_blank');
		});
	}
	
}]);
gecoRegistryControllers.controller('CustomerDetailCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    //GECO_LOGGEDUSER.checkloginuser();
	$scope.listsections = ["Dettagli","Listini","Destinazioni"];
	$scope.selectedSection = $scope.listsections[0];
	GECO_validator.startupvalidator();
	$scope.idcustomer= $routeParams.idcustomer;
	$http.get('rest/registry/list').success(function(data){
		$scope.lists= data;
	});
	$http.get('rest/basic/payment').success(function(data){
		$scope.payments= data;
		if ($scope.customer != null && $scope.customer.payment != null){
			for(var i=0;i<$scope.payments.length;i++ ){
				if ($scope.customer.payment.idPayment == $scope.payments[i].idPayment){
					$scope.currentPayment = $scope.payments[i];
				}
			}
		}
	});
	$http.get('rest/basic/categorycustomer').success(function(data){
		$scope.categorys= data;
	});
	$http.get('rest/basic/groupcustomer').success(function(data){
			$scope.groups= data;
	});
	$http.get('rest/registry/customer/'+$scope.idcustomer).success(function(data){
				$scope.customer= data;
				if ($scope.groups !== null && $scope.groups !== undefined){
					for (var i=0;i<$scope.groups.length;i++){
						if ($scope.customer.group != null){
							if ($scope.customer.group.idGroupCustomer == $scope.groups[i].idGroupCustomer){
								$scope.currentGroup = $scope.groups[i]; 
							}
						}else{
							$scope.customer.group = {}
						}
					}
				}
				if ($scope.categorys !== null && $scope.categorys !== undefined){
				for (var ig=0;ig<$scope.categorys.length;ig++){
					if ($scope.customer.category != null){
						if ($scope.customer.category.idCategoryCustomer == $scope.categorys[ig].idCategoryCustomer){
							$scope.currentCategory = $scope.categorys[ig];
						}
					}else{
						$scope.customer.category = {};
					}
				}
				}
				if ($scope.payments != null && $scope.customer.payment != null){
					for(var i=0;i<$scope.payments.length;i++ ){
						if ($scope.customer.payment.idPayment == $scope.payments[i].idPayment){
							$scope.currentPayment = $scope.payments[i];
						}
					}
				}
				$http.get('rest/basic/taxrate').success(function(data){
					$scope.taxrates= data;
					for (var itx=0;itx<$scope.taxrates.length;itx++){
						if($scope.customer.taxrate){
							if ($scope.customer.taxrate.idtaxrate == $scope.taxrates[itx].idtaxrate){
								$scope.currentTaxRate = $scope.taxrates[itx]; 
							}
						}
					}
				});
			});
	$scope.getListName = function(list){
		return list.code + ' '+ list.description + ' '+ list.startdate; 
	}
	$scope.addListElement = function(customer){
		customer.lists.push({idListCustomer:0});
	}
	$scope.changeListElement = function(list){
	    
		if (list.list != null){
			for(var i=0;i<$scope.lists.length;i++){
				if (list.list.idList == $scope.lists[i].idList){
					$scope.currentList = $scope.lists[i];
				}
			}
		}
		$scope.listid = list.idListCustomer
	}
	$scope.saveCustomer = function(){
		$scope.customer.group = $scope.currentGroup;
		$scope.customer.category = $scope.currentCategory;
		$scope.customer.taxrate = $scope.currentTaxRate;
	//if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			$.ajax({
				url:"rest/registry/customer",
				type:"PUT",
				data:"customers="+JSON.stringify($scope.customer),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.customer.idCustomer = result.success;
						$scope.idcustomer = result.success;
						$scope.confirmSaved();
						$scope.$apply();
					}else{
						$scope.errorMessage(result.errorMessage);
					}	
					
				},error:function(data){
					$scope.errorMessage(data);
				}
			})
		//}
	} ;
	$scope.userCustomer = function(){
		$.ajax({
					url:"rest/registry/customer/user",
					type:"PUT",
					data:"customers="+JSON.stringify($scope.customer)+"&role="+JSON.stringify($scope.currentRole),
					success:function(data){
						result = JSON.parse(data);
						if (result.type == "success"){	
							$scope.customer.idCustomer = result.success;
							$scope.idcustomer = result.success;
							$scope.confirmSaved();
							$scope.$apply();
						}else{
							alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
						}
					}	
				})
			//}
		} ;
		$http.get('rest/role/').success(function(data){
			$scope.roles= data;
		});
}]);




/****
	DESTINATION
**/
gecoRegistryControllers.controller('DestinationListCtrl',["$scope","$http",function($scope,$http){
    //$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$http.get('rest/registry/destination').success(function(data){
		$scope.destinations= data;
	});
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.destinations.length;i++){
			if (id == $scope.destinations[i].idDestination){
				$scope.deletedestination = $scope.destinations[i];
				$.ajax({
						url:"rest/registry/destination/",
						type:"DELETE",
						data:"destinationobj="+JSON.stringify($scope.deletedestination),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/destination').success(function(data){
								$scope.destinations= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data, '_blank');
		});
	}
	
}]);
gecoRegistryControllers.controller('DestinationDetailCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    //GECO_LOGGEDUSER.checkloginuser();
	GECO_validator.startupvalidator();
	$scope.iddestination= $routeParams.iddestination;
	$http.get('rest/registry/customer').success(function(data){
				$scope.customers= data;
				if ($scope.destination != null  ){
				for (var i=0;i< $scope.customers.length;i++){
					if ($scope.customers[i].idCustomer == $scope.destination.customer.idCustomer){
						$scope.currentCustomer = $scope.customers[i];
						break;
					}
				}
		}
	});
	$http.get('rest/registry/destination/'+$scope.iddestination).success(function(data){
		$scope.destination= data;
		if ($scope.destination.customer != null && $scope.customers != null ){
			for (var i=0;i< $scope.customers.length;i++){
				if ($scope.customers[i].idCustomer == $scope.destination.customer.idCustomer){
					$scope.currentCustomer = $scope.customers[i];
					break;
				}
			}
		}
	});
	
	
	$scope.saveDestination = function(){
		$scope.destination.customer = $scope.currentCustomer;
	//if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			$.ajax({
				url:"rest/registry/destination",
				type:"PUT",
				data:"destinations="+JSON.stringify($scope.destination),
				success:function(data){
					$scope.destination.idDestination = data;
					$scope.iddestination = data;
					alert("success");
				}	
			})
		//}
	} ;
	
}]);




/****
	SUPPLIER
**/
gecoRegistryControllers.controller('SupplierListCtrl',["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    //$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	if ($scope.pagesize == null ){
		$scope.pagesize = 99;
		//ScopeFactory.factory.productList.pagesize = 100;
	}else{
		//$scope.pagesize = ScopeFactory.factory.productList.pagesize
	}
	$scope.pageArray = [];
	if ($scope.showFilter == null){
		$scope.showFilter = false;
	}
	if ($scope.filterSupplier == null){
		$scope.filterSupplier = {"pagefilter":{}};
		$scope.currentGroup = {};
		$scope.currentBrand = {};
		$scope.currentCategory = {};
		$scope.currentSubCategory = {};
		$scope.currentSupplier = {};
	}else{
		$scope.currentGroup = $scope.filterSupplier.group;
		$scope.currentBrand = $scope.filterSupplier.brand;
		$scope.currentCategory = $scope.filterSupplier.category;
		$scope.currentSubCategory = $scope.filterSupplier.subcategory;
		$scope.currentSupplier = $scope.filterSupplier.supplier;
	}
	$http.get('rest/basic/groupsupplier').success(function(data){
		$scope.groups= data;
		for (var i=0;i<$scope.groups.length;i++){
			if ($scope.currentGroup.idGroupSupplier == $scope.groups[i].idGroupSupplier){
				$scope.currentGroup = $scope.groups[i];
			}
		}
	});
	$http.get('rest/basic/categorysupplier').success(function(data){
		$scope.categorys= data;
		for (var i=0;i<$scope.categorys.length;i++){
			if ($scope.currentCategory.idCategorySupplier == $scope.categorys[i].idCategorySupplier){
				$scope.currentCategory = $scope.categorys[i];
			}
		}
	});
	$scope.getSuppliers = function(){
		$scope.filterSupplier.pagefilter.startelement = (1 - 1 ) * $scope.pagesize;
			$scope.filterSupplier.pagefilter.pageSize = $scope.pagesize;
			$rootScope.filterSupplier = $scope.filterSupplier
		$.ajax({
			url:"rest/registry/supplier/",
			type:"POST",
			data:"filter="+JSON.stringify($scope.filterSupplier),
			success:function(data){
				
				$scope.suppliers= JSON.parse(data);
				
				$scope.$apply();
			}	
		})
	}
	$scope.getSuppliers();
	
	
	/*$http.get('rest/registry/supplier').success(function(data){
		$scope.suppliers= data;
		
	});*/
	
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.suppliers.length;i++){
			if (id == $scope.suppliers[i].idSupplier){
				$scope.deletesupplier = $scope.suppliers[i];
				$.ajax({
						url:"rest/registry/supplier/",
						type:"DELETE",
						data:"supplierobj="+JSON.stringify($scope.deletesupplier),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/supplier').success(function(data){
								$scope.suppliers= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data, '_blank');
		});
	}
	
}]);
gecoRegistryControllers.controller('SupplierDetailCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    //GECO_LOGGEDUSER.checkloginuser();
	$scope.listsections = ["Dettagli","Listini","Destinazioni"];
	$scope.selectedSection = $scope.listsections[0];
	GECO_validator.startupvalidator();
	$scope.idsupplier= $routeParams.idsupplier;
	$http.get('rest/basic/categorysupplier').success(function(data){
		$scope.categorys= data;
	});
	$http.get('rest/basic/payment').success(function(data){
		$scope.payments= data;
		if ($scope.supplier != null && $scope.supplier.payment != null){
			for(var i=0;i<$scope.payments.length;i++ ){
				if ($scope.supplier.payment.idPayment == $scope.payments[i].idPayment){
					$scope.currentPayment = $scope.payments[i];
				}
			}
		}
	});
	$http.get('rest/basic/groupsupplier').success(function(data){
			$scope.groups= data;
	});
	$http.get('rest/registry/list').success(function(data){
		$scope.lists= data;
	});
	$http.get('rest/registry/supplier/'+$scope.idsupplier).success(function(data){
		$scope.supplier= data;
		if ($scope.payments != null && $scope.supplier.payment != null){
			for(var i=0;i<$scope.payments.length;i++ ){
				if ($scope.supplier.payment.idPayment == $scope.payments[i].idPayment){
					$scope.currentPayment = $scope.payments[i];
				}
			}
		}
		for (var i=0;i<$scope.groups.length;i++){
					if ($scope.supplier.group != null){
						if ($scope.supplier.group.idGroupCustomer == $scope.groups[i].idGroupCustomer){
							$scope.currentGroup = $scope.groups[i]; 
						}
					}else{
						$scope.supplier.group = {}
					}
				}
				for (var ig=0;ig<$scope.categorys.length;ig++){
					if ($scope.supplier.category != null){
						if ($scope.supplier.category.idCategoryCustomer == $scope.categorys[ig].idCategoryCustomer){
							$scope.currentCategory = $scope.categorys[ig];
						}
					}else{
						$scope.supplier.category = {};
					}
				}
	});
	$scope.getListName = function(list){
		return list.code + ' '+ list.description + ' '+ list.startdate; 
	}
	$scope.addListElement = function(supplier){
		supplier.lists.push({idListSupplier:0});
	}
	$scope.changeListElement = function(list){
	    
		if (list.list != null){
			for(var i=0;i<$scope.lists.length;i++){
				if (list.list.idListMeasure == $scope.lists[i].idListMeasure){
					$scope.currentList = $scope.lists[i];
				}
			}
		}
		$scope.listid = list.idListSupplier
	}
	$scope.saveSupplier = function(){
		$scope.supplier.group = $scope.currentGroup;
		$scope.supplier.category = $scope.currentCategory;
	//if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			$.ajax({
				url:"rest/registry/supplier",
				type:"PUT",
				data:"suppliers="+JSON.stringify($scope.supplier),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.supplier.idSupplier = result.success;
						$scope.idsupplier = result.success;
						alert("success");
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
					
				}	
			})
		//}
	} ;
	
}]);

/****
	TRANSPORTER
**/
gecoRegistryControllers.controller('TransporterListCtrl',["$scope","$http",function($scope,$http){
    //$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$http.get('rest/registry/transporter').success(function(data){
		$scope.transporters= data;
	});
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.transporters.length;i++){
			if (id == $scope.transporters[i].idTransporter){
				$scope.deletetransporter = $scope.transporters[i];
				$.ajax({
						url:"rest/registry/transporter/",
						type:"DELETE",
						data:"transporterobj="+JSON.stringify($scope.deletetransporter),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/registry/transporter').success(function(data){
								$scope.transporters= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data, '_blank');
		});
	}
	
}]);
gecoRegistryControllers.controller('TransporterDetailCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
    //GECO_LOGGEDUSER.checkloginuser();
	$scope.listsections = ["Dettagli","Listini","Destinazioni"];
	$scope.selectedSection = $scope.listsections[0];
	GECO_validator.startupvalidator();
	$scope.idtransporter= $routeParams.idtransporter;
	$http.get('rest/registry/list').success(function(data){
		$scope.lists= data;
	});
	$http.get('rest/registry/transporter/'+$scope.idtransporter).success(function(data){
		$scope.transporter= data;
	});
	$scope.getListName = function(list){
		return list.code + ' '+ list.description + ' '+ list.startdate; 
	}
	$scope.addListElement = function(transporter){
		transporter.lists.push({idListTransporter:0});
	}
	$scope.changeListElement = function(list){
	    
		if (list.list != null){
			for(var i=0;i<$scope.lists.length;i++){
				if (list.list.idListMeasure == $scope.lists[i].idListMeasure){
					$scope.currentList = $scope.lists[i];
				}
			}
		}
		$scope.listid = list.idListTransporter
	}
	$scope.saveTransporter = function(){
	$.ajax({
				url:"rest/registry/transporter",
				type:"PUT",
				data:"transporters="+JSON.stringify($scope.transporter),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.transporter.idTransporter = result.success;
						$scope.idtransporter = result.success;
						alert("success");
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}
				}	
			})
		//}
	} ;
	$scope.userTransporter = function(){
	$.ajax({
				url:"rest/registry/transporter/user",
				type:"PUT",
				data:"transporters="+JSON.stringify($scope.transporter)+"&role="+JSON.stringify($scope.currentRole),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.transporter.idTransporter = result.success;
						$scope.idtransporter = result.success;
						alert("success");
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}
				}	
			})
		//}
	} ;
	$http.get('rest/role/').success(function(data){
		$scope.roles= data;
	});
}]);