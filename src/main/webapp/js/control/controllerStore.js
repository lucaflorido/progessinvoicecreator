var gecoStoreControllers = angular.module("gecoStoreControllers",[]);

/*****
REGISTRY
***/
gecoStoreControllers.controller('StoreCtrl',["$scope","$http",function($scope,$http){
    $scope.companysaved = true;
	/*$http.get('rest/store/list').success(function(data){
		$scope.products = data;
		
	});*/
	$http.get('rest/basic/brand').success(function(data){
		$scope.brands = data;
		
	});
	$http.get('rest/basic/groupproduct').success(function(data){
		$scope.groups = data;
		
	});
	$http.get('rest/basic/categoryproduct').success(function(data){
		$scope.categorys = data;
		
	});
	$scope.changeCategory = function(){
		$scope.subcategories = $scope.currentCategory.subcategories		
		$scope.currentSubCategory = null;
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
	$scope.filter = {};
	$scope.filterProduct = function(){
		$.ajax({
				url:"rest/store/filteredlist",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filter),
				success:function(data){
					$scope.products= JSON.parse(data);
					$scope.$apply();
				}	
		})
	}
}]);
gecoStoreControllers.controller('StoreNeededCtrl',["$scope","$http","$location","$rootScope",function($scope,$http,$location,$rootScope){
    $scope.filterObj = {};
	$scope.neededObj = {};
	$scope.listsections = ["Seleziona","Genera"];
	$scope.selectedSection = $scope.listsections[0];
	//$(".datepicker").datepicker({ dateFormat: "dd/mm/yy" });
	$http.get('rest/store/list').success(function(data){
		$scope.products = data;
		
	});
	$http.get('rest/registry/supplier').success(function(data){
		$scope.suppliers = data;
	});
	$http.get('rest/basic/document').success(function(data){
		$scope.documents= data;
	});
	
	$scope.filterDocs = function(){
		//$scope.generateobj.heads = $scope.heads;
		$.ajax({
				url:"rest/store/neededlist",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filterObj),
				success:function(data){
					$scope.heads= JSON.parse(data);
					if ($scope.heads.length>0){
						$scope.selectedSection = $scope.listsections[1];
					}
					$scope.$apply();
				}	
		})
	}
	$scope.neededDoc = function(){
		$scope.neededObj.heads = $scope.heads;
		$.ajax({
				url:"rest/store/neededdoc",
				type:"POST",
				data:"needed="+JSON.stringify($scope.neededObj),
				success:function(data){
					$scope.heads= JSON.parse(data);
					$scope.$apply();
					$rootScope.headfilter = {};
					$rootScope.showFilter = true;
					$rootScope.headfilter.fromDate = $scope.neededObj.date;
					$rootScope.headfilter.toDate = $scope.neededObj.date;
					$location.path("/headlist/2/1");
					$scope.$apply();
				}	
		})
	}
	$scope.setGenerate = function(head){
		if ( head.generate == false){
			head.generate = true;
			$("#check"+head.idHead).prop("checked",true);
		}else{
			head.generate = false;
			$("#check"+head.idHead).prop("checked",false);
		}
	}
	$scope.setAllGenerate = function(){
		if ($(".checkbox_all").prop('checked') == true){
			for (var i =0;i<$scope.heads.length;i++){
				$scope.heads[i].generate = true;
			}
			$(".checkbox_single").prop("checked",true);
		}else{
			for (var i =0;i<$scope.heads.length;i++){
				$scope.heads[i].generate = false;
			}
			$(".checkbox_single").prop("checked",false);
		}
		
	}
}]);



gecoStoreControllers.controller('ReportOrderCtrl',["$scope","$http",function($scope,$http){
    $scope.filterObj = {};
	$scope.neededObj = {};
	
	$http.get('rest/basic/document').success(function(data){
		$scope.documents= data;
	});
	$scope.calculateReport = function(){
		//$scope.generateobj.heads = $scope.heads;
		$.ajax({
				url:"rest/head/createreport",
				type:"POST",
				data:"filter="+JSON.stringify($scope.filter),
				success:function(data){
					result = JSON.parse(data);
						if (result.type == "success"){	
							$scope.objects = result.success;
							
							$scope.$apply();
							
							
						}else{
							alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
						}
					$scope.$apply();
				}	
		})
	}
	$scope.printElements = function(){
		$.ajax({
						url:"rest/print/reportorder/",
						type:"POST",
						data:"filter="+JSON.stringify($scope.objects),
						success:function(data){
							//alert("Utente eliminato con successo");
							window.open(JSON.parse(data), '_blank');
						}	
					})
	}
	
}]);
