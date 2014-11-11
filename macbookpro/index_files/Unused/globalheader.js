/* SMUI 8/20/14: point to CORS-enabled IT/UAT server */
/* TODO: remove, for dev testing only */
var gsf = document.getElementById("gh-search-form");
if (gsf) {
	gsf.setAttribute("action", window.location.protocol + "//"+window.location.host+"/kb/index");
}

/* SMUI 8/28/14 add for search analytics, ACFeedStatistics */
/* source: http://support.apple.com/kb/index?page=search&src=support_site.home.search&locale=en_AU&q=ipad */
/* as of 8/28/14 */
var modelValue = 'Support';
var akamaiUrl = 'km.support.apple.com/';
var aiSearchServiceURL = 'support.apple.com';
var aiCrossDomainSearchServiceURL = 'support-suggestions.apple.com';
var podCookie = /POD=([a-z]{2})~([a-z]{2})/.exec(document.cookie);
var podLocaleValue = 'en_US';
if (podCookie !== null && podCookie.length === 3) {
	podLocaleValue = podCookie[2].toLowerCase() + '_' + podCookie[1].toUpperCase();
}

/* SMUI 8/28/14 add for search analytics */
/* source: https://km.support.apple.com.edgekey.net/kb/resources/js/persist-min.js */
/* as of 8/28/2014 */
//https://github.com/jeremydurham/persist-js
//PersistJS is a JavaScript client-side persistent storage library

(function(){if(window.google&&google.gears){return;}
var F=null;if(typeof GearsFactory!='undefined'){F=new GearsFactory();}else{try{F=new ActiveXObject('Gears.Factory');if(F.getBuildInfo().indexOf('ie_mobile')!=-1){F.privateSetGlobalObject(this);}}catch(e){if((typeof navigator.mimeTypes!='undefined')&&navigator.mimeTypes["application/x-googlegears"]){F=document.createElement("object");F.style.display="none";F.width=0;F.height=0;F.type="application/x-googlegears";document.documentElement.appendChild(F);}}}
if(!F){return;}
if(!window.google){google={};}
if(!google.gears){google.gears={factory:F};}})();Persist=(function(){var VERSION='0.3.0',P,B,esc,init,empty,ec;ec=(function(){var EPOCH='Thu, 01-Jan-1970 00:00:01 GMT',RATIO=1000*60*60*24,KEYS=['expires','path','domain'],esc=escape,un=unescape,doc=document,me;var get_now=function(){var r=new Date();r.setTime(r.getTime());return r;};var cookify=function(c_key,c_val){var i,key,val,r=[],opt=(arguments.length>2)?arguments[2]:{};r.push(esc(c_key)+'='+esc(c_val));for(var idx=0;idx<KEYS.length;idx++){key=KEYS[idx];val=opt[key];if(val){r.push(key+'='+val);}}
if(opt.secure){r.push('secure');}
return r.join('; ');};var alive=function(){var k='__EC_TEST__',v=new Date();v=v.toGMTString();this.set(k,v);this.enabled=(this.remove(k)==v);return this.enabled;};me={set:function(key,val){var opt=(arguments.length>2)?arguments[2]:{},now=get_now(),expire_at,cfg={};if(opt.expires){var expires=opt.expires*RATIO;cfg.expires=new Date(now.getTime()+expires);cfg.expires=cfg.expires.toGMTString();}
var keys=['path','domain','secure'];for(var i=0;i<keys.length;i++){if(opt[keys[i]]){cfg[keys[i]]=opt[keys[i]];}}
var r=cookify(key,val,cfg);doc.cookie=r;return val;},has:function(key){key=esc(key);var c=doc.cookie,ofs=c.indexOf(key+'='),len=ofs+key.length+1,sub=c.substring(0,key.length);return((!ofs&&key!=sub)||ofs<0)?false:true;},get:function(key){key=esc(key);var c=doc.cookie,ofs=c.indexOf(key+'='),len=ofs+key.length+1,sub=c.substring(0,key.length),end;if((!ofs&&key!=sub)||ofs<0){return null;}
end=c.indexOf(';',len);if(end<0){end=c.length;}
return un(c.substring(len,end));},remove:function(k){var r=me.get(k),opt={expires:EPOCH};doc.cookie=cookify(k,'',opt);return r;},keys:function(){var c=doc.cookie,ps=c.split('; '),i,p,r=[];for(var idx=0;idx<ps.length;idx++){p=ps[idx].split('=');r.push(un(p[0]));}
return r;},all:function(){var c=doc.cookie,ps=c.split('; '),i,p,r=[];for(var idx=0;idx<ps.length;idx++){p=ps[idx].split('=');r.push([un(p[0]),un(p[1])]);}
return r;},version:'0.2.1',enabled:false};me.enabled=alive.call(me);return me;}());var index_of=(function(){if(Array.prototype.indexOf){return function(ary,val){return Array.prototype.indexOf.call(ary,val);};}else{return function(ary,val){var i,l;for(var idx=0,len=ary.length;idx<len;idx++){if(ary[idx]==val){return idx;}}
return-1;};}})();empty=function(){};esc=function(str){return'PS'+str.replace(/_/g,'__').replace(/ /g,'_s');};var C={search_order:['localstorage','globalstorage','gears','cookie','ie','flash'],name_re:/^[a-z][a-z0-9_ \-]+$/i,methods:['init','get','set','remove','load','save','iterate'],sql:{version:'1',create:"CREATE TABLE IF NOT EXISTS persist_data (k TEXT UNIQUE NOT NULL PRIMARY KEY, v TEXT NOT NULL)",get:"SELECT v FROM persist_data WHERE k = ?",set:"INSERT INTO persist_data(k, v) VALUES (?, ?)",remove:"DELETE FROM persist_data WHERE k = ?",keys:"SELECT * FROM persist_data"},flash:{div_id:'_persist_flash_wrap',id:'_persist_flash',path:'persist.swf',size:{w:1,h:1},args:{autostart:true}}};B={gears:{size:-1,test:function(){return(window.google&&window.google.gears)?true:false;},methods:{init:function(){var db;db=this.db=google.gears.factory.create('beta.database');db.open(esc(this.name));db.execute(C.sql.create).close();},get:function(key){var r,sql=C.sql.get;var db=this.db;var ret;db.execute('BEGIN').close();r=db.execute(sql,[key]);ret=r.isValidRow()?r.field(0):null;r.close();db.execute('COMMIT').close();return ret;},set:function(key,val){var rm_sql=C.sql.remove,sql=C.sql.set,r;var db=this.db;var ret;db.execute('BEGIN').close();db.execute(rm_sql,[key]).close();db.execute(sql,[key,val]).close();db.execute('COMMIT').close();return val;},remove:function(key){var get_sql=C.sql.get;sql=C.sql.remove,r,val=null,is_valid=false;var db=this.db;db.execute('BEGIN').close();db.execute(sql,[key]).close();db.execute('COMMIT').close();return true;},iterate:function(fn,scope){var key_sql=C.sql.keys;var r;var db=this.db;r=db.execute(key_sql);while(r.isValidRow()){fn.call(scope||this,r.field(0),r.field(1));r.next();}
r.close();}}},globalstorage:{size:5*1024*1024,test:function(){if(window.globalStorage){var domain='127.0.0.1';if(this.o&&this.o.domain){domain=this.o.domain;}
try{var dontcare=globalStorage[domain];return true;}catch(e){if(window.console&&window.console.warn){console.warn("globalStorage exists, but couldn't use it because your browser is running on domain:",domain);}
return false;}}else{return false;}},methods:{key:function(key){return esc(this.name)+esc(key);},init:function(){this.store=globalStorage[this.o.domain];},get:function(key){key=this.key(key);return this.store.getItem(key);},set:function(key,val){key=this.key(key);this.store.setItem(key,val);return val;},remove:function(key){var val;key=this.key(key);val=this.store.getItem[key];this.store.removeItem(key);return val;}}},localstorage:{size:-1,test:function(){return window.localStorage?true:false;},methods:{key:function(key){return this.name+'>'+key;},init:function(){this.store=localStorage;},get:function(key){key=this.key(key);return this.store.getItem(key);},set:function(key,val){key=this.key(key);this.store.setItem(key,val);return val;},remove:function(key){var val;key=this.key(key);val=this.store.getItem(key);this.store.removeItem(key);return val;},iterate:function(fn,scope){var l=this.store;for(i=0;i<l.length;i++){keys=l[i].split('>');if((keys.length==2)&&(keys[0]==this.name)){fn.call(scope||this,keys[1],l[l[i]]);}}}}},ie:{prefix:'_persist_data-',size:64*1024,test:function(){return window.ActiveXObject?true:false;},make_userdata:function(id){var el=document.createElement('div');el.id=id;el.style.display='none';el.addBehavior('#default#userdata');document.body.appendChild(el);return el;},methods:{init:function(){var id=B.ie.prefix+esc(this.name);this.el=B.ie.make_userdata(id);if(this.o.defer){this.load();}},get:function(key){var val;key=esc(key);if(!this.o.defer){this.load();}
val=this.el.getAttribute(key);return val;},set:function(key,val){key=esc(key);this.el.setAttribute(key,val);if(!this.o.defer){this.save();}
return val;},remove:function(key){var val;key=esc(key);if(!this.o.defer){this.load();}
val=this.el.getAttribute(key);this.el.removeAttribute(key);if(!this.o.defer){this.save();}
return val;},load:function(){this.el.load(esc(this.name));},save:function(){this.el.save(esc(this.name));}}},cookie:{delim:':',size:4000,test:function(){return P.Cookie.enabled?true:false;},methods:{key:function(key){return this.name+B.cookie.delim+key;},get:function(key,fn){var val;key=this.key(key);val=ec.get(key);return val;},set:function(key,val,fn){key=this.key(key);ec.set(key,val,this.o);return val;},remove:function(key,val){var val;key=this.key(key);val=ec.remove(key);return val;}}},flash:{test:function(){if(!deconcept||!deconcept.SWFObjectUtil){return false;}
var major=deconcept.SWFObjectUtil.getPlayerVersion().major;return(major>=8)?true:false;},methods:{init:function(){if(!B.flash.el){var o,key,el,cfg=C.flash;el=document.createElement('div');el.id=cfg.div_id;document.body.appendChild(el);o=new deconcept.SWFObject(this.o.swf_path||cfg.path,cfg.id,cfg.size.w,cfg.size.h,'8');for(key in cfg.args){if(cfg.args[key]!='function'){o.addVariable(key,cfg.args[key]);}}
o.write(el);B.flash.el=document.getElementById(cfg.id);}
this.el=B.flash.el;},get:function(key){var val;key=esc(key);val=this.el.get(this.name,key);return val;},set:function(key,val){var old_val;key=esc(key);old_val=this.el.set(this.name,key,val);return old_val;},remove:function(key){var val;key=esc(key);val=this.el.remove(this.name,key);return val;}}}};init=function(){var i,l,b,key,fns=C.methods,keys=C.search_order;for(var idx=0,len=fns.length;idx<len;idx++){P.Store.prototype[fns[idx]]=empty;}
P.type=null;P.size=-1;for(var idx2=0,len2=keys.length;!P.type&&idx2<len2;idx2++){b=B[keys[idx2]];if(b.test()){P.type=keys[idx2];P.size=b.size;for(key in b.methods){P.Store.prototype[key]=b.methods[key];}}}
P._init=true;};P={VERSION:VERSION,type:null,size:0,add:function(o){B[o.id]=o;C.search_order=[o.id].concat(C.search_order);init();},remove:function(id){var ofs=index_of(C.search_order,id);if(ofs<0){return;}
C.search_order.splice(ofs,1);delete B[id];init();},Cookie:ec,Store:function(name,o){if(!C.name_re.exec(name)){throw new Error("Invalid name");}
if(!P.type){throw new Error("No suitable storage found");}
o=o||{};this.name=name;o.domain=o.domain||location.hostname||'localhost';o.domain=o.domain.replace(/:\d+$/,'');o.domain=(o.domain=='localhost')?'':o.domain;this.o=o;o.expires=o.expires||365*2;o.path=o.path||'/';this.init();}};init();return P;})();

/* SMUI 8/26/14: add. for search analytics. */
/* source: https://km.support.apple.com.edgekey.net/kb/resources/js/ACFeedStatistics.js */
/* as of 8/26/2014 */
// AI supports only en_US currently, later on locale should be passed 
// dynamically for feed statistics when AI is supports more locales
function ACFeedStatistics() {
	//this.feedsurl = './index?page=feedstatistics';
	//params: new Hash({model: modelValue, locale: 'en_US'}),
	/*aiSearchServiceURL = typeof(aiSearchServiceURL) == "undefined" ? "support-suggestions.apple.com": aiSearchServiceURL;
	   if(document.location.protocol === 'https:'){
           this.feedsurl = 'https://'+ aiSearchServiceURL;
       }else{
           this.feedsurl = 'http://' + aiSearchServiceURL;
       }
	   this.feedsurl = this.feedsurl + '/kb/index?page=feedstatistics';*/
	   this.feedsurl = '/kb/index?page=feedstatistics';
	   this.params = new Object();
	   this.params.model = modelValue;
	   this.params.locale = podLocaleValue;
	   this.store = new Persist.Store('FeedStats');
	   ACFeedStatistics.callbackSuccess = function(json) {
		   if(typeof console != 'undefined') console.log("Send Successful");
      };
}
	
ACFeedStatistics.prototype.updateNotViewedForSuggestedSearch = function(searchText){
	if (this.store.get('lastQuerySuggestedSearch') !== searchText && this.store.get('resultActivity') == 'false' && this.store.get('sentNotViewed') == 'false')			{
	var notviewedhash = new Object(this.params); 
		notviewedhash.feedType = 'notviewed';
		notviewedhash.query = this.store.get('lastQuery');
		this.store.set('sentNotViewed', true);
		this.sendRequest(notviewedhash);
		}
};

ACFeedStatistics.prototype.updateAdvanceSearchPage = function(resultBool, query){
	this.store.set('resultActivity', false);
		   this.store.set('lastQuery', query);
		   this.store.set('nextPage', false);
	this.store.set('sentNotViewed', false);

};

ACFeedStatistics.prototype.updateSearched = function(resultBool, query){ 
	if (this.store.get('lastQuery') !== null && this.store.get('resultActivity') == 'false' && this.store.get('sentNotViewed') == 'false'){
		this.updateNotViewed();
	}
	this.store.set('resultActivity', false);
	this.store.set('lastQuery', query);
	this.store.set('nextPage', false)
	var searchhash = new Object(this.params);
	searchhash.feedType = 'searched';
	searchhash.hasResults = resultBool;
	searchhash.query = query;
	if(this.store.get('hasSuggestion') == 'true'){
		searchhash.lastSuggestions = encodeURIComponent(this.store.get('lastSuggested'));
		this.store.set('hasSuggestion', 'false');
	}
	else if(this.store.get('hasSuggestedSuggestion') == 'true'){
		searchhash.lastSuggestions = encodeURIComponent(this.store.get('lastSuggestedSearch'));
		this.store.set('hasSuggestedSuggestion', false);
	}
	else{
		searchhash.lastSuggestions = "{}";
	}
	this.sendRequest(searchhash);
	this.store.set('sentNotViewed', false);
};

ACFeedStatistics.prototype.updateNextPage = function(){ 
	if (this.store.get('nextPage')=='false'){
		var nexthash = new Object(this.params);
		nexthash.feedType = 'nextpage';
		nexthash.query = this.store.get('lastQuery');
		this.sendRequest(nexthash);
	}
	this.store.set('nextPage', true);
};

ACFeedStatistics.prototype.updateNotViewed = function(){ 
	if(this.store.get('searchDone') == 'false'){ 
		if (this.store.get('lastQuery') !== this.store.get('lastSuggestedQuery') && this.store.get('resultActivity') == 'false' && this.store.get('sentNotViewed') == 'false'){
		var notviewedhash = new Object(this.params);
		notviewedhash.feedType = 'notviewed';
		notviewedhash.query = this.store.get('lastSuggestedQuery');
		this.sendRequest(notviewedhash);
		}
	}
};
ACFeedStatistics.prototype.updateResultActivity = function(position){ 
	this.store.set('resultActivity', true);
	this.store.set('position', position);
};

ACFeedStatistics.prototype.updateNotRead = function(articleID, position, timeSpent){ 
	var notreadhash = new Object(this.params);
	notreadhash.feedType = 'notread';
	notreadhash.articleID = articleID;
	notreadhash.query = this.store.get('lastQuery');
	notreadhash.position = position;
	notreadhash.timeSpent = timeSpent;
	//this.sendRequest(notreadhash);
	this.sendSyncRequest(notreadhash);
};

ACFeedStatistics.prototype.updateRead = function(articleID, position, timeSpent){ 
	var readhash = new Object(this.params);
	readhash.feedType = 'read';
	readhash.articleID = articleID;
	readhash.query = this.store.get('lastQuery');
	readhash.position = position;
	readhash.timeSpent = timeSpent;
	if(this.store.get('creationDate') != null){
		readhash.createdate = this.store.get('creationDate');
	}
	if(this.store.get('lastModifiedDate') != null){
		readhash.lastmodifieddate = this.store.get('lastModifiedDate');
	}
	
	this.sendSyncRequest(readhash);
};

ACFeedStatistics.prototype.loadListeners = function(numArticles){ 
	try{
	   var self = this;
		var resultLinks = $$('li.top-results a');
	   for (var i=0; i<resultLinks.length; i++){
		   var position = numArticles-9+i+1;
		   resultLinks[i].id = position;
			Event.observe(resultLinks[i], 'mousedown', function(event){  
				self.updateResultActivity(this.id);
		   });
		}
	}
	catch(err){
		if(typeof console != 'undefined') console.log("Error: " + err);
	}
};

ACFeedStatistics.prototype.callbackSuccess = function(json){
	if(typeof console != 'undefined') console.log("Send Successful");
};

ACFeedStatistics.prototype.callbackFailure = function(){ 
	if(typeof console != 'undefined') console.log("Send Failure");
};

ACFeedStatistics.prototype.sendRequest = function(params){  
	var url = this.feedsurl;
	for(var key in params){
		var value = encodeURIComponent(params[key]);
		url=url+"&"+key+"="+value;
	}
	
/*
	var http;
	if (window.XMLHttpRequest) { // code for IE7+, FF, Chrome, Opera, Safari
		http=new XMLHttpRequest();
	}
	else { // code for IE6, IE5
		http=new ActiveXObject("Microsoft.XMLHTTP");
	}
	http.open("GET", url, true);
	http.send();		
*/
	url = url + '&callback=' + "ACFeedStatistics.callbackSuccess";
	var head = document.getElementsByTagName('head')[0];
	script = document.createElement('script');
	script.id = 'xdShortcutContainer';
	script.type = 'text/javascript';
	script.src = url;
	head.appendChild(script);
};

ACFeedStatistics.prototype.sendSyncRequest = function(params){
		var url = this.feedsurl;
		for(var key in params){
			var value = encodeURIComponent(params[key]);
			url=url+"&"+key+"="+value;
		}		
	   var http;
	   if (window.XMLHttpRequest) { // code for IE7+, FF, Chrome, Opera, Safari
		  http=new XMLHttpRequest();
	   }
	   else { // code for IE6, IE5
		  http=new ActiveXObject("Microsoft.XMLHTTP");
	   }
		   
	   http.open("GET", url, false);
	   http.send();

/*			url = url + '&callback=' + "ACFeedStatistics.callbackSuccess";
		var head = document.getElementsByTagName('head')[0];
		script = document.createElement('script');
		script.id = 'xdShortcutContainer';
		script.type = 'text/javascript';
		script.src = url;
		head.appendChild(script);*/
};

ACFeedStatistics.prototype.updateReadHaiku = function(articleID, oldArticleID, position, timeSpent){ 
	var readhash = new Object(this.params);
	readhash.feedType = 'read';
	readhash.haikuid = articleID;
	readhash.articleID = oldArticleID;
	if(this.store.get('lastQuery') != null && this.store.get('lastQuery') != ""){
		readhash.query = this.store.get('lastQuery');
	}
	readhash.position = position;
	readhash.timeSpent = timeSpent;
	if(this.store.get('creationDate') != null){
		readhash.createdate = this.store.get('creationDate');
	}
	if(this.store.get('lastModifiedDate') != null){
		readhash.lastmodifieddate = this.store.get('lastModifiedDate');
	}
	
	this.sendSyncRequest(readhash);
};

ACFeedStatistics.prototype.updateNotReadHaiku = function(articleID, oldArticleID, position, timeSpent){ 
	var notreadhash = new Object(this.params);
	notreadhash.feedType = 'notread';
	notreadhash.haikuid = articleID;
	notreadhash.articleID = oldArticleID;
	if(this.store.get('lastQuery') != null && this.store.get('lastQuery') != ""){
		notreadhash.query = this.store.get('lastQuery');
	}
	notreadhash.position = position;
	notreadhash.timeSpent = timeSpent;
	//this.sendRequest(notreadhash);
	this.sendSyncRequest(notreadhash);
};


/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2012-11-15
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if (typeof document !== "undefined" && !("classList" in document.createElement("a"))) {

(function (view) {

"use strict";

if (!('HTMLElement' in view) && !('Element' in view)) return;

var
	  classListProp = "classList"
	, protoProp = "prototype"
	, elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
	, objCtr = Object
	, strTrim = String[protoProp].trim || function () {
		return this.replace(/^\s+|\s+$/g, "");
	}
	, arrIndexOf = Array[protoProp].indexOf || function (item) {
		var
			  i = 0
			, len = this.length
		;
		for (; i < len; i++) {
			if (i in this && this[i] === item) {
				return i;
			}
		}
		return -1;
	}
	// Vendors: please allow content code to instantiate DOMExceptions
	, DOMEx = function (type, message) {
		this.name = type;
		this.code = DOMException[type];
		this.message = message;
	}
	, checkTokenAndGetIndex = function (classList, token) {
		if (token === "") {
			throw new DOMEx(
				  "SYNTAX_ERR"
				, "An invalid or illegal string was specified"
			);
		}
		if (/\s/.test(token)) {
			throw new DOMEx(
				  "INVALID_CHARACTER_ERR"
				, "String contains an invalid character"
			);
		}
		return arrIndexOf.call(classList, token);
	}
	, ClassList = function (elem) {
		var
			  trimmedClasses = strTrim.call(elem.className)
			, classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
			, i = 0
			, len = classes.length
		;
		for (; i < len; i++) {
			this.push(classes[i]);
		}
		this._updateClassName = function () {
			elem.className = this.toString();
		};
	}
	, classListProto = ClassList[protoProp] = []
	, classListGetter = function () {
		return new ClassList(this);
	}
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
	return this[i] || null;
};
classListProto.contains = function (token) {
	token += "";
	return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		if (checkTokenAndGetIndex(this, token) === -1) {
			this.push(token);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.remove = function () {
	var
		  tokens = arguments
		, i = 0
		, l = tokens.length
		, token
		, updated = false
	;
	do {
		token = tokens[i] + "";
		var index = checkTokenAndGetIndex(this, token);
		if (index !== -1) {
			this.splice(index, 1);
			updated = true;
		}
	}
	while (++i < l);

	if (updated) {
		this._updateClassName();
	}
};
classListProto.toggle = function (token, forse) {
	token += "";

	var
		  result = this.contains(token)
		, method = result ?
			forse !== true && "remove"
		:
			forse !== false && "add"
	;

	if (method) {
		this[method](token);
	}

	return !result;
};
classListProto.toString = function () {
	return this.join(" ");
};

if (objCtr.defineProperty) {
	var classListPropDesc = {
		  get: classListGetter
		, enumerable: true
		, configurable: true
	};
	try {
		objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
	} catch (ex) { // IE 8 doesn't support enumerable:true
		if (ex.number === -0x7FF5EC54) {
			classListPropDesc.enumerable = false;
			objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
		}
	}
} else if (objCtr[protoProp].__defineGetter__) {
	elemCtrProto.__defineGetter__(classListProp, classListGetter);
}

}(self));

}
/**
 * The DOM CustomEvent are events initialized by an application for any purpose.
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 *
 * This is not compatible with IE < 9.
 *
 * @return {Function} CustomEvent constructor
 */

if (document.createEvent) {
	try {
		new window.CustomEvent('click');
	} catch (err) {
		window.CustomEvent = (function () {
			function CustomEvent(event, params) {
				params = params || {bubbles: false, cancelable: false, detail: undefined};
				var evt = document.createEvent('CustomEvent');
				evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
				return evt;
			}
			CustomEvent.prototype = window.Event.prototype;
			return CustomEvent;
		}());
	}
}

/**
	Extend native objects to provide ECMAScript 5.1 functionality if it doesn't exist.
*/



if (!Function.prototype.bind) {
/**
	Creates a new function that, when called, itself calls this function in the context of the provided
	this value, with a given sequence of arguments preceding any provided when the new function was called.
	Arguments may be passed to bind as separate arguments following `thisObj`.
	@param {Object} thisObj The object that will provide the context of `this` for the called function.
*/
	Function.prototype.bind = function(originalContext){
		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}
		var applicableArgs = Array.prototype.slice.call(arguments, 1);
		var functionToBind = this;
		var fnOriginalPrototype = function(){ };
		var fnBound = function() {
			return functionToBind.apply(
				(this instanceof fnOriginalPrototype && originalContext) ? this : originalContext,
				applicableArgs.concat(Array.prototype.slice.call(arguments))
			);
		}
		fnOriginalPrototype.prototype = this.prototype;
		fnBound.prototype = new fnOriginalPrototype();
		return fnBound;
	};
}



if (!Array.isArray) {
/**
	Returns true if an object is an array, false if it is not.
	@param {Object} object Object to test against.
	@name Array.isArray
*/
	Array.isArray = function isArray(object) {
		return (object && typeof object === 'object' && 'splice' in object && 'join' in object);
	};
}



if (!Array.prototype.every) {
/**
	Behaving in a similar yet opposite fashion to Array.prototype.some, Array.prototype.every tests whether
	all elements in the array pass the test implemented by the provided function. A return of false by the
	callback will immediately return false for the whole method.
	@param {Function} callback Function to test against. The callback should return a boolean value. Please
	note that 'falsy' values, e.g. no return, will evaluate to false.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Boolean} Returns true if all objects pass the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/every
*/
	Array.prototype.every = function every(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObject.length >>> 0;
		var i;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObject && !callback.call(thisObj, arrayObject[i], i, arrayObject)) {
				return false;
			}
		}
		return true;
	};
}



if (!Array.prototype.filter) {
/**
	Tests all elements in an array and returns a new array filled with elements that pass the test.
	@param {Function} callback Function to test against. The callback must return a boolean value.
	@param {Object} thisObj Object to use as `this` when executing the callback.
	@returns {Array} Returns a new array populated with values from the original array that passed the test implemented by the provided function.
	@reference https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/filter
*/
	Array.prototype.filter = function filter(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObject.length >>> 0;
		var i;
		var results = [];

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObject && callback.call(thisObj, arrayObject[i], i, arrayObject)) {
				results.push(arrayObject[i]);
			}
		}

		return results;
	};
}



if (!Array.prototype.forEach) {
/**
	Executes a provided function once per array element.
	@param callback {Function} Object to test against.
	@param thisObj {Object} What the callback method is bound to.
*/
	Array.prototype.forEach = function forEach(callback, thisObj) {
		var arrayObject = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var i;
		var currentValue;

		if (typeof callback !== 'function') {
			throw new TypeError('No function object passed to forEach.');
		}

		for (i = 0; i < this.length; i += 1) {
			currentValue = arrayObject[i];
			callback.call(thisObj, currentValue, i, arrayObject);
		}
	};
}



if (!Array.prototype.indexOf) {
/**
	Returns the first (least) index of an element within the array equal to the specified value, or -1 if none is found.
	@param searchElement {Object} Element to locate in the array.
	@param fromIndex {Number} Optional; the index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
*/
	Array.prototype.indexOf = function indexOf(searchElement, fromIndex) {
		var startIndex = fromIndex || 0;
		var currentIndex = 0;

		if (startIndex < 0) {
			startIndex = this.length + fromIndex - 1;
			if (startIndex < 0) {
				throw 'Wrapped past beginning of array while looking up a negative start index.';
			}
		}

		for (currentIndex = 0; currentIndex < this.length; currentIndex++) {
			if (this[currentIndex] === searchElement) {
				return currentIndex;
			}
		}

		return (-1);
	};
}



if (!Array.prototype.lastIndexOf) {
/**
	<p>Returns thelast index at which a given element can be found in the array, or -1 if it is not present.
	The array is searched backwards, starting at fromIndex.</p>
	<p><em>It should be noted that the Prototype library also implementes a version of this polyfill that doesn't behave
	according exactly to the ECMA-262 5.1 spec. Where this version will default the `fromIndex` paramater to the
	array's length if `fromIndex > array.length`, the Prototype version will not and as a result will return a different value.
	Care should be taken when using this library in conjunction with Prototype as Prototype's version will override
	this version in non-supporting browsers if it is included in the application ahead of ac_base.js.</em></p>

	@param {Object} value The element to locate in the array.
	@param {Number} fromIndex Optional; The index at which to start searching backwards. Defaults to the array's length.
		If negative, it is taken as the offset from the end of the array. If the index is 0, -1 is returned; the array
		will not be searched.
	@returns {Number} Returns the last index at which the element can be found. Else, returns -1.
*/
	Array.prototype.lastIndexOf = function lastIndexOf(value, fromIndex) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;
		fromIndex = parseInt(fromIndex, 10);

		// Return -1 if the array has no length
		if (len <= 0) {
			return -1;
		}

		// Is fromIndex provided? Set i accordingly if it is
		i = (typeof fromIndex === 'number') ? Math.min(len - 1, fromIndex) : len - 1;

		// Handle negative indices
		i = i >= 0 ? i : len - Math.abs(i);

		// Search backwards through array
		for (; i >= 0; i -= 1) {
			if (i in arrayObj && value === arrayObj[i]) {
				return i;
			}
		}

		return -1;

	};
}



if (!Array.prototype.map) {
/**
	<p>Calls a provided callback function once for each element in an array, in order, and constructs a new array from the results</p>
	<p>Usage:<p>
	<pre>
	var mapArray = ['foo', 'bar', 'baz'];
	var mapFunction = function (value) {
		return value + '_cat';
	}
	console.log(mapArray.map(mapFunction));
	</pre>
	@param {Function} callback The function to execute on each element in the array
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Object} A new array containing the results from the callback function.
		Array elements will be in the same order as the original array.
*/
	Array.prototype.map = function map(callback, thisObj) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;
		var result = new Array(len);

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObj) {
				result[i] = callback.call(thisObj, arrayObj[i], i, arrayObj);
			}
		}

		return result;
	};
}



if (!Array.prototype.reduce) {
/**
	<p>Applies an accumulation function to every value in an array from left to right and returns a single value.</p>
	<p>Usage:</p>
	<pre>
	var reduceArray = [1, 2, 3, 4, 5];
	var reduceFunction = function (previousValue, currentValue, index, array) {
		return previousValue + currentValue;
	};
	console.log(reduceArray.reduce(reduceFunction));
	</pre>
	@param {Function} callback The function to execute on each value in the array.
		<p><code>callback</code> takes four arguments:</p>
		<dl>
			<dt><strong>previousValue</strong></dt>
			<dd>The value previously returned by the last invocation of the callback, or <code>initialValue</code>, if supplied.</dd>
			<dt><strong>currentValue</strong></dt>
			<dd>The current array value being processed.</dd>
			<dt><strong>index</strong></dt>
			<dd>The index of the current array value being processed in the array.</dd>
			<dt><strong>array</strong></dt>
			<dd>The array <code>reduce</code> was called upon.</dd>
		</dl>
	@param {Mixed} initialValue Optional; If provided, then the first time the callback is called <code>initialValue</code> will be used
		as the value for <code>previousValue</code> and <code>currentValue</code> will be equal to the first value in the array. If not
		provided then <code>previousValue</code> will be equal to the first value in the array and <code>currentValue</code> will be
		equal to the second.
	@returns {Mixed} Reduce returns a single value that is the result of the accumulation function applied to each array element.
*/
	Array.prototype.reduce = function reduce(callback, initialValue) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i = 0;
		var result;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (typeof initialValue === 'undefined') {
			if (!len) {
				// No value to return if we have an empty array and no initialValue
				throw new TypeError('Reduce of empty array with no initial value');
			}
			result = arrayObj[0];
			// Start at second element when initialValue is not provided
			i = 1;
		} else {
			result = initialValue;
		}

		while (i < len) {
			if (i in arrayObj) {
				result = callback.call(undefined, result, arrayObj[i], i, arrayObj);
				i += 1;
			}
		}

		return result;
	};
}

if (!Array.prototype.reduceRight) {
/**
	<p>Applies an accumulation function to every element in an array from right to left and returns a single value.</p>
	<p>Usage:</p>
	<pre>
	var reduceRightArray = ['foo', 'bar', 'baz'];
	var reduceRightFn = function (previousValue, currentValue, index, array) {
		return previousValue + '_' + currentValue;
	}
	console.log(reduceRightArray.reduceRight(reduceRightFn));
	</pre>
	@param {Function} callback The function to execute on each value in the array.
		<p><code>callback</code> takes four arguments:</p>
		<dl>
			<dt><strong>previousValue</strong></dt>
			<dd>The value previously returned by the last invocation of the callback, or <code>initialValue</code>, if supplied.</dd>
			<dt><strong>currentValue</strong></dt>
			<dd>The current element being processed in the array.</dd>
			<dt><strong>index</strong></dt>
			<dd>The index of the current element being processed in the array.</dd>
			<dt><strong>array</strong></dt>
			<dd>The array <code>reduce</code> was called upon.</dd>
		</dl>
	@param {Mixed} initialValue Optional; If provided, then the first time the callback is called <code>initialValue</code> will be used
		as the value for <code>previousValue</code> and <code>currentValue</code> will be equal to the last value in the array. If not
		provided then <code>previousValue</code> will be equal to the last value in the array and <code>currentValue</code> will be
		equal to the second to last value.
	@returns {Mixed} Reduce returns a single value that is the result of the accumulation function applied to each array element.
*/
	Array.prototype.reduceRight = function reduceRight(callback, initialValue) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i = len - 1;
		var result;

		// Callback must be a callable function
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (initialValue === undefined) {
			if (!len) {
				// No value to return if we have an empty array and no initialValue
				throw new TypeError('Reduce of empty array with no initial value');
			}
			result = arrayObj[len - 1];
			// Start at second to last element when initialValue is not provided
			i = len - 2;
		} else {
			result = initialValue;
		}

		while (i >= 0) {
			if (i in arrayObj) {
				result = callback.call(undefined, result, arrayObj[i], i, arrayObj);
				i -= 1;
			}
		}

		return result;
	};
}



if (!Array.prototype.some) {
/**
	Essentially the opposite of Array.prototype.every, Array.prototype.some calls a provided callback function once
	for each element in an array, until the callback function returns true.
	@param {Function} callback The fucntion to execute on each element in the array. The return value must evaluate to
	a boolean true in order for the entire method to return true.
	@param {Object} thisObj Optional; The object to use as `this` when executing the callback
	@returns {Boolean} true if the callback returns a true value, otherwise false.
*/
	Array.prototype.some = function some(callback, thisObj) {
		var arrayObj = Object(this);
		// Mimic ES5 spec call for interanl method ToUint32()
		var len = arrayObj.length >>> 0;
		var i;

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		for (i = 0; i < len; i += 1) {
			if (i in arrayObj && callback.call(thisObj, arrayObj[i], i, arrayObj) === true) {
				return true;
			}
		}

		return false;
	};
}



