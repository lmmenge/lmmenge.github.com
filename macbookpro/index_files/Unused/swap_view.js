// = Apple.com SwapView Library =
// 
// Library for swapping between content in a single container element
// by triggers in the document, programmatically, or automatically over time.
// 
// Content can be hardcoded on the page, loaded from external files, or generated with javascript.
// 
if (typeof(AC) === 'undefined') {
	AC = {};
}

if (typeof(document.event) === 'undefined') {
	document.event = {};
}

if (Event.Publisher) {
	Object.extend(document.event, Event.Publisher);
}

// == AC.SwapView ==
// 
// Class that manages inserting, replacing, and removing content from a single
// element in the DOM.
// 
// This is where the content is actually changed on the page. It pretty much only handles
// the inserting, replacing and removing of content from the view element in the DOM
// 
// ==== Delegate Methods ====
// * {{{willClose(swapView, currentContent)}}}: The swap view is about to
//  	swap out the specified content.
// 
// * {{{isContentLoaded(swapView, content)}}}: Is the specified content
//  	loaded and ready for insertion into the DOM?
// 
// * {{{loadContent(swapView, content)}}}: Load the specified content such that
//  	it is displayable within the DOM. The delegate is expected to call
//  	{{{setLoadedContent}}} when finished to let the swapView know when
//  	the content is ready.
// 
// * {{{didAppendContent}}}
// 
// * {{{shouldAnimateContentChange}}}
// 
// * {{{willAnimate}}}
// 
// * {{{didShow}}}
// 
AC.SwapView = Class.create({

	_view: null,
	currentContent: null,
	delegate: null,

	// ** {{{AC.SwapView.initialize(view)}}}
	// 
	// Initializes a swap view object that will allow swapping content within
	// the specified {{{view}}} element.
	// 
	// {{{view}}}: the element or ID of an element to interact with.
	// This element will have the classname {{{swapView}}} appended.
	initialize: function (view) {
		if (typeof view === "string") {
			this._viewId = view;
		} else {
			this._view = $(view);
			this._resetView();
		}
	},

	// ** {{{AC.SwapView.view()}}}
	// 
	// Returns the receiver's view element or null if there is none available.
	view: function () {
		if (!this._view) {
			this._view = $(this._viewId);
			this._resetView();
		}
		return this._view;
	},

	// Removes child nodes from the view and applies any relevant classNames
	_resetView: function () {
		if (!this._view) {
			return;
		}

		var childNodes = this._view.childNodes,
			aChildNode;
		while (aChildNode = childNodes[0]) {
			this._view.removeChild(aChildNode);
		}
		this._view.addClassName('swapView');
	},

	// ** {{{AC.SwapView.setDelegate(delegate)}}} **
	// 
	// Sets the delegate of the receiver.
	// 
	// {{{delegate}}}: The object to set as the receiver's delegate
	setDelegate: function (delegate) {
		this.delegate = delegate;
	},

	// ** {{{AC.SwapView.setContent(content)}}} **
	// 
	// Initiates showing the specified content in the receiver's view element.
	// 
	//  {{{content}}}: The content to show in the receiver's view element.
	// 
	// 
	// If there is any current content the delegate will receive
	// a {{{willClose}}} message.
	// 
	// If content is specified and there is no delegate, or if content is
	// provided and the delegate reports {{{isContentLoaded}}} as true, then
	// setLoadedContent is immediatley called to actually load the content
	// into the view.
	// 
	// If content is specified but the delegate reports {{{isContentLoaded}}}
	// as false the delegate is sent the {{{loadContent}}} message. It is
	// then up to the delegate to load the content and call
	// {{{setLoadedContent}}}.
	setContent: function (content) {
		if (content === this.currentContent) {
			return;
		}

		if (this.currentContent && typeof(this.delegate.willClose) === 'function') {
			this.delegate.willClose(this, this.currentContent);
		}

		if (content && typeof(this.delegate.isContentLoaded) === 'function') {
			if (!this.delegate.isContentLoaded(this, content)) {
				if (typeof(this.delegate.loadContent) === 'function') {
					this.delegate.loadContent(this, content);
					// Stop if delegate needs to actually load content
					return;
				}
			}
		}
		this.setLoadedContent(content);
	},

	// ** {{{AC.SwapView.setLoadedContent(content)}}} **
	// 
	// Actually shows the specified content in the receiver's view element.
	// 
	//  {{{content}}}: The content to show in the receiver's view element.
	// 
	// If the delegate responds to {{{shouldAnimateContentChange}}} as true,
	// it is usually a good idea to position the content of the swap view
	// absolutley so the animations have free reign to position and animate
	// the content.
	// 
	// willClose is called when initiating a content swap so we can inform
	// a section it's about to close prior to trying to load the remote content
	// which can take a while and make this feel slower than it is.
	// 
	// This does mean that if the new content fails to load we need to handle
	// that pretty well becasue the existing content was already told it was
	// going to close.
	// 
	// TODO:
	// Additionally you will only get the willClose call by going through
	// setContent. This indicates to me that setLoadedContent should never
	// be exposed as part of the public API. I'd suggest prefixing
	// it with an underscore to purvey the "private" nature of this method.
	setLoadedContent: function (content) {

		if (typeof(this.delegate.willShow) === 'function') {
			content = this.delegate.willShow(this, this.currentContent, content);
		}

		var shouldAnimate = true,
			animation;
		if (typeof(this.delegate.shouldAnimateContentChange) === 'function') {
			shouldAnimate = this.delegate.shouldAnimateContentChange(this, this.currentContent, content);
		}

		if (shouldAnimate && typeof(this.delegate.willAnimate) === 'function') {
			//While animating we can assume we'll need both outgoing and
			//incoming content in the view at the same time, so just
			//append the incoming content prior to the animation
			//Note that in this case the content of the swapview should be
			//positioned absolutely so we can layer them on top of each other
			//if you can't accommodate that then respond with a false for
			// shouldAnimateContentChange in your delegate and you'll rely
			// on the immediate swapping
			this.didAnimate = true;
			if (this.view() && content && this.currentContent !== content) {
				this.view().appendChild(content);
			}

			if (typeof(this.delegate.didAppendContent) === 'function') {
				this.delegate.didAppendContent(this, content);
			}

			animation = this.delegate.willAnimate(this, this.currentContent, content, this.didShow.bind(this, content));
		} else {

			this.didAnimate = false;
			//With no animation we don't assume both nodes are ever in the view at the same time
			//so remove the current content before appending the incoming content
			if (this.currentContent !== content) {
				if (this.currentContent && this.currentContent.parentNode) {
					this.currentContent.parentNode.removeChild(this.currentContent);
				}

				if (content) {
					this.view().appendChild(content);
				}

				if (typeof(this.delegate.didAppendContent) === 'function') {
					this.delegate.didAppendContent(this, content);
				}
			}

			if (content) {
				$(content).setOpacity(1.0);
			}

			this.didShow(content);
		}
	},

	// ** {{{AC.SwapView.didShow(content)}}} **
	// 
	// Acknowledges the reciever did show the specified content.
	// 
	// {{{content}}}: The content that has just been shown.
	// 
	// This is done immediately after the content was inserted with no
	// animation or immediately after the animation has finished.
	didShow: function (content) {
		//Pull the existing content out of the DOM, if it hasn't been already
		if (this.currentContent && (this.currentContent !== content) && this.currentContent.parentNode) {
			this.currentContent.parentNode.removeChild(this.currentContent);
		}

		if (typeof(this.delegate.didShow) === 'function') {
			this.delegate.didShow(this, this.currentContent, content);
		}

		this.currentContent = content;
		
		//FeedStatistics  call for tip articles but not for preview pages
		try{
		var store = new Persist.Store('FeedStats');
		var previewId=$(this.currentContent.id).select('div#previewId')[0].innerHTML;
		
		if(enableAppleInstant == "yes" && (previewId==null || previewId=="" || store.get('resultActivity')=='true')){

			 var currTipId=null;
			 var currTipLastModifiedDate=null;
			 var currTipCreationDate=null;;
			 var resultPosition=null;
			 var prevTipId=null;
			 var prevTipLastModifiedDate=null;
			 var prevTipCreationDate=null;

			 if(this.currentContent!=null && this.currentContent.id!=null && ACUtil.trim(this.currentContent.id)!=""){
				 currTipId=this.currentContent.id.substring("MASKED-".length);
				 currTipLastModifiedDate=$(this.currentContent.id).select('div#tipLastModifiedDate')[0].innerHTML;
				 currTipCreationDate=$(this.currentContent.id).select('div#tipCreationDate')[0].innerHTML;
				 resultPosition=store.get('position')!=null?store.get('position'):"";
				 prevTipId=store.get('tipId')!=null?store.get('tipId'):"";
				 prevTipLastModifiedDate=store.get('lastModifiedDate')!=null?store.get('lastModifiedDate'):"";
				 prevTipCreationDate=store.get('creationDate')!=null?store.get('creationDate'):"";
			 }
			 var time = new Date();
			 var currTime=time.getTime();
		 	 if (store.get('timeStart') != null){
					var timeDiff = currTime - store.get('timeStart');//In milliseconds
					var timeSpent = Math.floor(timeDiff/1000);// In seconds
					var feedStats = new ACFeedStatistics();	
					if (timeDiff < 2000){
						feedStats.updateNotRead(prevTipId,resultPosition, timeSpent);
						store.remove('tipId');
						store.remove('timeStart');
						store.remove('position');
						store.remove('lastModifiedDate');
						store.remove('creationDate');
						store.set('resultActivity', false);
					}
					else{//2 or more Seconds for read
						store.set("lastModifiedDate",prevTipLastModifiedDate);
						store.set("creationDate",prevTipCreationDate);
						feedStats.updateRead(prevTipId, resultPosition, timeSpent);
						store.remove('tipId');
						store.remove('timeStart');
						store.remove('position');
						store.remove('lastModifiedDate');
						store.remove('creationDate');
						store.set('resultActivity', false);
					}
					store.set('timeStart', time.getTime());
					store.set('tipId', currTipId);
					store.set("lastModifiedDate",currTipLastModifiedDate);
					store.set("creationDate",currTipCreationDate);
			 }else{
					store.set('timeStart', currTime);
					store.set('tipId', currTipId);
					store.set("lastModifiedDate",currTipLastModifiedDate);
					store.set("creationDate",currTipCreationDate);
			 }	
		}//Outermost feed end if
		}catch(e){
		}
		//START OMNITURE TAGGING
		if(this.currentContent!=null && this.currentContent.id!=null && ACUtil.trim(this.currentContent.id)!=""){
	 		var s = s_gi(s_account);
		 	var locale		= $(this.currentContent.id).select('div#tip-locale-omniture')[0].innerHTML;
		 	var localeCountry = locale.substring(3,5);
		 	var localeLanguage = locale.substring(0,2);
		 	var reversedLocale = localeCountry.toLowerCase()+"-"+localeLanguage.toLowerCase();
		 	var friendlyName  	= $(this.currentContent.id).select('div#tip-tags-omniture-frendlyName')[0].innerHTML;
		 	var tipTitle 	= $(this.currentContent.id).select('div#tip-title-omniture')[0].innerHTML;
		 	var tipId		= this.currentContent.id!=null && this.currentContent.id!="" ? this.currentContent.id.substring("MASKED-".length):"";
		 	var product  	= $(this.currentContent.id).select('div#product-omniture')[0].innerHTML;
		 	s.pageName 		= "acs::web::tips::" + tipId + "::" + product + "::" + friendlyName + "::" + tipTitle + "("+reversedLocale+")";
		 	s.products 		= 	product;	
		 	s.prop1	   		= "acs::web::tips";
		 	s.prop2	   		= $(this.currentContent.id).select('div#tip-tags-omniture')[0].innerHTML;
		    void(s.t());
	    //END OMNITURE TAGGING
		}
	    
	}

});


// == AC.ViewMaster ==
// 
// The ViewMaster listens for triggers being activated on the page to show
// the trigger's content inside a {{{swapView}}}
// 
// Name space for the viewer and section classes.
// 
// This has a few direct properties and methods:
// * The option //AC.ViewMaster.Viewer.allowMultipleVideos = true;// which only makes sense on a page level
//   rather than per instance, more later in the options section.
// * Events stored here and are fired on whenever any instance of a SwapView reaches one of its notification
//   functions. Pretty much just gives you a place to listen for these events.
// 
if (typeof(AC.ViewMaster) === 'undefined') {
	AC.ViewMaster = {};
}

