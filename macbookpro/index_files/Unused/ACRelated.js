var relatedSucess=false;
var discussionsSucess=false;
KmLoader.relatedElements= new Array();
KmLoader.discussionsElements= new Array();
String.prototype.lengthInPixel = function()
{
    var ruler = $("__ruler");
    ruler.innerHTML = this;
    return ruler.offsetWidth;
}

String.prototype.trimToPixel = function(length)
{
    var tmp = this;
    var trimmed = this;
    if (tmp.lengthInPixel() > length)
    {
        trimmed += "...";
        while (trimmed.lengthInPixel() > length)
        {
            tmp = tmp.substring(0, tmp.length-1);
            trimmed = tmp + "...";
        }
    }

    return trimmed;
}

Event.observe(window, 'load', function() {
	
	KmLoader.success = function(json, requestId) {
		console.log("RequestId:" + requestId);
		console.log("JSON length: " + json['results'].length);
				var showRelatedArticles = document.getElementById("showRelatedArticles").value;
		var showRelatedDiscussions = document.getElementById("showRelatedDiscussions").value;

		if(requestId==1){
			relatedSucess = true;
		}else if(requestId==2){
			discussionsSucess = true;
		}
		var componentName = KmLoader.getDiv(requestId);
		// contentDiv is a UL <- bad var name.
		var contentDiv = $(componentName);
		var outerContentDiv = $(componentName);
		
		if(document.getElementById('mobile-opt-in-link')){
            if ($('__ruler') == null) {
                    var ruler = new Element('span', {'id':'__ruler', style:'visibility: hidden; white-space: nowrap; font-size:10px;line-height: 1.3em;'});
                    //$(ruler).before(document.getElementById('mobile-opt-in-link-absolute'));
		document.getElementsByTagName('body')[0].insertBefore(ruler,document.getElementById('mobile-opt-in-link'));
            }
		}else{
            if ($('__ruler') == null) {
                    var ruler = new Element('span', {'id':'__ruler', style:'visibility: hidden; white-space: nowrap; font-size:10px;line-height: 1.3em;'});
                    $$('body')[0].insert(ruler);
            }
		}
		
		if(json==undefined || json==null) {
			//alert('Something went wrong. Please try again!') 
		} else if(json['results'].length>0) {
		

		var maxLength = componentName=='related_discussions' ? 70 : 100;
			
			
			var pixelsPerLine = 162;
			var maxTLength = componentName=='related_discussions'? pixelsPerLine*2: pixelsPerLine*3;
			for(i=0;i<json['results'].length;i++) {
				//do not show results that have the same title as the article we are looking at
				var showResult = ((componentName=="related_articles" || componentName=="related_hotdiscussions") && 
					ACUtil.trim(json.results[i].title).substring(0, 60)==ACUtil.trim($("main-title").innerHTML).substring(0,60)) ? false : true;
								
				if(showResult) {
					var title = json.results[i].title;
                    var trackRelatedArticles = "";
					if(KmLoader.isOmnitureSupported=="true" && (componentName=="related_articles" || componentName=="related_discussions")){
                    	var toArticleId= json.results[i].url;
                    	//toArticleId will now include the type of related link (kb--for all kb articles; thread--for discussions)
                    	if(toArticleId.lastIndexOf("/kb")>-1) {
                    		toArticleId = 'kb/' + toArticleId.match(/\/kb\/([a-zA-Z]{2}[0-9]*)/)[1];
                        }
                    	else if(toArticleId.lastIndexOf("/thread")>-1) {
                    		//to add omniture (sitecatalyst tagging) for related discussions
                    		toArticleId = 'thread/' + toArticleId.match(/\/thread\/([0-9]*)/)[1];
                        }
                    	
                    	var fromTitleArr = s.prop2.split('-');
                    	var fromArticleId = ACUtil.trim(fromTitleArr[0]);
                        trackRelatedArticles = "ACUtil.trackRelatedArticles('"+fromArticleId+"','"+toArticleId+"')";
                    }
					if((KmLoader.channel != null) && ((KmLoader.channel==="HOWTO_ARTICLES") || (KmLoader.channel==="TROUBLESHOOTING_ARTICLES"))){
	                    var relatedValue="<li><a href='" + json.results[i].url + "' onclick=\"s_objectID='" +  json.results[i].url + "_p" + requestId + "-" + i + "';"+trackRelatedArticles+"\"><h3 class=\'relatedTitle\'>" + title + "</h3></a><p>"+json.results[i].excerpt+"</p></li>";
					} else{
	                    var relatedValue="<li><a href='" + json.results[i].url + "' onclick=\"s_objectID='" +  json.results[i].url + "_p" + requestId + "-" + i + "';"+trackRelatedArticles+"\"><h5 class=\'relatedTitle\'>" + title + "</h5></a><p>"+json.results[i].excerpt+"</p></li>";
					}
					if(requestId=='1' && showRelatedArticles=="true"){
                    	KmLoader.relatedElements.push(relatedValue);
                    }else if(requestId=='2' && showRelatedDiscussions=="true"){
                    	KmLoader.discussionsElements.push(relatedValue);
                    }

				}
			}
				

		}
		

}
	
	KmLoader.error = function(errorMsg, requestId) {
		if(requestId == "1"){
			$('articleError').value = true;
		}else if(requestId=="2"){
			$('discussionError').value = true;
		}
		var contentDiv = $(KmLoader.getDiv(requestId));
		var outerContentDiv = $('outer_' + KmLoader.getDiv(requestId));
				//alert('RequestId: ' + requestId + " Error: " + errorMsg);
	}
	
	KmLoader.getDiv = function(requestId) {
		var divName;
		if(requestId==1) {
			divName = 'related_articles';
		}
		else if(requestId==2) {
			divName = 'related_discussions';
		}
		else if(requestId==3) {
			divName = 'related_hotdiscussions';
		}
		else if(requestId==4) {
			divName = 'related_videos';
		}
		return divName;
	}

});

