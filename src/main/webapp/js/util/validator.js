var GECO_validator = function(){
	var requiredFields = function(){
	    var fields = $(".error")
		var errorString = true
		for (var i=0;i<fields.length;i++){
		    var id = fields[i].id.replace("val_","");
			var idval = fields[i].id;
			switch($("#"+id ).get(0).tagName){
				case "INPUT":
					x= $("#"+id).val();
					if (x==null || x=="")
					{
						$("#"+idval).css("display","");
						errorString = false;
						$("#"+id).unbind("keypress");
						$("#"+id).bind("keypress",function(e){
								var iderrorfi = e.currentTarget.id
								$("#val_"+iderrorfi).css("display","none");
						});
					}
				break;
                case "SELECT":
					x= $("#"+id).val();
					if (x==null || x=="" || x=="?")
					{
						$("#"+idval).css("display","");
						errorString = false;
						var funchange = function(e){
								var iderrorfi = e.currentTarget.id
								$("#val_"+iderrorfi).css("display","none");
						}
						$("#"+id).unbind("change",funchange);
						$("#"+id).bind("change",funchange);
					}
				break;				
			}
			
		}
		return errorString
	}
	var passwordFields = function(password,confirmPassword,message){
		var errorString = "";
		if ($("#"+password).val() != $("#"+confirmPassword).val()  ){
			errorString = message
		}
		return errorString
	}
	var emailFields = function(){
		var fields = $(".errormail")
		var errorString = true
		for (var i=0;i<fields.length;i++){
		    var id = fields[i].id.replace("valmail_","");
			var idval = fields[i].id;
			var x=$("#"+id).val();
			if (x != "" && x != null ){
				var atpos=x.indexOf("@");
				var dotpos=x.lastIndexOf(".");
				if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length)
				{
						$("#"+idval).css("display","");
						errorString = false;
						$("#"+id).unbind("keypress");
						$("#"+id).bind("keypress",function(e){
								var iderrorfi = e.currentTarget.id
								$("#valmail_"+iderrorfi).css("display","none");
						});
				}
			}
		}	
		
		
		return errorString
	}
	var calculateErrorString = function(requiredmsg,passwordmesg,emailmsg){
		var errorMessage = "";
		if (requiredmsg == ""){
			if (passwordmesg == ""){
				errorMessage = emailmsg;
			}else{
				if (emailmsg == ""){
					errorMessage = passwordmesg;
				}else{
					errorMessage = passwordmesg+"<br>"+emailmsg
				}
			}
		}else{
			if (passwordmesg == ""){
				if (emailmsg == ""){
					errorMessage = requiredmsg;
				}else{
					errorMessage = requiredmsg+"<br>"+emailmsg
				}
			}else{
				if (emailmsg == ""){
					errorMessage = requiredmsg+"<br>"+passwordmesg;
				}else{
					errorMessage = requiredmsg+"<br>"+passwordmesg+"<br>"+emailmsg
				}
			}
		}
		return errorMessage;
	}
    var startupvalidator = function(){
		$(".error").css("display","none");
		$(".errormail").css("display","none");
	} 	
	return{
		"requiredFields":requiredFields,
		"passwordFields":passwordFields,
		"emailFields":emailFields,
		"calculateErrorString":calculateErrorString,
		"startupvalidator":startupvalidator
	}
}();
