    if (typeof String.prototype.trim == "undefined") {
        String.prototype.trim = function () {
            var s = this.replace(/^\s*/, "");
            return s.replace(/\s*$/, "");
        }
    }
    
    function msieversion()
    {
       var ua = window.navigator.userAgent
       var msie = ua.indexOf ( "MSIE " )

       if ( msie > 0 )      // If Internet Explorer, return version number
          return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )))
       else                 // If another browser, return 0
          return 0

    }    
   
    /*
     * locale - iknow locale string (en_US, ja_JP, etc);
     * _date - date object;
     * return formatted date string; 
     */
    function formatDateByLocale(locale, _date) {
    	if (locale == "ja_JP") { // YYYY/MM/DD
    		var m = (_date.getMonth() + 1) <10? "0"+ _date.getMonth(): _date.getMonth();
    		var d = _date.getDate() < 10 ? "0"+ _date.getDate() : _date.getDate();
    		var y = _date.getFullYear();
    		
    		return y + "/" + m + "/" + d; 
    	} 
    	
    	// MMM D, YYYY;
    	var months = ["Jan","Feb"," Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var _today = new Date();
        
        if (_date.getFullYear() == _today.getFullYear() 
        		&& _date.getMonth() == _today.getMonth()
        		&& _date.getDate() == _today.getDate()) {
        	return "Today, "+ months[_date.getMonth()]+" "+_date.getDate()+", "+_date.getFullYear();
        }
        
        return months[_date.getMonth()]+" "+_date.getDate()+", "+_date.getFullYear();
    }
    
    DeDupeFeaturedQA.prototype.searchForm = null;
    DeDupeFeaturedQA.prototype.searchField= null;
    DeDupeFeaturedQA.prototype.resultsContainer= null;
    DeDupeFeaturedQA.prototype.originalFeatureQAInnerHTML=null;
    DeDupeFeaturedQA.prototype.originalResultTableHeight=0;
    DeDupeFeaturedQA.prototype.results= null; 
    DeDupeFeaturedQA.prototype.entryDelay= 500;
    DeDupeFeaturedQA.prototype.searchURL= "/kb/index?page=dedupe";
    DeDupeFeaturedQA.prototype.searchQuery= "";
    DeDupeFeaturedQA.redirectUrl= null;
    DeDupeFeaturedQA.inStr="";
    DeDupeFeaturedQA.likesStr="";
    DeDupeFeaturedQA.repliesStr="";
    DeDupeFeaturedQA.similarQuestion=""; 
    DeDupeFeaturedQA.prototype.locale="en_US";
    DeDupeFeaturedQA.callback="DeDupeFeaturedQA.receiveSuccess";
    DeDupeFeaturedQA.staticResourceUrl="";
    
    function DeDupeFeaturedQA ( formId, searchFieldId, resultsContainerId, 
			articleId, locale, redirectUrl, 
			inStr, likesStr, repliesStr, similarQuestion, 
			searchURL, idList, jiveURL, resourceUrl) {
    	
    	if(searchURL != 'undefined' && searchURL.trim().length >0 ) {
    		this.searchURL = searchURL;
    	}

		this.searchForm=$(formId);
		this.searchField=this.searchForm[searchFieldId];
		
		this.resultsContainer=$(resultsContainerId);
		this.originalFeatureQAInnerHTML=this.resultsContainer.innerHTML;
		
		if(	this.resultsContainer.select('.results-table')[0] 
			&& this.resultsContainer.select('.results-table')[0].clientHeight ) {
			this.originalResultTableHeight=this.resultsContainer.select('.results-table')[0].clientHeight;
		}
		
		this.searchURL=this.searchURL+"&id="+articleId+"&locale="+locale+"&q=";    		
		
		if (msieversion() == 7) {
			Event.observe( searchFieldId, 'keydown', this.onKeyDownIE7.bind(this));	
		} else {
			this.searchField.observe('keydown', this.onKeyDown.bind(this));
		}

		this.idList = idList;
		this.jiveURL = jiveURL;
		
		DeDupeFeaturedQA.redirectUrl = redirectUrl;
		DeDupeFeaturedQA.inStr = inStr;
		DeDupeFeaturedQA.likesStr = likesStr;
		DeDupeFeaturedQA.repliesStr = repliesStr;
		DeDupeFeaturedQA.staticResourceUrl = resourceUrl;
		DeDupeFeaturedQA.locale = locale;
		DeDupeFeaturedQA.similarQuestion = similarQuestion;
	}
	
	DeDupeFeaturedQA.receiveSuccess = function(featuredQAs) {
		
        var resultsTable = new Element('table', {'class': 'results-table', 'id': 'ftable'} );
        var resultsTitle = new Element('div',{'class': 'title'}).insert(DeDupeFeaturedQA.similarQuestion);                  
        var resultIconTd = new Element('td').insert(new Element('span',{'class':'result-icon'}));
       
       for (var featuredQAStr in featuredQAs) {
	  		if (featuredQAs.hasOwnProperty(featuredQAStr)) {
	  			var featuredQA = featuredQAs[featuredQAStr].evalJSON(true);
	  			var rr = new ResultRow(featuredQA, DeDupeFeaturedQA.redirectUrl, DeDupeFeaturedQA.locale);
	  			
	  			rr.intext = DeDupeFeaturedQA.inStr;	    		  			
	  			rr.liketext = DeDupeFeaturedQA.likesStr;
	  			rr.repliestext= DeDupeFeaturedQA.repliesStr;
	  			resultsTable.insert( rr.createRow() );
			}
		}

        var resultsDiv = $('results');
        resultsDiv.insert(resultsTitle);  		        
        resultsDiv.insert(resultsTable);

        var discussionMessages =  $$('table .message');
        
        if (discussionMessages && discussionMessages.size() > 0) {
            var messageTape = new Element('div', {id:'messagetape', 'class':'message'}).update("testing 232");
            discussionMessages.last().up().insert( messageTape );
            var messageLineHeight = messageTape.getHeight();
            messageTape.remove();
            
            $$('table .message').each( function(msg) {
                 msg.setStyle({
                     'height': (messageLineHeight * 2) + 'px', 
                     'overflow': 'hidden'});
                 }       
             );
        }
        
		$('results-container').setStyle({
			'-moz-transition': 'all 0.2s ease-in',
			'-webkit-transition': 'all 0.2s ease-in',
			'-o-transition': 'all 0.2s ease-in',
			'transition': 'all 0.2s ease-in',
			'overflow': 'hidden',
			'opacity':1,
			'height': '50px'    		        		    		        
	    });

        // hide spinner
        $('results-loading').setStyle({display:'none'});

        // render result
        $('results-container').setStyle({
			'-moz-transition': 'all 0.2s ease-in',
			'-webkit-transition': 'all 0.2s ease-in',
			'-o-transition': 'all 0.2s ease-in',
			'transition': 'all 0.2s ease-in',
			'overflow': 'hidden',
			'opacity':1,
			'height': resultsTable.clientHeight+'px'    		        		    		        
        });		
	}
	
    DeDupeFeaturedQA.prototype.onKeyDown = function(evt) {
		if (this.timeoutId) window.clearTimeout(this.timeoutId);
		
		var self = this;
		this.timeoutId = window.setTimeout( function() {self.getResults()}, this.entryDelay); 		
	}

    DeDupeFeaturedQA.prototype.onKeyDownIE7 = function(evt) {
		if (this.timeoutId) window.clearTimeout(this.timeoutId);

		var self = this;
		this.timeoutId = window.setTimeout( self.getResults.bind(self), this.entryDelay);
	}
    
    DeDupeFeaturedQA.prototype.showFeatureQA= function() {
    	//hide results
			$('results-loading').setStyle({display:'none'});     
    	$('results-container').setStyle({
			'-moz-transition': 'all 0.2s ease-in',
			'-webkit-transition': 'all 0.2s ease-in',
			'-o-transition': 'all 0.2s ease-in',
			'transition': 'all 0.2s ease-in',
			'overflow': 'hidden',
			'opacity':1,
			'height': '0px'    		        		    		        
    	});
    	this.resultsContainer.innerHTML = this.originalFeatureQAInnerHTML;
    	
    	if (tmpLikeCounts) {
        	var ids = this.idList.split(",");
        	
        	for ( var j = 0; j < ids.length; j++) {
        		if (tmpLikeCounts["x"+ids[j]] > -1) {
        			var likeCounts = tmpLikeCounts["x"+ids[j]];
        			updateCountLikes(likeCounts, ids[j]);
        		}
        	}
    	}
    	
    	$('results-container').setStyle({
			'-moz-transition': 'all 0.2s ease-in',
			'-webkit-transition': 'all 0.2s ease-in',
			'-o-transition': 'all 0.2s ease-in',
			'transition': 'all 0.2s ease-in',
			'overflow': 'hidden',
			'opacity':1,
			'height': this.originalResultTableHeight+'px'    		        		    		        
    	}); 
     	
    }
    
    DeDupeFeaturedQA.prototype.sendCall= function(url) {
    	this.obj=new JSONscriptRequest(url + "&callback=" + DeDupeFeaturedQA.callback);
    	
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
	
	DeDupeFeaturedQA.prototype.getResults= function() {
		var oldQuery = this.searchQuery;
		this.searchQuery = $F(this.searchField).trim();
		
		if ( this.searchQuery == '') {
			// show original feature qa list
			this.showFeatureQA();
        	return;
		} 	
		
		if ( oldQuery == this.searchQuery ) return;
	 	
		//clear results
		$('results').update();
		
		//show spinner
	    $('results-loading').setStyle({display:'block'});    

		var searchurl = this.searchURL+encodeURIComponent(this.searchQuery);

		this.sendCall(searchurl);
	}
	

	ResultRow.prototype.id= 0;
	ResultRow.prototype.title= null;
	ResultRow.prototype.summary= null;
	ResultRow.prototype.correctAnswer= null;
	ResultRow.prototype.noLikes= 0;
	ResultRow.prototype.noReplies= 0;
	ResultRow.prototype.productCommunity= null;
	ResultRow.prototype.productCommunityName= null;
	ResultRow.prototype.fqaUrl= "";
	ResultRow.prototype.modifiedDate= null;
	ResultRow.prototype.intext= "in";
	ResultRow.prototype.commatext= ", ";
	ResultRow.prototype.dashtext=" - ";
	ResultRow.prototype.spacetext=" ";
	ResultRow.prototype.liketext="people liked this";
	ResultRow.prototype.repliestext= "replies";
	ResultRow.prototype.locale= "en_US";
    	
    function ResultRow(featuredQA, redirectUrl, locale) {
        this.id = featuredQA['ID'];
        this.title = featuredQA['TITLE'];
        this.summary = featuredQA['SUMMARY'];
        this.correctAnswer = featuredQA['CORRECT_ANSWER'];
        this.noLikes = featuredQA['NO_LIKES'];
        
        if (locale) {
        	this.locale = locale;
        }
        
        if (this.id && tmpLikeCounts && tmpLikeCounts["x"+this.id]) {
        	this.noLikes = tmpLikeCounts["x"+this.id];
        }
        
        this.noReplies = featuredQA['NO_REPLIES'];
        this.productCommunity = featuredQA['PRODUCT_COMMUNITY'];
        this.productCommunityName = featuredQA['PRODUCT_COMMUNITY_NAME']; 
        this.modifiedDate = new Date(parseInt(featuredQA['MODIFIED_DATE']));
        this.fqaUrl = redirectUrl+this.id;
    }
    
    ResultRow.prototype.createRow = function() {
    	var resultIconImg = "<img src='"+ DeDupeFeaturedQA.staticResourceUrl+ "images/qtitle-icon.gif' 'width'='17' 'height'='14'></img>";
        var resultIconTd = "<td style='valign:top;' width='22px'>"+resultIconImg+"</td>";
        
        var questionTitleLink = "<a class='question-title' href='"+this.fqaUrl+"'>"+this.title+"</a>";                        
        var correctAnswerDiv = "<div class='message'>"+ this.correctAnswer+ "</div>";
        var communityLink =  "<a class='font-color-meta-light' href='"+ this.productCommunity+"'>"+this.productCommunityName+"</a>";
        
        var threadLinkText = "";
        if (this.repliestext.indexOf("{0}") < 0) {
        	threadLinkText = this.noReplies+ this.spacetext + this.repliestext;
		} else {
			threadLinkText = this.repliestext.replace("{0}", this.noReplies);
		}
		var threadLink = "<a class='threadLink' href='"+this.fqaUrl+"'>"+threadLinkText+"</a>";
		
        var formattedDate = formatDateByLocale(this.locale, this.modifiedDate);       
        
        var metadataSpan = "<span class='font-color-meta-light metadata'>";
        if (this.intext.indexOf("{0}") < 0) {
        	metadataSpan += this.intext + this.spacetext + communityLink;
        } else {
        	var noLikeIdx = this.intext.indexOf("{0}");
        	
        	metadataSpan += this.intext.substring(0, noLikeIdx)
        			+ communityLink 
        			+ this.intext.substring(noLikeIdx+3, this.intext.length);
        }
        
        metadataSpan += this.commatext;
        
        metadataSpan += formattedDate + this.spacetext            
        	+this.dashtext + this.spacetext;
        
        var noLikesSpan = "<span id=	'"+this.id+"'>"+this.noLikes+"</span>";
        
        if (this.liketext.indexOf("{0}") < 0) {
        	metadataSpan += noLikesSpan + this.spacetext + this.liketext;
    	} else {
        	metadataSpan += this.liketext.replace("{0}", noLikesSpan);
    	}
  
        metadataSpan += this.spacetext
        	+ this.dashtext + this.spacetext + threadLink;                                                     
         
        metadataSpan += "</span>";
        
        var featuredQATd = "<td><div>" + questionTitleLink + correctAnswerDiv + metadataSpan + "<div></td>";
        
        var tableRow = "<tr class='separate'>"
        	+resultIconTd
        	+featuredQATd
        	+"</tr>";

        return tableRow;
    }