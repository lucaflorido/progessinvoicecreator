angular.module("rocchi.customer",[]);
angular.module("rocchi.product",[]);
angular.module("rocchi.list",[]);
angular.module("rocchi.transporter",[]);
angular.module("rocchi.documents",[]);
angular.module("rocchi.parameters",[]);
angular.module("rocchi.promoter",[]);
angular.module("rocchi.config",[]);
var gecoApp = angular.module("gecoApp",
[   "ui.router",
	"gecoControllers",
	"mm.foundation",
	"smart-table",
	"lr.upload",
	"rocchi.customer",
	"rocchi.product",
	"rocchi.transporter",
	"rocchi.documents",
	"rocchi.promoter",
	"rocchi.list",
	'modules.common.shared',
	'ngCookies',
	'ngStorage',
	"geco.ecommerce",
	"angularSpinner",
	"rocchi.config",
"gecoBasicControllers","gecoRegistryControllers","gecoDocumentControllers","gecoStoreControllers","gecoAccountingControllers"])
.provider('AppConfig', function ()
		{
			var main_domain = "/InvoiceCreator/rest/connector/"
		    this.$get = function ($window)
		    {
		    	return {
	            ServiceUrls: {
	            		AddRow:main_domain+ "ADD_ROW/",
	            		CustomerCategory:main_domain+ "CUSTOMER_CATEGORY/",
	            		CustomerGroup:main_domain+ "CUSTOMER_GROUP/",
	            		CustomerCategoryDelete:main_domain+ "CUSTOMER_CATEGORY_DELETE/",
	            		CustomerGroupDelete:main_domain+ "CUSTOMER_GROUP_DELETE/",
	            		CustomerUser:main_domain+ "CUSTOMER_USER/",
	            		Company:main_domain+ "COMPANY/",
	            		CompanyMailConfigDelete:main_domain+ "COMPANY_MAIL_CONFIG_DELETE/",
	            		Country:main_domain+ "COUNTRY/",
	            		Counter:main_domain+ "COUNTER/",
	            		CounterSave:main_domain+ "COUNTER_SAVE/",
	            		Currency:main_domain+"CURRENCY/",
	            		Zone:main_domain+ "ZONE/",
	            		City:main_domain+ "CITY/",
	            		CityCountry:main_domain+ "CITY_COUNTRY/",
	            		CityZone:main_domain+ "CITY_ZONE/",
	            		Composition:main_domain+ "COMPOSITION/",
	            		CompositionDelete:main_domain+ "COMPOSITION_DELETE/",
	            		DetailsOfCustomer:main_domain+ "DETAILS_OF_CUSTOMER/",
	            		DocumentList:main_domain+ 'DOCUMENT_LIST/',
	            		DraftInit:main_domain+ 'DRAFT_INIT/',
	            		DraftAdd:main_domain+ 'DRAFT_ADD/',
	            		DraftRefresh:main_domain+ 'DRAFT_REFRESH/',
	            		DraftRemove:main_domain+ 'DRAFT_REMOVE/',
	            		DraftUpdate:main_domain+ 'DRAFT_UPDATE/',
	            		DraftConfirm:main_domain+ 'DRAFT_CONFIRM/',
	            		Delivery:main_domain+ "DELIVERY/",
	            		DeliveryCost:main_domain+ "DELIVERY_COST/",
	            		DocumentFlow:main_domain+ "DOCUMENT_FLOW/",
	            		DocumentFlowDelete:main_domain+ "DOCUMENT_FLOW_DELETE/",
	            		HeadPaging:main_domain+ 'HEAD_PAGING/',
	            		HeadNumber:main_domain+ 'HEAD_NUMBER/',
		                ListOfCustomer:main_domain+'LIST_OF_CUSTOMER/',
		                ListOfCustomerWithPriceList:main_domain+ "LIST_OF_CUSTOMER_WITH_PRICE_LIST/",
		                ListOfCustomerDelete:main_domain+ "LIST_OF_CUSTOMER_DELETE/",
		                ListOfCustomerSoft:main_domain+ "LIST_OF_CUSTOMER_SOFT/",
		                ListOfCustomerDestinations:main_domain+ "LIST_OF_CUSTOMER_DESTINATIONS/",
		                PrintHead:main_domain+ "PRINT_HEAD/",
		                Product:main_domain+ "PRODUCT/",
		                ProductDelete:main_domain+ "PRODUCT_DELETE/",
		                ProductPublic:main_domain+ "PRODUCT_PUBLIC/",
		                SaveCustomer:main_domain+ "SAVE_CUSTOMER/",
		                ProductMainList:main_domain+ "PRODUCT_MAIN_LIST/",
		                ProductMainListPrice:main_domain+ "PRODUCT_MAIN_LIST_PRICE/",
		                
		                ProductMainPublicList:main_domain+ "PRODUCT_MAIN_PUBLIC_LIST/",
		                ProductBasicPrice:main_domain+ "PRODUCT_BASIC_PRICE/",
		                ProductBasicPriceList:main_domain+ "PRODUCT_BASIC_PRICE_LIST/",
		                ProductCategory:main_domain+ "PRODUCT_CATEGORY/",
		                ProductCategoryDelete:main_domain+ "PRODUCT_CATEGORY_DELETE/",
		                ProductSubCategory:main_domain+ "PRODUCT_SUB_CATEGORY/",
		                ProductSubCategoryDelete:main_domain+ "PRODUCT_SUB_CATEGORY_DELETE/",
		                ProductGroup:main_domain+ "PRODUCT_GROUP/",
		                ProductGroupDelete:main_domain+ "/PRODUCT_GROUP_DELETE",
		                ProductIncrement:main_domain+ "PRODUCT_INCREMENT/",
		                Brand:main_domain+ "BRAND/",
		                BrandDelete:main_domain+ "BRAND_DELETE/",
		                HeadTotal:main_domain+"HEAD_TOTAL/",
		                RowTotal:main_domain+"ROW_TOTAL/",
		                HeadAllTotal:main_domain+"HEAD_ALL_TOTAL/",
		                List:main_domain+ "LIST/",
		                ListPublic:main_domain+ "LIST_PUBLIC/",
		                AddProductToList:main_domain+ "ADD_PRODUCT_TO_LIST/",
		                ListNoProduct:main_domain+ "LIST_NO_PRODUCT/",
		                Login:main_domain+ "LOGIN/",
		                LoginEc:main_domain+ "LOGIN_EC/",
		                CreateEcUser:main_domain+ "CREATE_EC_USER/",
		                EcRecoverUID:main_domain+ "EC_RECOVER_UID/",
		                EcRecoverPWD:main_domain+ "EC_RECOVER_PWD/",
		                EcAskRecoverPWD:main_domain+ "EC_ASK_RECOVER_PWD/",
		                Logout:main_domain+"LOGOUT/",
		                SearchProduct:main_domain+ "SEARCH_PRODUCT/",
		                Transporter:main_domain+ "TRANSPORTER/",
	                    HeadList:main_domain+"HEAD_LIST/",
		                Document:main_domain+"DOCUMENT/",
		                StoreMovement:main_domain+"STORE_MOVEMENT/",
		                ProductUniteMeasure:main_domain+"PRODUCT_UNIT_MEASURE/",
		                ProductList:main_domain+ "PRODUCT_LIST/",
		                ProductListDelete:main_domain+ "PRODUCT_LIST_DELETE/",
		                UniteMeasure:main_domain+"UNIT_MEASURE/",
		                UniteMeasureDelete:main_domain+"UNIT_MEASURE_DELETE/",
		                UtilPricePercentage:main_domain+"UTILE_PRICE_PERCENTAGE/",
		                UtilPricePrice:main_domain+"UTIL_PRICE_PRICE/",
		                UtilPriceEndPrice:main_domain+"UTIL_PRICE_END_PRICE/",
		                Promoter:main_domain+"PROMOTER/",
		                PromoterUser:main_domain+ "PROMOTER_USER/",
		                ProductPagination:main_domain+"PRODUCT_PAGINATION/",
		                ProductListPagination:main_domain+"PRODUCT_LIST_PAGINATION/",
		                ProductPublicPagination:main_domain+"PRODUCT_PUBLIC_PAGINATION/",

		                Role:main_domain+"ROLE/",
		                Region:main_domain+"REGION/",
		                RegionDelete:main_domain+"REGION_DELETE/",
		                ExportHeads:main_domain+"EXPORT_HEADS/",
		                GenerateHeads:main_domain+"GENERATE_HEADS/",
		                ImportProducts:main_domain+"IMPORT_PRODUCTS/",
		                ImportCustomers:main_domain+"IMPORT_CUSTOMERS/",
		                Upload:main_domain+"UPLOAD/",
		                TaxRate:main_domain+"TAXRATE/",
		                TaxRateDelete:main_domain+"TAXRATE_DELETE/",
		                DeleteRow:main_domain+"DELETE_ROW/",
		                ListIncrement:main_domain+"LIST_INCREMENT/",
		                PaymentsList:main_domain+"PAYMENTS_LIST/",
		                PaymentsSolution:main_domain+"PAYMENTS_SOLUTION/",
		                SuppliersList:main_domain+"SUPPLIERS_LIST/",
		                SearchProductCode:main_domain+"SEARCH_PRODUCT_CODE/",
		                CheckHead:main_domain+"CHECK_HEAD/",
		                PrintHead:main_domain+"PRINT_HEAD/",
		                PrintList:main_domain+"PRINT_LIST/",
		                PrintListFromUser:main_domain+"PRINT_LIST_FROM_USER/",
		                PrintCustomerList:main_domain+"PRINT_CUSTOMER_LIST/",
		                UserSave:main_domain+ "USER_SAVE/",
		                UserRefresh:main_domain+ "USER_REFRESH/",
		                UserChangePassword:main_domain+ "USER_CHANGE_PASSWORD/",
		                Sync:main_domain+"sync/",
		                SessionUser:main_domain+"session/user/",
		                UserLoggedinUser:main_domain+"USER_LOGGEDINUSER"
		            },Permissions:{
		            	Promoter:"promoter",
		            	Transporter:"transporter",
		            	Admin:"",
		            	Customer:"customer"
		            },Const:{
		            	ServerProblem:"Problema con la connessione al server,contattare l'amministrazione del sistema",
		            	CompanyId:"2bd93e19-985f-4f5f-91a6-eda1b91d4823",//"94579938-e847-46b2-9063-4692f15aa8b6",
		            	PaypalURL:"https://www.sandbox.paypal.com/cgi-bin/webscr"
                        
		            },Messages:{
		            	SaveSuccessMessage:"SALVATAGGIO EFFETTUATO",
		            	DeleteSuccessMessage:"ELIMINAZIONE EFFETTUATA",
		            	GeneralErrorMessage:"OPERAZIONE FALLITA"
		            },User:{
		            	key:""
		            },ServiceUrls_old: {
	            		AddRow:main_domain+ "/rest/head/addrow/",
	            		CheckUser:main_domain+ "/rest/user/loggedinuser/",
	            		CustomerCategory:main_domain+ "/rest/basic/categorycustomer",
	            		CustomerGroup:main_domain+ "/rest/basic/groupcustomer",
	            		CustomerCategoryDelete:main_domain+ "/rest/basic/categorycustomer/delete",
	            		CustomerGroupDelete:main_domain+ "/rest/basic/groupcustomer/delete",
	            		CustomerUser:main_domain+ "/rest/registry/customer/user/",
	            		Company:main_domain+ "/rest/registry/company/",
	            		CompanyMailConfigDelete:main_domain+ "/rest/registry/companymailconfig/",
	            		Country:main_domain+ "/rest/geo/countries/",
	            		Counter:main_domain+ "/rest/basic/counter/",
	            		CounterSave:main_domain+ "/rest/basic/countercompany/",
	            		Currency:main_domain+"/rest/basic/currency/",
	            		Zone:main_domain+ "/rest/geo/zones/",
	            		City:main_domain+ "/rest/geo/cities/",
	            		CityCountry:main_domain+ "/rest/geo/cities/country/",
	            		CityZone:main_domain+ "/rest/geo/cities/zone/",
	            		Composition:main_domain+ "/rest/basic/composition/",
	            		CompositionDelete:main_domain+ "/rest/basic/composition/delete",
	            		DetailsOfCustomer:main_domain+ "/rest/registry/customer/",
	            		DocumentList:main_domain+ '/rest/basic/document',
	            		DraftInit:main_domain+ '/rest/draft/init/',
	            		DraftAdd:main_domain+ '/rest/draft/addtodraft/',
	            		DraftRefresh:main_domain+ '/rest/draft/refresh/',
	            		DraftRemove:main_domain+ '/rest/draft/removefromdraft/',
	            		DraftUpdate:main_domain+ '/rest/draft/updatedraft/',
	            		DraftConfirm:main_domain+ '/rest/draft/confirmdraft/',
	            		Delivery:main_domain+ "/rest/delivery/ecdelivery/",
	            		DeliveryCost:main_domain+ "/rest/delivery/costs/",
	            		DocumentFlow:main_domain+ "/rest/config/documentflow/",
	            		DocumentFlowDelete:main_domain+ "/rest/config/documentflow/delete/",
	            		HeadPaging:main_domain+ '/rest/head/head',
	            		HeadNumber:main_domain+ '/rest/head/pages/',
		                /*ListOfCustomer:main_domain+ "/rest/registry/customer/",*/
		                ListOfCustomer:main_domain+'CUSTOMER_LIST/',
		                ListOfCustomerWithPriceList:main_domain+ "/rest/registry/customerwithpricelist/",
		                ListOfCustomerDelete:main_domain+ "/rest/registry/customer/delete/",
		                ListOfCustomerSoft:main_domain+ "/rest/registry/customersoft/",
		                ListOfCustomerDestinations:main_domain+ "/rest/registry/destination/customer/",
		                PrintHead:main_domain+ "/rest/print/head/",
		                Product:main_domain+ "/rest/registry/product/",
		                ProductDelete:main_domain+ "/rest/registry/product/delete",
		                ProductPublic:main_domain+ "/rest/registry/public/product/",
		                SaveCustomer:main_domain+ "/rest/registry/customer/",
		                ProductMainList:main_domain+ "/rest/registry/products/",
		                ProductMainListPrice:main_domain+ "/rest/registry/productslistprice/",
		                
		                ProductMainPublicList:main_domain+ "/rest/registry/public/products/",
		                ProductBasicPrice:main_domain+ "/rest/util/prodbasicprice/",
		                ProductBasicPriceList:main_domain+ "/rest/util/prodbasicprice/list",
		                ProductCategory:main_domain+ "/rest/basic/categoryproduct/",
		                ProductCategoryDelete:main_domain+ "/rest/basic/categoryproduct/delete",
		                ProductSubCategory:main_domain+ "/rest/basic/subcategoryproduct/",
		                ProductSubCategoryDelete:main_domain+ "/rest/basic/subcategoryproduct/delete/",
		                ProductGroup:main_domain+ "/rest/basic/groupproduct/",
		                ProductGroupDelete:main_domain+ "/rest/basic/groupproduct/delete/",
		                ProductIncrement:main_domain+ "/rest/registry/product/increment/",
		                Brand:main_domain+ "/rest/basic/brand/",
		                BrandDelete:main_domain+ "/rest/basic/brand/delete",
		                HeadTotal:main_domain+"/rest/documenthelp/headtotal",
		                RowTotal:main_domain+"/rest/documenthelp/rowtotal",
		                HeadAllTotal:main_domain+"/rest/documenthelp/headalltotal",
		                List:main_domain+ "/rest/registry/list/",
		                ListPublic:main_domain+ "/rest/registry/list/public/",
		                AddProductToList:main_domain+ "/rest/registry/addtolist/",
		                ListNoProduct:main_domain+ "/rest/registry/list/noproduct/",
		                Login_old:main_domain+ "/rest/user/check/",
		                Login:main_domain+ "CHECK_USER/",
		                LoginEc:main_domain+ "/rest/user/ec/",
		                CreateEcUser:main_domain+ "/rest/user/ecuser/",
		                EcRecoverUID:main_domain+ "/rest/user/ecuser/recoverusername/",
		                EcRecoverPWD:main_domain+ "/rest/user/ecuser/recoverpassword/",
		                EcAskRecoverPWD:main_domain+ "/rest/user/ecuser/askrecoverpassword/",
		                Logout:main_domain+"/rest/user/logout/",
		                SearchProduct:main_domain+ "/rest/registry/product/search/",
		                Transporter:main_domain+ "/rest/registry/transporter/",
	                    HeadList:main_domain+"/rest/head/head/",
		                DocumentDetails:main_domain+"",
		                Document:main_domain+"/rest/basic/document/",
		                StoreMovement:main_domain+"/rest/basic/storemovement/",
		                ProductUniteMeasure:main_domain+"/rest/registry/productum/",
		                ProductList:main_domain+ "/rest/registry/productlist/",
		                ProductListDelete:main_domain+ "/rest/registry/productlist/delete",
		                UniteMeasure:main_domain+"/rest/basic/unitmeasure/",
		                UniteMeasureDelete:main_domain+"/rest/basic/unitmeasure/delete",
		                UtilPricePercentage:main_domain+"/rest/util/prodbasicprice/percentage/",
		                UtilPricePrice:main_domain+"/rest/util/prodbasicprice/sellprice/",
		                UtilPriceEndPrice:main_domain+"/rest/util/prodbasicprice/endprice/",
		                Promoter:main_domain+"/rest/registry/promoter/",
		                PromoterUser:main_domain+ "/rest/registry/promoter/user",
		                ProductPagination:main_domain+"/rest/registry/product/pages/",
		                ProductListPagination:main_domain+"/rest/registry/listproduct/pages/",
		                ProductPublicPagination:main_domain+"/rest/registry/public/product/pages/",

		                Role:main_domain+"/rest/role/",
		                Region:main_domain+"/rest/basic/region/",
		                RegionDelete:main_domain+"/rest/basic/region/delete/",
		                ExportHeads:main_domain+"/rest/export/heads/",
		                GenerateHeads:main_domain+"/rest/head/generationdocs/objectdocs",
		                ImportProducts:main_domain+"/rest/import/products/",
		                ImportCustomers:main_domain+"/rest/import/customers/",
		                Upload:main_domain+"/rest/upload/file",
		                TaxRate:main_domain+"/rest/basic/taxrate/",
		                TaxRateDelete:main_domain+"/rest/basic/taxrate/delete/",
		                DeleteRow:main_domain+"/rest/head/removerow/",
		                Role:main_domain+"/rest/role/",
		                ListIncrement:main_domain+"/rest/util/incrementlist",
		                PaymentsList:main_domain+"/rest/basic/payment",
		                PaymentsSolution:main_domain+"/rest/basic/paymentsolution",
		                SuppliersList:main_domain+"/rest/registry/supplier",
		                SearchProductCode:main_domain+"/rest/registry/product/code/",
		                CheckHead:main_domain+"/rest/head/checkhead",
		                PrintHead:main_domain+"/rest/print/head/",
		                PrintList:main_domain+"/rest/print/list/",
		                PrintListFromUser:main_domain+"/rest/print/user/customer/list",
		                PrintCustomerList:main_domain+"/rest/print/customer/list/",
		                UserSave:main_domain+ "/rest/user/saveuser",
		                UserRefresh:main_domain+ "/rest/user/refreshuser/",
		                UserChangePassword:main_domain+ "/rest/user/changepassword",
		                Sync:main_domain+"sync/"
		                
		            }
		        };
		    };
		})
