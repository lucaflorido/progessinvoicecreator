/**
 * 
 */
angular.module("rocchi.customer")
.controller('RocchiCustomerGroupListCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory){
    $scope.customergroupsaved = true;
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	var loadlist = function(){
		$http.get(AppConfig.ServiceUrls.CustomerGroup).success(function(data){
			$scope.customergroups= data;
		}).error(function(message){
			$scope.msg.alertMessage(message);
		});
	}
	loadlist();
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
	$scope.savecustomergroups = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.CustomerGroup,
			type:"PUT",
			data:"groupcustomers="+JSON.stringify($scope.customergroups),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.customergroupsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$http.get(AppConfig.ServiceUrls.CustomerGroup).success(function(data){
						$scope.customergroups= data;
					});
					$scope.msg.successMessage(AppConfig.Messages.SaveSuccessMessage);
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}
				
					
			},error:function(error){
				
				$scope.msg.alertMessage(AppConfig.Messages.GeneralErrorMessage);
			}		
		})
		
	}
	$scope.deleteElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.CustomerGroupDelete,obj,loadlist);
	};
	
});

