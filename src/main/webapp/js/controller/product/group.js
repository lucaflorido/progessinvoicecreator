/**
 * 
 */
angular.module("rocchi.product")
.controller('RocchiGroupProductCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory,CommonFunction){
    $scope.msg = AlertsFactory;
    $scope.msg.initialize();
	$scope.groupproductsaved = true;
	var loadList = function() {
		$http.get(AppConfig.ServiceUrls.ProductGroup).success(function(data){
			$scope.groupproducts= data;
		});
	}
	loadList();
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
	
	$scope.deleteElement = function (obj) {

		CommonFunction.deleteElement(AppConfig.ServiceUrls.ProductGroupDelete,obj,loadList);
	  };
	$scope.savegroupproducts = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.ProductGroup,
			type:"PUT",
			data:"groupproducts="+JSON.stringify($scope.groupproducts),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.groupproductsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$scope.msg.successMessage("SALVATAGGIO RIUSCITO CON SUCCESSO");
					$http.get(AppConfig.ServiceUrls.ProductGroup).success(function(data){
						$scope.groupproducts= data;
					});
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}	
					
					
			}	
		})
		
	}
	
	
});