// === AC.ViewMaster.Viewer ===
// 
// We always use this class to initiate a SwapView on the page.
// It keeps track of all of our content sections, our current section, and our instance of AC.SwapView.
// All of your extra options/features happen here.
// 
// === Delegate Methods & Notifications ===
// In chronological order:
// 
// * {{{willShow(sender, outgoingView, incomingView)}}} method and {{{ViewMasterWillShowNotification}}} event
// ** Occurs as soon as SwapView knows the content is going to change.
// ** Informs the SwapView that the content is about to change.
// 
// * {{{willClose(sender, outgoingView, incomingView)}}} method and {{{ViewMasterWillCloseNotification}}} event
// ** willClose is called when initiating a content swap so we can inform a section it's about to close prior to trying to loading the remote content.
// ** willClose is useful because it is relative to a section, instead of relative to the SwapView.  It is used for doing cleanup on outgoing sections. For instance if you have a video, the willClose delegate runs right after the controller is removed and stuff like that.
// 
// * {{{didAppendContent(sender, content)}}} method
// ** Occurs when the the incoming section is injected into the view element.
// 
// * {{{shouldAnimateContentChange(sender, outgoingView, incomingView)}}} method
// ** Returns a boolean whether or not the content should animate. Can be based on which section is incoming, outgoing, or any other information you can access through the sender (which is the SwapView instance that dispatched the event)
// 
// * {{{willAnimate(sender, outgoingView, incomingView, afterFinish, queueScope)}}} method
// ** When this event occurs, both the incoming view and outgoing view are present in the view element. You can animate however you see fit.
// ** Try to use hardware accelerated CSS animations/transitions, then degrade to normal CSS animations/transitions, then degrade to scriptaculous animations.
// ** If you have set a willAnimate delegate, it is your responsibility to determine when the animation is finished, and fire the afterFinish function (which is an argument passed to the delegate method) at that point (and no sooner).
// ** The queueScope can be used for scriptaculous's animation queueing functionality
// 
// * {{{didShow(sender, outgoingView, incomingView)}}} method and {{{ViewMasterDidShowNotification}}} event
// ** Occurs after the animation is complete
// 
// * {{{manageZ(sender, outgoingSection, incomingSection, senderZIndex, outgoingSectionZIndex, incomingSectionZIndex)}}} method
// ** Occurs within both willShow (z-indices will be an integer) and didShow (z-indices will be reset to an empty string), only if this.options.manageZ is set to true or an integer.
// ** Passes the default zIndex values for each of the different elements (view, incoming.content, outgoing.content), for custom use in controlling z-indices on other elements.
// 
AC.ViewMaster.Viewer = Class.create({
	view: null,
	triggerClassName: null,
	currentSection: null,
	requestedSection: null,
	sections: null,
	orderedSections: null,

	_locked: false,
	_didShowInitial: false,

	options: null,

	// ** {{{AC.ViewMaster.Viewer.initialize(contents, view, triggerClassName, options)}}} **
	// 
	// Initializes a new ViewMaster instance.
	// 
	// {{{contents}}}: The elements to make available for swapping in and out
	// of the viewmaster. Can be, and often is, set to null for lazy and remote loading.
	// 
	// {{{view}}}: The view element to use for swapping content into and out of.
	// 
	// {{{triggerClassName}}}: The class name trigger links are expected to have.
	// Each ViewMaster instance on a document needs to have its own unique
	// triggerClassName.
	// 
	// {{{options}}}: optional associative array of configuration options
	// 
	// 
	// TODO the animation stuff should probably be moved out into the swap_view...
	// 
	// === Allowed Options ===
	// * {{{triggerEvent}}} [**click**]: The name of the event to listen for
	//   from valid triggers.
	// ** For example, you could make this 'mouseover', so that the content would change when the user hovers over the triggers.
	// 
	// * {{{initialId}}}: The Id of the initial section to load and show.
	//   Note that this is overridden if an id is specified in the URL hash.
	//   If neither is found, the first section discovered in {{{contents}}}
	//   is shown initially.
	// ** I tend to lean toward using the first section of the content array instead of this method for determining the default section for the swap view. It's much more maintainable to pass in all the triggers for a gallery, then if the order changes the default section changes with them. Otherwise, it's easy to forget to update the value and have it point to a non-existent section.
	// 
	// * {{{silentTriggers}}} [**false**]: Whether or not to suppress
	//   following activated triggers such that their #target does not appear
	//   in the URL.
	// ** When in doubt, set it to true, since we don't usually want to expose non-semantic ids to users — #gallery1 or #image1 are good examples of a non-semantic ids. Exceptions are how to pages that have semantic and pretty ids — #screensaver and #expose are good examples of semantic ids.
	// 
	// * {{{sectionRegExp}}}: The regex to use when trying to identify the
	//   section specified in the trigger's href attribute.
	// ** TODO: Verify this: We use this to manage links that need to change a parent and nested SwapView, or deep linking into a nested SwapView. Basically the regex should return only the id of the section we want to swap to in this particular SwapView instance.
    // ** For example, we can use an href of “#id1-id2” and then a regex /#(.*)-/ to return “id1” and a regex /-(.*)$/ to return “id2”
	// 
	// * {{{ensureInView}}} [**false**]: Whether or not to ensure a section is
	//   made visible in the viewport if it wouldn't normally be within the
	//   viewport after opening.
	// ** We use this a lot for videos and how to sections
	// 
	// * {{{heightFromFirstSection}}} [**false**]: Upon the initial show of the first section,
	//   whether or not to set the height of the view to the height of the first section’s content.
	// ** Deep linking with this option only works as desired — on initialization of the ViewMaster, the height of the view is that of the default section — if there is a default section upon initialization, in other words, there is at least one section that is not lazy loaded — the first argument of the initialization is not //null//.
	// 
	// * {{{shouldAnimateContentChange}}} [**true**]: Whether or not to animate
	//   content transitions. Default transition is opacity (cross fade).
	// 
	// * {{{shouldAnimateOpacityAndHeight}}} [**false**]: Whether or not to grow or
	//   shrink the height between content changes.
	// 
	// * {{{shouldAnimateFadeIn}}} [**false**]: If true, changes default animation to only fade in incoming section,
	//   as opposed to cross-fading the incoming and outgoing sections. This avoids the 'flicker' that appears if two
	//   sections share some image content, such as hardware around a screen.
	// 
	// * {{{animationDuration}}} [**0.4**]: The duration of the default
	//   animation.
	// ** You should use this in your custom animations if you use the willAnimate delegate as well.
	// 
	// * {{{silentFirstSection}}} [**false**]: Whether or not to suppress
	//   triggers of the form href="SwapViewFirstSection" to show the
	//   previous selection.
	// ** A situation where this would be the desired functionality is pretty impractical.
	// 
	// * {{{silentPreviousSelection}}} [**false**]: Whether or not to suppress
	//   triggers of the form href="SwapViewPreviousSelection" to show the
	//   previous selection.
	// ** A situation where this would be the desired functionality is pretty impractical.
	// 
	// * {{{showPreviousOnStopMovie}}} [**false**]: Whether or not to try and
	//   show the previous selection on stopping movie when another movie is
	//   triggered: {{{true}}} shows previous selection, {{{false}}} shows end
	//   state.
	// 
	// * {{{showFirstOnStopMovie}}} [**false**]: Whether or not to try and
	//   show the first section on stopping movie when another movie is
	//   triggered: {{{true}}} shows first section, {{{false}}} shows end
	//   state.
	// 
	// * {{{useKeyboardNav}}} [**false**]: Whether or not to set keyboard
	//   left/right arrows to go to previous/next section when view is
	//   inside of viewport boundaries
	// ** Listens to the keydown event triggered on the document to detect when a key has been pressed. If the key is left, the SwapView shows the previous section (if there is one). If the key is right, the SwapView show the next section (if there is one).
	// ** The SwapView instance HAS to know about the sections before this can work. Even if there is a trigger to a remotely loaded section, it will not be in the stack until the user has clicked on it. See the 'sections contents' note above for ways to get around this.
	// 
	// * {{{alwaysUseKeyboardNav}}} [**false**]: Make the right/left arrow keys always
	//   trigger the showNext/showPrevious functions, even when the swap view is out
	//   of the visible viewport. This does not supersede _lock or discontinuousPreviousNext
	// 
	// * {{{discontinuousPreviousNext}}} [**false**]: Whether or not to stop
	//   from going to last section from the first or first from the last using
	//   previous or next functions
	// ** Pretty much, when this is false, there is always a previous and next section. The previous section from the first section is the last section. The next section from the last section is the first section. It makes the list circular.
	// 
	// * {{{alwaysShowSection}}} [**false**]: This option is a boolean that tells the 'show' function whether or not to show the section,
	//   even if it is already the current section. Normally if the section you are trying to show is the current section, it will just
	//   return false in the show function, and will not try to change the the content.
	// 
	// * {{{imageLinkAutoCaptions}}} [**false**]: Whether or not to create p.caption elements
	//   for imageLink triggers that have a title attribute. {{{false}}} does not try to create
	//   captions, {{{true}}} creates captions if there is a title attribute. Or you can provide
	//   a string, which is the attribute to look for on the trigger for the captions' content.
	//   E.g. <a href="..." caption="I don't want a tooltip on the trigger"> ... would use 'caption'
	//   as the {{{imageLinkAutoCaptions}}} option.
	// 
	// * {{{imageLinkClasses}}} [**false**]: If true, give each image link element a class that is the same
	//   as the ID of that section. **DEPRECATED** Use 'addSectionIdAsClassName'
	// 
	// * {{{addSectionIdAsClassName}}} [**false**]: If true, give each section element a class that is the same
	//   as the ID of that section.
	// 
	// * {{{useHTML5Tags}}} [**false**]: Any time AC.ViewMaster.Viewer creates a new tag, use the HTML5
	//   alternative if there is an appropriate one. (e.g. imageLink should make <figure> and <figcaption>
	//   tags instead of <div> and <p class="caption"> tags)
	// 
	// * {{{manageZ}}} [**false**]: Can be a [**boolean**] or [**integer**] (recommended integer value between 1002 - 1099).
	// Any time SwapView is animating, the AC.ViewMaster.Viewer attempts to bring
	// the view element, outgoing’s section.content and incoming’s section.content
	// to the front of the layer stack. The z-index is only managed if the option
	// is true or an integer. The z-index value is determined by:
	// 1) the respective element’s "data-manage-z" attribute (view, outgoing.content incoming.content),
	// 2) the integer set by this.options.manageZ, or
	// 3) the default value: 1001.
	// 
	initialize: function (contents, view, triggerClassName, options) {
		if (triggerClassName) {
			this.triggerClassName = triggerClassName;
		}
		this.sections = $H();
		this.orderedSections = [];

		this.options = options || {};
		this.silentPreviousSelection(this.options.silentPreviousSelection);
		this.silentFirstSection(this.options.silentFirstSection);

		this.triggerEvent = this.options.triggerEvent || 'click';

		var initialSection = null,
			section, i;
		if (contents) {
			for (i = 0; i < contents.length; i++) {
				//contents could be a NodeList, so we're going to use that API
				//I added an item method to Array in apple_core
				section = this.addSection(contents.item(i));

				if (!initialSection) {
					initialSection = section;
				}
			}
		}
		//Moved down to workaround a bug: in Safari, the results of getElementsByClassName is a NodeList.
		//If we do new AC.SwapView(view) before looping on the NodeList, the NodeList get emptied....
		this.view = new AC.SwapView(view);
		this.view.setDelegate(this);

		var hashInitialId = document.location.hash,
			hashSection, hashSectionIdMatch;

		this.sectionRegExp = this.options.sectionRegExp || new RegExp(/#(.*)$/);

		// TODO the default regex may need some stricter ending, much like the trigger matching
		// Inspect the URL for what appears to be the specified section ID according to the sectionRegExp
		hashSectionIdMatch = hashInitialId.match(this.sectionRegExp);

		if (hashSectionIdMatch && hashSectionIdMatch[1]) {
			// if we find a group that matches the id within the hash, use it as the id
			hashInitialId = hashSectionIdMatch[1];
		}

		if (hashInitialId !== this.view._viewId) {

			// To prevent loading an arbitrary element into the viewmaster
			// check to see if any of the valid triggers on the page at this 
			// time reference that id
			// if no triggerlinks reference this id, we ignore this initial id
			// TODO determine effect on remote sections which may not have
			// triggers linking to them in the page yet
			// Theoretically you can still show a section with no referencing
			// triggers manually, this jsut prevents false positives
			var triggerLinks = document.getElementsByClassName(this.triggerClassName),
				trigger;
			for (i = 0, trigger;
			(trigger = triggerLinks[i]); i++) {
				if (trigger.getAttribute('href').match(new RegExp("#" + hashInitialId + "(?![\_\w\-])"))) {

					hashSection = this.sectionWithId(hashInitialId);

					if (hashSection) {
						initialSection = hashSection;
					}

					break;
				}
			}
		}

		// If no section requested or found from the id in the URL hash,
		// but one was requested via the options parameter, load that one
		if (!hashSection && typeof this.options.initialId === "string" && this.options.initialId.length > 0) {
			initialSection = this.sectionWithId(this.options.initialId);
		}

		//TODO do we want to show the initial section right away? seems like
		// we have to but if no delegates are set yet this will be a bit 
		// different than subsequent calls to show
		this.show(initialSection);

		this._boundTriggerClicked = this._triggerClicked.bindAsEventListener(this);

		// If there is more than one type of trigger event observe all
		// If there's a better way to do this, let me know
		if (typeof this.triggerEvent === 'object') {
			for (var i = 0, evt; evt = this.triggerEvent[i]; i++) {
				Event.observe(document, evt, this._boundTriggerClicked);
			}
		} else {
			Event.observe(document, this.triggerEvent, this._boundTriggerClicked);
		}

		// In IE click event isn't sent when there is no text/image physically under the mouse, but the mouseup is, so we need to listen to that
		// TODO so is this behavior preserved when the event is something other than click?
		if (AC.Detector.isIEStrict()) {
			Event.observe(document, 'mouseup', this._boundTriggerClicked);
		}

		if (this.options.alwaysUseKeyboardNav === true) {
			this.options.useKeyboardNav = true;
		}

		if (this.options.useKeyboardNav === true || this.options.escapeToClose === true) {
			this._boundKeyDown = this._keyDown.bindAsEventListener(this);
			Event.observe(document, 'keydown', this._boundKeyDown);
		}

		//To allow event based section selection
		if (typeof(this.listenForEvent) === 'function') {
			this.selectSectionFromEventHandler = this.selectSectionFromEvent.bind(this);
			this.listenForEvent(AC.ViewMaster, 'ViewMasterSelectSectionWithIdNotification', true, this.selectSectionFromEventHandler);
			this.listenForEvent(AC.ViewMaster, 'ViewMasterWillShowNotification', true, this.stopMovieIfItsPlaying);
			this.listenForEvent(document.event, 'replayMovie', false, this.stopMovieIfItsPlaying.bind(this));

			if (this.options.parentSectionId) {
				this.listenForEvent(AC.ViewMaster, 'ViewMasterWillCloseNotification', false, function (evt) {
					var data = evt.event_data.data;

					if (this === data.sender) {
						return;
					}

					if (data.outgoingView && data.outgoingView.id === this.options.parentSectionId) {
						this.willClose(this.view, this.currentSection);
					}
				});
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer.initialSectionFromId(initialId)}}} **
	// 
	// 
	// TODO I really don't understand why this is a publicly exposed function...
	initialSectionFromId: function (initialId) {
		return this.sectionWithId(initialId);
	},

	// ** {{{AC.ViewMaster.Viewer.sectionWithId}}} **
	// 
	sectionWithId: function (sectionId) {
		if (!sectionId) {
			return null;
		}

		var section = null;
		if (sectionId && this.sections.get(sectionId)) {
			section = this.sections.get(sectionId);
		}

		if (section) {
			return section;
		}

		// TODO clean up the following and verify that it actually does what we would expect
		// right now it's commented to document what it does.
		var candidate, result = null;

		// Try to find a candiate for the requested section id
		candidate = document.getElementById(sectionId);

		// if the candidate is our swap view element, ignore it
		if (candidate === this.view._view) {
			candidate = null;
		}


		// if no candidates in the page, find a trigger targetting a remote section by that id
		if (!candidate) {
			candidate = document.body.down('a.' + this.triggerClassName + '[href*=#' + sectionId + ']');
		}

		// if no candidate was found by ID within the DOM, assume the
		// specified ID is actually a tag name
		// TODO is that really what we want to look for?
		if (!candidate) {
			result = document.getElementsByName(sectionId);

			if (result && result.length > 0) {
				candidate = result[0];
			}

			if (candidate === this.view._view) {
				candidate = null;
			}
		}

		// Regardless of how we found the candidate...
		if (candidate) {

			// if it's a link it needs to be a trigger for this viewmaster...
			if (candidate.tagName.toLowerCase() === "a") {
				if (Element.hasClassName(candidate, this.triggerClassName)) {
					section = this.addSection(candidate)
				}
			}
			// or not a link at all.
			else {
				section = this.addSection(candidate);
			}
		}

		return section;
	},

	// ** {{{AC.ViewMaster.Viewer.indexOfSection(aSection)}}} **
	// 
	// Returns the index of the specified section
	indexOfSection: function (aSection) {
		return this.orderedSections.indexOf(aSection.id);
	},

	// ** {{{AC.ViewMaster.Viewer.selectSectionFromEvent(evt)}}} **
	// 
	// 
	selectSectionFromEvent: function (evt) {
		// Ignore events emitted by this viewmaster instance
		if (evt.event_data.data.sender === this) {
			return;
		}
		// Ignore events where the trigger class name does not match this
		// viewmaster instance's own trigger className
		if (evt.event_data.data.parentTriggerClassName !== this.triggerClassName) {
			return;
		}

		//Now that should be something we need to take care of:
		this.selectSectionWithIdEvent(evt.event_data.data.parentSectionId, evt.event_data.data.event);
	},

	// ** {{{AC.ViewMaster.Viewer.selectSectionWithIdEvent(sectionId, event)}}} **
	// 
	// 
	selectSectionWithIdEvent: function (sectionId, event) {
		var aSection = this.sectionWithId(sectionId),
			triggers = null,
			i, iTrigger, triggerFound = false;

		if (aSection) {
			triggers = aSection.triggers();
			if (triggers && triggers.length > 0) {
				for (i = 0;
				(iTrigger = triggers[i]); i++) {
					if (Element.Methods.hasClassName(iTrigger, this.triggerClassName)) {
						triggerFound = true;
						//I just need to simulate 1:
						break;
					}
				}
			}

			//Let's create one!
			if (!triggerFound) {
				iTrigger = document.createElement("a");
				iTrigger.className = this.triggerClassName;
				iTrigger.href = "#" + sectionId;
				iTrigger.style.display = "none";
				document.body.appendChild(iTrigger);
				//save this trigger for the 2nd click
				aSection._triggers.push(iTrigger);
			}

			//This should trigger _triggerClicked()
			this.triggerClicked(event, $(iTrigger));

		}
	},

	// ** {{{AC.ViewMaster.Viewer.setDelegate(delegate)}}} **
	// 
	// Sets the delegate of the receiver.
	// 
	// {{{delegate}}}: The object to set as the receiver's delegate.
	setDelegate: function (delegate) {
		this.delegate = delegate;

		// If the delegate cares and there is a current section already
		// being shown, inform the delegate immediately so it can handle
		// itself appropriately.
		if (this.delegate && typeof(this.delegate.didShow) === 'function' && this.currentSection && this.currentSection.isContentLoaded()) {
			this.delegate.didShow(this, this.previousSection, this.currentSection);
		}
	},

	createSectionForContent: function (content) {
		return new AC.ViewMaster.Section(content, this);
	},

	// ** {{{AC.ViewMaster.Viewer.addSection(contentNode)}}} **
	// 
	// Adds a section object wrapping the specified {{{contentNode}}} to 
	// the ViewMaster's collection. The newly created section is returned.
	// 
	// {{{contentNode}}}: The element to wrap with the new {{{Section}}}
	// object.
	addSection: function (contentNode) {
		var section = this.createSectionForContent(contentNode);
		//add keyed entry into hash
		this.sections.set(section.id, section);
		//add key into ordered array for prev/next functionality
		this.orderedSections.push(section.id);
		return section;
	},

	// ** {{{AC.ViewMaster.Viewer.silentPreviousSelection(value)}}} **
	// 
	// Sets the silentPreviousSelection option.
	// 
	// {{{value}}} [**boolean**]: The value for which set the silentPreviousSelection flag.
	silentPreviousSelection: function (value) {
		if (typeof(value) == 'boolean') {
			this._silentPreviousSelection = value;
		}
		return this._silentPreviousSelection;
	},

	// ** {{{AC.ViewMaster.Viewer.silentFirstSection(value)}}} **
	// 
	// Sets the silentFirstSection option.
	// 
	// {{{value}}} [**boolean**]: The value for which set the silentFirstSection flag.
	silentFirstSection: function (value) {
		if (typeof(value) == 'boolean') {
			this._silentFirstSection = value;
		}
		return this._silentFirstSection;
	},

	currentTrigger: function () {
		return this._currentTrigger;
	},
	// ** {{{AC.ViewMaster.Viewer.triggerClicked(evt, element)}}} **
	// 
	// TODO should this method be public?
	// TODO should this method expose the fact that it usually handles a 'clicked' trigger
	triggerClicked: function (evt, element) {
		//set the clicked trigger active as soon as possible to reduce apparent lag
		element.addClassName('active');

		this._currentTrigger = element;

		if (evt && this.options.silentTriggers) {
			Event.stop(evt);
		}

		var section = null,
			contentId;

		if ( !! element.href.match(/#previous/)) {
			section = this.getPreviousSection();
			if (!section) return;
		} else if ( !! element.href.match(/#next/)) {
			section = this.getNextSection();
			if (!section) return;
		} else {
			var matches = element.href.match(this.sectionRegExp);
			if (matches) {
				contentId = matches[1];
			} else {
				contentId = element.name;
			}
			section = this.sections.get(contentId);
		}

		//No section means either a lazy initialization of sections
		//or a section for which the content is remote.
		if (!section) {
			section = this.addSection(element);
		}

		if (section.isContentRemote()) {
			if (section.isContentLoaded() && !!element.href.match(/#previous/) && !!element.href.match(/#next/)) {
				section.clearTrigger(element);
			}
			if (evt) {
				Event.stop(evt);
			}
		}

		//stop if the trigger is trying to open the current section
		if (section === this.currentSection) {
			if (evt) {
				Event.stop(evt);
			}

			//We don't have to do anything but we still need to post an event saying it's all good:
			//To trigger event based section selection
			// send event notification
			if (typeof(AC.ViewMaster.dispatchEvent) === 'function') {
				AC.ViewMaster.dispatchEvent('ViewMasterDidShowNotification', {
					sender: this,
					outgoingView: this.previousSection,
					incomingView: this.currentSection,
					trigger: element
				});
			}
			return;
		} else if (!section) {
			return;
		}

		// Give the DOM a moment to update the clicked trigger as active, and then go onto the expensive show method
		// TODO: Running setTimeout on iOS will disconnect the click event from the function call stack, meaning
		// videos cannot play video an additional tap from the user.
		setTimeout(this.show.bind(this, section), 1);
	},

	_triggerClicked: function (evt) {
		// If this section is passive, don't act on any event observed
		if (this.options.passive) {
			return;
		}

		var trigger = evt.element();

		if (AC.Detector.isIEStrict() && evt.type === "mouseup") {
			if (trigger && trigger.nodeName.toUpperCase() === 'A') {
				trigger = trigger.down("." + this.triggerClassName);
			}
		} else {
			while (trigger && trigger.nodeName.toUpperCase() !== 'A' && trigger.nodeName.toUpperCase() !== 'BODY') {
				trigger = trigger.parentNode;
			}
		}

		// if we're a SwapViewPreviousSelection link, show the previous Selection section
		// NOTE: we could have put this in this.triggerClicked, however 
		// reduce regressions and new issues regaurding nested swap views,
		// it's separated out from the trigger.hasClassName(triggerClassName)
		if (this._silentPreviousSelection !== true && this._silentFirstSection !== true && !this._locked) {
			if (trigger && trigger.href && ((previousSelection = trigger.href.toString().match(/SwapViewPreviousSelection$/)) || trigger.href.toString().match(/SwapViewFirstSection$/))) {
				trigger = $(trigger);
				if (trigger.hasClassName(this.triggerClassName) || trigger.descendantOf(this.view.view())) {
					Event.stop(evt);
					if (previousSelection) {
						this.showPreviousSelection();
					} else {
						this.showFirst();
					}
					return;
				}
			}
		}

		// ignore if the element is not a trigger
		if (trigger && trigger.href && Element.Methods.hasClassName(trigger, this.triggerClassName)) {
			// Stop as early as possible if we're in the middle of an animation,
			// and this seems to be as early as possible
			if (this._locked) {
				Event.stop(evt);
				return;
			}

			if (this.options.parentSectionId && (typeof(this.stopListeningForEvent) === 'function') && (typeof(this.listenForEvent) === 'function') && (typeof(AC.ViewMaster.dispatchEvent) === 'function')) {
				var self = this;
				//Stop event now: We need to streamline the stoping of events between _triggerClicked and triggerClicked
				Event.stop(evt);

				//Remove observer so we don't listen to ourself:
				this.stopListeningForEvent(AC.ViewMaster, 'ViewMasterSelectSectionWithIdNotification', true, this.selectSectionFromEventHandler);

				this.listenForEvent(AC.ViewMaster, 'ViewMasterDidShowNotification', false, function (evt) {
					//Complete the selection of my section when I, as a section of another viewMaster, am in place.
					this.stopListeningForEvent(AC.ViewMaster, 'ViewMasterDidShowNotification', false, arguments.callee);
					self.triggerClicked(evt, trigger);

					this.listenForEvent(AC.ViewMaster, 'ViewMasterSelectSectionWithIdNotification', true, this.selectSectionFromEventHandler);
				});

				//To trigger event based section selection
				AC.ViewMaster.dispatchEvent('ViewMasterSelectSectionWithIdNotification', {
					sender: this,
					parentSectionId: this.options.parentSectionId,
					parentTriggerClassName: this.options.parentTriggerClassName,
					event: evt,
					trigger: trigger
				});
			} else {
				this.triggerClicked(evt, trigger);
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer._keyDown(evt)}}} **
	// 
	// If view is in viewport, allow left/right keys to show prev/next slides
	// 
	_keyDown: function (evt) {
		// Only worry about the arrow left or right
		if (
			!this._locked &&
			evt.keyCode !== Event.KEY_ESC &&
			evt.keyCode !== Event.KEY_LEFT &&
			evt.keyCode !== Event.KEY_RIGHT
		) {
			return;
		}

		// don't do anything if we are in an input and might be pressing keys for some other reason
		var target = (evt.target) ? evt.target : evt.srcElement,
			attribute = target.getAttribute('contenteditable'),
			editable = true;
		if (attribute == null) editable = false;
		if (editable && attribute == document.body.getAttribute('contenteditable')) {
			// since IE has a very strange value for this attribute, we're comparing
			// it against the body, which we're assuming will never be editable
			editable = false;
		}
		if (editable && attribute == 'false') editable = false;
		if (target.tagName.toLowerCase() == 'input' || target.tagName.toLowerCase() == 'textarea' || target.tagName.toLowerCase() == 'select' || editable) {
			return;
		}

		// get viewport height
		var scrollOffsets = document.viewport.getScrollOffsets(),
			viewportHeight = document.viewport.getHeight(),
			viewContent = this.view.view(),
			carouselHeight = viewContent.getHeight(),
			position = viewContent.cumulativeOffset()[1];

		if (
			this.options.alwaysUseKeyboardNav === true ||
			(position >= scrollOffsets[1] && Math.round(position + (carouselHeight / 2)) < (scrollOffsets[1] + viewportHeight))
		) {
			if (evt.keyCode === Event.KEY_LEFT && this.options.useKeyboardNav === true) {
				this._currentTrigger = 'arrow_left';
				this.showPrevious();
				var key = 'previous';
			} else if (evt.keyCode === Event.KEY_RIGHT && this.options.useKeyboardNav === true) {
				this._currentTrigger = 'arrow_right';
				this.showNext();
				var key = 'next';
			} else if (evt.keyCode === Event.KEY_ESC && this.options.escapeToClose === true) {
				// If there is a trigger with #SwapViewPreviousSelection or #SwapViewFirstSection
				// as the href, then close this section by doing that action.
				if (this.currentSection.content.down('a[href="#SwapViewFirstSection"]')) {
					// Stop event from propagating
					evt.stop();

					this._currentTrigger = 'esc_key';
					this.showFirst();
				} else if (this.currentSection.content.down('a[href="#SwapViewPreviousSelection"]')) {
					// Stop event from propagating
					evt.stop();

					this._currentTrigger = 'esc_key';
					this.showPreviousSelection();
				}
				var key = 'escape';
			}

			// If we pressed a key that is observed for this options set
			if (typeof key !== undefined) {
				this.view._view.fire('AC.ViewMaster.Viewer:usedKeyboardNav', key);

				if (typeof this.__slideshow === 'object' && typeof this.__slideshow.userInteracted === 'function') {
					this.__slideshow.userInteracted();
				}
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer.isContentLoaded(swapView, content)}}} **
	// 
	// Returns whether or not the specified content has loaded.
	// 
	// TODO why is the swapView a parameter at all?
	// TODO why is this a public method?
	isContentLoaded: function (swapView, content) {
		//content here is a Section instance
		return content.isContentLoaded();
	},

	// ** {{{AC.ViewMaster.Viewer.loadContent(swapView, content)}}} **
	// 
	// Instructs the specified content to load itself.
	// 
	// TODO why is the swapView a parameter at all?
	// TODO why is this a public method?
	loadContent: function (swapView, content) {
		if (content) {
			content.loadContent();
		}
	},

	_showContentDidLoad: false,

	// ** {{{AC.ViewMaster.Viewer.contentDidLoad(section, scriptFragment, context)}}} **
	// 
	// 
	contentDidLoad: function (section, scriptFragment, context) {
		if (scriptFragment && scriptFragment.firstChild) {
			this._showContentDidLoad = true;
		}

		this.view.setLoadedContent(section);
		AC.loadRemoteContent.insertScriptFragment(scriptFragment);

		this.scrollSectionToVisible(section);

		if (this._showContentDidLoad && this.delegate && typeof(this.delegate.didShow) === 'function') {
			this.delegate.didShow(this, this.previousSection, this.currentSection);
		}
		this._showContentDidLoad = false;
	},

	//  ** {{{AC.ViewMaster.Viewer.show(section)}}} **
	// 
	// Show a section
	show: function (section, force) {
		// causes problems with overlays, where show(null) seems to be crucial,
		// so we are now passing in a force argument:
		// if (this._locked || !section) return;
		if (this._locked || (!section && !force)) {
			return;
		}

		if (!this.options.alwaysShowSection && section === this.currentSection) {
			return;
		}

		this._locked = true;

		if (this.delegate && typeof(this.delegate.willShowSection) === 'function') {
			var delegateOverride = this.delegate.willShowSection(this, this.previousSection, section);
			if (delegateOverride instanceof AC.ViewMaster.Section) {
				section = delegateOverride;
			}
		}

		this.previousSection = this.currentSection;
		this.currentSection = section;

		this.disablePreviousNextIfNeeded();
		this.scrollSectionToVisible(section);
		this.view.setContent(section);
		
		//console.log("Sending omniture call");
		if(document.getElementById("preview")!=null && document.getElementById("preview").value!="true")
		{
			var s = s_gi(s_account);
	        var pannelNumber=null;
	        if(section.content.parentElement.parentElement.id=="hero"){
	                pannelNumber="a";
	        }else if(section.content.parentElement.parentElement.id == "hero2"){
	                pannelNumber="b";
	        }
	
	        for(var i=0;i<=section.content.parentElement.childElementCount;i++){
	                var element=section.content.parentElement.children[i].id;
	                if(element==section.content.id){
	                        pannelNumber=pannelNumber+""+(i+1);
	                        break;
	                }
	        }
	
	
	        s.eVar2 = 'acs::kb::swipeable::panel=' + pannelNumber;
	        s.events = 'event2';
	        void(s.t());
		}
        //console.log("Omniture call sent: "+s.eVar2);
	},

	// ** {{{AC.ViewMaster.Viewer.disablePreviousNextIfNeeded()}}} **
	// 
	// 
	disablePreviousNextIfNeeded: function () {
		if (!this.currentSection || typeof this.currentSection === "undefined") {
			return;
		}

		var index = this.indexOfSection(this.currentSection),
			limit = this.orderedSections.length - 1,
			discontinuousPreviousNext = this.options.discontinuousPreviousNext;

		if (!this.previousTriggers) {
			this.previousTriggers = $$('.' + this.triggerClassName + '[href="#previous"]');
		}
		else {
			this.previousTriggers = this.previousTriggers.concat($$('.' + this.triggerClassName + '[href="#previous"]')).uniq();
		}
		
		this.previousTriggers.each(function (t) {
			if (discontinuousPreviousNext === true && index === 0) {
				t.addClassName('disabled');
			} else {
				t.removeClassName('disabled');
			}
		});

		//Fix for IE8
		/*if( ACUtil.isIE < 9 && (this.previousTriggers == null || this.previousTriggers == "")){
			if (discontinuousPreviousNext === true && index === 0) {
				var nav = document.getElementsByClassName('arrow prev hero-gallery');
				var secondPanel = document.getElementsByClassName('arrow prev hero2-gallery');
				if((nav !=null && nav !="") && (nav[0]!=null && nav[0]!="")){
					nav[0].addClassName('disabled');
				}
				
				if((secondPanel !=null && secondPanel !="") && (secondPanel[0] !=null && secondPanel[0] != "")){
					secondPanel.addClassName('disabled');
				}
			}
		}*/
		
		if(ACUtil.isIE < 9){
			 var val = $$('.hero-gallery[href="#MASKED-gallery-hero-one"]')[0];
			 var panel = $$('.hero2-gallery[href="#MASKED-gallery-hero-one"]')[0];
			
			 if(this.triggerClassName == 'hero-gallery'){
				 if(discontinuousPreviousNext === true && index === 0 && val != null){
					 val.addClassName('active');
				 }else{
					 if(val != null && val != ""){
						 val.removeClassName('active');
					 }
				 }
				 
			 }
			 
			 if(this.triggerClassName == 'hero2-gallery'){
				 if(discontinuousPreviousNext === true && index === 0 && panel != null){
					 panel.addClassName('active');
				 }else{
					 if(panel!=null && panel != ""){
						 panel.removeClassName('active');
					 }
				 }
			 }
			 
			 
		}
		 
		if (!this.nextTriggers) {
			this.nextTriggers = $$('.' + this.triggerClassName + '[href="#next"]');
		}
		else {
			this.nextTriggers = this.nextTriggers.concat($$('.' + this.triggerClassName + '[href="#next"]')).uniq();
		}
		this.nextTriggers.each(function (t) {
			if (discontinuousPreviousNext === true && index === limit) {
				t.addClassName('disabled');
			} else {
				t.removeClassName('disabled');
			}
		});
	},

	// ** {{{AC.ViewMaster.Viewer.scrollSectionToVisible(aSection)}}} **
	// 
	// 
	scrollSectionToVisible: function (aSection) {
		if (typeof this.options.ensureInView === "boolean" && this.options.ensureInView) {
			if (this._didShowInitial) {
				if (aSection._isContentLoaded) {
					var yOffset = aSection.content.viewportOffset()[1];
					//if the content is above viewport to pretty far down the page bring it into view
					if (yOffset < 0 || yOffset > (document.viewport.getHeight() * .75)) {
						new Effect.ScrollTo(aSection.content, {
							duration: 0.3
						});
					}
				}

			} else {
				//ensure we're at the top of the page when the page has 
				//'loaded' otherwise a requested anchor is followed and the 
				//page may have started where the element was prior to styling
				$(document.body).scrollTo();
			}

			return true;
		}

		return false;
	},

	// ** {{{AC.ViewMaster.Viewer.__applyOptionHeightFromFirstSection()}}} **
	// 
	// Checks to make sure we should be setting the view height to the first 
	// section’s content height, which is to say:
	// * if the option heightFromFirstSection is set to true
	// 
	// and
	// 
	// * if the height has not already been set -- which is either the first time
	//   this is run or if previously the section didn't have a height for some reason
	__applyOptionHeightFromFirstSection: function () {
		if (this.options.heightFromFirstSection == true && !this._heightSet) {
			var section = this.sectionWithId(this.orderedSections[0]);
			if (section) {
				this.setHeightFromSection(section);
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer.setHeightFromSection(section)}}} **
	// 
	// Sets the height of the view to the height of the given section. Returns that height.
	setHeightFromSection: function (section) {
		var height = section.heightOfContent();
		if (height > 0) {
			this.view.view().style.height = height+'px';
			this._heightSet = true;
		}
		return height;
	},

	// ** {{{AC.ViewMaster.Viewer.__manageZ(shouldResetZIndex)}}} **
	// 
	// If {{{manageZ}}} option is set, swap view will attempt to set bring the
	// {{{view}}} element and both the incoming’s and outgoing’s {{{section.content}}}
	// to the front of the z-index stack while the Viewer is animating. The
	// {{{manageZ}}} method is called from willShow (high z-index) and didShow
	// (reset z-index to empty string). The {{{zIndex}}} is only managed if the
	// option is true or an integer. The {{{zIndex}}} is determined by:
	// # the respective element’s "data-manage-z" attribute (view, outgoing.content incoming.content)
	// # the number set by **{{{this.options.manageZ}}}**
	// # **{{{1001}}}**
	// 
	// {{{shouldResetZIndex}}} [**boolean**]: If {{{true}}}, the {{{zIndex}}} is reset to an empty string.
	// 
	__zIndex: 1001,
	__manageZ: function (shouldResetZIndex) {
		if (this.options.manageZ === true || typeof this.options.manageZ === 'number') {
			var zIndex = '', viewZIndex, previousZIndex, currentZIndex, viewElement;
			if (!shouldResetZIndex) {
				zIndex = (typeof this.options.manageZ === 'number') ? this.options.manageZ : this.__zIndex;
			}

			if ((viewElement = this.view.view())) {
				// grab the data-manage-z attribute from the view and use that as our new zIndex value if it’s an integer
				zIndex = (!shouldResetZIndex && (viewZIndex = parseInt(viewElement.getAttribute('data-manage-z'))) && isNaN(viewZIndex) === false) ? viewZIndex : zIndex;
				viewElement.style.zIndex = zIndex;
			}
			if (this.previousSection && this.previousSection.content) {
				previousZIndex = (!shouldResetZIndex && (previousZIndex = this.previousSection.getZIndexFromContent())) ? previousZIndex : zIndex;
				this.previousSection.content.style.zIndex = previousZIndex;
			}
			if (this.currentSection && this.currentSection.content) {
				currentZIndex = (!shouldResetZIndex && (currentZIndex = this.currentSection.getZIndexFromContent())) ? currentZIndex : zIndex;
				this.currentSection.content.style.zIndex = currentZIndex;
			}

			if (this.delegate && typeof this.delegate.manageZ === 'function') {
				this.delegate.manageZ(this, this.previousSection, this.currentSection, zIndex, previousZIndex, currentZIndex);
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer.showFirst()}}} **
	// 
	// Shows the first section in the receiver's ordered collection.
	showFirst: function () {
		this.show(this.getFirstSection());
	},

	// ** {{{AC.ViewMaster.Viewer.getFirstSection()}}} **
	// 
	// Returns the first section in the receiver's ordered collection
	getFirstSection: function () {
		return this.sections.get(this.orderedSections[0]);
	},

	// ** {{{AC.ViewMaster.Viewer.showNext()}}} **
	// 
	// Shows the receiver's next section.
	showNext: function () {
		this.show(this.getNextSection());
	},

	// ** {{{AC.ViewMaster.Viewer.getNextSection()}}} **
	// 
	// Returns the receiver's next section
	getNextSection: function () {
		var currentIndex = this.indexOfSection(this.currentSection);
		if (this.options.discontinuousPreviousNext === true && currentIndex === this.orderedSections.length - 1) {
			return false;
		} else {
			var nextIndex = (this.orderedSections.length - 1) === currentIndex ? 0 : currentIndex + 1;
			return this.sections.get(this.orderedSections[nextIndex]);
		}
	},

	// ** {{{AC.ViewMaster.Viewer.showPrevious()}}} **
	// 
	// Shows the receiver's previous section.
	showPrevious: function () {
		this.show(this.getPreviousSection());
	},

	// ** {{{AC.ViewMaster.Viewer.getPreviousSection()}}} **
	// 
	// Returns the receiver's previous section.
	getPreviousSection: function () {
		var currentIndex = this.indexOfSection(this.currentSection);
		if (this.options.discontinuousPreviousNext === true && currentIndex === 0) {
			return false;
		} else {
			var previousIndex = 0 === currentIndex ? this.orderedSections.length - 1 : currentIndex - 1;
			return this.sections.get(this.orderedSections[previousIndex]);
		}
	},

	// ** {{{AC.ViewMaster.Viewer.showPreviousSelection()}}} **
	// 
	// Shows the receiver's previously selected (viewed) section.
	showPreviousSelection: function () {
		this.show(this.getPreviousSelection());
	},

	// ** {{{AC.ViewMaster.Viewer.getPreviousSelection()}}} **
	// 
	// Returns the receiver's previously selected (viewed) section.
	getPreviousSelection: function () {
		if (this.previousSection) {
			return this.previousSection;
		}

		var orderedSectionsLength = this.orderedSections.length;
		for (i = 0; i < orderedSectionsLength; i++) {
			if (this.orderedSections[i] != this.currentSection.id) {
				return this.sections.get(this.orderedSections[i]);
			}
		}

		return false;
	},

	// Delegated method from the internal SwapView
	// 
	// Responds to the SwapView notifying its delegate that it will show
	// the specified incoming section.
	willShow: function (view, outgoing, incoming) {
		// swap view only deals with nodes once we give it the node to show 
		// so we need to keep track of which section was requested if we ever
		// need to know about the incoming section and not the incoming node
		if (this.delegate && typeof(this.delegate.willShow) === 'function') {
			this.delegate.willShow(this, this.previousSection, this.currentSection);
		}

		// send event notification
		if (typeof(AC.ViewMaster.dispatchEvent) === 'function') {
			AC.ViewMaster.dispatchEvent('ViewMasterWillShowNotification', {
				sender: this,
				outgoingView: this.previousSection,
				incomingView: this.currentSection
			});
		}

		this.__manageZ(false);
		this._repaintTriggers(this.previousSection, this.currentSection);

		if (this._didShowInitial && incoming && incoming != this.previousSection) {
			$(incoming.content).setOpacity(0.0);
			$(incoming.content).removeClassName('hidden')
		}

		if (incoming) {
			return incoming.willShow(this);
		}
		return null;
	},

	// Delegated method from the internal SwapView
	// 
	// Responds to the SwapView notifying its delegate that it is about to close
	// the specified outgoing section.
	// 
	// TODO should the delegate method and notification provide different information?
	willClose: function (view, outgoing) {

		if (this.delegate && typeof(this.delegate.willClose) === 'function') {
			this.delegate.willClose(this, this.previousSection, this.currentSection);
		}
		// send event notification
		if (typeof(AC.ViewMaster.dispatchEvent) === 'function') {
			AC.ViewMaster.dispatchEvent('ViewMasterWillCloseNotification', {
				sender: this,
				outgoingView: outgoing
			});
		}
		if (this.previousSection) {
			this.previousSection.willClose(this);
		}
	},

	// Whether or not the content should be animated
	shouldAnimateContentChange: function (swapView, swapViewCurrentContent, swapViewNextContent) {
		var result = true;
		if (this.delegate && typeof(this.delegate.shouldAnimateContentChange) === 'function') {
			result = this.delegate.shouldAnimateContentChange(this, this.previousSection, this.currentSection);
		} else {
			result = (typeof this.options.shouldAnimateContentChange === "boolean") ? this.options.shouldAnimateContentChange : true;
		}
		// TODO why does this return true for anything that is not a boolean??
		return (typeof result === "boolean") ? result : true;
	},

	willAnimate: function (view, outgoing, incoming, afterFinish) {
		var duration = this.options.animationDuration || 0.4;
		var queueScope = Math.random() + 'Queue'; //TODO probalby need a unique id for this component we use for queue names
		//if the user hasn't interacted with this yet, run afterFinish without animating
		if (!this._didShowInitial && typeof(afterFinish) == 'function') {
			afterFinish();
			return;
		}

		if (this.delegate && typeof this.delegate.willAnimate == 'function') {
			return this.delegate.willAnimate(this, outgoing, incoming, afterFinish, queueScope, duration);
		}

		if (this.options.shouldAnimateOpacityAndHeight) {
			return this._animationPlusHeight(view, outgoing, incoming, afterFinish, queueScope, duration);
		} else {
			return this._animation(view, outgoing, incoming, afterFinish, queueScope, duration);
		}
	},

	// ** {{{AC.ViewMaster.Viewer._animation()}}} **
	// 
	// Returns the default animation: cross fade
	// Default animation can be changed to a simple fade-in of the incoming section by using the {{{shouldAnimateFadeIn}}} option.
	// 
	_animation: function (view, outgoing, incoming, afterFinish, queueScope, duration) {
		var viewContent = view.view(),
		    self = this;

		if (viewContent) viewContent.style.position = 'relative';
		if (outgoing) outgoing.style.position = 'absolute';
		if (incoming) incoming.style.position = 'absolute';

		var after = function () {
			if (viewContent) viewContent.style.position = '';
			if (outgoing) outgoing.style.position = '';
			if (incoming) incoming.style.position = '';
			afterFinish();
		}

		if (AC.Detector.isCSSAvailable('transition')) {
			// cross fade
			if (incoming) {
				incoming.setOpacity(0.0);
				incoming.setVendorPrefixStyle('transition', 'opacity ' + duration + 's');
			}
			if (outgoing && self.options.shouldAnimateFadeIn !== true) {
				outgoing.setOpacity(1.0);
				outgoing.setVendorPrefixStyle('transition', 'opacity ' + duration + 's');
			}

			window.setTimeout(function () {
				if (incoming) {
					incoming.setOpacity(1.0);
				}
				if (outgoing && self.options.shouldAnimateFadeIn !== true) {
					outgoing.setOpacity(0.0);
				}
			}, 100);

			// afterFinish
			var ended = function (evt) {
				if (evt.target == incoming && evt.propertyName == 'opacity') {
					incoming.removeVendorEventListener('transitionEnd', ended, false);
					after();
				}
			}
			if (incoming) { incoming.addVendorEventListener('transitionEnd', ended, false); }

			// otherwise use JS effects
		} else {
			if (outgoing && self.options.shouldAnimateFadeIn !== true) {
				return new Effect.Parallel([
				new Effect.Opacity(outgoing, {
					sync: true,
					from: 1.0,
					to: 0.0
				}), new Effect.Opacity(incoming, {
					sync: true,
					from: 0.0,
					to: 1.0
				})], {
					duration: duration,
					afterFinish: after,
					queue: {
						scope: queueScope
					}
				});
			} else {
				return new Effect.Opacity(incoming, {
					from: 0.0,
					to: 1.0,
					duration: duration,
					afterFinish: after,
					queue: {
						scope: queueScope
					}
				});
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer._animationPlusHeight()}}} **
	// 
	// Returns an animation that changes both height and opacity to fit the incoming content
	_animationPlusHeight: function (view, outgoing, incoming, afterFinish, queueScope, duration) {
		var viewContent = view.view(),
			newHeight = incoming.offsetHeight || 1,
			currentHeight = viewContent.offsetHeight || 1,
			percent = (newHeight / currentHeight) * 100;

		if (viewContent) viewContent.style.position = 'relative';
		if (outgoing) outgoing.style.position = 'absolute';
		if (incoming) incoming.style.position = 'absolute';

		var after = function () {
			if (viewContent) viewContent.style.position = '';
			if (outgoing) outgoing.style.position = '';
			if (incoming) incoming.style.position = '';
			afterFinish();
		}

		// use CSS transitions if possible
		if (AC.Detector.isCSSAvailable('transition')) {
			// cross fade
			incoming.setOpacity(0.0);
			incoming.setVendorPrefixStyle('transition', 'opacity ' + duration + 's');
			if (outgoing) outgoing.setOpacity(0.0);
			window.setTimeout(function () {
				incoming.setOpacity(1.0);
			}, 100);

			// height
			if (!(AC.Detector.isiPad() || AC.Detector.isMobile())) {
				viewContent.setVendorPrefixStyle('transition', 'height ' + duration + 's');
			}
			viewContent.style.height = newHeight + 'px';

			// afterFinish
			var ended = function (evt) {
				if (evt.target == incoming && evt.propertyName == 'opacity') {
					incoming.removeVendorEventListener('transitionEnd', ended, false);
					after();
				}
			}
			incoming.addVendorEventListener('transitionEnd', ended, false);

			// otherwise use JS effects
		} else {
			if (outgoing) {
				return new Effect.Parallel([
				new Effect.Opacity(outgoing, {
					sync: true,
					from: 1.0,
					to: 0.0
				}), new Effect.Opacity(incoming, {
					sync: true,
					from: 0.0,
					to: 1.0
				}), new Effect.Scale(viewContent, percent, {
					scaleMode: {
						originalHeight: currentHeight,
						originalWidth: viewContent.offsetWidth
					},
					sync: true,
					scaleX: false,
					scaleContent: false
				})], {
					duration: duration,
					afterFinish: after,
					queue: {
						scope: queueScope
					}
				});
			} else {
				return new Effect.Parallel([
				new Effect.Opacity(incoming, {
					sync: true,
					from: 0.0,
					to: 1.0
				}), new Effect.Scale(viewContent, percent, {
					scaleMode: {
						originalHeight: currentHeight,
						originalWidth: viewContent.offsetWidth
					},
					sync: true,
					scaleX: false,
					scaleContent: false
				})], {
					duration: duration,
					afterFinish: after,
					queue: {
						scope: queueScope
					}
				});
			}
		}
	},

	// Acknowledges content appended in the view, and informs delegate
	// if the delegate is interested
	// TODO not expose publicly
	didAppendContent: function (view, content) {
		if (this.delegate && typeof this.delegate.didAppendContent === "function") {
			this.delegate.didAppendContent(this, content);
		}

		this.__applyOptionHeightFromFirstSection();
	},

	// ** {{{AC.ViewMaster.Viewer.hideSwapViewLinks(content)}}} **
	// 
	// If {{{this.previousSection.id}}} doesn't exist, updates all links of the
	// format {{{href="#SwapViewPreviousSelection"}}} to be {{{display:none;}}}.
	// If {{{this.firstSection.id}}} doesn't exist, updates all links of the
	// format {{{href="#SwapViewFirstSection"}}} to be {{{display:none;}}}.
	hideSwapViewLinks: function (content) {
		// hiding SwapViewPreviousSelection links
		var section = this.getPreviousSelection();

		if (!section || this._silentPreviousSelection === true) {
			var links = content.select('a[href$="SwapViewPreviousSelection"]');
			if (links.length > 0) {
				if (!this._previousSectionLinks) this._previousSectionLinks = [];
				for (var i = links.length - 1; i >= 0; i--) {
					links[i].style.display = 'none';
					this._previousSectionLinks.push(links[i]);
				}
			}
		}

		if (section && this._silentPreviousSelection !== true && this._previousSectionLinks && this._previousSectionLinks.length > 0) {
			for (var i = this._previousSectionLinks.length - 1; i >= 0; i--) {
				this._previousSectionLinks[i].style.display = '';
				this._previousSectionLinks.splice(i, 1);
			}
		}

		// hiding SwapViewFirstSection links
		var section = this.getFirstSection();

		if (!section || section == this.currentSection || this._silentFirstSection === true) {
			var links = content.select('a[href$="SwapViewFirstSection"]');
			if (links.length > 0) {
				if (!this._firstSectionLinks) this._firstSectionLinks = [];
				for (var i = links.length - 1; i >= 0; i--) {
					links[i].style.display = 'none';
					this._firstSectionLinks.push(links[i]);
				}
			}
		}

		if (section && section !== this.currentSection && this._silentFirstSection !== true && this._firstSectionLinks && this._firstSectionLinks.length > 0) {
			for (var i = this._firstSectionLinks.length - 1; i >= 0; i--) {
				this._firstSectionLinks[i].style.display = '';
				this._firstSectionLinks.splice(i, 1);
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer.stopMovieIfItsPlaying()}}} **
	// 
	// Prevent 2 movies from playing on the same page in 2 different swap views.
	// Also prevents QT objects from being behind overlays (which crashes the plugin).
	stopMovieIfItsPlaying: function (evt) {
		// note IE7 was crashing on the next line, so I'm referencing directly
		if (AC.ViewMaster.Viewer.allowMultipleVideos() !== true) {
			if (evt.event_data.data.incomingView) {
				var view = evt.event_data.data.sender,
					incoming = evt.event_data.data.incomingView,
					replay = false;
			} else {
				var view = this,
					incoming = evt.event_data.data,
					replay = true;
			}
			if (view != this || replay) {
				// if we have a current section with a movie, and the incoming section has or will have a movie:
				if ((this.currentSection && this.currentSection.hasMovie()) && (incoming && ((typeof(incoming.hasMovie) == 'function' && incoming.hasMovie()) || (incoming.content && incoming.content.getElementsByClassName('movieLink')[0])))) {
					if (this.options.showPreviousOnStopMovie && this.getPreviousSelection()) {
						this.showPreviousSelection();
					} else if (this.options.showFirstOnStopMovie && this.getFirstSection()) {
						this.showFirst();
					} else {
						this.currentSection.stopMovie();
					}
				}
			}
		}
	},

	// ** {{{AC.ViewMaster.Viewer.didShow()}}} **
	// 
	// Delegated method from the internal SwapView
	// 
	// Responds to the SwapView notifying its delegate that it did show
	// the specified incoming section.
	didShow: function (view, outgoing, incoming) {
		if (incoming) {
			this.hideSwapViewLinks(incoming);
		}
		this.__manageZ(true);

		if (this.currentSection) {
			this.currentSection.didShow(this);
		}

		this._didShowInitial = true;
		this._locked = false;

		if (this.options.shouldAnimateOpacityAndHeight) {
			window.setTimeout(function () {
				var viewContent = view.view(),
				    currentHeight = incoming.offsetHeight || 0;
				viewContent.style.height = currentHeight + 'px';
			}, 35);
		}

		// want to only alert our delegate that we're done after unlocked
		if (!this._showContentDidLoad && this.delegate && typeof(this.delegate.didShow) == 'function') {
			this.delegate.didShow(this, this.previousSection, this.currentSection);
		}

		// send event notification
		if (typeof(AC.ViewMaster.dispatchEvent) == 'function') {
			AC.ViewMaster.dispatchEvent('ViewMasterDidShowNotification', {
				sender: this,
				outgoingView: this.previousSection,
				incomingView: this.currentSection,
				trigger: this._currentTrigger
			});
		}
	},

	// Resets the class names for all the triggers associtated with both
	// the incoming and outgoing sections so that they are waht they should
	// be given the status of their associated section.
	_repaintTriggers: function (outgoingSection, incomingSection) {
		if (outgoingSection) {
			var outgoingTriggers = outgoingSection.triggers();
			for (var i = 0, iTrigger;
			(iTrigger = outgoingTriggers[i]); i++) {
				iTrigger.removeClassName('active');
			}

			outgoingTriggers = outgoingSection.relatedElements();
			for (var i = 0, iTrigger;
			(iTrigger = outgoingTriggers[i]); i++) {
				iTrigger.removeClassName('active');
			}
		}

		if (incomingSection) {
			var incomingTriggers = incomingSection.triggers();
			for (var i = 0, iTrigger;
			(iTrigger = incomingTriggers[i]); i++) {
				iTrigger.addClassName('active');
			}

			incomingTriggers = incomingSection.relatedElements();
			for (var i = 0, iTrigger;
			(iTrigger = incomingTriggers[i]); i++) {
				iTrigger.addClassName('active');
			}
		}
	}
});

// ** {{{AC.ViewMaster.Viewer.allowMultipleVideos(value)}}} **
// 
// Sets the allowMultipleVideos option.
// 
// {{{value}}} [**boolean**]: The value for which set the allowMultipleVideos flag.
AC.ViewMaster.Viewer.allowMultipleVideos = function (value) {
	if (typeof(value) == 'boolean') {
		this._allowMultipleVideos = value;
	}
	return this._allowMultipleVideos;
};


if (Event.Publisher) {
	Object.extend(AC.ViewMaster, Event.Publisher);
}

if (Event.Listener) {
	Object.extend(AC.ViewMaster.Viewer.prototype, Event.Listener);
}

//  == AC.ViewMaster.Section ==
// Class that wraps DOM content to swap into and out of a ViewMaster
AC.ViewMaster.Section = Class.create({
	content: null,

	moviePanel: null,
	controllerPanel: null,
	movie: null,
	_movieController: null,
	movieLink: null,
	endState: null,

	hasShown: false,
	_isContentRemote: false,
	isContentRemote: function () {
		return this._isContentRemote;
	},
	_isContentLoaded: true,
	isContentLoaded: function () {
		return this._isContentLoaded;
	},

	_onMoviePlayable: Prototype.EmptyFunction,
	_onMovieFinished: Prototype.EmptyFunction,

	id: null,

	triggers: function () {
		if (!this._triggers) {
			this._triggers = [];

			var sectionRegExp = new RegExp('#' + this.id + '$');
			if (this.viewMaster.sectionRegExp || this.viewMaster.options.sectionRegExp) {
				sectionRegExp = this.viewMaster.sectionRegExp || this.viewMaster.options.sectionRegExp;
				sectionRegExp = sectionRegExp.toString().replace(/^\//, '').replace(/\/$/, '');
				sectionRegExp = new RegExp(sectionRegExp.replace('(.*)', this.id));
			}

			var triggers = document.getElementsByClassName(this.viewMaster.triggerClassName);
			for (var i = 0, iTrigger;
			(iTrigger = $(triggers[i])); i++) {
				if (iTrigger.tagName.toLowerCase() !== "a") continue;
				if (iTrigger.href.match(sectionRegExp)) {
					this._triggers.push(iTrigger);
				}
			}

			// in the special (rare) case that we have a trigger to itself
			// within this section's content, make sure that those are
			// included in this triggers array
			var embeddedTriggers = this.content.getElementsByClassName(this.viewMaster.triggerClassName);
			for (var i = 0, iTrigger;
			(iTrigger = $(embeddedTriggers[i])); i++) {
				if (iTrigger.tagName.toLowerCase() !== "a") continue;
				if (iTrigger.href.match(sectionRegExp)) {
					this._triggers.push(iTrigger);
				}
			}
		}
		return this._triggers;
	},

	relatedElements: function () {
		if (!this._relatedElements) {
			this._relatedElements = document.getElementsByClassName(this.id);
			//this._dependentElements = [];
			//var triggers = document.getElementsByClassName(this.id);
			//for(var i=0, iTrigger;(iTrigger = $(triggers[i]));i++) {
			//	this._dependentElements.push(iTrigger);
			//}
		}
		return this._relatedElements;
	},

	initialize: function (content, viewMaster) {

		this.content = $(content);

		//Special casing for remote content / lazy initialization
		if (this.content.tagName.toLowerCase() === "a") {
			var href = this.content.getAttribute("href");
			var parts = href.split("#");
			this._contentURL = parts[0];
			var windowLocationParts = window.location.href.split("#");
			var contentClassName = content.className;
			var baseTag = document.getElementsByTagName("base")[0];
			var baseHref = baseTag ? baseTag.href : null;

			if (parts.length === 2) {
				this.id = parts[1];
			}

			if (this._contentURL.length > 0 && (!baseHref || this._contentURL != baseHref) && (this._contentURL !== windowLocationParts[0]) && (!this._contentURL.startsWith("#") || this._contentURL !== href)) {
				//We should assess wether the link is an external html, an image or a movie.
				//For now I'm going to assume an external HTML, but we'll have to revisit that.
				this._isContentRemote = true;
				this._isContentLoaded = false;
			}
			//This is an inner document reference:
			else {
				var loadedContent = $(this.id) || $('MASKED-' + this.id);
				if (loadedContent) this.content = loadedContent;
			}


			if (!this.id) this.id = this.content.name;


		}
		else {
			this.id = content.id;
		}
		//disguise the contentAnchor so trigger links don't jump to it
		//of course trigger links need to know their target is now prefixed 
		//with "MASKED-"
		if (!this._isContentRemote || this._isContentLoaded) {
			this.content.setAttribute('id', 'MASKED-' + this.id);
		}

		//set up the viewMaster
		if (viewMaster) this.viewMaster = viewMaster;

		//use found node if it has content class
		if (!this._isContentRemote && this._isContentLoaded && !this.content.hasClassName('content')) {
			//otherwise search the node for the first child flagged as content
			var contentChild = this.content.getElementsByClassName('content')[0];
			if (contentChild) this.content = contentChild;
		}

		this.isMobile = AC.Detector.isMobile();
	},

	clearTrigger: function (trigger) {
		if (trigger.href === ("#" + this.id)) return;

		trigger.href = "#" + this.id;

		//Set the content to be the remote one
		//Remove the id/name that was on the link:
		trigger.removeAttribute("id");
		trigger.removeAttribute("name");

		// update the url if we don't have silentTriggers turned on,
		// but only now, after the id has been removed from the trigger
		// so the browser doesn't jump around
		if (!this.viewMaster.options.silentTriggers) {
			document.location.hash = this.id;
		}
	},

	remoteContentDidLoad: function (remoteContentNode, scriptFragment) {
		//update the href to be #id
		this.clearTrigger(this.content);

		this.content = $(remoteContentNode);

		//this.content.id = this.id;
		this.content.setAttribute('id', 'MASKED-' + this.id);
		this._isContentLoaded = true;
		this.viewMaster.contentDidLoad(this, scriptFragment);
	},

	loadContent: function () {
		if (this._isContentLoaded) {
			var self = this;
			self.viewMaster.contentDidLoad(self, null);
		} else if (this.content.className.indexOf("imageLink") !== -1) {

			var aDiv = this.viewMaster.options.useHTML5Tags ? document.createElement('figure') : document.createElement('div');
			if (this.viewMaster.options.imageLinkClasses) {
				try { console.warn('"imageLinkClasses" is deprecated. Use "addSectionIdAsClassName" instead.'); } catch (e) {}
				Element.addClassName(aDiv, this.id);
			}
			aDiv.appendChild(this.content.cloneNode(true));

			if ( !! this.viewMaster.options.imageLinkAutoCaptions) {
				// The caption creation is a little strange to fix for IE + HTML5
				var attr = typeof this.viewMaster.options.imageLinkAutoCaptions == "string" ? this.viewMaster.options.imageLinkAutoCaptions : 'title';
				if(this.content.hasAttribute(attr)) {
					if(this.viewMaster.options.useHTML5Tags){
						var caption = document.createElement('figcaption');
					} else {
						var caption = document.createElement('p');
						Element.addClassName(caption, 'caption');
					}
					caption.innerHTML = this.content.getAttribute(attr);
					Element.insert(aDiv, caption);
				}
			}
			this.remoteContentDidLoad(aDiv);
		} else if ((this.content.className.indexOf("movieLink") !== -1) || (this.content.className.indexOf("audioLink") !== -1)) {
			var aDiv = this.viewMaster.options.useHTML5Tags ? document.createElement('figure') : document.createElement('div');
			aDiv.appendChild(this.content.cloneNode(true));
			this.remoteContentDidLoad(aDiv);
		} else {
			AC.loadRemoteContent(this._contentURL, true, true, this.remoteContentDidLoad.bind(this), null, this);
		}
	},

	shouldImportScriptForContentURL: function (iScript, contentURL, context) {
		var iScriptHasSrc = false;
		if (iScript.hasAttribute) {
			iScriptHasSrc = iScript.hasAttribute('src');
		} else {
			src = iScript.getAttribute('src');
			iScriptHasSrc = ((src != null) && (src !== ''));
		}

		if (!iScriptHasSrc) {
			scriptText = iScript.text;

			// We want to filter out inline scripts that do like
			// window.location.replace('/itunes/tutorials/index.html#tips-rightclick');
			// which is used for external page fragments to re-direct to their host page.
			if (scriptText.search(/.*\.location\.replace\(.*\).*/) !== -1) {
				return false;
			}
			return true;
		} else {
			return true;
		}
	},

	mediaType: function () {
		return this.movieLink ? "video/quicktime" : "text/html"
	},

	// ** {{{AC.ViewMaster.Section.willClose(viewer)}}} **
	// 
	willClose: function (viewer) {
		this._closeController();
		this._closeMovie();
	},

	// ** {{{AC.ViewMaster.Section.willShow()}}} **
	// 
	willShow: function () {
		if (!this.hasShown) {
			this.hasShown = true;

			// TODO: move this to applyOption "addSectionIdAsClassName" per <rdar://problem/9998420>
			if (this.viewMaster.options.addSectionIdAsClassName === true) {
				this.content.addClassName(this.id);
			}

			var images = this.content.getElementsByClassName('imageLink');
			for (var i = 0; i < images.length; i++) {
				this._loadImage(images[i]);
			}

			if (!this.moviePanel) {
				this.movieLink = this.content.getElementsByClassName('movieLink')[0];
				if (this.movieLink) {
					this.posterLink = this.__getPoster(this.content, this.movieLink);
					this._loadMovie();
				}
			}
		}

		return this.content;
	},

	// ** {{{AC.ViewMaster.Section.__getPosterLink(content, movieLink)}}} **
	// 
	// Returns a string URL from the contents provided regardless of how it was implemented.
	// 
	// {{{content}}}: this.content
	// {{{movieLink}}}: this.movieLink
	// 
	// There are currently 2 ways to define a movie poster one is with class="posterLink"
	// and the other is to add attribute "data-poster" on the element with class="movieLink"
	// 
	__getPoster: function (content, movieLink) {
		var poster;
		if (movieLink && movieLink.hasAttribute('data-poster')) {
			poster = movieLink.readAttribute('data-poster');
		} else {
			var poster = content.getElementsByClassName('posterLink')[0];
			if (poster) {
				poster = poster.href;
			}
		}
		return poster;
	},

	// ** {{{AC.ViewMaster.Section.heightOfContent()}}} **
	// 
	// Returns the height of the content element, if the content element is loaded.
	// If it’s not in the DOM at the moment, let's try and put it there to figure it out.
	// 
	_heightOfContent: 0,
	heightOfContent: function () {
		if (this._heightOfContent === 0 && !(this._isContentRemote && !this._isContentLoaded)) {
			if (!this.content.parentNode) {
				this.content.style.visibility = 'hidden';
				this.viewMaster.view.view().appendChild(this.content);
				this._heightOfContent = this.content.getOuterDimensions().height;
				this.viewMaster.view.view().removeChild(this.content);
				this.content.style.visibility = '';
			} else {
				this._heightOfContent = this.content.getOuterDimensions().height;
			}
		}
		return this._heightOfContent;
	},

	// ** {{{AC.ViewMaster.Section.getZIndexFromContent()}}} **
	// 
	// Returns the 'data-manage-z' attribute vaule as an integer, for use as z-index.
	// If it doesn’t have the attribute, or it’s not a integer, returns null.
	// 
	getZIndexFromContent: function () {
		return (this.content) ? (parseInt(this.content.getAttribute('data-manage-z')) || null) : null;
	},

	// ** {{{AC.ViewMaster.Section.didShow(viewer)}}} **
	// 
	didShow: function (viewer) {
		var needsController = this.hasMovie() && !this.isMobile,
			isACMedia = this.isACMediaAvailable();

		if (isACMedia) {
			if (needsController) {
				this._movieControls = this.newMovieController();
				this._playMovie();
				if (this._movieController) {
					this._movieController.setControlPanel(this._movieControls);
					this.onMovieFinished = this.didFinishMovie.bind(this);
					this._movieController.setDelegate(this);
				} else {
					this.controllerPanel.innerHTML = '';
				}
			} else {
				this._playMovie();
			}
		} else {
			if (needsController) {
				this._movieController = this.newMovieController();
				this.controllerPanel.innerHTML = '';
				this.controllerPanel.appendChild(this._movieController.render());
			}

			this._playMovie();

			if (needsController) {
				this._onMoviePlayable = this._movieController.monitorMovie.bind(this._movieController);
				this._onMovieFinished = this.didFinishMovie.bind(this);

				this._movieController.attachToMovie(this.movie, {
					onMoviePlayable: this._onMoviePlayable,
					onMovieFinished: this._onMovieFinished
				});
			}
		}
	},

	defaultMovieWidth: function () { return 848; },
	defaultMovieHeight: function () { return 480; },
	defaultOptions: function () {
		return {
			width: this.defaultMovieWidth(),
			height: this.defaultMovieHeight(),
			controller: false,
			posterFrame: null,
			showlogo: false,
			autostart: true,
			cache: true,
			bgcolor: 'white',
			aggressiveCleanup: false
		}
	},
	_forceACQuicktime: false,
	isACMediaAvailable: function () { return (typeof(Media) != "undefined" && this._forceACQuicktime === false); },
	setShouldForceACQuicktime: function (force) { this._forceACQuicktime = force; },
	movieControls: function () { return this._movieControls; },
	newMovieController: function () {
		if (this.isACMediaAvailable()) {
			return this._movieControls || new Media.ControlsWidget(this.controllerPanel);
		} else {
			return new AC.QuicktimeController();
		}
	},

	// ** {{{AC.ViewMaster.Section._loadImage(imageLink)}}} **
	// 
	_loadImage: function (imageLink) {
		var image = document.createElement('img');

		// IE turns an <a> tag's relative URL starting with a / into an about:..., so assuming we'll never use about:/ ...
		if (imageLink.protocol === "about:") {
			imageLink.href = '/' + imageLink.pathname; // IE7
			imageLink.href = imageLink.href.replace(/^\/blank/, ''); // IE6
		}

		image.setAttribute('src', imageLink.href);

		if (!this.viewMaster.options.imageLinkAutoCaptions) {
			image.setAttribute('alt', imageLink.title);
		} else {
			image.setAttribute('alt', '');
		}

		imageLink.parentNode.replaceChild(image, imageLink);
	},

	// ** {{{AC.ViewMaster.Section._loadMovie()}}} **
	// 
	_loadMovie: function () {
		var isACMedia = this.isACMediaAvailable();

		this.moviePanel = $(document.createElement('div'));
		this.moviePanel.addClassName("moviePanel");

		this.movieLink.parentNode.replaceChild(this.moviePanel, this.movieLink);

		this.controllerPanel = $(document.createElement('div'));
		//if(!isACMedia) {
		this.controllerPanel.addClassName('controllerPanel');
		//}
		if (isACMedia === false) {} else {
			this.moviePanel.appendChild(this.controllerPanel);
		}

		if (isACMedia === false) {
			this.moviePanel.parentNode.insertBefore(this.controllerPanel, this.moviePanel.nextSibling);
		} else {
			this.moviePanel.appendChild(this.controllerPanel);
		}

		this.endState = $(this.content.getElementsByClassName('endState')[0]);
		if (this.endState) {
			this.endState.parentNode.removeChild(this.endState);

			var replay = $(this.endState.getElementsByClassName('replay')[0])
			if (replay) replay.observe('click', function (evt) {
				Event.stop(evt);
				this.replayMovie();
			}.bindAsEventListener(this))

		}
	},

	// ** {{{AC.ViewMaster.Section._playMovie()}}} **
	// 
	//isReplaying is a boolean to confirm whether the call is for a replay. ac_media needs this. 
	_playMovie: function (isReplaying) {

		if (this.movieLink && this.moviePanel) {
			var isACMedia = this.isACMediaAvailable();

			if (!isACMedia) {
				this.moviePanel.innerHTML = '';
			} else {
				if (this.movie && this.movie.parentNode == this.moviePanel) {
					this.moviePanel.removeChild(this.movie);
					this.controllerPanel.hide();
				}

				if (this.endState && this.endState.parentNode == this.moviePanel) {
					this.moviePanel.removeChild(this.endState);
				}

				if (this.controllerPanel && Element.hasClassName(this.controllerPanel, 'inactive')) {
					this.controllerPanel.show();
					Element.removeClassName(this.controllerPanel, 'inactive');
				}
			}

			if (this.posterLink && this.posterLink.length > 0) {
				var posterFrame = this.posterLink;
			}

			// pass through the query string parameters to the QuickTime object
			var movieParams = this.movieLink.getAttribute('href', 2).toQueryParams(),
				defaultOptions = this.defaultOptions(),
				options;
			if (isReplaying == true) movieParams["replay"] = true;
			defaultOptions.posterFrame = posterFrame;
			options = Object.extend(defaultOptions, movieParams);
			for(opt in options){ options[opt] = (options[opt] === 'true') ? true : (options[opt] === 'false') ? false : options[opt]; }

			//need some unique id for these guys
			if (isACMedia === true) {
				this._movieController = Media.create(this.moviePanel, this.movieLink.getAttribute('href', 2), options);

				if (this._movieController) this.movie = this._movieController.video().object();
			} else {
				this.movie = AC.Quicktime.packageMovie(this.movieLink.id + "movieId", this.movieLink.getAttribute('href', 2), options, this.moviePanel);

				//movie will already be appended if it is flash
				if (!AC.Quicktime.movieIsFlash) {
					this.moviePanel.appendChild(this.movie);
				}
			}

			// this.moviePanel.id = "toto";
			if (isACMedia === true && !this.isMobile && this.movie) {
				this._movieControls.reset();
				this.moviePanel.appendChild(this.controllerPanel);
			}

			if (typeof(document.event.dispatchEvent) == 'function') {
				document.event.dispatchEvent('didStart', this);
			}
		}
	},

	// ** {{{AC.ViewMaster.Section.replayMovie()}}} **
	// 
	replayMovie: function () {
		var isACMedia = this.isACMediaAvailable();

		if (typeof(document.event.dispatchEvent) == 'function') {
			document.event.dispatchEvent('replayMovie', this);
		}

		if (isACMedia) {
			if (this.moviePanel && this.endState) {
				this.moviePanel.removeChild(this.endState);
			}
		}
		this._playMovie(true);

		if (isACMedia) this.controllerPanel.show();

		this.controllerPanel.removeClassName('inactive');

		if (isACMedia) {
			this._movieController.setControlPanel(this._movieControls);
			this._movieController.setDelegate(this);
		} else {
			this.controllerPanel.stopObserving('click', this._movieController.replay);
			this._movieController.replay = null;

			this._movieController.attachToMovie(this.movie, {
				onMoviePlayable: this._onMoviePlayable,
				onMovieFinished: this._onMovieFinished
			});
		}
	},

	// ** {{{AC.ViewMaster.Section.stopMovie()}}} **
	// 
	// Stops the movie it is playing, and displays the endstate.
	// Doesn't close the section.
	stopMovie: function () {
		if (!this.hasMovie()) {
			return;
		}

		this._closeController();
		this._closeMovie();

		if (this.viewMaster.options.showPreviousOnStopMovie && this.viewMaster.getPreviousSelection()) {
			this.viewMaster.showPreviousSelection();
		} else if (this.viewMaster.options.showFirstOnStopMovie && this.viewMaster.getFirstSection()) {
			this.viewMaster.showFirst();
		} else if (this.endState) {
			this.moviePanel.appendChild(this.endState);
		} else {
			this.stopMovieWithNoEndState();
		}
	},

	stopMovieWithNoEndState: function () {
		//If we do the showPreviousSelection inline, the fade in animation doesn't happen. I suppose it's caused by the fact that the the DOM has been modified immediately, 
		//taking the movie out and that's not a stable state to build the animation on. A 0ms delay gives some breathing room, and when the timeout fires, the layout has been updated and is stable
		var self = this;
		setTimeout(function () {
			self.viewMaster.showPreviousSelection();
		}, 0);
	},

	_closeMovie: function () {
		if (this.movie && this.moviePanel) {

			if (!this.isACMediaAvailable()) {
				this.moviePanel.removeChild(this.movie);
				this.movie = null;
				this.moviePanel.innerHTML = '';
			} else {
				if (AC.Detector.isIEStrict()) {
					this.moviePanel.removeChild(this.movie);
					this.controllerPanel.hide();
				} else {
					this.moviePanel.innerHTML = '';
				}
				this.movie = null;
			}
		}
	},

	_closeController: function () {

		if (this.isACMediaAvailable()) {
			if (this._movieController && this.hasMovie() && !this.isMobile) {
				this._movieController.stop();
				this._movieController.setControlPanel(null);

				if (AC.Detector.isIEStrict()) this.controllerPanel.hide();
				this.controllerPanel.addClassName('inactive');
				//this.movie._replay = this.replayMovie.bind(this);
				//this.controllerPanel.observe('click', this.movie._replay);
			}
		} else {
			if (this._movieController && this._movieController.movie && this.hasMovie() && !this.isMobile) {
				//TODO this prevents the audio from lingering in safari for the most part, but is probably jsut masking a problem somewhere
				this._movieController.Stop();
				this._movieController.detachFromMovie();

				//set the controller as inactive for styling purposes?
				this.controllerPanel.addClassName('inactive');
				this._movieController.replay = this.replayMovie.bind(this);
				this.controllerPanel.observe('click', this._movieController.replay);
			}
		}

	},

	hasMovie: function () {
		return !!this.movieLink;
	},

	// ** {{{AC.ViewMaster.Section.isMoviePlaying()}}} **
	// 
	// Returns true there is a movie, controller, and if that movie is playing
	isMoviePlaying: function () {
		if (this._movieController) {
			if (typeof(this._movieController.playing) === 'function') return this._movieController.playing();
			if (typeof(this._movieController.playing) === 'boolean') return this._movieController.playing;
		}
		return false;
	},

	didFinishMovie: function () {
		if (!this.hasMovie()) {
			return;
		}

		if (typeof(document.event.dispatchEvent) == 'function') {
			document.event.dispatchEvent('didFinishMovie', this);
		}

		var self = this;
		window.setTimeout(function(){ self.stopMovie.apply(self); },0);
	}
});


// TODO extract this from this code, eventually should build this on top of
// our animation framework as it approaches a more generic animation timer
AC.ViewMaster.Slideshow = Class.create();
if (Event.Listener) Object.extend(AC.ViewMaster.Slideshow.prototype, Event.Listener);
if (Event.Publisher) Object.extend(AC.ViewMaster.Slideshow.prototype, Event.Publisher);

Object.extend(AC.ViewMaster.Slideshow.prototype, {

	contentController: null,
	animationTimeout: null,
	options: null,

	_playing: false,
	_active: false,

	_progress: 0,
	setProgress: function (value) {
		this._progress = value;
	},
	progress: function () {
		return this._progress;
	},

	// ** {{{AC.ViewMaster.Slideshow.initialize(contentController, triggerClassName, options)}}} **
	// 
	// Initializes a new Slideshow instance.
	// 
	// {{{contentController}}}: The swap view to auto-rotate
	// 
	// {{{triggerClassName}}}: If we want triggers that control play/pause of the slideshow, they
	// will have this html className
	// 
	// {{{options}}}: optional associative array of configuration options
	// 
	// === Allowed Options ===
	// TODO: Document all options, per <rdar://problem/9738399> Code : SwapView : AC.ViewMaster.Slideshow : Add documentation
	//
	// * {{{stopOnContentTriggerClick}}} [**false**]: Stop the slideshow when a trigger that changes
	//   the current section has been clicked. **DEPRECATED** Use 'stopOnUserInteraction'
	// 
	// * {{{stopOnUserInteraction}}} [**false**]: Stop the slideshow when we are told that a user
	//   interaction has occurred.
	// 
	initialize: function (contentController, triggerClassName, options) {

		this.contentController = contentController;
		this.contentController.__slideshow = this;

		this.triggerClassName = triggerClassName;

		this.options = options || {};

		// We need to do a little work here to fully deprecate iScroll removal
		// (SlideView + Slideshows), which practically means, that if touch
		// events are enabled on the viewer, and we are stopping on click, also
		// stop on swipe (user interaction).
		if (this.options.stopOnContentTriggerClick === true && this.contentController.options.useTouchEvents === true) {
			this.options.stopOnUserInteraction = this.options.stopOnContentTriggerClick;
		}

		// If the addNoListeners is set to true, then it is up to the person
		// instantiating the slideshowto attach listeners
		// otherwise the slideshow assumes you're using a viewmaster so it 
		// listens for notifications
		if (!this.options.addNoListeners) {
			this.listenForEvent(AC.ViewMaster, 'ViewMasterWillShowNotification', true, this.willShow);
			this.listenForEvent(AC.ViewMaster, 'ViewMasterDidShowNotification', true, this.didShow);
		}

		if (this.options.autoplay) {
			if (this.options.autoplay === true) {
				this.start();
			} else if (typeof this.options.autoplay === 'number') {
				this.toAutoplay = window.setTimeout(function() {
					this.start();
				}.bind(this), this.options.autoplay);
			}
		}

		Event.observe(document, 'click', this._triggerHandler.bindAsEventListener(this));

		var viewContent = this.contentController.view.view();
		Event.observe(viewContent, 'AC.ViewMaster.Slideshow:play', this.play.bindAsEventListener(this));
		Event.observe(viewContent, 'AC.ViewMaster.Slideshow:stop', this.stop.bindAsEventListener(this));
	},

	// Start the slideshow if the slideshow is not already active
	// Progress is reset to zero if the wipeProgress option is set to "always" or "on start"
	start: function () {
		if (this._active) {
			return;
		}

		this._active = true;
		if (this.options.wipeProgress == "always" || this.options.wipeProgress == "on start") {
			this._progress = 0;
		}
		this.play(true);
		this._repaintTriggers();
		if (typeof(document.event.dispatchEvent) == 'function') {
			document.event.dispatchEvent('didStart', this);
		}
	},

	// Stop the slideshow if the slideshow is active
	stop: function () {
		this._active = false;
		this.pause();
		this._repaintTriggers();
		if (this.toAutoplay) {
			window.clearTimeout(this.toAutoplay);
			delete this.toAutoplay;
		}
		if (typeof(document.event.dispatchEvent) == 'function') {
			document.event.dispatchEvent('didEnd', this);
		}
	},

	// Starts playing the slideshow if the slideshow is not already active
	// Progress is reset to zero if the wipeProgress option is set to "always" or "on play"
	play: function (wasStart) {
		if (!this._active) {
			return;
		}

		if (this.options.wipeProgress == "always" || (this.options.wipeProgress == "on play" && !wasStart)) {
			this._progress = 0;
		}

		this.animationTimeout = setTimeout(this._update.bind(this), this._heartbeatDelay());
		this._playing = true;
	},

	// Handles progress made within the slideshow
	_update: function () {

		if (typeof(this.options.onProgress) == 'function') {
			this.options.onProgress(this._progress, this.delay());
		}

		if (this._progress >= this.delay()) {
			this._progress = 0;
			this.next();
		} else {
			this._progress += this._heartbeatDelay();
			this.animationTimeout = setTimeout(this._update.bind(this), this._heartbeatDelay());
		}
	},

	// The between slides in milliseconds
	delay: function () {
		return this.options.delay || 5000;
	},

	// The delay between progress made which does not trigger a slide
	// transition in milliseconds
	_heartbeatDelay: function () {
		return this.options.heartbeatDelay || 100;
	},

	// Pause the slideshow
	pause: function () {
		clearTimeout(this.animationTimeout);
		this._playing = false;
	},

	// Have the contentController show the next slide
	next: function () {
		var discontinuousPreviousNext = this.contentController.options.discontinuousPreviousNext;

		// if the view and the slideshow discontinuous options are not the same, let's actually handle them differently
		if (this.options.discontinuousPreviousNext !== discontinuousPreviousNext) {
			this.contentController.options.discontinuousPreviousNext = this.options.discontinuousPreviousNext;
		}

		// end the slideshow if we've returned to the stopAfterReturnToSection or if willEnd (deprecated)
		var shouldEnd  = (
			(typeof this.options.stopAfterReturnToSection == 'number' && this.contentController.indexOfSection(this.contentController.currentSection) == this.options.stopAfterReturnToSection) ||
			(typeof this.options.stopAfterReturnToSection == 'string' && this.contentController.currentSection.id == this.options.stopAfterReturnToSection)
		);
		var willEnd = this.options.willEnd && (this.contentController.getNextSection() == this.contentController.getFirstSection());
		if (shouldEnd || willEnd) {
			if (willEnd) {
				try { console.warn("Instead of AC.ViewMaster.Slideshow.options.willEnd = true, please use AC.ViewMaster.Viewer.options.discontinuousPreviousNext = true."); } catch (e) {}
			}

			if (this._returnedToSection || willEnd) {
				this.stop();
			} else if (!this._returnedToSection) {
				this._returnedToSection = true;
			}
		}

		if (this._active) {
				// show the next section
			this.contentController.showNext();
		}

		// reset the ViewMaster discontinuous option to what it was previously
		this.contentController.options.discontinuousPreviousNext = discontinuousPreviousNext;

		// then reset the arrows because we might not have done the right thing with the flipped options
		this.contentController.disablePreviousNextIfNeeded();
	},

	// Have the contentController show the previous slide
	previous: function () {
		this.contentController.showPrevious();
	},

	reset: function () {
		this.contentController.showFirst();
		this.setProgress(0);
	},

	// Acknowledge that the contentController will show a slide
	willShow: function (evt) {
		// ignore if event was not sent from our contentController
		if (evt.event_data.data.sender != this.contentController) {
			return;
		}
		this.pause();
	},

	// Acknowledge that the contentController did show a slide
	didShow: function (evt) {
		// ignore if event was not sent from our contentController
		if (evt.event_data.data.sender != this.contentController) {
			return;
		}

		this.play();
	},

	// Handle mousedown events in the document to check for explicit
	// play/pause control events
	_triggerHandler: function (evt) {
		var element = evt.element();

		// stop the slideshow if the option options.stopOnContentTriggerClick
		// is {{{true}}} and we clicked on a content trigger that isn't the 
		// current section

		if ((this.options.stopOnUserInteraction === true || this.options.stopOnContentTriggerClick) && (link = evt.findElement('a')) && link.hasClassName(this.contentController.triggerClassName) && link.href.search(this.contentController.currentSection.id) == -1) {
			if (this.options.stopOnContentTriggerClick) {
				try { console.warn('"stopOnContentTriggerClick" is deprecated. Please use "stopOnUserInteraction" instead.'); } catch (e) {}
				this.stop();
			} else {
				this.userInteracted();
			}
			return;
		}

		//ignore if the element is not a trigger
		if (element.hasClassName(this.triggerClassName) && element.href.match(/#slideshow-toggle/)) {
			Event.stop(evt);

			if (this._active) {
				this.stop();
			} else {
				this.start();
			}
		}
	},

	// ** {{{AC.ViewMaster.Slideshow.userInteracted()}}} **
	// 
	// Stop the slideshow if the option {{{stopOnUserInteraction}}} is true.
	// This method is called externally to notify the slideshow that there has
	// been an interaction.
	// 
	userInteracted: function () {
		if (this.options.stopOnUserInteraction === true) {
			this.stop();
		}
	},

	// Repaints the triggers associated with controlling this slideshow
	_repaintTriggers: function () {
		if (!this.triggerClassName) return;
		var triggers = document.getElementsByClassName(this.triggerClassName);
		for (var i = triggers.length - 1; i >= 0; i--) {
			this._repaintTrigger(triggers[i])
		}
	},

	// Repaint an individual trigger associated with this slideshow
	_repaintTrigger: function (trigger) {
		var trig = $(trigger);
		if (this._active) {
			trig.addClassName('playing');
		} else {
			trig.removeClassName('playing');
		}
	}

});



// == AC.SlideView ==
// 
// A subclass of {{{AC.SwapView}}}. Manages moving a view on the page.
// 
AC.SlideView = Class.create(AC.SwapView, {

	// ** {{{AC.SlideView._resetView(evt)}}} **
	// 
	// Applies any relevant classNames, doesn't remove child nodes from the view
	_resetView: function () {
		if (!this._view) {
			return;
		}

		this._view.addClassName('swapView');
	},

	// ** {{{AC.SlideView.setLoadedContent(evt)}}} **
	// 
	// Actually shows the specified content in the receiver's view element.
	// 
	//  {{{content}}}: The content to show in the receiver's view element.
	setLoadedContent: function (content) {

		if (typeof(this.delegate.willShow) === 'function') {
			content = this.delegate.willShow(this, this.currentContent, content);
		}

		var shouldAnimate = true,
			animation;
		if (typeof(this.delegate.shouldAnimateContentChange) === 'function') {
			shouldAnimate = this.delegate.shouldAnimateContentChange(this, this.currentContent, content);
		}

		if (shouldAnimate && typeof(this.delegate.willAnimate) === 'function') {
			//While animating we can assume we'll need both outgoing and
			//incoming content in the view at the same time, so just
			//append the incoming content prior to the animation
			//Note that in this case the content of the swapview should be
			//positioned absolutely so we can layer them on top of each other
			//if you can't accommodate that then respond with a false for
			// shouldAnimateContentChange in your delegate and you'll rely
			// on the immediate swapping
			this.didAnimate = true;

			if (typeof(this.delegate.didAppendContent) === 'function') {
				this.delegate.didAppendContent(this, content);
			}

			animation = this.delegate.willAnimate(this, this.currentContent, content, this.didShow.bind(this, content));
		} else {

			this.didAnimate = false;

			// With no animation and shouldRemoveContentFromView we don't
			// assume both nodes are ever in the view at the same time so
			// remove the current content before appending the incoming content
			if (this.currentContent !== content) {
				if (typeof(this.delegate.didAppendContent) === 'function') {
					this.delegate.didAppendContent(this, content);
				}
			}

			if (content) {
				$(content).setOpacity(1.0);
			}

			this.didShow(content);
		}
	},

	// ** {{{AC.SlideView.didShow(evt)}}} **
	// 
	// Acknowledges the reciever did show the specified content.
	// 
	// {{{content}}}: The content that has just been shown.
	didShow: function (content) {
		if (typeof(this.delegate.didShow) === 'function') {
			this.delegate.didShow(this, this.currentContent, content);
		}

		this.currentContent = content;
	}

});



// == AC.ViewMaster.SlideViewer ==
// 
// A subclass of {{{AC.ViewMaster.Viewer}}}.
// 
// 
// === Additional Delegate Methods & Notifications ===
// * {{{willDrag(sender, touchEvent)}}} method
// 
// * {{{dragging(sender, touchEvent)}}} method
// 
// * {{{didDrag(sender, touchEvent)}}} method
// 
// 
// 
// === Additional Options ===
// * {{{shouldAddActiveClassToContent}}} [**false**]: Whether or not to add a class="active" to the
//   active section (and remove it from non-active sections).
// 
// * {{{continuous}}} [**false**]: Make the slides seems as if there is no end. Pressing the next or
//	previous buttons continuously will always animate from the same direction. 
// 
AC.ViewMaster.SlideViewer = Class.create(AC.ViewMaster.Viewer, {

	// ** {{{AC.ViewMaster.SlideViewer.initialize(contents, view, triggerClassName, options)}}} **
	// sub
	initialize: function (contents, view, triggerClassName, options) {
		if (triggerClassName) {
			this.triggerClassName = triggerClassName;
		}

		this.sections = $H();
		this.orderedSections = [];

		this.options = options || {};
		this.silentPreviousSelection(this.options.silentPreviousSelection);
		this.silentFirstSection(this.options.silentFirstSection);

		this.triggerEvent = this.options.triggerEvent || 'click';

		var initialSection = null,
		    section, i;

		if (contents) {
			for (i = 0; i < contents.length; i++) {
				// contents could be a NodeList, so we're going to use that API
				// I added an item method to Array in apple_core
				section = this.addSection(contents.item(i));

				if (!initialSection) {
					initialSection = section;
				}
			}
		}

		// Moved down to workaround a bug: in Safari, the results of getElementsByClassName is a NodeList.
		// If we do new AC.SwapView(view) before looping on the NodeList, the NodeList get emptied....
		this.view = new AC.SlideView(view);
		this.view.setDelegate(this);

		// save the mask elements for later (touchEvents and willAnimate)
		this.__mask = this.view.view().up();

		var hashInitialId = document.location.hash,
			hashSection, hashSectionIdMatch;

		this.sectionRegExp = this.options.sectionRegExp || new RegExp(/#(.*)$/);

		// TODO the default regex may need some stricter ending, much like the trigger matching
		// Inspect the URL for what appears to be the specified section ID according to the sectionRegExp
		hashSectionIdMatch = hashInitialId.match(this.sectionRegExp);

		if (hashSectionIdMatch && hashSectionIdMatch[1]) {
			// if we find a group that matches the id within the hash, use it as the id
			hashInitialId = hashSectionIdMatch[1];
		}

		if (hashInitialId !== this.view._viewId) {

			// To prevent loading an arbitrary element into the viewmaster
			// check to see if any of the valid triggers on the page at this 
			// time reference that id
			// if no triggerlinks reference this id, we ignore this initial id
			// TODO determine effect on remote sections which may not have
			// triggers linking to them in the page yet
			// Theoretically you can still show a section with no referencing
			// triggers manually, this jsut prevents false positives
			var triggerLinks = document.getElementsByClassName(this.triggerClassName),
			    trigger;
			for (i = 0, trigger; (trigger = triggerLinks[i]); i++) {
				if (trigger.getAttribute('href').match(new RegExp("#" + hashInitialId + "(?![\_\w\-])"))) {

					hashSection = this.sectionWithId(hashInitialId);

					if (hashSection) {
						initialSection = hashSection;
					}

					break;
				}
			}
		}

		// If no section requested or found from the id in the URL hash,
		// but one was requested via the options parameter, load that one
		if (!hashSection && typeof this.options.initialId === "string" && this.options.initialId.length > 0) {
			initialSection = this.sectionWithId(this.options.initialId);
		}

		// TODO do we want to show the initial section right away? Seems like
		// we have to, but if no delegates are set yet this will be a bit
		// different than subsequent calls to show
		this.show(initialSection);

		this._boundTriggerClicked = this._triggerClicked.bindAsEventListener(this);

		// If there is more than one type of trigger event observe all
		// If there's a better way to do this, let me know
		if (typeof this.triggerEvent === 'object') {
			for (var i = 0, evt; evt = this.triggerEvent[i]; i++) {
				Event.observe(document, evt, this._boundTriggerClicked);
			}
		} else {
			Event.observe(document, this.triggerEvent, this._boundTriggerClicked);
		}

		// In IE click event isn't sent when there is no text/image physically under the mouse, but the mouseup is, so we need to listen to that
		// TODO so is this behavior preserved when the event is something other than click?
		if (AC.Detector.isIEStrict()) {
			Event.observe(document, 'mouseup', this._boundTriggerClicked);
		}

		if (this.options.useKeyboardNav === true || this.options.escapeToClose === true) {
			this._boundKeyDown = this._keyDown.bindAsEventListener(this);
			Event.observe(document, 'keydown', this._boundKeyDown);
		}

		// Touch events
		if (this.options.useTouchEvents === true && typeof window.ontouchstart !== 'undefined') {
			this.__touchLoadEventDependencies();
		}

		// To allow event based section selection
		if (typeof(this.listenForEvent) === 'function') {
			this.selectSectionFromEventHandler = this.selectSectionFromEvent.bind(this);
			this.listenForEvent(AC.ViewMaster, 'ViewMasterSelectSectionWithIdNotification', true, this.selectSectionFromEventHandler);
			this.listenForEvent(AC.ViewMaster, 'ViewMasterWillShowNotification', true, this.stopMovieIfItsPlaying);
			this.listenForEvent(document.event, 'replayMovie', false, this.stopMovieIfItsPlaying.bind(this));

			if (this.options.parentSectionId) {
				this.listenForEvent(AC.ViewMaster, 'ViewMasterWillCloseNotification', false, function (evt) {
					var data = evt.event_data.data;

					if (this === data.sender) {
						return;
					}

					if (data.outgoingView && data.outgoingView.id === this.options.parentSectionId) {
						this.willClose(this.view, this.currentSection);
					}
				});
			}
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchLoadEventDependencies()}}} **
	// 
	// Load the dependency for touchEvent tracking (Element.trackTouches) if we need it.
	__touchLoadEventDependencies: function () {
		// Element.trackTouches is loaded
		if (typeof Element.trackTouches === 'function') {
			this.__touchInitTrackTouches();

		// Element.trackTouches might be on the page, but is not yet loaded
		} else {

			// Element.trackTouches is not on the page yet
			if ($('swap-view-track-touches-script-tag') === null) {
				// Load dependency: pagingview.js
				var head = document.getElementsByTagName('head')[0];

				var script = document.createElement('script');
				script.type = 'text/javascript';
				script.setAttribute('src', 'http://images.apple.com/global/scripts/pagingview.js');
				script.setAttribute('id', 'swap-view-track-touches-script-tag');
				head.appendChild(script);
			}

			this.__boundTouchInitTrackTouches = this.__touchInitTrackTouches.bindAsEventListener(this);
			document.observe('ac:trackTouches:load', this.__boundTouchInitTrackTouches);
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchInitTrackTouches()}}} **
	// 
	// Sets up our view element to track touch events
	__touchInitTrackTouches: function () {
		// Cannot have continuous with touch events
		this.options.discontinuousPreviousNext = true;
		this.options.continuous = false;
		this._shouldBeContinuous = false;

		// Callback for Element.trackTouches
		this.__boundTouchTrackEvents = this.__touchTrackEvents.bindAsEventListener(this);

		this.__maskWidth = this.__mask.getWidth() || 0;

		this.view.view().trackTouches(this.__boundTouchTrackEvents, this.__boundTouchTrackEvents, this.__boundTouchTrackEvents, { stopEvent: 'horizontal', stopThreshold: 10 });
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchTrackedStartOffset(event)}}} **
	// 
	// Track our touches and respond to them appropriately
	__touchTrackEvents: function (event) {
		var view = this.view.view();

		view.setVendorPrefixStyle('transition-duration', '0');

		// Element.trackTouches gave us something useful
		if (event.startCoords && event.coords) {
			// Touch Move and Touch End
			// translate the container so everything feels like it's moving
			if (event.difference && typeof this.__touchTrackedStartOffset !== 'undefined') {
				view.setVendorPrefixTransform(this.__touchTrackingNewLeft(event) +'px');

			// Touch Start
			} else {
				this.__touchStart(event);
			}

			// Touch End
			if (event.touches.length === 0) {
				this.__touchEnd(event);
			}
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchStart(event)}}} **
	// 
	// Ran on touch start when you're tracking touches.
	__touchStart: function (event) {
		var view = this.view.view(),
		    translateOffset;
		// We need to run the animation before this.show() in case we cancel it before didShow
		// This might happen if someone touched the view again before the transitionEnd event
		this.__storedShouldAnimateContentChange = this.options.shouldAnimateContentChange;
		this.options.shouldAnimateContentChange = false;

		// Clean up previous animation if we stopped it before it could finish
		if (typeof this.__touchAnimateAfterTouchEnd !== 'undefined') {
			this.__touchAnimateAfterTouchEnd(false);
		}

		// this.__touchTrackedStartOffset is where the element started, not always 0, if on the third slide, it would be 980*2
		translateOffset = view.translateOffset();
		if (translateOffset === null || typeof translateOffset !== 'object') {
			this.__touchTrackedStartOffset = 0;
		} else {
			this.__touchTrackedStartOffset = translateOffset.x;
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchEnd(event)}}} **
	// 
	// Ran on touch end when you're tracking touches.
	__touchEnd: function (event) {
		var view = this.view.view(),
		    // delta: the ratio of how far we've moved relative to the width of the mask
		    // as a number between 0 and 1
		    delta = event.difference.abs.x / this.__maskWidth,
		    deltaInCurrentDirection = event.difference.current.x / this.__maskWidth,
		    duration = this.options.animationDuration || 0.4,
		    incomingSection, newLeft, afterFinish;

		// Don't bother changing section if we haven't reached our threshold of 40% of the width of the mask
		// and we're not going fast enough to be considered a flick (~7px/s)
		if (deltaInCurrentDirection > 0.4 || event.speed >= 7) {
			if (event.direction.x === 'right') {
				incomingSection = this.getNextSection();
			} else if (event.direction.x === 'left') {
				incomingSection = this.getPreviousSection();
			}
		}

		// Set up what happens after our transitions end or are canceled
		this.__touchSetTransitionEnd(view, incomingSection);

		// Bounce or didn't swipe far/fast enough to change
		if (incomingSection === false || typeof incomingSection === 'undefined') {
			this._animate(this.__touchTrackedStartOffset, duration * delta);

		// Animate to section left edge
		} else {
		
			if(AC.Detector.isiPad() || AC.Detector.isMobile()) {
				newLeft = ((incomingSection.content.positionedOffset()[0])+14) * -1;
			}	
			if (delta >= 0.5) {
				duration *= 0.5;
			}
			this._animate(newLeft, duration);
		}

		// Tell slideshow we interacted (if there is a slideshow)
		// Only worry about this if we’ve moved a significant amount of pixels
		if (event.difference.abs.x > 5 && typeof this.__slideshow === 'object' && typeof this.__slideshow.userInteracted === 'function') {
			this.__slideshow.userInteracted();
		}

		delete this.__touchTrackedStartOffset;
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchSetTransitionEnd(view, incomingSection)}}} **
	// 
	// Ran on touch start when you're tracking touches.
	__touchSetTransitionEnd: function (view, incomingSection) {
		var afterFinish = function (shouldShowSection) {
			// Don't run show if we stopped the animation before it could finish
			if (shouldShowSection !== false) {
				this.show(incomingSection);
			}

			// Let's do some cleanup
			this.options.shouldAnimateContentChange = this.__storedShouldAnimateContentChange;
			delete this.__storedShouldAnimateContentChange;

			view.removeVendorEventListener('transitionEnd', this.__touchAnimateAfterTouchEnd, false);
			delete this.__touchAnimateAfterTouchEnd;
		}

		this.__touchAnimateAfterTouchEnd = afterFinish.bindAsEventListener(this);
		view.addVendorEventListener('transitionEnd', this.__touchAnimateAfterTouchEnd, false);
	},

	// ** {{{AC.ViewMaster.SlideViewer.__touchTrackingNewLeft(event)}}} **
	// 
	// Determine how far the view should move in relation to the the touch,
	// which is different if the section is on the edge and the touch is dragging
	// toward the edge, vs. dragging to another section
	__touchTrackingNewLeft: function (event) {
		// Figure out if we're on the first or last slide
		var isAtEnd = this.isAtEnd(this.currentSection),
		    viewDisplacementForTouchDistance,
		    absoluteViewDisplacement;

		// Return absolute displacement of view for touchDistance
		viewDisplacementForTouchDistance = function (touchDistance, maxTouchDistance) {
			var easeOut, viewDisplacement, percentage;

			easeOut = function(p) {
				return (p == 1) ? 1 : 1 - Math.pow(2, -3 * p);
			};

			// What percentage of the max (980) we have left to moved our finger (if we started at 0)
			// The more you have dragged your finger, the lower the effective percentage
			percentage = touchDistance / maxTouchDistance;

			// Apply the effective percentage to the absolute distance of how far we've moved our finger
			viewDisplacement = parseFloat(easeOut(percentage) * (maxTouchDistance / 3));

			return viewDisplacement;
		};

		// If we're on the first or last section and moving off the edge
		if (isAtEnd !== false && (isAtEnd === 'left' && event.difference.x < 0) || (isAtEnd === 'right' && event.difference.x > 0)) {
			// If we have moved
			absoluteViewDisplacement = viewDisplacementForTouchDistance(event.difference.abs.x, this.__maskWidth);

			if (isAtEnd === 'left') {
				absoluteViewDisplacement *= -1;
			}

		// Move view along with finger
		} else {
			absoluteViewDisplacement = event.difference.x;
		}

		return this.__touchTrackedStartOffset - absoluteViewDisplacement;
	},

	// ** {{{AC.ViewMaster.SlideViewer.isAtEnd(section)}}} **
	// 
	// Determine if the section is the first one (on the left), the last
	// one (on the right) or in the middle (false);
	isAtEnd: function (section) {
		var sectionIndex = this.orderedSections.indexOf(section.id);
		if (sectionIndex === 0) {
			return 'left';
		} else if (sectionIndex === this.orderedSections.length - 1) {
			return 'right';
		}

		return false;
	},

	// ** {{{AC.ViewMaster.SlideViewer.getNextSection()}}} **
	// 
	// Returns the receiver's next section
	getNextSection: function ($super) {
		if (this.options.continuous) this._shouldBeContinuous = true;
		return $super();
	},

	// ** {{{AC.ViewMaster.SlideViewer.getPreviousSection()}}} **
	// 
	// Returns the receiver's previous section.
	getPreviousSection: function ($super) {
		if (this.options.continuous) this._shouldBeContinuous = true;
		return $super();
	},

	// ** {{{AC.ViewMaster.SlideViewer.willShow}}} **
	// 
	// Extends the normal Viewer.willShow, adding a class="active" to the current active section,
	// and remove it from other sections if the option shouldAddActiveClassToContent is true.
	willShow: function ($super, view, outgoing, incoming) {
		if (this.options.shouldAddActiveClassToContent === true) {
			if (outgoing) outgoing.removeClassName('active');
			if (incoming) incoming.content.addClassName('active');
		}

		return $super(view, outgoing, incoming);
	},

	// ** {{{AC.ViewMaster.SlideViewer.__fixScrollLeft}}} **
	// 
	// Sets the scroll left position to 0 if it's not already (deep-linked).
	__fixScrollLeft: function (evt) {
		// if we are running this the first time (or we happen to have caught the window.load event), let's reset the counter to zero
		if (this.__fixScrollLeftCounter === undefined || (evt && evt.type && evt.type === 'load')) {
			this.__fixScrollLeftCounter = 0;
		}

		// if the scroll position isn't 0 or we haven't tried to reset it enough,
		if (this.__mask.scrollLeft !== 0 || this.__fixScrollLeftCounter < 5) {
			// set the scroll left position to 0
			this.__mask.scrollLeft = 0;

			// and increment the counter
			this.__fixScrollLeftCounter++;

			// firefox has a hard time with scrolling to the anchor — it takes
			// forever — so we need to check the scroll value for a bit to make
			// sure the anchor jump hasn’t taken longer than expected
			window.setTimeout(this.__boundFixScrollLeft, 10);
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer.willAnimate}}} **
	// 
	// Extends the normal Viewer.willAnimate, to show the initial section.
	willAnimate: function ($super, view, outgoing, incoming, afterFinish) {
		this.__boundFixScrollLeft = this.__fixScrollLeft.bind(this);
		window.setTimeout(this.__boundFixScrollLeft, 50);
		Event.observe(window, 'load', this.__boundFixScrollLeft);

		var currentLeft = view.view().offsetLeft || 0,
			newLeft = -incoming.offsetLeft || 0;

		if (currentLeft !== newLeft) {
			// If we need to move position the first time around for deep linking, let's animate it.
			this._didShowInitial = true;
			$super(view, outgoing, incoming, afterFinish);
			this._didShowInitial = false;
		} else {
			// Otherwise, just return the normal willAnimate (which just runs afterFinish the first time).
			$super(view, outgoing, incoming, afterFinish);
		}

		// The second, third, … time around, just return the normal willAnimate.
		this.willAnimate = $super;
	},

	// ** {{{AC.ViewMaster.SlideViewer._animate}}} **
	// 
	// The internal method for the CSS animation. This is separated from _animation so we can utilize it within the swipe.
	_animate: function (left, duration) {
		var viewContent = this.view.view();
		if (duration == 0) {
			viewContent.setVendorPrefixStyle('transition', 'none');
		} else {
			viewContent.setVendorPrefixStyle('transition', '-webkit-transform ' + duration + 's cubic-bezier(0,0,0.25,1)');
		}

		viewContent.setAttribute('left', left);
		if (AC.Detector.supportsThreeD()) {
			viewContent.setVendorPrefixStyle('transform', 'translate3d(' + left + 'px, 0, 0)');
		} else {
			viewContent.setVendorPrefixStyle('transform', 'translate(' + left + 'px, 0)');
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer._animation}}} **
	// 
	// Returns the default animation for AC.ViewMaster.Slide: a slide.
	_animation: function (view, outgoing, incoming, afterFinish, queueScope, duration) {
		var viewContent = view.view(),
			currentLeft = viewContent.offsetLeft || 0,
			newLeft = -incoming.offsetLeft || 0;
		if(AC.Detector.isIE()) {
			   currentLeft = viewContent.offsetLeft-136 || 0;
		}
		incoming.setOpacity(1);

		if (this._shouldBeContinuous) {
			var incomingIndex = this.indexOfSection(view.delegate.currentSection),
				outgoingIndex = this.indexOfSection(view.delegate.previousSection);

			var resetNewLeft = newLeft;

			if ((incomingIndex === 0) && (outgoingIndex === this.orderedSections.length - 1)) {
				newLeft = (outgoing.positionedOffset()[0] + outgoing.getWidth()) * -1;
				this._continuousCloneElement = this._continuousClone(view, incoming, newLeft);
			} else if ((incomingIndex === this.orderedSections.length - 1) && (outgoingIndex === 0)) {
				newLeft = (outgoing.positionedOffset()[0] - outgoing.getWidth()) * -1;
				this._continuousCloneElement = this._continuousClone(view, incoming, newLeft);
			}
		}

		var self = this;

		if (AC.Detector.isCSSAvailable('transition') && AC.Detector.isCSSAvailable('transform')) {
			var transitionDone = false;
			this._animate(newLeft, duration);

			// afterFinish
			var ended = function (evt) {
				transitionDone = true;
				if (evt.target == viewContent && evt.propertyName.match(/transform$/i)) {
					viewContent.removeVendorEventListener('transitionEnd', ended, false);
					self._continuousReset(resetNewLeft, view);
					afterFinish();
				}
			}
			viewContent.addVendorEventListener('transitionEnd', ended, false);
			
			//in case transition doesn't end and listener doesn't get called (issue happens only in Safari)
			setTimeout( function(){ 
				if (transitionDone === false){
					afterFinish(); 
				}
			}, 500);
		
			// otherwise use JS effects
		} else {
			return new Effect.Move(viewContent, {
				x: newLeft - currentLeft,
				y: 0,
				duration: duration,
				afterFinish: function () {
					self._continuousReset(resetNewLeft, view);
					afterFinish()
				},
				queue: {
					scope: queueScope
				}
			});
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer._continuousClone}}} **
	// 
	// Creates clone of incoming element to simulate continuous carousel
	_continuousClone: function (view, incoming, newLeft) {
		if (this._shouldBeContinuous) {

			var clone = incoming.cloneNode(true);
			clone.id = clone.id + '-clone';
			clone.innerHTML = incoming.innerHTML;

			clone.setStyle('position: absolute; top: 0; left:' + (newLeft * -1) + 'px');

			view._view.insert(clone);

			return clone;
		} else {
			return false;
		}
	},

	// ** {{{AC.ViewMaster.SlideViewer._continuousReset}}} **
	// 
	// Sets slide to actual left position after continuous animation of clone
	_continuousReset: function (resetNewLeft, view) {
		if (this._shouldBeContinuous) {
			view._view.setAttribute('left', resetNewLeft);
			if (AC.Detector.isCSSAvailable('transition') && AC.Detector.isCSSAvailable('transform')) {
				view._view.setVendorPrefixStyle('transition', 'none');
				if (AC.Detector.supportsThreeD()) {
					view._view.setVendorPrefixStyle('transform', 'translate3d(' + resetNewLeft + 'px, 0, 0)');
				} else {
					view._view.setVendorPrefixStyle('transform', 'translate(' + resetNewLeft + 'px, 0)');
				}
			} else {
				view._view.setStyle('left:' + resetNewLeft + 'px');
			}
			delete this._shouldBeContinuous;
		}

		if (this._continuousCloneElement) {
			if (this._removeContinuousCloneElement) {
				this._continuousCloneElement.remove();
				delete this._continuousCloneElement;
				delete this._removeContinuousCloneElement;
			} else {
				this._removeContinuousCloneElement = true;
			}
		}
	}

});





