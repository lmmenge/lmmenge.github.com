var ikbToolbar = {

	toolbarObjectsList : [],

	// how long are transitions in 
	transition: {
		defaultDuration: 200
	},

	addToolbarObject : function( o ) {  this.toolbarObjectsList.push(o); },

	// hide other open toolbar objects ( except the one just opened )
	autoCloseDialogs : function( exceptionNode ) {

		this.toolbarObjectsList.each( function(it) {
			var node = it.getDOM();
			try {
				// ignore the optional exceptionNode
				if  ( (exceptionNode && node != exceptionNode) &&  node.hasClassName('open') ) {
					it.hide(); 
				}

			} catch (e) {
			}
		});

	}

};

var ACEmail = {

	'getDOM' : function() { return $('email-popup'); },
	
	'open' : function() {
		var node = this.getDOM();
//           alert("node" + node);	
	var h = node.down('.container').offsetHeight + 18;
  //         alert(" in open height = " + h);		
        node.blur();

		if( !node.hasClassName('open') ) {
			ikbToolbar.autoCloseDialogs( node );
			node.addClassName('open');
			node.style.height = h + 'px';
			$('email-address').focus();
		}

		else if( ( ! $('email-send').visible() )  && ( ! $('email-sent').visible() ) ) {
			this.hide();
		}
	},

	'hide' : function() {
		var node = this.getDOM();
		node.removeClassName('open');
		node.style.height = '0px';
	},
	
	'send' : function() {
		$('email-form').hide();
		$('email-send').show();
		 var docId = document.getElementById('docid').value;
		 var strLocale = document.getElementById('strlocale').value;
		 var recipient = document.getElementById('email-address').value;
		if(!ACEmail.validate(recipient.trim())){
			ACEmail.invalidEmailId("error");
			return;
		}else{
		 	var url = "/kb/index?page=email_template&locale="+strLocale+"&id="+docId+"&recipient="+recipient;
			new Ajax.Request(url, {	
	        		method:'get',
				onSuccess: function(responseObject) { ACEmail.done(responseObject); },
				onFailure: function() { ACEmail.error(); }
			});
		}
	},

	'validate' : function(email) {
		   var reg = /^([A-Za-z0-9_\-\.\$])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{1,4})$/;
		   return reg.test(email);
	},

	'invalidEmailId' : function(){
		 alert("Please enter a valid email id.");
               $('email-send').hide();
               ACEmail.hideSent();
	},
	
	'done' : function(responseObject) {
  		
		if((!(responseObject.readyState==4 && responseObject.status==200))) {
			ACEmail.error("error");
			return;
		}
		$('email-send').hide();
		$('email-sent').style.display='block';
		window.setTimeout('ACEmail.hideSent()',3000);
	},
	
	'error' : function() {
		alert("There was an error sending the email."); 
		$('email-send').hide();
		ACEmail.hideSent();
	},
	
	'emailDSError' : function(errorMessage) {
        alert(errorMessage);
	},


	'hideSent' : function() {
	//	$('email-popup').hide();
	//	$('email-open').hide();
		$('email-sent').hide();
                ACEmail.hide();
		$('email-form').show();
	},

	'callInProgress' : function(xmlhttp) {
		switch (xmlhttp.readyState) {
			case 1: case 2: case 3:
				return true;
			break;
			// Case 4 and 0
			default:
				return false;
			break;
		}
	}
	
};

var ACShare = {

	'getDOM' : function() { return $('share-popup'); },

	'open' : function() {
		var node = this.getDOM();
		node.down('.container').style.display = 'block';
        node.down('.fang').style.display = 'block';

        var h = node.down('.container').offsetHeight + 18;

		if( !node.hasClassName('open') ) {
			ikbToolbar.autoCloseDialogs( node );
			node.addClassName('open');
			node.style.height = h + 'px';
			node.down('.container').style.display = 'block';
			node.down('.fang').style.display = 'block';
			node.focus();

		} else {
			this.hide();
		}
	},

	'hide' : function() {
		var node = this.getDOM();
		node.removeClassName('open');
		node.style.height = '0px';
		node.down('.container').style.display = 'none';
		node.down('.fang').style.display = 'none';

	}
};

ikbToolbar.addToolbarObject ( ACEmail );
ikbToolbar.addToolbarObject ( ACShare );


