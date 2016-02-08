var emailController = angular.module("email.module",[]);
/**
	LOGIN CONTROLLER
*/
emailController.controller('EmailCtrl',["$scope","$http","$rootScope","$location","$modalInstance","emailSender",function($scope,$http,$rootScope,$location,$modalInstance,emailSender){
	$scope.user = emailSender.user;
	$scope.type = emailSender.type;
	$scope.mails = emailSender.user.company.mailconfig;
	$scope.mailUserSelected = {idMailConfig:$scope.mails[0].mailconfig.idMailConfig};
	$scope.mailconfig = emailSender.mailconfig;
	$scope.close = function(){
		$modalInstance.close();
	};
	$scope.sendEmail = function(){
		emailSender.service($scope.user,$scope.mailconfig);
		$scope.close();
	};
	$scope.message = emailSender.message;
	$scope.document = emailSender.document;
	$scope.sendDocument = function(){
		for (var i=0;i<$scope.mails.length;i++){
			if ($scope.mailUserSelected.idMailConfig == $scope.mails[i].mailconfig.idMailConfig){
				$scope.mailSelected = $scope.mails[i].mailconfig;
			}
			
		}
		$scope.mailSelected.password = $scope.mailUserSelected.password;
		emailSender.service($scope.user,$scope.document,$scope.mailSelected);
		$scope.close();
	};
	$scope.names = ['pizza', 'unicorns', 'robots'];
       $scope.my = { favorite: 'unicorns' };
}]);
emailController.controller('ErrorCtrl',["$scope","$http","$rootScope","$location","$modalInstance","emailSender",function($scope,$http,$rootScope,$location,$modalInstance,emailSender){

	$scope.message = emailSender.message;
	$scope.close = function(){
		$modalInstance.close();
	};
}]);