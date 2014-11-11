// = AC =
// Apple core helper functions:
if (typeof(AC) == 'undefined') { AC = {}; }

// == HTML5 <nav> ==
// Add the HTML5 nav element for future proof-ness.
document.createElement('nav');

// == {{{AC.addEvent(element, name, handler)}}} ==
// Registers a crossbrowser event listener on a single target element, returns {{{event}}}.
AC.addEvent = function(element, name, handler) {
    if (element.addEventListener) {
        return element.addEventListener(name, handler, false);
    } else {
        return element.attachEvent('on'+name, handler);
    }
}


// == {{{AC.removeEvent(element, name, handler)}}} ==
// Crossbrowser removal of event listeners from the target element, returns {{{event}}}.
AC.removeEvent = function(element, name, handler) {
    if (element.removeEventListener) {
        return element.removeEventListener(name, handler, false);
    } else {
        return element.detachEvent('on'+name, handler);
    }
}


// == {{{AC.removeClassName(element, className)}}} ==
// Removes {{{className}}} from {{{element}}}.
AC.removeClassName = function(element, className) {
    className = new RegExp(className, 'g');
    element.className = element.className.replace(className, '').replace(/ +/g, ' ').replace(/ +$/gm, '').replace(/^ +/gm, '');
}

// == {{{AC.getPreviousSibling(element)}}} ==
// Returns the previous sibling of an {{{element}}}.
AC.getPreviousSibling = function(element) {
    while (element = element.previousSibling)
        if (element.nodeType == 1) return element;
}

