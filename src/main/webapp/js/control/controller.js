var gecoControllers = angular.module("gecoControllers",[]);
/**
	LOGIN CONTROLLER
*/
gecoControllers.controller('LoginCtrl',["$scope","$http","$rootScope","$location","PermissionFactory","AlertsFactory","AppConfig","$cookies","FormatFactory","DraftFactory",function($scope,$http,$rootScope,$location,PermissionFactory,AlertsFactory,AppConfig,$cookies,FormatFactory,DraftFactory){
	$rootScope.viewheader = false;
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$scope.step = 0;
	$scope.formatCurrency = FormatFactory.formatCurrency,
	$scope.perm = PermissionFactory;
	$scope.draftFactory = DraftFactory;
	$scope.paymentValue = {};
	$scope.paymentValue.code = "";
	$scope.prodlist = [];
	$scope.Range = function(start, end) {
	    var result = [];
	    for (var i = start; i <= end; i++) {
	        result.push(i);
	    }
	    return result;
	};
	
	/*$http.get('/InvoiceCreator/rest/user/startup').success(function(data){
	});*/
	
	
	$scope.loginfunction = function(){
		$http.post(AppConfig.ServiceUrls.Login+AppConfig.Const.CompanyId,$scope.login).success(function(result){
			
			if (result.type == 'success'){
				result = result.success;
				if (result.username !== null && result.username != ""){
					
					$rootScope.user = result;
					$rootScope.path = result.path;
					PermissionFactory.setupPermission(result.path);
					PermissionFactory.user = angular.copy(result);
					DraftFactory.user = angular.copy(PermissionFactory.user);
					$rootScope.viewheader = true;
					$scope.msg.initialize();
					if (PermissionFactory.permission != AppConfig.Permissions.Customer){
						$location.path('/welcome');
					}else{
						$location.path('/welcome_customer');
					}
					$scope.ecpayments = DraftFactory.checkPayments(PermissionFactory.user);
				}else{
					
				}
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
		}).error(function(error){
			$scope.msg.alertMessage(AppConfig.Const.ServerProblem)
		});
		
	};
	
	$("#logoutbutton").click(function(e){
		$scope.loginout();
	})
	$("#enterpassword").bind('keypress', function(e) {
		var code = e.keyCode || e.which;
		 if(code == 13) { //Enter keycode
		   //Do something
		   $scope.loginfunction();
		 }
	});
	
	$(".redobutton").click(function(e){
		alert($("ifname").attr("required"));
	})
	/*$http.get('rest/user').success(function(data){
		$scope.users= data;
	});*/
	


	
}]);
gecoControllers.controller('WelcomeCtrl',function($scope,$rootScope,$location,CommonFunction,PermissionFactory,AppConfig){
	GECO_LOGGEDUSER.checkloginuser();
	$scope.location = $location;
	$scope.auth = PermissionFactory;
	$scope.conf_permission = AppConfig.Permissions;
	$scope.logout = function(){
		$.ajax({
			url:"rest/user/logout/",
			type:"GET",
			success:function(data){
					
					$location.path('/login');
			}	
		})
	}
	
	$scope.printPriceList = function(){
		CommonFunction.printPDF(AppConfig.ServiceUrls.PrintListFromUser);
	}

});
gecoControllers.controller('ParametersCtrl',['$scope','$rootScope','$location',function($scope,$rootScope,$location){
	
}]);
gecoControllers.controller('UserListCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$http.get('rest/user').success(function(data){
		$scope.users= data;
	});
	$scope.deleteElement = function(id){
		for(var i=0;i<$scope.users.length;i++){
			if (id == $scope.users[i].iduser){
				$scope.deleteUser = $scope.users[i];
				$.ajax({
						url:"rest/user/",
						type:"DELETE",
						data:"userobj="+JSON.stringify($scope.deleteUser),
						success:function(data){
							alert("Utente eliminato con successo");
							$http.get('rest/user').success(function(data){
								$scope.users= data;
							});
						}	
					})
			}	
		}
	}
	$scope.printElements = function(){
		$http.get('rest/print').success(function(data){
					window.open(data, '_blank');
		});
	}
	
}]);

