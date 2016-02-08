/**
 * 
 */
angular.module("rocchi.documents")
.controller('RocchiHeadListCtrl',function($scope,$http,$stateParams,$rootScope,AppConfig,$location,LoaderFactory){
    
	$scope.pagesize = 10;
	$scope.pageArray = [];
	$scope.headamount = 0;
	$scope.headtaxamount = 0;
	$scope.headtotal = 0;
	$scope.location = $location;
	$scope.goBack = function(){
    	$location.path("/welcome_customer")
    }
	//$scope.headfilter={};
	$scope.heads = [];
	if ($scope.headfilter == null){
		$scope.headfilter = {};
		$scope.currentCustomer = {};
		$scope.currentDocument = {};
		$scope.currentSuppllier = {};
	}else{
		$scope.currentCustomer = $scope.headfilter.customer;
		$scope.currentDocument = $scope.headfilter.document;
		$scope.currentSuppllier = $scope.headfilter.supplier;
		if($scope.headfilter.pageSize)
			$scope.pagesize = $scope.headfilter.pageSize;
	}
	if ($stateParams.section == 1){
		$scope.headfilter.isCustomer = true;
		$scope.headfilter.isSupplier = false;
	}else{
		$scope.headfilter.isCustomer = false;
		$scope.headfilter.isSupplier = true;
	}
	if ($stateParams.type == 1){
		$scope.headfilter.isOrder = true;
		$scope.headfilter.isInvoice = false;
		$scope.headfilter.isTransport = false;
	}else{
		if ($stateParams.type == 2){
			$scope.headfilter.isInvoice = true;
			$scope.headfilter.isOrder = false;
			$scope.headfilter.isTransport = false;
		}else if ($stateParams.type == 3){
			$scope.headfilter.isOrder = false;
			$scope.headfilter.isTransport = true;
			$scope.headfilter.isInvoice = false;
		}
		
	}
	/*$http.get('rest/registry/supplier').success(function(data){
				$scope.suppliers= data;
	});*/
	$http.get(AppConfig.ServiceUrls.ListOfCustomerSoft,'').success(function(data){
		$scope.customers= data;
	});
	$http.get(AppConfig.ServiceUrls.DocumentList,'').success(function(data){
		$scope.documents= data;
	});
	$scope.sendDocumentByEmail = function(head){
		ModalFactory.sendDocument($rootScope.user,head,$scope.sendByEmail);
	}
	$scope.sendByEmail = function(user,head,mailconfig){
		$.ajax({
				url:"rest/email/document/",
				type:"POST",
				data:"head="+JSON.stringify(head)+"&user="+JSON.stringify(user)+"&mailconfig="+JSON.stringify(mailconfig),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						
						alert("ok");
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}
				})
	}
	
	$scope.getHeads = function(page){
			$scope.headsToPrint	= [];
			$scope.headfilter.startelement = (page - 1 ) * $scope.pagesize;
			$scope.headfilter.pageSize = $scope.pagesize;
			$rootScope.headfilter = $scope.headfilter;
			$http.post(AppConfig.ServiceUrls.HeadPaging,$scope.headfilter).success(function(result){
				$scope.heads= result;
				for(var i=0;i<$scope.heads.length;i++){
					$scope.headamount = $scope.headamount + $scope.heads[i].amount;
					$scope.headtaxamount = $scope.headtaxamount + $scope.heads[i].taxamount;
					$scope.headtotal = $scope.headtotal + $scope.heads[i].total;
					$scope.headamount = Math.round($scope.headamount * 100)/100;
					$scope.headtaxamount = Math.round($scope.headtaxamount * 100)/100;
					$scope.headtotal = Math.round($scope.headtotal * 100)/100;
				}
				LoaderFactory.loader = false;
			}).error(function(error){
				LoaderFactory.loader = false;
			});
			
	}
	
	$scope.getHeadsNumber = function(){
		//if ($scope.heads.length != $scope.pagesize){
		$scope.pages = [];
		$scope.pageArray = [];
		LoaderFactory.loader = true;
		$scope.headfilter.pageSize = $scope.pagesize;
		$http.post(AppConfig.ServiceUrls.HeadNumber+$scope.pagesize,$scope.headfilter).success(function(result){
			$scope.pages = result.pages;
			$scope.totalitems = result.totalitems;
			$scope.pagesize_confirmed = $scope.pagesize;
			/*for (var i=0;i<$scope.pages;i++){
				$scope.pageArray.push(i+1);
			}*/
			$scope.getHeads(1);
		})
			
		//}
	}
	$scope.getHeadsNumber();
	$rootScope.deleteElement = function(){
		$.ajax({
			url:AppConfig.ServiceUrls.DocumentList,
			type:"DELETE",
			data:"headobj="+JSON.stringify($rootScope.deleteObj),
			success:function(data){
				//alert("Utente eliminato con successo");
				$scope.getHeadsNumber();
			}	
		})
			
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data);
		});
	}
	$scope.printMassElements = function(){
		$.ajax({
						url:"rest/print/heads/",
						type:"POST",
						data:"ids="+JSON.stringify($scope.headsToPrint),
						success:function(data){
							var deviceAgent = navigator.userAgent;
							// Set var to iOS device name or null
							var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
							if (ios) {
								// This is the line that matters
								$scope.openTab(JSON.parse(data));
							} else {
								// Your code that works for desktop browsers
								//$scope.openTab(JSON.parse(data));
								window.open(JSON.parse(data));
								//$scope.openTab(JSON.parse(data));
							}
							//window.open(JSON.parse(data));
							//window.location.replace(JSON.parse(data));
						}	
					})
	}
	
	$scope.headsToPrint = [];
	$scope.addRemoveHeadId = function(id){
		var found = false;
		var indexToRemove = 0;
		for (var i=0;i<$scope.headsToPrint.length;i++ ){
			if ($scope.headsToPrint[i] == id ){
				found = true;
			}
		}
		if (found == false){
			$scope.headsToPrint.push(id);
		}else{
			$scope.headsToPrint = jQuery.grep($scope.headsToPrint, function(value) {
			  return value != id;
			});
		}
	}
	$scope.getRowsWithSerialNumbers = function(id){
		$scope.idHeadSN = id;
		$.ajax({
				url:"rest/head/serialnumberList/"+id,
				type:"POST",
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$( "#dialog" ).dialog( "option", "minWidth", 550 );
						$( "#dialog" ).dialog( "option", "minHeight", 350 );
						$("#dialog").dialog("open")
						$scope.prods = result.success;
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
	$scope.getRowSerialNumber = function(row){
		$.ajax({
				url:"rest/head/copyrowserialnumber/",
				type:"POST",
				data:"row="+JSON.stringify(row),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.prods.push( result.success);
						$scope.$apply();
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
	$scope.saveRowSerialNumber = function(){
		$.ajax({
				url:"rest/head/saverowsserialnumber/"+$scope.idHeadSN,
				type:"PUT",
				data:"row="+JSON.stringify($scope.prods),
				success:function(data){
					result = JSON.parse(data);
					if (result.type == "success"){	
						$scope.$apply();
						alert("success")
					}else{
						alert("Errore: "+result.errorName+" Messaggio:"+result.errorMessage);
					}	
				}	
			})
	}
	$scope.dateSortFunction = function(head) {
		var date = head.date.split("/");
		return date[2]+date[1]+date[0];
	};
	$scope.dateSortReverseFunction = function(head) {
		var date = head.date.split("/");
		return "-"+date[2]+date[1]+date[0];
	};
	$scope.addRemoveHeads = function(){
		$scope.headsToPrint	= [];
		if ($(".checkbox_all").prop('checked') == true){
			for (var i=0;i<$scope.heads.length;i++ ){
				$scope.headsToPrint.push($scope.heads[i].idHead);
			}
			$(".checkbox_single").prop("checked",true);
		}else{
			$(".checkbox_single").prop("checked",false);
		}
	}
	$scope.exportHeads = function(){
		$http.post(AppConfig.ServiceUrls.ExportHeads,$scope.heads).then(function(result){
			var deviceAgent = navigator.userAgent;
			// Set var to iOS device name or null
			var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
			if (ios) {
				// This is the line that matters
				$scope.openTab(result.data.success);
			} else {
				// Your code that works for desktop browsers
				//$scope.openTab(JSON.parse(data));
				window.open(result.data.success);
				//$scope.openTab(JSON.parse(data));
			}
		},function(resolve){})
	}});