AC.loadRemoteContent = function(contentURL, importScripts, importCSS, callback, context, delegate) {
	if (typeof contentURL !== 'string') return;
	if (typeof importScripts !== 'boolean') importScripts = true;
	if (typeof importCSS !== 'boolean') importCSS = true;
	var callee = arguments.callee;
	var registeredArguments = callee._loadArgumentsByUrl[contentURL];
	if (!registeredArguments) {
		callee._loadArgumentsByUrl[contentURL] = {
			contentURL:contentURL,
			importScripts:importScripts,
			importCSS:importCSS,
			callback:callback,
			context:context,
			delegate:delegate
		};

		var ajaxOptions = {
			method:'get',
			onSuccess: arguments.callee.loadTemplateHTMLFromRequest,
			onFailure: arguments.callee.failedToadTemplateHTMLFromRequest,
			onException: function(r, e) { throw(e); } // FIXME remove me
		};

		if (!contentURL.match(/\.json$/)) {
			ajaxOptions.requestHeaders = { Accept:'text/xml' };
			ajaxOptions.onCreate = function(response) {
				response.request.overrideMimeType('text/xml');
			};
		}

		new Ajax.Request(contentURL, ajaxOptions);
	}
}

AC.loadRemoteContent._loadArgumentsByUrl = {};

