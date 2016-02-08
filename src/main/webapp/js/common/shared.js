/**
 * 
 */
angular.module('modules.common.shared', [])
.directive('onEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.onEnter);
        });
        event.preventDefault();
      }
    });
  };
})
.factory("AlertsFactory",function(){
	var factory = {};
	factory.type = "";
	factory.message = "";
	factory.initialize = function(){
		factory.type = "";
		factory.message = "";
	};
	factory.infoMessage = function(message){
		factory.type = "info";
		factory.message = message;
	};
	factory.successMessage = function(message){
		factory.type = "success";
		factory.message = message;
	};
	factory.warningMessage = function(message){
		factory.type = "warning";
		factory.message = message;
	};
	factory.alertMessage = function(message){
		factory.type = "alert";
		factory.message = message;
	};
	return factory;
}).factory("PermissionFactory",function(){
	var factory = {};
	factory.permission = "";
	factory.setupPermission = function(permit){
		factory.permission = permit;
	}
	factory.user = null;
	return factory;
}).factory("LoaderFactory",function(){
	var factory = {};
	factory.loader = false;
	
	return factory;
}).factory("MenuFactory",function(){
	var factory = {};
	factory.ec = false;
	return factory;
}).factory("FormatFactory",function(){
	var factory = {};
	factory.formatCurrency = function(value){
		value=value+"";
		var val = value.split(".");
		if (val.length == 0){
			return '0.00';
		}else if (val.length == 1){
			return val[0]+".00"
		}else if (val.length == 2){
			if (val[1] .length == 1){
				return val[0]+"."+val[1]+"0";
			}else{
				return val[0]+"."+val[1];
			}
		}else{
			return "0.00";
		}
	}
	return factory;
}).factory("DraftFactory",function(){
	var factory = {};
	factory.company = {};
	factory.payments = {};
	factory.user = {};
	factory.checkPayments = function(user){
		var ecp = [];
		if (user && user.iduser){
			ecp = angular.copy(factory.payments);
			if (user.ecpayment){
				ecp.push({ecpayment:user.ecpayment});
			}
		}else{
			ecp = $.grep(factory.payments,function(item){
				return item.ecpayment.nologgeduser == true;
				});
		}
		return ecp;
	}

	return factory;
}).factory('URLFactory', function ($http, $q, AppConfig)
{
    var factory = {};
     factory.getParameter = function (name)
    {

        sParam = name;
        var sPageURL = window.location.href;
        var sURLIntPoint = sPageURL.split('?');
        if (sURLIntPoint.length > 1){
        	var sURLVariables = sURLIntPoint[1].split('&');
            for (var i = 0; i < sURLVariables.length; i++)
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam)
                {
                    this.successMessage = sParameterName[1];
                    return this.successMessage;
                }
            }
        }
        


        return this.successMessage;

    };
    return factory;
}).factory("CommonFunction", function ($http, $q,$modal, AppConfig,AlertsFactory,LoaderFactory){
	var factory = {}
	var deleteElementCallback = function(url,obj,callback){
		LoaderFactory.loader = true;
		$http.post(url,obj)
		.success(function(result){
			if (result.type == "success"){
				AlertsFactory.successMessage(AppConfig.Messages.DeleteSuccessMessage);
			}else{
				AlertsFactory.alertMessage(result.errorMessage);
			}
			if(callback)
				callback();
			LoaderFactory.loader = false;
		})
		.error(function(error){
			LoaderFactory.loader = false;
			AlertsFactory.alertMessage(AppConfig.Messages.GeneralErrorMessage);
		});	
	}
	factory.deleteElement = function (url,obj,callback) {

	    var modalInstance = $modal.open({
	      templateUrl: 'template/alert/cancelalert.html',
	      controller: 'ModalCancelCtrl',
	      resolve: {
	    	  cancelObj: function () {
	          return obj;
	        }
	      }
	    });

	    modalInstance.result.then(function (obj) {
	    	deleteElementCallback(url,obj,callback);
	    });
	  };
	factory.printPDF = function(url){
		LoaderFactory.loader = true;
		$http.get(url).then(function(result){
			var deviceAgent = navigator.userAgent;
			var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				// some code..
			}
			if (ios) {
				// This is the line that matters
				var a = window.document.createElement("a");
				a.target = '_blank';
				a.href = result.data.url;
			 
				// Dispatch fake click
				var e = window.document.createEvent("MouseEvents");
				e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			} else {
				// Your code that works for desktop browsers
				var url = result.data.url;
				window.open(url);
			}
			LoaderFactory.loader = false;
		},function(error){
			LoaderFactory.loader = false;
			AlertsFactory.alertMessage(AppConfig.Messages.GeneralErrorMessage);
		});
	}
	factory.printPDFPost = function(url){
		LoaderFactory.loader = true;
		$http.post(url).then(function(result){
			var deviceAgent = navigator.userAgent;
			var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				// some code..
			}
			if (ios) {
				// This is the line that matters
				var a = window.document.createElement("a");
				a.target = '_blank';
				a.href = result.data.url;
			 
				// Dispatch fake click
				var e = window.document.createEvent("MouseEvents");
				e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				a.dispatchEvent(e);
			} else {
				// Your code that works for desktop browsers
				var url = result.data.url;
				window.open(url);
			}
			LoaderFactory.loader = false;
		},function(error){
			LoaderFactory.loader = false;
			AlertsFactory.alertMessage(AppConfig.Messages.GeneralErrorMessage);
		});
	}
	return factory;
	
}).factory('ModalFactory', function ($modal) {
	var factory = {};
	factory.sendMail = function(user,mailconfig,service){
		var modalInstance = $modal.open({
			  templateUrl: 'template/popup/sendemail.htm',
			  controller: 'EmailCtrl',
			  windowClass: 'app-modal-window',
			  size: "lg",
			  resolve: {
				emailSender: function(){
					return { user: user,mailconfig: mailconfig,service: service,type:'test' };
				}
			}
		});
	};
	factory.sendDocument = function(user,document,service){
		var modalInstance = $modal.open({
			  templateUrl: 'template/popup/sendemail.htm',
			  controller: 'EmailCtrl',
			  windowClass: 'app-modal-window',
			  size: "lg",
			  resolve: {
				emailSender: function(){
					return { user: user,service: service,type:'document',document: document };
				}
			}
		});
	};
	factory.confirm = function(){
		var modalInstance = $modal.open({
			  templateUrl: 'template/popup/confirm.htm',
			  controller: 'ErrorCtrl',
			  windowClass: 'app-modal-window',
			  size: "lg",
			  resolve: {
				emailSender: function(){
					return { };
				}
			  }
		});
	};
	factory.error = function(message){
		var modalInstance = $modal.open({
			  templateUrl: 'template/popup/error.htm',
			  controller: 'ErrorCtrl',
			  windowClass: 'app-modal-window',
			  size: "lg",
			  resolve: {
				emailSender: function(){
					return { message: message };
				}
			}
		});
	};
	return factory;
	
});
