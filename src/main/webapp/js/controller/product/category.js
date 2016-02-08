/**
 * 
 */
angular.module("rocchi.product")
.controller('RocchiCategoryProductCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory,CommonFunction){
	$scope.msg = AlertsFactory;
    $scope.msg.initialize();
	$scope.categoryproductsaved = true;
	var loadList = function(){
		$http.get(AppConfig.ServiceUrls.ProductCategory).success(function(data){
			$scope.categoryproducts= data;
			$scope.selectedcategory = null;
		});
	}
	loadList();
	$scope.modifyid = 0;
	$scope.modifycategoryproductElement = function(cat){
		if ($scope.modifyid != cat.idCategoryProduct){
			$scope.modifyid = cat.idCategoryProduct;
			//$scope.selectedcategory = cat;
		}else{
			$scope.modifyid = 0;
			//$scope.selectedcategory = null;
		}
	}
	$scope.enableSubCategory = function(cat){
		$scope.selectedcategory = cat;
	}
	$scope.disableSubCategory = function(){
		$scope.selectedcategory = null;
	}
	$scope.modifysubcategoryproductElement = function(cat){
		if ($scope.modifyscid != cat.idSubCategoryProduct){
			$scope.modifyscid = cat.idSubCategoryProduct;
			
		}else{
			$scope.modifyscid = 0;
			
		}
	}
	$scope.addcategoryproductElement = function(id){
		$scope.categoryproductsaved = false;
		$scope.categoryproducts.push({idCategoryProduct:0});
		$scope.modifyid = 0;
		//$scope.selectedcategory = $scope.categoryproducts[$scope.categoryproducts.length - 1];
	}
	$scope.addSubCategoryElement = function(){
		$scope.categoryproductsaved = false;
		$scope.selectedcategory.subcategories.push({idSubCategoryProduct:0});
			
		
	}
	$scope.savecategoryproducts = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.ProductCategory,
			type:"PUT",
			data:"categoryproducts="+JSON.stringify($scope.categoryproducts),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.categoryproductsaved = true;
					$scope.modifyid = 0;
					$scope.modifyscid = 0;
					$scope.selectedcategory = null;
					$scope.$apply();
					$scope.msg.successMessage("ELEMENTO SALVATO CON SUCCESSO");
					$http.get(AppConfig.ServiceUrls.ProductCategory).success(function(data){
						$scope.categoryproducts= data;
					});
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}	
					
					
			}	
		})
		
	}
	$scope.deleteElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.ProductCategoryDelete,obj,loadList);
	};
	$scope.deleteSubElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.ProductSubCategoryDelete,obj,loadList);
	};
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
    	$(".detailview").css("display","none")
	});
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
});