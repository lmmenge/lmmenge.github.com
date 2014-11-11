/**
 * This method is used to create an instance of XMLHttpRequest based on the
 * client browser
 * 
 * @returns {Boolean}
 */

function newXMLHttpRequest() {
	var xmlreq = false;
	// Create XMLHttpRequest object in non-Microsoft browsers
	if (window.XMLHttpRequest) {
		xmlreq = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			// Try to create XMLHttpRequest in later versions
			// of Internet Explorer
			xmlreq = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e1) {
			// Failed to create required ActiveXObject
			try {
				// Try version supported by older versions
				// of Internet Explorer
				xmlreq = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e2) {
				// Unable to create an XMLHttpRequest by any means
				xmlreq = false;
			}
		}
	}
	return xmlreq;
}

var req;
var xhrTimeout;

var tmpThreadIds = new Array();
var tmpLikeCounts = new Object();

JiveUtil = function() {
	
}

JiveUtil.meTooCallback0 = function(likeCounts) {
	if (tmpThreadIds && tmpThreadIds.length > 0) {
		tmpLikeCounts["x"+tmpThreadIds[0]] = likeCounts;
		updateCountLikes(likeCounts, tmpThreadIds[0]);
	}
}

JiveUtil.meTooCallback1 = function(likeCounts) {
	if (tmpThreadIds && tmpThreadIds.length > 1) {
		tmpLikeCounts["x"+tmpThreadIds[1]] = likeCounts;
		updateCountLikes(likeCounts, tmpThreadIds[1]);
	}
}

JiveUtil.meTooCallback2 = function(likeCounts) {
	if (tmpThreadIds && tmpThreadIds.length > 2) {
		tmpLikeCounts["x"+tmpThreadIds[2]] = likeCounts;
		updateCountLikes(likeCounts, tmpThreadIds[2]);
	}
}

/**
 * This method is used to retrieve the number of likes for the threadId from
 * Jive asynchronously
 * 
 * @param url
 * @param idList
 * @param jiveURL
 */
function getCountLikes(idList, jiveURL) {

	if (idList != undefined && idList.length > 0) {
		
		var resultsDiv = $('results');

		var meTooRestPath ="/rpc/asc_services/v1/rest/metoo/1/" ;
		var meTooSuffix = "/scoredisplay?ratingType=like";
		
		var ids = idList.split(",");
		
		tmpThreadIds = ids;
		
		var numLikesObj = new Object();
		
		for ( var i = 0; i < ids.length; i++) {
			if (ids[i] != "") {				
				JiveUtil.getLikes(jiveURL+ meTooRestPath +ids[i] + meTooSuffix, i);					
			}				
		}
	}
}

JiveUtil.calback = "JiveUtil.meTooCallback";

JiveUtil.getLikes = function(url, callbackIdx) {
	
	this.obj=new JSONscriptRequest(url + "&callback=" + JiveUtil.calback + callbackIdx);
	
	if(this.obj.headLoc) {
		
		try{
			this.obj.buildScriptTag();
			this.obj.addScriptTag();
		}
		catch(ex) {
			// IE 5 for Mac will throw an exception here.
		}
	}
}

/**
 * This method is used as a call back method to handle the response of Ajax
 * calls
 * 
 */
function getReadyStateHandler(req, responseXmlHandler, id) {

	// Return an anonymous function that listens to the XMLHttpRequest instance
	return function() {
		// If the request's status is "complete"

		if (req.readyState == 4) {

			// Check that we received a successful response from the server
			if (req.status == 200) {
				// Pass the XML payload of the response to the handler function.
				clearTimeout(xhrTimeout);
				responseXmlHandler(req.responseText, id);
			} else {
				// An HTTP problem has occurred
				// alert("HTTP Error "+req.status+": "+req.statusText);
			}
		}
	}
}

/**
 * This method is used to update the number of likes for the thread Id with the
 * response of Ajax call to Jive web service
 * 
 * 
 * @param response
 * @param id
 */
function updateCountLikes(response, id) {

	document.getElementById(id).innerHTML = response;

}
/**
 * This method is used to timeout the request
 * 
 */
function ajaxTimeout() {
	req.abort();

}


/**
 * Function to submit Q & A form
 */
//This method is called to submit the requested question on Apple Forum 
function submitQuestionToForum(forumURL,articleId,errorMessage,placeholder)
{
		var question = $('interactiveQuestionSearchField').value;
	if(question.blank()||question==""||question==placeholder)
	{
		alert(errorMessage);
		return false;
	}
	else
	{	
		var submitForumForm = $("question-form");
		submitForumForm.action = forumURL+"articleId="+articleId+"&articleQuestion="+encodeURIComponent(question);
		//alert(submitForumForm.action);	
		submitForumForm.submit();
	}
}