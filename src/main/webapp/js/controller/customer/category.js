/**
 * 
 */
angular.module("rocchi.customer")
.controller('RocchiCustomerCategoryListCtrl',function($scope,$http,$modal,AlertsFactory,AppConfig,CommonFunction){
    $scope.msg = AlertsFactory;
    $scope.msg.initialize();
	$scope.customercategorysaved = true;
	var loadList = function(){
		$http.get(AppConfig.ServiceUrls.CustomerCategory).success(function(data){
			$scope.customercategorys= data;
		});
	}
	loadList();
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
	$scope.savecustomercategorys = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.CustomerCategory,
			type:"PUT",
			data:"categorycustomers="+JSON.stringify($scope.customercategorys),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.customercategorysaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$scope.msg.successMessage("CATEGORIA SALVATA CON SUCCESSO");
					$http.get(AppConfig.ServiceUrls.CustomerCategory).success(function(data){
						$scope.customercategorys= data;
					});
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}
										
			},error:function(error){
				
				$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DELLA CATEGORIA");
			}		
		})
		
	}
	
	$scope.deleteElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.CustomerCategoryDelete,obj,loadList);
	};
	
});
