angular.module("rocchi.list")
.controller("PublicListCtrl",function($scope,$http,AppConfig){
	$http.get().success(function(result){
		$scope.list = result;
	})
})