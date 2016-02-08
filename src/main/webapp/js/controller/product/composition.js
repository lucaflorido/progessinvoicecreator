/**
 * 
 */
angular.module("rocchi.product")
.controller('RocchiCompositionCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory,CommonFunction){
    $scope.msg = AlertsFactory;
    $scope.msg.initialize();
	$scope.compositionsaved = true;
	var loadList = function(){
		$http.get(AppConfig.ServiceUrls.Composition).success(function(data){
			$scope.compositions= data;
		});
	}
	loadList();
	$scope.modifyid = 0;
	$scope.modifycompositionElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
		}else{
			$scope.modifyid = 0
		}
	}
	$scope.addcompositionElement = function(id){
		$scope.compositionsaved = false;
		$scope.compositions.push({idComposition:0});
	}
	$scope.deletecompositionElement = function(id){
		for(var i=0;i<$scope.compositions.length;i++){
			if (id == $scope.compositions[i].idComposition){
				$scope.deletecomposition = $scope.compositions[i];
				$http.post(AppConfig.ServiceUrls.CompositionDelete,$scope.deletecomposition).then(function(result){
					$scope.msg.successMessage("ELIMINAZIONE RIUSCITA CON SUCCESSO");
					$http.get(AppConfig.ServiceUrls.Composition).success(function(data){
								$scope.compositions= data;
						});
				});
				
			}	
		}
	}
	$scope.deleteElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.CompositionDelete,obj,loadList);
	};
	$scope.savecompositions = function(){
		
		$http.put(AppConfig.ServiceUrls.Composition,$scope.compositions).success(function(result){
			if (result.type == "success"){	
				$scope.compositionsaved = true;
				$scope.modifyid = 0;
				
				$scope.msg.successMessage("SALVATAGGIO RIUSCITO CON SUCCESSO");
				$http.get(AppConfig.ServiceUrls.Composition).success(function(data){
					$scope.compositions= data;
				});
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}	
		});
		
	}
	
	
});