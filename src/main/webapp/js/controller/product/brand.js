/**
 * 
 */
/**
 * 
 */
angular.module("rocchi.product")
.controller('RocchiBrandCtrl',function($scope,$http,$modal,AppConfig,AlertsFactory,CommonFunction){
	$scope.msg = AlertsFactory;
    $scope.msg.initialize();
	$scope.brandsaved = true;
	var loadList = function(){
		$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
			$scope.brands= data;
		});
	}
	loadList();
	$scope.modifyid = 0;
	$scope.modifybrandElement = function(id){
		if ($scope.modifyid != id){
			$scope.modifyid = id;
			$scope.detailViewOpen(id);
		}else{
			$scope.modifyid = 0;
			$scope.detailViewClose(id);
		}
	}
	
	$scope.addbrandElement = function(id){
		$scope.brandsaved = false;
		$scope.brands.push({idBrand:0});
	}
	
	$scope.deletebrandElement = function(id){
		for(var i=0;i<$scope.brands.length;i++){
			if (id == $scope.brands[i].idBrand){
				$scope.deletebrand = $scope.brands[i];
				$.ajax({
						url:AppConfig.ServiceUrls.Brand,
						type:"DELETE",
						data:"brandobj="+JSON.stringify($scope.deletebrand),
						success:function(data){
							$scope.msg.successMessage("ELEIMINAZIONE EFFETTUATA CON SUCCESSO");
								$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
										$scope.brands= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.deleteElement = function (obj) {
		CommonFunction.deleteElement(AppConfig.ServiceUrls.BrandDelete,obj,loadList);
	 };
	$scope.savebrands = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.Brand,
			type:"PUT",
			data:"brands="+JSON.stringify($scope.brands),
			success:function(data){
				result = JSON.parse(data);
				if (result.type == "success"){	
					$scope.brandsaved = true;
					$scope.modifyid = 0;
					$scope.$apply();
					$scope.msg.successMessage("ELEMENTO SALVATO CON SUCCESSO");
					$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
						$scope.brands= data;
					});
				}else{
					$scope.msg.alertMessage(result.errorMessage);
				}	
					
					
			}	
		})
		
	}
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