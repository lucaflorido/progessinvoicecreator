angular.module("rocchi.product")
.controller('RocchiProductListCtrl',function($scope,$rootScope,$http,ScopeFactory,$location,AppConfig,AlertsFactory,LoaderFactory,CommonFunction){
    $scope.importview = false;	
	$scope.location = $location;
	$scope.url = AppConfig.ServiceUrls;
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$http.get(AppConfig.ServiceUrls.List).success(function(data){
		$scope.lists= data;
	});
	$scope.menuselected = "";
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
	$scope.importobj = {code:'B',description:"C",group:"A",umcode:"I",purchaseprice:"F",taxrate:"H",startIndex:"3",endIndex:"10"};

	$scope.filterMenu = function(value){
		if ($scope.menuselected == "" || $scope.menuselected != value){
			$scope.menuselected = value;
		}else{
			$scope.menuselected = "";
		}
	}
	var intitialize = function(){
		$http.get(AppConfig.ServiceUrls.ProductCategory).success(function(data){
			$scope.categories= data;
		});
		$http.get(AppConfig.ServiceUrls.ProductGroup).success(function(data){
			$scope.groups= data;
		});
		$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
			$scope.brands= data;
		});
		$http.get(AppConfig.ServiceUrls.Region).success(function(data){
			$scope.regions= data;
		});
		$http.get(AppConfig.ServiceUrls.Composition).success(function(data){
			$scope.compositions= data;
		});
	};
	$scope.subcategories = [];
	$scope.changeCategory = function(){
		$scope.subcategories = [];
		if ($scope.filter && $scope.filter.category)
		$scope.subcategories = $scope.filter.category.subcategories;
	}
	intitialize();
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
	
	
	$scope.getProducts = function(page){
			$scope.filter.pagefilter.startelement = (page - 1 ) * $scope.pagesize_confirmed;
			$scope.filter.pagefilter.pageSize = $scope.pagesize_confirmed;
			$scope.filter = $scope.filter
			$http.post(AppConfig.ServiceUrls.ProductMainList,$scope.filter).then(function(result){
				$scope.products = result.data.success;
			})
			
	}
	
	$scope.getProductsNumber = function(){
		
		//if ($scope.products.length != $scope.pagesize){
		$scope.pages = [];
		$scope.totalitems = 0;
		$scope.pageArray = [];
			$http.get(AppConfig.ServiceUrls.ProductPagination+$scope.pagesize).then(function(result){
				$scope.pages = result.data.pages;
				$scope.totalitems = result.data.totalitems;
				$scope.pagesize_confirmed = $scope.pagesize;
				$scope.getProducts(1);
			});
			
		//}
	}
	$scope.getProductsNumber();
	
	$scope.deleteElement = function(obj){
		/*for(var i=0;i<$scope.products.length;i++){
			if (id == $scope.products[i].idProduct){
				$scope.deleteproduct = $scope.products[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Product,
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
		}*/
		CommonFunction.deleteElement(AppConfig.ServiceUrls.ProductDelete,obj,$scope.getProductsNumber);
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
		$http.post(AppConfig.ServiceUrls.ProductIncrement,$scope.filter).then(
			function(results){
				var result = results.data;
				if (result.type == "success"){	
					$scope.getProductsNumber();
				}else{
					alert("Errore: "+results.errorName+" Messaggio:"+result.errorMessage);
				}	
		});
	}
	$scope.novalid = false;
	$scope.importProduct = function(filename){
		$scope.importobj.lists = [];
		for (var i=0;i < $scope.lists.length;i++){
			if ($scope.lists[i].colprice){
				var ilp = {list:$scope.lists[i],pricecol:$scope.lists[i].colprice};
				$scope.importobj.lists.push(ilp);
			}
			
		}
		$scope.importobj.filename = filename;
		LoaderFactory.loader = true;
		$http.post(AppConfig.ServiceUrls.ImportProducts,$scope.importobj).then(function(result){
			if (result.data.type == "success"){
				if (result.data.success && result.data.success.length > 0){
					var messages = result.data.success;
					var msg = ["IMPORTAZIONE TERMINATA  CON SUCCESSO PARZIALE "];
					angular.forEach(messages,function(item){
						msg.push(item);
					});
					$scope.msg.infoMessage(msg);
				}else{
					$scope.msg.infoMessage(["IMPORTAZIONE TERMINATA CON SUCCESSO"]);
				}
				
				$scope.importview = false;
				$scope.novalid = true;
				$scope.getProducts();
				LoaderFactory.loader = false;
			}else{
				$scope.msg.alertMessage(result.data.errorMessage);
				LoaderFactory.loader = false;
			}
			
		});
	};
	$scope.onComplete = function (response) {
		if (response.data.type == "success"){
			$scope.importProduct(response.data.success)
		}else{
			$scope.msg.alertMessage(response.data.errorMessage);
		}
	};
	 $scope.addNew = function(){
		 $location.path("/product/0");
	 };
})
.controller('RocchiProductDetailCtrl',function($scope,$http,$stateParams,$location,$rootScope,$q,AppConfig,AlertsFactory,CommonFunction){
    
	GECO_validator.startupvalidator();
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
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
	$scope.idproduct= $stateParams.idproduct;
	$scope.isNew = false
	if ($scope.idproduct == 0){
		$scope.isNew = true;
		$scope.umpid = 0;
	}else{
		$scope.isNew = false;
	}
	$http.get(AppConfig.ServiceUrls.Composition).success(function(data){
		$scope.compositions= data;
	});
	$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
		$scope.brands= data;
	});
	var initMasterData = function(){
		$q.all([$http.get(AppConfig.ServiceUrls.UniteMeasure),
		        $http.get(AppConfig.ServiceUrls.ProductGroup),
		        $http.get(AppConfig.ServiceUrls.Region),
		        $http.get(AppConfig.ServiceUrls.Brand),
		        $http.get(AppConfig.ServiceUrls.TaxRate),
		        $http.get(AppConfig.ServiceUrls.ProductCategory)
		        ]).then(function(data){
		        	$scope.ums= data[0].data;
		        	$scope.groups= data[1].data;
		        	$scope.regions= data[2].data;
		        	$scope.brands= data[3].data;
		        	$scope.taxrates= data[4].data;
		        	$scope.categorys= data[5].data;
		        	getProduct();
		        });
	}
