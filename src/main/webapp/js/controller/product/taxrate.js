/**
 * 
 */
/*****
TAXRATE
***/
angular.module("rocchi.product")
.controller('RocchiTaxrateCtrl',function($scope,$http,$modal,$rootScope,AppConfig,AlertsFactory,CommonFunction){
    $scope.taxratesaved = true;
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	var loadList = function(){
		$http.get(AppConfig.ServiceUrls.TaxRate).success(function(data){
			$scope.taxrates= data;
		}).error(function(message){
			$scope.msg.alertMessage(message);
		});
	}
	loadList();
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
	/*$scope.deleteTaxrateElement = function(id){
		for(var i=0;i<$scope.taxrates.length;i++){
			if (id == $scope.taxrates[i].idtaxrate){
				$scope.deleteTaxrate = $scope.taxrates[i];
				$.ajax({
						url:AppConfig.ServiceUrls.TaxRate,
						type:"DELETE",
						data:"taxrateobj="+JSON.stringify($scope.deleteTaxrate),
						success:function(data){
							$scope.msg.successMessage("ALIQUOTA ELIMINATA CON SUCCESSO");
								$http.get(AppConfig.ServiceUrls.TaxRate).success(function(data){
										$scope.taxrates= data;
										$scope.$apply();
								});
								
						},error:function(error){
							
							$scope.msg.alertMessage("ERRORE NELL'ELIMINAZIONE DELL'ALIQUOTA");
						}	
					})
			}	
		}
	}*/
	$scope.saveTaxrates = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.TaxRate,
			type:"PUT",
			data:"taxrates="+JSON.stringify($scope.taxrates),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.taxratesaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$scope.msg.successMessage("ALIQUOTA SALVATA CON SUCCESSO");
					$http.get(AppConfig.ServiceUrls.TaxRate).success(function(data){
						$scope.taxrates= data;
					}).error(function(message){
						$scope.msg.alertMessage(message);
					});
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}	
					
			},
			error:function(result){
				$scope.msg.alertMessage("ERRORE NEL SALVATAGGIO DELL'ALIQUOTA");
			}
			
		})
		
	}
	$scope.deleteElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.TaxRateDelete,obj,loadList);
	};
	
});