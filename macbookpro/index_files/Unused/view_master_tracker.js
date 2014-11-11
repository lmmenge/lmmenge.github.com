AC.ViewMaster.Tracker = Class.create();
Object.extend(AC.ViewMaster.Tracker.prototype, Event.Listener);
Object.extend(AC.ViewMaster.Tracker.prototype, {

	count: 0,
	type: '',
	isReplay: false,
	ccTime: 0,
	mediaType: '',
	geoCode: '',
	movieType: '',
	overlay: false,

	_viewWithClassNameTrackedInteraction: [],
	_viewWithClassNameTrackedSectionWithId: {},

	initialize: function (type, options) {
		this.type = type; // 'page' or 'click', defaults to 'page'
		this.options = options || {};
		this.qtEventSource = document.getElementsByTagName('body')[0];

		var pathName = window.location.pathname;
		var hostName = window.location.hostname;
		var href = window.location.href;
		if (href.match(/apple.com\/cn/)) {
			this.geoCode = " (CN)";
		} else if (!pathName.match(/^\/(ws|pr|g5|go|ta|wm)\//)) {
			if (pathName.match(/^\/(\w{2}|befr|benl|chfr|chde|asia|lae)(?=\/)/)) {
				pathName = pathName.split('/');
				this.geoCode = " (" + pathName[1].toUpperCase() + ")";
			}
		}
		if (this.geoCode == '') {
			this.geoCode = " (US)";
		}

		if (typeof (AC.OverlayPanel) != 'undefined') {
			if (typeof (AC.OverlayPanel.overlay) != 'undefined') {
				this.listenForEvent(AC.OverlayPanel.overlay, 'afterPop', false, this.afterPop);
				this.listenForEvent(AC.OverlayPanel.overlay, 'afterClose', false, this.afterClose);
			}
		}
		this.listenForEvent(AC.ViewMaster, 'ViewMasterDidShowNotification', false, this.sectionDidChange);
		this.listenForEvent(document.event, 'replayMovie', false, this.movieDidReplay.bind(this));
		this.listenForEvent(document.event, 'didFinishMovie', false, this.movieDidEnd);
		Event.observe(this.qtEventSource, 'QuickTime:didStartJogging', this.didStartJogging.bind(this));
		Event.observe(this.qtEventSource, 'QuickTime:didStopJogging', this.didStopJogging.bind(this));
		Event.observe(this.qtEventSource, 'QuickTime:begin', this.didBegin.bind(this));
		Event.observe(this.qtEventSource, 'QuickTime:end', this.didEnd.bind(this));
		Event.observe(this.qtEventSource, 'QuickTime:start', this.didStart.bind(this));
		Event.observe(this.qtEventSource, 'QuickTime:stop', this.didStop.bind(this));
		Event.observe(this.qtEventSource, 'QuickTime:noCompatibleQTAvailable', this.noCompatibleQTAvailable);
		Event.observe(this.qtEventSource, 'QuickTime:didSetClosedCaptions', this.didSetClosedCaptions.bind(this));
	},

	setDelegate: function (delegate) {
		this.delegate = delegate;
	},

	pageName: function (section) {
		this._id = '';

		if (section) {
			this._id = this.trackingNameForSection(section);
		} else if (this.viewMaster.currentSection) {
			this._id = this.trackingNameForSection(this.viewMaster.currentSection);
		}

		this._pageName = AC.Tracking.pageName() + ' - ' + this._id;
		if (typeof this._pageName === "string") {
			this._pageName = this._pageName.replace(/[\'\Õ\"]/g, '');
		}

	},

	trackingNameForSection: function (section) {
		var id = section.id.replace('MASKED-', '');

		// complex resetting of the id
		// in a delegate so we can reset it whenever we want
		if (this.delegate && typeof (this.delegate.trackingNameForSection) === 'function') {
			id = this.delegate.trackingNameForSection(this, id, section);
		}

		return id;
	},

	isSnowLeopardControllerAvailable: function () {
		return (typeof (Media) != "undefined");
	},

	didBegin: function (evt) {
		if (this.mediaType != 'audio') {
			if (typeof (this._pageName) != 'undefined') {
				var controller = evt.memo.controller;
				this._pageName = this._pageName.toLowerCase();
				this.movieType = this.isSnowLeopardControllerAvailable() ? controller.movieType() : false;

				try {
					this._timeScale = (this.isSnowLeopardControllerAvailable()) ? controller.timeScale() : controller.GetTimeScale();
					var timeDuration = (this.isSnowLeopardControllerAvailable()) ? controller.duration() : controller.GetDuration(),
						time = (this.movieType) ? Math.floor(timeDuration) : Math.floor(timeDuration / this._timeScale),
						properties = {},
						preFix = '';
				} catch (e) {}
				if (this.isReplay) {
					preFix = 'V@R: ';
					this.isReplay = false;
				} else {
					preFix = 'V@S: ';
				}

				properties.pageName = preFix + this._pageName;

				if (typeof this.type === 'undefined') {
					properties.prop13 = properties.pageName;
					properties.prop4 = document.URL.toString().replace(/(#|\?).*/, '');
					properties.prop33 = (typeof (controller.videoID) != 'undefined') ? controller.videoID() : '';
					AC.Tracking.trackPage(properties);
					//empty variables out so they are not picked up on the play request
					properties.prop13 = properties.prop3 = properties.prop4 = '';
				} else {
					s.prop33 = (typeof (controller.videoID) != 'undefined') ? controller.videoID() : '';
					s.prop13 = preFix + this._pageName;
					s.prop4 = document.URL.toString().replace(/(#|\?).*/, '');
					s.eVar16 = s.prop16 = "Video Plays"
					s.events = "event2"
					s.Media.trackVars += ",events,prop13,prop4,prop16,eVar16,prop33"
					s.Media.trackEvents += ",event2"
				}

				if (this.delegate && typeof this.delegate.QTdidBegin == 'function') {
					properties = this.delegate.QTdidBegin(this, properties);
					var MediatrackVars = '';
					for (var key in properties) {
						if (key != 'pageName') {
							MediatrackVars += ',' + key;
							s[key] = properties[key];
						}
					}
					s.Media.trackVars += MediatrackVars;
				}

				var playerType = (this.movieType) ? this.movieType : 'QuickTime';
				s.Media.open(this._pageName, time, playerType);
				s.Media.play(this._pageName, '0');
				//empty variables out so they are not picked up on subsequent requests
				s.prop13 = s.prop4 = s.prop16 = s.eVar16 = s.events = "";
				//set media Type to Video to elimiate additional swapview at end of video
				this.mediaType = "video";
			}
		}
	},

	didEnd: function (evt) {
		if (this.mediaType != 'audio') {
			try {
				var controller = evt.memo.controller,
					currentTime = (this.isSnowLeopardControllerAvailable()) ? controller.time() : controller.GetTime(),
					timeDuration = (this.isSnowLeopardControllerAvailable()) ? Math.floor(controller.duration()) : Math.floor(controller.GetDuration()),
					time = (this.movieType) ? Math.floor(currentTime) : Math.floor(currentTime / this._timeScale);
			} catch (e) {}

			if (time <= timeDuration) {
				s.Media.stop(this._pageName, time);
				s.Media.close(this._pageName);
			}
		}
	},

	didStartJogging: function (evt) {
		if (this.mediaType != 'audio') {
			try {
				var controller = evt.memo.controller,
					currentTime = (this.isSnowLeopardControllerAvailable()) ? controller.time() : controller.GetTime(),
					timeDuration = (this.isSnowLeopardControllerAvailable()) ? controller.duration() : controller.GetDuration(),
					time = (this.movieType) ? Math.floor(currentTime) : Math.floor(currentTime / this._timeScale);
			} catch (e) {}

			if (time <= timeDuration) {
				s.Media.stop(this._pageName, time);
			}
		}
	},

	didStopJogging: function (evt) {
		if (this.mediaType != 'audio') {
			try {
				var controller = evt.memo.controller,
					currentTime = (this.isSnowLeopardControllerAvailable()) ? controller.time() : controller.GetTime(),
					timeDuration = (this.isSnowLeopardControllerAvailable()) ? controller.duration() : controller.GetDuration(),
					time = (this.movieType) ? Math.floor(currentTime) : Math.floor(currentTime / this._timeScale);
			} catch (e) {}

			if (time <= timeDuration) {
				s.Media.play(this._pageName, time);
			}
		}
	},

	didStart: function (evt) {
		if (this.mediaType != 'audio') {
			try {
				var controller = evt.memo.controller,
					currentTime = (this.isSnowLeopardControllerAvailable()) ? controller.time() : controller.GetTime(),
					timeDuration = (this.isSnowLeopardControllerAvailable()) ? controller.duration() : controller.GetDuration(),
					time = (this.movieType) ? Math.floor(currentTime) : Math.floor(currentTime / this._timeScale);
			} catch (e) {}

			if (time <= timeDuration) {
				s.Media.play(this._pageName, time);
			}
		}
	},

	didStop: function (evt) {
		if (this.mediaType != 'audio') {
			try {
				var controller = evt.memo.controller,
					currentTime = (this.isSnowLeopardControllerAvailable()) ? controller.time() : controller.GetTime(),
					timeDuration = (this.isSnowLeopardControllerAvailable()) ? controller.duration() : controller.GetDuration(),
					time = (this.movieType) ? Math.floor(currentTime) : Math.floor(currentTime / this._timeScale);
			} catch (e) {}

			if (time <= timeDuration) {
				s.Media.stop(this._pageName, time);
			}
		}
	},

	noCompatibleQTAvailable: function (evt) {
		var properties = {};
		properties.prop6 = 'no QT: ' + AC.Tracking.pageName();
		AC.Tracking.trackClick(properties, name, 'o', properties.prop6);
	},

	didSetClosedCaptions: function (evt) {
		var controller = evt.memo.controller,
			timeDuration = this.isSnowLeopardControllerAvailable() ? controller.duration() : controller.GetDuration(),
			enabled = evt.memo.enabled;
		currentTime = this.isSnowLeopardControllerAvailable() ? controller.time() : controller.GetTime(),
		time = (this.movieType) ? Math.floor(currentTime) : Math.floor(currentTime / this._timeScale);
		if (enabled) {
			this.ccTime = time
		} else {
			var timeBucket,
			timePercent;
			this.ccTime = time - this.ccTime;
			timeDuration = this.isSnowLeopardControllerAvailable() ? timeDuration : timeDuration / this._timeScale
			timePercent = Math.round((this.ccTime / timeDuration) * 100);
			if (timePercent > 0 && timePercent < 11) {
				timeBucket = '<11';
			} else if (timePercent > 10 && !timePercent < 51) {
				timeBucket = '>10<51';
			} else if (timePercent > 50 && !timePercent < 91) {
				timeBucket = '>50<91';
			} else if (timePercent > 90) {
				timeBucket = '>90';
			} else {
				timePercent = null;
			}

			if (timePercent != null) {
				var properties = {};
				properties.pageName = AC.Tracking.pageName() + this.geoCode;
				properties.prop3 = 'cc@o: ' + timeBucket + ' - ' + this._pageName;
				AC.Tracking.trackClick(properties, this, 'o', properties.prop3);
			}
		}
	},

	_shouldTrackSectionOnDidChange: function (evt, view, outgoing, incoming) {
		// don't track: no incoming means this click event is just closing out the outgoing section
		if (!incoming) {
			return false;
		}

		// don't track: you can supress a click if the className of sneaky is on the incoming content
		if (incoming.content.hasClassName('sneaky')) {
			return false;
		}

		// always track: videos are tracked regardless of it being a user interaction (trigger) or second click suppression that follows
		if (incoming.mediaType().match(/video/)) {
			return true;
		}

		// don't track: if there is no user interaction (the first section's show and slideshows) then the event doesn't have a trigger
		if (typeof (evt.event_data.data.trigger) === 'undefined') {
			return false;
		}

		// don't track: if the section we just clicked on is the same as what was already clicked, don't track it as a second click
		if (this._viewWithClassNameTrackedSectionWithId[view.triggerClassName] === incoming.id) {
			return false;
		}

		// otherwise, do track this section change as a click
		return true;
	},

	sectionDidChange: function (evt) {
		this.viewMaster = evt.event_data.data.sender;
		var incoming = evt.event_data.data.incomingView;

		if (this._shouldTrackSectionOnDidChange(evt, this.viewMaster, evt.event_data.data.outgoingView, incoming)) {
			// default if we don't have a delegate tracking function
			var properties = {};

			this.pageName(incoming);
			if (this._id && !this._id.match(/-default/)) {
				properties.pageName = this._pageName + this.geoCode;
				this.mediaType = '';

				// special if our section is a movie or audio
				if (incoming.movieLink && incoming.movieLink.href) {
					if (incoming.mediaType().match(/audio\//)) {
						this.mediaType = 'audio';
						properties.pageName = 'A@S: ' + properties.pageName;
					} else if (incoming.mediaType().match(/video\//)) {
						if (this._id != '360' && this._id != 'vr' && this._id != 'qtvr') {
							this.mediaType = 'video';
							return false;
						}
					}

					properties.prop13 = properties.pageName.replace(/\s*\((\w{2}|befr|benl|chfr|chde|asia|lae)\)/g, '');
					properties.prop4 = incoming.movieLink.href;
				}

				if (this.delegate && typeof (this.delegate.sectionDidChange) == 'function') {
					properties = this.delegate.sectionDidChange(this, this.viewMaster, incoming, this._id, properties);
				}

				if (this.mediaType == '' && this.viewMaster && this.viewMaster.triggerClassName && this._viewWithClassNameTrackedInteraction.indexOf(this.viewMaster.triggerClassName) === -1) {
					properties.prop16 = 'gallery interaction';
					properties.eVar16 = this.viewMaster.triggerClassName + ' gallery interaction';
					properties.events = 'event1';
					this._viewWithClassNameTrackedInteraction.push(this.viewMaster.triggerClassName);
				}

				if (this.type == 'click') {
					properties.prop3 = properties.pageName.replace(/\s*\((\w{2}|befr|benl|chfr|chde|asia|lae)\)/g, '');
					properties.pageName = AC.Tracking.pageName() + this.geoCode;
					AC.Tracking.trackClick(properties, this.viewMaster, 'o', properties.prop3);
				} else {
					AC.Tracking.trackPage(properties);
				}

				this.count++;
			}
		}

		if (this.viewMaster && this.viewMaster.triggerClassName && incoming && incoming.id) {
			this._viewWithClassNameTrackedSectionWithId[this.viewMaster.triggerClassName] = incoming.id;
		}
	},

	movieDidEnd: function (evt) {
		var section = evt.event_data.data;

		var properties = {};
		var id = this.trackingNameForSection(section);

		if (id) {
			properties.pageName = AC.Tracking.pageName() + ' - ' + id + this.geoCode;


			// special if our section is a movie or audio
			if (section.movieLink && section.movieLink.href) {
				if (this.mediaType == 'audio') {
					properties.pageName = 'A@E: ' + properties.pageName;
				} else if (this.mediaType == 'video') {
					return false;
				}
				properties.prop13 = properties.pageName.replace(/\s*\((\w{2}|befr|benl|chfr|chde|asia|lae)\)/g, '');
			}

			if (this.delegate && typeof (this.delegate.movieDidEnd) == 'function') {
				properties = this.delegate.movieDidEnd(this, section, id, properties);
			}

			AC.Tracking.trackClick(properties, section, 'o', properties.pageName);
		}
	},

	movieDidReplay: function (evt) {
		var section = evt.event_data.data;

		var properties = {};
		var id = this.trackingNameForSection(section);

		if (id) {
			properties.pageName = AC.Tracking.pageName() + ' - ' + id + this.geoCode;

			// special if our section is a movie or audio
			if (section.movieLink && section.movieLink.href) {
				if (this.mediaType == 'audio') {
					properties.pageName = 'A@R: ' + properties.pageName;
				} else if (this.mediaType == 'video') {
					this.isReplay = true;
					return false;
				}
				properties.prop13 = properties.pageName.replace(/\s*\((\w{2}|befr|benl|chfr|chde|asia|lae)\)/g, '')
				properties.prop4 = section.movieLink.href;
			}

			if (this.delegate && typeof (this.delegate.movieDidReplay) == 'function') {
				properties = this.delegate.movieDidReplay(this, section, id, properties);
			}

			if (this.type == 'click') {
				properties.prop3 = properties.pageName.replace(/\s*\((\w{2}|befr|benl|chfr|chde|asia|lae)\)/g, '');
				properties.pageName = AC.Tracking.pageName() + this.geoCode;
				AC.Tracking.trackClick(properties, section, 'o', properties.prop3);
			} else {
				AC.Tracking.trackPage(properties);
			}
		}
	},

	afterPop: function (evt) {
		this.overlay = true;
	},

	afterClose: function (evt) {
		this.overlay = false;
	}

});