if (!Date.now) {
/**
	Returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
	@returns {Integer} The number of milliseconds elapsed since January 1, 1970 00:00:00 UTC
*/
	Date.now = function now() {
		return new Date().getTime();
	};
}



if (!Date.prototype.toISOString) {
/**
	<p>Returns a string from a Date object formatted per the ISO 8601 Extended Format.</p>
	<p><em>Please note that the Prototype library also polyfills this method. However their polyfill
	does not entirely adhere to the ES5 spec. The Prototype version fails to include the milliseconds
	and does not provide support for the extended year format. Be aware that if the Prototype library
	is included ahead of ac_base.js in your application, Prototype's version will take precedence
	on non-supporting browsers.</em></p>
	@returns {String} Returns a date string formatted per the ISO 8601 Extended format.
*/
	Date.prototype.toISOString = function toISOString() {
		if (!isFinite(this)) {
			throw new RangeError('Date.prototype.toISOString called on non-finite value.');
		}

		var parts = {
			'year': this.getUTCFullYear(),
			'month': this.getUTCMonth() + 1,
			'day': this.getUTCDate(),
			'hours': this.getUTCHours(),
			'minutes': this.getUTCMinutes(),
			'seconds': this.getUTCSeconds(),
			'mseconds': (this.getUTCMilliseconds() / 1000).toFixed(3).substr(2, 3)
		};
		var prop;
		var prefix;

		// Pad single digits with a leading 0
		for (prop in parts) {
			if (parts.hasOwnProperty(prop) && prop !== 'year' && prop !== 'mseconds') {
				parts[prop] = String(parts[prop]).length === 1 ? '0' + String(parts[prop]) : String(parts[prop]);
			}
		}

		// Support for extended years per 15.9.1.15.1 (http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
		if (parts.year < 0 || parts.year > 9999) {
			prefix = parts.year < 0 ? '-' : '+';
			parts.year = prefix + String(Math.abs(parts.year / 1000000)).substr(2, 6);
		}

		return parts.year + '-' + parts.month + '-' + parts.day + 'T' + parts.hours + ':' + parts.minutes + ':' + parts.seconds + '.' + parts.mseconds + 'Z';
	};

}


if (!Date.prototype.toJSON) {
/**
	<p>Provides a String representation of a Date object for use by JSON.stringify</p>
	<p><strong>Note 1:</strong> The toJSON method is intentionally generic; it does not require that its `this` value be a Date object.
	Therefore, it can be transferred to other kinds of objects for use as a method. However, it does require that
	any such object have a <code>toISOString</code> method. Full info can be found in the ES5 spec (15.9.5.44):
	http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf</p>
	<p><strong>Note 2:</strong> The Prototype library also polyfills this method. However their polyfill
	does not adhere to the ES5 spec. The Prototype version fails to include the ignored <code>key</code> argument,
	and only returns a call to <code>Date.toISOString()</code>. This is quite different from the behavior defined in the ES5 spec.
	Be aware that if the Prototype library is included ahead of ac_base.js in your application, Prototype's version
	will take precedence on non-supporting browsers.</p>
	@param {Mixed} key The key argument is ignored, however an object is free to use the <code>key</code>
		argument to filter its stringification.
	@returns {String} Returns a date string formatted per the ISO 8601 Extended format for use with JSON.stringify
*/
	Date.prototype.toJSON = function (key) {
		var obj = Object(this);
		var prim;

		// These primitive related functions simulate the required call to the internal ToPrimitive() construct per the ES5 spec.
		var isPrimitive = function (input) {
			var type = typeof input;

			var types = [null, 'undefined', 'boolean', 'string', 'number'].some(function (value) {
				return value === type;
			});

			if (types) {
				return true;
			}

			return false;
		};

		var toPrimitive = function (input) {
			var value;

			if (isPrimitive(input)) {
				return input;
			}

			value = (typeof input.valueOf === 'function') ? input.valueOf() : (typeof input.toString === 'function') ? input.toString() : null;

			if (value && isPrimitive(value)) {
				return value;
			}

			throw new TypeError(input + ' cannot be converted to a primitive');
		};

		prim = toPrimitive(obj);

		if (typeof prim === 'number' && !isFinite(prim)) {
			return null;
		}

		if (typeof obj.toISOString !== 'function') {
			throw new TypeError('toISOString is not callable');
		}

		return obj.toISOString.call(obj);
	};
}




if (!String.prototype.trim) {
/**
	Removes whitespace from both ends of the string.
*/
	String.prototype.trim = function trim() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}



if (!Object.keys) {
/**
	Returns an array of strings representing all the enumerable property names of the object.
	@param {Object} Object who's keys to return.
*/
	Object.keys = function keys(obj) {
		var keysArray = [];
		var currentKey;

		if ((!obj) || (typeof obj.hasOwnProperty !== 'function')) {
			throw 'Object.keys called on non-object.';
		}

		for (currentKey in obj) {
			if (obj.hasOwnProperty(currentKey)) {
				keysArray.push(currentKey);
			}
		}

		return keysArray;
	};
}

//= require ../src/extensions/ecma_script_5_shim.js

// == JSON ==
// Fallback (for IE) to have JSON.stringify and JSON.parse methods
//
// From: https://github.com/douglascrockford/JSON-js/blob/master/json2.js
//
/*********************** JSON ***********************/
if(typeof JSON == "undefined" || !('stringify' in JSON && 'parse' in JSON)) {
	if(!this.JSON) {
		this.JSON = {};
	}(function() {
		function f(n) {
			return n < 10 ? "0" + n : n;
		}
		// Date.toJSON used to be polyfilled here. A version that adheres more closely to ES5 spec
		// has been since added to ecma_script_5_shim.js rendering this version obsolete.
		if(typeof String.prototype.toJSON !== "function") {
			String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
				return this.valueOf();
			};
		}
		var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			gap, indent, meta = {
				"\b": "\\b",
				"\t": "\\t",
				"\n": "\\n",
				"\f": "\\f",
				"\r": "\\r",
				'"': '\\"',
				"\\": "\\\\"
			},
			rep;

		function quote(string) {
			escapable.lastIndex = 0;
			return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' : '"' + string + '"';
		}
		function str(key, holder) {
			var i, k, v, length, mind = gap,
				partial, value = holder[key];
			if(value && typeof value === "object" && typeof value.toJSON === "function") {
				value = value.toJSON(key);
			}
			if(typeof rep === "function") {
				value = rep.call(holder, key, value);
			}
			switch(typeof value) {
			case "string":
				return quote(value);
			case "number":
				return isFinite(value) ? String(value) : "null";
			case "boolean":
			case "null":
				return String(value);
			case "object":
				if(!value) {
					return "null";
				}
				gap += indent;
				partial = [];
				if(Object.prototype.toString.apply(value) === "[object Array]") {
					length = value.length;
					for(i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || "null";
					}
					v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
					gap = mind;
					return v;
				}
				if(rep && typeof rep === "object") {
					length = rep.length;
					for(i = 0; i < length; i += 1) {
						k = rep[i];
						if(typeof k === "string") {
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v);
							}
						}
					}
				} else {
					for(k in value) {
						if(Object.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if(v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v);
							}
						}
					}
				}
				v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
				gap = mind;
				return v;
			}
		}
		if(typeof JSON.stringify !== "function") {
			JSON.stringify = function(value, replacer, space) {
				var i;
				gap = "";
				indent = "";
				if(typeof space === "number") {
					for(i = 0; i < space; i += 1) {
						indent += " ";
					}
				} else {
					if(typeof space === "string") {
						indent = space;
					}
				}
				rep = replacer;
				if(replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
					throw new Error("JSON.stringify");
				}
				return str("", {
					"": value
				});
			};
		}
		if(typeof JSON.parse !== "function") {
			JSON.parse = function(text, reviver) {
				var j;

				function walk(holder, key) {
					var k, v, value = holder[key];
					if(value && typeof value === "object") {
						for(k in value) {
							if(Object.hasOwnProperty.call(value, k)) {
								v = walk(value, k);
								if(v !== undefined) {
									value[k] = v;
								} else {
									delete value[k];
								}
							}
						}
					}
					return reviver.call(holder, key, value);
				}
				text = String(text);
				cx.lastIndex = 0;
				if(cx.test(text)) {
					text = text.replace(cx, function(a) {
						return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
					});
				}
				if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
					j = eval("(" + text + ")");
					return typeof reviver === "function" ? walk({
						"": j
					}, "") : j;
				}
				throw new SyntaxError("JSON.parse");
			}
		}
	}());
} /*********************** JSON ***********************/
/**
	matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license
*/
window.matchMedia = window.matchMedia || (function (doc, undefined) {

	var bool, docElem = doc.documentElement,
	    refNode = docElem.firstElementChild || docElem.firstChild,

	// fakeBody required for <FF4 when executed in <head>
	fakeBody = doc.createElement('body'),
	     div = doc.createElement('div');

	div.id = 'mq-test-1';
	div.style.cssText = "position:absolute;top:-100em";
	fakeBody.style.background = "none";
	fakeBody.appendChild(div);

	return function (q) {

		div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width:42px; }</style>';

		docElem.insertBefore(fakeBody, refNode);
		bool = div.offsetWidth === 42;
		docElem.removeChild(fakeBody);

		return {
			matches: bool,
			media: q
		};
	};

}(document));

/**
	http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	requestAnimationFrame polyfill by Erik Möller
	fixes from Paul Irish and Tino Zijdel
	Modified to implement Date.now()
*/
(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
		var currTime = Date.now();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}());

window.XMLHttpRequest = window.XMLHttpRequest || function () {	
	var request;
	try {
		request = new ActiveXObject("Msxml2.XMLHTTP");
	// Couldn’t get newer MS-proprietary ActiveX object
	} catch (exception) { 
		try {
			request = new ActiveXObject("Microsoft.XMLHTTP");
		// Total XMLHTTP fail
		/*jshint -W002 */
		} catch (exception) {
			request = false;
		}
	}
	return request;
};

!function(){var a,b,c,d;!function(){var e={},f={};a=function(a,b,c){e[a]={deps:b,callback:c}},d=c=b=function(a){function c(b){if("."!==b.charAt(0))return b;for(var c=b.split("/"),d=a.split("/").slice(0,-1),e=0,f=c.length;f>e;e++){var g=c[e];if(".."===g)d.pop();else{if("."===g)continue;d.push(g)}}return d.join("/")}if(d._eak_seen=e,f[a])return f[a];if(f[a]={},!e[a])throw new Error("Could not find module "+a);for(var g,h=e[a],i=h.deps,j=h.callback,k=[],l=0,m=i.length;m>l;l++)"exports"===i[l]?k.push(g={}):k.push(b(c(i[l])));var n=j.apply(this,k);return f[a]=g||n}}(),a("promise/all",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to all.");return new b(function(b,c){function d(a){return function(b){f(a,b)}}function f(a,c){h[a]=c,0===--i&&b(h)}var g,h=[],i=a.length;0===i&&b([]);for(var j=0;j<a.length;j++)g=a[j],g&&e(g.then)?g.then(d(j),c):f(j,g)})}var d=a.isArray,e=a.isFunction;b.all=c}),a("promise/asap",["exports"],function(a){"use strict";function b(){return function(){process.nextTick(e)}}function c(){var a=0,b=new i(e),c=document.createTextNode("");return b.observe(c,{characterData:!0}),function(){c.data=a=++a%2}}function d(){return function(){j.setTimeout(e,1)}}function e(){for(var a=0;a<k.length;a++){var b=k[a],c=b[0],d=b[1];c(d)}k=[]}function f(a,b){var c=k.push([a,b]);1===c&&g()}var g,h="undefined"!=typeof window?window:{},i=h.MutationObserver||h.WebKitMutationObserver,j="undefined"!=typeof global?global:void 0===this?window:this,k=[];g="undefined"!=typeof process&&"[object process]"==={}.toString.call(process)?b():i?c():d(),a.asap=f}),a("promise/config",["exports"],function(a){"use strict";function b(a,b){return 2!==arguments.length?c[a]:(c[a]=b,void 0)}var c={instrument:!1};a.config=c,a.configure=b}),a("promise/polyfill",["./promise","./utils","exports"],function(a,b,c){"use strict";function d(){var a;a="undefined"!=typeof global?global:"undefined"!=typeof window&&window.document?window:self;var b="Promise"in a&&"resolve"in a.Promise&&"reject"in a.Promise&&"all"in a.Promise&&"race"in a.Promise&&function(){var b;return new a.Promise(function(a){b=a}),f(b)}();b||(a.Promise=e)}var e=a.Promise,f=b.isFunction;c.polyfill=d}),a("promise/promise",["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],function(a,b,c,d,e,f,g,h){"use strict";function i(a){if(!v(a))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof i))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._subscribers=[],j(a,this)}function j(a,b){function c(a){o(b,a)}function d(a){q(b,a)}try{a(c,d)}catch(e){d(e)}}function k(a,b,c,d){var e,f,g,h,i=v(c);if(i)try{e=c(d),g=!0}catch(j){h=!0,f=j}else e=d,g=!0;n(b,e)||(i&&g?o(b,e):h?q(b,f):a===D?o(b,e):a===E&&q(b,e))}function l(a,b,c,d){var e=a._subscribers,f=e.length;e[f]=b,e[f+D]=c,e[f+E]=d}function m(a,b){for(var c,d,e=a._subscribers,f=a._detail,g=0;g<e.length;g+=3)c=e[g],d=e[g+b],k(b,c,d,f);a._subscribers=null}function n(a,b){var c,d=null;try{if(a===b)throw new TypeError("A promises callback cannot return that same promise.");if(u(b)&&(d=b.then,v(d)))return d.call(b,function(d){return c?!0:(c=!0,b!==d?o(a,d):p(a,d),void 0)},function(b){return c?!0:(c=!0,q(a,b),void 0)}),!0}catch(e){return c?!0:(q(a,e),!0)}return!1}function o(a,b){a===b?p(a,b):n(a,b)||p(a,b)}function p(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(r,a))}function q(a,b){a._state===B&&(a._state=C,a._detail=b,t.async(s,a))}function r(a){m(a,a._state=D)}function s(a){m(a,a._state=E)}var t=a.config,u=(a.configure,b.objectOrFunction),v=b.isFunction,w=(b.now,c.all),x=d.race,y=e.resolve,z=f.reject,A=g.asap;t.async=A;var B=void 0,C=0,D=1,E=2;i.prototype={constructor:i,_state:void 0,_detail:void 0,_subscribers:void 0,then:function(a,b){var c=this,d=new this.constructor(function(){});if(this._state){var e=arguments;t.async(function(){k(c._state,d,e[c._state-1],c._detail)})}else l(this,d,a,b);return d},"catch":function(a){return this.then(null,a)}},i.all=w,i.race=x,i.resolve=y,i.reject=z,h.Promise=i}),a("promise/race",["./utils","exports"],function(a,b){"use strict";function c(a){var b=this;if(!d(a))throw new TypeError("You must pass an array to race.");return new b(function(b,c){for(var d,e=0;e<a.length;e++)d=a[e],d&&"function"==typeof d.then?d.then(b,c):b(d)})}var d=a.isArray;b.race=c}),a("promise/reject",["exports"],function(a){"use strict";function b(a){var b=this;return new b(function(b,c){c(a)})}a.reject=b}),a("promise/resolve",["exports"],function(a){"use strict";function b(a){if(a&&"object"==typeof a&&a.constructor===this)return a;var b=this;return new b(function(b){b(a)})}a.resolve=b}),a("promise/utils",["exports"],function(a){"use strict";function b(a){return c(a)||"object"==typeof a&&null!==a}function c(a){return"function"==typeof a}function d(a){return"[object Array]"===Object.prototype.toString.call(a)}var e=Date.now||function(){return(new Date).getTime()};a.objectOrFunction=b,a.isFunction=c,a.isArray=d,a.now=e}),b("promise/polyfill").polyfill()}();
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * An instance of Ajax
 * @module ac-ajax
 * @property Ajax {Class} A reference to the Ajax constructor
 */
var Ajax = require('./ac-ajax/Ajax');

module.exports = new Ajax();
module.exports.Ajax = Ajax;

},{"./ac-ajax/Ajax":2}],2:[function(require,module,exports){
'use strict';

var Deferred = require('ac-deferred').Deferred;

/**
 * @constructor
 * @memberOf module:ac-ajax
 */
var Ajax = function() {};

Ajax.prototype = /** @lends module:ac-ajax.Ajax# */ {

	// The library used to implement promises
	_Deferred: Deferred,

	/**
	 * The default configuration for requests
	 * @type {Object}
	 * @property {Object} timeout The timeout duration
	 * @defaults
	 * @readOnly
	 * @private
	 */
	/** @ignore */
	_defaults: {
		timeout: 5000
	},

	/**
	 * Attaches the onreadystatechange handler to the request argument.xhr which will resolve the request.deferred if successful and reject request.deferred if not
	 * @param  {Object} request An object literal with a key of xhr with the value of an XMLHttpRequest instance
	 * @private
	 */
	/** @ignore */
	_addReadyStateChangeHandler: function(request, is_xhr) {
		
		
		/* SMUI 8/27/14 add for XDomainRequest */
		if (!is_xhr) {
			request.xhr.onload = function(e) {
				request.deferred.resolve(request.xhr);
			};
			request.xhr.onerror = function(e) {
				request.deferred.reject(request.xhr);
			};
		}
		/* SMUI 8/27/14 add else wrapper */
		else {
			request.xhr.onreadystatechange = function(e) {
			
				if (request.xhr.readyState === 4) {
				
					clearTimeout(request.timeout);
				
					if (request.xhr.status >= 200 && request.xhr.status < 300) {
					
						request.deferred.resolve(request.xhr);

					} else {

						request.deferred.reject(request.xhr);

					}

				}

			};
		}
		
	},

	/**
	 * Adds a timeout to the passed request object for the passed duration. Should the timeout expire the xhr will be aborted and deferred will be rejected
	 * @param  {Object} request         An object literal with xhr and deferred properties
	 * @param  {Int} timeoutDuration The duration for the timeout in milliseconds
	 * @private
	 */
	/** @ignore */
	_addTimeout: function(request, timeoutDuration) {

		if (timeoutDuration) {

			request.timeout = setTimeout(function() {

				request.xhr.abort();

				request.deferred.reject();

			}, timeoutDuration);

		}

	},

	/**
	 * Combines any number of objects passed as arguments into a single object literal from left to right
	 * @return {Object} An object containing all the properties of the object passed as arguments
	 * @private
	 */
	/** @ignore */
	_extend: function() {
		for (var i = 1; i < arguments.length; i++) {
			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					arguments[0][key] = arguments[i][key];
				}
			}
		}
		return arguments[0];
	},

	/**
	 * Combines the request defaults, user provided configuration and method specific constants into a single object literal
	 * @param  {Object} constants     Contains configurations that should not be overwritten for public methods like post, get, and checkURL
	 * @param  {Object} configuration User provided request configuration
	 * @return {Object}               Combined configuration
	 * @private
	 */
	/** @ignore */
	_getOptions: function(constants, configuration) {
		return this._extend({}, this._defaults, configuration, constants);
	},

	/**
	 * Sends an XMLHttpRequest with the provided configuration and returns a promise
	 * @param  {Object} configuration The configuration for the request
	 * @return {Object}               A promise
	 * @private
	 * @throws If not correctly configured
	 */
	/** @ignore */
	_sendRequest: function(configuration) {

		// Validates configuration
		var errors = this._validateConfiguration(configuration);

		// Throws errors if something was wrong with the configuration
		if (errors) {
			throw errors;
		}
		
		/* SMUI 8/28/14: replace. IE uses a different XHR for cross domain requests */
		var xhrequest = new XMLHttpRequest();
		var is_xhr = true;
		var re_origin = new RegExp(window.location.protocol + "//" + window.location.host);
		var search_form = document.getElementById('gh-search-form');
		if (!re_origin.test(search_form.getAttribute('action')) && typeof XDomainRequest !== 'undefined') {
			xhrequest = new XDomainRequest();
			is_xhr = false;
		}

		var request = {
			/* SMUI 8/26/14: replace. IE uses a different XHR for cross domain requests */
			//xhr: new XMLHttpRequest()
			xhr: xhrequest
		};

		request.deferred = new Deferred();
		request.xhr.open(configuration.method, configuration.url);
		
		
		this._setRequestHeaders(request, configuration.headers);
		
		this._addTimeout(request, configuration.timeout);

		this._addReadyStateChangeHandler(request, is_xhr);

		request.xhr.send(configuration.data);

		return request.deferred.promise();

	},

	/**
	 * Sets request headers using the provided request and headers array
	 * @param  {Object} request An instance of XMLHttpRequest
	 * @param  {Array} headers An array of the headers to be used on the request
	 * @private
	 */
	/** @ignore */
	_setRequestHeaders: function(request, headers) {

		if(headers) {
			headers.forEach(function(header) {
				request.xhr.setRequestHeader(header.name, header.value);
			});
		}

	},

	/**
	 * Validates the provided configuration and returns errors should something be incorrectly configured
	 * @param  {Object} configuration Configuration for the request
	 * @return {String}               The errors concatenated
	 * @private
	 */
	/** @ignore */
	_validateConfiguration: function(configuration) {

		if(!configuration) {
			return 'Must provide a configuration object';
		}

		var errors = [];
		var headers = configuration.headers;
		
		if(!configuration.url) {
			errors.push('Must provide a url');
		}

		if(headers) {

			if(!Array.isArray(headers)) {
				return 'Must provide an array of headers';
			}

			this._validateHeaders(headers, errors);
		}

		return errors.join(', ');

	},

	/**
	 * Validates headers to ensure both a name and value are present in each header, breaks if an error is detected
	 * @param  {Array} headers An array of the desired headers for the request
	 * @param  {Array} errors  An array of errors
	 * @private
	 */
	/** @ignore */
	_validateHeaders: function(headers, errors) {

		for(var i = 0, len = headers.length; i < len; i++) {

			if(!headers[i].hasOwnProperty('name') || !headers[i].hasOwnProperty('value')) {
				errors.push('Must provide a name and value key for all headers');
				break;
			}
		}

	},

	/**
	 * Checks if a url exists
	 * @param  {Object} configuration   The configuration for a request
	 * @return {Object}               A promise
	 * @public
	 * @example
	 * var ajax = require('ac-ajax');
	 * ajax.checkUrl({'url':'http://apple.com'}.then(successCallback, failureCallback);
	 */
	checkURL: function(configuration) {

		configuration = this._getOptions({
			method: 'head'
		}, configuration);

		return this._sendRequest(configuration);

	},

	/**
	 * Sends a get request
	 * @param  {Object} configuration Configuration for the request
	 * @return {Object}               A promise
	 * @public
	 * @example
	 * var ajax = require('ac-ajax');
	 * ajax.get({'url':'http://apple.com'}).then(successCallback, failureCallback);
	 */
	get: function(configuration) {
		
		configuration = this._getOptions({
			method: 'get'
		}, configuration);

		return this._sendRequest(configuration);
	},

	/**
	 * Sends a post request
	 * @param  {Object} configuration Configuration for the request
	 * @return {Object}               A promise
	 * @public
	 * @example
	 * var ajax = require('ac-ajax');
	 * ajax.post({'url':'http://apple.com'}).then(successCallback, failureCallback);
	 */
	post: function(configuration) {
		
		configuration = this._getOptions({
			method: 'post'
		}, configuration);

		return this._sendRequest(configuration);
	}

};

