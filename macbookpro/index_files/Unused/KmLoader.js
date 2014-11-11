// 
// KmLoader -- a simple class to get dynamic component data as JSON which will execute the callback method
//

KmLoader.akamaiUrl = 'http://km.support.apple.com';
KmLoader.callback = "KmLoader.receiveSuccess";

KmLoader.results = new Array();
KmLoader.documentids = new Array();
KmLoader.waitingForKbCall = new Array();
KmLoader.waitingForHelpCall = new Array();
KmLoader.callBackSuccessFuncs = new Array();
KmLoader.callBackErrorFuncs = new Array();

// constructor

function KmLoader() {
	
	if(arguments[0] != parseInt(arguments[0])) {
		// if first parameter is not an integer and isn't a json param object we know we are dealing with a kmrecord call as opposed to a kmdata call
		if(arguments[0] && arguments[0].type){
			var p = arguments[0];
			KmLoader.type = p.type;
			KmLoader.sendKmCall(KmLoader.type, p.requestId, p.docTypes, p.productId, p.query, p.documentIds, p.sort, p.locale, p.maxRecords, p.excerpt, p.src, p.matchAllCategories, p.hierarchicalCategories, p.excludedDocIds, p.showEnglish, p.thumbnail, p.dicDomain, p.displayURL, p.managedans, p.appId, p.appName,  p.success, p.error)
		}else{		
			KmLoader.type = 'kmrecord';
			KmLoader.sendKmCall(KmLoader.type, "1", 0, 0, 0, arguments[0], 0, arguments[1], 0, 0, arguments[2]);
		}
	}
	else {
		KmLoader.type = 'kmdata';
		KmLoader.sendKmCall(KmLoader.type, arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6],arguments[7],arguments[8],arguments[9],arguments[10],arguments[11],arguments[12],arguments[13],arguments[14],arguments[15],arguments[16],arguments[17],arguments[18],arguments[19],arguments[20],arguments[21]);
	}
	
}