// == {{{AC.Detector.isCSSAvailable(property)}}} ==
// Documentation within Apple Core, /global/scripts/apple_core.js.
if (typeof(AC.Detector) == 'undefined') {
    AC.Detector = {
        _iOSVersion: null,
        iOSVersion: function() {
            if (this._iOSVersion === null) {
                this._iOSVersion = (navigator.userAgent.match(/applewebkit/i) && (navigator.platform.match(/iphone/i) || navigator.platform.match(/ipod/i) || navigator.platform.match(/ipad/i))) ? parseFloat(navigator.userAgent.match(/os ([\d_]*)/i)[1].replace('_', '.')) : false;
            }
            return this._iOSVersion;
        },

        _svgAsBackground: null,
        svgAsBackground: function(callback) {
            if (this._svgAsBackground === null) {
                var success = function() {
                    AC.Detector._svgAsBackground = true;
                    if (typeof(callback) == 'function') {
                        callback();
                    }
                }

                var img = document.createElement('img')
                img.setAttribute('src', 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNzUiIGhlaWdodD0iMjc1Ij48L3N2Zz4%3D');

                if (img.complete) {
                    img.style.visibility = 'hidden';
                    img.style.position = 'absolute';
                    document.body.appendChild(img);

                    window.setTimeout(function() {
                        AC.Detector._svgAsBackground = false;
                        if (img.width >= 100) {
                            document.body.removeChild(img);
                            success();
                        } else {
                            document.body.removeChild(img);
                        }
                    }, 1);
                } else {
                    this._svgAsBackground = false;
                    img.onload = success;
                }
            } else {
                if (this._svgAsBackground && typeof(callback) == 'function') {
                    callback();
                }
            }
            return this._svgAsBackground;
        },

        _style: null,
        _prefixes: null,
        _preFixes: null,
        _css: null,
        isCSSAvailable: function(property) {
            if (!this._style) this._style = document.createElement('browserdetect').style;
            if (!this._prefixes) this._prefixes = '-webkit- -moz- -o- -ms- -khtml- '.split(' ');
            if (!this._preFixes) this._preFixes = 'Webkit Moz O ms Khtml '.split(' ');
			if (!this._css) this._css = {};
			
            property = property.replace(/([A-Z]+)([A-Z][a-z])/g, '$1\-$2').replace(/([a-z\d])([A-Z])/g, '$1\-$2').replace(/^(\-*webkit|\-*moz|\-*o|\-*ms|\-*khtml)\-/, '').toLowerCase();
            switch (property) {
                case 'gradient':
					if (this._css['gradient'] !== undefined) return this._css['gradient'];

                    var property = 'background-image:',
                        value1 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
                        value2 = 'linear-gradient(left top,#9f9, white);';

                    this._style.cssText = (property + this._prefixes.join(value1 + property) + this._prefixes.join(value2 + property)).slice(0,-property.length);
                    this._css['gradient'] = (this._style.backgroundImage.indexOf('gradient') !== -1);
                    return this._css['gradient'];

                case 'inset-box-shadow':
                    if (this._css['inset-box-shadow'] !== undefined) return this._css['inset-box-shadow'];

                    var property = 'box-shadow:',
                        value = '#fff 0 1px 1px inset;';

                    this._style.cssText = this._prefixes.join(property + value);
                    this._css['inset-box-shadow'] = (this._style.cssText.indexOf('inset') !== -1);
                    return this._css['inset-box-shadow'];

                default:
                    var properties = property.split('-'),
                        length = properties.length,
                        Property, i, j;

                    if (properties.length > 0) {
                        property = properties[0];
                        for (i=1; i<length; i++) {
                            property += properties[i].substr(0, 1).toUpperCase() + properties[i].substr(1);
                        }
                    }
                    Property = property.substr(0, 1).toUpperCase() + property.substr(1);

                    if (this._css[property] !== undefined) return this._css[property];

                    for (j=this._preFixes.length-1; j>=0; j--) {
                        if (this._style[this._preFixes[j]+property] !== undefined || this._style[this._preFixes[j]+Property] !== undefined) {
                            this._css[property] = true;
                            return true;
                        }
                    }
                    return false;

            }
            return false;
        }
    }
}


// = AC.GlobalNav =
// On initialize, get all the elements from the DOM, add some CSS hooks for
// styling, decorate the search input, enhance the search with shortcuts, and
// add the enhanced style sheet if you canEnhance.
AC.GlobalNav = function() {
    var self = this, i;

    this.globalHeader = document.getElementById('globalheader');
    this.globalSearch = document.getElementById('sp-searchtext');
    this.globalStylesheet = document.getElementById('globalheader-stylesheet');

    if (this.globalHeader) {

        // **** add CSS hooks for the stylesheet
        this.globalHeader.className += ' globalheader-js';
        AC.Detector.svgAsBackground(function() {
            self.globalHeader.className += ' svg';
        });

        if (navigator.userAgent.match(/applewebkit/i)) {
            if (!navigator.geolocation) {
                this.globalHeader.className += ' decelerate';
            } else if (navigator.platform.match(/ipad/i)  || navigator.platform.match(/iphone/i) || navigator.platform.match(/ipod/i)) {
                this.globalHeader.className += ' ios';
            }
            if (AC.Detector.iOSVersion() && AC.Detector.iOSVersion() <= 3.2) {
                this.globalHeader.className += ' ios3';
            }

            // **** chrome on windows has a horrible rounded couner + inset shadow
            // bug: http://code.google.com/p/chromium/issues/detail?id=29427
            if (!AC.Detector.isCSSAvailable('inset-box-shadow') || navigator.userAgent.match(/chrome/i) && navigator.userAgent.match(/windows/i)) {
                this.globalHeader.className += ' noinset';
            }
        }

        // **** enhance the search with shortcuts
        this.enhanceSearch();

        // **** decorate the input
        this.decorateSearchInput();

        // decorate the global nav for IE
        this.vml();

        // **** decorate the active and depressed states
        this.decorateTabStates();

        // **** enhanced style sheet if you can
        if (AC.GlobalNav.canEnhance() && this.globalStylesheet) {
            this.enhancedGlobalStylesheet = this.globalStylesheet.cloneNode(true);
            this.enhancedGlobalStylesheet.id = 'globalheader-enhanced-stylesheet';
            this.enhancedGlobalStylesheet.href = this.globalStylesheet.href.replace('/navigation.css', '/enhanced.css');
            this.globalStylesheet.parentNode.appendChild(this.enhancedGlobalStylesheet);
        }
        this.loaded();
    }
}

// === AC.GlobalNav.canEnhance ===
// Checks if this browser can enhance the global nav with the HTML5 version,
// basically if it support transitions and gradients, and if it’s greater than
// or equal to iOS 3.2, and if it is greater than Safari 4.0.2.
AC.GlobalNav._canEnhance = null;
AC.GlobalNav.canEnhance = function() {
    if (AC.GlobalNav.canEnhance._canEnhance == null) {
        var version = navigator.userAgent.replace(/^.*version\/([\d\.]*) .*$/i, '$1').split('.');
        AC.GlobalNav.canEnhance._canEnhance = (
            AC.Detector.isCSSAvailable('transition-property') && 
            AC.Detector.isCSSAvailable('gradient') && 
            (AC.Detector.iOSVersion() === false || AC.Detector.iOSVersion() >= 3.2) &&
            !(navigator.userAgent.match(/applewebkit/i) && version.length == 3 && ( version[0] <= 4 && version[1] <= 0 && version[2] <= 2 ))
        );
    }
    return AC.GlobalNav.canEnhance._canEnhance;
}

// === AC.GlobalNav.enhanceSearch ===
// Enhance the global search input with search shortcuts.
AC.GlobalNav.prototype.enhanceSearch = function() {
    this.globalSearchForm = document.getElementById('g-search');
    if (this.globalSearchForm && this.globalSearch) {
        if (typeof(searchCountry) == 'undefined') {
            searchCountry = 'us';
        }

        if ( SearchShortcut.geoMap[searchCountry.toUpperCase()].directory) {
            // **** use specified country directory
            var countryDirectory = SearchShortcut.geoMap[searchCountry.toUpperCase()].directory
        } else if (searchCountry != 'us') {
            // **** use /countrycode logic 
            var countryDirectory = '/' + searchCountry.replace(/_/, '');
        } else {
            // **** assume us, which has no coutnry code in path
            countryDirectory = '';
        }

		// DGAN - Added for our own use
	    if (typeof(searchLocale) == "undefined" ) {
	    	searchLocale = "en_US";
	    }
	    
	    if (typeof(enableAppleInstant) == "undefined") {
	    	enableAppleInstant = "no"; // If enableAppleInstant is not set, making default as "no"
	    }

        var actionUrls = {
            'global': 'http://www.apple.com' + countryDirectory + '/search/', 
            'ipad': 'http://www.apple.com' + countryDirectory + '/search/', 
            'iphone': 'http://www.apple.com' + countryDirectory + '/search/', 
            'ipoditunes': 'http://www.apple.com' + countryDirectory + '/search/', 
            'mac': 'http://www.apple.com' + countryDirectory + '/search/', 
            'store': 'http://www.apple.com' + countryDirectory + '/search/', 
            'support': 'http://www.info.apple.com/searchredir.html'
        }

        var actionUrl = actionUrls[searchSection] || 'http://www.apple.com/search/'; 
		
		// Support Site Changes - Fetching aciton URL from c_searchform.jsp
        //this.globalSearchForm.setAttribute('action', actionUrl);
        this.globalSearchForm.setAttribute('method', 'get');

        this.searchShortcut = searchShortcut = new SearchShortcut(this.globalSearchForm, this.globalSearch);
        SearchShortcut.loadXmlToDoc = function(text) {
            searchShortcut.loadXmlToDoc(text);
        };
        
        // DGAN - declare our callback and quicklinks function so it is in the right scope
			SearchShortcut.loadJson = function(json) {
				searchShortcut.loadJson(json);
			};
			SearchShortcut.loadQuicklinks = function(json) {
				searchShortcut.loadQuicklinks(json);
			};
			SearchShortcut.loadAIResults = function(json) {
				searchShortcut.loadAIResults(json);
			};
    }
}

// === AC.GlobalNav.decorateSearchInput ===
// Decorate the global search input with the fancy rounded corners and
// extra functionality: search mode, reset button, ESC.
AC.GlobalNav.prototype.decorateSearchInput = function() {
    if (this.globalSearch) {
        var form, frag, standIn, reset, resetField,
        self = this,
        shouldFocus = true,
        form = document.getElementById('g-search');
        frag = document.createDocumentFragment();

        // prevent browser from doing its own autocomplete, threw odd xul
        // error on reset sometimes, although this feels a little
        // heavy handed
        this.globalSearch.setAttribute('autocomplete', 'off');

        // replace the field with a standin while we create the wrapper
        // we can't lose the reference to this field as other objects may
        // have already registered listeners on this field
        standIn = document.createElement('input');
        this.globalSearch.parentNode.replaceChild(standIn, this.globalSearch);

        reset = document.createElement('div');
        reset.className = 'reset';
        resetEnd = function(evt) {
            if (evt.target == reset && window.getComputedStyle(reset, null)['opacity'] == '0') {
                reset.style.display = 'none';
            }
        };
        if (window.addEventListener) {
            reset.addEventListener('transitionend', resetEnd, true);
            reset.addEventListener('transitionEnd', resetEnd, true);
            reset.addEventListener('oTransitionEnd', resetEnd, false);
            reset.addEventListener('mozTransitionEnd', resetEnd, false);
            reset.addEventListener('webkitTransitionEnd', resetEnd, false);
        }

        if (this.globalSearch.value.length == 0) form.className += ' empty';

        frag.appendChild(this.globalSearch);
        frag.appendChild(reset);

        resetField = function(evt) {
            shouldFocus = false;
            self.globalSearch.value = '';
             var searchText = document.getElementById('sp-searchtext').value;
            if (self.searchShortcut) self.searchShortcut.hideResults();
            window.setTimeout(function() {
                form.className += ' empty';
                if(enableAppleInstant == "yes"){
                	var feedStats = new ACFeedStatistics();
                	var store = new Persist.Store('FeedStats');
                	store.set('resultActivity', false);
                	feedStats.updateNotViewedForSuggestedSearch(searchText);
                }
                shouldFocus = true;
            }, 10);
        }
        AC.addEvent(reset, 'mousedown', resetField);

        AC.addEvent(this.globalSearch, 'focus', function(evt) {
            if (shouldFocus) {
                reset.style.display = '';
                window.setTimeout(function() {
                    self.globalHeader.className += ' searchmode';
                }, 10);
            }
        });

        AC.addEvent(this.globalSearch, 'blur', function(evt) {
            if (shouldFocus) {
                reset.style.display = '';
                window.setTimeout(function() {
                    AC.removeClassName(self.globalHeader, 'searchmode');
                }, 10);
            } else {
                shouldFocus = true;
            }
        });

        AC.addEvent(this.globalSearch, 'keydown', function(evt) {
            var keyCode = evt.keyCode ; //typeof(event) != 'undefined' ? event['keyCode'] : evt.keyCode;
            shouldFocus = true;

            if (self.globalSearch.value.length >= 0) {
                reset.style.display = '';
                window.setTimeout(function() {
                    AC.removeClassName(form, 'empty');
                }, 10);
            } else if (!form.className.match('empty')) {
                form.className += ' empty';
            }

            // if it's escape reset the field
            if (evt.keyCode === 27) resetField(evt);
        });

        if (standIn) {
            standIn.parentNode.replaceChild(frag, standIn);
        }
    }
}

// === AC.GlobalNav.vml ===
// VML rounded corner and drop shadows for IE.
AC.GlobalNav.prototype.vml = function() {
    var frag, rect, image, fill, shadow;
    if (!AC.Detector.isCSSAvailable('border-radius') && document.namespaces && this.globalHeader) {
        document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');

        frag = document.createDocumentFragment();

        rect = document.createElement('v:roundrect');
        rect.setAttribute('id', 'globalheader-roundrect');
        rect.setAttribute('stroked', true);
        rect.setAttribute('strokeColor', '#737373');
        rect.setAttribute('arcSize', '.1');
        frag.appendChild(rect);

        image = this.globalHeader.currentStyle['backgroundImage'];
        this.globalHeader.style.backgroundImage = 'none';
        image = image.replace(/url\(["']*([^"']*)["']*\)/, '$1');

        fill = document.createElement('v:fill');
        fill.setAttribute('id', 'globalheader-fill');
        fill.setAttribute('type', 'tile');
        fill.setAttribute('src', image);
        rect.appendChild(fill);

        shadow = document.createElement('v:roundrect');
        shadow.setAttribute('id', 'globalheader-shadow');
        shadow.setAttribute('stroked', false);
        shadow.setAttribute('fillColor', '#999');
        shadow.setAttribute('arcSize', '.1');
        frag.appendChild(shadow);

        this.globalHeader.appendChild(frag);
    }
}

// === AC.GlobalNav.getPreviousNavItem ===
// Utility for getting the previous nav item.
AC.GlobalNav.prototype.getPreviousNavItem = function(item) {
    while (item.tagName.toLowerCase() !== 'li') item = item.parentNode;
    item = AC.getPreviousSibling(item);
    if (!item) return false;
    if (item.tagName.toLowerCase() !== 'li') return false;

    item = item.getElementsByTagName('a');
    if (!item[0]) return false;

    return item[0];
}

// === AC.GlobalNav.decorateTabStates ===
// Decorate the on and depressed tab states.
AC.GlobalNav.prototype.decorateTabStates = function() {
    this.globalNavItems = this.globalHeader.getElementsByTagName('a');

    var self = this,
        tab = this.globalHeader.className.replace(/ .*/, ''),
        i;

    for (i=this.globalNavItems.length-1; i>=0; i--) {
        if (this.globalNavItems[i].href.match(tab)) {
            this.currentTab = this.globalNavItems[i];
        }

        AC.addEvent(this.globalNavItems[i], 'mousedown', function(evt) {
            var target = (evt.target) ? evt.target : evt.srcElement;
            target = self.getPreviousNavItem(target);
            if (target && target !== self.currentTab) target.className += ' before';
        });
        AC.addEvent(this.globalNavItems[i], 'mouseout', function(evt) {
            var target = (evt.target) ? evt.target : evt.srcElement;
            target = self.getPreviousNavItem(target);
            if (target && target !== self.currentTab) AC.removeClassName(target, 'before');
        });
    }


    if (this.currentTab) {
        this.currentTab = this.getPreviousNavItem(this.currentTab);
        this.currentTab.className += ' before';
    }
}

// === AC.GlobalNav.loaded ===
// Add the loaded className to the globalheader.
AC.GlobalNav.prototype.loaded = function(force) {
    var self = this;

    // cancel the previous timeout if there was one
    if (this.loadedTimeout) {
        window.clearTimeout(this.loadedTimeout);
    }

    // if we haven't loaded after 1/2 second, let's just call it good
    if (!this.cancelLoadedTimeout) {
        this.cancelLoadedTimeout = window.setTimeout(function() { self.loaded(true); }, 500);
    }

    // create the div to check if we're loaded
    if (!this.testEnhancedLoaded) {
        this.testEnhancedLoaded = document.createElement('div');
        this.testEnhancedLoaded.id = 'globalheader-loaded-test';
        document.body.appendChild(this.testEnhancedLoaded);
    }

    // if we're canceling, or the div is the right size
    if (force || this.testEnhancedLoaded.offsetWidth == 0) {
        // go ahead and add the className
        this.globalHeader.className += ' globalheader-loaded';
    } else {
        // otherwise, wait a beat and check again
        this.loadedTimeout = window.setTimeout(function() { self.loaded(); }, 10);
    }
}



// = Search Shortcuts =
// 
// You can disable shortcuts at the page level by setting the variable:
// {{{var deactivateSearchShortcuts = true;}}}
//
// * TODO fix timeout character thingy
// * TODO - nice to have - actually truncate based on width of characters and words
var SearchShortcut = function(searchForm, searchInput) {
    this.searchWrapper = document.getElementById('globalsearch');
    this.searchForm = searchForm;
    this.resultsPanel = document.getElementById('sp-results');
    this.searchInput = searchInput;
    this.addSection();

    var mobile = (/applewebkit/i.test(navigator.userAgent) && /mobile/i.test(navigator.userAgent)) || /webos/i.test(navigator.userAgent) || /android/i.test(navigator.userAgent) || /blackberry/i.test(navigator.userAgent) || /windows ce/i.test(navigator.userAgent) || /opera mini/i.test(navigator.userAgent);
    if (mobile || (typeof(deactivateSearchShortcuts) !== 'undefined' && deactivateSearchShortcuts)) {
       // Fix for <exp2://Ticket/11387474> AI search suggestions are not working on iOS devices
        //return;
    }

    if (this.shouldVML()) this.resultsPanel.className += ' sp-results-vml';
    this.addSpinner();


    // path to the php to run against
    // this.baseUrl = 'http://www.apple.com/global/nav/scripts/shortcuts.php';
    
    // Check the incoming request is https or http and based on that make
    // a suggested search request. This will be replaced by the akamaiUrl
    // if it is set by the application
    if (document.location.protocol === 'https:') {
    	this.baseUrl = "https://km.support.apple.com.edgekey.net";
    } else {
		this.baseUrl = "http://km.support.apple.com";
    }
    
    this.baseUrl = typeof(akamaiUrl) == "undefined" ? this.baseUrl: akamaiUrl;	// DGAN - changed baseUrl to point to iKnow suggest service
    this.modelValue = typeof(modelValue) == "undefined" ? "Support" : modelValue; // Setting default value for Apple Instant model
	this.callback = "SearchShortcut.loadJson";	// DGAN - added callback to our own results loader function

	// required number of characters to run a search
    this.minimumCharactersForSearch = 0;
    // how many miliseconds after a key press to wait to search
    this.entryDelay = 150;

    // set up some options
    this.currentRequest = false;

    this.quickLinks = SearchShortcut.geoMap['US'].quickLinks;

    this.suggestionsText = SearchShortcut.geoMap['US'].suggestions;	// DGAN - category text for suggestions

    this.noResults = SearchShortcut.geoMap['US'].noResults;
    if (typeof(searchCountry) != 'undefined' && searchCountry) {
        this.quickLinks = SearchShortcut.geoMap[searchCountry.toUpperCase()].quickLinks || this.quickLinks;
        this.noResults = SearchShortcut.geoMap[searchCountry.toUpperCase()].noResults || this.noResults;

        this.suggestionsText = SearchShortcut.geoMap[searchCountry.toUpperCase()].suggestions || this.suggestionsText;	// DGAN - category text for suggestions

    }

    var self = this;
    AC.addEvent(this.searchForm, 'submit', function(evt) {
        try {
            evt.preventDefault();
            evt.stopPropagation();
        } catch(e) {}
        return false;
    });
    AC.addEvent(document, 'mousemove', function(evt) {
        if (!self.resultsShowing) return; // quit as quick as possible
        self.onMouseMove(evt);
    });
    AC.addEvent(this.searchInput, 'keydown', function(evt) {
        self.onKeyDown(evt);
    });
    AC.addEvent(this.searchInput, 'keyup', function(evt) {
        self.onKeyUp(evt);
    });
    AC.addEvent(this.searchInput, 'blur', function(evt) {
        self.onBlur(evt);
    });
}


// == SearchShortcut.shouldVML ==
SearchShortcut.prototype.shouldVML = function() {
    return (!AC.Detector.isCSSAvailable('border-radius') && document.namespaces);
};


// == SearchShortcut.addSpinner ==
SearchShortcut.prototype.addSpinner = function() {
    this.spinner = document.createElement('div');
    this.spinner.className = 'spinner hide';
    this.searchInput.parentNode.appendChild(this.spinner);
};
// == SearchShortcut.hideSpinner ==
SearchShortcut.prototype.hideSpinner = function() {
    this.spinner.className += ' hide';
}
// == SearchShortcut.showSpinner ==
SearchShortcut.prototype.showSpinner = function() {
    AC.removeClassName(this.spinner, 'hide');
}


// == SearchShortcut.addSection ==
// Adds the {{{search-section}}} input with the global {{{searchSection}}} variable.
SearchShortcut.prototype.addSection = function() {
    var searchSection = document.getElementById('search-section');
    if (!searchSection) {
        // <input type='hidden' value='utf-8' name='sec' id='search-section'>
        searchSection = document.createElement('input');
        searchSection.id = 'search-section';
        searchSection.type = 'hidden';
        searchSection.name = 'sec';
        searchSection.value = window.searchSection;
        this.searchForm.appendChild(searchSection);
    } else if (searchSection) {
        searchSection.value = window.searchSection;
    }
};


// == SearchShortcut.onKeyDown ==
SearchShortcut.prototype.onKeyDown = function(evt) {
    var keyCode = typeof(event) != 'undefined' ? event['keyCode'] : evt.keyCode;
    if (!evt) evt = event;

    // ENTER, without option key: if they're holding option
    // they're probably translating text e.g. romanji to katakana
    if (keyCode == 13 && !evt.altKey) {

		// Fix added to support IE 6 & 7
		var target = evt.target || evt.srcElement;
        if (target.value.length === 0) {
            return false;
        }

        if (this.selected) {
            this.go(this.selected.data.url);

        // if we can't find one, hide results and submit the form
        } else {
            this.hideResults();
            this.searchForm.submit();
        }
    } else if (keyCode == 9) { // TAB
        this.hideResults();
    }
};

// == SearchShortcut.onKeyUp ==
SearchShortcut.prototype.onKeyUp = function(evt) {
    // special key listeners
    var keyCode = typeof(event) != 'undefined' ? event['keyCode'] : evt.keyCode;
    if (!evt) evt = event;

    if (keyCode == 40 && this.results) { // DOWN
        try {
            evt.preventDefault();
            evt.stopPropagation();
        } catch(e) {}

        if (this.selected && this.results[this.selected.index+1]) {
            this.selected.deselect();
            this.selected = this.results[this.selected.index+1].select();
        } else if (!this.selected && this.results[0]) {
            this.selected = this.results[0].select();
        }
    } else if (keyCode == 38 && this.results) { // UP
        // there is a bug / feature when we listen on key up
        // where the cursor in the text box goes back to the start
        // of the box, the only way to prevent it is to capture the key down
        // but that messes with everything else, still working on a graceful fix.
        try {
            evt.preventDefault();
            evt.stopPropagation();
        } catch(e) {}

        if (this.selected && this.selected.index > 0) {
            this.selected.deselect();
            this.selected = this.results[this.selected.index-1].select();
        }
    } else if (keyCode == 27) { // ESCAPE
        this.hideResults();
    } else {
        // TODO should the right and left keys disselect the items?
        this.selected = false;

        var searchText = this.searchInput.value;
        searchText = searchText.replace(/[%\^\?\!\*\/<>\$]/ig, '').replace(/^\s+/g, '').replace(/\s+$/g, ''); // remove potentially dangerous character and trim white space before and after

        if (searchText.length > this.minimumCharactersForSearch) {
            this.searchText = searchText;
            this.startKeystrokeTimer();
        } else {
            this.hideSpinner();
            this.hideResults();
        }
    }
};

// == SearchShortcut.onMouseMove ==
SearchShortcut.prototype.onMouseMove = function(evt) {
    evt = evt || window.event;
    this.mouseEventTarget = (evt.target) ? evt.target : evt.srcElement;

    // hide the results on mouse out if you were hovering over them when we first tried to hide them
    if (this.shouldHideOnMouseOut) {
        if (!this.isOverResults()) {
            this.hideResults(evt);
        }
    }
};

// == SearchShortcut.isOverResults ==
SearchShortcut.prototype.isOverResults = function(evt) {
    if (!this.mouseEventTarget) return false;
    while ((this.mouseEventTarget.id !== 'sp-results') && this.mouseEventTarget.parentNode) this.mouseEventTarget = this.mouseEventTarget.parentNode;
    return (this.mouseEventTarget.id === 'sp-results');
};

// == SearchShortcut.onBlur ==
SearchShortcut.prototype.onBlur = function(evt) {
    if (this.isOverResults()) {
        this.shouldHideOnMouseOut = true;
    }

    if (!this.selected && !this.isOverResults()) {
        this.hideResults(evt);
    }
};

// == SearchShortcut.startKeystrokeTimer ==
SearchShortcut.prototype.startKeystrokeTimer = function() {
    if (this.timeoutId) window.clearTimeout(this.timeoutId);

    var self = this;
    this.timeoutId = window.setTimeout(function () {
        self.commitKeystroke();
    }, this.entryDelay);
};

// == SearchShortcut.commitKeystroke ==
SearchShortcut.prototype.commitKeystroke = function() {
    this.search(this.searchText);
};

// == SearchShortcut.search ==
SearchShortcut.prototype.search = function(term) {
    var formElements = this.searchForm.elements,
        i, iElement,
        action = this.searchForm.getAttribute('action');

    this._formValues = [];
    // add form element's values:
    for (i=formElements.length-1; i>=0; i--) {
        var iElement = formElements[i];
        // we don't want to factor in the search term here
        if (iElement.name !== 'q' && action.indexOf(iElement.name) === -1) {
            this._formValues.push(iElement.name+'='+iElement.value);
            this._formValues[iElement.name] = iElement.name;
        }
    }

    // allow the fullSearchUrl to be overridden during init
    if (this._formValues.length > 0) {
        this.fullSearchUrl = action+ ((action.lastIndexOf('?') !== -1) ? '&' : '?')+this._formValues.join('&'); 
    } else {
        this.fullSearchUrl = action;
    }

    //var url = this.baseUrl + '?q=' + encodeURIComponent(term);
    var url = this.baseUrl + '/kb/index?page=suggest&q=' + encodeURIComponent(term) + '&locale=' + searchLocale + '&callback=' + this.callback; // DGAN - create query to iKnow suggest service

    this.showSpinner();

    var head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.id = 'xdShortcutContainer';
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
    // SearchShortcut.scriptLoadTest();
};

// == DGAN - Added our own quicklinks loader
SearchShortcut.prototype.loadQuicklinks = function(json) {
	// Removed with dynamic quick links
};

// == SearchShortcut.loadXmlToDoc ==
SearchShortcut.prototype.loadXmlToDoc = function(text) {
    var xmlDoc;

    if (window.ActiveXObject) {
        xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
        xmlDoc.async = 'false';
        xmlDoc.loadXML(text);
    } else {
        var dp = new DOMParser();
        xmlDoc = dp.parseFromString(text, 'text/xml');
    }

    this.hideSpinner();

    this.term = xmlDoc.getElementsByTagName('term')[0].firstChild.nodeValue;
    this.xml = xmlDoc.getElementsByTagName('search_results')[0];
    this.parseResults(this.xml);

    if (this.results) {
        this.renderResults();
    }
};

// == DGAN - Added our own json loader ==
SearchShortcut.prototype.loadJson = function(json) {

    this.hideSpinner();
	this.term = this.searchText;


	// Ajax call to Apple Instant
	// if (locale is english//
	if(enableAppleInstant == "yes"){ 
		this.quicklinksResults = json;
		this.aiSuggest = this.getAISuggest(this.term);
	}
	//
	else{
		this.parseJsonResults(json, this.aiSuggest);
		if (this.results) {
			this.renderResults();
		}
	}
};

SearchShortcut.prototype.getAISuggest = function(searchTerm) {  
	var queryParameters = {};
	queryParameters['queryVal'] = encodeURIComponent(searchTerm);
	queryParameters['model'] = this.modelValue;
	queryParameters['locale'] = searchLocale;
	queryParameters['callback'] = "SearchShortcut.loadAIResults";
	var aiSuggestions;
	var url = this.generateGetUrl("aisuggestions", queryParameters);
	var head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.id = 'xdShortcutContainerAI';
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
    return aiSuggestions;
};

SearchShortcut.prototype.generateGetUrl	=	function(page, queryParameters) {
	var url = "";
	aiCrossDomainSearchServiceURL = typeof(aiCrossDomainSearchServiceURL) == "undefined" ? "support.apple.com": aiCrossDomainSearchServiceURL;
    if(document.location.protocol === 'https:'){
             url = 'https://'+ aiCrossDomainSearchServiceURL;
    }else{
             url = 'http://' + aiCrossDomainSearchServiceURL;
    }
	var returnUrl = url + "/kb/index?page=" + page;
	for(var query in queryParameters) {
		var value = typeof queryParameters[query] == 'boolean' ? "y" : queryParameters[query];
		returnUrl += "&" + query + "=" + value;
	}
	return returnUrl;
};

SearchShortcut.prototype.loadAIResults = function(json){  
	this.parseJsonResults(this.quicklinksResults, json);
	var store = new Persist.Store('FeedStats');
	store.set('lastSuggestedSearch', JSON.stringify(json)); 
	store.set('hasSuggestedSuggestion', true); 
	if (this.results) {  
		this.renderResults();
	}
};

// == SearchShortcut.parseResults ==
SearchShortcut.prototype.parseResults = function(xml) {
    // Check for ERROR code in XML, bail if we find it
    var error = xml.getElementsByTagName('error');
    if (error.length > 0) {
        this.hideResults();
        return;
    } else {
        var xmlResults = xml.getElementsByTagName('match');

        // Results are stored as an array of objects inside this.results
        this.results = new Array();
        for (var i=0; i<xmlResults.length; i++) {
            var result = xmlResults[i];
            var resultItem = {
                title: result.getAttribute('title'),
                url: result.getAttribute('url'),
                desc: result.getAttribute('copy'),
                category: result.getAttribute('category'),
                priority: result.getAttribute('priority'),
                image: result.getAttribute('image')
            };
            resultItem.url = decodeURIComponent(resultItem.url);
            this.results.push(resultItem);	
        }
    }
};


// == DGAN - Added our own results parser ==
SearchShortcut.prototype.parseJsonResults = function(json, aijson) {
	var error = ""; // get error from json here
	var pos = -1;
	if (error.length > 0) {
        this.hideResults();
        return;
	} else {
		// if not english, use iknow suggested search
        this.results = new Array();
        if(enableAppleInstant == "no"){ 
        for(var rowName in json) {
        	if(rowName == "SUGGESTED_SEARCH"){
        		for(var row in json.SUGGESTED_SEARCH){
        			try {
        				pos = parseInt(row) + 1;
        			} catch (Exception) {
        				
        			}
        			var b = {
                        title: json.SUGGESTED_SEARCH[row].SUGGESTIONS,
                        url: json.SUGGESTED_SEARCH[row].LINK != null && json.SUGGESTED_SEARCH[row].LINK != "" ? json.SUGGESTED_SEARCH[row].LINK : this.fullSearchUrl + "&src=search_suggested"+"&q=" + encodeURIComponent(json.SUGGESTED_SEARCH[row].SUGGESTIONS),
						desc: "",
						categoryText: this.suggestionsText,
						category: "Suggestions",
						priority: json.SUGGESTED_SEARCH[row].PRIORITY
					}
        			this.results.push(b);
        		}
		}else{
			for(var rowquick in json.QUICK_LINKS){
				try {
					pos = parseInt(rowquick) + 1;
				}catch (Exception) {
					
				}
				var iconLink = this.baseUrl+"/"+json.QUICK_LINKS[rowquick].ICON_LINK;
				var b = {
					title: json.QUICK_LINKS[rowquick].SUGGESTIONS,
					url: json.QUICK_LINKS[rowquick].LINK,
					desc: json.QUICK_LINKS[rowquick].SHORT_DESCRIPTION,
					categoryText: SearchShortcut.geoMap[searchCountry.toUpperCase()].quickLinks || SearchShortcut.geoMap['US'].quickLinks,
					category: "Quick Links",
					priority: json.QUICK_LINKS[rowquick].PRIORITY,
					image: iconLink
					//image: json.QUICK_LINKS[rowquick].ICON_LINK
				}
				this.results.push(b);
			}
		}
     }
    }else{   

		if (typeof aijson !== 'undefined'){
			var count = 0;
			while (aijson[count] != null) { 
				var b ={
					title: aijson[count],
					url: this.fullSearchUrl + "&src=search_suggested"+"&q=" + encodeURIComponent(aijson[count]),
					desc: "",
					categoryText: this.suggestionsText,
					category: "Suggestions",
					priority: count
				}
				this.results.push(b);
				count++;
			}
		}
		for(var rowquick in json.QUICK_LINKS){
			try {
				pos = parseInt(rowquick) + 1;
			}catch (Exception) {
				
			}  
			var iconLink = this.baseUrl+"/"+json.QUICK_LINKS[rowquick].ICON_LINK;
			var b = {
				title: json.QUICK_LINKS[rowquick].SUGGESTIONS,
				url: json.QUICK_LINKS[rowquick].LINK,
				desc: json.QUICK_LINKS[rowquick].SHORT_DESCRIPTION,
				categoryText: SearchShortcut.geoMap[searchCountry.toUpperCase()].quickLinks || SearchShortcut.geoMap['US'].quickLinks,
				category: "Quick Links",
				priority: json.QUICK_LINKS[rowquick].PRIORITY,
				image: iconLink
				//image: json.QUICK_LINKS[rowquick].ICON_LINK
			}
			this.results.push(b);
     	}
     	
     }
   }
};



// == SearchShortcut.renderResults ==
SearchShortcut.prototype.renderResults = function() {
    this.resultsShowing = true;
    this.resultsPanel.innerHTML = ''; // clear out the current results
	// Hide the results dialog if no results were returned from service
	if(this.results.length == 0){
		this.hideResults();
        return;
	}
    var frag = document.createDocumentFragment(),
        shadow = document.createElement('div'),
        wrapper = document.createElement('div'),
        header = document.createElement('h3'),
        list = document.createElement('ul'),
        length = this.results.length;

    shadow.className = 'sp-shadow';
    frag.appendChild(shadow);

    if (this.shouldVML()) {
        document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');

        roundrect             = document.createElement('v:roundrect');
        roundrect.id          = 'sp-roundrect';
        roundrect.strokeColor = '#fff';
        roundrect.fillColor   = '#fff';
        roundrect.arcSize     = '.01';
        roundrect.appendChild(wrapper);
        frag.appendChild(roundrect);
    } else {
        frag.appendChild(wrapper);
    }

    if (length === 0) {
        this.results[0] = {
            title: this.noResults,
            url: this.fullSearchUrl + '?q=' + encodeURIComponent(this.term)
        }
        list.className = 'noresults';
    } else {
        if (this.results[0].category != "Quick Links") {	// DGAN - make sure there are suggestions, i.e. first result is not a quicklink
			list.className = 'suggestions';					// DGAN - added a class to style the first section
			header.innerHTML = this.suggestionsText;		// DGAN - first header changed to suggest instead of quicklinks
			wrapper.appendChild(header);
		}
    }

    var length = this.results.length;
	var categoryFlag = true;			// DGAN - used to inject the 2nd header
    for (var i=0; i<length; i++) {

		// DGAN - removed limit of 5 items in original code

			// DGAN - added code to insert h3 before the first quick links item
			if (categoryFlag) {
				if (this.results[i].category == "Quick Links") {
					
				    var header2 = document.createElement('h3');
					header2.innerHTML = this.quickLinks;
				    list.appendChild(header2);
					
					categoryFlag = false;
				}
			}
			// DGAN - end

        this.results[i] = new SearchShortcut.result(i, this.results[i]);
        var attribute = document.createAttribute('position');
		attribute.nodeValue = i;
		this.results[i].element.setAttributeNode(attribute);
        list.appendChild(this.results[i].element);
		AC.addEvent(this.results[i].element, 'mousedown', function(evt) {
			//console.log(evt.target.parentNode.parentNode);
			SearchShortcut.prototype.onMouseDown(evt);
	    });
    }

    wrapper.appendChild(list);

    this.resultsPanel.appendChild(frag);
    if (this.shouldVML()) {
        shadow.style.height = wrapper.offsetHeight+'px';
        shadow.style.display = 'block';
    }

    // apply rich media fixes
    this.hideAllQuicktimeMovies();
};

// == SearchShortcut.onMouseDown of list item ==
SearchShortcut.prototype.onMouseDown = function(evt) {
	try {
		// Mouse click tracking code should be merged with keydown event tracking code.
		
		var target = evt.target || evt.srcElement; // Fix added to support IE 6 & 7
		var position = target.parentNode.parentNode.getAttribute("position");
		if(position != null) {
			var location  = target.parentNode;
			
			try{
				if (!(typeof(s_gi) == 'undefined' || !s_gi)) {
					var globalSuite = 'appleglobal';
				    var searchSuite = 'appleussearch';
				    var countryCode = null;
				    if (typeof(searchCountry) != 'undefined' && searchCountry && searchCountry != 'US') {
				        countryCode = SearchShortcut.geoMap[searchCountry.toUpperCase()].code;
				    }

				    if (countryCode) {
				        globalSuite = 'apple' + countryCode + 'global';
				        searchSuite = 'apple' + countryCode + 'search';
				    }

				    if (typeof(s_account) != 'undefined' && s_account.indexOf('appleussearch') == -1) {
				        s = s_gi(s_account + ',' + searchSuite);
				    } else {
				        s = s_gi(globalSuite + ',' + searchSuite);
				    }

					s.prop7 = "acs::quicklink:: query::"+document.getElementById('sp-searchtext').value.replace(/&amp;/g, "&");

					var resultPageType = "supportpage"; 
			    	
			    	
					if(location.getAttribute('href').indexOf("support.apple.com/kb/") != -1){
						resultPageType = "kbase";
					}else if(location.getAttribute('href').indexOf("apple.com/support") != -1){
						resultPageType = "supportpage";
					}else if(location.getAttribute('href').indexOf("discussions.apple.com") != -1){
						resultPageType = "discussions";
					}else if(location.getAttribute('href').indexOf("selfsolve.apple.com") != -1){
						resultPageType = "selfsolve tool";
					}else if(location.getAttribute('href').indexOf("reportaproblem.apple.com") != -1){
						resultPageType = "report a problem";
					}
					
			    	s.eVar1 = "acs::search result::quicklinks::"+ resultPageType;

				}
				}catch(e){}
				
			document.location = location;
	    	var pos = -1; // position of selected suggestion.
	    	var pageName = "acs::kb::search results (" + searchLocale.toLowerCase() + ")";
	    	var classname = target.parentNode.parentNode.className;
	    	var title = target.innerHTML;
	    	
	    	if(classname.indexOf("suggestions") != -1) {
	    		pos = parseInt(position) + 1;
	    		pageName += "::suggested";
	    	} else {
	    		pageName += "::quicklinks";
	    	}
	    	if(typeof console != 'undefined') console.log(title + "+" + pageName + "+" + pos);
	    	this.track(title, pageName, pos);
	    }
     } catch(e) {}
};

// == SearchShortcut.hideResults ==
SearchShortcut.prototype.hideResults = function(keepTerm, pause) {
    // return;  // makes the results stick around for testing purposes

    this.selected = false; // unselect any result items
    this.shouldHideOnMouseOut = false;

    this.resultsPanel.innerHTML = ''; // Shrink it up
    this.showAllQuicktimeMovies(); // start QT back up
    this.resultsShowing = false;
};

// == SearchShortcut.track ==
// Omniture tracking.
SearchShortcut.prototype.track = function(title, pageName, pos) {
    if (typeof(s_gi) == 'undefined' || !s_gi) {
        return;
    }

    var globalSuite = 'appleglobal';
    var searchSuite = 'appleussearch';

    var countryCode = null;
    if (typeof(searchCountry) != 'undefined' && searchCountry && searchCountry != 'US') {
        countryCode = SearchShortcut.geoMap[searchCountry.toUpperCase()].code;
    }

    if (countryCode) {
        globalSuite = 'apple' + countryCode + 'global';
        searchSuite = 'apple' + countryCode + 'search';
    }

    if (typeof(s_account) != 'undefined' && s_account.indexOf('appleussearch') == -1) {
        s = s_gi(s_account + ',' + searchSuite);
    } else {
        s = s_gi(globalSuite + ',' + searchSuite);
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
};

// == SearchShortcut.go ==
// Submit the search for full site search.
SearchShortcut.prototype.go = function(location) {
    if(typeof console != 'undefined' && !this.selected) { 
		console.log("Not Selected");
	}
	if (this.selected && (this.results.length > this.selected.index + 1)) {
    	var pos = -1;
    	var pageName = "acs::kb::search results (" + searchLocale.toLowerCase() + ")";
    	if(this.selected.data.category == "Suggestions") {
    		pos = this.selected.index + 1;
    		pageName += "::suggested";
    	} else if (this.selected.data.category == "Quick Links") {
    		pageName += "::quicklinks";
    	}
    	if(typeof console != 'undefined') console.log(this.selected.data.title + "+" + pageName + "+" + pos);
    	this.track(this.selected.data.title, pageName, pos);
    }
	document.location = location;
};

// == SearchShortcut.shouldHideQuicktimeMovies ==
// Determines wheather the current browser needs to hide QT plugin movies;
// when in doubt, hide the movie.
SearchShortcut.prototype.shouldHideQuicktimeMovies = function() {
    var agent = navigator.userAgent,

        opera = /opera/i.test(agent),
        ie = (/msie/i.test(agent) && !opera),
        firefox = /firefox/i.test(agent),
        chrome = /chrome/i.test(agent),
        safari = (/applewebkit/i.test(agent) && !chrome);

        win = /windows/i.test(agent),
        mac = /mac/i.test(agent);

    if (mac && (safari || chrome)) return false;
    if (win && (ie || safari || chrome)) return false;
    return true;
}

// == SearchShortcut.hideAllQuicktimeMovies ==
// Hides QuickTime Objects that are below the shortcut menu.
// TODO selecting only affected movies by screen position
SearchShortcut.prototype.hideAllQuicktimeMovies = function() {
    if (this.shouldHideQuicktimeMovies()) {
        if (typeof(AC) != 'undefined' && typeof(AC.Quicktime) != 'undefined' && typeof(AC.Quicktime.controllers) != 'undefined') {

            // thx qm
            function findPos(obj) {
                var curleft = curtop = 0;
                if (obj.offsetParent) {
                    curleft = obj.offsetLeft
                    curtop = obj.offsetTop
                    while (obj = obj.offsetParent) {
                        curleft += obj.offsetLeft
                        curtop += obj.offsetTop
                    }
                }
                return [curleft,curtop];
            }

            function intersect(xUpLeftA,yUpLeftA,wA,hA, xUpLeftB,yUpLeftB,wB,hB) {

                var xLowRightA = xUpLeftA + wA;
                var yLowRightA = yUpLeftA + hA;

                var xLowRightB = xUpLeftB + wB;
                var yLowRightB = yUpLeftB + hB;

                var left = Math.max(xUpLeftA, xUpLeftB)
                var top = Math.max(yUpLeftA, yUpLeftB)
                var right = Math.min(xLowRightA, xLowRightB)
                var bottom = Math.min(yLowRightA, yLowRightB)

                return right > left && bottom > top;
            }

            var controllers = AC.Quicktime.controllers;

            var dropDimensions = { width: 328, height: 448 }; // TODO not hardcode this
            var dropPosition = findPos(this.resultsPanel);

            var dropX = dropPosition[0] - 328; // when finding the position it's not dispalyed so not in the right spot
            var dropY = dropPosition[1];

            var dropRightX = x + dropDimensions.width;
            var dropRightY = y + dropDimensions.height;

            for (var i=controllers.length-1; i>=0; i--) {
                var movie = controllers[i].movie;
                var movieDimensions = Element.getDimensions(movie);
                var position = findPos(movie);

                var x = position[0];
                var y = position[1];

                if (intersect(
                    x ,y, movieDimensions.width, movieDimensions.height,
                    dropX, dropY, dropDimensions.width, dropDimensions.height)) {

                        this.pausedControllers.push(controllers[i]);

                        controllers[i].Stop();
                        controllers[i].movie.style.visibility = 'hidden';
                }
            }

        } else { // no ac.quicktime, retro-rockit
            this.qtm = document.getElementsByTagName('object');
            for (var i=0; i<this.qtm.length; i++) {
                if (typeof(this.qtm[i].Stop) != 'undefined') this.qtm[i].Stop();
                try { // ie dies on this
                    if (typeof(this.qtm[i].getElementsByTagName('embed')[0].Stop) != 'undefined') this.qtm[i].getElementsByTagName('embed')[0].Stop();
                } catch(e) {}
                this.qtm[i].style.visibility = 'hidden';
            }
        }
    }
};

// == SearchShortcut.showAllQuicktimeMovies ==
// Shows all QuickTime Objects that are below the shortcut menu.
SearchShortcut.prototype.showAllQuicktimeMovies = function() {
    if (typeof(AC) != 'undefined' && 
        typeof(AC.Quicktime) != 'undefined' && 
        typeof(AC.Quicktime.controllers) != 'undefined') {

        for (var i=this.pausedControllers.length-1; i>=0; i--) {
            this.pausedControllers[i].movie.style.visibility = 'visible';

            // FF needs some time to breathe before plugin interaction
            if (navigator.userAgent.match(/Firefox/i)) {
                this.pausedControllers[i].movie.style.zIndex = '100'; // bump to paint repaint
                setTimeout(this.pausedControllers[i].Play.bind(this.pausedControllers[i]), 100);
            } else {
                this.pausedControllers[i].Play();
            }

        }

        this.pausedControllers = [];

    // no ac.quicktime, retro-rockit
    } else if (this.qtm) {
        for (var i=0; i<this.qtm.length; i++) {
            this.qtm[i].style.visibility = 'visible';
            if (typeof(this.qtm[i].Play) != 'undefined') this.qtm[i].Play();
            try { // ie dies on this
                if (typeof(this.qtm[i].getElementsByTagName('embed')[0].Play) != 'undefined') this.qtm[i].getElementsByTagName('embed')[0].Play();
            } catch(e) {}
        }
    }
};

// == {{{SearchShortcut.result}}} ==
// A shortcut result object.
SearchShortcut.descriptionCharacters = 80;
SearchShortcut.titleCharacters = 44;
SearchShortcut.titleCharactersForQuickLinks = 34;
SearchShortcut.result = function(index, data) {
    this.index = index;
    this.data = data;

    this.data.truncated = {};
    
    if (this.data.desc) {
    	this.data.truncated.desc = unescape(this.data.desc);
    	// As double byte characters like japanese, occupy more pixels it is truncated to 56 characters,
        // otherwise it is truncated to 80 characters
    	if( searchLocale == "ja_JP" && this.data.truncated.desc.length > 56) {
            	this.data.truncated.desc = this.data.truncated.desc.substring(0, 56) + "&hellip;";
        }else if (this.data.truncated.desc.length > SearchShortcut.descriptionCharacters) {
        	this.data.truncated.desc = this.data.truncated.desc.substring(0, this.data.truncated.desc.lastIndexOf(' ', SearchShortcut.descriptionCharacters)) + '&hellip;';
       	}
     }

  	if (this.data.title) {
    	this.data.truncated.title = unescape(this.data.title);
		if(this.data.category== "Quick Links"){
        	// As double byte characters like japanese, occupy more pixels it is truncated to 24 characters,
        	// otherwise it is truncated to 44 characters
        	if( searchLocale == "ja_JP" && this.data.truncated.title.length > 24) {
            	this.data.truncated.title = this.data.truncated.title.substring(0, 24) + "&hellip;";
        	} else if (this.data.truncated.title.length > SearchShortcut.titleCharactersForQuickLinks) {
            	this.data.truncated.title = this.data.truncated.title.substring(0, this.data.truncated.title.lastIndexOf(' ', SearchShortcut.titleCharactersForQuickLinks)) + '&hellip;';
          	}
        }
        else{
			// As double byte characters like japanese, occupy more pixels it is truncated to 32 characters,
			// otherwise it is truncated to 44 characters
			if( searchLocale == "ja_JP" && this.data.truncated.title.length > 32) {
				this.data.truncated.title = this.data.truncated.title.substring(0, 32) + "&hellip;";
			} else if (this.data.truncated.title.length > SearchShortcut.titleCharacters) {
				this.data.truncated.title = this.data.truncated.title.substring(0, this.data.truncated.title.lastIndexOf(' ', SearchShortcut.titleCharacters)) + '&hellip;';
			}
        }
	}

   this.render();
};
// === {{{SearchShortcut.result.render}}} ===
SearchShortcut.result.prototype.render = function() {
    var frag, item, link, img, header, description;
    frag = document.createDocumentFragment();

    item = document.createElement('li');

	// DGAN - add class to list item so we can style differently
	item.className = "category-" + unescape(this.data.category).toLowerCase().replace(/\s+/g, "-");


    frag.appendChild(item);

    if (this.data.url) {
        link = document.createElement('a');
        //link.href = decodeURIComponent(this.data.url);
        link.href = this.data.url;
        if(this.data.category == "Quick Links" && this.data.desc) {
        	link.title=this.data.desc;
        } else {
        	link.title=this.data.title;
        }
        item.appendChild(link);
    }

    if (this.data.image) {
        img = new Image();
        img.src = this.data.image;
        img.alt = this.data.title;
        link.appendChild(img);

        if (/MSIE (5\.5|6\.)/.test(navigator.userAgent)) {
            img.src = '/global/elements/blank.gif';
            img.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="'+this.data.image+'",sizingMethod="scale")';
        }
    }

    if (this.data.truncated.title) {
        header = document.createElement('h4');
        header.innerHTML = this.data.truncated.title;
        link.appendChild(header);
    }

    if (this.data.truncated.desc) {
        description = document.createElement('p');
        description.innerHTML = this.data.truncated.desc;
        link.appendChild(description);
    }

    this.element = item;
}
// === {{{SearchShortcut.result.select}}} ===
SearchShortcut.result.prototype.select = function() {
    this.element.className += ' focus';
    return this;
}
// === {{{SearchShortcut.result.deselect}}} ===
SearchShortcut.result.prototype.deselect = function() {
    AC.removeClassName(this.element, 'focus');
    return this;
}


// == {{{SearchShortcut.geoMap}}} ==
// All the localizable strings for the search shortcuts.
SearchShortcut.geoMap = {
    US: {
        code: '',
        noResults: 'No shortcut found. Search all of apple.com.',
        viewAll: 'View all search results',
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - added localizable string for suggested searches
        searchText: 'Search'
    },
    ASIA: {
        code: 'asia',						// DGAN - don't forget the comma here
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        searchText: "Search"
    },
    AT: {
        code: 'at',
        viewAll: 'Alle Suchergebnisse',
        quickLinks: "Alles auf einen Klick",
        suggestions: "Vorgeschlagene Suchabfragen",
        searchText: 'Suchen'
    },
    AU: {
        code: 'au',							// DGAN - add
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',
        searchText: 'Search'
    },
    BE_FR: {
        code: 'bf',
        viewAll: 'Afficher tous les résultats',
        noResults: 'Pas de résultat. Essayez une recherche apple.com',
        quickLinks: "Raccourcis",
        suggestions: "Suggestions de recherche",
        searchText: 'Rechercher'
    },
    BE_NL: {
        code: 'bl',
        viewAll: 'Toon alle zoekresultaten',
        noResults: 'Niets gevonden. Zoek opnieuw binnen www.apple.com.',
        searchText: 'Zoek'
    },
    BR: {
        code: 'br',
        noResults: 'Não encontrado. Tente a busca em apple.com',
        viewAll: 'Ver todos os resultados da busca',
        searchText: 'Buscar'
    },
    CA_EN: {
        code: 'ca',
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        directory: '/ca',
        searchText: 'Search'
    },
    CA_FR: {
        code:'ca',
        directory: '/ca/fr',
        viewAll: 'Afficher tous les résultats',
        quickLinks: "Raccourcis",
        suggestions: "Suggestions de recherche",
        searchText: 'Recherche'
    },
    CH_DE: {
        code: 'ce',
        viewAll: 'Alle Suchergebnisse',
        noResults: 'Kein Treffer in Kurzsuche. Vollsuche auf apple.com',
        quickLinks: "Alles auf einen Klick",
        suggestions: "Vorgeschlagene Suchabfragen",
        searchText: 'Suchen'
    },
    CH_FR: {
        code: 'cr',
        viewAll: 'Afficher tous les résultats',
        noResults: 'Pas de résultat. Essayez une recherche apple.com',
        quickLinks: "Raccourcis",
        suggestions: "Suggestions de recherche",
        searchText: 'Rechercher'
    },
    CN: {
        code:'cn',
        directory:'/cn',
        noResults:'找不到快速搜索结果，请尝试 apple.com/cn 的完整搜索',
        viewAll:'查看所有搜索结果',
        searchText:'搜索',
        quickLinks: '快速链接',
        suggestions: '建议搜索'
    },
    DE: {
        code: 'de',
        viewAll: 'Alle Suchergebnisse',
        noResults: 'Kein Treffer in Kurzsuche. Vollsuche auf apple.com',
        quickLinks: "Alles auf einen Klick",
        suggestions: "Vorgeschlagene Suchabfragen",
        searchText: 'Suchen'
    },
    DK: {
        code: 'dk',
        noResults: 'Ingen genvej fundet. Prøv at søge på hele apple.com.',
        viewAll: 'Vis alle søgeresultater',
        searchText: 'Søg'
    },
    ES: {
        code: 'es',
        viewAll: 'Ver todos los resultados de búsqueda',
        noResults: 'Ningún atajo. Búsqueda completa en apple.com',
        quickLinks: "Enlaces",
        suggestions: "Búsquedas sugeridas",
        searchText: 'Buscar'
    },
    FI: {
        code: 'fi',
        noResults: 'Ei oikotietä. Etsi koko apple.com.',
        viewAll: 'Katso hakutulokset',
        searchText: 'Etsi'
    },
    FR: {
        code: 'fr',
        viewAll: 'Afficher tous les résultats',
        noResults: 'Pas de résultat. Essayez une recherche apple.com',
        quickLinks: "Raccourcis",
        suggestions: "Suggestions de recherche",
        searchText: 'Rechercher'
    },
    HK: {
        code: 'hk',
        noResults: '找不到快速搜尋結果，請試試 apple.com 的完整搜尋',
        viewAll: '檢視所有搜尋結果',
        searchText: '搜尋',
        quickLinks: '快速連結',
        suggestions: '建議的搜尋'
    },
    HK_EN: {
        code: 'hk',
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        directory: '/hk/en',
        searchText: 'Search'
    },
    ID: {
        code: 'id'
    },
    IE: {
        code: 'ie',
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        searchText: 'Search'
    },
    IN: {
        code: 'in'
    },
    IT: {
        code: 'it',
        noResults: 'Nessuna scorciatoia trovata. Provate su apple.com',
        viewAll: 'Mostra tutti i risultati',
        searchText: 'Cerca'
    },
    JP: {
        code: 'jp',
        noResults: 'ショートカットは見つかりませんでした。検索はこちら。',
        viewAll: 'すべての検索結果を見る',
        quickLinks: 'クイックリンク',
        suggestions: '関連検索',	// DGAN - add
        searchText: '検索'
    },
    KR: {
        code: 'kr',
        noResults: '일치하는 검색결과가 없습니다. 다시 검색하기.',
        viewAll: '검색 결과 전체 보기.',
        quickLinks: '빠른 링크',
        suggestions: '추천 검색',	// DGAN - add
        searchText: '검색'
    },
    LA: {
        code: 'la',
        noResults: 'No se encontraron resultados. Intenta en apple.com.',
        viewAll: 'Ver todos los resultados de la búsqueda',
        quickLinks: "Enlaces",
        suggestions: "Búsquedas sugeridas",
        searchText: 'Buscar'
    },
    LAE: {
        code: 'lae',
        noResults: 'No shortcut found. Search all of apple.com.',
        viewAll: 'View all search results',
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        searchText: 'Search'
    },
    MX: {
        code: 'mx',
        noResults: 'No se encontraron resultados. Intenta en apple.com.',
        viewAll: 'Ver todos los resultados de la búsqueda',
        quickLinks: "Enlaces",
        suggestions: "Búsquedas sugeridas",
        searchText: 'Buscar'
    },
    MY: {
        code: 'my'
    },
    NL: {
        code: 'nl',
        viewAll: 'Toon alle zoekresultaten',
        noResults: 'Niets gevonden. Zoek opnieuw binnen www.apple.com.',
        searchText: 'Zoek'
    },
    NO: {
        code: 'no',
        noResults: 'Fant ingen snarvei. Søk på hele apple.com.',
        viewAll: 'Vis alle søkeresultater',
        searchText: 'Søk'
    },
    NZ: {
        code: 'nz',
        quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        searchText: "Search"
    },
    PH: {
        code: 'ph'
    },
    PL: {
        code: 'pl',
        noResults: 'Fraza nie została odnaleziona. Użyj apple.com.',
        viewAll: 'Przeglądaj wszystkie wyniki',
        searchText: 'Szukaj'
    },
    PT: {
        code: 'pt',
        noResults: 'Nenhum resultado. Tente pesquisar em apple.com.',
        viewAll: 'Ver todos os resultados de pesquisa',
        searchText: 'Procurar'
    },
    RU: {
        code: 'ru',
        noResults: 'Ссылок нет. Попробуйте расширенный поиск.',
        viewAll: 'Показать все результаты поиска',
        searchText: 'Поиск'
    },
    SE: {
        code: 'se',
        noResults: 'Ingen genväg hittad. Sök i hela apple.com.',
        viewAll: 'Visa alla sökresultat',
        searchText: 'Sök'
    },
    SG: {
        code: 'sg'
    },
    TH: {
        code: 'th'
    },
    TW: {
        code: 'tw',
        noResults: '快速搜尋找不到，試試 apple.com 完整搜尋',
        viewAll: '瀏覽搜索結果',
        searchText: '搜尋',
        quickLinks: '快速連結',
        suggestions: '建議的搜尋'
    },
    UK: {
        code: 'uk',
		quickLinks: 'Quick Links',
        suggestions: 'Suggested Searches',	// DGAN - add
        searchText: 'Search'
    },
    VN: {
        code: 'vn'
    },
    ZA: {
        code: 'za'
    },    
    AE: {
    	code: 'ae'
    	},
    SA: {
    	code: 'sa'
    	},
    TR: {
        code: 'tr'
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