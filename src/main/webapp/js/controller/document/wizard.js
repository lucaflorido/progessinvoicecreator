/**
 * 
 */
/**
 * 
 */
angular.module("rocchi.documents")
 .controller('RocchiWizardCtrl',function($scope,$http,$stateParams,$location,$rootScope,$state,$localStorage,AppConfig,WizardFactory,AlertsFactory,LoaderFactory){
	 $scope.tabs=[{title:"fi-torso",template:"template/document/wizard/stepone.html",name:"step1",active:true,disable:false},
		             {title:"fi-shopping-cart",template:"template/document/wizard/steptwo.html",name:"step2",active:false,disable:true},
	 {title:"fi-list-bullet",template:"template/document/wizard/draft.html",name:"step3",active:false,disable:true}
		             ];
		$scope.wiz = WizardFactory;
		$scope.wiz.initialize($scope.tabs);
		$scope.wiz.getCustomers();
		
		$scope.setSelection = function(tab){
			$scope.wiz.goToStepByName(tab.name);
			
		}
		$scope.head = {};
		$scope.gotoStep2 = function(){
			
			$scope.wiz.head.list = $scope.wiz.head.customer.lists[0].list;
			$scope.wiz.goToStep(1);
			
			
		}
		$scope.gotoStep3 = function(){
			//$scope.wiz.saveHead().then(function(){
				$scope.wiz.goToStep(2);
			//});
				
		}
		$scope.changeCustomer = function(customer){
			$http.get(AppConfig.ServiceUrls.DetailsOfCustomer+ customer.idCustomer).success(function(data) {
				$scope.wiz.head.customer = data;
			});
		}
		
}).controller("WizardStepsCtrl",["$scope","WizardFactory",function($scope,WizardFactory){
	$scope.wiz = WizardFactory;
	//factory.wiz.getCustomers();
}]).factory("WizardFactory",function($http, $q,AppConfig,$state,$filter,$localStorage,$rootScope,AlertsFactory,LoaderFactory){
	var factory = {};
	factory.customerlist = [];
	factory.productlist = [];
	factory.head = {};
	factory.tabs = [];
	factory.selected = "";
	factory.globalstatus = "";
	factory.STATUS_ERROR = 3;
	factory.STATUS_WARNING = 2;
	factory.STATUS_ADDED = 1;
	factory.STATUS_EMPTY = 0;
	factory.opencart = false;
	factory.warningProd = [];
	factory.errorProd = [];
	factory.pageArray = [];
	factory.msg = AlertsFactory;
	factory.storage = $localStorage;
	factory.msg.initialize();
	factory.ignoreDraft = false;
	factory.showDraftManage = false;
	if (factory.showFilter == null){
		factory.showFilter = false;
	}
	if (factory.filter == null){
		factory.filter = {"pagefilter":{}};
		factory.currentGroup = {};
		factory.currentBrand = {};
		factory.currentCategory = {};
		factory.currentSubCategory = {};
		factory.currentSupplier = {};
	}else{
		factory.currentGroup = factory.filter.group;
		factory.currentBrand = factory.filter.brand;
		factory.currentCategory = factory.filter.category;
		factory.currentSubCategory = factory.filter.subcategory;
		factory.currentSupplier = factory.filter.supplier;
	}
	factory.pagesize = 10;
	factory.getProductsNumber = function(){
		
		//if ($scope.products.length != $scope.pagesize){
		LoaderFactory.loader = true;
		factory.pages = [];
		factory.totalitems = 0;
		factory.pageArray = [];
			$http.post(AppConfig.ServiceUrls.ProductPagination+factory.pagesize,factory.filter).then(function(result){
				factory.pages = result.data.pages;
				factory.totalitems = result.data.totalitems;
				factory.pagesize_confirmed = factory.pagesize;
				factory.getProducts(1);
			});
			
		//}
	}
	//factory.getProductsNumber();
	var makeinactivetabs = function(){
		for(var i=0;i <factory.tabs.length;i++){
			factory.tabs[i].active = false;
		}
	}
	var makedisabletabs = function(){
		for(var i=0;i <factory.tabs.length;i++){
			factory.tabs[i].disable = false;
		}
	}
	var getTabIndexByName = function(name){
		for(var i=0;i <factory.tabs.length;i++){
			if (factory.tabs[i].name == name){
				return i;
			}
		}
	}
	var getTabNameByIndex = function(index){
		
			return factory.tabs[index].name;
				
	}
	factory.getTabByName = function(name){
		for(var i=0;i <factory.tabs.length;i++){
			if (factory.tabs[i].name == name){
				return factory.tabs[i];
			}
		}
	}
	factory.initialize = function(t){
		factory.tabs = t;
		factory.selected = getTabNameByIndex(0);
		factory.head = {};
		factory.customerlist = [];
		factory.productlist = [];
		factory.opencart = false;
		factory.globalstatus = 0;
		factory.ignoreDraft = false;
		if (factory.storage.draft){
			var head = angular.fromJson(factory.storage.draft);
			factory.msg.warningMessage("Ordine non completo per il cliente "+head.customer.customername);
			factory.showDraftManage = true;
		}
		$http.get(AppConfig.ServiceUrls.ProductCategory).success(function(data){
			factory.categories= data;
		});
		$http.get(AppConfig.ServiceUrls.ProductGroup).success(function(data){
			factory.groups= data;
		});
		$http.get(AppConfig.ServiceUrls.Brand).success(function(data){
			factory.brands= data;
		});
		$http.get(AppConfig.ServiceUrls.Region).success(function(data){
			factory.regions= data;
		});
		$http.get(AppConfig.ServiceUrls.Composition).success(function(data){
			factory.compositions= data;
		});
	}
	factory.changeCategory = function(){
		factory.subcategories = [];
		if (factory.filter && factory.filter.category)
			factory.subcategories = factory.filter.category.subcategories;
	}
	factory.getTab = function(index){
		return factory.tabs[index];
	}
	factory.goToStep = function(index){
		makeinactivetabs();
		var t = factory.getTab(index);
		t.active = true;
		t.disable = false;
		factory.selected = t.name;
	}
	factory.goToStepByName = function(name){
		var t = factory.getTabByName(name);
		t.active = true;
		t.disable = false;
		factory.selected = t.name;
	}
	factory.getCustomers = function(){
		var deferred = $q.defer();
		LoaderFactory.loader = true;
		$http.get(AppConfig.ServiceUrls.ListOfCustomerWithPriceList).then(function(result){
			factory.customerlist = result.data;
			LoaderFactory.loader = false;
			deferred.resolve();
		},function(error){
			LoaderFactory.loader = false;
		});
		return deferred.promise;
	}
	factory.getProducts = function(page){
		factory.filter.pagefilter.startelement = (page - 1 ) * factory.pagesize_confirmed;
		factory.filter.pagefilter.pageSize = factory.pagesize_confirmed;
		factory.filter.h = factory.head;
		$http.post(AppConfig.ServiceUrls.ProductMainListPrice+"1",factory.filter).then(function(result){
			factory.productlist = result.data.success;
			LoaderFactory.loader = false;
			if (factory.head.rows && factory.head.rows.length > 0){
				factory.globalstatus = 1;
			}else{
				factory.globalstatus = 0;
			}
			factory.errorProd = [];
		},function(error){
			LoaderFactory.loader = false;
		})
		
}
	
	factory.addProduct = function(prod){
		if (prod.status == factory.STATUS_WARNING){
			var addrow = {"um":prod,"h":factory.head};	
			$http.post(AppConfig.ServiceUrls.AddRow,addrow).then(function(result){
				factory.head = result.data.success;
				factory.updateDraft();
				prod.status = factory.STATUS_ADDED ;
				factory.warningProd = $.grep(factory.warningProd,function(a){return a !== prod.idUnitMeasureProduct});
				if(factory.errorProd.length == 0 && factory.warningProd.length ==0){
					factory.globalstatus = prod.status;
				}
				
				factory.msg.successMessage("Prodotto inserito con successo");
				
			},function(result){
				prod.status = factory.STATUS_ERROR;
				 factory.setGlobalStatus(prod.status);
				 factory.warningProd = $.grep(factory.warningProd,function(a){return a !== prod.idUnitMeasureProduct});
				 factory.errorProd.push(prod.idUnitMeasureProduct);
				 factory.msg.alertMessage("Errore inserimento prodotto");
			});
		}
		
	}
	factory.quantityChange = function(prod){
		if (isNaN(prod.quantity)) 
			  {
				 prod.status = factory.STATUS_ERROR;
				 factory.setGlobalStatus(prod.status);
				 factory.warningProd = $.grep(factory.warningProd,function(a){return a !== prod.idUnitMeasureProduct});
				 factory.errorProd.push(prod.idUnitMeasureProduct);
			  }else{
				  prod.status = factory.STATUS_WARNING ;
				  factory.setGlobalStatus(prod.status);
				  factory.errorProd = $.grep(factory.errorProd,function(a){return a !== prod.idUnitMeasureProduct});
				  factory.warningProd.push(prod.idUnitMeasureProduct);
			  if(factory.errorProd.length == 0 ){
					factory.globalstatus = factory.STATUS_WARNING;
			  }
		  }
	}
	factory.quantityRowChange = function(row){
		if (isNaN(row.quantity)) 
		{
				 //TODO error messages
			factory.msg.alertMessage("Valore inserito non valido");
		}else{
			angular.forEach(factory.productlist,function(item){
				if(item.product.idProduct == row.product.idProduct){
					item.quantity = row.quantity;
				}
			});	  
	    }
	}
	factory.saveHead = function(type){
		var deferred = $q.defer();
		LoaderFactory.loader = true;
		$http.put(AppConfig.ServiceUrls.AddRow+type,factory.head).then(function(result){
			factory.head = result.data.success;
			deferred.resolve();
			makedisabletabs();
			factory.deleteDraft();
			LoaderFactory.loader = false;
			factory.msg.successMessage("Documento registrato con successo");
		},function(error){
			LoaderFactory.loader = false;
			factory.msg.alertMessage("Errore nella registrazione dell'ordine");
		});
		return deferred.promise;
	}
	factory.saveDraftHead = function(type){
		var deferred = $q.defer();
		var head = angular.fromJson(factory.storage.draft);
		LoaderFactory.loader = true;
		$http.put(AppConfig.ServiceUrls.AddRow+type,head).then(function(result){
			factory.ignoreDraft = false;
			factory.showDraftManage = false;
			factory.deleteDraft();
			LoaderFactory.loader = false;
			factory.msg.successMessage("Documento registrato con successo");
		},function(error){
			LoaderFactory.loader = false;
			factory.msg.alertMessage("Errore nella registrazione del documento");
		});
		return deferred.promise;
	}
	factory.setGlobalStatus = function(newStatus){
		if (newStatus > factory.globalstatus){
			factory.globalstatus = newStatus;
		}
	}
	factory.openChart = function(){
		factory.opencart = true;
	}
	factory.closeChart = function(){
		if (factory.head.idHead > 0){
			factory.initialize(factory.tabs);
		}
		factory.opencart = false;
	}
	factory.reload = function(){
		factory.initialize(factory.tabs)
		$state.reload();
	}
	factory.printHead = function(){
		$http.get(AppConfig.ServiceUrls.PrintHead+factory.head.idHead).then(function(result){
			var deviceAgent = navigator.userAgent;
			var ios = deviceAgent.toLowerCase().match(/(iphone|ipod|ipad|android|webos|blackberry|iemobile|opera mini)/);
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				// some code..
			}
			if (ios) {
				// This is the line that matters
				$rootScope.openTab(result.data.url);
			} else {
				// Your code that works for desktop browsers
				var url = result.data.url;
				window.open(url);
			}
		});
	};
	factory.calculateRow = function(row){
		if (row.quantity != "" && row.quantity != null && isNaN(row.quantity) == false ){
			var totrowobj = {};
			totrowobj.qta = row.quantity;
			totrowobj.taxrate = row.product.taxrate.value;
			totrowobj.price = row.price;
			$http.post(AppConfig.ServiceUrls.RowTotal,totrowobj).then(function(result){
				var totrow = result.data;
				row.total = totrow.total;
				row.amount = totrow.amount;
				row.taxamount = totrow.taxamount;
				factory.calculateTotal();
			});
			
		}
	}
	factory.deleteElement = function(row){
		if (row.idRow == 0){
			factory.head.rows = $.grep(factory.head.rows,function(a){  return a.idRow != row.idRow && a.productcode != row.productcode ;})
			factory.updateDraft();
			factory.resetDeleteElement(row.product);
		}else{
			$http.delete(AppConfig.ServiceUrls.DeleteRow+row.idRow).then(function(result){
				if (result.data.type == "success"){	
					factory.head.rows = $.grep(factory.head.rows,function(a){  return a.idRow != row.idRow && a.productcode != row.productcode ;})
					
				}else{
					alert("Errore: "+result.data.errorName+" Messaggio:"+result.data.errorMessage);
				}
			});
			
		}
	}
	factory.deleteAll = function(){
		factory.head.rows =[];
		factory.storage.draft = angular.toJson(factory.head);
		angular.forEach(factory.productlist,function(item){
			item.status = 0;
			item.quantity = 0;
		});
	}
	factory.resetDeleteElement = function(product){
		angular.forEach(factory.productlist,function(item){
			
			if (item.product.idProduct == product.idProduct){
				item.quantity = 0;
				item.status = 0;
			}
			
		});
	}
	factory.calculateTotal = function(){
		var totrowobj = {};
		totrowobj.rows = factory.head.rows;
		$http.post(AppConfig.ServiceUrls.HeadTotal,totrowobj).then(function(result){
			var totrow = result.data;
			factory.head.total =totrow.total;
			factory.head.total4 =totrow.total4;
			factory.head.total10 =totrow.total10;
			factory.head.total20 =totrow.total20;
			factory.head.amount =totrow.amount;
			factory.head.amount4 =totrow.amount4;
			factory.head.amount10 =totrow.amount10;
			factory.head.amount20 =totrow.amount20;
			factory.head.taxamount =totrow.taxamount;
			factory.head.taxamount4 =totrow.taxamount4;
			factory.head.taxamount10 =totrow.taxamount10;
			factory.head.taxamount20 =totrow.taxamount20;
			factory.updateDraft();
		});
		
	}
	factory.resetDraft = function(){
		factory.deleteDraft();
		factory.msg.initialize();
		factory.showDraftManage = false;
	}
	factory.restoreDraft = function(){
		factory.showDraftManage = false;
		factory.head = angular.fromJson(factory.storage.draft);
		factory.head.list = factory.head.customer.lists[0].list;
		factory.goToStep(1);
		factory.msg.initialize();
	}
	factory.deleteDraft = function(){
		if(!factory.ignoreDraft)
		factory.storage.$reset({draft:null});
	}
	factory.updateDraft = function(){
		if(!factory.ignoreDraft)
		factory.storage.draft = angular.toJson(factory.head);
	}
	factory.mantainDraft = function(){
		factory.ignoreDraft = true;
		factory.showDraftManage = false;
		factory.msg.initialize();
	}
	factory.reverse = false;
	
	return factory;
	
});

