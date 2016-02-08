angular.module("rocchi.list")
.controller('RocchiListListCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory){
    
	$scope.msg = AlertsFactory;
    $scope.msg.initialize()
	
	$http.get(AppConfig.ServiceUrls.List).success(function(data){
		$scope.lists= data;
	});
	$scope.deleteListElement = function(id){
		for(var i=0;i<$scope.lists.length;i++){
			if (id == $scope.lists[i].idList){
				$scope.deletelist = $scope.lists[i];
				$.ajax({
						url:AppConfig.ServiceUrls.List,
						type:"DELETE",
						data:"listobj="+JSON.stringify($scope.deletelist),
						success:function(data){
							$scope.msg.successMessage("ELIMINAZIONE RIUSCITA CON SUCCESSO");
							$http.get(AppConfig.ServiceUrls.List).success(function(data){
								$scope.lists= data;
							});
						}	
					})
			}	
		}
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
	    	$scope.deleteListElement(id);
	    });
	  };
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
})
.controller('RocchiListDetailCtrl',function($scope,$http,$stateParams,ScopeFactory,AppConfig,AlertsFactory,CommonFunction){
    
	$scope.newList = {isPercentage:true};
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
    $scope.idlist= $stateParams.idlist;

	$scope.menuselected = "";
	$scope.filter = {"pagefilter":{}};
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
	};
	$scope.subcategories = [];
	$scope.changeCategory = function(){
		$scope.subcategories = [];
		$scope.subcategories = $scope.filter.category.subcategories;
	}
	intitialize();
	
		/*$http.get(AppConfig.ServiceUrls.List+$scope.idlist).success(function(data){
			$scope.list= data;
			$scope.getProductsNumber();
		});*/
	
	
	$scope.getProductsNumber = function(){
		$scope.pages = [];
		$scope.totalitems = 0;
		$scope.pageArray = [];
			$http.get(AppConfig.ServiceUrls.ProductListPagination+$scope.pagesize+"/"+$scope.idlist).then(function(result){
				$scope.pages = result.data.pages;
				$scope.totalitems = result.data.totalitems;
				$scope.pagesize_confirmed = $scope.pagesize;
				$scope.getProducts(1);
			});
			
		
	}
	
	$scope.getProducts = function(page){
		$scope.filter.pagefilter.startelement = (page - 1 ) * $scope.pagesize_confirmed;
		$scope.filter.pagefilter.pageSize = $scope.pagesize_confirmed;
		$scope.filter = $scope.filter
		$http.post(AppConfig.ServiceUrls.List+$scope.idlist,$scope.filter).success(function(data){
			$scope.list= data;
		});
		/*$http.post(AppConfig.ServiceUrls.ProductMainList,$scope.filter).then(function(result){
			$scope.products = result.data.success;
		})*/
		
	}
	$scope.getProductsNumber();
	$scope.addProdElement = function(list){
		$scope.prodid = 0
		list.listproduct.push({idListProduct:0});
	}
	$scope.changeProdElement = function(ump){
	    
		if (ump.product != null){
			for(var i=0;i<$scope.list.listproduct.length;i++){
				if (ump.product.idProduct == $scope.list.listproduct[i].product.idProduct){
					$scope.currentProd = $scope.list.listproduct[i].product;
				}
			}
		}
		$scope.prodid = ump.idListProduct
	}
	$scope.calculatePercentage = function(listprod){
		var obj = {purchaseprice:listprod.product.purchaseprice,sellprice:listprod.price,percentage:listprod.percentage,endprice:listprod.endprice,taxrate:listprod.product.taxrate.value};
		$.ajax({
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
		})
	};
	$scope.calculateSellPrice = function(listprod){
		var obj = {purchaseprice:listprod.product.purchaseprice,sellprice:listprod.price,percentage:listprod.percentage,endprice:listprod.endprice,taxrate:listprod.product.taxrate.value};
		$.ajax({
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
		})
	};
	$scope.calculateEndPrice = function(listprod){
		var obj = {purchaseprice:listprod.product.purchaseprice,sellprice:listprod.price,percentage:listprod.percentage,endprice:listprod.endprice,taxrate:listprod.product.taxrate.value};
		$.ajax({
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
				$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DEL LISTINO");
				$scope.$apply();
			}	
		})
	};
	$scope.saveProduct = function(){
	//if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			
			
			$scope.newList.list = $scope.list;
			$scope.value = 0;
			$.ajax({
				url:AppConfig.ServiceUrls.List,
				type:"PUT",
				data:"lists="+JSON.stringify($scope.newList),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.list.idList = result.success;
						$scope.idlist = result.success;
						$scope.msg.successMessage("LISTINO SALVATO CON SUCCESSO");
						/*$http.get(AppConfig.ServiceUrls.List+$scope.idlist).success(function(data){
							$scope.list= data;
						});*/
						$scope.getProductsNumber();
					}else{
						$scope.msg.alertMessage(result.errorMessage);
					}	
				},error:function(data){
					$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DEL LISTINO");
				}	
			})
		//}
	} ;
	$scope.incrementPrices = function(){
		$scope.increment.listproducts = $scope.list.listproduct;
		$http.post(AppConfig.ServiceUrls.ListIncrement,$scope.increment).success(function(results){
			if (results.type == "success"){	
				$scope.list.listproduct = results.success
				$scope.searched = false;
				$scope.msg.successMessage("INCREMENTO EFFETTUATO CON SUCCESSO.SALVARE LE MODIFICHE PER RENDERLE EFFETTIVE");
				
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
			
		})
	}
	$scope.addProductsFiltered = function(){
		//$scope.filterToAdd = angular.copy($scope.filter);
		if (!$scope.filterToAdd)
			$scope.filterToAdd = {};	
		$scope.filterToAdd.pagefilter = null;
		$http.post(AppConfig.ServiceUrls.AddProductToList+$scope.idlist,$scope.filterToAdd).success(function(results){
			if (results.type == "success"){	
				$scope.getProductsNumber();
				$scope.msg.successMessage("PRODOTTI AGGIUNTI CON SUCCESSO");
				
			}else{
				$scope.msg.alertMessage(results.errorMessage);
			}	
			
		})
	}
	$scope.deleteElement = function(obj){
		CommonFunction.deleteElement(AppConfig.ServiceUrls.ProductListDelete,obj,$scope.getProductsNumber);
	}
	$scope.printList = function(code){
		CommonFunction.printPDFPost(AppConfig.ServiceUrls.PrintList+code);
	}
});
