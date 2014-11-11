var ACTruncate = {
	'truncate' : function(node) {
		
	    if(!Object.isUndefined(node) && node !=null){
		
	    	if (this.shouldTruncate(node)) {
			
			var content = node.down();
			var maxheight = this.getTruncatedHeight();
			content.setStyle({maxHeight:'none'});	
			content.setStyle({height:maxheight+'px'});		// replace maxHeight with starting height for animation
			// create the "more" link
			var triggerDiv = document.createElement('div');
			var triggerLink = document.createElement('a');
			var triggerText = document.createTextNode(ACStaticText.more);
			triggerLink.appendChild(triggerText);
			triggerLink.setAttribute('href','#');
			$(triggerLink).addClassName('trigger');
			triggerDiv.appendChild(triggerLink);
			node.appendChild(triggerDiv);
			
			// attach click handler
			Event.observe(triggerLink, 'click', ACTruncate.handleShowMore);
		  }
	    }
	}, 

	 'shouldTruncate' : function(node) {
		var truncate = false;
		var nodeContent = node.down(1);
		if(!Object.isUndefined(nodeContent)){
		truncate =  (nodeContent.offsetHeight > 112);
		}       

		return truncate;
     },
	
	'handleShowMore' : function(e) {
		
		var trigger = Event.element(e);			 		// user clicked this
		var content = trigger.up().previous();
		var h = content.down().offsetHeight;			// find actual height of the content
		
		content.addClassName("transition");				// set the CSS transition
		content.setStyle({height:h+'px'});				// set the new height
		trigger.update(ACStaticText.less); 				// change link to 'less'
		
		Event.stopObserving(trigger);			
		Event.observe(trigger, 'click', ACTruncate.handleShowLess);	// swap the click handler to handleShowLess()
	},
	
	'handleShowLess' : function(e) {
		var trigger = Event.element(e);			 		// user clicked this
		var content = trigger.up().previous();
		var maxheight = ACTruncate.getTruncatedHeight();
		content.setStyle({height:maxheight+'px'});				// set the new height
		trigger.update(ACStaticText.more); 				// change link to 'less'
		
		Event.stopObserving(trigger);			
		Event.observe(trigger, 'click', ACTruncate.handleShowMore);	// swap the click handler to handleShowMore()
	},
	'getTruncatedHeight': function(){
		var para_text = $$('.truncate');
		var line_height = (parseInt(para_text[0].getStyle('line-height'),10)) * 5;
		var maxheight = line_height;
		for (var i=0, l=para_text.length; i<l; i++){
	      	var height = para_text[i].getHeight();
		  	if (height > line_height) {
		  		maxheight = height - (height - line_height);
		  	}
		}
		return maxheight;
	}
};


Event.observe(window, 'load', function() {

	ACTruncate.truncate($('intro-container'));
	ACTruncate.truncate($('affected-container'));
	
});