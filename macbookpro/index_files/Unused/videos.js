KmLoader.relatedVideos = new Array();
KmLoader.relatedArticles = new Array();

var relatedVideos = false;
var relatedArticle = false;

var videoDisplay = "true";
var articleDisplay = "true";

function selectLanguage(selectedLocale,localeParamPassed){
	if(localeParamPassed!=undefined && localeParamPassed!=undefined && localeParamPassed!="" && localeParamPassed!="null" && localeParamPassed!="NULL" && localeParamPassed!=null){
		window.location = '/kb/'+articleId+'?viewlocale='+selectedLocale+'&locale='+localeParamPassed;
	}else{
		window.location = '/kb/'+articleId+'?viewlocale='+selectedLocale;
	}
}

KmLoader.relatedVideosSuccess = function(json, requestId) {
	var html = '';
	if(json==undefined || json==null) {
		//alert('Something went wrong. Please try again!') 
	}
	else if(json['results'].length>0 && $('portlet_1') !=null) {
		 var relatedDivName='related';
         $(relatedDivName).show(); 
         
         for(i=0; i<json['results'].length;i++){
        	 var showResult = (ACUtil.trim(json.results[i].title).substring(0, 60)==ACUtil.trim($('content').getElementsByTagName('h1')[0].innerHTML).substring(0,60)) ? false : true;
        	 if(!showResult){
        		 json['results'].splice(i,1);
        	 }
         }
	
	
		for(i=0; i<json['results'].length; i++) {
			//do not show results that have the same title as the article we are looking at
			var showResult = (ACUtil.trim(json.results[i].title).substring(0, 60)==ACUtil.trim($('content').getElementsByTagName('h1')[0].innerHTML).substring(0,60)) ? false : true;
			
			if (showResult) {
				var title = json.results[i].title;
				html += '<li class="top-results dt-thumbnail"><div class="thumbnail">';
				html += '<a href="' + json.results[i].url + '" onclick="s_objectID=\'' +  json.results[i].url + '_p' + requestId + '-' + i + '\';"><img src="' + json.results[i].thumbnail + '" alt="thumbnail"></a>';
				html += '</div><h3>';
				html += '<a href="' + json.results[i].url + '" onclick="s_objectID=\'' + json.results[i].url + '_p' + requestId + '_' + i + '\';">' + json.results[i].title + '</a></li>';
				
				KmLoader.relatedVideos.push(html);
				html="";

			}
			
		}
		relatedVideos = true;
		articleDisplay = document.getElementById('articleDisplay').value;
		if(articleDisplay == "false"){
			relatedArticle = true;
		}
		
		   if(relatedVideos == true && relatedArticle == true){
           	var maxNumberOfVideosToShow=KmLoader.relatedArticles.length<3?6-KmLoader.relatedArticles.length:3;
           	var maxNumberOfArticlesToShow=KmLoader.relatedVideos.length<3?6-KmLoader.relatedVideos.length:3;
           	
           	for(i=0;i<KmLoader.relatedVideos.length && i< maxNumberOfVideosToShow;i++){
           		$('portlet_1').innerHTML +=KmLoader.relatedVideos[i];
           		}
           	for(i=0;i<KmLoader.relatedArticles.length && i< maxNumberOfArticlesToShow;i++){
           			$('portlet_1').innerHTML += KmLoader.relatedArticles[i];

           	}
           	
           	if(KmLoader.relatedVideos.length == 0 && KmLoader.relatedArticles.length == 0){
           		$('related').style.display = "none";
           	}else{
          		ACUtil.borderAdditionalRelatedThumbNailsVideos();
           	}
           		$('article-list').select('img')[0].style.display = "none";
           }else{
        	   if(relatedVideos == true && relatedArticle == false){
        		   var maxNumberOfVideosToShow=KmLoader.relatedArticles.length<3?6-KmLoader.relatedArticles.length:3;
                  	for(i=0;i<KmLoader.relatedVideos.length && i< maxNumberOfVideosToShow;i++){
                  		$('portlet_1').innerHTML +=KmLoader.relatedVideos[i];
                  	}
                  	ACUtil.borderAdditionalRelatedThumbNailsVideos();
        	   }else{
        		   $('related').style.display = "none";
        	   }
        	   
           }
		   
		
	}else{
		$('related').style.display = "none";
	}
}