module.exports = Ajax;
},{"ac-deferred":26}],3:[function(require,module,exports){
'use strict';

var ac_Environment_Browser = require('./Environment/Browser');

/**
 * @name module:ac-base.Array
 * @kind namespace
 */
var ac_Array = {};

/**
 * @param {Object} arrayLike Take an Array-like object and convert it to an actual Array (for instance a NodeList)
 * @name module:ac-base.Array.toArray
 * @kind function
 */
ac_Array.toArray = function (arrayLike) {
	return Array.prototype.slice.call(arrayLike);
};

/**
 * @param {Array} array Take a multi-dimensional array and flatten it into a single level.
 * @name module:ac-base.Array.flatten
 * @kind function
 */
ac_Array.flatten = function (array) {
	var flattenedArray = [];
	var callback = function (item) {
		if (Array.isArray(item)) {
			item.forEach(callback);
		} else {
			flattenedArray.push(item);
		}
	};

	array.forEach(callback);
	return flattenedArray;
};

/**
 * @param {Array} arr Source array
 * @param {*} value Entry in array to remove
 * @returns {Array} A new array that is the source array without the first instance of the value provided.
 * @name module:ac-base.Array.without
 * @kind function
 */
ac_Array.without = function (arr, value) {
	var newArr;
	var index = arr.indexOf(value);
	var length = arr.length;

	if (index >= 0) {
		// If it’s the last item
		if (index === (length - 1)) {
			newArr = arr.slice(0, (length - 1));

		// If it’s the first item
		} else if (index === 0) {
			newArr = arr.slice(1);

		// If it’s in the middle
		} else {
			newArr = arr.slice(0, index);
			newArr = newArr.concat(arr.slice(index + 1));
		}
	} else {
		return arr;
	}

	return newArr;
};

if (ac_Environment_Browser.name === "IE") {
	require('./shims/ie/Array')(ac_Array, ac_Environment_Browser);
}

module.exports = ac_Array;

},{"./Environment/Browser":9,"./shims/ie/Array":16}],"j0qjr8":[function(require,module,exports){

var ac_Viewport = require('./Viewport');
var ac_log = require('./log');
var events = require('./Element/events');
var vendorTransformHelper = require('./Element/vendorTransformHelper');
var ac_Environment_Browser = require('./Environment/Browser');

/**
 * Utility methods dealing with Elements
 * @name module:ac-base.Element
 * @kind namespace
 */
var ac_Element = {
	addEventListener: events.addEventListener,
	removeEventListener: events.removeEventListener,
	addVendorPrefixEventListener: events.addVendorPrefixEventListener,
	removeVendorPrefixEventListener: events.removeVendorPrefixEventListener,
	/**
	 * @deprecated Use module:ac-base.Element.addVendorPrefixEventListener instead.
	 * @name module:ac-base.Element.addVendorEventListener
	 * @kind function
	 */
	addVendorEventListener: function (element, type, listener, useCapture) {
		ac_log('ac-base.Element.addVendorEventListener is deprecated. Please use ac-base.Element.addVendorPrefixEventListener.');
		return this.addVendorPrefixEventListener(element, type, listener, useCapture);
	},
	/**
	 * @deprecated Use module:ac-base.Element.removeVendorPrefixEventListener instead.
	 * @name module:ac-base.Element.addVendorEventListener
	 * @kind function
	 */
	removeVendorEventListener: function (element, type, listener, useCapture) {
		ac_log('ac-base.Element.removeVendorEventListener is deprecated. Please use ac-base.Element.removeVendorPrefixEventListener.');
		return this.removeVendorPrefixEventListener(element, type, listener, useCapture);
	}
};

// Initialize ac_Element.__EventDelegate
require('./Element/EventDelegate')(ac_Element);

/**
 * @param {Element | String} element
 * @returns The Node with the ID <code>element</code> or return the Node directly, else return null
 * @name module:ac-base.Element.getElementById
 * @kind function
 */
ac_Element.getElementById = function (element) {
	if (typeof element === 'string') {
		element = document.getElementById(element);
	}
	if (ac_Element.isElement(element)) {
		return element;
	} else {
		return null;
	}
};

/**
 * @param {String} selector CSS String to select elements by.
 * @param {Element} context Optional; Scope the search to a specific Element Node. document.body is the default.
 * @returns {Array} Array of Elements as Nodes (Not a Node List)
 * @name module:ac-base.Element.selectAll
 * @kind function
 */
ac_Element.selectAll = function (selector, context) {
	if (typeof context === 'undefined') {
		context = document;
	} else if (!ac_Element.isElement(context) && context.nodeType !== 9 && context.nodeType !== 11) {
		throw new TypeError('ac-base.Element.selectAll: Invalid context nodeType');
	}
	if (typeof selector !== 'string') {
		throw new TypeError('ac-base.Element.selectAll: Selector must be a string');
	}
	// selectAll is shimmed using ac_Array.toArray, so this is fine
	return Array.prototype.slice.call(context.querySelectorAll(selector));
};

/**
 * @param {String} selector CSS String to select elements by.
 * @param {Element} context Optional; Scope the search to a specific Element Node. document.body is the default.
 * @returns {Element} First element that matches selector in DOM
 * @name module:ac-base.Element.select
 * @kind function
 */
ac_Element.select = function (selector, context) {
	if (typeof context === 'undefined') {
		context = document;
	} else if (!ac_Element.isElement(context) && context.nodeType !== 9 && context.nodeType !== 11) {
		throw new TypeError('ac-base.Element.select: Invalid context nodeType');
	}
	if (typeof selector !== 'string') {
		throw new TypeError('ac-base.Element.select: Selector must be a string');
	}
	return context.querySelector(selector);
};

/**
 * No polyfill, sizzle is used in IE shim, which would be
 * the only unsupported place for this in the matrix.
 * @ignore
 */
var matches = window.Element ? (function(proto) {
	return proto.matches ||
		proto.matchesSelector ||
		proto.webkitMatchesSelector ||
		proto.mozMatchesSelector ||
		proto.msMatchesSelector ||
		proto.oMatchesSelector;
}(Element.prototype)) : null;

/**
 * <p>Check to see if an element matches a CSS selector</p>
 * <p>Usage:</p>
 * <pre>
 * module:ac-base.Element.matchesSelector(document.getElementById("foo"), "#foo") -> true
 * module:ac-base.Element.matchesSelector(document.body, "body #foo") -> false
 * </pre>
 * @param {Element} element DOM element you want to check against a selector
 * @param {String} selector CSS Selector you want to check against
 * @returns {Boolean} True if the element is matched by the selector. False otherwise.
 * @name module:ac-base.Element.select
 * @kind function
 */
ac_Element.matchesSelector = function (element, selector) {
	// matches will throw a TypeError for non-elements
	return ac_Element.isElement(element) ? matches.call(element, selector) : false;
};

/**
 * @deprecated Use module:ac-base.Element.filterBySelector instead.
 * @name module:ac-base.Element.matches
 * @kind function
 */
ac_Element.matches = function (element, selector) {
	ac_log('ac-base.Element.matches is deprecated. Use ac-base.Element.filterBySelector instead.');
	return ac_Element.filterBySelector(selector, element);
};

/**
 * <p>Filter an array of elements with a CSS selector</p>
 * <p>Usage:</p>
 * <pre>
 * module:ac-base.Element.filterBySelector(module:ac-base.Element.selectAll(".foo"), ".foo")
 * module:ac-base.Element.filterBySelector(module:ac-base.Element.selectAll("body"), "body #foo") -> false
 * </pre>
 * @param {Array} elements The array of DOM elements you want to filter
 * @param {String} selector The CSS Selector to use for the filter
 * @returns {Array} An array containing all matched elements. This array can be empty.
 * @name module:ac-base.Element.filterBySelector
 * @kind function
 */
ac_Element.filterBySelector = function (elements, selector) {
	var arr = [];
	// @todo Cannot use Array.prototype.filter until removing "the other" script
	for (var i = 0, l = elements.length; i < l; i++) {
		// matches will throw a TypeError for non-elements
		if (ac_Element.isElement(elements[i]) && matches.call(elements[i], selector)) {
			arr[arr.length] = elements[i];
		}
	}
	return arr;
};

/**
 * @deprecated Use ac-base.Element.setStyle instead.
 * @name module:ac-base.Element.setOpacity
 * @kind function
 */
ac_Element.setOpacity = function (element, value) {
	ac_log('ac-base.Element.setOpacity is deprecated. Use ac-base.Element.setStyle instead.');
	return ac_Element.setStyle(element, { opacity: value });
};

/**
 * <p>Set one or more CSS styles on a DOM element.</p>
 * <p>Usage:</p>
 * <pre>
 * // element and style paramaters as strings
 * module:ac-base.Element.setStyle('nav', 'float:left; background:#ccc;');
 * // element paramater as DOM element, style paramater as an object
 * var element = document.getElementById('nav');
 * module:ac-base.Element.setStyle(element, {
 *     float: "left",
 *     background: "#ccc"
 * });
 * </pre>
 * @param {String | Element} element The DOM element to set the style/s on. May either be a valid DOM element
 * or the id as a string of the element you want to target.
 * @param {String | Object} style One or more styles as CSS string or an object with property/value pairs.
 * @returns element as Node
 * @name module:ac-base.Element.setStyle
 * @kind function
 */
ac_Element.setStyle = function (element, styles) {
	if ((typeof styles !== 'string' && typeof styles !== 'object') || Array.isArray(styles)) {
		throw new TypeError('styles argument must be either an object or a string');
	}

	element = ac_Element.getElementById(element);
	var stylesObj;
	var camelCaseProp;
	var prop;

	stylesObj = ac_Element.setStyle.__explodeStyleStringToObject(styles);

	// iterate over stylesObj and set styles
	for (prop in stylesObj) {
		if (stylesObj.hasOwnProperty(prop)) {
			camelCaseProp = prop.replace(/-(\w)/g, ac_Element.setStyle.__camelCaseReplace);
			ac_Element.setStyle.__setStyle(element, camelCaseProp, stylesObj, stylesObj[prop]);
		}
	}

	return element;
};

ac_Element.setStyle.__explodeStyleStringToObject = function (styles) {
	var stylesObj = (typeof styles === 'object') ? styles : {};
	var splitStyles;
	var colon;
	var len;
	var i;

	if (typeof styles === 'string') {
		splitStyles = styles.split(';');
		len = splitStyles.length;
		for (i = 0; i < len; i += 1) {
			colon = splitStyles[i].indexOf(':');
			if (colon > 0) {
				stylesObj[splitStyles[i].substr(0, colon).trim()] = splitStyles[i].substr(colon + 1).trim();
			}
		}
	}

	return stylesObj;
};

ac_Element.setStyle.__setStyle = function (element, camelCaseProp, stylesObj, stylesValue) {
	if (typeof element.style[camelCaseProp] !== 'undefined') {
		element.style[camelCaseProp] = stylesValue;
	}
};

// replace function to handle camelCasing for module:ac-base.Element.setStyle and getStyle.
// Accounts for Mozilla expecting 'Moz'.
/** @ignore */
ac_Element.setStyle.__camelCaseReplace = function (match, group, offset, string) {
	return (offset === 0) && (string.substr(1, 3) !== 'moz') ? group : group.toUpperCase();
};

/**
 * @param {Element} element
 * @param {String} style
 * @returns {String} The value for the style property on this Element
 * @name module:ac-base.Element.getStyle
 * @kind function
 */
ac_Element.getStyle = function (element, style, css) {
	var value;

	style = style.replace(/-(\w)/g, ac_Element.setStyle.__camelCaseReplace);

	element = ac_Element.getElementById(element);
	style = (style === 'float') ? 'cssFloat' : style;

	css = css || window.getComputedStyle(element, null);
	value = css ? css[style] : null;

	if (style === 'opacity') {
		return value ? parseFloat(value) : 1.0;
	}

	return value === 'auto' ? null : value;
};

/**
 * <p>Returns an object with top and left offset values for an element relative
 * to the absolute top and left locations of html document.</p>
 * @param {Element} element
 * @returns {Object} An object with numeric values for top and left properties.
 * @name module:ac-base.Element.cumulativeOffset
 * @kind function
 */
ac_Element.cumulativeOffset = function (element) {
	var box = ac_Element.getBoundingBox(element);
	var scrollOffsets = ac_Viewport.scrollOffsets();
	var offset = [box.top + scrollOffsets.y, box.left + scrollOffsets.x];
	offset.top = offset[0];
	offset.left = offset[1];
	return offset;
};

/**
 * @param {Element} element
 * <p>Returns the bounding box values for an element including width and height.
 * Borders and padding are included. Values are affected by box-sizing.</p>
 * @param {Element} The element you want to query
 * @returns {Object} An object with top, right, bottom, left, width and height values as numbers
 * @name module:ac-base.Element.getBoundingBox
 * @kind function
 */
ac_Element.getBoundingBox = function (element) {
	element = ac_Element.getElementById(element);
	var rect = element.getBoundingClientRect();
	var w = rect.width || rect.right - rect.left;
	var h = rect.height || rect.bottom - rect.top;

	return {
		top: rect.top,
		right: rect.right,
		bottom: rect.bottom,
		left: rect.left,
		width: w,
		height: h
	};
};

/**
 * <p>Returns the width and height of an element's content box. Padding and
 * borders are not included. Accounts for box-sizing:border-box;.</p>
 * @param {Element} The element you want to query
 * @returns {Object} An object with width and height values as numbers
 * @name module:ac-base.Element.getInnerDimensions
 * @kind function
 */
ac_Element.getInnerDimensions = function (element) {
	var dims = ac_Element.getBoundingBox(element);
	var w = dims.width;
	var h = dims.height;
	var style;
	var styleValue;
	var css = window.getComputedStyle ? window.getComputedStyle(element, null) : null;

	['padding', 'border'].forEach(function (prop) {
		['Top', 'Right', 'Bottom', 'Left'].forEach(function (side) {
			style = prop === 'border' ? prop + side + 'Width' : prop + side;
			styleValue = parseFloat(ac_Element.getStyle(element, style, css));
			styleValue = isNaN(styleValue) ? 0 : styleValue;
			if (side === 'Right' || side === 'Left') {
				w -= styleValue;
			}
			if (side === 'Top' || side === 'Bottom') {
				h -= styleValue;
			}
		});
	});

	return {
		width: w,
		height: h
	};
};

/**
 * <p>Returns the width and height of an element including borders and margins.
 * Accounts for box-sizing:border-box;.</p>
 * @param {Element} The element you want to query
 * @returns {Object} An object with width and height values as numbers
 * @name module:ac-base.Element.getOuterDimensions
 * @kind function
 */
ac_Element.getOuterDimensions = function (element) {
	var dims = ac_Element.getBoundingBox(element);
	var w = dims.width;
	var h = dims.height;
	var marginStyle;
	var css = window.getComputedStyle ? window.getComputedStyle(element, null) : null;

	['margin'].forEach(function (prop) {
		['Top', 'Right', 'Bottom', 'Left'].forEach(function (side) {
			marginStyle = parseFloat(ac_Element.getStyle(element, prop + side, css));
			marginStyle = isNaN(marginStyle) ? 0 : marginStyle;
			if (side === 'Right' || side === 'Left') {
				w += marginStyle;
			}
			if (side === 'Top' || side === 'Bottom') {
				h += marginStyle;
			}
		});
	});

	return {
		width:  w,
		height: h
	};
};

/**
 * Return <code>true</code> or <code>false</code> depending on whether the className provided exists on the element.
 * @param {Element} element
 * @param {String} cls className to test against
 * @name module:ac-base.Element.hasClassName
 * @kind function
 */
ac_Element.hasClassName = function (element, cls) {
	var matchedElement = ac_Element.getElementById(element);

	if (matchedElement && matchedElement.className !== '') {
		return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(matchedElement.className);
	} else {
		return false;
	}
};

/**
 * Adds a className to an Element.
 * @param {Element} element
 * @param {String} cls className to add
 * @name module:ac-base.Element.addClassName
 * @kind function
 */
ac_Element.addClassName = function (element, cls) {
	var matchedElement = ac_Element.getElementById(element);

	// use classList when available as it is more performant and does not trigger a repaint
	if (matchedElement.classList) {
		matchedElement.classList.add(cls);

	// check hasClassName first to avoid unnecessary repaints resulting from modifying the className property
	} else if (!ac_Element.hasClassName(matchedElement, cls)) {
		matchedElement.className += " " + cls;
	}
};

/**
 * Removes a className from an Element.
 * @param {Element} element
 * @param {String} cls className to remove
 * @name module:ac-base.Element.removeClassName
 * @kind function
 */
ac_Element.removeClassName = function (element, cls) {
	var matchedElement = ac_Element.getElementById(element);

	if (ac_Element.hasClassName(matchedElement, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		matchedElement.className = matchedElement.className.replace(reg, '$1').trim();
	}
};

/**
 * Toggles a className on an element. If the className is not present, it is added.
 * If it is present, it is removed.
 * @param {Element} element
 * @param {String} cls className to toggle
 * @name module:ac-base.Element.toggleClassName
 * @kind function
 */
ac_Element.toggleClassName = function (element, cls) {
	var matchedElement = ac_Element.getElementById(element);

	if (matchedElement.classList) {
		matchedElement.classList.toggle(cls);
	} else {
		if (ac_Element.hasClassName(matchedElement, cls)) {
			ac_Element.removeClassName(matchedElement, cls);
		} else {
			ac_Element.addClassName(matchedElement, cls);
		}
	}
};

/**
 * Test whether or not an Object is an Element.
 * @param {Object} object
 * @name module:ac-base.Element.isElement
 * @kind function
 */
ac_Element.isElement = function (object) {
	return !!(object && object.nodeType === 1);
};

/**
 * Sets all the vendor specific style {{{property}}} to {{{value}}} on {{{element}}}.
 * @param {Element} element : the element for which to set the style upon
 * @param {String} property : the css property, e.g. borderRadius, webkitBorderRadius, border-radius, etc...
 * @param {String|Number} value : the value for which to set the element's css property
 * @name module:ac-base.Element.setVendorPrefixStyle
 * @kind function
 */
ac_Element.setVendorPrefixStyle = function (element, property, value) {
	if (typeof property !== 'string') {
		throw new TypeError('ac-base.Element.setVendorPrefixStyle: property must be a string');
	}
	if (typeof value !== 'string' && typeof value !== 'number') {
		throw new TypeError('ac-base.Element.setVendorPrefixStyle: value must be a string or a number');
	}

	// Coerce value to string
	value += '';

	element = ac_Element.getElementById(element);
	// Empty value accounts for non-vendor-prefixed properties
	var prefixes = ['', 'webkit', 'Moz', 'ms', 'O'];
	var prefixedCamelProp;
	var prefixedValue;

	// Strip prefix from property if it has one
	property = property.replace(/-(webkit|moz|ms|o)-/i, '');
	// Strip js camelcase vendor prefix if it has one and lowercase first letter. e.g. webkitTransform
	property = property.replace(/^(webkit|Moz|ms|O)/, '');
	property = property.charAt(0).toLowerCase() + property.slice(1);

	// camelCase property
	property = property.replace(/-(\w)/, function (match, group) {
		return group.toUpperCase();
	});

	// Insert token for vendor prefix replacement in values
	value = value.replace(/-(webkit|moz|ms|o)-/, '-vendor-');

	// Iterate through prefixes array testing for existence of property. Update if present.
	prefixes.forEach(function (prefix) {
		// Apply prefixes
		prefixedCamelProp = (prefix === '') ? property : prefix + property.charAt(0).toUpperCase() + property.slice(1);
		prefixedValue = (prefix === '') ? value.replace('-vendor-', '') : value.replace('-vendor-', '-' + prefix.charAt(0).toLowerCase() + prefix.slice(1) + '-');

		if (prefixedCamelProp in element.style) {
			ac_Element.setStyle(element, prefixedCamelProp + ':' + prefixedValue);
		}
	});

};

/**
 * Returns the style value for a specific property as a string and, if necessary, prefixed
 * with the correct vendor prefix for the executing browser.
 * @param {Element | String} element The DOM element from which to return the style. Can either
 * be a valid DOM element or the element's ID as a string.
 * @param {String} property The CSS property to fetch the style for. Will accept either a CSS
 * property or a javascript Element.style property name. Vendor prefixes are optional. Any
 * acceptable property as a string will return the same results. e.g. -webkit-box-shadow,
 * -moz-box-shadow, boxShadow, and msBoxShadow will all yield the same return value.
 * @returns The specified property's style as a string
 * @name module:ac-base.Element.getVendorPrefixStyle
 * @kind function
 */
ac_Element.getVendorPrefixStyle = function (element, property) {
	if (typeof property !== 'string') {
		throw new TypeError('ac-base.Element.getVendorPrefixStyle: property must be a string');
	}

	element = ac_Element.getElementById(element);
	var prefixes = ['', 'webkit', 'Moz', 'ms', 'O'];
	var style;

	// Strip css vendor prefix from property if it has one. e.g. -webkit-transform
	property = property.replace(/-(webkit|moz|ms|o)-/i, '');
	// Strip js camelcase vendor prefix if it has one and lowercase first letter. e.g. webkitTransform
	property = property.replace(/^(webkit|Moz|ms|O)/, '').charAt(0).toLowerCase() + property.slice(1);

	// camelCase property
	property = property.replace(/-(\w)/, function (match, group) {
		return group.toUpperCase();
	});

	// Iterate through prefixes array, testing for existence of property. module:ac-base.Element.getStyle runs on the first match.
	prefixes.some(function (prefix, index) {
		// Apply prefixes
		var prefixedCamelProp = (prefix === '') ? property : prefix + property.charAt(0).toUpperCase() + property.slice(1);

		if (prefixedCamelProp in element.style) {
			style = ac_Element.getStyle(element, prefixedCamelProp);
			return true;
		}
	});

	return style;
};

/**
 * Inserts nodes - Handles four insertion cases: before, after, first and last (default)
 * @param {Element} element The element to be inserted. Must be one of three nodeTypes - element, textNode, documentFragment
 * @param {Element} target The node to be used as the target in relation to placement of element.
 * @param {String} placement Optional; Where to insert the element in relation to the target.
 * <p><strong>Accepted values:</strong></p>
 * <dl>
 *     <dt>‘first’:</dt><dd>Inserts ‘element’ as the first child of ‘target’.</dd>
 *     <dt>‘before’:</dt><dd>Inserts ‘element’ immediately before ‘target’.</dd>
 *     <dt>‘after’:</dt><dd>Inserts ‘element’ immediately after ‘target’.</dd>
 *     <dt>Default behavior:</dt><dd>Appends ‘element’ as the last child of ‘target’.</dd>
 * </dl>
 * @name module:ac-base.Element.insert
 * @kind function
 */
ac_Element.insert = function (element, target, placement) {
	// Restrict node types passed: 1 = element, 3 = text node, 11 = document fragment
	if (!element || !(element.nodeType === 1 || element.nodeType === 3 || element.nodeType === 11)) {
		throw new TypeError('ac-base.Element.insert: element must be a valid node of type element, text, or document fragment');
	}
	if (!target || !(target.nodeType === 1 || target.nodeType === 11)) {
		throw new TypeError('ac-base.Element.insert: target must be a valid node of type element or document fragment');
	}

	// Placement is optional; defaults to ‘last’
	switch (placement) {
	case 'before':
		if (target.nodeType === 11) {
			throw new TypeError('ac-base.Element.insert: target cannot be nodeType of documentFragment when using placement ‘before’');
		}
		target.parentNode.insertBefore(element, target);
		break;
	case 'after':
		if (target.nodeType === 11) {
			throw new TypeError('ac-base.Element.insert: target cannot be nodeType of documentFragment when using placement ‘after’');
		}
		target.parentNode.insertBefore(element, target.nextSibling);
		break;
	case 'first':
		target.insertBefore(element, target.firstChild);
		break;
	default: //'last'
		target.appendChild(element);
	}
};

/**
 * Insert a node into a parent's children at a given index.
 * @param  {Element} element The element to be inserted.
 * @param  {Element} target The parent element in which the first element will be inserted to.
 * @param  {Number} index Zero-based index at which to insert the first element into the target.
 * @name module:ac-base.Element.insertAt
 * @kind function
 */
ac_Element.insertAt = function (element, target, index) {
	var children;
	var len;
	var i;

	element = ac_Element.getElementById(element);
	target = ac_Element.getElementById(target);

	if (!ac_Element.isElement(element) || !ac_Element.isElement(target)) {
		throw new TypeError('ac-base.Element.insertAt: element must be a valid DOM element');
	}

	children = ac_Element.children(target);

	// allow negative indices
	if (index < 0 && children.length) {
		index += children.length;
	}

	// take into account the case where we're inserting an element that's
	// already a child of the container
	if (target.contains(element) && index > children.indexOf(element)) {
		index++;
	}

	if (children && index <= children.length - 1) {
		for (i = 0, len = children.length; i < len; i++) {
			if (i === index) {
				target.insertBefore(element, children[i]);
				break;
			}
		}
	} else {
		// for incices larger than the largest index, append to end
		target.appendChild(element);
	}
};

/**
 * Returns an array of DOM elements (nodeType:3) that are direct children of element
 * @todo Cannot use Array.prototype.filter until removing "the other" script
 * @param   {Element} element Where to retrieve child elements from.
 * @returns {Element|null} an array of DOM elements, or null if none
 * @name module:ac-base.Element.children
 * @kind function
 */
ac_Element.children = function (element) {
	var _children, child;

	element = ac_Element.getElementById(element);

	if (!ac_Element.isElement(element)) {
		throw new TypeError('ac-base.Element.children: element must be a valid DOM element');
	}

	if (element.children) {
		_children = [];
		for (var i = 0, l = element.children.length; i < l; i++) {
			child = element.children[i];
			if (child && child.nodeType === 1) {
				_children.push(child);
			}
		}
	}

	return _children.length ? _children : null;
};

/**
 * Removes nodes. Will optionally retain a reference to the removed node.
 * @param {Element} element The element to be removed.
 * @param {Boolean} retainReference If true a reference to the removed element will be returned.
 * @name module:ac-base.Element.remove
 * @kind function
 */
ac_Element.remove = function (element, retainReference) {
	if (!ac_Element.isElement(element)) {
		throw new TypeError('ac-base.Element.remove: element must be a valid DOM element');
	}
	if (retainReference === true) {
		var removedNode = element.parentNode.removeChild(element);
		return removedNode;
	} else {
		element.parentNode.removeChild(element);
	}
};

/**
 * Determines the offset of the top/left of the element from the top/left of the viewport.
 * @param {Element} element
 * @returns {Object} x, y coordinates (px) of the top/left corner of the element relative to the top/left corner of the viewport.
 * @name module:ac-base.Element.viewportOffset
 * @kind function
 */
ac_Element.viewportOffset = function (element) {
	var offset = ac_Element.getBoundingBox(element);
	return { x: offset.left, y: offset.top };
};

/**
 * Determines the amount of the height of the element that is in view.
 * @param {Element} element
 * @returns {Integer} Number of pixels of the element that are currently within the viewport.
 * @name module:ac-base.Element.pixelsInViewport
 * @kind function
 */
ac_Element.pixelsInViewport = function (element, elementMetrics) {
	// Amount of the element that is visible inside of the viewport (px)
	var pixelsInView;

	if (!ac_Element.isElement(element)) {
		throw new TypeError('ac-base.Element.pixelsInViewport : element must be a valid DOM element');
	}

	// Get element and viewport metrics
	var viewportMetrics = ac_Viewport.dimensions();
	elementMetrics = elementMetrics || ac_Element.getBoundingBox(element);

	// Determine the offset from the top of the element relative to the top edge
	// of the viewport (px)
	var elementViewportOffsetY = elementMetrics.top;

	// If element is fully in view or cropped by bottom edge of viewport
	if (elementViewportOffsetY >= 0) {
		pixelsInView = viewportMetrics.height - elementViewportOffsetY;

		// If the bottom edge of element is in view and the top edge, then it
		// is fully in view
		if (pixelsInView > elementMetrics.height) {
			pixelsInView = elementMetrics.height;
		}

		// If element is cropped by top edge of viewport or is scrolled out of
		// view above top edge of viewport
	} else {
		pixelsInView = elementMetrics.height + elementViewportOffsetY;
	}

	// If the element is completely out of view past the bottom edge of
	// the viewport, then 0 px of it is in view
	if (pixelsInView < 0) {
		pixelsInView = 0;
	}

	if (pixelsInView > viewportMetrics.height){
		pixelsInView = viewportMetrics.height;
	}

	return pixelsInView;
};

/**
 * Determines the percentage of the height of the element that is in view.
 * @param {Element} element
 * @returns {Float} 0-1, Percentage of the element within the viewport.
 * @name module:ac-base.Element.percentInViewport
 * @kind function
 */
ac_Element.percentInViewport = function (element) {
	var elementMetrics = ac_Element.getBoundingBox(element);
	var pixelsInView = ac_Element.pixelsInViewport(element, elementMetrics);
	return pixelsInView / elementMetrics.height;
};

/**
 * @param {Element} element
 * @param {Float} percentageThreshold Optional. Default : 0, Range: [0, 1]
 * @returns {Boolean} Whether or not that element is visible on the page (within the viewport) past a certain threshold percentage.
 * @name module:ac-base.Element.isInViewport
 * @kind function
 */
ac_Element.isInViewport = function (element, percentageThreshold) {

	// Ensure that percentageThreshold is defined and within bounds.
	if (typeof percentageThreshold !== "number" || 1 < percentageThreshold || percentageThreshold < 0){
		percentageThreshold = 0;
	}

	var percentInViewport = ac_Element.percentInViewport(element);
	return (percentInViewport > percentageThreshold || percentInViewport === 1);
};

var eachAncestor = function (element, handler) {
	element = ac_Element.getElementById(element);
	var ancestor = element.parentNode;

	while (ancestor && ac_Element.isElement(ancestor)) {
		if (typeof handler === 'function') {

			// If the handler returns false
			// break out of the loop
			if (handler(ancestor) === false) {
				break;
			}

		}

		// if we aren’t at document.body yet
		// keep moving up
		if (ancestor !== document.body) {
			ancestor = ancestor.parentNode;

		} else {
			// stop on document.body
			ancestor = null;
		}
	}
};

/**
 * Returns an array of ancestors for an element.
 * @param {Element} element The element to return an ancestor of
 * @param {Boolean} cssSelector If specified, will filter ancestors based on selector
 * @returns {Array} array of elements
 * @name module:ac-base.Element.ancestors
 * @kind function
 */
ac_Element.ancestors = function (element, cssSelector) {
	var elements = [];

	// iterate over ancestors and add to elements array
	eachAncestor(element, function (ancestor) {
		// add to elements array if cssSelector is not defined or if cssSelector matches the element
		if (cssSelector === undefined || ac_Element.matchesSelector(ancestor, cssSelector)) {
			elements.push(ancestor);
		}
	});

	return elements;
};

/**
 * Returns first matching ancestor for an element.
 * If no <code>cssSelector</code> is specified, returns <code>parentNode</code>, as if <code>cssSelector</code> were ‘*’.
 * @param {Element} element The element to return ancestors
 * @param {Boolean} cssSelector If specified, will return first ancestor that matches selector
 * @returns First matched element or null if no match
 * @name module:ac-base.Element.ancestor
 * @kind function
 */
ac_Element.ancestor = function (element, cssSelector) {
	element = ac_Element.getElementById(element);
	var firstMatch = null;

	if (element !== null && cssSelector === undefined) {
		return element.parentNode;
	}

	// iterate over all ancestors and return the first match
	eachAncestor(element, function (ancestor) {
		if (ac_Element.matchesSelector(ancestor, cssSelector)) {
			firstMatch = ancestor;
			return false;
		}
	});

	return firstMatch;
};

/**
 * Sets all the appropriate vendor prefixed transform properties to {{{transformFunctions}}} on {{{element}}}.
 * If the 3D version of the transform is available it will set that in favor of the 2D transform.
 * @param {Element} element : the element for which to set the style upon
 * @param {String|Object} transformFunctions : the value for which to set the element's transform property. As a string
 * it takes the form of <code>[transformFunction]([parameters])</code>. As an object, pass the
 * <code>[transformFunctions]</code> as the key and the <code>[parameters]</code> as string to the key's value.
 * @name module:ac-base.Element.setVendorPrefixTransform
 * @kind function
 */
ac_Element.setVendorPrefixTransform = function (element, transformFunctions) {
	if ((typeof transformFunctions !== 'string' && typeof transformFunctions !== 'object') || Array.isArray(transformFunctions) || transformFunctions === null) {
		throw new TypeError('ac-base.Element.setVendorPrefixTransform: transformFunctions argument must be either an object or a string');
	}

	ac_Element.setVendorPrefixStyle(element, 'transform', vendorTransformHelper.convert2dFunctions(transformFunctions));
};

if (ac_Environment_Browser.name === "IE") {
	require('./shims/ie/Element')(ac_Element, ac_Environment_Browser);
}

module.exports = ac_Element;

},{"./Element/EventDelegate":6,"./Element/events":7,"./Element/vendorTransformHelper":8,"./Environment/Browser":9,"./Viewport":14,"./log":15,"./shims/ie/Element":17}],"ac-element":[function(require,module,exports){
module.exports=require('j0qjr8');
},{}],6:[function(require,module,exports){
'use strict';

module.exports = function (ac_Element) {
	/**
	 * EventDelegate handles intercepting the event bubble and firing
	 * a handler when the event target matches its css selector
	 * @param {Element} element
	 * @param {Object} options
	 * @name module:ac-base.Element~EventDelegate
	 * @kind class
	 */
	function EventDelegate(element, options) {
		this.element = element;
		this.options = options || {};
	}

	EventDelegate.prototype = /** @lends module:ac-base.Element~EventDelegate# */ {
		/**
		 * Finds if a passed element matches the object's css selector, or if it is a descendant
		 * of an element that matches the selector
		 * @param {Element} element that will be matched against a css selector or whose ancestors will be checked
		 * @ignore
		 */
		__findMatchingTarget: function (eventTarget) {
			var delegateTarget = null;

			if (ac_Element.matchesSelector(eventTarget, this.options.selector)) {
				delegateTarget = eventTarget;

			} else {
				delegateTarget = ac_Element.ancestor(eventTarget, this.options.selector);

			}
			return delegateTarget;
		},
		/**
		 * Generates a method that will actually be attached as a dom event listener
		 * @ignore
		 */
		__generateDelegateMethod: function () {
			var self = this;
			var handler = self.options.handler;

			return function (evt) {
				var eventTarget = evt.target || evt.srcElement;
				var delegateTarget = self.__findMatchingTarget(eventTarget);
				var delegateEvent;

				if (delegateTarget !== null) {
					delegateEvent = new EventDelegate.Event(evt);
					delegateEvent.setTarget(delegateTarget);

					handler(delegateEvent);
				}
			};
		},
		/**
		 * Attaches the result of __generateDelegateMethod as an event listener
		 * @name EventDelegate.prototype.attachEventListener
		 * @returns {Function} Generated method that is attached as a DOM listener
		 */
		attachEventListener: function () {
			this.__delegateMethod = this.__generateDelegateMethod();
			ac_Element.addEventListener(this.element, this.options.eventType, this.__delegateMethod);
			return this.__delegateMethod;
		},
		/**
		 * Removes event listener
		 */
		unbind: function () {
			ac_Element.removeEventListener(this.element, this.options.eventType, this.__delegateMethod);
			this.__delegateMethod = undefined;
		}
	};

	/**
	 * Holds all instances of EventDelegate
	 * @type {Array.<module:ac-base.Element~EventDelegate>}
	 * @memberof module:ac-base.Element~EventDelegate
	 */
	EventDelegate.instances = [];

	/**
	 * Iterates through all instances in EventDelegate.instances and fires passed function for each instance
	 * @param {Function} filterMethod Function used to filter results
	 * @name module:ac-base.Element~EventDelegate.filterInstances
	 * @returns {Array.<module:ac-base.Element~EventDelegate>} Array of event delegates where filter method returned true
	 */
	EventDelegate.filterInstances = function (filterMethod) {
		var matches = [];

		EventDelegate.instances.forEach(function (eventDelegate) {
			if (filterMethod(eventDelegate) === true) {
				matches.push(eventDelegate);
			}
		});

		return matches;
	};

	/**
	 * Event type that gets passed to delegate handlers
	 * @constructor
	 * @param {evt} Native DOM Event
	 * @name module:ac-base.Element~EventDelegate~Event
	 */
	EventDelegate.Event = function (evt) {
		this.originalEvent = evt;
	};

	/**
	 * Sets the target element for the instance
	 * @param {Element} DOM Element
	 * @name module:ac-base.Element~EventDelegate~Event#setTarget
	 */
	EventDelegate.Event.prototype.setTarget = function (target) {
		this.target = target;
		this.currentTarget = target;
	};

	/**
	 * Creates an event delegate and attaches it to an element
	 * @param {Element} DOM Element
	 * @param {String} Type of event to listen for (eg, 'click', 'keyup', etc)
	 * @param {String} CSS Selector to filter targets against
	 * @param {Function} Function to be fired for the event
	 * @name module:ac-base.Element.addEventDelegate
	 * @name module:ac-base.Element.addEventDelegate
	 * @kind function
	 */
	ac_Element.addEventDelegate = function (element, eventType, selector, handler) {
		var eventDelegate = new ac_Element.__EventDelegate(element, {
			eventType:eventType,
			selector:selector,
			handler:handler
		});

		EventDelegate.instances.push(eventDelegate);

		return eventDelegate.attachEventListener();
	};

	/**
	 * Removes an event delegate from an element
	 * @param {Element} DOM Element
	 * @param {String} Type of event to listen for (eg, 'click', 'keyup', etc)
	 * @param {String} CSS Selector to filter targets against
	 * @param {Function} Function to be fired for the event
	 * @name module:ac-base.Element.removeEventDelegate
	 * @kind function
	 */
	ac_Element.removeEventDelegate = function (element, eventType, selector, handler) {
		var eventDelegates = ac_Element.__EventDelegate.filterInstances(function (eventDelegate) {
			var options = eventDelegate.options;

			return eventDelegate.element === element && options.selector === selector && options.eventType === eventType && options.handler === handler;
		});

		eventDelegates.forEach(function (eventDelegate) {
			eventDelegate.unbind();
		});
	};

	ac_Element.__EventDelegate = EventDelegate;
};

},{}],7:[function(require,module,exports){
'use strict';

var events = {};

/**
 * Cross-browser event handling
 * @param {Element} target Element to listen for event on
 * @param {string} type
 * @param {function} listener
 * @param {boolean} [useCapture=false]
 * @returns target
 * @name module:ac-base.Element.addEventListener
 * @kind function
 */
events.addEventListener = function (target, type, listener, useCapture) {
	if (target.addEventListener) {
		target.addEventListener(type, listener, useCapture);
	} else if (target.attachEvent) {
		target.attachEvent('on' + type, listener);
	} else {
		target['on' + type] = listener;
	}
	return target;
};

/**
 * Cross-browser event dispatch
 * @param  {Element} target Element that will dispatch the event
 * @param  {String} type   The name of the event to fire
 * @return {Element}       target
 * @name module:ac-base.Element.dispatchEvent
 * @kind function
 */
events.dispatchEvent = function (target, type) {
	if (document.createEvent) {
		target.dispatchEvent(new CustomEvent(type));
	} else {
		target.fireEvent('on' + type, document.createEventObject());
	}
	return target;
};

/**
 * Cross-browser event removing
 * @param {Element} target Element to listen for event on
 * @param {string} type
 * @param {function} listener
 * @param {boolean} [useCapture=false]
 * @returns target
 * @name module:ac-base.Element.removeEventListener
 * @kind function
 */
events.removeEventListener = function (target, type, listener, useCapture) {
	if (target.removeEventListener) {
		target.removeEventListener(type, listener, useCapture);
	} else {
		target.detachEvent('on' + type, listener);
	}
	return target;
};

/**
 * Sets all the vendor event listeners of type on element.
 * @param {Element} element : the element for which to set the listener upon
 * @param {String} type : a string representing the event type to listen for, e.g. animationEnd, webkitAnimationEnd, etc... IMPORTANT: This value is expected to be a string in camelCase.
 * @param {Function} listener : the object that receives a notification when an event of the specified type occurs.
 * @param {Boolean} useCapture : If true, useCapture indicates that the user wishes to initiate capture.
 * @returns target
 * @name module:ac-base.Element.addVendorPrefixEventListener
 * @kind function
 */
events.addVendorPrefixEventListener = function (element, type, listener, useCapture) {
	if (type.match(/^webkit/i)) {
		type = type.replace(/^webkit/i, '');
	} else if (type.match(/^moz/i)) {
		type = type.replace(/^moz/i, '');
	} else if (type.match(/^ms/i)) {
		type = type.replace(/^ms/i, '');
	} else if (type.match(/^o/i)) {
		type = type.replace(/^o/i, '');
	} else {
		type = type.charAt(0).toUpperCase() + type.slice(1);
	}

	// To avoid adding the same event twice, we need to sniff the user agent.
	// Once we've confirmed a browser supports the generic event name, we'll
	// change this if to be < that build.
	if (/WebKit/i.test(window.navigator.userAgent)) {
		return events.addEventListener(element, 'webkit' + type, listener, useCapture);
	} else if (/Opera/i.test(window.navigator.userAgent)) {
		return events.addEventListener(element, 'O' + type, listener, useCapture);
	} else if (/Gecko/i.test(window.navigator.userAgent)) {
		return events.addEventListener(element, type.toLowerCase(), listener, useCapture);
	} else {
		type = type.charAt(0).toLowerCase() + type.slice(1);
		return events.addEventListener(element, type, listener, useCapture);
	}
};

/**
 * Removes all the vendor event listeners of type on an element.
 * @param {Element} element : the element for which to remove the listener from
 * @param {String} type : a string representing the event type to listen for, e.g. animationEnd, webkitAnimationEnd, etc... IMPORTANT: This value is expected to be a string in camelCase.
 * @param {Function} listener : the object that receives a notification when an event of the specified type occurs.
 * @param {Boolean} useCapture : If true, useCapture indicates that the user wishes to initiate capture.
 * @name module:ac-base.Element.removeVendorPrefixEventListener
 * @kind function
 */
events.removeVendorPrefixEventListener = function (element, type, listener, useCapture) {
	if (type.match(/^webkit/i)) {
		type = type.replace(/^webkit/i, '');
	} else if (type.match(/^moz/i)) {
		type = type.replace(/^moz/i, '');
	} else if (type.match(/^ms/i)) {
		type = type.replace(/^ms/i, '');
	} else if (type.match(/^o/i)) {
		type = type.replace(/^o/i, '');
	} else {
		type = type.charAt(0).toUpperCase() + type.slice(1);
	}

	events.removeEventListener(element, 'webkit' + type, listener, useCapture);
	events.removeEventListener(element, 'O' + type, listener, useCapture);
	events.removeEventListener(element, type.toLowerCase(), listener, useCapture);

	type = type.charAt(0).toLowerCase() + type.slice(1);
	return events.removeEventListener(element, type, listener, useCapture);
};

module.exports = events;

},{}],8:[function(require,module,exports){
'use strict';

/*
 * A static helper object that handles the work for module:ac-base.Element.setVendorPrefixTransform.
 * Functionality is abstracted out into this helper object in order to break it up into manageable chunks
 * and also to enable testing of the code that would otherwise be unreachable by the test suites.
 */
/** @ignore */
var vendorTransformHelper = {

	__objectifiedFunctions: {},

	/*
		The paramMaps are used as templates for mapping 2D transform function parameters into
		their equivalent 3D function counterparts. 'p1', 'p2', etc. are replacement tokens that
		correspond to the 2D function parameters. p1 is the first 2D parameter, p2 is the second and so on.
	*/
	__paramMaps: {
		translate: 'p1, p2, 0',
		translateX: 'p1, 0, 0',
		translateY: '0, p1, 0',
		scale: 'p1, p2, 1',
		scaleX: 'p1, 1, 1',
		scaleY: '1, p1, 1',
		rotate: '0, 0, 1, p1',
		matrix: 'p1, p2, 0, 0, p3, p4, 0, 0, 0, 0, 1, 0, p5, p6, 0, 1'
	},

	/*
		@param {String|Object} functions2d A space separated string of transform functions, or an object
		with function names as the keys and a string of comma separataed parameters as the values.
		@returns {String} A space separated list of transform functions with any eligible 2D functions
		mapped to their 3D counterparts.
	*/
	convert2dFunctions: function (functions2d) {
		var values;

		this.__init(functions2d);
		// loop through functions & replace 2d function with 3d function where available
		for (var func in this.__objectifiedFunctions) {
			if (this.__objectifiedFunctions.hasOwnProperty(func)) {
				values = this.__objectifiedFunctions[func].replace(' ', '').split(',');
				if (func in this.__paramMaps) {
					for (var map in this.__paramMaps) {
						if (func === map) {
							this.valuesToSet.push(this.__stripFunctionAxis(func) + '3d(' + this.__map2DTransformParams(values, this.__paramMaps[func]) + ')');
						}
					}
				} else {
					this.valuesToSet.push(func + '(' + this.__objectifiedFunctions[func] + ')');
				}
			}
		}
		return this.valuesToSet.join(' ');
	},

	/*
		Handles some light house cleaning - resetting properties.
		Expects to receive the functions2d parameter from convert2dFunctions and fills the
		_objectifiedFunctions property with key/value pairs from this string or object.
		@param {String|Object} functions2d A space separated string of transform functions, or an object
		with function names as the keys and a string of comma separataed parameters as the values.
		@returns {undefined}
	*/
	__init: function (functions2d) {
		this.valuesToSet = [];
		this.__objectifiedFunctions = (typeof functions2d === 'object') ? functions2d : {};
		if (typeof functions2d === 'string') {
			this.__objectifiedFunctions = this.__objectifyFunctionString(functions2d);
		}
	},

	/*
		@param {Array} params2d Array containing all the parameters from a transform function as
		individual members.
		@param {String} template3d One of the parameter maps from the __paramMaps object.
		@returns {String} The template3d parameter with the 2D function values mapped into it.
	*/
	__map2DTransformParams: function (params2d, template3d) {
		params2d.forEach(function (val, i) {
			template3d = template3d.replace('p' + (i + 1), val);
		});
		return template3d;
	},

	/*
		Splits a space separated string of transform functions into an array with each
		function as a member.
		@param {String} functionString A space separated string of transform functions
		@returns {Array} An array with each function from the string as a member
	*/
	__splitFunctionStringToArray: function (functionString) {
		return functionString.match(/[\w]+\(.+?\)/g);
	},

	/*
		Takes a single transform function as a string and splits its name and parameters into an array.
		@param {String} functionString
		@returns {Array} The resulting array from a match() method. The entire functionString
		will be the first member with the function name and the parameters populating the
		second and third members respectively.
	*/
	__splitFunctionNameAndParams: function (functionString) {
		return functionString.match(/(.*)\((.*)\)/);
	},

	/*
		Strips the X or Y axis off the end of a transform function.
		@param {String} func A transform function name that specifies an X or Y axis at the end
		@returns {String} The function with the axis removed
	*/
	__stripFunctionAxis: function (func) {
		return func.match(/([a-z]+)(|X|Y)$/)[1];
	},

	/*
		Splits a string of transform functions into an object consisting of the function
		names as the keys and the parameters as their respective values.
		@param {String} functionString A space separated string of transform functions
		@returns {Object} An object filled with keys as function names and values as their
		respective parameters
	*/
	__objectifyFunctionString: function (functionString) {
		var self = this;
		var splitMember;
		this.__splitFunctionStringToArray(functionString).forEach(function (member) {
			splitMember = self.__splitFunctionNameAndParams(member);
			self.__objectifiedFunctions[splitMember[1]] = splitMember[2];
		});
		return this.__objectifiedFunctions;
	}
};

module.exports = vendorTransformHelper;

},{}],9:[function(require,module,exports){
'use strict';

var BrowserData = require('./Browser/BrowserData');

/**
	@namespace
	@name module:ac-base.Environment.Browser

	@description
	Reports information about the user's browser and device based on the userAgent string and feature detection.

	<br /><br />

	<h2>Immutable Properties</h2>
	<ul>
		<li>
			<h3><em class="light fixedFont">{String}</em> name</h3>
			<p>The name of the browser</p>
		</li>
		<li>
			<h3><em class="light fixedFont">{Float}</em> version</h3>
			<p>The version of the browser</p>
		</li>
		<li>
			<h3><em class="light fixedFont">{String}</em> os</h3>
			<p>The Operating System (No version)</p>
		</li>
		<li>
			<h3><em class="light fixedFont">{String}</em> osVersion</h3>
			<p>The Operating System Version</p>
		</li>
		<li>
			<h3><em class="light fixedFont">{String}</em> lowerCaseUserAgent</h3>
			<p>The userAgent string converted to lower case.</p>
		</li>
	</ul>

	@reference http://www.quirksmode.org/js/detect.html
*/

var ac_Environment_Browser = BrowserData.create();

/**
 * Returns true/false whether the browser is WebKit based
 * @param  {String}  userAgentString
 * @return {Boolean}
 */
ac_Environment_Browser.isWebKit = function(userAgentString) {
	var userAgent = userAgentString || window.navigator.userAgent;
	return userAgent ? !! userAgent.match(/applewebkit/i) : false;
};

/**
 * @type {String}
 */
ac_Environment_Browser.lowerCaseUserAgent = navigator.userAgent.toLowerCase();

if (ac_Environment_Browser.name === "IE") {
	require('../shims/ie/Environment/Browser')(ac_Environment_Browser);
}


module.exports = ac_Environment_Browser;

},{"../shims/ie/Environment/Browser":18,"./Browser/BrowserData":10}],10:[function(require,module,exports){
'use strict';

var _data = require('./data');
var ac_RegExp = require('../../RegExp');

function BrowserData() { }

BrowserData.prototype = {
	/**
	 * Parses string (such as userAgent) and returns the browser version
	 * @param  {String} stringToSearch
	 * @return {Number}
	 * @ignore
	 */
	__getBrowserVersion: function(stringToSearch, identity) {

		if (!stringToSearch || !identity) {
			return;
		}

		// Filters data.browser for the member with a identity equal to identity
		var filteredData = _data.browser.filter(function(item) {
			return item.identity === identity;
		})[0];

		var versionSearchString = filteredData.versionSearch || identity;
		var index = stringToSearch.indexOf(versionSearchString);

		if (index > -1) {
			return parseFloat(stringToSearch.substring(index + versionSearchString.length + 1));
		}
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} browserData | Expects data.browser
	 * @return {String}
	 * @ignore
	 */
	__getName: function(dataBrowser) {
		return this.__getIdentityStringFromArray(dataBrowser);
	},

	/**
	 * Expects single member of data.browser or data.os
	 * and returns a string to be used in os or name.
	 * @param  {Object} item
	 * @return {String}
	 * @ignore
	 */
	__getIdentity: function(item) {
		if (item.string) {
			return this.__matchSubString(item);
		} else if (item.prop) {
			return item.identity;
		}
	},

	/**
	 * Iterates through data.browser or data.os returning the correct
	 * browser or os identity
	 * @param  {Array} dataArray
	 * @return {String}
	 * @ignore
	 */
	__getIdentityStringFromArray: function(dataArray) {
		for (var i = 0, l = dataArray.length, identity; i < l; i++) {
			identity = this.__getIdentity(dataArray[i]);
			if (identity) {
				return identity;
			}
		}
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} OSData | Expects data.os
	 * @return {String}
	 * @ignore
	 */
	__getOS: function(dataOS) {
		return this.__getIdentityStringFromArray(dataOS);
	},

	/**
	 * Parses string (such as userAgent) and returns the operating system version
	 * @param {String} stringToSearch
	 * @param {String} osIdentity
	 * @return {String|Number} int if not a decimal delimited version
	 * @ignore
	 */
	__getOSVersion: function(stringToSearch, osIdentity) {

		if (!stringToSearch || !osIdentity) {
			return;
		}

		// Filters data.os returning the member with an identity equal to osIdentity
		var filteredData = _data.os.filter(function(item) {
			return item.identity === osIdentity;
		})[0];

		var versionSearchString = filteredData.versionSearch || osIdentity;
		var regex = new RegExp(versionSearchString + ' ([\\d_\\.]+)', 'i');
		var version = stringToSearch.match(regex);

		if (version !== null) {
			return version[1].replace(/_/g, '.');
		}
	},

	/**
	 * Regular expression and indexOf against item.string using item.subString as the pattern
	 * @param  {Object} item
	 * @return {String}
	 * @ignore
	 */
	__matchSubString: function(item) {
		var subString = item.subString;
		var matches;
		if (subString) {
			matches = ac_RegExp.isRegExp(subString) && !! item.string.match(subString);
			if (matches || item.string.indexOf(subString) > -1) {
				return item.identity;
			}
		}
	}
};

BrowserData.create = function () {
	var instance = new BrowserData();
	var out = {};
	out.name      = instance.__getName(_data.browser);
	out.version   = instance.__getBrowserVersion(_data.versionString, out.name);
	out.os        = instance.__getOS(_data.os);
	out.osVersion = instance.__getOSVersion(_data.versionString, out.os);
	return out;
};

module.exports = BrowserData;

},{"../../RegExp":13,"./data":11}],11:[function(require,module,exports){
'use strict';

module.exports = {
	// Used to test getName
	browser: [
		{
			string: window.navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{
			string: window.navigator.userAgent,
			subString: /silk/i,
			identity: "Silk"
		},
		{
			string: window.navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: window.navigator.userAgent,
			subString: /mobile\/[^\s]*\ssafari\//i,
			identity: "Safari Mobile",
			versionSearch: "Version"
		},
		{
			string: window.navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: window.navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: window.navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: window.navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: window.navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{ // for newer Netscapes (6+)
			string: window.navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		// IE < 11
		{
			string: window.navigator.userAgent,
			subString: "MSIE",
			identity: "IE",
			versionSearch: "MSIE"
		},
		// IE >= 11
		{
			string: window.navigator.userAgent,
			subString: "Trident",
			identity: "IE",
			versionSearch: "rv"
		},
		{
			string: window.navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ // for older Netscapes (4-)
			string: window.navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	// Used to test getOS
	os: [
		{
			string: window.navigator.platform,
			subString: "Win",
			identity: "Windows",
			versionSearch: "Windows NT"
		},
		{
			string: window.navigator.platform,
			subString: "Mac",
			identity: "OS X"
		},
		{
			string: window.navigator.userAgent,
			subString: "iPhone",
			identity: "iOS",
			versionSearch: "iPhone OS"
		},
		{
			string: window.navigator.userAgent,
			subString: "iPad",
			identity: "iOS",
			versionSearch: "CPU OS"
		},
		{
			string: window.navigator.userAgent,
			subString: /android/i,
			identity: "Android"
		},
		{
			string: window.navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	],
	// Used to test version and osVersion
	versionString: window.navigator.userAgent || window.navigator.appVersion || undefined
};

},{}],12:[function(require,module,exports){
'use strict';

var isAvailable = null;

/**
 * Returns whether the browser supports HTML5 localStorage, and
 * does not have privacy mode enabled or cookies turned off.
 * NOTE: Does not support Firefox <= 13 because of a bug where Firefox interprets a nonexistent item as null instead of undefined
 * @returns {Boolean} true if the browser supports localStorage
 * @name module:ac-base.Environment.Feature.localStorageAvailable
 * @kind function
 */
module.exports = function localStorageAvailable() {
	// Memoize previously returned value
	if (isAvailable === null) {
		isAvailable = !!(window.localStorage && window.localStorage.non_existent !== null);
	}
	return isAvailable;
};

},{}],13:[function(require,module,exports){
'use strict';

/**
 * @name module:ac-base.RegExp
 * @kind namespace
 */
var ac_RegExp = {};

/**
 * @param {Object} obj Object to test whether or not it is a Regular Expression
 * @name module:ac-base.RegExp.isRegExp
 * @kind function
 */
ac_RegExp.isRegExp = function (obj) {
	return window.RegExp ? obj instanceof RegExp : false;
};

module.exports = ac_RegExp;

},{}],14:[function(require,module,exports){
'use strict';

/**
 * @name module:ac-base.Viewport
 * @kind namespace
 */
var ac_Viewport = {};

/**
 * @returns {Object} Left scroll offset as x, top scroll offset as y.
 * @name module:ac-base.Viewport.scrollOffsets
 * @kind function
 */
ac_Viewport.scrollOffsets = function () {
	return {
		x: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
		y: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
	};
};

/**
 * @returns {Object} Returns window width and height (px).
 * @name module:ac-base.Viewport.dimensions
 * @kind function
 */
ac_Viewport.dimensions = function () {
	return {
		height: window.innerHeight || document.documentElement.clientHeight,
		width: window.innerWidth || document.documentElement.clientWidth
	};
};

module.exports = ac_Viewport;

},{}],15:[function(require,module,exports){
'use strict';

var localStorageAvailable = require('./Environment/Feature/localStorageAvailable');
var debugMessagingKey = 'f7c9180f-5c45-47b4-8de4-428015f096c0';
var allowDebugMessaging = (localStorageAvailable() && !!window.localStorage.getItem(debugMessagingKey));

/**
 * If there’s a console, print a message.
 * @param {String} message Error string to print.
 * @name module:ac-base.log
 * @kind function
 */
module.exports = function ac_log(message) {
	if (window.console && typeof console.log === 'function' && allowDebugMessaging) {
		console.log(message);
	}
};

},{"./Environment/Feature/localStorageAvailable":12}],16:[function(require,module,exports){
'use strict';

module.exports = function (ac_Array, ac_Environment_Browser) {

	/**
	 * Decorate module:ac-base.Array.toArray for < IE8
	 * The original method returns Array.prototype.slice.call(arrayLike);
	 * The Array.prototype.slice method throws an exception when used with
	 * nodelists and similar host objects in < IE8.
	 * We have to hold IE's hand here to manually produce the array.
	 */
	if (ac_Environment_Browser.IE.documentMode <= 8) {
		ac_Array.toArray = function (arrayLike) {
			var array = [];
			var len = arrayLike.length;
			var i;

			if (len > 0) {
				for (i = 0; i < len; i += 1) {
					array.push(arrayLike[i]);
				}
			}
			return array;
		};
	}
};

},{}],17:[function(require,module,exports){
'use strict';

var ac_Array = require('../../Array');
var ac_sizzle = require('../../vendor/Sizzle');

module.exports = function(ac_Element, ac_Environment_Browser, sizzle) {

	var documentMode = ac_Environment_Browser.IE.documentMode;

	sizzle = sizzle || ac_sizzle;

	if (documentMode < 8) {
		/**
		 * module:ac-base.Element.selectAll shim for IE < 8
		 * Fallback to sizzle needed due to lack of native querySelectorAll
		 */
		ac_Element.selectAll = function (selector, context) {
			if (typeof context === 'undefined') {
				context = document;
			} else if (!ac_Element.isElement(context) && context.nodeType !== 9 && context.nodeType !== 11) {
				throw new TypeError('ac-base.Element.selectAll: Invalid context nodeType');
			}
			if (typeof selector !== 'string') {
				throw new TypeError('ac-base.Element.selectAll: Selector must be a string');
			}

			// if context is document fragment
			if (context.nodeType === 11) {
				var matches = [];
				var childMatches;
				ac_Array.toArray(context.childNodes).forEach(function (node) {
					// check the child node
					if (sizzle.matchesSelector(node, selector)) {
						matches.push(node);
					}
					// check the child node's children
					if (childMatches = sizzle(selector, node).length > 0) {
						matches.concat(childMatches);
					}
				});
				return matches;
			}
			return sizzle(selector, context);
		};

	} else if (documentMode < 9) {
		/**
		 * module:ac-base.Element.selectAll shim for IE 8
		 * Use native querySelectorAll but convert to array with shim
		 */
		ac_Element.selectAll = function (selector, context) {
			if (typeof context === 'undefined') {
				context = document;
			} else if (!ac_Element.isElement(context) && context.nodeType !== 9 && context.nodeType !== 11) {
				throw new TypeError('ac-base.Element.selectAll: Invalid context nodeType');
			}
			if (typeof selector !== 'string') {
				throw new TypeError('ac-base.Element.selectAll: Selector must be a string');
			}
			return ac_Array.toArray(context.querySelectorAll(selector));
		};
	}

	/**
	 * module:ac-base.Element.select shim for IE < 8
	 * Fallback to sizzle needed due to lack of native querySelectorAll
	 */
	if (documentMode < 8) {
		ac_Element.select = function (selector, context) {
			if (typeof context === 'undefined') {
				context = document;
			} else if (!ac_Element.isElement(context) && context.nodeType !== 9 && context.nodeType !== 11) {
				throw new TypeError('ac-base.Element.select: Invalid context nodeType');
			}
			if (typeof selector !== 'string') {
				throw new TypeError('ac-base.Element.select: Selector must be a string');
			}
			// if context is document fragment
			if (context.nodeType === 11) {
				var match = [];
				var childMatches;
				ac_Array.toArray(context.childNodes).some(function (node) {
					// if the child node matches, return that, else look for a match in its children
					if (sizzle.matchesSelector(node, selector)) {
						match = node;
						return true;
					} else if (childMatches = sizzle(selector, node).length > 0) {
						match = childMatches[0];
						return true;
					}
				});
				return match;
			}
			return sizzle(selector, context)[0];
		};
	}

	/**
	 * IE 9 and below account for the absence of Element.prototype.matches
	 * and/or Element.prototype.msMatchesSelector.
	 */
	if (documentMode < 9) {

		ac_Element.matchesSelector = function (element, selector) {
			return sizzle.matchesSelector(element, selector);
		};

		ac_Element.filterBySelector = function (elements, selector) {
			return sizzle.matches(selector, elements);
		};
	}

	/**
	 * IE 8 and below getStyle shim accounts for the absence of getComputedStyle as well as IE's
	 * currentStyle object's lack of support for background, font and border css shorthand props.
	 */
	if (documentMode < 9 && typeof window.getComputedStyle !== 'function') {
		ac_Element.getStyle = function (element, style, css) {
			element = ac_Element.getElementById(element);
			var alphaFilter;
			var value;

			css = css || element.currentStyle;
			if (css) {
				style = style.replace(/-(\w)/g, ac_Element.setStyle.__camelCaseReplace);

				// IE's currentStyle uses styleFloat instead of float
				style = style === 'float' ? 'styleFloat' : style;

				// Handle opacity
				if (style === 'opacity') {
					alphaFilter = element.filters['DXImageTransform.Microsoft.Alpha'] || element.filters.Alpha;
					if (alphaFilter) {
						return parseFloat(alphaFilter.Opacity / 100);
					}
					return 1.0;
				}

				value = css[style] || null;
				return value === 'auto' ? null : value;
			}
		};
	}

	/**
	 * Shimming the __setStyle private method of module:ac-base.Element.setStyle. IE requires opacity to be
	 * set via the proprietary IE filters. The shimmed __setStyle method calls on the IE only
	 * private method module:ac-base.Element.setStyle.__setOpacity to handle this task. If the style being
	 * set is not opacity, __setStyle defers back to an original stashed version of __setStyle
	 * to handle the task. Referred to here as module:ac-base.Element.setStyle.__superSetStyle.
	 */
	if (documentMode <= 8) {

		ac_Element.setStyle.__superSetStyle = ac_Element.setStyle.__setStyle;

		ac_Element.setStyle.__setStyle = function (element, camelCaseProp, stylesObj, stylesValue) {
			if (camelCaseProp === 'opacity') {
				ac_Element.setStyle.__setOpacity(element, stylesValue);
			// else do it the easy way
			} else {
				ac_Element.setStyle.__superSetStyle(element, camelCaseProp, stylesObj, stylesValue);
			}
		};

		ac_Element.setStyle.__setOpacity = function (element, value) {
			value = (value > 1) ? 1 : ((value < 0.00001) ? 0 : value) * 100;
			var alphaFilter = element.filters['DXImageTransform.Microsoft.Alpha'] || element.filters.Alpha;

			if (alphaFilter) {
				// Favor modifying existing filters via the filters collection if already set.
				alphaFilter.Opacity = value;
			} else {
				// Don't clobber existing filter string if any
				element.style.filter += ' progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value + ')';
			}
		};
	}

	/**
	 * Rudimentary shim for getBoundingClientRect in IE < 8.
	 * getBoundingClientRect is available in IE8 even with documentMode as IE7.
	 * It is not available in vanilla IE7.
	 */
	if (ac_Environment_Browser.version < 8) {
		ac_Element.getBoundingBox = function (element) {
			element = ac_Element.getElementById(element);
			var left = element.offsetLeft;
			var top = element.offsetTop;
			var w = element.offsetWidth;
			var h = element.offsetHeight;
			return {
				top: top,
				right: left + w,
				bottom: top + h,
				left: left,
				width: w,
				height: h
			};
		};
	}
};

},{"../../Array":3,"../../vendor/Sizzle":19}],18:[function(require,module,exports){
'use strict';

module.exports = function(ac_Environment_Browser) {

	/**
	* Function to detect what version or document/standards mode IE is rendering the page as.
	* Accounts for later versions of IE rendering pages in earlier standards modes. E.G. it is
	* possible to set the X-UA-Compatible tag to tell IE9 to render pages in IE7 standards mode.
	*
	* Based on Microsoft test
	* @see http://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx
	*/
	function __getIEDocumentMode() {
		var ie;

		// IE8 or later
		if (document.documentMode) {
			ie = parseInt(document.documentMode, 10);
		// IE 5-7
		} else {
			// Assume quirks mode unless proven otherwise
			ie = 5;
			if (document.compatMode) {
				// standards mode
				if (document.compatMode === "CSS1Compat") {
					ie = 7;
				}
			}
			// There is no test for IE6 standards mode because that mode
			// was replaced by IE7 standards mode; there is no emulation.
		}

		return ie;
	}

	ac_Environment_Browser.IE = {
		documentMode: __getIEDocumentMode()
	};
};

},{}],19:[function(require,module,exports){
/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2012, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
/* istanbul ignore next */
(function( window, undefined ) {

var cachedruns,
	dirruns,
	sortOrder,
	siblingCheck,
	assertGetIdNotName,

	document = window.document,
	docElem = document.documentElement,

	strundefined = "undefined",
	hasDuplicate = false,
	baseHasDuplicate = true,
	done = 0,
	slice = [].slice,
	push = [].push,

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])",

	// Loosely modeled on Javascript identifier characters
	identifier = "(?:[\\w#_-]|[^\\x00-\\xa0]|\\\\.)",
	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + "+)" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + "+)|)|)" + whitespace + "*\\]",
	pseudos = ":(" + characterEncoding + "+)(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|(.*))\\)|)",
	pos = ":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)",
	combinators = whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*",
	groups = "(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|" + attributes + "|" + pseudos.replace( 2, 7 ) + "|[^\\\\(),])+",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcombinators = new RegExp( "^" + combinators ),

	// All simple (non-comma) selectors, excluding insignifant trailing whitespace
	rgroups = new RegExp( groups + "?(?=" + whitespace + "*,|$)", "g" ),

	// A selector, or everything after leading whitespace
	// Optionally followed in either case by a ")" for terminating sub-selectors
	rselector = new RegExp( "^(?:(?!,)(?:(?:^|,)" + whitespace + "*" + groups + ")*?|" + whitespace + "*(.*?))(\\)|$)" ),

	// All combinators and selector components (attribute test, tag, pseudo, etc.), the latter appearing together when consecutive
	rtokens = new RegExp( groups.slice( 19, -6 ) + "\\x20\\t\\r\\n\\f>+~])+|" + combinators, "g" ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + "+)" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + "+)" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + "+)['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "[-", "[-\\*" ) + "+)" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|nth|last|first)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"POS": new RegExp( pos, "ig" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	classCache = {},
	cachedClasses = [],
	compilerCache = {},
	cachedSelectors = [],

	// Mark a function for use in filtering
	markFunction = function( fn ) {
		fn.sizzleFilter = true;
		return fn;
	},

	// Returns a function to use in pseudos for input types
	createInputFunction = function( type ) {
		return function( elem ) {
			// Check the input's nodeName and type
			return elem.nodeName.toLowerCase() === "input" && elem.type === type;
		};
	},

	// Returns a function to use in pseudos for buttons
	createButtonFunction = function( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	},

	// Used for testing something on an element
	assert = function( fn ) {
		var pass = false,
			div = document.createElement("div");
		try {
			pass = fn( div );
		} catch (e) {}
		// release memory in IE
		div = null;
		return pass;
	},

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length ===
			// buggy browsers will return more than the correct 0
			2 + document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	}),

	// Check if the browser returns only elements
	// when doing getElementsByTagName("*")
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return div.getElementsByTagName("*").length === 0;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
			return false;
		}

		// Safari caches class attributes, doesn't catch changes (in 3.2)
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length !== 1;
	});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector, context, results, seed, xml );
};

var Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	match: matchExpr,

	order: [ "ID", "TAG" ],

	attrHandle: {},

	createPseudo: markFunction,

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr.CHILD
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var argument,
				unquoted = match[4];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Relinquish our claim on characters in `unquoted` from a closing parenthesis on
			if ( unquoted && (argument = rselector.exec( unquoted )) && argument.pop() ) {

				match[0] = match[0].slice( 0, argument[0].length - unquoted.length - 1 );
				unquoted = argument[0].slice( 0, -1 );
			}

			// Quoted or unquoted, we have the full argument
			// Return only captures needed by the pseudo filter method (type and argument)
			match.splice( 2, 3, unquoted || match[3] );
			return match;
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className ];
			if ( !pattern ) {
				pattern = classCache[ className ] = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" );
				cachedClasses.push( className );
				// Avoid too large of a cache
				if ( cachedClasses.length > Expr.cacheLength ) {
					delete classCache[ cachedClasses.shift() ];
				}
			}
			return function( elem ) {
				return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
			};
		},

		"ATTR": function( name, operator, check ) {
			if ( !operator ) {
				return function( elem ) {
					return Sizzle.attr( elem, name ) != null;
				};
			}

			return function( elem ) {
				var result = Sizzle.attr( elem, name ),
					value = result + "";

				if ( result == null ) {
					return operator === "!=";
				}

				switch ( operator ) {
					case "=":
						return value === check;
					case "!=":
						return value !== check;
					case "^=":
						return check && value.indexOf( check ) === 0;
					case "*=":
						return check && value.indexOf( check ) > -1;
					case "$=":
						return check && value.substr( value.length - check.length ) === check;
					case "~=":
						return ( " " + value + " " ).indexOf( check ) > -1;
					case "|=":
						return value === check || value.substr( 0, check.length + 1 ) === check + "-";
				}
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				var doneName = done++;

				return function( elem ) {
					var parent, diff,
						count = 0,
						node = elem;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.sizset) ) {
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.sizset = ++count;
								if ( node === elem ) {
									break;
								}
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.sizset - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument, context, xml ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			var fn = Expr.pseudos[ pseudo ] || Expr.pseudos[ pseudo.toLowerCase() ];

			if ( !fn ) {
				Sizzle.error( "unsupported pseudo: " + pseudo );
			}

			// The user may set fn.sizzleFilter to indicate
			// that arguments are needed to create the filter function
			// just as Sizzle does
			if ( !fn.sizzleFilter ) {
				return fn;
			}

			return fn( argument, context, xml );
		}
	},

	pseudos: {
		"not": markFunction(function( selector, context, xml ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var matcher = compile( selector.replace( rtrim, "$1" ), context, xml );
			return function( elem ) {
				return !matcher( elem );
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !!elem.firstChild;
		},

		"empty": function( elem ) {
			return !elem.firstChild;
		},

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputFunction("radio"),
		"checkbox": createInputFunction("checkbox"),
		"file": createInputFunction("file"),
		"password": createInputFunction("password"),
		"image": createInputFunction("image"),

		"submit": createButtonFunction("submit"),
		"reset": createButtonFunction("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},

	setFilters: {
		"first": function( elements, argument, not ) {
			return not ? elements.slice( 1 ) : [ elements[0] ];
		},

		"last": function( elements, argument, not ) {
			var elem = elements.pop();
			return not ? elements : [ elem ];
		},

		"even": function( elements, argument, not ) {
			var results = [],
				i = not ? 1 : 0,
				len = elements.length;
			for ( ; i < len; i = i + 2 ) {
				results.push( elements[i] );
			}
			return results;
		},

		"odd": function( elements, argument, not ) {
			var results = [],
				i = not ? 0 : 1,
				len = elements.length;
			for ( ; i < len; i = i + 2 ) {
				results.push( elements[i] );
			}
			return results;
		},

		"lt": function( elements, argument, not ) {
			return not ? elements.slice( +argument ) : elements.slice( 0, +argument );
		},

		"gt": function( elements, argument, not ) {
			return not ? elements.slice( 0, +argument + 1 ) : elements.slice( +argument + 1 );
		},

		"eq": function( elements, argument, not ) {
			var elem = elements.splice( +argument, 1 );
			return not ? elements : elem;
		}
	}
};

// Deprecated
Expr.setFilters["nth"] = Expr.setFilters["eq"];

// Back-compat
Expr.filters = Expr.pseudos;

// IE6/7 return a modified href
if ( !assertHrefNotNormalized ) {
	Expr.attrHandle = {
		"href": function( elem ) {
			return elem.getAttribute( "href", 2 );
		},
		"type": function( elem ) {
			return elem.getAttribute("type");
		}
	};
}

// Add getElementsByName if usable
if ( assertUsableName ) {
	Expr.order.push("NAME");
	Expr.find["NAME"] = function( name, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};
}

// Add getElementsByClassName if usable
if ( assertUsableClassName ) {
	Expr.order.splice( 1, 0, "CLASS" );
	Expr.find["CLASS"] = function( className, context, xml ) {
		if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
			return context.getElementsByClassName( className );
		}
	};
}

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem, results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

var isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
var contains = Sizzle.contains = docElem.compareDocumentPosition ?
	function( a, b ) {
		return !!( a.compareDocumentPosition( b ) & 16 );
	} :
	docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

Sizzle.attr = function( elem, name ) {
	var attr,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( Expr.attrHandle[ name ] ) {
		return Expr.attrHandle[ name ]( elem );
	}
	if ( assertAttributes || xml ) {
		return elem.getAttribute( name );
	}
	attr = elem.getAttributeNode( name );
	return attr ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			attr.specified ? attr.value : null :
		null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	return (baseHasDuplicate = 0);
});


if ( docElem.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		i = 1;

	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( ; (elem = results[i]); i++ ) {
				if ( elem === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

function multipleContexts( selector, contexts, results, seed ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results, seed );
	}
}

function handlePOSGroup( selector, posfilter, argument, contexts, seed, not ) {
	var results,
		fn = Expr.setFilters[ posfilter.toLowerCase() ];

	if ( !fn ) {
		Sizzle.error( posfilter );
	}

	if ( selector || !(results = seed) ) {
		multipleContexts( selector || "*", contexts, (results = []), seed );
	}

	return results.length > 0 ? fn( results, argument, not ) : [];
}

function handlePOS( selector, context, results, seed, groups ) {
	var match, not, anchor, ret, elements, currentContexts, part, lastIndex,
		i = 0,
		len = groups.length,
		rpos = matchExpr["POS"],
		// This is generated here in case matchExpr["POS"] is extended
		rposgroups = new RegExp( "^" + rpos.source + "(?!" + whitespace + ")", "i" ),
		// This is for making sure non-participating
		// matching groups are represented cross-browser (IE6-8)
		setUndefined = function() {
			var i = 1,
				len = arguments.length - 2;
			for ( ; i < len; i++ ) {
				if ( arguments[i] === undefined ) {
					match[i] = undefined;
				}
			}
		};

	for ( ; i < len; i++ ) {
		// Reset regex index to 0
		rpos.exec("");
		selector = groups[i];
		ret = [];
		anchor = 0;
		elements = seed;
		while ( (match = rpos.exec( selector )) ) {
			lastIndex = rpos.lastIndex = match.index + match[0].length;
			if ( lastIndex > anchor ) {
				part = selector.slice( anchor, match.index );
				anchor = lastIndex;
				currentContexts = [ context ];

				if ( rcombinators.test(part) ) {
					if ( elements ) {
						currentContexts = elements;
					}
					elements = seed;
				}

				if ( (not = rendsWithNot.test( part )) ) {
					part = part.slice( 0, -5 ).replace( rcombinators, "$&*" );
				}

				if ( match.length > 1 ) {
					match[0].replace( rposgroups, setUndefined );
				}
				elements = handlePOSGroup( part, match[1], match[2], currentContexts, elements, not );
			}
		}

		if ( elements ) {
			ret = ret.concat( elements );

			if ( (part = selector.slice( anchor )) && part !== ")" ) {
				multipleContexts( part, ret, results, seed );
			} else {
				push.apply( results, ret );
			}
		} else {
			Sizzle( selector, context, results, seed );
		}
	}

	// Do not sort if this is a single filter
	return len === 1 ? results : Sizzle.uniqueSort( results );
}

function tokenize( selector, context, xml ) {
	var tokens, soFar, type,
		groups = [],
		i = 0,

		// Catch obvious selector issues: terminal ")"; nonempty fallback match
		// rselector never fails to match *something*
		match = rselector.exec( selector ),
		matched = !match.pop() && !match.pop(),
		selectorGroups = matched && selector.match( rgroups ) || [""],

		preFilters = Expr.preFilter,
		filters = Expr.filter,
		checkContext = !xml && context !== document;

	for ( ; (soFar = selectorGroups[i]) != null && matched; i++ ) {
		groups.push( tokens = [] );

		// Need to make sure we're within a narrower context if necessary
		// Adding a descendant combinator will generate what is needed
		if ( checkContext ) {
			soFar = " " + soFar;
		}

		while ( soFar ) {
			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				soFar = soFar.slice( match[0].length );

				// Cast descendant combinators to space
				matched = tokens.push({ part: match.pop().replace( rtrim, " " ), captures: match });
			}

			// Filters
			for ( type in filters ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match, context, xml )) ) ) {

					soFar = soFar.slice( match.shift().length );
					matched = tokens.push({ part: type, captures: match });
				}
			}

			if ( !matched ) {
				break;
			}
		}
	}

	if ( !matched ) {
		Sizzle.error( selector );
	}

	return groups;
}

