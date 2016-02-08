/**
 * 
 */
angular.module("rocchi.promoter")
.controller('RocchiPromoterListCtrl',function($scope, $http, $rootScope, $location,$modal,AppConfig,AlertsFactory) {
	$scope.msg = AlertsFactory;
    $scope.msg.initialize();
	$scope.location = $location;
	$http.get(AppConfig.ServiceUrls.Promoter).success(
					function(data) {
						$scope.promoters = data;
						
					});
	$scope.deletePromoterElement = function(id) {
		for (var i = 0; i < $scope.promoters.length; i++) {
			if (id == $scope.promoters[i].idPromoter) {
				$scope.deletepromoter = $scope.promoters[i];
				$.ajax({
						url : AppConfig.ServiceUrls.Promoter,
						type : "DELETE",
						data : "promoterobj="+ JSON.stringify($scope.deletepromoter),
						success : function(data) {
							$scope.msg.successMessage("ELIMINAZIONE RIUSCITA CON SUCCESSO");
							$http.get(AppConfig.ServiceUrls.Promoter).success(
									function(data) {
										$scope.promoters = data;
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
	    	$scope.deletePromoterElement(id);
	    });
	  };
} )