KmLoader.relatedVideosError = function(errorMsg, requestId){
	if(requestId=="4" && relatedArticle == true){
	           	var maxNumberOfVideosToShow=KmLoader.relatedArticles.length<3?6-KmLoader.relatedArticles.length:3;
	           	var maxNumberOfArticlesToShow=KmLoader.relatedVideos.length<3?6-KmLoader.relatedVideos.length:3;
	           	
	           	for(i=0;i<KmLoader.relatedVideos.length && i< maxNumberOfVideosToShow;i++){
	           		$('portlet_1').innerHTML +=KmLoader.relatedVideos[i];
	           		}
	           	for(i=0;i<KmLoader.relatedArticles.length && i< maxNumberOfArticlesToShow;i++){
	           			$('portlet_1').innerHTML += KmLoader.relatedArticles[i];

	           	}
	           	
	           	if(KmLoader.relatedVideos.length == 0 && KmLoader.relatedArticles.length == 0){
	           		$('related').style.display = "none";
	           	}else{
	          		ACUtil.borderAdditionalRelatedThumbNailsVideos();
	           	}
	           		$('article-list').select('img')[0].style.display = "none";
		
	}
	$('related-videos').hide();
}

KmLoader.relatedArticlesSuccess = function(json, requestId) {
    
    if ($('portlet_1') != null) {

        // fix spacing for manually coded linked lists above/below portlet
        if ($('portlet_1').previous() != undefined && $('portlet_1').previous().match('ul')) {
            $('portlet_1').previous().setStyle({paddingBottom: '0px'}); 
        }
        if ($('portlet_1').next() != undefined && $('portlet_1').next().match('ul')) {
            $('portlet_1').setStyle({paddingBottom: '0px'}); 
        }

        if(json==undefined || json==null) {
            //alert('Something went wrong. Please try again!') 
        }
		else if(json['results'].length>0) {

            var portletData = '';
            var relatedDivName='related';
            $(relatedDivName).show(); 
            
            for(i=0;i<json['results'].length;i++) {
                if (json.results[i] != null) {
					//do not show results that have the same title as the article we are looking at
					var showResult = (ACUtil.trim(json.results[i].title).substring(0, 60)==ACUtil.trim($('content').getElementsByTagName('h1')[0].innerHTML).substring(0,60)) ? false : true;
					var url = json.results[i].url;
					
                    if(showResult) {
                        
                        // get icon based on doctype
                        var iconStyle = '';
						var docId = url.substr(url.lastIndexOf("/")+1);
                        switch (docId.substr(0,2)) {
                            case 'HT':
                                iconStyle = "dt-howto-articles";
                                break;
                            case 'TS':
                                iconStyle = "dt-troubleshooting-articles";
                                break;
                            default:
                                iconStyle = "dt-document";
                                break
                        }

                        
                        // get excerpt, truncate if necessary
                        var excerpt = (json.results[i].excerpt.length>0) ? json.results[i].excerpt: '&nbsp;';
                        if (excerpt.length > 200) {
                            excerpt = excerpt.substring(0, 200);
                            excerpt = excerpt.replace(/\w+$/, '');
                            excerpt += "...";
                        }

                        portletData += "<li class=\"portlet-results " + iconStyle + "\">";
                        portletData += "<h3><a href=\"" + url + "\" onclick=\"s_objectID='" +  url + "_p" + requestId + "-" + i + "';\">" + json.results[i].title + "</a></h3>";
                        portletData += "<div class=\"excerpt\"><p>" + excerpt + "</p></div></li>";
                        
                        KmLoader.relatedArticles.push(portletData);
                        portletData="";
  
                    }
                }
            }
            relatedArticle = true;
            videoDisplay = document.getElementById('videoDisplay').value;
            
            if(videoDisplay == "false"){
            	      	var maxNumberOfVideosToShow=KmLoader.relatedArticles.length<3?6-KmLoader.relatedArticles.length:3;
                      	var maxNumberOfArticlesToShow=KmLoader.relatedVideos.length<3?6-KmLoader.relatedVideos.length:3;
                      	
                      	for(i=0;i<KmLoader.relatedVideos.length && i< maxNumberOfVideosToShow;i++){
                      		$('portlet_1').innerHTML +=KmLoader.relatedVideos[i];
                      		}
                      	for(i=0;i<KmLoader.relatedArticles.length && i< maxNumberOfArticlesToShow;i++){
                      			$('portlet_1').innerHTML += KmLoader.relatedArticles[i];

                      	}
                      	
                      	if(KmLoader.relatedVideos.length == 0 && KmLoader.relatedArticles.length == 0){
                      		$('related').style.display = "none";
                      	}else{
                     		ACUtil.borderAdditionalRelatedThumbNails();
                      	}
                      		$('article-list').select('img')[0].style.display = "none";
            }
        }
    }
    relatedArticle = true;
}

KmLoader.relatedArticlesError = function(errorMsg, requestId){
	
	if(requestId == "2"){
		relatedArticle = true;
	}
	if($('related-articles')){
		$('related-articles').hide();
	}
		
}


