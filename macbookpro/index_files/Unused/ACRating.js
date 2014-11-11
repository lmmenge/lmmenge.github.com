var ACRating = {
	'send' : function(ratingNum, id, locale, comments) {
		var xmlhttp;
		var currentUri = ACUtil.getBaseURL();
		$('question-state').style.display = "none";
		$('rating-send').style.display = "block";
		comments = encodeURI(comments, "UTF-8");
		var url = currentUri + "kb/index?page=ratingData&rating=" + ratingNum + "&id=" + id + "&locale=" + locale + "&comments=" + comments;
		// xml http request for submitting the ratings
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		}else{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			}
		}
		xmlhttp.open("GET", url, false);
		xmlhttp.send();
		// timeout for aborting the synchronous request if response is not coming
		var xmlHttpTimeout = setTimeout(ajaxTimeout, 5000);
		function ajaxTimeout() {
			xmlhttp.abort();
		}
		// Hiding the feedback menu and displaying the feedback response message
		$('rating-send').style.display = "none";
		$('rating-done').style.display = "block";
		$('results').style.visibility = "hidden";
		$('results').style.height = '0px';
		$('feedback').value = "";
		
		// Unbinding all the events registered for article ratings 
		window.onunload = function() {};
		ACRating.ratingMobileNoFlag = false;
		$$('a').each(function(e) {
			Event.stopObserving($(e), 'click', ACRating.externalClick);
		});
		
		return true;
	},

	'submitRating' : function(ratingNum, id, locale, comments) {
		var ratingResponse = ACRating.send(ratingNum, id, locale, comments);
		try {
			var helpful = ratingNum == 5 ? 'yes' : 'no';
			var s = s_gi(s_account);
			s.eVar2 = 'acs::kb::article rating::helpful=' + helpful;
			s.events = 'event2';
			void (s.t());
		} catch (e) {
		}
		return ratingResponse;
	},

	'externalClick' : function(event) {
		ACRating.submitRating(1, ACRating.documentId, ACRating.locale, "");
	}
};