var getProduct = function(){
	$http.get(AppConfig.ServiceUrls.Product+$scope.idproduct).success(function(data){
		$scope.product= data;
		$scope.imageProduct = $scope.product.photo;
		if ($rootScope.newProductToAdd != null)
			$scope.product.code = $rootScope.newProductToAdd;
		if ($scope.product.idProduct == 0){
			$scope.product.ums = [];
			$scope.product.ums.push({idUnitMeasureProduct:0,preference:true,um:$scope.ums[0],conversion:1});
		}
		if($scope.product.group){
			for (var i=0;i<$scope.groups.length;i++){
				if ($scope.product.group.idGroupProduct == $scope.groups[i].idGroupProduct){
					$scope.product.group = $scope.groups[i]; 
				}
			}
		}
		if($scope.product.region){
			for (var i=0;i<$scope.regions.length;i++){
				if ($scope.product.region.idRegion == $scope.regions[i].idRegion){
					$scope.product.region = $scope.regions[i]; 
				}
			}
		}
		if($scope.product.brand){
			for (var i=0;i<$scope.brands.length;i++){
				if ($scope.product.brand.idBrand == $scope.brands[i].idBrand){
					$scope.product.brand = $scope.brands[i]; 
				}
			}
		}
		for (var itx=0;itx<$scope.taxrates.length;itx++){
			if($scope.product.taxrate){
				if ($scope.product.taxrate.idtaxrate == $scope.taxrates[itx].idtaxrate){
					$scope.product.taxrate = $scope.taxrates[itx]; 
				}
			}
		}
		if($scope.product.category){
			for (var ig=0;ig<$scope.categorys.length;ig++){
				if ($scope.product.category.idCategoryProduct == $scope.categorys[ig].idCategoryProduct){
					$scope.product.category = $scope.categorys[ig];
    				$scope.subcategories = $scope.product.category.subcategories		
					$scope.currentSubCategory = null;
				}
			}
			for (var igs=0;igs<$scope.subcategories.length;igs++){
				if ($scope.product.subcategory != null){
					if ($scope.product.subcategory.idSubCategoryProduct == $scope.subcategories[igs].idSubCategoryProduct){
						$scope.product.subcategory = $scope.subcategories[igs]; 
					}
				}
			}
		}
		if ($scope.product.ecconfig){
			if ($scope.product.ecconfig.umproduct){
				angular.forEach($scope.product.ums, function(value, key) {
	 			    if (value.idUnitMeasureProduct == $scope.product.ecconfig.umproduct.idUnitMeasureProduct){
	 				    $scope.product.ecconfig.umproduct = value;
	    		    }
				});
			}else{
				$scope.product.ecconfig.umproduct = null;
			}
		}
	});
}
	initMasterData();
	$scope.changeCategory = function(){
		if ($scope.currentCategory){
			$scope.subcategories = $scope.currentCategory.subcategories		
			$scope.currentSubCategory = null;
		}
	}
	$scope.addUMElement = function(product){
		product.ums.push({idUnitMeasureProduct:0});
		$scope.umpid = product.ums.length-1 ;
	}
	$scope.addCompositionElement = function(product){
		product.compositions.push({idCompositionProduct:0});
		$scope.compid = product.compositions.length-1 ;
	}
	$scope.deleteListElement = function(obj){
		CommonFunction.deleteElement(AppConfig.ServiceUrls.ProductListDelete,obj,getProduct);
	}
	$scope.deleteUMElement = function(um){
		$http.delete(AppConfig.ServiceUrls.ProductUniteMeasure,um).success(function(){
			$scope.msg.successMessage("UNITA' DI MISURA ELIMINATA CON SUCCESSO");
					getProduct();
					})
		/*$.ajax({
				url:AppConfig.ServiceUrls.ProductUniteMeasure,
				type:"DELETE",
				data:"productobj="+JSON.stringify(um),
				success:function(data){
					$scope.msg.successMessage("UNITA' DI MISURA ELIMINATA CON SUCCESSO");
					getProduct();
					
				}	
			});*/
	}
	/*$scope.deleteCompositionElement = function(um){
		$.ajax({
				url:AppConfig.ServiceUrls.Compos,
				type:"DELETE",
				data:"productobj="+JSON.stringify(um),
				success:function(data){
					$scope.msg.successMessage("UNITA' DI MISURA ELIMINATA CON SUCCESSO");
					getProduct();
					
				}	
			});
	}*/
	$scope.addListElement = function(){
		$http.post(AppConfig.ServiceUrls.ListNoProduct,$scope.product).success(function(result){
			if (result.type == "success"){	
				$scope.availablelists = result;
				$scope.product.listproduct.push({idListProduct:0});
				$scope.listid = 0 ;
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
		})
		/*$.ajax({
			url:AppConfig.ServiceUrls.ListNoProduct,
			type:"POST",
			data:"product="+JSON.stringify($scope.product),
			success:function(data){
				var result = JSON.parse(data);
				$scope.availablelists = result;
				$scope.product.listproduct.push({idListProduct:0});
				$scope.listid = 0 ;
				$scope.$apply();
				
			}	
		});*/
		
	}
	$scope.selectList = function(prodlist){
		prodlist.percentage = prodlist.list.increment;
		$scope.calculateSellPrice(prodlist);
	}
	$scope.changeUMElement = function(ump){
	    $scope.umpid = ump; //ump.idUnitMeasureProduct
	}
	
	$scope.saveProduct = function(){
		/*$scope.product.taxrate = $scope.currentTaxRate;
		$scope.product.group = $scope.currentGroup;
		$scope.product.region = $scope.currentRegion;
		$scope.product.category = $scope.currentCategory;
		$scope.product.subcategory = $scope.currentSubCategory;
		$scope.product.brand = $scope.currentBrand;*/
		$scope.product.isProduct = true;
		$http.put(AppConfig.ServiceUrls.Product,$scope.product).success(function(data){
			
			result = data;
			if (result.type == "success"){	
				$scope.product.idProduct = result.success;
				$scope.idproduct = result.success;
				
				//$scope.$apply();
				if ($rootScope.headScope != null){
					$rootScope.newProductToAdd = $scope.product.code;
					$scope.isNew = false;
				}else{
					$scope.isNew = false;
					//$location.path("/product/"+$scope.product.idProduct);
				}
				/*$http.get(AppConfig.ServiceUrls.Product+$scope.idproduct).success(function(data){
					$scope.product= data;
					$scope.umpid = -1;
					$scope.listid = -1;
					if ($scope.product.ecconfig){
						if ($scope.product.ecconfig.umproduct){
							angular.forEach($scope.product.ums, function(value, key) {
								  if (value.idUnitMeasureProduct == $scope.product.ecconfig.umproduct.idUnitMeasureProduct){
									  $scope.product.ecconfig.umproduct = value;
								  }
								});
						}else{
							$scope.product.ecconfig.umproduct = null;
						}
					}
				});*/
				getProduct();
				$scope.msg.successMessage("PRODOTTO SALVATO CON SUCCESSO");
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
		}).error(function(data){
			$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DEL LISTINO");
		});	
		
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
		$http.post(AppConfig.ServiceUrls.ProductBasicPrice+type,$scope.basicPrices).success(function(result){
			if (result.type == "success"){	
				$scope.product.sellprice = result.success.sellprice;
				$scope.product.percentage = result.success.percentage;
				$scope.product.purchaseprice = result.success.purchaseprice;
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
		})
		/*$.ajax({
				url:AppConfig.ServiceUrls.ProductBasicPrice+type,
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
						$scope.msg.alertMessage(result.errorMessage);
					}	
				}	
			})*/
	}
	$scope.calculateListPrices = function(){
		//$scope.product.taxrate = $scope.currentTaxRate;
		$http.post(AppConfig.ServiceUrls.ProductBasicPriceList,$scope.product).success(function(result){
			if (result.type == "success"){	
				$scope.product = result.success;
				
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
		})
		/*$.ajax({
				url:AppConfig.ServiceUrls.ProductBasicPriceList,
				type:"POST",
				data:"product="+JSON.stringify($scope.product),
				success:function(data){
					
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.product = result.success;
						$scope.$apply();
					}else{
						$scope.msg.alertMessage(result.errorMessage);
					}	
				}	
			})*/
	}
	
	$scope.calculatePercentage = function(listprod){
		var obj = createProductCalcObj(listprod);
		$http.post(AppConfig.ServiceUrls.UtilPricePercentage,obj).success(function(result){
			if (result.type == "success"){	
				var priceCalc = result.success;
				listprod.price = priceCalc.sellprice;
				listprod.percentage = priceCalc.percentage;
				listprod.endprice = priceCalc.endprice;
				$scope.msg.infoMessage("SALVARE PER REGISTRARE LE MODIFICHE");
				
			}else{
				$scope.msg.alertMessage(result.errorMessage);
				
			}	
		})
		/*$.ajax({
			url:AppConfig.ServiceUrls.UtilPricePercentage,
			type:"POST",
			data:"prices="+JSON.stringify(obj),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					var priceCalc = result.success;
					listprod.price = priceCalc.sellprice;
					listprod.percentage = priceCalc.percentage;
					listprod.endprice = priceCalc.endprice;
					$scope.msg.infoMessage("SALVARE PER REGISTRARE LE MODIFICHE");
					$scope.$apply();
				}else{
					$scope.msg.alertMessage(result.errorMessage);
					$scope.$apply();
				}	
			},error:function(data){
				$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DEL LISTINO");
				$scope.$apply();
			}	
		})*/
	};
	$scope.calculateSellPrice = function(listprod){
		var obj = createProductCalcObj(listprod);
		$http.post(AppConfig.ServiceUrls.UtilPriceEndPrice,obj).success(function(result){
			if (result.type == "success"){	
				var priceCalc = result.success;
				listprod.price = priceCalc.sellprice;
				listprod.percentage = priceCalc.percentage;
				listprod.endprice = priceCalc.endprice;
				$scope.msg.infoMessage("SALVARE PER REGISTRARE LE MODIFICHE");
				
			}else{
				$scope.msg.alertMessage(result.errorMessage);
				
			}	
		})
		/*$.ajax({
			url:AppConfig.ServiceUrls.UtilPricePrice,
			type:"POST",
			data:"prices="+JSON.stringify(obj),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					var priceCalc = result.success;
					listprod.price = priceCalc.sellprice;
					listprod.percentage = priceCalc.percentage;
					listprod.endprice = priceCalc.endprice;
					$scope.msg.infoMessage("SALVARE PER REGISTRARE LE MODIFICHE");
					$scope.$apply();
				}else{
					$scope.msg.alertMessage(result.errorMessage);
					$scope.$apply();
				}	
			},error:function(data){
				$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DEL LISTINO");
				$scope.$apply();
			}	
		})*/
	};
	var createProductCalcObj = function(listprod){
		
		return {purchaseprice:$scope.product.purchaseprice,sellprice:listprod.price,percentage:listprod.percentage,endprice:listprod.endprice,taxrate:$scope.product.taxrate.value};
	}
	$scope.calculateEndPrice = function(listprod){
		var obj = createProductCalcObj(listprod);
		$http.post(AppConfig.ServiceUrls.UtilPriceEndPrice,obj).success(function(result){
			if (result.type == "success"){	
				var priceCalc = result.success;
				listprod.price = priceCalc.sellprice;
				listprod.percentage = priceCalc.percentage;
				listprod.endprice = priceCalc.endprice;
				$scope.msg.infoMessage("SALVARE PER REGISTRARE LE MODIFICHE");
				
			}else{
				$scope.msg.alertMessage(result.errorMessage);
				
			}	
		})
		/*$.ajax({
			url:AppConfig.ServiceUrls.UtilPriceEndPrice,
			type:"POST",
			data:"prices="+JSON.stringify(obj),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					var priceCalc = result.success;
					listprod.price = priceCalc.sellprice;
					listprod.percentage = priceCalc.percentage;
					listprod.endprice = priceCalc.endprice;
					$scope.msg.infoMessage("SALVARE PER REGISTRARE LE MODIFICHE");
					$scope.$apply();
				}else{
					$scope.msg.alertMessage(result.errorMessage);
					$scope.$apply();
				}	
			},error:function(data){
				$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DEL PRODOTTO");
				$scope.$apply();
			}	
		})*/
	};
	$scope.setListId = function(listProd){
		if (listProd.idListProduct == $scope.listid ){
			$scope.listid = -1;
		}else{
			$scope.listid = listProd.idListProduct ;
		}
			
	}
	$scope.incrementPrices = function(){
		$scope.increment.listproducts = $scope.product.listproduct;
		$http.post(AppConfig.ServiceUrls.ListIncrement,$scope.increment).success(function(results){
			if (results.type == "success"){	
				$scope.product.listproduct = results.success
				$scope.searched = false;
				$scope.msg.successMessage("INCREMENTO EFFETTUATO CON SUCCESSO.SALVARE LE MODIFICHE PER RENDERLE EFFETTIVE");
				
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
			
		})
	}
	$scope.upload = function (file) {
        Upload.upload({
            url: '/InvoiceCreator/rest/upload/image',
            file: file
        }).progress(function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' );
        }).success(function (data, status, headers, config) {
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
            $scope.imageProduct = data;
            $scope.product.photo = data;
        }).error(function (data, status, headers, config) {
            console.log('error status: ' + status);
        })
    };
});