KmLoader.sendCall = function(url) {
	
	this.obj=new JSONscriptRequest(url + "&callback=" + KmLoader.callback);
	
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

KmLoader.sendKmCall = function(type, requestId, doctypes, productid, query, documentids, sort, locale, maxrecords, excerpt, src, matchallcategories, hierarchicalcategories, excludedocids, showenglish, thumbnail, dicDomain, displayURL, managedans, appId, appName, success, error) {
	
	// we need to store this requestid data in an array since we will be waiting for the response and
	// invocation of KmLoader.receiveSuccess() when the request comes back (and subsequently lose track of this specific KmLoader instance)
	KmLoader.results[requestId] = new Array();
	KmLoader.documentids[requestId] = new Array();
	KmLoader.waitingForKbCall[requestId] = false;
	KmLoader.waitingForHelpCall[requestId] = false;

	var scriptUrl = 'requestid=' + requestId;
	var kbDocuments = new Array();
	var helpDocuments = new Array();
	
	if (success){
		KmLoader.callBackSuccessFuncs[requestId] = success;
	}
	if (error){
		KmLoader.callBackErrorFuncs[requestId] = error;
	}
	
	if(documentids) {
		// split document ids into two buckets, with help or kb articles
		var ids = documentids.split(",");
		
		for(var i=0;i<ids.length;i++) {
		
			if(ids[i].indexOf("/")!=-1) {
				helpDocuments.push(ids[i]);
			}
			else {
				kbDocuments.push(ids[i]);
			}
			
			// store for sorting later before returning results
			var storeId = '';
			if(ids[i].indexOf(".html")!=-1) {
				var matches = /([a-zA-Z0-9]+\.html)/i.exec(ids[i]);
				storeId = matches[1];
			}
			else {
				storeId = ids[i].replace(/(-[a-z]{2}_[A-Z]{2})/g,'');
			}
			
			KmLoader.documentids[requestId].push(storeId);
			
		}
	}
	
	if(query) {
		scriptUrl += '&query=' + encodeURIComponent(query);
	}
	if(doctypes) {
		scriptUrl += '&doctype=' + encodeURIComponent(doctypes);
	}
	if(sort) {
		scriptUrl += '&sort=' + encodeURIComponent(sort);
	}
	if(productid) {
		scriptUrl += '&productid=' + encodeURIComponent(productid);
	}
	if(locale) {
		scriptUrl += '&locale=' + encodeURIComponent(locale);
	}
	if(maxrecords) {
		scriptUrl += '&maxrecords=' + encodeURIComponent(maxrecords);
	}
	if(excerpt) {
		scriptUrl += '&excerpt=y';
	}
	if(src) {
		scriptUrl += '&src=' + encodeURIComponent(src);
	}
	if(matchallcategories) {
		scriptUrl += '&matchallcategories=y';
	}
	if(hierarchicalcategories) {
		// default is y
		scriptUrl += '&hierarchicalcategories=n';
	}
	if(excludedocids){
		scriptUrl += '&excludeids=' + encodeURIComponent(excludedocids);
	}
	if(showenglish){
		scriptUrl += '&showenglish=' + encodeURIComponent(showenglish);
	}
	if(thumbnail){
		scriptUrl += '&thumbnail=' + encodeURIComponent(thumbnail);
	}
	
	if(dicDomain) {
		scriptUrl += '&dicDomain=' + encodeURIComponent(dicDomain);
	}
	if(displayURL) {
		// default is y
		scriptUrl += '&displayURL=' + encodeURIComponent(displayURL);
	}
	if(managedans){
		scriptUrl += '&managedans=' + encodeURIComponent(managedans);
	}
	if(appId){
		scriptUrl += '&appId=' + encodeURIComponent(appId);
	}
	if(appName){
		scriptUrl += '&appName=' + encodeURIComponent(appName);
	}
	
	if(kbDocuments.length>0 || (kbDocuments.length==0 && helpDocuments.length==0)) {
		KmLoader.waitingForKbCall[requestId] = true;
		var strDocumentIds = kbDocuments.length>0 ? "&documentids=" + encodeURIComponent(kbDocuments.join(",")) : '';
		KmLoader.sendCall(KmLoader.akamaiUrl + "/kb/index?page=" + type + '&' + scriptUrl + strDocumentIds);
	}
	
	if(helpDocuments.length>0) {
		KmLoader.waitingForHelpCall[requestId] = true;
		var strDocumentIds = helpDocuments.length>0 ? "&paths=" + encodeURIComponent(helpDocuments.join(",")) : '';
		KmLoader.sendCall(KmLoader.akamaiUrl + "/docs/" + type + ".html?" + scriptUrl +  strDocumentIds);
	}
	
}

KmLoader.receiveSuccess = function(json, requestId) {
	
	if(KmLoader.documentids[requestId] && KmLoader.documentids[requestId].length>0 && KmLoader.type=='kmdata' && json.results && json.results.length>0) {
		// make sure to not send response before we have received both responses if 
		// both kb and help articles have been requested
		// only needed if documentids is set for this requestid
		if(KmLoader.waitingForHelpCall[requestId] && json.results[0].url.indexOf("?path=")!=-1) {
			KmLoader.waitingForHelpCall[requestId] = false;
			KmLoader.results[requestId] = KmLoader.results[requestId].concat(json.results);
		}
		else if(KmLoader.waitingForKbCall[requestId] && json.results[0].url.indexOf("/kb/")!=-1) {
			KmLoader.waitingForKbCall[requestId] = false;
			KmLoader.results[requestId] = KmLoader.results[requestId].concat(json.results);
		}
		
		if(!KmLoader.waitingForKbCall[requestId] && !KmLoader.waitingForHelpCall[requestId]) {
			// before returning results, make sure they are sorted in the same order as they came in
			var finalResults = new Array();
			var returnResults = new Array();
			if(KmLoader.documentids[requestId] && KmLoader.documentids[requestId].length>0) {
				var totalResults = KmLoader.results[requestId];
				var missingResults = new Array();
				var j = 0;
				for(var i=0;i<totalResults.length;i++) {
					// for each original article, find the location
					var documentId = '';
					if(totalResults[i].url.indexOf("/kb/")!=-1) {
						// kb article
						var matches = /kb\/([A-Z]{2}\d{1,6})/i.exec(totalResults[i].url);
						documentId = matches[1];
					}
					else {
						// help article
						var matches = /([a-zA-Z0-9]+\.html)/i.exec(totalResults[i].url.substring(40, totalResults[i].url.length));
						documentId = matches[1];
					}
					
					var sortLocation = KmLoader.documentids[requestId].indexOf(documentId);
					if(sortLocation != -1) {
						returnResults[sortLocation] = totalResults[i];
					} else {
						// if return docIds is not matching to the requested documents add to missingResults array - esp:11396196
						missingResults[j++] = totalResults[i];
					}
				}
		

				for(var i = 0; i<returnResults.length; i++){
				      if (returnResults[i] != null && returnResults[i] != undefined){
				        finalResults.push(returnResults[i]);
				    }
				  }
				// If response document ids are not matching to requested documented ids, add the missing
				// documents to the end of finalResults - fix for esp:11396196
				for(var i = 0; i<missingResults.length; i++){
				      if (missingResults[i] != null && missingResults[i] != undefined){
				        finalResults.push(missingResults[i]);
				    }
				  }
			}
			
    
    		if (KmLoader.callBackSuccessFuncs[requestId]){
    			KmLoader.callBackSuccessFuncs[requestId]({ "results":finalResults }, requestId);
    		}else{
				KmLoader.success({ "results" : finalResults }, requestId);
    		}
		}
		
	}
	else if((json.results && json.results.length>0) || (json.records && json.records.length>0)) {
		
		if(json.records && typeof ACHistory != 'undefined' && typeof ACUtil != 'undefined') {
			// update the history if ACHistory.js is loaded
			for(var i=0;i<json.records.length;i++) {
				var documentId = json.records[i][0][1];
				var title = json.records[i][1][2];
				//var localeCode = json.records[i][4][1]; // disabled until service is updated
				ACHistory.addKbView(documentId, title, 'en_US', 'km');
			}
		}
		
		if (KmLoader.callBackSuccessFuncs[requestId]){
			KmLoader.callBackSuccessFuncs[requestId](json, requestId);
		}else{
			KmLoader.success(json, requestId);
		}	
	}
	else {
		KmLoader.receiveError("No results found", requestId);
		KmLoader.error("No results found", requestId);
	}
}


KmLoader.receiveError = function(errorMsg, requestId) {
	
	if(requestId!=null && requestId == "1" && $('articleError')!=null){
		$('articleError').value = true;
	}else if(requestId!=null && requestId=="2" && $('discussionError')!=null){
		$('discussionError').value = true;
	}
	
	if (KmLoader.callBackErrorFuncs[requestId]){
		KmLoader.callBackErrorFuncs[requestId](errorMsg, requestId);
	}else{
		KmLoader.error(errorMsg, requestId);
	}
}

//
// JSONscriptRequest -- a simple class for making HTTP requests
// using dynamically generated script tags and JSON
//
// Author: Jason Levitt
// Date: December 7th, 2005
//

// Constructor -- pass a REST request URL to the constructor

function JSONscriptRequest(urlpath) {
    // REST request path
    this.fullUrl = urlpath;
    
    if(KmLoader.logCall!=undefined) {
		// send debugging log call if enabled
		KmLoader.logCall(this.fullUrl);
	}
	
    // Get the DOM location to put the script tag
    this.headLoc = document.getElementsByTagName("head").item(0);
    // Generate a unique script tag id
    this.scriptId = 'JscriptId' + JSONscriptRequest.scriptCounter++;

}

// Static script ID counter
JSONscriptRequest.scriptCounter = 1;

// buildScriptTag method
//
JSONscriptRequest.prototype.buildScriptTag = function () {

    // Create the script tag
    this.scriptObj = document.createElement("script");
    
    // Add script object attributes
    this.scriptObj.setAttribute("type", "text/javascript");
    this.scriptObj.setAttribute("charset", "utf-8");
    this.scriptObj.setAttribute("src", this.fullUrl);
    this.scriptObj.setAttribute("id", this.scriptId);
    
    if(this.scriptObj.addEventListener){
    	this.scriptObj.addEventListener('error', this.handleMissingResource.bind(this), false);
	  }else{
		  this.scriptObj.attachEvent('error', this.handleMissingResource.bind(this));
    }
}
 
// removeScriptTag method
// 
JSONscriptRequest.prototype.removeScriptTag = function () {
    // Destroy the script tag
    this.headLoc.removeChild(this.scriptObj);  
}

// addScriptTag method
//
JSONscriptRequest.prototype.addScriptTag = function () {
    // Create the script tag
    this.headLoc.appendChild(this.scriptObj);
}

JSONscriptRequest.prototype.handleMissingResource= function (e){
	//this.fullUrl=http://km.support.apple.com/kb/index?page=videos_browse&offset=0&sort=recency&facet=all&category=&locale=th_TH&callback=ACVideoSearch.showResults
	try{
		var urlParams=this.getURLParams(this.fullUrl.substring(this.fullUrl.indexOf("?")+1));
		var currentCallback=(urlParams["callback"]!=undefined?urlParams["callback"]:(urlParams["Callback"]!=undefined?urlParams["Callback"]:""));
		//eval(currentCallback + + '()');
		var currentJsObj=currentCallback.substring(0,currentCallback.indexOf("."));
		eval(currentJsObj + '.resultsNone()');
	}catch(e){
		//console.log("Exception 404!!");
	}
}
JSONscriptRequest.prototype.getURLParams = function (q) {
	var match,
    	pl     = /\+/g,  // Regex for replacing addition symbol with a space
    	search = /([^&=]+)=?([^&]*)/g,
    	decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    	query  = q;

    	var urlParams = {};
    	while (match = search.exec(query))
    		urlParams[decode(match[1])] = decode(match[2]);
    	return urlParams;
}