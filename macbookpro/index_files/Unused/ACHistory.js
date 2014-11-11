var ACHistory = {
	'debug': false,

	'initialize' : function() {
		
		if(ACUtil.readCookie('ac_history')==null) {
			
			var constructObj = {
				'search': [],
				'kb': [],
				'help': [],
				'psp': [],
				'offer_reason': {},
				'total_count': {}
			};
			
			ACHistory.saveHistory(constructObj);
			
		}
	},
	
	'addKbView': function(articleID, title, locale, referrer) {
		var userHistory = ACHistory.getHistory();
		var epochUTC = ACHistory.getEpochUTC();
		var title = title.substring(0, 99);
		
		if(userHistory['kb'].length>=5) {
			userHistory['kb'].pop();
		}
		
		if(!userHistory['total_count'].kbs) {
			userHistory['total_count'].kbs = 0;
		}
		
		userHistory['total_count'].kbs = userHistory['total_count'].kbs + 1;
		userHistory['total_count'].last_kb = epochUTC;
		
		userHistory['kb'].unshift([articleID,title,locale,epochUTC,referrer]);
		ACHistory.saveHistory(userHistory);
		
		if(typeof console != 'undefined' && ACHistory.debug==true) {
			console.log(userHistory['kb']);
			console.log("# kbs: " + userHistory['total_count'].kbs);
		}
		
	},
	
	'addHelpView': function(helpPath, referrer) {
		var userHistory = ACHistory.getHistory();

		if(userHistory['help'].length>=5) {
			userHistory['help'].pop();
		}
		
		userHistory['help'].unshift([helpPath, ACHistory.getEpochUTC(), referrer]);
		ACHistory.saveHistory(userHistory);
		
		if(typeof console != 'undefined' && ACHistory.debug==true) console.log(userHistory['help']);
	
	},
	
	'addPspView': function(pspPath, referrer) {
		var userHistory = ACHistory.getHistory();

		if(userHistory['psp'].length>=5) {
			userHistory['psp'].pop();
		}
		
		userHistory['psp'].unshift([pspPath, ACHistory.getEpochUTC()]);
		ACHistory.saveHistory(userHistory);
		
		if(typeof console != 'undefined' && ACHistory.debug==true) console.log(userHistory['psp']);
	
	},
	
	'addSearch': function(query, locale) {
		var userHistory = ACHistory.getHistory();
		
		var epochUTC = ACHistory.getEpochUTC();
		var query = query.substring(0, 99);
		
		if(!userHistory['total_count'].searches) {
			userHistory['total_count'].searches = 0;
		}
		
		userHistory['total_count'].searches = userHistory['total_count'].searches + 1;
		userHistory['total_count'].last_search = epochUTC;
		
		if(userHistory['search'].length>=5) {
			userHistory['search'].pop();
		}
		
		userHistory['search'].unshift([query,locale,epochUTC]);
		ACHistory.saveHistory(userHistory);
		
		if(typeof console != 'undefined' && ACHistory.debug==true) {
			console.log(userHistory['search']);
			console.log("# queries: " + userHistory['total_count'].searches);
		}

	},
	
	'addOfferReason': function(locale) {
		var userHistory = ACHistory.getHistory();
		var detail = '';
		var type = '';
		var url = window.location.href;
		
		userHistory['offer_reason'].url = url;
		userHistory['offer_reason'].locale = locale;
		userHistory['offer_reason'].timestamp = ACHistory.getEpochUTC();
		
		ACHistory.saveHistory(userHistory);
		
		if(typeof console != 'undefined' && ACHistory.debug==true) console.log(userHistory['offer_reason']);
	},
	
	'getEpochUTC': function() {
		var epochUTC = Date.parse(new Date().toGMTString());
		return epochUTC;
	},
	
	'saveHistory': function(historyObj) {
		var historyString = Object.toJSON(historyObj);

		//remove whitespace
		historyString = historyString.replace(/" /g, "\"");
		historyString = historyString.replace(/\": /g, "\":");
		historyString = historyString.replace(/\, \"/g, ",\"");
		
		ACUtil.writeCookie('ac_history', historyString, true);
	},
	
	'getHistory': function() {
		var acHistoryCookie = ACUtil.readCookie('ac_history');
		return acHistoryCookie.evalJSON(true);
	}
	
};

ACHistory.initialize();

/* test suite
ACHistory.debug = true;
ACHistory.addKbView('HT1012', 'iMac test', 'en_US', 'max');
ACHistory.addHelpView('AddressBook/4.0/en/ad46.html', 'search');
ACHistory.addSearch('problems with imac', 'en_US');
ACHistory.addOfferReason('en_US');
ACHistory.addPspView('/jp/support/ipod/');
*/