AC.loadRemoteContent.loadTemplateHTMLFromRequest = function(httpResponse) {
	var reqURL = httpResponse.request.url;
	var callee = arguments.callee;
	var registeredArguments = AC.loadRemoteContent._loadArgumentsByUrl[reqURL];

	var windowDocument = window.document;
	var xmlDocument = httpResponse.responseXMLValue().documentElement;

	if (AC.Detector.isIEStrict()) {
		xmlDocument = xmlDocument.ownerDocument;
	}

	var windowDocument = window.document;
	var scriptFragment = document.createDocumentFragment();

	if (registeredArguments.importScripts) {
		AC.loadRemoteContent.importScriptsFromXMLDocument(xmlDocument, scriptFragment, registeredArguments);
	}
	if (registeredArguments.importCSS) {
		AC.loadRemoteContent.importCssFromXMLDocumentAtLocation(xmlDocument, reqURL, registeredArguments);
	}

	// apparently, importing a document fragment doesn't cut it. However, importing nodes and adding them to a document fragment does!
	var result = null;
	var rootElement = null;
	var body = xmlDocument.getElementsByTagName('body')[0];

	if (!body) {
		return;
	}

	body.normalize();
	var rootElement = Element.Methods.childNodeWithNodeTypeAtIndex(body, Node.ELEMENT_NODE, 0);


	if (rootElement) {
		result = windowDocument._importNode(rootElement, true);
		// we can live without that for now
		if (result.cleanSpaces) result.cleanSpaces(true);
	} else {
		if (body.cleanSpaces) body.cleanSpaces(true);
		else if (typeof body.normalize === 'function') body.normalize();

		var bodyChildNodes = body.childNodes;
		result = windowDocument.createDocumentFragment();
		var notSpace = /\S/;
		for (var i=0, iBodyChildNode=0; (iBodyChildNode = bodyChildNodes[i]); i++) {
			var importedNode = windowDocument._importNode(iBodyChildNode, true);
			result.appendChild(importedNode);
		}
	}

	// invoke the callback with result:
	var callback = registeredArguments.callback;
	callback(result, scriptFragment, registeredArguments.context);

}

