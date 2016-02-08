/**
 * 
 */
angular.module("rocchi.transporter")
.controller('RocchiTransporterListCtrl',["$scope","$http","AppConfig",function($scope,$http,AppConfig){
    //$scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$http.get(AppConfig.ServiceUrls.Transporter).success(function(data){
		$scope.transporters= data;
	});
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.transporters.length;i++){
			if (id == $scope.transporters[i].idTransporter){
				$scope.deletetransporter = $scope.transporters[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Transporter,
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
	
}])
.controller('RocchiTransporterDetailCtrl',["$scope","$http","$stateParams","AppConfig",function($scope,$http,$stateParams,AppConfig){
    //GECO_LOGGEDUSER.checkloginuser();
	$scope.listsections = ["Dettagli","Listini","Destinazioni"];
	$scope.selectedSection = $scope.listsections[0];
	GECO_validator.startupvalidator();
	$scope.idtransporter= $stateParams.idtransporter;
	$http.get(AppConfig.ServiceUrls.List).success(function(data){
		$scope.lists= data;
	});
	$http.get(AppConfig.ServiceUrls.Transporter+$scope.idtransporter).success(function(data){
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
				url:AppConfig.ServiceUrls.Transporter,
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