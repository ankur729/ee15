	//Email
function validateEmail(emailAddress) {
	var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
	//alert( pattern.test(emailAddress) );
	return pattern.test(emailAddress);
}

//Phone No.
function validatePhone(txtPhone) {
	var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
	if ((filter.test(txtPhone)  && txtPhone.length == '10') && (txtPhone[0] == '9' || txtPhone[0] == '8' || txtPhone[0] == '7' )) {
		return true;
	}
	else {
		return false;
	}
}

//Pincode
function validatePincode(txtPincode) {
	var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
	if (filter.test(txtPincode)  && txtPincode.length == '6' ) 
	{
		return true;
	}
	else 
	{
		return false;
	}
}


	//Text Only
function validateText(txtText) {
	var filter = /^[ A-Za-z]*$/;
	if (filter.test(txtText)) {
		return true;
	}
	else {
		return false;
	}
}

//$("#information-title").focus();


function validation(e){
	 var name=$(e).val();
    if(name.length == 0){
        $(e).addClass("input-wrong");
    }
    else {
        $(e).removeClass("input-wrong");
        return true;
    }
};

function remove_error(e){

    var name=$(e).val();
    if(name.length > 0){
        $(e).removeClass("input-wrong");
    }
    else {
        $(e).addClass("input-wrong");
        return true;
    }
};