AC.loadRemoteContent.javascriptTypeValueRegExp = new RegExp('text/javascript', 'i');

AC.loadRemoteContent.javascriptLanguageValueRegExp = new RegExp('javascript', 'i');

AC.loadRemoteContent.documentScriptsBySrc = function() {
	if (!AC.loadRemoteContent._documentScriptsBySrc) {
		AC.loadRemoteContent._documentScriptsBySrc = {};
		var scripts = document.getElementsByTagName('script');
		if (!scripts || scripts.length === 0) {
			return AC.loadRemoteContent._documentScriptsBySrc;
		}

		for (var i=0, iScript=null; (iScript = scripts[i]); i++) {
			var type = iScript.getAttribute('type');
			var src = null;

			var language = iScript.getAttribute('language');
			if (!this.javascriptTypeValueRegExp.test(type) && !this.javascriptLanguageValueRegExp.test(language)) continue;

			if (iScript.hasAttribute) {
				var iScriptHasSrc = iScript.hasAttribute('src');
			} else {
				var iScriptHasSrc = Element.Methods.hasAttribute(iScript, 'src');
			}

			if (iScriptHasSrc) {
				var src = iScript.getAttribute('src');
				AC.loadRemoteContent._documentScriptsBySrc[src] = src;
			}

		}
	}
	return AC.loadRemoteContent._documentScriptsBySrc;
}