gecoControllers.controller('UserDetailCtrl',['$scope', '$routeParams','$http',function($scope,$routeParams,$http){
	GECO_LOGGEDUSER.checkloginuser();
	GECO_validator.startupvalidator();
	$scope.userId= $routeParams.userId ;
	
	$http.get('rest/role/').success(function(data){
		$scope.roles= data;
		$http.get('rest/user/'+$scope.userId).success(function(data){
			$scope.user= data;
			for (var i=0;i<$scope.roles.length;i++){
				if($scope.roles[i].idrole == $scope.user.role.idrole){
					$scope.currentRole = $scope.roles[i];
				}
			}
		});
	});
	
	$(".savebutton").click(function(e){
	    if (GECO_validator.requiredFields()== true && GECO_validator.emailFields()==true){
			$scope.user.role = $scope.currentRole;
			$.ajax({
				url:"rest/user/",
				type:"PUT",
				data:"loginobj="+JSON.stringify($scope.user),
				success:function(data){
					alert("success");
				}	
			})
		}
	} );
}]);

gecoControllers.controller('MyProfileCtrl',function($scope,$http,AppConfig,AlertsFactory){
	//GECO_LOGGEDUSER.checkloginuser();
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$scope.isuser = true;
	/*$http.get('rest/role/').success(function(data){
		$scope.roles= data;*/
		$http.get(AppConfig.ServiceUrls.CheckUser).success(function(data){
			$scope.cuser= data;
			
		});
	//});
	
	$scope.saveuser = function(){
		$http.post(AppConfig.ServiceUrls.UserSave,$scope.cuser).success(function(result){
			$scope.msg.successMessage("Utente salvato con successo");
		})
		/*$.ajax({
			url:"rest/user/",
			type:"PUT",
			data:"loginobj="+JSON.stringify($scope.user),
			success:function(data){
				$scope.msg.successMessage("Utente salvato con successo")
			}	
		})*/
	};
	$scope.changepassword = function(){
		$http.post(AppConfig.ServiceUrls.UserChangePassword,$scope.cuser).then().success(function(result){
			if (result.type == "success"){
				$scope.msg.successMessage("Password cambiata con successo");
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
			
		})
		
		/*$.ajax({
			url:"rest/user/changepassword/",
			type:"PUT",
			data:"userobj="+JSON.stringify($scope.user),
			success:function(data){
				$scope.msg.successMessage("Password cambiata con successo")
			}	
		})*/
		
	};
	$scope.changeView = function(){
		$scope.isuser = !$scope.isuser;
	}
	$scope.addMilConfig = function(){
		if ($scope.user.company.mailconfig == undefined || $scope.user.company.mailconfig == null ){
			$scope.user.company.mailconfig = [];
		}
		$scope.user.company.mailconfig.push({});
	}
	$scope.testemail = function(mailconfig){
		//ModalFactory.sendMail($scope.user,mailconfig,$scope.emailService);
		
		
	}
	$scope.emailService = function(user,mailconfig){
		$.ajax({
			url:"rest/email/test/",
			type:"POST",
			data:"user="+JSON.stringify(user)+"&mailconfig="+JSON.stringify(mailconfig),
			success:function(data){
				
				var results = JSON.parse(data);
				if (results.type == "success"){	
						$scope.products = results.success;
						$scope.$apply();
						$scope.errorMessage("Verificare ricezione email");
					}else{
						$scope.errorMessage("Errore: "+results.errorName+" Messaggio:"+results.errorMessage);
					}	
			}	
		});
	};
});
/*****
ROLE
***/
gecoControllers.controller('RoleCtrl',["$scope","$http",function($scope,$http){
    $scope.loginuser = GECO_LOGGEDUSER.checkloginuser();
	$scope.rolesaved = true;
	$http.get('rest/role').success(function(data){
		$scope.roles= data;
	});
	$scope.modifyid = 0;
	$scope.modifyRoleElement = function(id){
		$scope.modifyid = id;
	}
	$scope.addRoleElement = function(id){
		$scope.rolesaved = false;
		$scope.roles.push({idrole:0});
	}
	$scope.deleteRoleElement = function(id){
		for(var i=0;i<$scope.roles.length;i++){
			if (id == $scope.roles[i].idrole){
				$scope.deleteRole = $scope.roles[i];
				$.ajax({
						url:"rest/role/",
						type:"DELETE",
						data:"roleobj="+JSON.stringify($scope.deleteRole),
						success:function(data){
								$http.get('rest/role').success(function(data){
										$scope.roles= data;
								});
								
						}	
					})
			}	
		}
	}
	$scope.saveRoles = function(){
		$.ajax({
			url:"rest/role/",
			type:"PUT",
			data:"roles="+JSON.stringify($scope.roles),
			success:function(data){
				$http.get('rest/role').success(function(data){
						$scope.roles= data;
						$scope.rolesaved = true;
						$scope.modifyid = 0;
				});
			}	
		})
	}
}]);
/*****
LOGOUT
***/
gecoControllers.controller('StartupCtrl',function($scope,$rootScope,$http,$location,AppConfig,PermissionFactory,DraftFactory,LoaderFactory,MenuFactory){
    $rootScope.viewheader = false;
    $scope.auth = PermissionFactory;
    $scope.loader = LoaderFactory;
    $scope.menu = MenuFactory;
    $scope.conf_permission = AppConfig.Permissions;
	$scope.logout = function(){
		$http.get(AppConfig.ServiceUrls.Logout).then(
				function(result){
					$rootScope.viewheader = false;
					PermissionFactory.user = null;
					$location.path('/login');
				}
		);
	}
	$http.get(AppConfig.ServiceUrls.CheckUser).then(
			function(result){
				if (result && result.data && result.data.username && result.data.username != "" ){
					//checkrole(result);
					$rootScope.viewheader = true;
					$rootScope.user = result.data;
					$rootScope.path = result.data.path;
					PermissionFactory.setupPermission(result.data.path);
					PermissionFactory.user = angular.copy(result.data);
					DraftFactory.user = angular.copy(PermissionFactory.user);
					
				}else{
					if ($location.path() != "/ec" && $location.path() != "/ecpassword" && $location.path() != "/publiclist"  ){
						$location.path('/login');
					}
				}
			}
	);
	$scope.loginfunction = function(){
		$http.post(AppConfig.ServiceUrls.Login,$scope.login).success(function(result){
			
			if (result.type == 'success'){
				result = result.success;
				if (result.username !== null && result.username != ""){
					$(".myprofilelabel").html(result.username);
					$rootScope.user = result;
					$rootScope.path = result.path;
					PermissionFactory.setupPermission(result.path);
					$rootScope.viewheader = true;
					//$scope.msg.initialize();
					PermissionFactory.user = result;
					if (PermissionFactory.permission != AppConfig.Permissions.Customer){
						$location.path('/welcome');
					}
					//$scope.ecpayments = DraftFactory.checkPayments(PermissionFactory.user);
				}else{
					
				}
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
		}).error(function(error){
			$scope.msg.alertMessage(AppConfig.Const.ServerProblem)
		});
		
	};
	$scope.openProfile = function(){
		$location.path("/myprofile");
	} 
	$scope.openCompany = function(){
		$location.path("/company");
	} 
	
});

gecoControllers.controller('ProfileCtrl',function($scope,$http,AppConfig,$cookies,FormatFactory,DraftFactory){
	$http.get(AppConfig.ServiceUrls.CheckUser).success(function(data){
		$scope.user= data;
	});
});
/*gecoControllers.controller('ECommerceCtrl',["$scope","$http","$rootScope","$location","PermissionFactory","AlertsFactory","AppConfig","$cookies","FormatFactory","DraftFactory",function($scope,$http,$rootScope,$location,PermissionFactory,AlertsFactory,AppConfig,$cookies,FormatFactory,DraftFactory){
	$rootScope.viewheader = false;
	$scope.msg = AlertsFactory;
	$scope.msg.initialize();
	$scope.step = 0;
	$scope.formatCurrency = FormatFactory.formatCurrency,
	$scope.perm = PermissionFactory;
	$scope.draftFactory = DraftFactory;
	$scope.paymentValue = {};
	$scope.paymentValue.code = "";
	$scope.prodlist = [];
	$scope.Range = function(start, end) {
	    var result = [];
	    for (var i = start; i <= end; i++) {
	        result.push(i);
	    }
	    return result;
	};
	var controlAddress = function(){
		if (!$scope.draftaddress){
			$scope.draftaddress = {};
		}
		if (!$scope.draftaddress.countryObj){
			$scope.draftaddress.countryObj = null;
		}else{
			if ( $scope.draftaddress.countryObj.idCountry == null ||  $scope.draftaddress.countryObj.idCountry  == undefined ){
				var cn = angular.copy($scope.draftaddress.countryObj);
				$scope.draftaddress.countryObj = {};
				$scope.draftaddress.countryObj.name = cn;
				$scope.draftaddress.countryObj.idCountry = 0;
			}
		}
		
		if (!$scope.draftaddress.zoneObj){
			$scope.draftaddress.zoneObj = null;
		}else{
			if ( $scope.draftaddress.zoneObj.idZone == null ||  $scope.draftaddress.zoneObj.idZone  == undefined  ){
				var cnz = angular.copy($scope.draftaddress.zoneObj);
				$scope.draftaddress.zoneObj = {};
				$scope.draftaddress.zoneObj.name = cnz;
				$scope.draftaddress.zoneObj.idZone = 0;
			}
		}
		
		if (!$scope.draftaddress.cityObj){
			$scope.draftaddress.cityObj = null;
		}else{
			if ( $scope.draftaddress.cityObj.idCity == null ||  $scope.draftaddress.cityObj.idCity  == undefined ){
				var cnc = angular.copy($scope.draftaddress.cityObj);
				$scope.draftaddress.cityObj = {};
				$scope.draftaddress.cityObj.name = cnc;
				$scope.draftaddress.cityObj.idCity = 0;
			}
		}
		
	}
	var intitialize = function(){
		$http.get(AppConfig.ServiceUrls.ProductCategory).success(function(data){
			$scope.categories= data;
		});
		$http.get(AppConfig.ServiceUrls.ProductGroup).success(function(data){
			$scope.groups= data;
		});
		$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
			$scope.brands= data;
		});
		$http.get(AppConfig.ServiceUrls.Region).success(function(data){
			$scope.regions= data;
		});
		
			$http.get(AppConfig.ServiceUrls.Country).success(function(result){
				$scope.countries = result;
				
			});
			controlAddress();
			$http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
				if (result.type == "success"){
					$scope.draft.deliverycost  = result.success;
				}
			});
		
	};
	$scope.subcategories = [];
	$scope.changeCategory = function(){
		$scope.subcategories = [];
		$scope.subcategories = $scope.filter.category.subcategories;
	}
	intitialize();
	$scope.onSelect = function ($item, $model, $label) {
	    $scope.draftaddress.countryObj = $model;
	    $http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
			if (result.type == "success"){
				$scope.draft.deliverycost  = result.success;
			}
			$http.get(AppConfig.ServiceUrls.Zone+$scope.draftaddress.countryObj.idCountry).success(function(result){
				$scope.zones = result;
			});
			$http.get(AppConfig.ServiceUrls.CityCountry+$scope.draftaddress.countryObj.idCountry).success(function(result){
				$scope.cities = result;
			});
		});
	};
	$scope.onSelectZone = function ($item, $model, $label) {
		$scope.draftaddress.zoneObj = $model;
		controlAddress();
		$http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
			if (result.type == "success"){
				$scope.draft.deliverycost  = result.success;
			}
			
			$http.get(AppConfig.ServiceUrls.CityZone+$scope.draftaddress.zoneObj.idZone).success(function(result){
				$scope.cities = result;
			});
		});
	};
	//TODO eliminare gli oggetti
	
	$scope.calculateTransportPrice = function(){
		
		controlAddress();
		$scope.zones = [];
		$scope.cities = [];
		$scope.draftaddress.zoneObj = null;
		$scope.draftaddress.cityObj = null;
		$http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
			if (result.type == "success"){
				$scope.draft.deliverycost  = result.success;
			}
		
		});
	};
	$scope.onSelectCity = function ($item, $model, $label) {
		$scope.draftaddress.cityObj = $model;
		controlAddress();
		$http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
			if (result.type == "success"){
				$scope.draft.deliverycost  = result.success;
			}
		});
	};
	
	$scope.zoneChange = function(){
		controlAddress();
		$scope.draftaddress.cityObj = null;
		if ($scope.draftaddress.countryObj.idCountry){
			$http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
				if (result.type == "success"){
					$scope.draft.deliverycost  = result.success;
				}
				$http.get(AppConfig.ServiceUrls.Zone+$scope.draftaddress.countryObj.idCountry).success(function(result){
					$scope.zones = result;
				});
				$http.get(AppConfig.ServiceUrls.CityCountry+$scope.draftaddress.countryObj.idCountry).success(function(result){
					$scope.cities = result;
				});
			});
		}else{
			$scope.cities = [];
		}
	}
	$scope.cityChange = function(){
		controlAddress();
		if ($scope.draftaddress.countryObj.idCountry){
			$http.post(AppConfig.ServiceUrls.DeliveryCost+AppConfig.Const.CompanyId,$scope.draftaddress).success(function(result){
				if (result.type == "success"){
					$scope.draft.deliverycost  = result.success;
				}
				
			});
		}
	}
	$http.get(AppConfig.ServiceUrls.Company+AppConfig.Const.CompanyId).success(function(result){
		DraftFactory.company = result;
		DraftFactory.payments = DraftFactory.company.ecpayments;
		$scope.ecpayments = DraftFactory.checkPayments(PermissionFactory.user);
	});
	if (!navigator.cookieEnabled){
		 alert("Attenzione i cookie non sono abilitati...alcune informazioni potrebbero essere perse");
		 $http.post(AppConfig.ServiceUrls.DraftInit+AppConfig.Const.CompanyId,"").success(function(result){
			if(result.type == "success"){
				$scope.draft = result.success
				
				$scope.getProductsNumber();
			}
		 });
	}else{
		var cookie = $cookies.get("PRODraft");
		$http.post(AppConfig.ServiceUrls.DraftInit+AppConfig.Const.CompanyId,cookie).success(function(result){
			if(result.type == "success"){
				$scope.draft = result.success
				$cookies.put("PRODraft",$scope.draft.id);
				
				$scope.getProductsNumber();
			}
		});
	}
	
	$scope.loginfunction = function(){
		$http.post(AppConfig.ServiceUrls.Login,$scope.login).success(function(result){
			
			if (result.type == 'success'){
				result = result.success;
				if (result.username !== null && result.username != ""){
					$(".myprofilelabel").html(result.username);
					$rootScope.user = result;
					$rootScope.path = result.path;
					PermissionFactory.setupPermission(result.path);
					PermissionFactory.user = angular.copy(result);
					DraftFactory.user = angular.copy(PermissionFactory.user);
					$rootScope.viewheader = true;
					$scope.msg.initialize();
					if (PermissionFactory.permission != AppConfig.Permissions.Customer){
						$location.path('/welcome');
					}
					$scope.ecpayments = DraftFactory.checkPayments(PermissionFactory.user);
				}else{
					
				}
			}else{
				$scope.msg.alertMessage(result.errorMessage);
			}
		}).error(function(error){
			$scope.msg.alertMessage(AppConfig.Const.ServerProblem)
		});
		
	};
	$scope.addToChart = function(product){
		$http.post(AppConfig.ServiceUrls.DraftAdd+$scope.draft.id+"/"+AppConfig.Const.CompanyId,product).success(function(result){
			if(result.type == "success"){
				$scope.draft = result.success;
				product.added= true;
			}
		});
	}
	$scope.updateChart = function(product,force){
		if (product.added == true || force){
			$http.post(AppConfig.ServiceUrls.DraftUpdate+$scope.draft.id,product).success(function(result){
				if(result.type == "success"){
					$scope.draft = result.success;
					
				}
			});
		}
		
	}
	$scope.confirmChart = function(user){
		DraftFactory.user.entity = null;
		$http.post(AppConfig.ServiceUrls.DraftConfirm+$scope.draft.id+"/"+$scope.paymentValue.code,DraftFactory.user).success(function(result){
			if(result.type == "success"){
				switch(result.success){
					case "confirmed":
						$scope.step = 3;
						break;
					case "paypal":
						//$scope.userNew = PermissionFactory.user;
						$("#paypalform").submit();
						break;
				}
				
				
			}
		});
		
		
	}
	$scope.removeChart = function(product){
		
			$http.post(AppConfig.ServiceUrls.DraftRemove+$scope.draft.id+"/"+AppConfig.Const.CompanyId,product).success(function(result){
				if(result.type == "success"){
					$scope.draft = result.success;
					resetRemovedElement(product)
				}
			});
		
		
	}
	var resetRemovedElement = function(element){
		angular.forEach($scope.prodlist,function(value){
			if (value.product.idProduct == element.product.idProduct){
				value.added = false;
			}
		});
	}
	$("#logoutbutton").click(function(e){
		$scope.loginout();
	})
	$("#enterpassword").bind('keypress', function(e) {
		var code = e.keyCode || e.which;
		 if(code == 13) { //Enter keycode
		   //Do something
		   $scope.loginfunction();
		 }
	});
	
	$(".redobutton").click(function(e){
		alert($("ifname").attr("required"));
	})
	
	if ($scope.filter == null){
		$scope.filter = {"pagefilter":{}};
		$scope.currentGroup = {};
		$scope.currentBrand = {};
		$scope.currentCategory = {};
		$scope.currentSubCategory = {};
		$scope.currentSupplier = {};
	}else{
		$scope.currentGroup = $scope.filter.group;
		$scope.currentBrand = $scope.filter.brand;
		$scope.currentCategory = $scope.filter.category;
		$scope.currentSubCategory = $scope.filter.subcategory;
		$scope.currentSupplier = $scope.filter.supplier;
	}
	$scope.getProducts = function(page){
		$scope.filter.pagefilter.startelement = (page - 1 ) * $scope.pagesize_confirmed;
		$scope.filter.pagefilter.pageSize = $scope.pagesize_confirmed;
		$scope.filter = $scope.filter
		$http.post(AppConfig.ServiceUrls.ProductMainPublicList+AppConfig.Const.CompanyId,$scope.filter).then(function(result){
			$scope.prodlist = result.data;
			angular.forEach($scope.draft.products,function(item){
				$scope.tempDraft = item;
				angular.forEach($scope.prodlist,function(elem){
					if (elem.product.idProduct == $scope.tempDraft.product.idProduct){
						elem.quantity = $scope.tempDraft.quantity;
						elem.added = true;
					}
				});
			});
		})
		
}
	$scope.pagesize = 6;
$scope.getProductsNumber = function(){
	
	if ($scope.prodlist.length != $scope.pagesize){
	$scope.pages = [];
	$scope.totalitems = 0;
	$scope.pageArray = [];
		$http.get(AppConfig.ServiceUrls.ProductPublicPagination+$scope.pagesize+"/"+AppConfig.Const.CompanyId).then(function(result){
			$scope.pages = result.data.pages;
			$scope.totalitems = result.data.totalitems;
			$scope.pagesize_confirmed = $scope.pagesize;
			$scope.getProducts(1);
		});
		
	}else{
		$scope.getProducts(1);
	}
}

	
}]);*/