function addCombinator( matcher, combinator, context ) {
	var dir = combinator.dir,
		doneName = done++;

	if ( !matcher ) {
		// If there is no matcher to check, check against the context
		matcher = function( elem ) {
			return elem === context;
		};
	}
	return combinator.first ?
		function( elem, context ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 ) {
					return matcher( elem, context ) && elem;
				}
			}
		} :
		function( elem, context ) {
			var cache,
				dirkey = doneName + "." + dirruns,
				cachedkey = dirkey + "." + cachedruns;
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 ) {
					if ( (cache = elem[ expando ]) === cachedkey ) {
						return false;
					} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
						if ( elem.sizset ) {
							return elem;
						}
					} else {
						elem[ expando ] = cachedkey;
						if ( matcher( elem, context ) ) {
							elem.sizset = true;
							return elem;
						}
						elem.sizset = false;
					}
				}
			}
		};
}

function addMatcher( higher, deeper ) {
	return higher ?
		function( elem, context ) {
			var result = deeper( elem, context );
			return result && higher( result === true ? elem : result, context );
		} :
		deeper;
}

// ["TAG", ">", "ID", " ", "CLASS"]
function matcherFromTokens( tokens, context, xml ) {
	var token, matcher,
		i = 0;

	for ( ; (token = tokens[i]); i++ ) {
		if ( Expr.relative[ token.part ] ) {
			matcher = addCombinator( matcher, Expr.relative[ token.part ], context );
		} else {
			token.captures.push( context, xml );
			matcher = addMatcher( matcher, Expr.filter[ token.part ].apply( null, token.captures ) );
		}
	}

	return matcher;
}

function matcherFromGroupMatchers( matchers ) {
	return function( elem, context ) {
		var matcher,
			j = 0;
		for ( ; (matcher = matchers[j]); j++ ) {
			if ( matcher(elem, context) ) {
				return true;
			}
		}
		return false;
	};
}