AC.loadRemoteContent.importScriptsFromXMLDocument = function(xmlDocument, frag, registeredArguments) {
	var scripts = xmlDocument.getElementsByTagName('script'),
	    type,
	    src,
	    language,
	    iScriptHasSrc,
	    contentURL = registeredArguments.contentURL,
	    delegate = registeredArguments.delegate,
	    context = registeredArguments.context,
	    hasShouldImportScript = (delegate && typeof delegate.shouldImportScriptForContentURL === 'function'),
		ua = navigator.userAgent.toLowerCase(),
	    shouldDelayImportScript = (AC.Detector.isIEStrict() && parseInt(ua.substring(ua.lastIndexOf('msie ') + 5)) < 9),
	    shouldImportScript = true;

	if (!frag) frag = document.createDocumentFragment();
	var documentScriptsBySrc = AC.loadRemoteContent.documentScriptsBySrc();
	for (var i=0, iScript=null; (iScript = scripts[i]); i++) {
		type = iScript.getAttribute('type');
		src = null;
		shouldImportScript = true;

		language = iScript.getAttribute('language');
		if (!this.javascriptTypeValueRegExp.test(type) && !this.javascriptLanguageValueRegExp.test(language)) continue;

		if (iScript.hasAttribute) {
			iScriptHasSrc = iScript.hasAttribute('src');
			src = iScript.getAttribute('src');
		} else {
			src = iScript.getAttribute('src');
			iScriptHasSrc = ((src != null) && (src !== ''));
		}

		if (iScript.getAttribute('id') === 'Redirect' ||  (hasShouldImportScript && !delegate.shouldImportScriptForContentURL(iScript, contentURL, context))) {
			continue
		}

		if (iScriptHasSrc) {
			if ( !documentScriptsBySrc.hasOwnProperty(src)) {
				var localScript = document.createElement('script');
				localScript.setAttribute('type', 'text/javascript');

				if (shouldDelayImportScript) {
					// this twisted construction is to work around a bug where IE immediately execute
					// a script whith it's text property initialized, so an 'inline' script, when appended to
					// a document fragment.
					localScript.tmp_src = src;
					localScript.onreadystatechange = function() {
						var target = window.event.srcElement, src;
						if ( !target.isLoaded && ((target.readyState == 'complete') || (target.readyState == 'loaded'))) {
							src = target.tmp_src;
							if (src) {
								target.tmp_src = null;
								target.src = src;
								target.isLoaded = false;
							} else {
								target.onreadystatechange = null;
								target.isLoaded = true;
							}
						}
					}
				} else {

					localScript.src = src;
				}
				AC.loadRemoteContent._documentScriptsBySrc[src] = src;
				frag.appendChild(localScript);
			}
		} else {
			// inline string

			var localScript = document.createElement('script');
			localScript.setAttribute('type', 'text/javascript');
			if (shouldDelayImportScript) {
				// this twisted construction is to work around a bug where IE immediately execute
				// a script whith it's text property initialized, so an 'inline' script, when appended to
				// a document fragment.
				var contentFunction = new Function(iScript.text);
				localScript.onreadystatechange = function() {
					var target = window.event.srcElement;
					if ( !target.isLoaded && ((target.readyState == 'complete') || (target.readyState == 'loaded'))) {
						target.onreadystatechange = null;
						target.isLoaded = true;
						contentFunction();
					}
				}
			} else {
				localScript.text = iScript.text;
			}
			AC.loadRemoteContent._documentScriptsBySrc[src] = src;
			frag.appendChild(localScript);

		}

	}
	return frag;
};

