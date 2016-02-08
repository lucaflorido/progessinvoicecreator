/**
 * 
 */
angular.module("rocchi.promoter")
.controller('RocchiPromoterDetailCtrl',["$scope","$http","$stateParams","AppConfig","AlertsFactory",function($scope, $http, $stateParams, AppConfig,AlertsFactory) {
					// GECO_LOGGEDUSER.checkloginuser();
					
					$scope.msg = AlertsFactory;
					$scope.msg.initialize();
					$scope.showuser = false;
					$scope.idpromoter = $stateParams.idpromoter;

					 
					$http.get(AppConfig.ServiceUrls.Promoter+ $scope.idpromoter)
							.success(
									function(data) {
										$scope.promoter = data;
										
										
									});
					
					$scope.savePromoter = function() {
						$scope.msg.initialize();
						$.ajax({
									url : AppConfig.ServiceUrls.Promoter,
									type : "PUT",
									data : "promoters="+ JSON.stringify($scope.promoter),
									success : function(data) {
										result = JSON.parse(data);
										if (result.type == "success") {
											$scope.promoter.idPromoter = result.success;
											$scope.idpromoter = result.success;
											$scope.msg.successMessage("RAPPRESENTANTE SALVATO CON SUCCESSO");
											$scope.$apply();
										} else {
											$scope.msg.alertMessage(result.errorMessage);
										}

									},
									error : function(data) {
										$scope.msg.alertMessage(data);
									}
								})
						// }
					};
					/*$scope.userPromoter = function() {
						$.ajax({
									url : "rest/registry/customer/user",
									type : "PUT",
									data : "customers="
											+ JSON
													.stringify($scope.customer)
											+ "&role="
											+ JSON
													.stringify($scope.currentRole),
									success : function(data) {
										result = JSON.parse(data);
										if (result.type == "success") {
											$scope.customer.idCustomer = result.success;
											$scope.idcustomer = result.success;
											$scope.confirmSaved();
											$scope.$apply();
										} else {
											alert("Errore: "
													+ result.errorName
													+ " Messaggio:"
													+ result.errorMessage);
										}
									}
								})
					};*/
					$scope.userPromoter = function(){
						var obj = {};
						obj.promoter = $scope.promoter;
						obj.role = $scope.currentRole;
						$http.put(AppConfig.ServiceUrls.PromoterUser,obj).then(function(results){
							$scope.showuser = false;
							$scope.promoter.hasuser = true;
							$scope.msg.successMessage("UTENTE CREATO CON SUCCESSO");
						},function(error){
							$scope.msg.alertMessage(error);
						});
					}
					$http.get(AppConfig.ServiceUrls.Role).success(function(data) {
						$scope.roles = data;
					});
}]);