var compile = Sizzle.compile = function( selector, context, xml ) {
	var tokens, group, i,
		cached = compilerCache[ selector ];

	// Return a cached group function if already generated (context dependent)
	if ( cached && cached.context === context ) {
		cached.dirruns++;
		return cached;
	}

	// Generate a function of recursive functions that can be used to check each element
	group = tokenize( selector, context, xml );
	for ( i = 0; (tokens = group[i]); i++ ) {
		group[i] = matcherFromTokens( tokens, context, xml );
	}

	// Cache the compiled function
	cached = compilerCache[ selector ] = matcherFromGroupMatchers( group );
	cached.context = context;
	cached.runs = cached.dirruns = 0;
	cachedSelectors.push( selector );
	// Ensure only the most recent are cached
	if ( cachedSelectors.length > Expr.cacheLength ) {
		delete compilerCache[ cachedSelectors.shift() ];
	}
	return cached;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

var select = function( selector, context, results, seed, xml ) {
	// Remove excessive whitespace
	selector = selector.replace( rtrim, "$1" );
	var elements, matcher, i, len, elem, token,
		type, findContext, notTokens,
		match = selector.match( rgroups ),
		tokens = selector.match( rtokens ),
		contextNodeType = context.nodeType;

	// POS handling
	if ( matchExpr["POS"].test(selector) ) {
		return handlePOS( selector, context, results, seed, match );
	}

	if ( seed ) {
		elements = slice.call( seed, 0 );

	// To maintain document order, only narrow the
	// set if there is one group
	} else if ( match && match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		if ( tokens.length > 1 && contextNodeType === 9 && !xml &&
				(match = matchExpr["ID"].exec( tokens[0] )) ) {

			context = Expr.find["ID"]( match[1], context, xml )[0];
			if ( !context ) {
				return results;
			}

			selector = selector.slice( tokens.shift().length );
		}

		findContext = ( (match = rsibling.exec( tokens[0] )) && !match.index && context.parentNode ) || context;

		// Get the last token, excluding :not
		notTokens = tokens.pop();
		token = notTokens.split(":not")[0];

		for ( i = 0, len = Expr.order.length; i < len; i++ ) {
			type = Expr.order[i];

			if ( (match = matchExpr[ type ].exec( token )) ) {
				elements = Expr.find[ type ]( (match[1] || "").replace( rbackslash, "" ), findContext, xml );

				if ( elements == null ) {
					continue;
				}

				if ( token === notTokens ) {
					selector = selector.slice( 0, selector.length - notTokens.length ) +
						token.replace( matchExpr[ type ], "" );

					if ( !selector ) {
						push.apply( results, slice.call(elements, 0) );
					}
				}
				break;
			}
		}
	}

	// Only loop over the given elements once
	// If selector is empty, we're already done
	if ( selector ) {
		matcher = compile( selector, context, xml );
		dirruns = matcher.dirruns;

		if ( elements == null ) {
			elements = Expr.find["TAG"]( "*", (rsibling.test( selector ) && context.parentNode) || context );
		}
		for ( i = 0; (elem = elements[i]); i++ ) {
			cachedruns = matcher.runs++;
			if ( matcher(elem, context) ) {
				results.push( elem );
			}
		}
	}

	return results;
};

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
			rbuggyQSA = [],
			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [":active"],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			div.innerHTML = "<select><option selected></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				if ( context.nodeType === 9 ) {
					try {
						push.apply( results, slice.call(context.querySelectorAll( selector ), 0) );
						return results;
					} catch(qsaError) {}
				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var old = context.getAttribute("id"),
						nid = old || expando,
						newContext = rsibling.test( selector ) && context.parentNode || context;

					if ( old ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}

					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							selector.replace( rgroups, "[id='" + nid + "'] $&" )
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( Expr.match.PSEUDO );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// EXPOSE

if (typeof module === 'object' && module.exports) {
    module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}
// EXPOSE

})( window );

},{}],20:[function(require,module,exports){
'use strict';

var BrowserData = require('./ac-browser/BrowserData');
var webkitRegExp = /applewebkit/i;
var IE = require('./ac-browser/IE');

/**
 * Reports information about the user's browser and device
 * based on the userAgent string and feature detection.
 * @reference http://www.quirksmode.org/js/detect.html
 * @name module:ac-browser
 * @kind namespace
 */
var browser = BrowserData.create();

/**
 * Returns true/false whether the browser is WebKit based
 * @param  {String}  userAgentString
 * @return {Boolean}
 * @name module:ac-browser.isWebKit
 * @kind function
 */
browser.isWebKit = function(userAgentString) {
	var userAgent = userAgentString || window.navigator.userAgent;
	return userAgent ? !! webkitRegExp.test(userAgent) : false;
};

/**
 * @type {String}
 * @name module:ac-browser.lowerCaseUserAgent
 */
browser.lowerCaseUserAgent = navigator.userAgent.toLowerCase();

if (browser.name === 'IE') {
	/**
	 * Only available in Internet Explorer
	 * @name module:ac-browser.IE
	 * @kind namespace
	 */
	browser.IE = {
		/**
		 * The emulated Internet Explorer version, which may not match actual version
		 * @name module:ac-browser.IE.documentMode
		 * @type {Number}
		 */
		documentMode: IE.getDocumentMode()
	};
}

module.exports = browser;

},{"./ac-browser/BrowserData":21,"./ac-browser/IE":22}],21:[function(require,module,exports){
'use strict';

var _data = require('./data');

function BrowserData() { }

BrowserData.prototype = {
	/**
	 * Parses string (such as userAgent) and returns the browser version
	 * @param  {String} stringToSearch
	 * @return {Number}
	 */
	__getBrowserVersion: function(stringToSearch, identity) {

		if (!stringToSearch || !identity) {
			return;
		}

		// Filters data.browser for the member with a identity equal to identity
		var filteredData = _data.browser.filter(function(item) {
			return item.identity === identity;
		})[0];

		var versionSearchString = filteredData.versionSearch || identity;
		var index = stringToSearch.indexOf(versionSearchString);

		if (index > -1) {
			return parseFloat(stringToSearch.substring(index + versionSearchString.length + 1));
		}
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} browserData | Expects data.browser
	 * @return {String}
	 */
	__getName: function(dataBrowser) {
		return this.__getIdentityStringFromArray(dataBrowser);
	},

	/**
	 * Expects single member of data.browser or data.os
	 * and returns a string to be used in os or name.
	 * @param  {Object} item
	 * @return {String}
	 */
	__getIdentity: function(item) {
		if (item.string) {
			return this.__matchSubString(item);
		} else if (item.prop) {
			return item.identity;
		}
	},

	/**
	 * Iterates through data.browser or data.os returning the correct
	 * browser or os identity
	 * @param  {Array} dataArray
	 * @return {String}
	 */
	__getIdentityStringFromArray: function(dataArray) {
		for (var i = 0, l = dataArray.length, identity; i < l; i++) {
			identity = this.__getIdentity(dataArray[i]);
			if (identity) {
				return identity;
			}
		}
	},

	/**
	 * Alias for __getIdentityStringFromArray
	 * @param  {Array} OSData | Expects data.os
	 * @return {String}
	 */
	__getOS: function(dataOS) {
		return this.__getIdentityStringFromArray(dataOS);
	},

	/**
	 * Parses string (such as userAgent) and returns the operating system version
	 * @param {String} stringToSearch
	 * @param {String} osIdentity
	 * @return {String|Number} int if not a decimal delimited version
	 */
	__getOSVersion: function(stringToSearch, osIdentity) {

		if (!stringToSearch || !osIdentity) {
			return;
		}

		// Filters data.os returning the member with an identity equal to osIdentity
		var filteredData = _data.os.filter(function(item) {
			return item.identity === osIdentity;
		})[0];

		var versionSearchString = filteredData.versionSearch || osIdentity;
		var regex = new RegExp(versionSearchString + ' ([\\d_\\.]+)', 'i');
		var version = stringToSearch.match(regex);

		if (version !== null) {
			return version[1].replace(/_/g, '.');
		}
	},

	/**
	 * Regular expression and indexOf against item.string using item.subString as the pattern
	 * @param  {Object} item
	 * @return {String}
	 */
	__matchSubString: function(item) {
		var subString = item.subString;
		if (subString) {
			var matches = subString.test ? !!subString.test(item.string) : item.string.indexOf(subString) > -1;
			if (matches) {
				return item.identity;
			}
		}
	}
};

BrowserData.create = function () {
	var instance = new BrowserData();
	var out = {};
	/**
	 * @type {String}
	 * @name module:ac-browser.name
	 */
	out.name      = instance.__getName(_data.browser);
	/**
	 * @type {String}
	 * @name module:ac-browser.version
	 */
	out.version   = instance.__getBrowserVersion(_data.versionString, out.name);
	/**
	 * @type {String}
	 * @name module:ac-browser.os
	 */
	out.os        = instance.__getOS(_data.os);
	/**
	 * @type {String}
	 * @name module:ac-browser.osVersion
	 */
	out.osVersion = instance.__getOSVersion(_data.versionString, out.os);
	return out;
};

module.exports = BrowserData;

},{"./data":23}],22:[function(require,module,exports){
'use strict';

module.exports = {
	/**
	 * Detect what version or document/standards mode IE is rendering the page as.
	 * Accounts for later versions of IE rendering pages in earlier standards modes. E.G. it is
	 * possible to set the X-UA-Compatible tag to tell IE9 to render pages in IE7 standards mode.//
	 * Based on Microsoft test
	 * @see http://msdn.microsoft.com/en-us/library/jj676915(v=vs.85).aspx
	 */
	getDocumentMode: function () {
		var ie;

		// IE8 or later
		if (document.documentMode) {
			ie = parseInt(document.documentMode, 10);
		// IE 5-7
		} else {
			// Assume quirks mode unless proven otherwise
			ie = 5;
			if (document.compatMode) {
				// standards mode
				if (document.compatMode === "CSS1Compat") {
					ie = 7;
				}
			}
			// There is no test for IE6 standards mode because that mode
			// was replaced by IE7 standards mode; there is no emulation.
		}
		return ie;
	}
};

},{}],23:[function(require,module,exports){
module.exports=require(11)
},{}],24:[function(require,module,exports){
/**
 * More or less follows this specification: 
 * http://wiki.commonjs.org/wiki/Promises/A
 * Other references: 
 * http://en.wikipedia.org/wiki/Futuresandpromises
 * http://livedocs.dojotoolkit.org/dojo/Deferred
 * http://www.sitepen.com/blog/2010/05/03/robust-promises-with-dojo-deferred-1-5/
 * http://api.jquery.com/category/deferred-object/
 *
 * Understanding Deferreds
 * ====================================
 * var asyncTask = function() { 
 *      var def = new Deferred(); 
 *
 *      setTimeout(function() { 
 *          def.resolve(1); 
 *      }, 1000); 
 *      
 *      return def.promise(); 
 *  }
 *  
 *  var haveAllData = Deferred.when(1, asyncTask());
 *  
 *  haveAllDataPromise.then(function(data) { 
 *      var result = data[0] + data[1];
 *      console.log(result); // logs 2
 *      return result; 
 *  }).then(function(data) {
 *      console.log(data * 2); // logs 4
 *  })
 *   
 */
(function (root, factory) {
    if (typeof exports === "object" && exports) {
        module.exports = factory; // CommonJS
    } else if (typeof define === "function" && define.amd) {
        define(factory); // AMD
    } else {
        root.Deferred = factory; // <script>
    }
}(this, (function() {
    'use strict';

    var exports = {};

    var statuses, each, CallbackContainer, funcOrEmpty, Deferred, Promise, promiseProto, passThrough;

    statuses = {
        0: 'pending',
        1: 'resolved',
        2: 'rejected'
    };

    // Used to loop through the pending promises for a given deferred.
    // promises must be fulfilled in order
    each = function(type, data) {
        var i, pending, length, callbackObj, callbackResult;

        if(this._status !== 0) { 
            if(console && console.warn) {
                console.warn('Trying to fulfill more than once.');
            }
            return false; 
        }

        // store the data for promises after fulfillment  
        this.data = data; 

        // reference to array of pending promises
        pending = this.pending;
        length = pending.length;

        for(i = 0; i < length; i++) {
            callbackObj = pending[i];

            // If callback of type (resolve, reject, progress) exists, invoke it.
            if(callbackObj[type]) {
                callbackResult = callbackObj[type](data);
            }
            
            // Pipe whatever is returned from the callback to the 
            // callback's deferred. This enables chaining. 
            if(typeof callbackResult === 'object' && callbackResult.hasOwnProperty('then') && callbackResult.hasOwnProperty('status')) {
                callbackResult.then(function(data) {
                    callbackObj.deferred.resolve(data);
                }, function(data) {
                    callbackObj.deferred.reject(data);
                }, function(data) {
                    callbackObj.deferred.progress(data);
                });
            }
            else {
                callbackObj.deferred[type](callbackResult || undefined);
            }

        }

        // if we are not updating progress, remove all the pending promises
        // as they have been now fulfilled or rejected and they cannot be fullfilled/rejected
        // more than once.
        if(type !== 'progress') {
            pending = [];
        }
        
        return true;
    };


    /**
     * Creates a Promise object
     * @name Promise
     */
    Promise = function(then, status) {
        this.then = then;
        this.status = status;
    };

    promiseProto = Promise.prototype;

    /* 
     * Shorthands for success, fail, and progress.
     * passThrough is used to pipe data through for chaining
     */
    passThrough = function(value) {
        return value;
    };

    promiseProto.success = function(callback, context) {
        return this.then(callback.bind(context), passThrough, passThrough);
    };

    promiseProto.fail = function(callback, context) {
        return this.then(passThrough, callback.bind(context), passThrough);
    };

    promiseProto.progress = function(callback, context) {
        return this.then(passThrough, passThrough, callback.bind(context));
    };

    funcOrEmpty = function(func) {
        if(typeof func !== 'function') {
            return function() {};
        }
        return func;
    };

    CallbackContainer = function(success, error, progress) {
        this.resolve = funcOrEmpty(success);
        this.reject = funcOrEmpty(error);
        this.progress = funcOrEmpty(progress);
        this.deferred = new Deferred();
    };

    /**
     * Creates a Deferred object
     * @class Asynch operation? Make a promise that you'll get that data in the future.
     * @name Deferred
     */
    Deferred = function() {
        // promises that are waiting to be fulfilled
        this.pending = [];

        this._status = 0; // initially pending

        // consumer access to then (does this need anything else?)
        this._promise = new Promise(this.then.bind(this), this.status.bind(this));
    };
    
    Deferred.prototype = /** @lends Deferred.prototype */ {
        /**
         * Gets the status of the deferred. 
         * Possible statuses: pending, resolved, rejected, canceled
         */
        status: function() {
            return statuses[this._status];
        },
        /**
         * Returns the promise object associated with a given deferrred instance. A promise can 
         * observe the deferred, but cannot resolve it.  
         */
        promise: function() {
            return this._promise;
        },
        /**
         * Alerts anyone that is listening for updates on a promise.
         * @param [update] Update data to send to listeners
         */
        progress: function(update) {
            each.call(this, 'progress', update);
            return this._promise;
        },
        /**
         * Called when the deferred task is complete and successful. 
         * @param [value] Data resulting from the deferred task
         */
        resolve: function(value) {
            each.call(this, 'resolve', value);
            if(this._status === 0) {
                this._status = 1;
            }
            return this._promise;
        },
        /**
         * Called when the deferred task errors out.
         * @param [error] Error message to pass to listeners
         */
        reject: function(error) {
            each.call(this, 'reject', error);
            if(this._status === 0) {
                this._status = 2;
            }
            return this._promise;
        },
        /**
         * Used to set callbacks on the deferred. This method is exposed to other code
         * through the promises object. 
         * @param {Function} [success] Invoked when a deferred is resolved
         * @param {Function} [error] Invoked when a deferred is rejected
         * @param {Function} [progress] May be invoked when progress is made on a deferred task
         */
        then: function(success, error, progress) {
            var result, callbackObject;

            callbackObject = new CallbackContainer(success, error, progress);

            if(this._status === 0) {
                this.pending.push(callbackObject);
            }
            else if(this._status === 1 && typeof success === 'function') {
                result = success(this.data);
                if(typeof result === 'object' && result.hasOwnProperty('then') && result.hasOwnProperty('status')) {
                    result.then(function(data) {
                        callbackObject.deferred.resolve(data);
                    }, function(data) {
                        callbackObject.deferred.reject(data);
                    }, function(data) {
                        callbackObject.deferred.progress(data);
                    });
                }
                else {
                    callbackObject.deferred.resolve(result);
                }
            }
            else if(this._status === 2 && typeof error === 'function') {
                result = error(this.data);
                callbackObject.deferred.reject(result);
            }

            return callbackObject.deferred.promise();

        }
    };

    /**
     * Execute code when all deferred tasks have completed. 
     * Accepts regular variables and promises. Returns a new promise.
     * @name when
     * @function
     *
     * @example
     * var promise = Deferred.when(1, asynchRequest());
     * promise.then(function(a, b) {
     *  console.log(a + b); // 1 + data returned from server
     * }
     */
    var when = function() {
        var values, deferred, pending, success, fail;

        values = [].slice.call(arguments);
        deferred = new Deferred();
        pending = 0;

        success = function(value) {
            pending--;

            var i = values.indexOf(this);
            values[i] = value;

            if(pending === 0) {
                deferred.resolve(values);
            }
        };

        fail = function(error) {
            deferred.reject(error);
        };

        values.forEach(function(value) {
            if(value.then) {
                pending++;
            }
        });

        values.forEach(function(value) {
            if(value.then) {
                value.then(success.bind(value), fail);
            }
        });

        return deferred.promise();
    };

    Deferred.when = when;

    exports.Deferred = Deferred;

    return exports;

}())));

},{}],25:[function(require,module,exports){

"use strict";
/**
 * @name defer.Deferred
 * @class Deferred object.
 * <pre>Deferred = require('defer/Deferred');</pre>
 * <p>API based off a subset of <a href="https://github.com/cujojs/when">when.js</a>.
 * <p>This is the interface we provide, however implementation is provided by a 3rd party library such as jett, when or jQuery.<br/>
 * @see <a href="https://github.com/cujojs/when">when.js</a>
 * @see <a href="http://api.jquery.com/category/deferred-object">jQuery Deferred Object</a>
 * @description Deferred constructor. (see example usage below)
 * @example var deferred = new Deferred();
 *
 * // Some async operation
 * setTimeout(function () {
 *     deferred.resolve();
 * },2000);
 *
 * // Pass the promise on
 * return deferred.promise();
 */

function Deferred() {}

Deferred.prototype = {
    /**
     *  @name defer.Deferred#resolve
     *  @description Signals resolution of the deferred (as per when.js spec)
     *  @return {defer.Promise}
     *  @function
     */
    'resolve' : function resolve() {
        this._defer.resolve.apply(this._defer, Array.prototype.slice.call(arguments));
        return this.promise();
    },
    /**
     *  @name defer.Deferred#reject
     *  @description Signals rejection of the deferred (as per when.js spec)
     *  @return {defer.Promise}
     *  @function
     */
    'reject' : function reject() {
        this._defer.reject.apply(this._defer, Array.prototype.slice.call(arguments));
        return this.promise();
    },
    /**
     *  @name defer.Deferred#progress
     *  @description Signals progression of the deferred (as per when.js spec)
     *  @deprecated as of 1.2.0, since it is not part of the A+ spec. Recommend using ac-event-emitter for progress signaling.
     *  @return {defer.Promise}
     *  @function
     */
    'progress' : function progress() {
        var message = 'ac-defer.progress is deprecated since it is not part of the A+ spec. Recommend using ac-event-emitter for progress signaling';
        console.warn(message);
        this._defer.progress.apply(this._defer, Array.prototype.slice.call(arguments));
        return this.promise();
    },
    /**
     *  @name defer.Deferred#then
     *  @description Attach callbacks to the deferred
     *  @param {Function} success
     *  @param {Function} failure
     *  @param {Function} progress
     *  @return {defer.Promise}
     *  @function
     */
    'then' : function then() {
        this._defer.then.apply(this._defer, Array.prototype.slice.call(arguments));
        return this.promise();
    },
    /**
     *  @name defer.Deferred#promise
     *  @description gets the deferred promise (as per jQuery spec)
     *  @return {defer.Promise}
     *  @function
     */
    'promise' : function promise() {
        return this._defer.promise.apply(this._defer, Array.prototype.slice.call(arguments));
    }

    /**
    * @name defer.Deferred.join
    * @static
    * @description Return a {@link defer.Promise} that will resolve only once all the inputs have resolved. The resolution value of the returned promise will be an array containing the resolution values of each of the inputs.
    * @example var joinedPromise = Deferred.join(promiseOrValue1, promiseOrValue2, ...);
    *
    * @example // largerPromise will resolve to the greater of two eventual values
    * var largerPromise = defer.join(promise1, promise2).then(function (values) {
    *     return values[0] > values[1] ? values[0] : values[1];
    * });
    * @function
    * @param {defer.Promise} promiseOrValue1
    * @param {defer.Promise} promiseOrValue2 ...
    * @return {defer.Promise}
    * @see defer.Deferred#all
    */
    /**
    * @name defer.Deferred.all
    * @static
    * @description Return a {@link defer.Promise} that will resolve only once all the items in array have resolved. The resolution value of the returned promise will be an array containing the resolution values of each of the items in array.
    * @example var promise = Deferred.all(arrayOfPromisesOrValues);
    * @function
    * @param {Array} arrayOfPromisesOrValues Array of {@link defer.Promise} or values
    * @return {defer.Promise}
    * @see defer.Deferred#join
    */

};

module.exports = Deferred;

},{}],26:[function(require,module,exports){
'use strict';
/**
* @name interface.smartsign
* @inner
* @namespace Provides {@link defer} object using Smartsign's implementation.
* <br/>
* @description Provides {@link defer} object using Smartsign's implementation.
*/
var proto = new (require('./ac-deferred/Deferred'))(),
    SmartsignDeferred = require('smartsign-deferred').Deferred;

function Deferred() {
    this._defer = new SmartsignDeferred();
}

Deferred.prototype = proto;

module.exports.join = function join() {
    return SmartsignDeferred.when.apply(null, [].slice.call(arguments));
};

module.exports.all = function all(arrayOfPromises) {
    return SmartsignDeferred.when.apply(null, arrayOfPromises);
};

module.exports.Deferred = Deferred;
},{"./ac-deferred/Deferred":25,"smartsign-deferred":24}],27:[function(require,module,exports){
'use strict';

/**
 * @module ac-dom-events
 */
var events = {};

/**
 * Cross-browser event handling
 * @param {Element} target Element to listen for event on
 * @param {String} type
 * @param {Function} listener
 * @param {Boolean} [useCapture=false]
 * @returns target
 * @name module:ac-dom-events.addEventListener
 * @kind function
 */
events.addEventListener = function (target, type, listener, useCapture) {
	if (target.addEventListener) {
		target.addEventListener(type, listener, useCapture);
	} else if (target.attachEvent) {
		target.attachEvent('on' + type, listener);
	} else {
		target['on' + type] = listener;
	}
	return target;
};

/**
 * Cross-browser event dispatch
 * @param  {Element} target Element that will dispatch the event
 * @param  {String} type   The name of the event to fire
 * @returns {Element}       target
 * @name module:ac-dom-events.dispatchEvent
 * @kind function
 */
events.dispatchEvent = function (target, type) {
	// Expects polyfill for CustomEvent constructor
	if (document.createEvent) {
		target.dispatchEvent(new CustomEvent(type));
	} else {
		target.fireEvent('on' + type, document.createEventObject());
	}
	return target;
};

/**
 * Cross-browser event removing
 * @param {Element} target Element to listen for event on
 * @param {String} type
 * @param {Function} listener
 * @param {Boolean} [useCapture=false]
 * @returns target
 * @name module:ac-dom-events.removeEventListener
 * @kind function
 */
events.removeEventListener = function (target, type, listener, useCapture) {
	if (target.removeEventListener) {
		target.removeEventListener(type, listener, useCapture);
	} else {
		target.detachEvent('on' + type, listener);
	}
	return target;
};

var prefixMatch = /^(webkit|moz|ms|o)/i;

/**
 * Sets all the vendor event listeners of type on element.
 * @param {Element} target Element for which to set the listener upon
 * @param {String} type String representing the event type to listen for, e.g. animationEnd, webkitAnimationEnd, etc... IMPORTANT: This value is expected to be a string in camelCase.
 * @param {Function} listener Object that receives a notification when an event of the specified type occurs.
 * @param {Boolean} [useCapture=false] If true, useCapture indicates that the user wishes to initiate capture.
 * @returns target
 * @name module:ac-dom-events.addVendorPrefixEventListener
 * @kind function
 */
events.addVendorPrefixEventListener = function (target, type, listener, useCapture) {
	if (prefixMatch.test(type)) {
		type = type.replace(prefixMatch, '');
	} else {
		type = type.charAt(0).toUpperCase() + type.slice(1);
	}

	// To avoid adding the same event twice, we need to sniff the user agent.
	// Once we've confirmed a browser supports the generic event name, we'll
	// change this if to be < that build.
	if (/WebKit/i.test(window.navigator.userAgent)) {
		return events.addEventListener(target, 'webkit' + type, listener, useCapture);
	} else if (/Opera/i.test(window.navigator.userAgent)) {
		return events.addEventListener(target, 'O' + type, listener, useCapture);
	} else if (/Gecko/i.test(window.navigator.userAgent)) {
		return events.addEventListener(target, type.toLowerCase(), listener, useCapture);
	} else {
		type = type.charAt(0).toLowerCase() + type.slice(1);
		return events.addEventListener(target, type, listener, useCapture);
	}
};

/**
 * Removes all the vendor event listeners of type on an element.
 * @param {Element} target Element for which to remove the listener from
 * @param {String} type String representing the event type to listen for, e.g. animationEnd, webkitAnimationEnd, etc... IMPORTANT: This value is expected to be a string in camelCase.
 * @param {Function} listener Object that receives a notification when an event of the specified type occurs.
 * @param {Boolean} [useCapture=false] If true, useCapture indicates that the user wishes to initiate capture.
 * @returns target
 * @name module:ac-dom-events.removeVendorPrefixEventListener
 * @kind function
 */
events.removeVendorPrefixEventListener = function (target, type, listener, useCapture) {
	if (prefixMatch.test(type)) {
		type = type.replace(prefixMatch, '');
	} else {
		type = type.charAt(0).toUpperCase() + type.slice(1);
	}

	events.removeEventListener(target, 'webkit' + type, listener, useCapture);
	events.removeEventListener(target, 'O' + type, listener, useCapture);
	events.removeEventListener(target, type.toLowerCase(), listener, useCapture);

	type = type.charAt(0).toLowerCase() + type.slice(1);
	return events.removeEventListener(target, type, listener, useCapture);
};

/**
 * Stop propagation of event and prevent default behavior.
 * @param {Event} evt The event to stop
 * @name module:ac-dom-events.stop
 * @kind function
 */
events.stop = function (evt) {
	if (!evt) {
		evt = window.event;
	}

	if (evt.stopPropagation) {
		evt.stopPropagation();
	} else {
		evt.cancelBubble = true;
	}

	if (evt.preventDefault) {
		evt.preventDefault();
	}

	evt.stopped = true;
	evt.returnValue = false;
};

/**
 * Cross-browser event target getter
 * @param {Event} evt
 * @name module:ac-dom-events.target
 * @kind function
 */
events.target = function (evt) {
	return (typeof evt.target !== 'undefined') ? evt.target : evt.srcElement;
};

module.exports = events;

},{}],28:[function(require,module,exports){
/** 
 * @module ac-event-emitter
 * @author Ronald "Doctor" Jett <rjett@apple.com>
 * @copyright 2014 Apple Inc. All rights reserved.
 */
module.exports.EventEmitter = require('./ac-event-emitter/EventEmitter');
},{"./ac-event-emitter/EventEmitter":29}],29:[function(require,module,exports){
/** 
 * @module ac-event-emitter/EventEmitter
 * @classdesc An object that provides an event system
 */
'use strict';

var propagationName = 'EventEmitter:propagation';

/**
 * @constructor
 */
var EventEmitter = function(context) {
    // we should only create a context property if
    // the user is using EventEmitter through composition
    // and not using it as a part of their prototype chain
    if (context) {
        this.context = context;
    }
};

// shorthand to the prototype 
var proto = EventEmitter.prototype;

// test to see if the instant has an object
// that as been allocated to store events
var getEvents = function() {
    if (!this.hasOwnProperty('_events') && typeof this._events !== 'object') {
        this._events = {};
    }
    return this._events;
};

// @arguments arguments Could be:
//  event Single string event, space seperated string, or map of events/callbacks
//  callback Callback function for space seperated or single events
//  context Context to apply to callbacks when invoked
// @argument register The function that will get called for each event/callback/context
var parseEvents = function(args, register) {
    var event = args[0];
    var callback = args[1];
    var context = args[2];

    // event should be a string or an plain object (not an array or null)
    if ((typeof event !== 'string' && typeof event !== 'object') || event === null || Array.isArray(event)) {
        throw new TypeError('Expecting event name to be a string or object.');
    }

    // ensure that calls to on/once with a string for event names
    // also come with a callback function
    if ((typeof event === 'string') && !callback) {
        throw new Error('Expecting a callback function to be provided.');
    }

    // callback should be a function
    if (callback && (typeof callback !== 'function')) {
        // unless we have a map of events/callbacks, then it could actually
        // be a context object
        if (typeof event === 'object' && typeof callback === 'object') {
            context = callback;
        }
        else {
            throw new TypeError('Expecting callback to be a function.');
        }
    }

    // we have a map of events/callbacks
    if (typeof event === 'object') {
        for (var evt in event) {
            register.call(this, evt, event[evt], context);
        }
    }

    // we have a string of events
    if (typeof event === 'string') {
        event = event.split(' ');
        event.forEach(function(evt) {
            register.call(this, evt, callback, context);
        }, this);
    }
};

// Finds the array of callback objects for 
// a given event name, then executes the provided
// callback for each one of them. Passing the callback
// object and the index.
var each = function(event, callback) {
    var eventsArray;
    var i;
    var length;

    eventsArray = getEvents.call(this)[event];

    if (!eventsArray || eventsArray.length === 0) { 
        return; 
    }

    // copy it in case anything we call tries to modify it
    eventsArray = eventsArray.slice();

    for (i = 0, length = eventsArray.length; i < length; i++) {
        if (callback(eventsArray[i], i)) {
            break;
        }
    }
};

// Remove a callback for a given event
var removeSpecificCallback = function(events, event, callback) {
    // looking for a specific callback
    var i = -1;
    each.call(this, event, function(callbackObject, index) {
        if (callbackObject.callback === callback) {
            i = index;
            return true;
        }
    });

    if(i === -1) {
        return;
    }

    events[event].splice(i, 1);
};


/**
 * A method for adding a callback for a given event
 * @method
 * @param {string} event Event name
 * @param {function} callback A function to invoke when an event is triggered
 * @param {object} [context] A context to bind to the callback
 */
proto.on = function() {
    var events = getEvents.call(this);

    parseEvents.call(this, arguments, function(event, callback, context) {
        events[event] = events[event] || (events[event] = []);
        events[event].push({
            callback: callback,
            context: context
        });
    });

    return this;
};

/**
 * A method for adding a callback for an event that will only execute once
 * and then be removed.
 * @method
 * @param {string} event Event name
 * @param {function} callback A function to invoke when an event is triggered
 * @param {object} [context] A context to bind to the callback
 */
proto.once = function() {
    parseEvents.call(this, arguments, function(event, callback, context) {
        var wrapper = function(data) {
            callback.call(context || this, data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper, this);
    });

    return this;
};

/**
 * A method for removing a callback for a given event
 * If no arguments are specified, all handlers are removed.
 * @method
 * @param {string} [event] Event name
 * @param {function} [callback] A function to remove
 */
proto.off = function(event, callback) {
    var events = getEvents.call(this);

    // if no arguments are specified
    // we will drop all callbacks
    if (arguments.length === 0) {
        this._events = {};
    }
    // event names should be a string
    else if (!event || (typeof event !== 'string' && typeof event !== 'object') || Array.isArray(event)) {
        throw new TypeError('Expecting event name to be a string or object.');
    }

    if (typeof event === 'object') {
        for (var e in event) {
            removeSpecificCallback.call(this, events, e, event[e]);
        }
    }

    // one or more events passed as string
    if (typeof event === 'string') {
        var split = event.split(' ');

        // only one event passed
        if (split.length === 1) {
            // if a callback was specified remove that callback
            if (callback) {
                removeSpecificCallback.call(this, events, event, callback);
            }
            // otherwise, remove all the callbacks for that event
            else {
                events[event] = [];
            }
        }
        // space seperated events passed
        else {
            split.forEach(function(event) {
                events[event] = [];
            });
        }
    }

    return this;
};

/**
 * A method for firing/triggering an event
 * @method
 * @param {string} event Event name
 * @param {object} [data] Data to pass to the listening callbacks
 * @param {boolean} [doNotPropagate] Flag to silence propagation
 */
proto.trigger = function(event, data, doNotPropagate) {
    // you need at least an event
    if (!event) {
        throw new Error('trigger method requires an event name');
    }

    // event names should be a string
    if (typeof event !== 'string') {
        throw new TypeError('Expecting event names to be a string.');
    }

    // doNotPropagate flag should be a boolean
    if (doNotPropagate && typeof doNotPropagate !== 'boolean') {
        throw new TypeError('Expecting doNotPropagate to be a boolean.');
    }

    // split events incase we are trigger multiples with a space delimiter
    event = event.split(' ');

    // loop through the events
    event.forEach(function(evt) {

        // call all the callbacks for the given event
        each.call(this, evt, function(callbackObject) {
            callbackObject.callback.call(callbackObject.context || this.context || this, data);
        }.bind(this));

        // propagate event if anyone else is listening, unless told not to
        if (!doNotPropagate) {
            each.call(this, propagationName, function(propagation) {
                var eventName = evt;

                if (propagation.prefix) {
                    eventName = propagation.prefix + eventName;
                }

                propagation.emitter.trigger(eventName, data);
            });
        }

    }, this);

    return this;
};

/**
 * A method for propagating events to another EventEmitter
 * @method
 * @param {object} eventEmitter An event emitting object to propagate events to
 * @param {string} [prefix] A prefix to be appended to the name of a propagating event
 */
proto.propagateTo = function(eventEmitter, prefix) {
    var events = getEvents.call(this);

    if (!events[propagationName]) {
        this._events[propagationName] = [];
    }

    events[propagationName].push({
        emitter: eventEmitter,
        prefix: prefix
    });
};

/**
 * A method for removing propagation
 * @method
 * @param {object} [eventEmitter] The event emitter to stop propagating to
 */
proto.stopPropagatingTo = function(eventEmitter) {
    var events = getEvents.call(this);

    // If an argument was not specified,
    // all propagations will be removed.
    if (!eventEmitter) {
        events[propagationName] = [];
        return;
    }

    // If an event emitter was passed in,
    // just removed propagation to that object
    var propagationTargets = events[propagationName];
    var length = propagationTargets.length;
    var i;

    for(i = 0; i < length; i++) {
        if (propagationTargets[i].emitter === eventEmitter) {
            propagationTargets.splice(i, 1);
            break;
        }
    }
};

/**
 * A method for checking whether or not there are callbacks for a given event
 * @method
 * @param {string} evt An event name to check
 * @param {function} [callback] A callback to check for 
 * @parma {object} [context] A particular context
 */
proto.has = function(evt, callback, context) {
    var events = getEvents.call(this);
    var eventsArray = events[evt];

    // return an array of all events if no arguments specified
    if (arguments.length === 0) {
        return Object.keys(events);
    }

    // If we are not looking for a particular callback,
    // check the length of the events array
    if (!callback) {
        return (eventsArray && eventsArray.length > 0) ? true : false;
    }

    // If we are looking for a particular callback/context, loop through 
    // the array of callbacks for the given event name
    for (var i = 0, length = eventsArray.length; i < length; i++) {
        var callbackContainer = eventsArray[i];

        // looking for both a callback and a context
        if (context && callback && callbackContainer.context === context && callbackContainer.callback === callback) {
            return true;
        }
        // just looking for a callback
        else if (callback && !context && callbackContainer.callback === callback) {
            return true;
        }
    }

    return false;
};

module.exports = EventEmitter;

},{}],30:[function(require,module,exports){
'use strict';

/**
 * @module module:ac-feature
 */
var feature = {
	cssPropertyAvailable: require('./ac-feature/cssPropertyAvailable'),
	localStorageAvailable: require('./ac-feature/localStorageAvailable')
};

var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * Returns whether the browser supports the 3d media query
 * @returns {Boolean} whether or not the browser supports the 3d media query
 * @name module:ac-feature.threeDTransformsAvailable
 * @kind function
 */
feature.threeDTransformsAvailable = function () {
	// Memoize previously returned value
	if (typeof this._threeDTransformsAvailable !== 'undefined') {
		return this._threeDTransformsAvailable;
	}

	var div, style;

	try {
		this._threeDTransformsAvailable = false;

		if (hasOwnProp.call(window, 'styleMedia')) {
			this._threeDTransformsAvailable = window.styleMedia.matchMedium('(-webkit-transform-3d)');

		} else if (hasOwnProp.call(window, 'media')) {
			this._threeDTransformsAvailable = window.media.matchMedium('(-webkit-transform-3d)');
		}

		// chrome returns all the values as true, but doesn't actually have 3d support
		if (!this._threeDTransformsAvailable) {
			if (!(style = document.getElementById('supportsThreeDStyle'))) {
				style = document.createElement('style');
				style.id = 'supportsThreeDStyle';
				style.textContent = '@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-ms-transform-3d),(-webkit-transform-3d) { #supportsThreeD { height:3px } }';
				document.querySelector('head').appendChild(style);
			}

			if (!(div = document.querySelector('#supportsThreeD'))) {
				div = document.createElement('div');
				div.id = 'supportsThreeD';
				document.body.appendChild(div);
			}
			this._threeDTransformsAvailable = (div.offsetHeight === 3) || style.style['MozTransform'] !== undefined || style.style['WebkitTransform'] !== undefined;
		}

		return this._threeDTransformsAvailable;
	} catch (e) {
		return false;
	}
};

/**
 * Detects whether or not the browser understands the HTML5 Canvas API.
 * @returns {Boolean} true if the browser supports canvas.
 * @name module:ac-feature.canvasAvailable
 * @kind function
 */
feature.canvasAvailable = function () {
	// Memoize previously returned value
	if (typeof this._canvasAvailable !== 'undefined') {
		return this._canvasAvailable;
	}

	var canvas = document.createElement('canvas');

	this._canvasAvailable = !!(typeof canvas.getContext === 'function' && canvas.getContext('2d'));
	return this._canvasAvailable;
};

/**
 * Returns whether the browser supports HTML5 sessionStorage, and
 * does not have privacy mode enabled or cookies turned off.
 * @returns {Boolean} true if the browser supports sessionStorage
 * @name module:ac-feature.sessionStorageAvailable
 * @kind function
 */
feature.sessionStorageAvailable = function () {
	// Memoize previously returned value
	if (typeof this._sessionStorageAvailable !== 'undefined') {
		return this._sessionStorageAvailable;
	}

	try {
		if (typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.setItem === 'function') {
			window.sessionStorage.setItem('ac_browser_detect', 'test');
			this._sessionStorageAvailable = true;
			window.sessionStorage.removeItem('ac_browser_detect', 'test');
		} else {
			this._sessionStorageAvailable = false;
		}
	} catch (e) {
		this._sessionStorageAvailable = false;
	}
	return this._sessionStorageAvailable;
};

/**
 * Returns whether the browser has cookies enabled.
 * @returns {Boolean} true if cookies are enabled.
 * @name module:ac-feature.cookiesAvailable
 * @kind function
 */
feature.cookiesAvailable = function () {
	// Memoize previously returned value
	if (typeof this._cookiesAvailable !== 'undefined') {
		return this._cookiesAvailable;
	}
	this._cookiesAvailable = (hasOwnProp.call(document, 'cookie') && !!navigator.cookieEnabled) ? true : false;
	return this._cookiesAvailable;
};


// Some devices swap the width/height when in landscape, so we want to make
// sure we're always reporting width as the lesser value. Except when the
// device isn't orientable, then we want to honor window.screen.width.
/** @ignore */
feature.__normalizedScreenWidth = function () {
	// We only care if the device is orientable
	if (typeof window.orientation === 'undefined') {
		return window.screen.width;
	}
	return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
};

/**
 * Tests for touch support on the device.
 * DocumentTouch is specific to Firefox <25 support.
 * @returns {Boolean} true if the device supports touch.
 * @name module:ac-feature.touchAvailable
 * @kind function
 */
feature.touchAvailable = function () {
	return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);
};

/**
 * Attempts to determine if device is a desktop. The test is based on the assumptions
 * that desktop machines don't support touch and aren't orientable
 * @returns {Boolean} true if device has no support for touch and orientation
 * @name module:ac-feature.isDesktop
 * @kind function
 */
feature.isDesktop = function () {
	if (!this.touchAvailable() && !window.orientation) {
		return true;
	}
	return false;
};

/**
 * Attempts to determine if device is handheld. e.g. phones and iPod Touches.
 * The test is based on the value of module:ac-feature.isDesktop() and
 * if the device screen width is less than or equal to 480 pixels.
 * @returns {Boolean} true if the device is determined to be handheld
 * @name module:ac-feature.isHandheld
 * @kind function
 */
feature.isHandheld = function () {
	return !this.isDesktop() && !this.isTablet();
};

/**
 * Attempts to determine if device is a tablet. i.e. iPad or Nexus 7.
 * The test is based on the value of module:ac-feature.isDesktop() and
 * if the device screen width is greater than 480 pixels.
 * @returns {Boolean} true if the device is determined to be a tablet
 * @name module:ac-feature.isTablet
 * @kind function
 */
feature.isTablet = function () {
	return !this.isDesktop() && this.__normalizedScreenWidth() > 480;
};

/**
 * Attempts to determine whether the display is retina.
 * @returns {Boolean} true if DPR is determined to be greater than or equal to 1.5
 * @name module:ac-feature.isRetina
 * @kind function
 */
feature.isRetina = function () {
	// Vendor prefixes and media queries for DPR detection are a mess
	var mediaQueryStrings = [
		'min-device-pixel-ratio:1.5',
		'-webkit-min-device-pixel-ratio:1.5',
		'min-resolution:1.5dppx',
		'min-resolution:144dpi',
		'min--moz-device-pixel-ratio:1.5'
	];
	var i;

	// Use devicePixelRatio if available
	if (window.devicePixelRatio !== undefined) {
		if (window.devicePixelRatio >= 1.5) {
			return true;
		}

	// Else resort to matchMedia
	} else {
		for (i = 0; i < mediaQueryStrings.length; i += 1) {
			if (window.matchMedia('(' + mediaQueryStrings[i] + ')').matches === true) {
				return true;
			}
		}
	}

	// Otherwise return false
	return false;
};

/**
 * Browser support for SVG in background images very closely matches that of SVG in <img> tags.
 * Detecting this feature checks for support as both inline and background images.
 * @returns {Boolean} true if SVG support is available
 * @name module:ac-feature.svgAvailable
 * @kind function
 */
feature.svgAvailable = function () {
	return document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#Image', '1.1');
};

module.exports = feature;

},{"./ac-feature/cssPropertyAvailable":31,"./ac-feature/localStorageAvailable":32}],31:[function(require,module,exports){
'use strict';

var style = null;
var prefixes = null;
var preFixes = null;
var css = null;

/**
 * Sets all the vendor specific style property to value on element.
 * @param {String} property The CSS property to test, can be of the form: webkitBorderRadius, mozBorderRadius, etc.; borderRadius -webkit-border-radius, -moz-border-radius, etc.; border-radius
 * @returns true if the current browser supports the given CSS property, otherwise, returns false.
 * @name module:ac-feature.cssPropertyAvailable
 * @kind function
 */
module.exports = function (property) {

	if (style === null) {
		style = document.createElement('browserdetect').style;
	}
	if (prefixes === null) {
		prefixes = ['-webkit-', '-moz-', '-o-', '-ms-', '-khtml-', ''];
	}
	if (preFixes === null) {
		preFixes = ['Webkit', 'Moz', 'O', 'ms', 'Khtml', ''];
	}
	if (css === null) {
		css = {};
	}

	property = property.replace(/([A-Z]+)([A-Z][a-z])/g, '$1\\-$2').replace(/([a-z\d])([A-Z])/g, '$1\\-$2').replace(/^(\-*webkit|\-*moz|\-*o|\-*ms|\-*khtml)\-/, '').toLowerCase();
	switch (property) {
	case 'gradient':
		if (css.gradient !== undefined) {
			return css.gradient;
		}

		property = 'background-image:';
		var value1 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
		var value2 = 'linear-gradient(left top,#9f9, white);';

		style.cssText = (property + prefixes.join(value1 + property) + prefixes.join(value2 + property)).slice(0, -property.length);
		css.gradient = (style.backgroundImage.indexOf('gradient') !== -1);
		return css.gradient;

	case 'inset-box-shadow':
		if (css['inset-box-shadow'] !== undefined) {
			return css['inset-box-shadow'];
		}

		property = 'box-shadow:';
		var value = '#fff 0 1px 1px inset;';

		style.cssText = prefixes.join(property + value);
		css['inset-box-shadow'] = (style.cssText.indexOf('inset') !== -1);
		return css['inset-box-shadow'];

	default:
		var properties = property.split('-');
		var length = properties.length;
		var Property;
		var i;
		var j;

		if (properties.length > 0) {
			property = properties[0];
			for (i = 1; i < length; i += 1) {
				property += properties[i].substr(0, 1).toUpperCase() + properties[i].substr(1);
			}
		}
		Property = property.substr(0, 1).toUpperCase() + property.substr(1);

		if (css[property] !== undefined) {
			return css[property];
		}

		for (j = preFixes.length - 1; j >= 0; j -= 1) {
			if (style[preFixes[j] + property] !== undefined || style[preFixes[j] + Property] !== undefined) {
				css[property] = true;
				return true;
			}
		}
		return false;
	}
};

},{}],32:[function(require,module,exports){
'use strict';

var isAvailable = null;

/**
 * Returns whether the browser supports HTML5 localStorage, and
 * does not have privacy mode enabled or cookies turned off.
 * NOTE: Does not support Firefox <= 13 because of a bug where Firefox interprets a nonexistent item as null instead of undefined
 * @returns {Boolean} true if the browser supports localStorage
 * @name module:ac-feature.localStorageAvailable
 * @kind function
 */
module.exports = function localStorageAvailable() {
	// Memoize previously returned value
	if (isAvailable === null) {
		isAvailable = !!(window.localStorage && window.localStorage.non_existent !== null);
	}
	return isAvailable;
};

},{}],33:[function(require,module,exports){
/**
 * Object#toString() ref for stringify().
 */

var toString = Object.prototype.toString;

/**
 * Object#hasOwnProperty ref
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Array#indexOf shim.
 */

var indexOf = typeof Array.prototype.indexOf === 'function'
  ? function(arr, el) { return arr.indexOf(el); }
  : function(arr, el) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === el) return i;
      }
      return -1;
    };