AC.loadRemoteContent.insertScriptFragment = function(scriptFragment) {

	if (!scriptFragment) return;
	// prevent immediate execution of onDOMReady()
	AC.isDomReady = false;
	Event._domReady.done = false;
	var head = document.getElementsByTagName('head')[0], childNodes = scriptFragment.childNodes, iChild, i,
	loadCallback = function() {
		var target;
		if (!window.event || ((target = window.event.srcElement) && (target.isLoaded || ( (typeof target.isLoaded === 'undefined') && ((target.readyState == 'complete') || (target.readyState == 'loaded'))) ) )) {
			arguments.callee.loadedCount++;
			if (target && !target.isLoaded) {
				target.onreadystatechange = null;
				target.isLoaded = true;
			}

			if (arguments.callee.loadedCount === arguments.callee.loadingCount) {
				Event._domReady();
			}
		}
	};

	loadCallback.loadedCount = 0;
	loadCallback.loadingCount = scriptFragment.childNodes.length;

	for (i=0; (iChild = childNodes[i]); i++) {
		if (iChild.addEventListener) {
			iChild.addEventListener('load', loadCallback, false);
		} else {
			// for IE, the real code is executed from inside the onreadystatechange for inline scripts, see importScriptsFromXMLDocument() for details, 
			// so we need to make sure this get executed if there's already one in place.
			if (typeof iChild.onreadystatechange === 'function') {
				var currentOnreadystatechange = iChild.onreadystatechange;
				iChild.onreadystatechange = function(event) {
					var target = window.event.srcElement;
					currentOnreadystatechange.call(target);
					loadCallback();
				}
			} else {
				iChild.onreadystatechange = loadCallback;
			}
		}
	}

	head.appendChild(scriptFragment);
	head=null;
}

