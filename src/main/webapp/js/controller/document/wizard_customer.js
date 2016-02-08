/**
 * 
 */
angular.module("rocchi.documents")
.controller("RocchiWizardCustomerCtrl",function($scope,$http,AppConfig,$location,WizardFactory,AlertsFactory){
	$scope.tabs=[{title:"Carrello",template:"template/document/wizard/stepone_customer.html",name:"step1",active:true,disable:false},
	             {title:"Resoconto",template:"template/document/wizard/steptwo_customer.html",name:"step2",active:false,disable:false}
 
	             ];
	$scope.wiz = WizardFactory;
	$scope.wiz.initialize($scope.tabs);
	$scope.msg = AlertsFactory;
    $scope.msg.initialize();
    $scope.selectedTab = $scope.tabs[0].name;
    $scope.goBack = function(){
    	$location.path("/welcome_customer")
    }
	var init = function(){
		$http.get(AppConfig.ServiceUrls.CustomerUser).success(function(result){
			if (result.type == 'success'){
				var customer = result.success;
				$scope.wiz.head.customer = customer;
				$scope.wiz.head.list = $scope.wiz.head.customer.lists[0].list;
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
		}).error(function(error){
			$scope.msg.alertMessage(AppConfig.Const.ServerProblem)
		});
	}
	init();
	$scope.setSelection = function(tab){
		$scope.wiz.goToStepByName(tab.name);
		$scope.selectedTab = tab.name;
	}
});