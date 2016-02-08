
var gecoActiveApp = angular.module("gecoActiveApp",
["mm.foundation"])
.provider('AppConfig', function ()
		{
			var main_domain = "/InvoiceCreator"
		    this.$get = function ($window)
		    {
		    	return {
	            ServiceUrls: {
	            		ActivateUser:main_domain+ "/rest/user/activate/"
		             },Permissions:{
		            	Promoter:"promoter",
		            	Transporter:"transporter",
		            	Admin:"",
		            	Customer:"customer"
		            }
		        };
		    };
		})
.directive('capitalize', function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
		if (inputValue != null && inputValue != undefined){
			   var capitalized = inputValue.toUpperCase();
			   if(capitalized !== inputValue) {
				  modelCtrl.$setViewValue(capitalized);
				  modelCtrl.$render();
				}         
				return capitalized;
			 }
			 modelCtrl.$parsers.push(capitalize);
			 capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
		 }
     }
   };
}).directive('createDatepicker', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            
                    element.datepicker({ dateFormat: "dd/mm/yy" ,inline: true,  
            showOtherMonths: true,  
			firstDay:1,
			monthNames: [ "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre" ],
            dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab']   });
            
        }
    }
}).controller('MainController',function($scope,$http,AppConfig){
	$scope.result = "";
	var code = "";
	var getUserCode = function ()
    {
        
            sParam = "code";
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            for (var i = 0; i < sURLVariables.length; i++)
            {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam)
                {
                	code= sParameterName[1];
                    
                }
            }
            $http.post(AppConfig.ServiceUrls.ActivateUser+code).success(function(result){
            	if (result.type == "success"){
            		$scope.result = "success";
            	}else{
            		$scope.result = "error";
            	}
            })

       

    };
    getUserCode();
})