AC.loadRemoteContent.documentLinksByHref = function() {
	if (!AC.loadRemoteContent._documentLinksByHref) {
		AC.loadRemoteContent._documentLinksByHref = {};
		var links = document.getElementsByTagName('link');
		if (!links || links.length === 0) {
			return AC.loadRemoteContent._documentLinksByHref;
		}

		for (var i=0, iLink=null; (iLink = links[i]); i++) {
			var type = iLink.getAttribute('type');
			if (iLink.type.toLowerCase() !== 'text/css') {
				continue;
			}
			var src = null;

			if (iLink.hasAttribute) {
				var iLinkHasSrc = iLink.hasAttribute('href');
			} else {
				var iLinkHasSrc = Element.hasAttribute(iLink, 'href');
			}

			if (iLinkHasSrc) {
				var src = iLink.getAttribute('href');
				AC.loadRemoteContent._documentLinksByHref[src] = src;
			}

		}
	}
	return AC.loadRemoteContent._documentLinksByHref;
}

AC.loadRemoteContent.__importCssElementInHeadFromLocation = function(iNode, head, url) {
	// prepend the component's url
	var isLink = (iNode.tagName.toUpperCase() === 'LINK');
	if (isLink) {
		var type = iNode.getAttribute('type');
		if (!type || type && type.toLowerCase() !== 'text/css') {
			return;
		}
		var href = iNode.getAttribute('href');
		if (!href.startsWith('http') && !href.startsWith('/')) {
			var hrefOriginal = href;
			if (url.pathExtension().length > 0) {
				url = url.stringByDeletingLastPathComponent();
			}
			href = url.stringByAppendingPathComponent(hrefOriginal);
		}
		if (AC.Detector.isIEStrict()) {
			var stylesheet = window.document.createStyleSheet(href, 1);
		} else {
			var importedNode = window.document.importNode(iNode, true);
			importedNode.href = href;
		}
		AC.loadRemoteContent.documentLinksByHref()[href] = href;
	}
	if (!AC.Detector.isIEStrict() || (AC.Detector.isIEStrict() && !isLink)) {
		head.insertBefore(importedNode, head.firstChild);
	}
};

AC.loadRemoteContent.importCssFromXMLDocumentAtLocation = function(xmlDocument, url, registeredArguments) {
	// css can be linked using either a <style> tag or a <link> tag. I'm going to import them, and only looking at the head child nodes.
	var head = window.document.getElementsByTagName('head')[0];
	var candidateNodes = [];
	candidateNodes.addObjectsFromArray(xmlDocument.getElementsByTagName('style'));
	candidateNodes.addObjectsFromArray(xmlDocument.getElementsByTagName('link'));
	if (candidateNodes) {
		var documentLinksByHref = AC.loadRemoteContent.documentLinksByHref();
		for (var i=0, iNode=null; (iNode = candidateNodes[i]); i++) {
			var href = iNode.getAttribute('href');
			if (documentLinksByHref.hasOwnProperty(href)) {
				continue;
			}
			this.__importCssElementInHeadFromLocation(iNode, head, url);
		}
	}

};

Ajax.Request.prototype._overrideMimeType = null;
Ajax.Request.prototype.overrideMimeType = function(overrideMimeTypeValue) {
	this._overrideMimeType = overrideMimeTypeValue;
	if (this.transport.overrideMimeType) {
		this.transport.overrideMimeType(overrideMimeTypeValue);
	}
};

Ajax.Request.prototype._doesOverrideXMLMimeType = function() {
	return (this._overrideMimeType === 'text/xml');
};

Ajax.Response.prototype.responseXMLValue = function() {
	if (AC.Detector.isIEStrict()) {
		var xmlDocument = this.transport.responseXML.documentElement;
		if (!xmlDocument && this.request._doesOverrideXMLMimeType()) {
			this.transport.responseXML.loadXML(this.transport.responseText);
		}
	}
	return this.transport.responseXML;
};





// == {{{AC.Retina Integration}}} ==
// 
if (typeof AC.Retina !== 'undefined') {
	AC.Retina.SwapView = function () {
		var __respondToSwapView;

		if (AC.Retina.sharedInstance() === null) {
			return false;
		}

		// Set up event responder
		__respondToSwapView = function (evt) {
			// If there is an incoming view
			if (evt.event_data.data.incomingView && Object.isElement(evt.event_data.data.incomingView.content)) {
				var incoming = evt.event_data.data.incomingView.content;
				var view = evt.event_data.data.sender.view.view();
		
				// Replace images with their higher-res counterparts.
				// Scope changes to view element
				AC.Retina.sharedInstance().replace(incoming, view);
			}
		};
		__respondToSwapView = __respondToSwapView.bindAsEventListener(this);

		if ('Listener' in Event && typeof AC.ViewMaster !== 'undefined') {
			Event.Listener.listenForEvent(AC.ViewMaster, 'ViewMasterDidShowNotification', false, __respondToSwapView);
		}
	};
	Event.observe(window, 'load', function () {
		window.setTimeout(AC.Retina.SwapView, 20);
	});
}