/**
 * Array.isArray shim.
 */

var isArray = Array.isArray || function(arr) {
  return toString.call(arr) == '[object Array]';
};

/**
 * Object.keys shim.
 */

var objectKeys = Object.keys || function(obj) {
  var ret = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret.push(key);
    }
  }
  return ret;
};

/**
 * Array#forEach shim.
 */

var forEach = typeof Array.prototype.forEach === 'function'
  ? function(arr, fn) { return arr.forEach(fn); }
  : function(arr, fn) {
      for (var i = 0; i < arr.length; i++) fn(arr[i]);
    };

/**
 * Array#reduce shim.
 */

var reduce = function(arr, fn, initial) {
  if (typeof arr.reduce === 'function') return arr.reduce(fn, initial);
  var res = initial;
  for (var i = 0; i < arr.length; i++) res = fn(res, arr[i]);
  return res;
};

/**
 * Cache non-integer test regexp.
 */

var isint = /^[0-9]+$/;

function promote(parent, key) {
  if (parent[key].length == 0) return parent[key] = {}
  var t = {};
  for (var i in parent[key]) {
    if (hasOwnProperty.call(parent[key], i)) {
      t[i] = parent[key][i];
    }
  }
  parent[key] = t;
  return t;
}

function parse(parts, parent, key, val) {
  var part = parts.shift();

  // illegal
  if (hasOwnProperty.call(Object.prototype, key)) return;

  // end
  if (!part) {
    if (isArray(parent[key])) {
      parent[key].push(val);
    } else if ('object' == typeof parent[key]) {
      parent[key] = val;
    } else if ('undefined' == typeof parent[key]) {
      parent[key] = val;
    } else {
      parent[key] = [parent[key], val];
    }
    // array
  } else {
    var obj = parent[key] = parent[key] || [];
    if (']' == part) {
      if (isArray(obj)) {
        if ('' != val) obj.push(val);
      } else if ('object' == typeof obj) {
        obj[objectKeys(obj).length] = val;
      } else {
        obj = parent[key] = [parent[key], val];
      }
      // prop
    } else if (~indexOf(part, ']')) {
      part = part.substr(0, part.length - 1);
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
      // key
    } else {
      if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
      parse(parts, obj, part, val);
    }
  }
}

/**
 * Merge parent key/val pair.
 */

function merge(parent, key, val){
  if (~indexOf(key, ']')) {
    var parts = key.split('[')
      , len = parts.length
      , last = len - 1;
    parse(parts, parent, 'base', val);
    // optimize
  } else {
    if (!isint.test(key) && isArray(parent.base)) {
      var t = {};
      for (var k in parent.base) t[k] = parent.base[k];
      parent.base = t;
    }
    set(parent.base, key, val);
  }

  return parent;
}

/**
 * Compact sparse arrays.
 */

function compact(obj) {
  if ('object' != typeof obj) return obj;

  if (isArray(obj)) {
    var ret = [];

    for (var i in obj) {
      if (hasOwnProperty.call(obj, i)) {
        ret.push(obj[i]);
      }
    }

    return ret;
  }

  for (var key in obj) {
    obj[key] = compact(obj[key]);
  }

  return obj;
}

/**
 * Parse the given obj.
 */

function parseObject(obj){
  var ret = { base: {} };

  forEach(objectKeys(obj), function(name){
    merge(ret, name, obj[name]);
  });

  return compact(ret.base);
}

/**
 * Parse the given str.
 */

function parseString(str){
  var ret = reduce(String(str).split('&'), function(ret, pair){
    var eql = indexOf(pair, '=')
      , brace = lastBraceInKey(pair)
      , key = pair.substr(0, brace || eql)
      , val = pair.substr(brace || eql, pair.length)
      , val = val.substr(indexOf(val, '=') + 1, val.length);

    // ?foo
    if ('' == key) key = pair, val = '';
    if ('' == key) return ret;

    return merge(ret, decode(key), decode(val));
  }, { base: {} }).base;

  return compact(ret);
}

/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * @param {String} str | {Object} obj
 * @return {Object}
 * @api public
 */

exports.parse = function(str){
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str);
};

/**
 * Turn the given `obj` into a query string
 *
 * @param {Object} obj
 * @return {String}
 * @api public
 */

var stringify = exports.stringify = function(obj, prefix) {
  if (isArray(obj)) {
    return stringifyArray(obj, prefix);
  } else if ('[object Object]' == toString.call(obj)) {
    return stringifyObject(obj, prefix);
  } else if ('string' == typeof obj) {
    return stringifyString(obj, prefix);
  } else {
    return prefix + '=' + encodeURIComponent(String(obj));
  }
};

/**
 * Stringify the given `str`.
 *
 * @param {String} str
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyString(str, prefix) {
  if (!prefix) throw new TypeError('stringify expects an object');
  return prefix + '=' + encodeURIComponent(str);
}

/**
 * Stringify the given `arr`.
 *
 * @param {Array} arr
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyArray(arr, prefix) {
  var ret = [];
  if (!prefix) throw new TypeError('stringify expects an object');
  for (var i = 0; i < arr.length; i++) {
    ret.push(stringify(arr[i], prefix + '[' + i + ']'));
  }
  return ret.join('&');
}

/**
 * Stringify the given `obj`.
 *
 * @param {Object} obj
 * @param {String} prefix
 * @return {String}
 * @api private
 */

function stringifyObject(obj, prefix) {
  var ret = []
    , keys = objectKeys(obj)
    , key;

  for (var i = 0, len = keys.length; i < len; ++i) {
    key = keys[i];
    if ('' == key) continue;
    if (null == obj[key]) {
      ret.push(encodeURIComponent(key) + '=');
    } else {
      ret.push(stringify(obj[key], prefix
        ? prefix + '[' + encodeURIComponent(key) + ']'
        : encodeURIComponent(key)));
    }
  }

  return ret.join('&');
}

/**
 * Set `obj`'s `key` to `val` respecting
 * the weird and wonderful syntax of a qs,
 * where "foo=bar&foo=baz" becomes an array.
 *
 * @param {Object} obj
 * @param {String} key
 * @param {String} val
 * @api private
 */

function set(obj, key, val) {
  var v = obj[key];
  if (hasOwnProperty.call(Object.prototype, key)) return;
  if (undefined === v) {
    obj[key] = val;
  } else if (isArray(v)) {
    v.push(val);
  } else {
    obj[key] = [v, val];
  }
}

/**
 * Locate last brace in `str` within the key.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function lastBraceInKey(str) {
  var len = str.length
    , brace
    , c;
  for (var i = 0; i < len; ++i) {
    c = str[i];
    if (']' == c) brace = false;
    if ('[' == c) brace = true;
    if ('=' == c && !brace) return i;
  }
}

/**
 * Decode `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function decode(str) {
  try {
    return decodeURIComponent(str.replace(/\+/g, ' '));
  } catch (err) {
    return str;
  }
}

},{}],34:[function(require,module,exports){
/** 
 * @module ac-object
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

module.exports = {
	clone: require('./ac-object/clone'),
	defaults: require('./ac-object/defaults'),
	extend: require('./ac-object/extend'),
	getPrototypeOf: require('./ac-object/getPrototypeOf'),
	isEmpty: require('./ac-object/isEmpty'),
	toQueryParameters: require('./ac-object/toQueryParameters')
};

},{"./ac-object/clone":35,"./ac-object/defaults":36,"./ac-object/extend":37,"./ac-object/getPrototypeOf":38,"./ac-object/isEmpty":39,"./ac-object/toQueryParameters":40}],35:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var extend = require('./extend');

/**
 * @name module:ac-object.clone
 *
 * @function
 * 
 * @desc Create a new Object that has the same properties as the original.
 *
 * @param {Object} object
 *        The Object to make a clone of.
 *
 * @returns {Object} The cloned object.
 */
module.exports = function clone (object) {
	return extend({}, object);
};

},{"./extend":37}],36:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var extend = require('./extend');

/**
 * @name module:ac-object.defaults
 *
 * @function
 * 
 * @desc Combines defaults and options into a new object and returns it.
 *
 * @param {Object} defaults
 *        The defaults object.
 *
 * @param {Object} options
 *        The options object.
 *
 * @returns {Object} An object resulting from the combination of defaults and options.
 */
module.exports = function defaults (obj, options) {
	if (typeof obj !== 'object' || typeof options !== 'object'){
		throw new TypeError('defaults: must provide a defaults and options object');
	}
	return extend({}, obj, options);
};

},{"./extend":37}],37:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.extend
 *
 * @function
 * 
 * @desc Add properties from one object into another. Not a deep copy.
 *
 * @param {Object} destination
 *        The object where the properties will end up. Properties in this Object
 *        that have the same key as properties in the source object will be
 *        overwritten with the source property’s value. If destination is not
 *        provided a blank object is created.
 *
 * @param {Object} source
 *        The properties to add / overwrite in the destination Object. An infinite
 *        number of source paramaters may be passed.
 *
 * @returns {Object} The extended object.
 */
module.exports = function extend () {
	var args;
	var dest;

	if (arguments.length < 2) {
		args = [{}, arguments[0]];
	} else {
		args = [].slice.call(arguments);
	}

	dest = args.shift();

	args.forEach(function (source) {
		if (source != null) {
			for (var property in source) {
				// Anything that does not prototype Object will not have this method
				if (hasOwnProp.call(source, property)) {
					dest[property] = source[property];
				}
			}
		}
	});

	return dest;	
};

},{}],38:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.getPrototypeOf
 *
 * @function
 * 
 * @desc Returns the prototype (i.e. the internal [[Prototype]]) of the specified object.
 *
 * @param {Object} obj
 *        The object whose prototype is to be returned.
 *
 * @returns {Object} The prototype of the specified object.
 */
module.exports = function getPrototypeOf (obj) {
	if (Object.getPrototypeOf) {
		return Object.getPrototypeOf(obj);
	}
	else {
		if (typeof obj !== 'object') {
			throw new Error('Requested prototype of a value that is not an object.');
		}
		else if (typeof this.__proto__ === 'object') {
			return obj.__proto__;
		}
		else {
			var constructor = obj.constructor;
			var oldConstructor;
			if (hasOwnProp.call(obj, 'constructor')) {
				oldConstructor = constructor;
				// reset constructor
				if (!(delete obj.constructor)) {
					// can't delete obj.constructor, return null
					return null;
				}
				// get real constructor
				constructor = obj.constructor;
				// restore constructor
				obj.constructor = oldConstructor;
			}
			// needed for IE
			return constructor ? constructor.prototype : null;
		}
	}
};

},{}],39:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * @name module:ac-object.isEmpty
 *
 * @function
 * 
 * @desc Check if an empty object.
 *
 * @param {Object} object
 *        The Object to check if empty.
 *
 * @returns {Boolean} Return true if and only if object is empty ({}).
 */
module.exports = function isEmpty (object) {
	var prop;

	if (typeof object !== 'object') {
		throw new TypeError('ac-base.Object.isEmpty : Invalid parameter - expected object');
	}

	for (prop in object) {
		if (hasOwnProp.call(object, prop)) {
			return false;
		}
	}

	return true;
};

},{}],40:[function(require,module,exports){
/** 
 * @copyright 2014 Apple Inc. All rights reserved.
 */
'use strict';

/** @ignore */
var qs = require('qs');

/**
 * @name module:ac-object.toQueryParameters
 *
 * @function
 * 
 * @desc Convert object to query string.
 *
 * @param {Object} object
 *        The Object to convert to a query string.
 *
 * @returns {String} Returns query string representation of object.
 */
module.exports = function toQueryParameters (object) {
	if (typeof object !== 'object'){
		throw new TypeError('toQueryParameters error: argument is not an object');
	}
	return qs.stringify(object);
};

},{"qs":33}],41:[function(require,module,exports){
'use strict';

module.exports = (function () {

	var ac_Element = require('ac-element');
	var ac_Object  = require('ac-object');
	var ac_Browser = require('ac-browser');
	var events     = require('ac-dom-events');
	var MobileMenu = require('./mobile-menu/MobileMenu');
	var viewport   = require('./helpers/viewport');

	// If no HTML5 shim is present, IE8 and below need the nav element
	require('./polyfills/nav');

	// Init search after the nav polyfill
	var SearchInit = require('gh-searchInit');

	// DOM elements
	var globalheader      = document.getElementById('globalheader');
	var mobileMenuElement = ac_Element.select('.gh-menu', globalheader);

	var defaultFontSize = 18;

	// Add class for IE7/8 specific styles
	var oldie = (ac_Browser.IE && ac_Browser.IE.documentMode < 9);

	if (oldie) {
		ac_Element.addClassName(globalheader,'gh-oldie');
	}

	// Init mobile menu if it exists
	if (mobileMenuElement) {
		new MobileMenu(mobileMenuElement);
	}

	// Update the scale of the nav
	// Sets a new font size on .globalheader-wrapper to scale nav
	function updateScale () {
		if (viewport.shouldScale()) {
			// calculate new font scale
			var newFontSize = (viewport.getScale() * defaultFontSize) + 'px';
			// set new font size to scale nav
			ac_Element.setStyle(globalheader, {'font-size' : newFontSize});
		}
	}
	updateScale();

	// Update ethe scale of the nav if device is rotated
	events.addEventListener(window, 'orientationchange', updateScale);

}());


},{"./helpers/viewport":46,"./mobile-menu/MobileMenu":47,"./polyfills/nav":48,"ac-browser":20,"ac-dom-events":27,"ac-element":"j0qjr8","ac-object":34,"gh-searchInit":"oDi/Uh"}],42:[function(require,module,exports){
'use strict';

var matchMedia = window.matchMedia || window.msMatchMedia;

function getInit(init) {
	if(0 < init ){
		if (unit) {
			return +init;
		} else {
			return init>>0;
		}
	} else {
		return 1;
	}
}

function getStep(step, unit) {
	if ( 0 < step) {
		return +step;
	} else {
		if( 0 > step ) {
			return -step
		} else {
			if('px' == unit) {
				return 256
			} else {
				if(unit) {
					return 32
				} else {
					return 1
				}
			}
		}
	}
}

function mediaQuery(queryString) {
	if(matchMedia) {
		return !!matchMedia(queryString).matches;
	} else {
		return false;
	}
}

/**
	* derived from https://github.com/ryanve/actual
	* @param {string} name Name e.g. "width"
	* @param {string=} unit CSS unit for name e.g. "em"
	* @param {number=} init initial guess
	* @param {number=} step size for iterations
	* @return {number} breakpoint (0 if invalid unit or name)
*/
function device(name, unit, init, step) {
	var up;
	var gte;
	var lte;
	var curr;

	unit = typeof unit == 'string' ? unit : '';
	init = getInit(init);
	step = getStep(step, unit);

	for (curr = init; 0 <= curr; curr = curr+step) {
		lte = mediaQuery('(min-' + name + ':' + curr + unit + ')');
		gte = mediaQuery('(max-' + name + ':' + curr + unit + ')');

		// Final match
		if (lte && gte) {
			return mediaQuery('(' + name + (curr>>0) + unit) ? curr>>0 : curr;
		}

		// First iteration
		if (null == up) {
			step = (up = !gte) ? lte && step : -step;
		}

		// Later iterations
		else if (gte ? up : !up) {
			up = !up;
			step = -step/2;
		}
	}

	// failed to find a match, return zero
	return 0;
}

module.exports = device;

},{}],43:[function(require,module,exports){
module.exports = {
	BACKSPACE:8,
	TAB:9,
	ENTER:13,
	SHIFT:16,
	CONTROL:17,
	ALT:18,
	COMMAND:91,
	CAPSLOCK:20,
	ESCAPE:27,
	PAGE_UP:33,
	PAGE_DOWN:34,
	END:35,
	HOME:36,
	ARROW_LEFT:37,
	ARROW_UP:38,
	ARROW_RIGHT:39,
	ARROW_DOWN:40,
	DELETE:46,
	ZERO:48,
	ONE:49,
	TWO:50,
	THREE:51,
	FOUR:52,
	FIVE:53,
	SIX:54,
	SEVEN:55,
	EIGHT:56,
	NINE:57,
	A:65,
	B:66,
	C:67,
	D:68,
	E:69,
	F:70,
	G:71,
	H:72,
	I:73,
	J:74,
	K:75,
	L:76,
	M:77,
	N:78,
	O:79,
	P:80,
	Q:81,
	R:82,
	S:83,
	T:84,
	U:85,
	V:86,
	W:87,
	X:88,
	Y:89,
	Z:90,
	NUMPAD_ZERO:96,
	NUMPAD_ONE:97,
	NUMPAD_TWO:98,
	NUMPAD_THREE:99,
	NUMPAD_FOUR:100,
	NUMPAD_FIVE:101,
	NUMPAD_SIX:102,
	NUMPAD_SEVEN:103,
	NUMPAD_EIGHT:104,
	NUMPAD_NINE:105,
	NUMPAD_ASTERISK:106,
	NUMPAD_PLUS:107,
	NUMPAD_DASH:109,
	NUMPAD_DOT:110,
	NUMPAD_SLASH:111,
	NUMPAD_EQUALS:187,
	TICK:192,
	LEFT_BRACKET:219,
	RIGHT_BRACKET:221,
	BACKSLASH:220,
	SEMICOLON:186,
	APOSTRAPHE:222,
	SPACEBAR:32,
	CLEAR:12,
	COMMA:188,
	DOT:190,
	SLASH:191
};

},{}],44:[function(require,module,exports){
var ac_Element = require('ac-element');

// set the defaults for these so the aren't hard coded
// since they're used in a few places
var globalheader = document.getElementById('globalheader');



var searchSection = (function () {
	var selected;

	if (globalheader) {
		selected = globalheader.className.match(/gh-selected-tab-(\w*)/);
		if (selected && selected.length === 2) {
			return selected[1];
		}
	}
	return 'global';
}());



var specialSearchCountries = {
	'fr-be': 'be_fr',
	'nl-be': 'be_nl',
	'en-ca': 'ca_en',
	'fr-ca': 'ca_fr',
	'de-ch': 'ch_de',
	'fr-ch': 'ch_fr',
	'en-hk': 'hk_en',
	'en-gb': 'uk',    /* SMUI 8/28/14: add. */
	'en-419': 'lae',   /* SMUI 8/27/14: add. */
	'es-419': 'la',   /* SMUI 8/27/14: add. */
	'en-ap': 'asia',  /* SMUI 8/27/14: add. */
	'en-ph': 'asia',
	'en-vn': 'asia'
};

var searchCountry = (function () {
	var langLocale, countrycode;
	if (globalheader) {

		langLocale = globalheader.getAttribute('lang').toLocaleLowerCase();

		if (langLocale) {
			if (specialSearchCountries[langLocale]) {
				// see if were a special search country
				countrycode = specialSearchCountries[langLocale];
			} else {
				// otherwise return country
				countrycode = langLocale.split('-')[1];
			}
			return  countrycode;
		}
	}
}());



var searchHost = (function () {
	return window.searchHost || false;
}());



module.exports = {
	searchSection: searchSection,
	searchCountry: searchCountry,
	searchHost: searchHost
};

},{"ac-element":"j0qjr8"}],45:[function(require,module,exports){
'use strict';

var proto;
var NS_String = "http://www.w3.org/2000/svg";
var SupportsNS = !!document.createElementNS;

var SVG = function (wrapper, width, viewBox, classNames) {
	if(SupportsNS) {
		var svgElement = document.createElementNS(NS_String, 'svg');
		svgElement = document.createElementNS(NS_String, 'svg');
		svgElement.setAttributeNS(null, 'x', '0px');
		svgElement.setAttributeNS(null, 'y', '0px');
		svgElement.setAttributeNS(null, 'width', width);
		svgElement.setAttributeNS(null, 'viewBox', viewBox);
		svgElement.setAttributeNS(null, 'class', classNames);
		svgElement.setAttributeNS(null, 'enable-background', 'new ' + viewBox);
		this.svgElement = svgElement;
		this.wrapper = wrapper;
	}
}

proto = SVG.prototype;

proto.addRect = function (x, y, width, height, classNames) {
	if(SupportsNS && this.svgElement && this.wrapper) {
		var rectElement = document.createElementNS(NS_String, 'rect');
		rectElement.setAttributeNS(null, 'width', width);
		rectElement.setAttributeNS(null, 'height', height);
		rectElement.setAttributeNS(null, 'x', x);
		rectElement.setAttributeNS(null, 'y', y);
		rectElement.setAttributeNS(null, 'class', classNames);
		this.svgElement.appendChild(rectElement);
		this.wrapper.appendChild(this.svgElement);
	}
};

module.exports = SVG;

},{}],46:[function(require,module,exports){
(function () {
	'use strict';

	var device = require('./device');

	var legacyViewportWidth = 1024;
	var ipadPortraitScreenWidth = 768;
	var viewportWidth = document.documentElement.clientWidth;

	function normalizedScreenWidth () {
		// We only care if the device is orientable
		if (typeof window.orientation === 'undefined') {
			return window.screen.width;
		}
		return window.screen.width < window.screen.height ? device('device-width', 'px') : device('device-height', 'px');
	};

	function normalizedScreenHeight () {
		// We only care if the device is orientable
		if (typeof window.orientation === 'undefined') {
			return window.screen.height;
		}
		return window.screen.height > window.screen.width ? device('device-height', 'px') : device('device-width', 'px');
	};

	function screenWidth () {
		var portrait = (window.orientation === 0) ? true : false;
		if (portrait) {
			return normalizedScreenWidth();
		} else {
			return normalizedScreenHeight();
		}
	};

	function shouldScale () {
		var isScaled = viewportWidth === legacyViewportWidth;
		var smallerThanIpad = screenWidth() < ipadPortraitScreenWidth;
		return (isScaled && smallerThanIpad);
	};

	function getScale () {
		return legacyViewportWidth / screenWidth();
	};


	module.exports = {
		normalizedScreenWidth : normalizedScreenWidth,
		normalizedScreenHeight : normalizedScreenHeight,
		screenWidth : screenWidth,
		shouldScale : shouldScale,
		getScale : getScale
	};

})();

},{"./device":42}],47:[function(require,module,exports){
'use strict';

var ac_Element = require('ac-element');
var ac_Feature = require('ac-feature');
var events = require('ac-dom-events');
var SVG = require('../helpers/svg');

var proto;
var classNames = {
	menu: 'gh-show-nav',
	closeImmediately: 'gh-immediate',
	cart: 'gh-show-cart',
	animateList: 'gh-nav-reveal',
	menuIconTop: 'gh-svg gh-svg-top',
	menuIconBottom: 'gh-svg gh-svg-bottom',
	rectTop: 'gh-svg-rect gh-svg-rect-top',
	rectBottom: 'gh-svg-rect gh-svg-rect-bottom',
	enhance: 'enhance'
};

var idNames = {
	navList: 'gh-nav-list'
};

var MobileMenu = function (mobileMenuElement) {
	this.mobileMenuElement = mobileMenuElement;
	this.globalheader = ac_Element.select('#globalheader');
	this.documentBody = ac_Element.select('body');
	this.navList = ac_Element.select('.gh-nav-list', this.globalheader);

	this.icons = {};
	this.icons.menu = ac_Element.select('#gh-menu-icon-toggle');
	this.icons.svgs = ac_Element.select('#gh-svg-icons');
	this.icons.cart = ac_Element.select('#gh-menu-icon-cart');

	if (ac_Feature.threeDTransformsAvailable()) {
		ac_Element.addClassName(this.icons.menu, classNames.enhance);
		new SVG(this.icons.svgs, '100%', '0 0 96 96', classNames.menuIconTop).addRect(32, 46, 32, 4, classNames.rectTop);
		new SVG(this.icons.svgs, '100%', '0 0 96 96', classNames.menuIconBottom).addRect(32, 46, 32, 4, classNames.rectBottom);
	}

	if (this.icons.menu) {
		this.decorateAria();
	}

	if (this.icons.menu || this.icons.cart) {
		this.attachEvents();
	}
};

proto = MobileMenu.prototype;

proto.attachEvents = function () {

	if (this.icons.menu) {
		// menu
		events.addEventListener(this.icons.menu, 'click', function () {
			ac_Element.removeClassName(this.documentBody, classNames.closeImmediately);
			ac_Element.toggleClassName(this.documentBody, classNames.menu);

			this.toggleAriaExpanded();

			// only animate the globalnav list on the first menu tap
			if (!ac_Element.hasClassName(this.globalheader, classNames.animateList)) {
				ac_Element.addClassName(this.globalheader, classNames.animateList);
			}
			events.stop();
		}.bind(this), false);
	}

	if (this.icons.cart) {
		// cart
		events.addEventListener(this.icons.cart, 'click', function () {
			ac_Element.toggleClassName(this.documentBody, classNames.cart);
			events.stop();
		}.bind(this), false);
	}

	// close the nav instantly when sometihng other than globalheader is touched
	events.addEventListener(document, 'touchstart', function (e) {

		if(this.isOpen() === false) {
			return;
		}

		var elementTouched = ac_Element.ancestor(e.srcElement, '#globalheader');

		if(e.srcElement !== this.globalheader && elementTouched !== this.globalheader) {
			ac_Element.removeClassName(this.documentBody, classNames.menu);
			ac_Element.addClassName(this.documentBody, classNames.closeImmediately);
		}
	}.bind(this), false);

};

proto.decorateAria = function () {
	var pageHasMenu = ac_Element.getStyle(this.mobileMenuElement,'display') !== 'none';
	var pageHasMenuButton = ac_Element.getStyle(this.icons.menu,'display') !== 'none';

	if (pageHasMenu && pageHasMenuButton) {
		this.icons.svgs.setAttribute('aria-controls', '#' + idNames.navList);
		this.icons.svgs.setAttribute('aria-expanded', 'false');
		this.navList.setAttribute('aria-hidden', 'true');
		this.navList.id = idNames.navList;
	}
};

proto.toggleAriaExpanded = function () {
	var menuState = this.icons.svgs.getAttribute('aria-expanded');

	if (menuState === 'false') {
		this.icons.svgs.setAttribute('aria-expanded', 'true');
		this.navList.setAttribute('aria-hidden', 'false');
	} else {
		this.icons.svgs.setAttribute('aria-expanded', 'false');
		this.navList.setAttribute('aria-hidden', 'true');
	}
}

proto.isOpen = function () {
	return ac_Element.hasClassName(this.documentBody , classNames.menu);
};


module.exports = MobileMenu;

},{"../helpers/svg":45,"ac-dom-events":27,"ac-element":"j0qjr8","ac-feature":30}],48:[function(require,module,exports){
'use strict';

module.exports = (function () {

	var globalheader = document.getElementById('globalheader');
	var i, len, clone, content;

	if (globalheader.innerHTML === '') {
		clone = document.createElement('div');
		for (i = 0, len = globalheader.attributes.length; i < len; i += 1) {
			if (globalheader.attributes[i].value !== '' && globalheader.attributes[i].value !== 'null' && globalheader.attributes[i].value !== 'false') {
				clone.setAttribute(globalheader.attributes[i].name, globalheader.attributes[i].value);
			}
		}
		clone.className = globalheader.className;

		content = globalheader.nextSibling;
		content.parentNode.removeChild(content);
		clone.appendChild(content);

		globalheader.parentNode.replaceChild(clone, globalheader);

		return clone;
	}

	return globalheader;

}());

},{}],49:[function(require,module,exports){
'use strict';

var proto;
var utils = {};

var ac_Element    = require('ac-element');
var ac_Object     = require('ac-object');
var EventEmitter  = require('ac-event-emitter').EventEmitter;
var events        = require('ac-dom-events');
var searchGlobals = require('../helpers/searchGlobals');
var geoMap        = require('./lang/geoMap');
var keyboardKeys  = require('../helpers/keys');

// searchGlobals.searchHost only gets set to true on apple.com development environments
// so if we're on say ic10.apple.com searchGlobals.searchHost would be true which means we
// can rewrite anthing hardcoded to www.apple.com/* to ic10.apple.com/* 
var environment = (searchGlobals.searchHost !== false) ? window.location.protocol + '//' + window.location.hostname : window.location.protocol + '//' + 'www.apple.com';


// ac-dom-events does not have a method that only stops propagation
events.stopPropagation = function (e) {
	if (!e) {
		e = window.event;
	}

	if (e.stopPropagation) {
		e.stopPropagation();
	} else {
		e.cancelBubble = true;
	}
};

var classNames = {
	active:  'active',
	enhance: 'enhance'
};


var eventNames = {
	active:      'active',
	inactive:    'inactive',
	valueUpdate: 'valueUpdate',
	reset:       'reset',
	submit:      'submit'
};


/**
 * Sets up the search tab to expand and close on user interaction
 */
var SearchInput = function (container) {
	// the container is the #gn-search list item
	this.container       = container;
	this.searchFormWrapper   = document.getElementById('gh-search');
	this.searchInput     = document.getElementById('gh-search-input');
	this.reset           = document.getElementById('gh-search-reset');
	this.submit          = document.getElementById('gh-search-submit');
	this.form            = document.getElementById('gh-search-form');
	this.formAction      = this.form.getAttribute('action');
	this.searchInputName = this.searchInput.getAttribute('name');

	this.active   = false;
	this.hasValue = false;

	if (this._shouldEnhance()) {
		this._enhance();
	}

	// we need to set the action on each form
	//for each geo using searchGlobals
	this.setFormAction();
	
	/* SMUI 8/25/14: add. set data attributes. */
	this.setDataAttributes();

	// we need to append some extra query paramaters
	// to a search using searchGlobals
	this.setFullSearchURL();
};


SearchInput.prototype = new EventEmitter();


proto = SearchInput.prototype;


// event handlers
proto._addEventListeners = function () {
	var body = ac_Element.select('body');

	// container
	events.addEventListener(this.container, 'click', this._boundOnContainerClick);
	events.addEventListener(this.container, 'mouseenter', this._boundOnMouseEnter);
	events.addEventListener(this.container, 'mouseleave', this._boundOnMouseLeave);
	// for tablets, we still need to enable the submit
	// but there is no 'mouseout' equivalent, so we don't care about that
	events.addEventListener(this.container, 'touchstart', this._boundOnMouseEnter);
	events.addEventListener(this.form, 'submit', this._boundOnSubmit);


	// input element
	events.addEventListener(this.searchInput, 'focus', this._boundOnFocus);
	events.addEventListener(this.searchInput, 'click', this._boundOnSearchInputClick);
	events.addEventListener(this.searchInput, 'keyup', this._boundOnKeyUp);
	events.addEventListener(this.searchInput, 'keydown', this._boundOnKeyDown);

	// submit button
	events.addEventListener(this.submit, 'blur', this._boundOnBlur);
	events.addEventListener(this.submit, 'focus', this._boundOnFocus);
	events.addEventListener(this.submit, 'click', this._boundOnSubmitClick);

	// reset button
	events.addEventListener(this.reset, 'blur', this._boundOnBlur);
	events.addEventListener(this.reset, 'focus', this._boundOnFocus);
	events.addEventListener(this.reset, 'click', this._boundOnResetClick);

	// body
	events.addEventListener(body, 'click', this._boundOnBodyClick);
	events.addEventListener(body, 'keyup', this._boundOnBodyKeyUp);
};


// bound handlers for easy add/removal
proto._bindEventHandlers = function () {
	this._boundOnContainerClick   = this._onContainerClick.bind(this);
	this._boundOnSearchInputClick = this._onSearchInputClick.bind(this);
	this._boundOnFocus            = this._onFocus.bind(this);
	this._boundOnBlur             = this._onBlur.bind(this);
	this._boundOnSubmit           = this._onSubmit.bind(this);
	this._boundOnMouseEnter       = this._onMouseEnter.bind(this);
	this._boundOnMouseLeave       = this._onMouseLeave.bind(this);
	this._boundOnSubmitClick      = this._onSubmitClick.bind(this);
	this._boundOnResetClick       = this._onResetClick.bind(this);
	this._boundOnKeyUp            = this._onKeyUp.bind(this);
	this._boundOnKeyDown          = this._onKeyDown.bind(this);
	this._boundOnBodyClick        = this._onBodyClick.bind(this);
	this._boundOnBodyKeyUp        = this._onBodyKeyUp.bind(this);
};


proto._addEventEmitterHandlers = function () {
	this.on(eventNames.active,      this._onActive);
	this.on(eventNames.inactive,    this._onInactive);
};


/**
 * DOM Event handlers
 */
proto._onFocus = function (e) {
	if (!this.active && !this._isEnhancedDisabled()) {
		this.trigger(eventNames.active);
	}
};


proto._onBlur = function (e) {
	// need to delay here in order to allow browser to properly set document.activeElement
	window.setTimeout(function () {
		if (!this._formHasFocus()) {
			this.trigger(eventNames.inactive);
		}
	}.bind(this), 1);
};


proto._onKeyUp = function (e) {
	events.stop(e);

	var prop, keyEvt = {};
	for (prop in e) {
		keyEvt[prop] = e[prop];
	}

	this._onValueUpdate(keyEvt);
	this.trigger(eventNames.valueUpdate, keyEvt);
};


proto._onKeyDown = function (e) {
	if(e.keyCode === keyboardKeys.ARROW_UP || e.keyCode === keyboardKeys.ARROW_DOWN) {
		if (e.preventDefault) {
			e.preventDefault();
		}
	}
};


proto._onBodyKeyUp = function (e) {
	// input field does not capture keyup event with TAB
	// so we have to listen for it here and act accordingly
	if (this.active && e.keyCode === keyboardKeys.TAB) {
		this._onBlur();
	}
};


proto._onBodyClick = function (e) {
	if (this.active) {
		this.trigger(eventNames.inactive);
	}
};


proto._onContainerClick = function (e) {
	events.stopPropagation(e);
	if (!this.active && !this._isEnhancedDisabled()) {
		this.trigger(eventNames.active);
	}
};


proto._onSearchInputClick = function (e) {
	// empty for now
};


proto._onSubmit = function(e) {
	events.stop(e);

	if (this.active) {
		this.trigger(eventNames.submit, e);
		this._onValueSubmit();
	}
};


proto._onSubmitClick = function (e) {
	// prevent submission if not enabled
	if (!this.active && !this._isEnhancedDisabled()) {
		e.preventDefault();
	}
};


proto._onResetClick = function (e) {
	this._resetField();
	this.searchInput.focus();
	
	/* SMUI 8/28/14 add for search analytics */
	/* from ACShortcuts.js */
	var disableSuggestedSearches = geoMap[searchGlobals.searchCountry.toUpperCase()].disableSuggestedSearches;
	var searchText = 'ipad';
	window.setTimeout(function() {
		if (disableSuggestedSearches !== true){
			var feedStats = new ACFeedStatistics();
			var store = new Persist.Store('FeedStats');
			store.set('resultActivity', false);
			feedStats.updateNotViewedForSuggestedSearch(searchText);
		}
	}, 10);
};


proto._onMouseEnter = function (e) {
	if (!this.active && !this._isEnhancedDisabled()) {
		this._enableSubmit();
	}
};


proto._onMouseLeave = function (e) {
	if (!this.active && !this._isEnhancedDisabled()) {
		this._disableSubmit();
	}
};


proto._inputHasValue = function () {
	return this.searchInput.value.length && this.searchInput.value.length > 0;
};


/**
 * Event Emitter Handlers
 */
proto._onActive = function (e) {
	if (!this.active) {
		this._enable();
	}
};


proto._onInactive = function (e) {
	if (this.active) {
		this._disable();
	}
};


proto._onValueUpdate = function (keyEvt) {
	this.setSearchTerm(this.searchInput.value);
	var pressedKey = keyEvt.keyCode;

	if (pressedKey === keyboardKeys.ESCAPE && this._inputHasValue) {
		this._resetField(keyEvt);
		// if we've hit the esc key, reset our input
	} else if (pressedKey === keyboardKeys.TAB) {
		// if tab key, then run blur handler
		this._onBlur();
	// we only need to enable the reset button when going from no value to value
	} else if (!this.hasValue && this._inputHasValue()) {
		this.hasValue = true;
		this._enableReset();
		this._enableSubmit();
	} else if (!this._inputHasValue()) {
		this.hasValue = false;
		this._disableReset();
		this._disableSubmit();
	}
};


proto._onValueSubmit = function () {
	this.reassignURL(this.getFullSearchURL() + this.getSearchTermEncoded());
};


proto.reassignURL = function (url) {
	document.location.assign(url);
};


/**
 * methods to manage the form elements
 */
proto._formHasFocus = function () {
	var focus = this.form.contains(document.activeElement);
	return focus;
};


proto._enableSubmit = function () {
	this.submit.removeAttribute('disabled');
};


proto._disableSubmit = function () {
	this.submit.setAttribute('disabled', 'disabled');
};


proto._enableReset = function () {
	this.reset.removeAttribute('disabled');
	ac_Element.addClassName(this.reset, 'show');
};


proto._disableReset = function () {
	this.reset.setAttribute('disabled', 'disabled');
	ac_Element.removeClassName(this.reset, 'show');
};


proto._resetField = function () {
	this.trigger(eventNames.reset);
	this.searchInput.value = '';
	this._disableReset();
	this._disableSubmit();
	this.hasValue = false;
};


proto._enhance = function () {
	this._bindEventHandlers();
	this._addEventEmitterHandlers();
	this._addEventListeners();
	ac_Element.addClassName(this.container, classNames.enhance);
	this.enhanced = true;
};


proto._shouldEnhance = function () {
	var touchAvailable = !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof window.DocumentTouch));
	return !touchAvailable && !window.orientation;
};


