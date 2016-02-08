var gecoAccountingControllers = angular.module("gecoAccountingControllers",[]);

/*****
REGISTRY
***/
gecoAccountingControllers.controller('AccountingCustomerCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
	if ($routeParams.type == 1 || $routeParams.type == 2){
		$scope.isCustomer = true;
		$scope.isSupplier = false;
		$scope.payment={amount:0,customer:true};
		$scope.paymentSelected={amount:0,customer:true};
		$http.get('rest/registry/customer').success(function(data){
				$scope.customers= data;
	});
	}else{
	    $scope.isSupplier = true;
		$scope.isCustomer = false;
		$scope.payment={amount:0,supplier:true};
	$scope.paymentSelected={amount:0,supplier:true};
		$http.get('rest/registry/supplier').success(function(data){
				$scope.suppliers= data;
		});
	}
	
	$(".payment_context").css("display","none");
    $scope.filter={nopaid:true,paid:false};
	
	$scope.suspendedList = [];
	$scope.iscall = false;
	$scope.getSuspended = function(){
		$scope.filter.isCustomer=$scope.isCustomer;
		$scope.filter.isSupplier=$scope.isSupplier;
		$scope.filter.customer = $scope.currentCustomer;
		$scope.filter.supplier = $scope.currentSupplier;
		$scope.suspendeds=[];
		$.ajax({
			url:"rest/accounting/generationdocs/filterdocs",
			type:"POST",
			data:"filter="+JSON.stringify($scope.filter),
			success:function(data){
				var result = $.parseJSON(data);
				if (result.type =="success"){
					$scope.suspendeds = result.success;
					$scope.iscall = true;
					$scope.$apply();
				}
			}	
		});
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
	$scope.isnormal = true;
	$scope.normalPaymentShow = function(){
		$scope.isnormal = true;
		$scope.payment.amount = 0;
		$(".payment_context").css("display","");
	}
	$scope.selectedPaymentShow = function(){
		$scope.isnormal = false;
		//$scope.payment.amount = 0;
		
		$(".payment_context").css("display","");
	}
	$scope.suspendedClicked = function(susp){
		var found = false;
		var index = -1;
		var sign = 1;
		if (susp.head.document.credit == true){
			sign = -1;
		}
		for (var i =0;i< $scope.suspendedList.length;i++){
			if (susp.idSuspended == $scope.suspendedList[i].idSuspended){
				found = true;
				index = i;
			}
		} 
		if (found == true){
			$scope.suspendedList = jQuery.grep($scope.suspendedList, function(value) {
							  return value.idSuspended != susp.idSuspended;
							});
			$scope.paymentSelected.amount = $scope.paymentSelected.amount * 100;
			$scope.paymentSelected.amount -= ((susp.head.total* sign) - (susp.amount *sign)) *100;				
			$scope.paymentSelected.amount = $scope.paymentSelected.amount / 100;
			$scope.paymentSelected.amount =Math.round($scope.paymentSelected.amount * 100) / 100
		}else{
			$scope.suspendedList.push(susp);
			$scope.paymentSelected.amount = $scope.paymentSelected.amount * 100;
			$scope.paymentSelected.amount += ((susp.head.total *sign) - (susp.amount *sign)) *100;
			$scope.paymentSelected.amount = $scope.paymentSelected.amount / 100;	
			$scope.paymentSelected.amount =Math.round($scope.paymentSelected.amount * 100) / 100
		}
		
	}
	$scope.changeCustomer = function(customer){
		$scope.iscall = false;
		
	}
	$scope.savePayment = function(){
		$scope.payment.customer_paid = $scope.currentCustomer;
		$scope.paymentSelected.supplier_paid = $scope.currentSupplier;
		$scope.payment.susp = null;
		$.ajax({
			url:"rest/accounting/paid",
			type:"PUT",
			data:"filter="+JSON.stringify($scope.payment),
			success:function(data){
				result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.getSuspended();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				
			}	
		});
	}
	$scope.savePaymentSelected = function(){
		$scope.paymentSelected.customer_paid = $scope.currentCustomer;
		$scope.paymentSelected.supplier_paid = $scope.currentSupplier;
		$scope.paymentSelected.susp = $scope.suspendedList;
		$.ajax({
			url:"rest/accounting/paid/selsusp",
			type:"PUT",
			data:"filter="+JSON.stringify($scope.paymentSelected),
			success:function(data){
				result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.getSuspended();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
			}	
		});
	}
	
	$scope.sortDeadline = function(deadline) {
		var dateStr = deadline.expiredDate.split("/");
		var date = new Date(dateStr[2],dateStr[1]-1,dateStr[0]);
		return date;
	};
}]);



gecoAccountingControllers.controller('AccountingListCtrl',["$scope","$http","$routeParams",function($scope,$http,$routeParams){
	$scope.total = 0.0;
	$scope.openamount = 0.0;
	$scope.amountgive = 0.0;
	$scope.amountget = 0.0;
	if ($routeParams.type == 1 || $routeParams.type == 2){
		$scope.isCustomer = true;
		$scope.isSupplier = false;
		/*$http.get('rest/registry/customer').success(function(data){
				$scope.customers= data;
		});*/
	}else{
	    $scope.isSupplier = true;
		$scope.isCustomer = false;
		/*$http.get('rest/registry/supplier').success(function(data){
				$scope.suppliers= data;
		});*/
	}
	
	$(".payment_context").css("display","none");
    $scope.filter={nopaid:true,paid:false};
	$scope.payment={amount:0};
	$scope.paymentSelected={amount:0};
	$scope.suspendedList = [];
	$scope.iscall = false;
	$scope.getSuspended = function(){
		$scope.elements=[];
		$.ajax({
			url:"rest/accounting/accounting/movements",
			type:"POST",
			data:"filter="+JSON.stringify($scope.filter),
			success:function(data){
				var result = $.parseJSON(data);
				if (result.type =="success"){
					$scope.elements = result.success;
					for (var i =0;i<$scope.elements.length;i++){
						var element = $scope.elements[i];
						$scope.total = $scope.total + $scope.elements[i].total;
						$scope.openamount = $scope.openamount+ $scope.elements[i].openamount;
						if ((element.customer == true && element.debit == true) ||  (element.supplier == true && element.credit == true)){
							$scope.amountgive = $scope.amountgive + element.amount;
						}else{
							$scope.amountget = $scope.amountget + element.amount;
						}
					}
					$scope.total = Math.round($scope.total * 100) / 100
					$scope.openamount = Math.round($scope.openamount * 100) / 100
					$scope.amountget = Math.round($scope.amountget * 100) / 100
					$scope.amountgive = Math.round($scope.amountgive * 100) / 100
					$scope.iscall = true;
					$scope.$apply();
				}
			}	
		});
	}
	
}]);