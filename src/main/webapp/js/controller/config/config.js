/**
 * 
 */
angular.module("rocchi.config")
.controller("DocumentFlowCtrl",function($scope,$http,$modal,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$http.get(AppConfig.ServiceUrls.DocumentList,'').success(function(data){
		$scope.documents= data;
		$http.get(AppConfig.ServiceUrls.DocumentFlow,'').success(function(data){
			$scope.flows = data;
		});
	});
	$scope.addFlow = function(){
		if (!$scope.flows)
			$scope.flows = [];
		$scope.flows.push({update:true});
	}
	$scope.saveFlow = function(flow){
		$http.post(AppConfig.ServiceUrls.DocumentFlow,flow).success(function(data){
			$scope.msg.successMessage("SALVATAGGIO EFFETTUATO");
			$http.get(AppConfig.ServiceUrls.DocumentFlow,'').success(function(data){
				$scope.flows = data;
			});
		});
	}
	$scope.updateFlow= function(flow){
		angular.forEach($scope.flows,function(value) {value.update = false});
		angular.forEach($scope.documents,function(value) { 
				if (flow.documentSource.idDocument == value.idDocument){
					flow.documentSource = value;
				}
				if (flow.documentResult.idDocument == value.idDocument){
					flow.documentResult = value;
				}
		});
		flow.update = true;
	}
	$scope.deleteFlow = function(flow){
		$http.post(AppConfig.ServiceUrls.DocumentFlowDelete,flow).success(function(data){
			$scope.msg.successMessage("ELIMINAZIONE RIUSCITA CON SUCCESSO");
			$http.get(AppConfig.ServiceUrls.DocumentFlow,'').success(function(data){
				$scope.flows = data;
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
	    	$scope.deleteFlow(id);
	    });
	  };
}).controller('RocchiDocumentCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
    $scope.documentsaved = true;
	$scope.currentStore = null;
	$scope.currentCounter = null;
	$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
		$scope.counters= data;
	});
	$http.get(AppConfig.ServiceUrls.StoreMovement).success(function(data){
		$scope.storemovements= data;
	});
	$http.get(AppConfig.ServiceUrls.Document).success(function(data){
		$scope.documents= data;
	});
	$scope.modifyid = 0;
	$scope.modifydocumentElement = function(doc){
		if ($scope.modifyid != doc.idDocument){
			for(var i=0;i<$scope.storemovements.length;i++){
				if($scope.storemovements[i].idstoremovement == doc.storemovement.idstoremovement){
					$scope.currentStore = $scope.storemovements[i];
					
				}
			}
			for(var i=0;i<$scope.counters.length;i++){
				if($scope.counters[i].idCounter == doc.counter.idCounter){
					$scope.currentCounter = $scope.counters[i];
					
				}
			}
			$scope.modifyid = doc.idDocument;
		}else{
			$scope.modifyid = 0;
		}
		
		
		
	}
	$scope.changeCounter = function(doc){
		doc.counter = $scope.currentCounter;
	}
	$scope.changeStore = function(doc){
		doc.storemovement = $scope.currentStore;
	}
	$scope.adddocumentElement = function(id){
		$scope.documentsaved = false;
		$scope.documents.push({idDocument:0});
	}
	$scope.deletedocumentElement = function(id){
		for(var i=0;i<$scope.documents.length;i++){
			if (id == $scope.documents[i].idDocument){
				$scope.deletedocument = $scope.documents[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Document,
						type:"DELETE",
						data:"documentobj="+JSON.stringify($scope.deletedocument),
						success:function(data){
							var result = JSON.parse(data)
							if (result.type == "success"){
								$scope.msg.successMessage("ELIMINAZIONE RIUSCITA CON SUCCESSO");
							}else{
								$scope.msg.alertMessage(result.errorMessage);
							}
							$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
								$scope.counters= data;
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
	    	$scope.deletedocumentElement(id);
	    });
	  };
	$scope.savedocuments = function(){
		
		$.ajax({
			url:AppConfig.ServiceUrls.Document,
			type:"PUT",
			data:"documents="+JSON.stringify($scope.documents),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.documentsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$scope.msg.successMessage("SALVATAGGIO EFFETTUATO");
					$http.get(AppConfig.ServiceUrls.Document).success(function(data){
							$scope.documents= data;
					});
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}
					
					
			}	
		})
		
	}
	
	
}).controller('RocchiCounterCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory){
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
    $scope.countersaved = true;
	$scope.orderYear="year";
	
	$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
		$scope.counters= data;
	});
	$scope.modifyid = 0;
	$scope.modifycounterElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
			$scope.detailViewOpen(id);
		}else{
			$scope.modifyid = 0;
			$scope.detailViewClose(id);
		}
	}
	$scope.addcounterElement = function(id){
		$scope.countersaved = false;
		$scope.counters.push({idCounter:0});
	}
	$scope.deletecounterElement = function(id){
		for(var i=0;i<$scope.counters.length;i++){
			if (id == $scope.counters[i].idCounter){
				$scope.deletecounter = $scope.counters[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Counter,
						type:"DELETE",
						data:"counterobj="+JSON.stringify($scope.deletecounter),
						success:function(data){
							var result = JSON.parse(data)
							if (result.type == "success"){
								$scope.msg.successMessage("ELIMINAZIONE RIUSCITA CON SUCCESSO");
							}else{
								$scope.msg.alertMessage(result.errorMessage);
							}
							$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
								$scope.counters= data;
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
	    	$scope.deletecounterElement(id);
	    });
	  };
	$scope.savecounters = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.CounterSave,
			type:"PUT",
			data:"counters="+JSON.stringify($scope.counters),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.countersaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$scope.msg.successMessage("SALVATAGGIO EFFETTUATO");
					$http.get(AppConfig.ServiceUrls.Counter).success(function(data){
										$scope.counters= data;
								});

				}else{
					alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
				}
			}	
		})
	}
	$scope.detailView = function(id){
		
		if ($("#detail"+id).hasClass("open")){
			$scope.detailViewOpen(id);
		}else{
			$scope.detailViewClose(id);
		}
	}
	$scope.detailViewOpen = function(id){
		$("#detail"+id).removeClass("open");
		$("#detail"+id).addClass("close");
		$("#detailview"+id).css("display","");
	}
	$scope.detailViewClose = function(id){
		$("#detail"+id).removeClass("close");
			$("#detail"+id).addClass("open");
			$("#detailview"+id).css("display","none");
	}
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".detailview").css("display","none")
	});
}).controller('ModalCancelCtrl', function ($scope, $modalInstance, cancelObj) {

	  $scope.ok = function () {
		 $modalInstance.close(cancelObj);
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	});