/**
 * Enable/Disable the entire search field
 */
proto._disable = function () {
	if (ac_Element.hasClassName(this.container, classNames.active)) {
		ac_Element.removeClassName(this.container, classNames.active);
	}
	this._resetField();
	this.active = false;
};


proto._enable = function () {
	if (!ac_Element.hasClassName(this.container, classNames.active)) {
		ac_Element.addClassName(this.container, classNames.active);
	}
	this.active = true;
	this.searchInput.focus();
	this._resetField();
};

/**
 * Getters / Setters and convenience methods
 */

proto._isEnhancedDisabled = function () {
	return ac_Element.getStyle(this.searchFormWrapper, 'display') === 'none';
};

// set our internal reference the input.value
proto.setSearchTerm = function (string) {
	this._searchTerm = this.trimWhitespace(string);
};


// return our internal reference the input.value
proto.getSearchTerm = function () {
	return this._searchTerm;
};


// return our encoded version of our internal
// reference the input.value
proto.getSearchTermEncoded = function () {
	return encodeURIComponent(this.getSearchTerm());
};


proto.inputHasValidText = function () {
	if (!this.searchInput.value.match(/^\s*$/)) {
		return true;
	}

	return false;
};


// removes leading and trailing whitespace, and coverts remaining multiple spaces in into a single space
proto.trimWhitespace = function (string) {
	if (typeof string !== 'string') {
		return;
	}
	return string.replace(/^\s+/g, '').replace(/\s+$/g, '').replace(/\s+/g, ' ');
};


proto.setFormAction = function () {
	var countryDirectory;

	if (geoMap[searchGlobals.searchCountry.toUpperCase()].directory) {
		// use specified country directory
		 countryDirectory = geoMap[searchGlobals.searchCountry.toUpperCase()].directory;
	} else if (searchGlobals.searchCountry !== 'us') {
		// use /countrycode logic
		countryDirectory = '/' + searchGlobals.searchCountry.replace(/_/, '');
	} else {
		// **** assume us, which has no country code in path
		countryDirectory = '';
	}

	// rewrite the form action
	/* SMUI 8/19/14: hide. our form action is different. plus change protocol. */
	//this.formAction = environment + countryDirectory + this.formAction;
	this.formAction = this.formAction.replace(/^https?\:/i, window.location.protocol);

	this.form.setAttribute('action', this.formAction);
};

/* SMUI 8/25/2014: add. add data attributes contain search configs. */
proto.setDataAttributes = function () {
	var geo = geoMap[searchGlobals.searchCountry.toUpperCase()];
	if (geo && geo.code !== undefined) {
		var geo_code = (geo.code === '') ? 'us' : geo.code.toLowerCase();
		this.form.setAttribute('data-search-country-code', geo_code);
	}
	if (geo && geo.disableSuggestedSearches !== true) {
		this.form.setAttribute('data-search-suggested-searches', '{"url":"'+this.formAction+'","requestName":"suggestedSearches","queryName":"queryVal","queryParams":{"page":"aisuggestions","model":"Support","locale":"'+(this.form.locale?this.form.locale.value:'en_US')+'","callback":"SearchShortcut.loadAIResults"},"dataType":"json"}');
	}
	if (geo && geo.disableQuickLinks !== true) {
		this.form.setAttribute('data-search-recommended-results', '{"url":"'+this.formAction+'","requestName":"recommendedResults","queryName":"q","queryParams":{"page":"suggest","locale":"'+(this.form.locale?this.form.locale.value:'en_US')+'","callback":"SearchShortcut.loadJson"},"dataType":"json"}');
	}
};

proto.setFullSearchURL = function () {
	/* SMUI 8/18/14: replace. Support search params */
	//var searchGlobalParams = ac_Object.toQueryParameters({
	//	section:searchGlobals.searchSection,
	//	geo:searchGlobals.searchCountry
	//});
	var searchGlobalParams = ac_Object.toQueryParameters({
		page:this.form.page?this.form.page.value:'search',
		src:this.form.src?this.form.src.value:'support_site.globalheader.search',
		locale:this.form.locale?this.form.locale.value:'en_US'
	});

	this._fullSearchURL = this.formAction + '?' + searchGlobalParams + '&' + this.searchInputName + '=';
};


proto.getFullSearchURL = function () {
	return this._fullSearchURL;
};