.directive('fDatepicker', function(){
      return {
         link: function(scope, element) {
            $(element).fdatepicker({format:"dd/mm/yyyy"})
         }
      }
	})
.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
}).directive('createDialog', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            
                    element.dialog({autoOpen:false,modal:true});
            
        }
    }
}).directive('capitalize', function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
    	 var capitalize = function(inputValue) {
				var capitalized ="";
				if (inputValue !== null && inputValue != undefined){
				   capitalized = inputValue.toUpperCase();
				   if(capitalized !== inputValue) {
					  modelCtrl.$setViewValue(capitalized);
					  modelCtrl.$render();
					}         
					return capitalized;
				}
			}
			 modelCtrl.$parsers.push(capitalize);
			 capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
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
}).directive('createAccordion', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            
                    element.accordion();  
            
            
        }
    }
}).directive('createChosen', function ($timeout) {
    return {
        restrict: 'A',
        scope: {
            name: '@ngDataProvider'
        }
		
    }
}).directive('onFinishChosenUpdate', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
					
			scope.$watch(attrs.ngDataProvider, function() {
					element.chosen({allow_single_deselect: true,width: "25%"});
                    element.trigger("chosen:updated");
			});
            scope.$watch(attrs.ngModel, function() {
					element.chosen({allow_single_deselect: true,width: "25%"});
                    element.trigger("chosen:updated");
			});
                
            
        }
    }
});
gecoApp.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setDefaults({color: 'blue'});
}]);
gecoApp.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise("login");
	
	$stateProvider.state('userlist', {
			url:'/userlist', //USER
			templateUrl: 'template/userlist.htm',
			controller: 'UserListCtrl',
			data:{
				login:true
			}
		}).state('welcome', {
			url:'/welcome',
			templateUrl: 'template/home.htm',
			controller: 'WelcomeCtrl',
			data:{
				login:true
			}
		}).state('welcome_customer', {
			url:'/welcome_customer',
			templateUrl: 'template/welcome_customer.html',
			controller: 'WelcomeCtrl',
			data:{
				login:true
			}
		}).state('userlist_details', {
			url:'/userlist/:userId',
			templateUrl: 'template/userdetail.htm',
			controller: 'UserDetailCtrl',
			data:{
				login:true
			}
		}).state('role', {
			url:'/role',
			templateUrl: 'template/rolelist.htm',
			controller: 'RoleCtrl',
			data:{
				login:true
			}
		}).state('customer', { //CUSTOMER
			url:'/customer',
			templateUrl: 'template/customer/customerlist.htm',
			controller: 'RocchiCustomerListCtrl',
			data:{
				login:true
			}
		}).state('customer_details', {
			url:'/customer/:idcustomer',
			templateUrl: 'template/customer/customerdetail.htm',
			controller: 'RocchiCustomerDetailCtrl',
			data:{
				login:true
			}
		}).state('customercategory', {
			url:'/customercategory',
			templateUrl: 'template/customer/customercategorylist.htm',
			controller: 'RocchiCustomerCategoryListCtrl',
			data:{
				login:true
			}
		}).state('customergroup', {
			url:'/customergroup',
			templateUrl: 'template/customer/customergrouplist.htm',
			controller: 'RocchiCustomerGroupListCtrl',
			data:{
				login:true
			}
		}).state('taxrate', {
			url:'/taxrate',
			templateUrl: 'template/product/taxratelist.htm',
			controller: 'RocchiTaxrateCtrl',
			data:{
				login:true
			}
		}).state('counter', {
			url:'/counter',
			templateUrl: 'template/basic/counterlist.htm',
			controller: 'RocchiCounterCtrl',
			data:{
				login:true
			}
		}).state('storemovement_list', {
			url:'/storemovement',
			templateUrl: 'template/basic/storemovementlist.htm',
			controller: 'StoreMovementCtrl',
			data:{
				login:true
			}
		}).state('payment', {
			url:'/payment',
			templateUrl: 'template/basic/paymentlist.htm',
			controller: 'RocchiPaymentCtrl',
			data:{
				login:true
			}
		}).state('document', {
			url:'/document',
			templateUrl: 'template/basic/documentlist.htm',
			controller: 'RocchiDocumentCtrl',
			data:{
				login:true
			}
		}).state('groupproduct', {
			url:'/groupproduct',
			templateUrl: 'template/product/groupproductlist.htm',
			controller: 'RocchiGroupProductCtrl',
			data:{
				login:true
			}
		}).state('categoryproduct', {
			url:'/categoryproduct',
			templateUrl: 'template/product/categoryproductlist.htm',
			controller: 'RocchiCategoryProductCtrl',
			data:{
				login:true
			}
		}).state('region', {
			url:'/region',
			templateUrl: 'template/product/regionlist.htm',
			controller: 'RocchiRegionCtrl',
			data:{
				login:true
			}
		}).state('unitmeasure', {
			url:'/unitmeasure',
			templateUrl: 'template/product/unitmeasurelist.htm',
			controller: 'RocchiUnitmeasureCtrl',
			data:{
				login:true
			}
		}).state('company', {
			url:'/company',
			templateUrl: 'template/company/companydetails.html',
			controller: 'CompanyCtrl',
			data:{
				login:true
			}
		}).state('companymail', {
			url:'/companymail',
			templateUrl: 'template/config/companymail.html',
			controller: 'CompanyCtrl',
			data:{
				login:true
			}
		}).state('companyec', {
			url:'/companyec',
			templateUrl: 'template/config/companyec.html',
			controller: 'CompanyEcCtrl',
			data:{
				login:true
			}
		}).state('bank', {
			url:'/bank',
			templateUrl: 'template/registry/banklist.htm',
			controller: 'BankListCtrl',
			data:{
				login:true
			}
		}).state('bank_details', {
			url:'/bank/:idbank',
			templateUrl: 'template/registry/bankdetail.htm',
			controller: 'BankDetailCtrl',
			data:{
				login:true
			}
		}).state('product', {
			url:'/product',
			templateUrl: 'template/product/productlist.htm',
			controller: 'RocchiProductListCtrl',
			data:{
				login:true
			}
		}).state('product_details', {
			url:'/product/:idproduct',
			templateUrl: 'template/product/productdetail.htm',
			controller: 'RocchiProductDetailCtrl',
			data:{
				login:true
			}
		}).state('list', {
			url:'/list',
			templateUrl: 'template/registry/listlist.htm',
			controller: 'RocchiListListCtrl',
			data:{
				login:true
			}
		}).state('list_details', {
			url:'/list/:idlist',
			templateUrl: 'template/registry/listdetail.htm',
			controller: 'RocchiListDetailCtrl',
			data:{
				login:true
			}
		}).state('destination', {
			url:'/destination',
			templateUrl: 'template/registry/destinationlist.htm',
			controller: 'DestinationListCtrl',
			data:{
				login:true
			}
		}).state('destination_details', {
			url:'/destination/:iddestination',
			templateUrl: 'template/registry/destinationdetail.htm',
			controller: 'DestinationDetailCtrl',
			data:{
				login:true
			}
		}).state('supplier', {
			url:'/supplier',
			templateUrl: 'template/registry/supplierlist.htm',
			controller: 'SupplierListCtrl',
			data:{
				login:true
			}
		}).state('supplier_details', {
			url:'/supplier/:idsupplier',
			templateUrl: 'template/registry/supplierdetail.htm',
			controller: 'SupplierDetailCtrl',
			data:{
				login:true
			}
		}).state('transporter', {
			url:'/transporter',
			templateUrl: 'template/registry/transporterlist.htm',
			controller: 'RocchiTransporterListCtrl',
			data:{
				login:true
			}
		}).state('transporter_details', {
			url:'/transporter/:idtransporter',
			templateUrl: 'template/registry/transporterdetail.htm',
			controller: 'RocchiTransporterDetailCtrl',
			data:{
				login:true
			}
		}).state('headlist_details_type', {
			url:'/headlist/:section/:type',
			templateUrl: 'template/document/headlist.htm',
			controller: 'RocchiHeadListCtrl',
			data:{
				login:true
			}
		}).state('generatedocs', {
			url:'/generatedocs',
			templateUrl: 'template/document/generatedocs.htm',
			controller: 'GenerateDocsCtrl',
			data:{
				login:true
			}
		}).state('copyrows', {
			url:'/copyrows',
			templateUrl: 'template/document/copyrows.htm',
			controller: 'CopyRowsCtrl',
			data:{
				login:true
			}
		}).state('reportorder', {
			url:'/reportorder',
			templateUrl: 'template/store/reportorder.htm',
			controller: 'ReportOrderCtrl',
			data:{
				login:true
			}
		}).state('createorders', {
			url:'/createorders',
			templateUrl: 'template/document/openorders.htm',
			controller: 'CreateOrdersCtrl',
			data:{
				login:true
			}
		}).state('head_details', {
			url:'/head/:idhead',
			templateUrl: 'template/document/headdetail.html',
			controller: 'RocchiHeadDetailCtrl',
			data:{
				login:true
			}
		}).state('head_details_wizard', {
			url:'/head_wizard/:idhead',
			templateUrl: 'template/document/wizard.html',
			controller: 'RocchiWizardCtrl',
			data:{
				login:true
			}
		}).state('wizard_customer', {
			url:'/wizard_customer/:idhead',
			templateUrl: 'template/document/wizard_customer.html',
			controller: 'RocchiWizardCustomerCtrl',
			data:{
				login:true
			}
		}).state('head_details_rows', {
			url:'/head/:idhead/:rows',
			templateUrl: 'template/document/headdetail.htm',
			controller: 'RocchiHeadDetailCtrl',
			data:{
				login:true
			}
		}).state('suppliercategory', {
			url:'/suppliercategory',
			templateUrl: 'template/basic/suppliercategorylist.htm',
			controller: 'SupplierCategoryListCtrl',
			data:{
				login:true
			}
		}).state('suppliergroup', {
			url:'/suppliergroup',
			templateUrl: 'template/basic/suppliergrouplist.htm',
			controller: 'SupplierGroupListCtrl',
			data:{
				login:true
			}
		}).state('myprofile_details', {
			url:'/myprofile/:myuserId',
			templateUrl: 'template/myprofile.htm',
			controller: 'MyProfileCtrl',
			data:{
				login:true
			}
		}).state('myprofile', {
			url:'/myprofile',
			templateUrl: 'template/profile/profile.html',
			controller: 'MyProfileCtrl',
			data:{
				login:true
			}
		}).state('login', {
			url:'/login',
			templateUrl: 'template/welcome.htm',
			controller:'LoginCtrl',
			data:{
				login:true
			}
		}).state('ec', {
			url:'/ec',
			templateUrl: 'template/ecommerce.htm',
			controller:'ECommerceCtrl',
			data:{
				login:true
			}
		}).state('ecproduct', {
			url:'/ecproduct/:idproduct',
			templateUrl: 'template/draft/productdetails.html',
			controller:'EcProjectDetail',
			data:{
				login:true
			}
		}).state('newecuser', {
			url:'/newecuser',
			templateUrl: 'template/profile/newecuser.html',
			controller:'ECommerceUserCtrl',
			data:{
				login:true
			}
		}).state('ecpassword', {
			url:'/ecpassword',
			templateUrl: 'template/profile/passwordrecovery.html',
			controller:'EcPasswordRecover',
			data:{
				login:true
			}
		}).state('storelist', {
			url:'/storelist',
			templateUrl: 'template/store/productstorage.htm',
			controller: 'StoreCtrl',
			data:{
				login:true
			}
		}).state('brand', {
			url:'/brand',
			templateUrl: 'template/product/brandlist.htm',
			controller: 'RocchiBrandCtrl',
			data:{
				login:true
			}
		}).state('storeneeded', {
			url:'/storeneeded',
			templateUrl: 'template/store/storeneeded.htm',
			controller: 'StoreNeededCtrl',
			data:{
				login:true
			}
		}).state('accounting_details', {
			url:'/accounting/:type',
			templateUrl: 'template/accounting/accountingcustomer.htm',
			controller: 'AccountingCustomerCtrl',
			data:{
				login:true
			}
		}).state('accountinglist_details', {
			url:'/accountinglist/:type',
			templateUrl: 'template/accounting/accountinglist.htm',
			controller: 'AccountingListCtrl',
			data:{
				login:true
			}
		}).state('parameters', {
			url:'/parameters',
			templateUrl: 'template/parameters/parameters.htm',
			controller: 'ParametersCtrl',
			data:{
				login:true
			}
		}).state('rates', {
			url:'/rates',
			templateUrl: 'template/parameters/rates.htm',
			controller: 'TaxrateCtrl',
			data:{
				login:true
			}	
		}).state('storemovement', {
			url:'/storemovement',
			templateUrl: 'template/parameters/storemovement.htm',
			controller: 'StoreMovementCtrl'	,
			data:{
				login:true
			}
		}).state('docpayment', {
			url:'/docpayment',
			templateUrl: 'template/parameters/docpayment.htm',
			controller: 'PaymentCtrl',
			data:{
				login:true
			}
		}).state('documents', {
			url:'documents',
			templateUrl: 'template/parameters/documents.htm',
			controller: 'ParametersCtrl',
			data:{
				login:true
			}	
				
		}).state('promoter', {
			url:'/promoter',
			templateUrl: 'template/registry/promoterlist.htm',
			controller: 'RocchiPromoterListCtrl',
			data:{
				login:true
			}
		}).state('promoter_details', {
			url:'/promoter/:idpromoter',
			templateUrl: 'template/registry/promoterdetail.htm',
			controller: 'RocchiPromoterDetailCtrl',
			data:{
				login:true
			}
		}).state('documentflow', {
			url:'/documentflow',
			templateUrl: 'template/config/documentflow.html',
			controller: 'DocumentFlowCtrl',
			data:{
				login:true
			}
		}).state('publiclist', {
			url:'/publiclist',
			templateUrl: 'template/public/PublicList.html',
			controller: 'PublicListCtrl',
			data:{
				login:true
			}
		}).state('composition', {
			url:'/composition',
			templateUrl: 'template/product/composition.html',
			controller: 'RocchiCompositionCtrl',
			data:{
				login:true
			}
		});
}]);
gecoApp.factory('ScopeFactory', function ($http, $q) {
	var scopefactory = {};
	return { 
	    "factory":scopefactory
	}
});
gecoApp.run(function($rootScope,$http,AppConfig,$state) {
	$rootScope.$on('$stateChangeStart', function(next, current) { 
		//$(document).unbind("keydown");
		var login = current.data.login;
		if (login == true && !$rootScope.key ){
			$http.post(AppConfig.ServiceUrls.SessionUser).success(function(result){
				if (result){
					$rootScope.key = result;
					$http.defaults.headers.common.AuthKey = $rootScope.key;
				}else{
					$state.go('login');
				}
			}).error(function(error){
				$state.go('login');
			})
		}
	});
	$rootScope.user = {};
	$rootScope.path = "";
	$rootScope.pagesize = 100;
	$rootScope.showIncrement = false;
	$rootScope.showFilter = false;
	$rootScope.deleteObj = {};
	$rootScope.issaved = true;
	$rootScope.openTab = function(url) {
    // Create link in memory
		var a = window.document.createElement("a");
		a.target = '_blank';
		a.href = url;
	 
		// Dispatch fake click
		var e = window.document.createEvent("MouseEvents");
		e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		a.dispatchEvent(e);
	};
	$rootScope.openFilter = function(){
		if ($rootScope.showIncrement == true){
			$rootScope.showFilter = false;
		}
		$rootScope.showIncrement = false;
		if ($rootScope.showFilter == true){
			$rootScope.showFilter = false;
		}else{
			$rootScope.showFilter = true;
		}
		
	}
	$rootScope.deleteElement = function(obj){
	}
	$rootScope.confirmDelete = function(obj){
		$rootScope.deleteObj = obj;
		$.confirm({
			text: "Confermare l'eliminazione dell'elemento selezionato?",
			confirm: 
				$rootScope.deleteElement
			,
			cancel: function(button) {
				// do something
			},
			confirmButton: "Si",
			cancelButton: "No"
		});
	}
	$rootScope.confirmSaved = function(){

		//ModalFactory.confirm();
	}
	$rootScope.errorMessage = function(message){
		//ModalFactory.error(message);
	}
	$rootScope.saveFuntion = function(){
	
	}
	$rootScope.setSaveControl = function(savefunc){
		$rootScope.issaved = true;
		$rootScope.saveFuntion = savefunc;
		
	}
	$rootScope.setModified = function(){
		$rootScope.issaved = false;
	}
	$rootScope.orderArray = [];
	$rootScope.sortFunction = function(field){
		if ($(".sortericon."+field).hasClass("up")){
			$(".sortericon."+field).removeClass("up");
			$(".sortericon."+field).addClass("down");
			$rootScope.orderArray = jQuery.grep($rootScope.orderArray, function( n ) {
				return ( n != field);
			});
			$rootScope.orderArray.push("-"+field);
		}else if ($(".sortericon."+field).hasClass("down")){
			$(".sortericon."+field).removeClass("down");
			$rootScope.orderArray = jQuery.grep($rootScope.orderArray, function( n ) {
				return ( n != "-"+field);
			});
		}else{
			$(".sortericon."+field).addClass("up");
			$rootScope.orderArray.push(field);
		}
	}
	$rootScope.viewheader = false;
	$rootScope.sortDateFunction = function(field,func){
		if ($(".sortericon."+field).hasClass("up")){
			$(".sortericon."+field).removeClass("up");
			
			$rootScope.orderArray = jQuery.grep($rootScope.orderArray, function( n ) {
				return ( n != func);
			});
			
		}else{
			$(".sortericon."+field).addClass("up");
			$rootScope.orderArray = jQuery.grep($rootScope.orderArray, function( n ) {
				return ( n != func);
			});
			$rootScope.orderArray.push(func);
		}
	}
  }).run( function($rootScope, $location) {
   $rootScope.$watch(function() { 
      return $location.path(); 
    },
    function(a){  
      $rootScope.orderArray = [];
    });
}).directive('selectOnClick',function($window){
	return {
		restrict:'A',
		link:function(scope,element,attrs){
			element.on('click',function(){
				if(!$window.getSelection().toString()){
					this.setSelectionRange(0,this.value.length);
				}
			})
		}
	}
}).directive('goBack',function($window){
	return {
		restrict:'A',
		link:function(scope,element,attrs){
			element.on('click',function(){
				 $window.history.back();
			})
		}
	}
});
gecoApp.run(function($http,$rootScope) {
	if (!$rootScope.key){
		$rootScope.key = "";
	}
	  $http.defaults.headers.common.AuthKey = $rootScope.key;
	});
