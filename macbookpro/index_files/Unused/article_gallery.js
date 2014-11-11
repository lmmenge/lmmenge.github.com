GalleryBuilder = function(contentsClassName, viewId, triggerClassName) {
	var parentContainer = null;
	var dotNav = null;
	var paddleNav = null;
	var slides = null;
	var slidesLength = 0;
	if($(viewId)==null){
		return;
	}
	if($(viewId).parentNode != undefined)
	{
		parentContainer = $(viewId).parentNode;
		dotNav= parentContainer.select('.simple-nav')[0];
		paddleNav = parentContainer.select('.paddle-nav')[0];
		
		slides = parentContainer.select('.' + contentsClassName);
		slidesLength = slides.length;
	}
	var dotsLength = 0;
	var paddleNavInserted = false;
	var allDotsInserted = false;
	var self = this;

	this.initializeGalleryElements = function() {
		if (!allDotsInserted || !paddleNavInserted) { return; }
		
		new AC.ViewMaster.SlideViewer(slides, $(viewId), triggerClassName, {
			useTouchEvents: true,
			silentTriggers: true,
			discontinuousPreviousNext: true
		});
		
	};
	
	this.addNavElement = function(id) {
		var el = document.createElement('li');
		var a = document.createElement('a');
		
		a.className = triggerClassName;
		a.href = '#' + id;
		el.appendChild(a);
		
		return el;
	};
	
	this.addPaddleNavElements = function() {
		var arrows = ['next', 'previous'];
		var arrowsLength = arrows.length;
		var i = 0;

        if(ACUtil.isIE < 9){
        	allDotsInserted = true;
            paddleNavInserted = true;
          //  self.initializeGalleryElements();
        }else{  
        	if(paddleNav != null){
        		paddleNav.observe("DOMNodeInserted", this.paddleNavInsertionDidComplete);
        	}
        }

		for (i = 0; i < arrowsLength; i++) {
			var el = document.createElement('li');
			var a = document.createElement('a');

			a.className = 'arrow ' + arrows[i].substring(0,4) + ' ' + triggerClassName;
			a.href = '#' + arrows[i];
			a.innerHTML = '<b>' + arrows[i].charAt(0).toUpperCase() + arrows[i].slice(1) + '</b>';
			el.appendChild(a);
			
			if(paddleNav != null){
				paddleNav.insert({
					bottom: el
				});
			}
		}
		
		if(ACUtil.isIE < 9){
			self.initializeGalleryElements();
		}
	};
	
	this.paddleNavInsertionDidComplete = function() {
		paddleNav.stopObserving("DOMNodeInserted", self.paddleNavInsertionDidComplete);
		paddleNavInserted = true;
		self.initializeGalleryElements();
	};
	
	this.setDotsActive = function(){
		var panel1 = $$('.hero2-gallery[href="#MASKED-gallery-hero-one"]')[0] == null ? $$('.hero-gallery[href="#gallery1-step1"]')[0] : null;
		 var val = $$('.hero-gallery[href="#MASKED-gallery-hero-one"]')[0] == null ? $$('.hero-gallery[href="#gallery1-step1"]')[0] : null;
		if(ACUtil.isIE < 9 && panel1 != null){
			panel1.addClassName('active');
		}
		
		if(ACUtil.isIE < 9 && val != null){
			val.addClassName('active');
		}
	};
	
	this.updateNavElements = function() {
		
		var noOfdots = $$('.simple-nav .hero-gallery[href]') != null? $$('.simple-nav .hero-gallery[href]').length : 0;
		
		var secondPanelNoOfDots = $$('.simple-nav .hero2-gallery[href]') != null ? $$('.simple-nav .hero2-gallery[href]').length : 0;
		
		for(j=1;j<noOfdots;j++){
			var val = String($$('.simple-nav .hero-gallery[href]')[0]);
			var initdot = val.substring(val.indexOf('#'));
			var imdot = String($$('.simple-nav .hero-gallery[href]')[j]);
			var nextdot = imdot.substring(imdot.indexOf('#'));
			
			var firstTokens = initdot.split("-");
			var nextdotTokens = nextdot.split("-");
			
			var firstVal = firstTokens[0]+"-"+firstTokens[1].substring(0, firstTokens[1].length-2);
			var firstValNxtDot = nextdotTokens[0]+"-"+nextdotTokens[1].substring(0, nextdotTokens[1].length-2);
			
			if(firstVal != firstValNxtDot){
				var link = "#"+nextdot.substring(nextdot.indexOf('-')+1);
				
				$$('.simple-nav .hero-gallery[href="'+nextdot+'"]').each(function(a) {
			        a.writeAttribute('href', link);
			    });
			}
		}
		
		for(k=1;k<secondPanelNoOfDots;k++){
			var val = String($$('.simple-nav .hero2-gallery[href]')[0]);
			var initdot = val.substring(val.indexOf('#'));
			var imdot = String($$('.simple-nav .hero2-gallery[href]')[k]);
			var nextdot = imdot.substring(imdot.indexOf('#'));
			
			var firstTokens = initdot.split("-");
			var nextdotTokens = nextdot.split("-");
			
			var firstVal = firstTokens[0]+"-"+firstTokens[1].substring(0, firstTokens[1].length-2);
			var firstValNxtDot = nextdotTokens[0]+"-"+nextdotTokens[1].substring(0, nextdotTokens[1].length-2);
			
			if(firstVal != firstValNxtDot){
				var link = "#"+nextdot.substring(nextdot.indexOf('-')+1);
				$$('.simple-nav .hero2-gallery[href="'+nextdot+'"]').each(function(a) {
			        a.writeAttribute('href', link);
			    });
			}
		}
		
	};
	
	this.addDotNavElements = function() {
		if(dotNav != null){
			dotNav.observe("DOMNodeInserted", this.dotNavInsertionDidComplete);
		}
		for (i = 0; i < slidesLength; i++) {
			var el = document.createElement('li');
			var a = document.createElement('a');

			a.className = triggerClassName;
			
			
			var ids = slides[i].id;
			
			var firstIndex=ids.indexOf("MASKED");
			var lastIndex = ids. lastIndexOf('MASKED')
			
			a.href = '#' + slides[i].id;
			el.appendChild(a);
			if(dotNav != null){	
				dotNav.insert({
					bottom: el
				});
			}
			
		}
		
	};
	
	this.dotNavInsertionDidComplete = function() {
		dotsLength += 1;
		
		if(dotsLength !== slidesLength) { return; }
		allDotsInserted = true;
		
		dotNav.stopObserving("DOMNodeInserted", self.dotNavInsertionDidComplete);
		self.initializeGalleryElements();
	};
	
	if(!ACUtil.isIE || ACUtil.isIE==9){
		this.addPaddleNavElements();
	}
	this.addDotNavElements();
	if(ACUtil.isIE==9){
		this.updateNavElements();
	}

	if(ACUtil.isIE<9){
		this.addPaddleNavElements();
		this.setDotsActive();
	}
	
};

Event.observe(window, 'load', function() {
	var gal = new GalleryBuilder('gallery-content', 'hero-gallery', 'hero-gallery');
	var gal2 = new GalleryBuilder('gallery-content', 'hero2-gallery', 'hero2-gallery');
	
});