module.exports = SearchInput;

},{"../helpers/keys":43,"../helpers/searchGlobals":44,"./lang/geoMap":56,"ac-dom-events":27,"ac-element":"j0qjr8","ac-event-emitter":28,"ac-object":34}],50:[function(require,module,exports){
/*global require, module*/

// dependencies
var ac_Ajax       = require('ac-ajax');
var ac_Deferred   = require('ac-deferred');
var ac_Element    = require('ac-element');
var ac_Object     = require('ac-object');
var ac_Promise    = ac_Deferred.Deferred;
var EventEmitter  = require('ac-event-emitter').EventEmitter;
var keyboardKeys  = require('../../helpers/keys');

// A class for managing Ajax requests to multiple data sources and passing along the returned data
var EnhancedSearch = function (searchForm, searchServices) {
	if (!searchForm) { throw 'Please provide a searchForm'; }
	this.searchForm = searchForm;


	if (!searchServices) { throw 'Please provide data sources'; }
	searchServices.forEach(function (dataSource) {
		if(!dataSource.hasOwnProperty('url') && !dataSource.hasOwnProperty('requestName')){
			throw 'Please provide "url" and "requestName"';
		}
	});
	this._searchServices = searchServices;


	// modify the input to remove all 'auto-' type attributes
	this._decorateInput();


	this._addEventHandlers();
};

var proto = EnhancedSearch.prototype = new EventEmitter();


// Remove the search input default behavior since we're going to offer our own suggestions
proto._decorateInput = function () {
	this.searchForm.searchInput.setAttribute('autocomplete', 'off');
	this.searchForm.searchInput.setAttribute('autocorrect', 'off');
	this.searchForm.searchInput.setAttribute('autocapitalize', 'off');

	this.searchForm.form.setAttribute('role', 'search');
};


proto._addEventHandlers = function () {
	// propagate events up
	this.searchForm.propagateTo(this);
};


proto._handleKeyEvents = function (evt) {
	switch (evt.type) {
		case 'keyup':
			this._handleKeyUp(evt);
			break;
		default:
		  return;
	}
};


proto._handleReset = function (evt) {
	//something to bail from the requests maybe?
};




proto._handleKeyUp = function (evt) {
	var pressedKey = evt.keyCode;

	if (
		// only make data requests if:
		// - input has a value
		// - input value isn't just whitespace
		// - the key pressed isn't one of the
		//   following back listed keys:
		pressedKey !== keyboardKeys.ARROW_LEFT &&
		pressedKey !== keyboardKeys.ARROW_RIGHT &&
		pressedKey !== keyboardKeys.ARROW_UP &&
		pressedKey !== keyboardKeys.ARROW_DOWN &&
		pressedKey !== keyboardKeys.ESCAPE &&
		pressedKey !== keyboardKeys.CONTROL &&
		pressedKey !== keyboardKeys.ALT &&
		pressedKey !== keyboardKeys.CAPSLOCK &&
		pressedKey !== keyboardKeys.ENTER &&
		this.searchForm._inputHasValue() &&
		this.searchForm.inputHasValidText()
	) {
		this._getData();
	} else {
		return;
	}

};


proto._getData = function () {
	this.trigger('willSendRequests', this);
	this._willSendRequest(this.searchForm.getSearchTerm());
};


proto._willSendRequest = function (query) {
	var requestPromise;

	// empty the array on every request
	this._ajaxRequests = [];
	this.responseData = {};


	this._searchServices.forEach(function (dataSource) {
		var requestUrl  = dataSource.url;
		var requestName = dataSource.requestName;
		var queryParams = dataSource.queryParams || '';
		var queryName   = dataSource.queryName || 'query';
		var dataType    = dataSource.dataType || 'json';

		// modify the queryParams object to add the the query and the query name since that can be variable
		queryParams[queryName] = query;

		// store the request which returns a promise in an
		// array, so we can wait for them all to resolve before
		// we run any rendering
		requestPromise = this._sendRequest(requestUrl, queryParams, dataType, requestName);

		this._ajaxRequests.push(requestPromise);
	}.bind(this));

	ac_Deferred.all(this._ajaxRequests).then(this._handleData.bind(this));
};


// A wrapper method for ac_Ajax
proto._sendRequest = function (requestUrl, queryParams, dataType, requestName) {
	// wrap our ajax promise so it resolves regardless if the ajax request fails
	var requestPromise = new ac_Promise();
	var url = requestUrl + '?' + ac_Object.toQueryParameters(queryParams);
	
	/* IS&T 9/14/14: add. for quick links */
	if(requestName === 'recommendedResults'){
		proto.imageHostUrl = window.location.protocol + "//" + akamaiUrl  ;
		proto.searchQuery = queryParams.q;
	}
	
	ac_Ajax.get({'url': url}).then(function(response) {
		requestPromise.resolve({
			xhr:response,
			data:response.responseText,
			requestName:requestName,
			dataType:dataType
		});
	}, function(err){
		requestPromise.resolve(err);
	});

	return requestPromise.promise().then(this.requestSuccess.bind(this), this.requestFailure.bind(this));
};


proto.requestSuccess = function (response) {
	var dataType = response.dataType;
	var requestName = response.requestName;
	var jsonData;
	var xmlData;
	
	/* SMUI 8/19/14: add. Strip callback function. May not be defined for RecommendedResults. */
	if (response.data) {
		response.data = response.data.replace(/^[^\{\}]*(\{.*\})[^\{\}]*$/g,"$1");
	}
	
	/* IS&T 9/9/14: add. for quick links */
	if(requestName === 'recommendedResults' && dataType === 'json'){
		response.data=this.convertRResultsToMarcomXMLFormat(response.data);
		dataType='xml';
	}

	if (dataType === 'json') {
		jsonData = response.data = this.parseJSON(response.data);
	} else if (dataType === 'xml') {
		xmlData = response.data = this.parseXML(response.data);
	}

	if (jsonData) {
		this.responseData[requestName] = jsonData;
	} else if (xmlData) {
		this.responseData[requestName] = xmlData;
	}
	
	/* SMUI 8/28/14 add for search analytics */
	/* source: from ACShortcuts.js */
	if (jsonData) {
		var store = new Persist.Store('FeedStats');
		store.set('lastSuggestedSearch', JSON.stringify(jsonData)); 
		store.set('hasSuggestedSuggestion', true); 
	}

	return response;
};

/* IS&T 9/9/14: add. for quick links */
// Converting the json response from services to Marcom XML format for SupportSite
proto.convertRResultsToMarcomXMLFormat = function (rrJson) {
	var rsltJson  = this.parseJSON(rrJson);
	
	var rrXml="<shortcuts><term>";
		rrXml = rrXml.concat(proto.searchQuery).concat("</term><search_results>");
	

	var qLinks = rsltJson.QUICK_LINKS;
	 if(qLinks != undefined || qLinks != ''){
         for(var key in qLinks){
                  var shortDescription = qLinks[key].SHORT_DESCRIPTION;
                 var link = qLinks[key].LINK;
                 var keywords = qLinks[key].KEYWORD;   
                 var suggestions =qLinks[key].SUGGESTIONS;   
                 var priority= qLinks[key].PRIORITY   ;
                 var iconLink = proto.imageHostUrl + qLinks[key].ICON_LINK;
                 rrXml=rrXml.concat("<match   image=").concat("\""+iconLink+"\"").concat("   title=").concat("\""+suggestions+"\"").concat("    url=").concat("\""+link+"\"").concat("    copy=").concat("\""+shortDescription+"\"").concat("    category=").concat("\""+keywords+"\"").concat("    priority=").concat("\""+priority+"\"").concat("/>");

         }
		rrXml = rrXml.concat("</search_results></shortcuts>");
	}
	
	return rrXml;
};

proto.requestFailure = function (response) {
	throw response.toString();
};


proto.parseJSON = function (json) {
	return JSON.parse(json);
};


proto.parseXML = function (xmlResponse) {

	function xmlStringtoDOM (xml) {
		var xmlDoc;
		var dp;

		if (window.ActiveXObject) {
			xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
			xmlDoc.async = 'false';
			xmlDoc.loadXML(xml);
		} else {
			dp = new DOMParser();
			xmlDoc = dp.parseFromString(xml, 'text/xml');
		}

		return xmlDoc;
	}

	var xml = xmlStringtoDOM(xmlResponse);

	return xml;
};


proto._handleData = function (array) {
	this.trigger('requestsComplete', this.responseData);
};


module.exports = EnhancedSearch;

},{"../../helpers/keys":43,"ac-ajax":1,"ac-deferred":26,"ac-element":"j0qjr8","ac-event-emitter":28,"ac-object":34}],51:[function(require,module,exports){
var ac_Object     = require('ac-object');

// function that controls all three seperate search controllers
var EnhancedSearchController = function (searchInput, enhancedAjaxSearch, enhancedSearchResults) {
	this.searchInput           = searchInput;
	this.enhancedAjaxSearch    = enhancedAjaxSearch;
	this.enhancedSearchResults = enhancedSearchResults;
	this.requestDelay = 250;
	this._timeOutId = 0;

	// store reference to original submit method
	var originalOnValueSubmit = this.searchInput._onValueSubmit;
	this.searchInput._originalOnValueSubmit = originalOnValueSubmit;

	// redefine the subit method so we can control what
	// happens when submit happens
	this.searchInput._onValueSubmit = this._onSubmit.bind(this);


	/***
		event-emitter bindings
	**/

	// if the input is empty or only has whitespace characters hide results
	this.searchInput.on('valueUpdate', function () {
		if (!this.searchInput.inputHasValidText()) {
			this.enhancedSearchResults._handleReset();
		}
	}, this);


	// pass along the key events to ajax controller to use for managing gettign data selection
	// this.searchInput.on('valueUpdate', this.enhancedAjaxSearch._handleKeyEvents, this.enhancedAjaxSearch);
	this.searchInput.on('valueUpdate', this._passAlongRateLimitedEvents, this);


	// pass along the key events to results controller to use for managing results selection
	this.searchInput.on('valueUpdate',  this.enhancedSearchResults._handleKeyEvents, this.enhancedSearchResults);
	this.searchInput.on('reset',        this.enhancedSearchResults._handleReset,     this.enhancedSearchResults);


	// when ajax request complete tell results controller to render them
	this.enhancedAjaxSearch.on('requestsComplete', this.enhancedSearchResults._renderData, this.enhancedSearchResults);


	// cache the value to switch back and forth between
	this.enhancedSearchResults.on('willRender', this.setSearchTerm, this);


	// when selected item changes check if we should update the search field
	this.enhancedSearchResults.on('selectedItemChange', this._updateInput, this);
};


var proto = EnhancedSearchController.prototype;


proto.setSearchTerm = function () {
	this._searchTerm = this.searchInput.getSearchTerm();
};


proto.getSearchTerm = function () {
	return this._searchTerm;
};


proto._onSubmit = function () {
	// if our results panel is hidden
	if (this.enhancedSearchResults.resultsAreShowing() !== true) {

		// if our searchField has valid text search it
		if (this.searchInput.inputHasValidText()) {
			this.searchInput._originalOnValueSubmit();	
		}

	} else {

		// if we have a selected item, we're going to redirect the user the selected items url
		if (this.enhancedSearchResults.getSelectedItem() !== false) {
			/* SMUI 8/27/14 add sitecatalyst tracking */
			this.enhancedSearchResults.trackResultItem(this.enhancedSearchResults.getSelectedItem().element);
			
			this.enhancedSearchResults.reassignURL(this.enhancedSearchResults.getSelectedItem().url);
		} else {
		// if we dont have a selected item, if our searchField has valid text search it
			if (this.searchInput.inputHasValidText()) {
				this.searchInput._originalOnValueSubmit();	
			}
		}
	}
};


proto._updateInput = function (item) {
	if (item && item.updateInput && item.updateInput === true) {
		this.searchInput.searchInput.value = item.copy;
		this.searchInput.setSearchTerm(item.copy);
	} else {
		this.searchInput.searchInput.value = this.getSearchTerm();
		this.searchInput.setSearchTerm(this.getSearchTerm());
	}
};


proto._passAlongRateLimitedEvents = function (e) {
	// have to clone the original eventt so that
	// we can use it in the setTimeout
	var evt = ac_Object.clone(e);

	window.clearTimeout(this._timeOutId);

	function submitKeyEvent () {
		this.enhancedAjaxSearch._handleKeyEvents(evt);
	}

	this._timeOutId = window.setTimeout(submitKeyEvent.bind(this), this.requestDelay);
};


module.exports = EnhancedSearchController;

},{"ac-object":34}],52:[function(require,module,exports){
var ac_Element    = require('ac-element');
var ac_Events     = require('ac-dom-events');
var EventEmitter  = require('ac-event-emitter').EventEmitter;
var keyboardKeys  = require('../../../helpers/keys');
var Renderer      = require('./ResultsRenderer');


/**
 * @constructor ResultsController
 * @name ResultsController
 *
 * @desc Manages showing/hiding a list as well as which item in the list is selected.
 *
 * @param {object} renderOptions Options to pass to the render for it do render the list.
 *
 */
var ResultsController = function(renderOptions) {
	this.options = renderOptions;

	this._results        = null;
	this._resultsShowing = false;
	this._selectedItem   = false;

	this._shouldHideResultsOnMouseOut = false;

	this.resultsElem = document.createElement('div');
	ac_Element.addClassName(this.resultsElem, 'gh-search-results');


	this._addBoundEventHandlers();
};


var proto = ResultsController.prototype = new EventEmitter();


proto.hasResults = function () {
	return this._results !== null;
};


proto.resultsAreShowing = function () {
	return this._resultsShowing;
};


/**
 * @name ResultsController#setSelectedItem
 * @desc set our internal reference to which element in the list view is selected
 * @event
 * @desc Event `selectedItemChange` fires immediately before a new selctedItem is set
 */
proto.setSelectedItem = function(selectedItem) {
	this.trigger('selectedItemChange', selectedItem);
	this._selectedItem = selectedItem;
};

// get our internal reference to which element in the list view is selected
proto.getSelectedItem = function(){
	return this._selectedItem;
};


// removes .focus classname to the element in the results list is selected
proto.select = function (element) {
	ac_Element.addClassName(element, 'focus');
};


// adds .focus classname to the element in the results list is slected
proto.deselect = function (element) {
	ac_Element.removeClassName(element, 'focus');
};


// returns the <a> tag if the target of an event is not the <a> itself
proto.getAnchorTag = function (evt) {
	var target = ac_Events.target(evt);

	while ((target.tagName.toLowerCase() !== 'a') && target.parentNode) {
		target = target.parentNode;
	}

	return target;
};


/* SMUI 8/27/14 add sitecatalyst tracking */
/* handles boths results that are clicked or selected via Enter key */
proto.trackResultItem = function(li) {
	var result_li = li;
	var result_a = result_li.firstChild;
	var result_p = result_a.firstChild;
	var position = result_li.getAttribute('position');		
	if (position != null) {
		try {
			if (!(typeof(s_gi) == 'undefined' || !s_gi)) {
				var globalSuite = 'appleglobal';
				var searchSuite = 'appleussearch';
				var countryCode = document.getElementById('gh-search-form').getAttribute('data-search-country-code');
				if (countryCode !== 'us') {
					globalSuite = 'apple' + countryCode + 'global';
					searchSuite = 'apple' + countryCode + 'search';
				}

				if (typeof(s_account) !== 'undefined' && s_account.indexOf('appleussearch') === -1) {
					s = s_gi(s_account + ',' + searchSuite);
					
				} else {
					s = s_gi(globalSuite + ',' + searchSuite);
				}

				s.prop7 = "acs::quicklink::query::"+document.getElementById('gh-search-input').value.replace(/&amp;/g, "&");

				var resultPageType = "supportpage"; 


				if(result_a.getAttribute('href').indexOf("support.apple.com/kb/") != -1){
					resultPageType = "kbase";
				}else if(result_a.getAttribute('href').indexOf("apple.com/support") != -1){
					resultPageType = "supportpage";
				}else if(result_a.getAttribute('href').indexOf("discussions.apple.com") != -1){
					resultPageType = "discussions";
				}else if(result_a.getAttribute('href').indexOf("selfsolve.apple.com") != -1){
					resultPageType = "selfsolve tool";
				}else if(result_a.getAttribute('href').indexOf("reportaproblem.apple.com") != -1){
					resultPageType = "report a problem";
				}

				s.eVar1 = "acs::search result::quicklinks::"+ resultPageType;
				
				//document.location.assign(result_a.getAttribute('href'));
				var pos = -1; // position of selected suggestion.
				var searchLocale = document.getElementById('globalheader').getAttribute('lang');
				
				var pageName = "acs::kb::search results (" + searchLocale.toLowerCase() + ")";
				var classname = result_li.parentNode.className;
				var title = result_p.innerHTML;

				if(classname.indexOf("suggested-searches") !== -1) {
					pos = position;
					pageName += "::suggested";
				} else {
					pageName += "::quicklinks";
				}
				
				s.prop3 = pageName;
				// Checking whether position is set. For Suggestions only position will be set
				// and for others it will be set to -1. When position is set, position of the
				// suggestion and suggestion title are passed for tracking.
				if(pos != -1) {
					s.prop2 = "acs::suggested search::position " + pos;
					s.prop10 = "acs::suggested search::string::"+ title; // Selected Suggestion Title
					s.linkTrackVars = "prop2,prop3,prop10,eVar1,prop7";
				} else {
					s.linkTrackVars = "prop3,eVar1,prop7";
				}
				s.pageName = pageName;
				s.tl(this, "o", "Suggested Search");
			}
		}
		catch(e){
			console.log("catch:"+e)
		}
	}
	//alert("proto.trackResultItem:"+position+":"+result_p.innerHTML+":"+result_a.getAttribute('href'));
};

proto.reassignURL = function(url) {
	document.location.assign(url);
};


proto._addBoundEventHandlers = function() {
	this._boundHideResultsOnMouseOut = function (evt) {
		this._hideResultsOnMouseOut(evt);
	}.bind(this);

	this._boundResultsContainerClick = function () {
		this._handleResultsContainerClick();
	}.bind(this);

	this._boundHandleResultItemMouseDown = function (evt) {
		this._handleResultItemMouseDown(evt);
	}.bind(this);

	this._boundHandleResultItemClick = function (evt) {
		this._handleResultItemClick(evt);
	}.bind(this);
};


/**
 * @name ResultsController#_renderData
 * @desc passes ajax response to a renderer
 *
 * @event
 * @desc Event `willRender` fires immediately before a new results rendering happens
 *
 * @event
 * @desc Event `didRender` fires immediately after the results are shown
 *
 * @method
 * @private
 */
proto._renderData = function (requestResponses) {
	this.trigger('willRender');

	// clear everything
	this._handleReset();

	// run a new render
	this._results = new Renderer(requestResponses, this.options.additonalRenderData);

	this.resultsElem.appendChild(this._results.dom);

	this.options.resultsWrapper.appendChild(this.resultsElem);

	// add a mousedown listener to see if we should hide the results once the user mousesout of them
	ac_Events.addEventListener(this.options.resultsWrapper, 'mousedown', this._boundResultsContainerClick);

	// add click handling for analytics
	var links = ac_Element.selectAll('a', this.resultsElem);

	if (links) {
		links.forEach(function (link) {
			ac_Events.addEventListener(link, 'mousedown', this._boundHandleResultItemMouseDown);

			ac_Events.addEventListener(link, 'click', this._boundHandleResultItemClick);
		}.bind(this));
	}

	this.trigger('didRender');
	this._showResults();
};




// key events routing. Only key up for now
proto._handleKeyEvents = function (evt) {
	switch (evt.type) {
		case 'keyup':
			this._handleKeyUp(evt);
			break;
		default:
		  return;
	}
};


// handles keyup events
proto._handleKeyUp = function (evt){
	var pressedKey = evt.keyCode;

	if (pressedKey === keyboardKeys.ESCAPE) {
		this._handleReset();
	}

	if (this._results) {
		this._manageResultSelection(pressedKey);

		if (this.selectedItem) {
			if (pressedKey === keyboardKeys.ENTER) {
				this.reassignURL(this.selectedItem.url);
			}
		}
	}
};

// handle reset
proto._handleReset = function () {
	// remove event listeners after results are hidden
	this.resultsElem.innerHTML = '';
	ac_Element.removeClassName(this.resultsElem, 'show');
	ac_Element.removeEventListener(document, 'mousemove', this._boundHideResultsOnMouseOut);
	ac_Events.removeEventListener(this.options.resultsWrapper, 'mousedown', this._boundResultsContainerClick);


	this._results = null;
	this._resultsShowing = false;
	this._selectedItem = false;
	this._shouldHideResultsOnMouseOut = false;
};


proto._handleMouseMove = function(evt) {
	evt = evt || window.event;
	this.mouseEventTarget = (evt.target) ? evt.target : evt.srcElement;

	// hide the results on mouse out if you were hovering over them when we first tried to hide them
	if (this._shouldHideResultsOnMouseOut === true) {
		if (!this._mouseIsOverResultsContainer()) {
			this._handleReset();
		}
	}
};


proto._handleResultItemMouseDown = function(evt) {
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	evt.returnValue = false;

	var i, len, result, resultObject, clickedLink;
	clickedLink = this.getAnchorTag(evt).href;

	for (i = 0, len = this._results.indexedElements.length; i < len; i += 1) {
		result = this._results.indexedElements[i];
		if  (clickedLink === result.url) {
			resultObject = result;
		}
	}

	this.trigger('resultLinkBeforeClick', {
		interactionEvt:evt,
		resultObject:resultObject
	});
};


proto._handleResultItemClick = function(evt) {
	if (evt.preventDefault) {
		evt.preventDefault();
	}
	evt.returnValue = false;

	var element = this.getAnchorTag(evt);

	this.trigger('resultLinkClick', {
		interactionEvt:evt,
		element: element
	});
	
	/* SMUI 8/27/14 add sitecatalyst tracking */
	this.trackResultItem(element.parentNode);
	
	this.reassignURL(element.href);
};


proto._handleResultsContainerClick = function() {
	this._shouldHideResultsOnMouseOut = true;
};


// returns if the mouse is on top of the results constainer
proto._mouseIsOverResultsContainer = function () {
	if (!this.mouseEventTarget) {
		return false;
	}

	while ((this.mouseEventTarget !== this.resultsElem) && this.mouseEventTarget.parentNode) {
		this.mouseEventTarget = this.mouseEventTarget.parentNode;
	}

	return (this.mouseEventTarget === this.resultsElem);
};


proto._hideResultsOnMouseOut = function(evt) {
	this._handleMouseMove(evt);
};


// shows the results panel
proto._showResults = function () {
	/* SMUI 08/20/14: add if wrapper. prevent partial results box if no results */
	if (this.resultsElem.childNodes.length > 0) {
		this._resultsShowing = true;
		ac_Element.addClassName(this.resultsElem, 'show');
	}

	// add event listeners only after results are showing
	ac_Events.addEventListener(document, 'mousemove', this._boundHideResultsOnMouseOut);
};


// uses keys to changed which element in the results list is selected
proto._manageResultSelection = function (pressedKey) {
	var model = this._results.indexedElements;
	var currentSelectedItem;
	var selectedItem;

	if (pressedKey === keyboardKeys.ARROW_UP) {
		if (model) {
			if (this.getSelectedItem()) {
				currentSelectedItem = this.getSelectedItem();

				if (currentSelectedItem && currentSelectedItem.index > 0) {
					this.deselect(currentSelectedItem.element);

					this.setSelectedItem(this._results.indexedElements[currentSelectedItem.index - 1]);

					selectedItem = this.getSelectedItem();
					this.select(selectedItem.element);

				} else {
					this.deselect(currentSelectedItem.element);
					this.setSelectedItem(false);
				}
			}
		}
	} else if (pressedKey === keyboardKeys.ARROW_DOWN) {
		if (model) {
			currentSelectedItem = this.getSelectedItem();

			if (currentSelectedItem && this._results.indexedElements[currentSelectedItem.index + 1]) {
				this.deselect(currentSelectedItem.element);

				this.setSelectedItem(this._results.indexedElements[currentSelectedItem.index + 1]);

				selectedItem = this.getSelectedItem();
				this.select(selectedItem.element);

			} else if (!currentSelectedItem && this._results.indexedElements[0]) {
				this.setSelectedItem(this._results.indexedElements[0]);

				selectedItem = this.getSelectedItem();
				this.select(selectedItem.element);
			}
		}
	}
};


module.exports = ResultsController;

},{"../../../helpers/keys":43,"./ResultsRenderer":53,"ac-dom-events":27,"ac-element":"j0qjr8","ac-event-emitter":28}],53:[function(require,module,exports){
var ac_Element    = require('ac-element');
var ac_Object     = require('ac-object');
var EventEmitter  = require('ac-event-emitter').EventEmitter;
var searchGlobals = require('../../../helpers/searchGlobals');
var geoMap        = require('../../lang/geoMap');



// Generates and returns the DOM structure and array of elements to manage focus on
var Renderer = function(resultsObject, options) {
	var renderOptions = options;
	var frag = document.createDocumentFragment();
	var renderResults = [];

	var environment = (searchGlobals.searchHost !== false) ? window.location.protocol + '//' + window.location.hostname : window.location.protocol + '//' + 'www.apple.com';

	// Array/Object Composition function
	function dataToArray(data) {
		var xmlResults;
		var resultsArray = [];
		var resultsLen;
		var resultItem;
		var results;
		var result;
		var error;
		var i;


		// method to test an catch the error if the data isn't xml
		function shouldRenderXML(xml) {
			var xmlResults;
			try {
				xmlResults = (xml.getElementsByTagName('shortcuts').length) ? true: false;
			} catch (err) {
				xmlResults = false;
			}

			return xmlResults;
		}


		// compose objects for array from xml
		if (shouldRenderXML(data) === true) {
			error = data.getElementsByTagName('error');

			// if the there isn't an error node
			if (error.length === 0) {
				xmlResults = data.getElementsByTagName('match');
				resultsLen = (xmlResults.length > 6) ? 6 : xmlResults.length;


				//Lets store our results in our own array first
				for (i = 0; i < resultsLen; i += 1) {
					result = xmlResults[i];
					resultItem = {
						category: 'recommendedresults',
						url:      result.getAttribute('url'),
						copy:     result.getAttribute('copy'),
						heading:  result.getAttribute('title'),
						image:    result.getAttribute('image')

					};

					// if were on an internal server rewrite www.apple.com urls to dev environment url, otherwise rewrite to https
					resultItem.url = decodeURIComponent(resultItem.url).replace(/http(s)?:\/\/www.apple.com/g, environment);

					resultsArray.push(resultItem);
				}

			} else {
				return false;
			}
		} else {
			// compose objects for array from json
			for (results in data) {
				if (data.hasOwnProperty(results)) {
					if (data.hasOwnProperty('0')) {
						result = data[results];
						resultItem = {
							category: 'commonsearches',
							copy:     result,
							/* SMUI 8/19/14: replace. we have different query params. */
							//url: (renderOptions.searchForm.formAction + '?' +  ac_Object.toQueryParameters({ section: searchGlobals.searchSection, geo: searchGlobals.searchCountry }) + '&' + renderOptions.searchForm.searchInputName + '=' + encodeURIComponent(result)).replace(/http(s)?:\/\/www.apple.com/g, environment)
							url: (renderOptions.searchForm.formAction + '?' +  
								ac_Object.toQueryParameters({
									page: renderOptions.searchForm.form.page   ?renderOptions.searchForm.form.page.value:'search',
									src: renderOptions.searchForm.form.src?renderOptions.searchForm.form.src.value:'support_site.globalheader.search', 
									locale: renderOptions.searchForm.form.locale?renderOptions.searchForm.form.locale.value:'en_US'
								}) + '&' + renderOptions.searchForm.searchInputName + '=' + encodeURIComponent(result)).replace(/http(s)?:\/\/www.apple.com/g, environment)
						};

						resultsArray.push(resultItem);
					}
				}
			}

		}

		return resultsArray;
	}


	// Generate our DOM
	//--------------------//


	var rr = dataToArray(resultsObject.recommendedResults);
	var ss = dataToArray(resultsObject.suggestedSearches);

	var hasSuggestedSearches = (ss.length > 0) ? true : false;
	var hasRecommendedResults = (rr.length > 0) ? true : false;


	if (hasSuggestedSearches && hasRecommendedResults) {
		renderResults = ss.concat(rr);
	} else if (hasSuggestedSearches && !hasRecommendedResults) {
		renderResults = ss;
	} else if (!hasSuggestedSearches && hasRecommendedResults) {
		renderResults = rr;
	} else {
		renderResults = [{
			category: 'noresults',
			copy:     (geoMap[searchGlobals.searchCountry.toUpperCase()].noResults) ? geoMap[searchGlobals.searchCountry.toUpperCase()].noResults : geoMap['US'].noResults, //'No Results....'
			/* SMUI 8/19/14: replace. we have different query params. */
			// url:      renderOptions.searchForm.formAction + '?' + ac_Object.toQueryParameters({ section: searchGlobals.searchSection, geo: searchGlobals.searchCountry }) + '&' + renderOptions.searchForm.searchInputName + '=' + renderOptions.searchForm.getSearchTermEncoded()
			url: renderOptions.searchForm.formAction + '?' + ac_Object.toQueryParameters({
				page: renderOptions.searchForm.form.page   ?renderOptions.searchForm.form.page.value:'search',
				src: renderOptions.searchForm.form.src?renderOptions.searchForm.form.src.value:'support_site.globalheader.search', 
				locale: renderOptions.searchForm.form.locale?renderOptions.searchForm.form.locale.value:'en_US'
			}) + '&' + renderOptions.searchForm.searchInputName + '=' + renderOptions.searchForm.getSearchTermEncoded()
		}];
	}


	if (renderResults.length > 0) {
		var suggestedSearchesFrag = document.createDocumentFragment();
		var suggestedSearchesList;
		var suggestedSearchesTitle;
		/* SMUI 8/21/14: replace. use suggestedSearches instead */
		//var suggestedSearchesTitleText = (geoMap[searchGlobals.searchCountry.toUpperCase()].commonSearches) ? geoMap[searchGlobals.searchCountry.toUpperCase()].commonSearches : geoMap['US'].commonSearches;    //'Common Searches'
		var suggestedSearchesTitleText = (geoMap[searchGlobals.searchCountry.toUpperCase()].suggestedSearches) ? geoMap[searchGlobals.searchCountry.toUpperCase()].suggestedSearches : geoMap['US'].suggestedSearches;
		var recommendedResultsFrag = document.createDocumentFragment();
		var recommendedResultsList;
		var recommendedResultsListTitle;
		/* SMUI 8/21/14: replace. use quickLinks instead */
		//var recommendedResultsListTitleText = (geoMap[searchGlobals.searchCountry.toUpperCase()].recommendedResults) ? geoMap[searchGlobals.searchCountry.toUpperCase()].recommendedResults : geoMap['US'].recommendedResults;    //'Recommended Results';
		var recommendedResultsListTitleText = (geoMap[searchGlobals.searchCountry.toUpperCase()].quickLinks) ? geoMap[searchGlobals.searchCountry.toUpperCase()].quickLinks : geoMap['US'].quickLinks;
		var noResultsFrag = document.createDocumentFragment();
		var noResultsList;
		var result;
		var resultsListItem;
		var resultsListItemLink;
		var resultListItemImage;
		var resultListItemHeading;
		var resultListItemCopy;
		var len;
		var i;


		// loop through array and put elements in the correct list
		for (i = 0, len = renderResults.length; i < len; i += 1) {
			result = renderResults[i];
			result.index = i;

			resultsListItem = document.createElement('li');
			/* SMUI 8/27/14: add. position. */
			resultsListItem.setAttribute('position', i + 1);
			resultsListItemLink = document.createElement('a');

			// add the link source - all
			if (result.url) {
				resultsListItemLink.href = result.url;
			}


			// add an image - rr only
			if (result.image) {
				resultListItemImage = new Image();
				resultListItemImage.src = result.image;
				resultListItemImage.alt = result.title || '';
				resultsListItemLink.appendChild(resultListItemImage);
			}

			// add a heading - rr only
			if (result.heading) {
				result.truncatedHeading = unescape(result.heading);

				if (result.truncatedHeading.length > 39) {
					result.truncatedHeading = result.truncatedHeading.substring(0, result.truncatedHeading.lastIndexOf(' ', (39 - 12))) + '&hellip;';
				}

				resultListItemHeading = document.createElement('h5');
				resultListItemHeading.innerHTML = result.truncatedHeading;
				resultsListItemLink.appendChild(resultListItemHeading);
			}

			// add the main copy
			if (result.copy) {
				result.truncatedCopy = unescape(result.copy);

				if (result.truncatedCopy.length > 105) {
					result.truncatedCopy = result.truncatedCopy.substring(0, result.truncatedCopy.lastIndexOf(' ', (105 - 11))) + '&hellip;';
				}

				resultListItemCopy = document.createElement('p');
				resultListItemCopy.innerHTML = result.truncatedCopy;
				resultsListItemLink.appendChild(resultListItemCopy);
			}


			// assign the dom node back to the array object to the controller can add and remove classnames
			result.element = resultsListItem;

			resultsListItem.appendChild(resultsListItemLink);


			if (result.category === 'commonsearches') {
				suggestedSearchesFrag.appendChild(resultsListItem);
				result.updateInput = true;
			} else if (result.category === 'recommendedresults') {
				recommendedResultsFrag.appendChild(resultsListItem);
				result.updateInput = false;
			} else if (result.category === 'noresults') {
				noResultsFrag.appendChild(resultsListItem);
				result.updateInput = false;
			}
		}


		// return the right dom nodes
		if (hasSuggestedSearches && hasRecommendedResults) {
			suggestedSearchesList = document.createElement('ul');
			ac_Element.addClassName(suggestedSearchesList, 'gn-search-results-suggested-searches');
			suggestedSearchesList.appendChild(suggestedSearchesFrag);

			recommendedResultsList = document.createElement('ul');
			ac_Element.addClassName(recommendedResultsList, 'gn-search-results-recommended-results');
			recommendedResultsList.appendChild(recommendedResultsFrag);

			suggestedSearchesTitle = document.createElement('h4');
			suggestedSearchesTitle.innerHTML = suggestedSearchesTitleText;

			recommendedResultsListTitle = document.createElement('h4');
			recommendedResultsListTitle.innerHTML = recommendedResultsListTitleText;

			frag.appendChild(suggestedSearchesTitle);
			frag.appendChild(suggestedSearchesList);
			frag.appendChild(recommendedResultsListTitle);
			frag.appendChild(recommendedResultsList);
		} else if (hasSuggestedSearches && !hasRecommendedResults) {
			suggestedSearchesList = document.createElement('ul');
			ac_Element.addClassName(suggestedSearchesList, 'gn-search-results-suggested-searches');
			suggestedSearchesList.appendChild(suggestedSearchesFrag);

			suggestedSearchesTitle = document.createElement('h4');
			suggestedSearchesTitle.innerHTML = suggestedSearchesTitleText;

			frag.appendChild(suggestedSearchesTitle);
			frag.appendChild(suggestedSearchesList);
		} else if (!hasSuggestedSearches && hasRecommendedResults) {
			recommendedResultsList = document.createElement('ul');
			ac_Element.addClassName(recommendedResultsList, 'gn-search-results-recommended-results');
			recommendedResultsList.appendChild(recommendedResultsFrag);

			recommendedResultsListTitle = document.createElement('h4');
			recommendedResultsListTitle.innerHTML = recommendedResultsListTitleText;

			frag.appendChild(recommendedResultsListTitle);
			frag.appendChild(recommendedResultsList);
		} else {
			/* SMUI 8/20/14: hide. we dont show No Results message. */
			//noResultsList = document.createElement('ul');
		    //ac_Element.addClassName(noResultsList, 'gn-search-results-no-results');
		    //noResultsList.appendChild(noResultsFrag);
			
			/* SMUI 8/20/14: hide. we dont show No Results message. */
			//frag.appendChild(noResultsList);
		}
	}


	var renderedData = {
		dom:frag,
		indexedElements:renderResults
	};

	return renderedData;
};


var proto = Renderer.prototype;


module.exports = Renderer;

},{"../../../helpers/searchGlobals":44,"../../lang/geoMap":56,"ac-element":"j0qjr8","ac-event-emitter":28,"ac-object":34}],"oDi/Uh":[function(require,module,exports){
'use strict';

module.exports = (function () {
	var ac_Object                = require('ac-object');
	var SearchInput              = require('./SearchInput');
	var EnhancedAjaxSearch       = require('./enhanced-search/EnhancedAjaxSearch');
	var EnhancedSearchController = require('./enhanced-search/EnhancedSearchController');
	var SearchResultsController  = require('./enhanced-search/results/ResultsController');
	var searchGlobals            = require('./../helpers/searchGlobals');

	var searchNavItem = document.getElementById('gh-tab-search');

	if (searchNavItem) {
		// decorate the search field so it animates
		var searchInput = new SearchInput(searchNavItem);

		// should we set up recommended results
		var initRecommendedResults = searchInput.form.getAttribute('data-search-recommended-results');

		// should we set up search suggestions
		var initSearchSuggestions = searchInput.form.getAttribute('data-search-suggested-searches');

		var dataSources = [];
		var enhancedAjaxSearch;
		var enhancedSearchResults;
		var enhancedSearchController;
		
		/* SMUI 8/19/2014: replace. Don't need these params. */
		//var recommendedResultsQueryParams = {
		//	section: searchGlobals.searchSection,
		//	geo: searchGlobals.searchCountry
		//};
		var recommendedResultsQueryParams = {};

		if (initRecommendedResults || initSearchSuggestions) {
			var searchSuggestions  = JSON.parse(initSearchSuggestions);
			var recommendedResults = JSON.parse(initRecommendedResults);

			if (recommendedResults) {
				recommendedResults.queryParams = recommendedResults.queryParams ? ac_Object.extend(ac_Object.clone(recommendedResults.queryParams), recommendedResultsQueryParams) : recommendedResultsQueryParams;
				dataSources.push(recommendedResults);
			}

			if (searchSuggestions) {
				dataSources.push(searchSuggestions);
			}

			if (dataSources.length === 0) {
				throw 'Please provide the required arguments.';
			}


			// search AJAX controller
			enhancedAjaxSearch = new EnhancedAjaxSearch(searchInput, dataSources);


			// search results controller
			enhancedSearchResults = new SearchResultsController({
				resultsWrapper: enhancedAjaxSearch.searchForm.container,
				additonalRenderData:enhancedAjaxSearch
			});


			// one controller to rule them all: submit delegation and searchInout updating based on result items
			enhancedSearchController = new EnhancedSearchController(searchInput, enhancedAjaxSearch, enhancedSearchResults);



			// result item analytics here
			enhancedSearchResults.on('resultLinkBeforeClick', function(data) {
				// do something with data here
			});
		}
	}

}());


},{"./../helpers/searchGlobals":44,"./SearchInput":49,"./enhanced-search/EnhancedAjaxSearch":50,"./enhanced-search/EnhancedSearchController":51,"./enhanced-search/results/ResultsController":52,"ac-object":34}],"gh-searchInit":[function(require,module,exports){
module.exports=require('oDi/Uh');
},{}],56:[function(require,module,exports){
var geoMap = {
	US: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: '',
		noResults: 'No suggestions found. Search all of apple.com.',
		viewAll: 'View all search results',
		recommendedResults: 'Recommended Results',
		commonSearches: 'Common Searches',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links',  /* SMUI 8/21/14: add. */
		searchText: 'Search'
	},
	AE: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'ae'
	},
	ASIA: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'asia',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	AT: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'at',
		noResults: 'Kein Treffer in Kurzsuche. Vollsuche auf apple.com',
		viewAll: 'Alle Suchergebnisse',
		suggestedSearches: 'Vorgeschlagene Suchabfragen',  /* SMUI 8/21/14: add. */
		quickLinks: 'Alles auf einen Klick',  /* SMUI 8/21/14: add. */
		searchText: 'Suchen'
	},
	AU: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'au',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	BE_FR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'bf',
		noResults: 'Pas de r\u00E9sultat. Essayez une recherche apple.com',
		viewAll: 'Afficher tous les r\u00E9sultats',
		recommendedResults: 'Raccourcis',
		suggestedSearches: 'Suggestions de recherche',  /* SMUI 8/21/14: add. */
		quickLinks: 'Raccourcis',  /* SMUI 8/21/14: add. */
		searchText: 'Rechercher'
	},
	BE_NL: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'bl',
		noResults: 'Niets gevonden. Zoek opnieuw binnen www.apple.com.',
		viewAll: 'Toon alle zoekresultaten',
		recommendedResults: 'Snelkoppelingen',  /* SMUI 10/22/14: add. */
		suggestedSearches: 'Voorgestelde zoekresultaten',  /* SMUI 10/22/14: add. */
		searchText: 'Zoek'
	},
	BR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'br',
		noResults: 'N\u00E3o encontrado. Tente a busca em apple.com',
		viewAll: 'Ver todos os resultados da busca',
		recommendedResults: 'Links rapidos',
		searchText: 'Buscar'
	},
	CA_EN: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'ca',
		directory: '/ca',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	CA_FR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code:'ca',
		directory: '/ca/fr',
		viewAll: 'Afficher tous les r\u00E9sultats',
		recommendedResults: 'Raccourcis',
		suggestedSearches: 'Suggestions de recherche',  /* SMUI 8/21/14: add. */
		quickLinks: 'Raccourcis',  /* SMUI 8/21/14: add. */
		searchText: 'Recherche'
	},
	CH_DE: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'ce',
		noResults: 'Kein Treffer in Kurzsuche. Vollsuche auf apple.com',
		viewAll: 'Alle Suchergebnisse',
		suggestedSearches: 'Vorgeschlagene Suchabfragen',  /* SMUI 8/21/14: add. */
		quickLinks: 'Alles auf einen Klick',  /* SMUI 8/21/14: add. */
		searchText: 'Suchen'
	},
	CH_FR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'cr',
		noResults: 'Pas de r\u00E9sultat. Essayez une recherche apple.com',
		viewAll: 'Afficher tous les r\u00E9sultats',
		recommendedResults: 'Raccourcis',
		suggestedSearches: 'Suggestions de recherche',  /* SMUI 8/21/14: add. */
		quickLinks: 'Raccourcis',  /* SMUI 8/21/14: add. */
		searchText: 'Rechercher'
	},
	CN: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code:'cn',
		directory:'/cn',
		noResults:'\u627E\u4E0D\u5230\u5FEB\u901F\u641C\u7D22\u7ED3\u679C\uFF0C\u8BF7\u5C1D\u8BD5 apple.com \u7684\u5B8C\u6574\u641C\u7D22',
		recommendedResults: '\u5FEB\u901F\u94FE\u63A5',
		suggestedSearches: '\u5EFA\u8BAE\u641C\u7D22',  /* SMUI 8/21/14: add. */
		quickLinks: '\u5FEB\u901F\u94FE\u63A5',  /* SMUI 8/21/14: add. */
		viewAll:'\u67E5\u770B\u6240\u6709\u641C\u7D22\u7ED3\u679C',
		searchText:'\u641C\u7D22'
	},
	DE: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'de',
		viewAll: 'Alle Suchergebnisse',
		noResults: 'Kein Treffer in Kurzsuche. Vollsuche auf apple.com',
		suggestedSearches: 'Vorgeschlagene Suchabfragen',  /* SMUI 8/21/14: add. */
		quickLinks: 'Alles auf einen Klick',  /* SMUI 8/21/14: add. */
		searchText: 'Suchen'
	},
	DK: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'dk',
		noResults: 'Ingen genvej fundet. Pr\u00F8v at s\u00F8ge p\u00E5 hele apple.com.',
		viewAll: 'Vis alle s\u00F8geresultater',
		recommendedResults: 'Hurtige henvisninger',
		searchText: 'S\u00F8g'
	},
	ES: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'es',
		noResults: 'Ning\u00FAn atajo. B\u00FAsqueda completa en apple.com',
		viewAll: 'Ver todos los resultados de b\u00FAsqueda',
		recommendedResults: 'Enlaces r\u00E1pidos',
		suggestedSearches: 'B\u00FAsquedas sugeridas',  /* SMUI 8/21/14: add. */
		quickLinks: 'Enlaces',  /* SMUI 8/21/14: add. */
		searchText: 'Buscar'
	},
	FI: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'fi',
		noResults: 'Ei oikotiet\u00E4. Etsi koko apple.com.',
		viewAll: 'Katso hakutulokset',
		recommendedResults: 'Pikalinkit',  /* SMUI 10/22/14: add. */
		suggestedSearches: 'Ehdotetut haut',  /* SMUI 10/22/14: add. */
		searchText: 'Etsi'
	},
	FR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'fr',
		noResults: 'Pas de r\u00E9sultat. Essayez une recherche apple.com',
		viewAll: 'Afficher tous les r\u00E9sultats',
		recommendedResults: 'Raccourcis',
		suggestedSearches: 'Suggestions de recherche',  /* SMUI 8/21/14: add. */
		quickLinks: 'Raccourcis',  /* SMUI 8/21/14: add. */
		searchText: 'Rechercher'
	},
	HK: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'hk',
		noResults: '\u627E\u4E0D\u5230\u5FEB\u901F\u641C\u5C0B\u7D50\u679C\uFF0C\u8ACB\u8A66\u8A66 apple.com \u7684\u5B8C\u6574\u641C\u5C0B',
		viewAll: '\u6AA2\u8996\u6240\u6709\u641C\u5C0B\u7D50\u679C',
		recommendedResults: '\u5FEB\u901F\u9023\u7D50',
		suggestedSearches: '\u5EFA\u8B70\u7684\u641C\u5C0B',  /* SMUI 8/21/14: add. */
		quickLinks: '\u5FEB\u901F\u9023\u7D50',  /* SMUI 8/21/14: add. */
		searchText: '\u641C\u5C0B'
	},
	HK_EN: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'hk',
		directory: '/hk/en',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	ID: {
		code: 'id'
	},
	IE: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'ie',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	IN: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'in',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	IT: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'it',
		noResults: 'Nessuna scorciatoia trovata. Provate su apple.com',
		viewAll: 'Mostra tutti i risultati',
		recommendedResults: 'Collegamenti rapidi',
		searchText: 'Cerca'
	},
	JP: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'jp',
		noResults: '\u30B7\u30E7\u30FC\u30C8\u30AB\u30C3\u30C8\u306F\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u691C\u7D22\u306F\u3053\u3061\u3089\u3002',
		viewAll: '\u3059\u3079\u3066\u306E\u691C\u7D22\u7D50\u679C\u3092\u898B\u308B',
		recommendedResults: '\u30AF\u30A4\u30C3\u30AF\u30EA\u30F3\u30AF',
		suggestedSearches: '\u95A2\u9023\u691C\u7D22',  /* SMUI 8/21/14: add. */
		quickLinks: '\u30AF\u30A4\u30C3\u30AF\u30EA\u30F3\u30AF',  /* SMUI 8/21/14: add. */
		searchText: 'Search'
	},
	KR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'kr',
		noResults: '\uC77C\uCE58\uD558\uB294 \uAC80\uC0C9\uACB0\uACFC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uB2E4\uC2DC \uAC80\uC0C9\uD558\uAE30.',
		recommendedResults: '\uBE60\uB978 \uC5F0\uACB0',
		suggestedSearches: '\uCD94\uCC9C \uAC80\uC0C9',  /* SMUI 8/21/14: add. */
		quickLinks: '\uBE60\uB978 \uB9C1\uD06C',  /* SMUI 8/21/14: add. */
		viewAll: '\uAC80\uC0C9 \uACB0\uACFC \uC804\uCCB4 \uBCF4\uAE30.'
	},
	LA: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'la',
		noResults: 'No se encontraron resultados. Intenta en apple.com.',
		viewAll: 'Ver todos los resultados de la b\u00FAsqueda',
		recommendedResults: 'Enlaces r\u00E1pidos',
		suggestedSearches: 'B\u00FAsquedas sugeridas',  /* SMUI 8/21/14: add. */
		quickLinks: 'Enlaces',  /* SMUI 8/21/14: add. */
		searchText: 'Buscar'
	},
	LAE: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'lae',
		noResults: 'No shortcut found. Search all of apple.com.',
		viewAll: 'View all search results',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links',  /* SMUI 8/21/14: add. */
		searchText: 'Search'
	},
	MX: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'mx',
		noResults: 'No se encontraron resultados. Intenta en apple.com.',
		viewAll: 'Ver todos los resultados de la b\u00FAsqueda',
		recommendedResults: 'Enlaces r\u00E1pidos',
		suggestedSearches: 'B\u00FAsquedas sugeridas',  /* SMUI 8/21/14: add. */
		quickLinks: 'Enlaces',  /* SMUI 8/21/14: add. */
		searchText: 'Buscar'
	},
	MY: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/26/14: add. */
		code: 'my',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	NL: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'nl',
		noResults: 'Niets gevonden. Zoek opnieuw binnen www.apple.com.',
		viewAll: 'Toon alle zoekresultaten',
		recommendedResults: 'Snelkoppelingen',  /* SMUI 10/22/14: add. */
		suggestedSearches: 'Voorgestelde zoekresultaten',  /* SMUI 10/22/14: add. */
		searchText: 'Zoek'
	},
	NO: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'no',
		noResults: 'Fant ingen snarvei. S\u00F8k p\u00E5 hele apple.com.',
		viewAll: 'Vis alle s\u00F8keresultater',
		recommendedResults: 'Snarveier',  /* SMUI 10/22/14: add. */
		suggestedSearches: 'Foresl\u00E5tte s\u00F8k',  /* SMUI 10/22/14: add. */
		searchText: 'S\u00F8k'
	},
	NZ: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'nz',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	PH: {
		code: 'ph'
	},
	PL: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'pl',
		noResults: 'Fraza nie zosta\u0142a odnaleziona. U\u017Cyj apple.com.',
		viewAll: 'Przegl\u0105daj wszystkie wyniki',
		recommendedResults: 'Podr\u0119czne \u0142\u0105cza',
		searchText: 'Szukaj'
	},
	PT: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'pt',
		noResults: 'Nenhum resultado. Tente pesquisar em apple.com.',
		viewAll: 'Ver todos os resultados de pesquisa',
		recommendedResults: 'Liga\u00E7\u00F5es r\u00E1pidas',  /* SMUI 10/22/14: add. */
		suggestedSearches: 'Sugest\u00F5es de pesquisa',  /* SMUI 10/22/14: add. */
		searchText: 'Procurar'
	},
	RU: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'ru',
		noResults: '\u0421\u0441\u044B\u043B\u043E\u043A \u043D\u0435\u0442. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439\u0442\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 \u043F\u043E\u0438\u0441\u043A.',
		viewAll: '\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430',
		recommendedResults: '\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438',  /* SMUI 10/22/14: add. */
		suggestedSearches: '\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u043F\u043E\u0438\u0441\u043A\u0430',  /* SMUI 10/22/14: add. */
		searchText: '\u041F\u043E\u0438\u0441\u043A'
	},
	SA: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'sa'
	},
	SE: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'se',
		noResults: 'Ingen genv\u00E4g hittad. S\u00F6k i hela apple.com.',
		viewAll: 'Visa alla s\u00F6kresultat',
		recommendedResults: 'Snabbl\u00E4nkar',  /* SMUI 10/22/14: add. */
		suggestedSearches: 'F\u00F6reslagna s\u00F6kningar',  /* SMUI 10/22/14: add. */
		searchText: 'S\u00F6k'
	},
	SG: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'sg',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	TH: {
		code: 'th'
	},
	TR: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/21/14: add. */
		code: 'tr',
		noResults: '\u00D6neri bulunamad\u0131. T\u00FCm apple.com\\\'da ara.',
		viewAll: 'T\u00FCm arama sonu\u00E7lar\u0131n\u0131 g\u00F6ster',
		recommendedResults: '\u00D6nerilen Sonu\u00E7lar',
		searchText: 'Arama'
	},
	TW: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'tw',
		noResults: '\u5FEB\u901F\u641C\u5C0B\u627E\u4E0D\u5230\uFF0C\u8A66\u8A66 apple.com \u5B8C\u6574\u641C\u5C0B',
		viewAll: '\u700F\u89BD\u641C\u7D22\u7D50\u679C',
		recommendedResults: '\u5FEB\u901F\u9023\u7D50',
		suggestedSearches: '\u5EFA\u8B70\u7684\u641C\u5C0B',  /* SMUI 8/21/14: add. */
		quickLinks: '\u5FEB\u901F\u9023\u7D50',  /* SMUI 8/21/14: add. */
		searchText: '\u641C\u5C0B'
	},
	UK: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		code: 'uk',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	VN: {
		code: 'vn'
	},
	ZA: {
		disableQuickLinks: false,  /* SMUI 8/25/14: add. */
		disableSuggestedSearches: true,  /* SMUI 8/26/14: add. */
		code: 'za',
		suggestedSearches: 'Suggested Searches',  /* SMUI 8/21/14: add. */
		quickLinks: 'Quick Links'  /* SMUI 8/21/14: add. */
	},
	PO: null,
	UA: null,
	RO: null,
	CZ: null,
	HU: null,
	BG: null,
	HR: null,
	GR: null,
	IS: null
};

module.exports = geoMap;
},{}]},{},[41])