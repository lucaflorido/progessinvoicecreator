var gecoBasicControllers = angular.module("gecoBasicControllers",[]);

/*****
TAXRATE
***/
gecoBasicControllers.controller('TaxrateCtrl',["$scope","$http","$rootScope",function($scope,$http,$rootScope){
    
	$scope.taxratesaved = true;
	$http.get(GECO_LOGGEDUSER.getSecondDomain()+'rest/basic/taxrate').success(function(data){
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
						url:GECO_LOGGEDUSER.getSecondDomain()+"rest/basic/taxrate/",
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
			url:GECO_LOGGEDUSER.getSecondDomain()+"rest/basic/taxrate",
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
	
	
}]);

/*****
Store Movement
***/
gecoBasicControllers.controller('StoreMovementCtrl',["$scope","$http",function($scope,$http){
    
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
Customer Category
***/

gecoBasicControllers.controller('CustomerCategoryCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.customercategorysaved = true;
	$http.get(GECO_LOGGEDUSER.getSecondDomain()+'rest/basic/categorycustomer').success(function(data){
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
						url:GECO_LOGGEDUSER.getSecondDomain()+"rest/basic/categorycustomer/",
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
			url:GECO_LOGGEDUSER.getSecondDomain()+"rest/basic/categorycustomer",
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
