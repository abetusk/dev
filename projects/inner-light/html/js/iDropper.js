(function($) {

	/**
	 * Color math and other utility functions
	 */
	var

	isValidHex = function(hex) { return typeof hex === "string" && hex.match(/^#?[0-9a-fA-F]{6}$/i); },

	RgbFromHCM = function(hue, chroma, match) {
		var rgb, hp = hue/60, x = chroma*(1 - Math.abs(hp%2 - 1));
		if(hp < 1) rgb = [chroma,x,0];
		else if(hp < 2) rgb = [x,chroma,0];
		else if(hp < 3) rgb = [0,chroma,x];
		else if(hp < 4) rgb = [0,x,chroma];
		else if(hp < 5) rgb = [x,0,chroma];
		else if(hp < 6) rgb = [chroma,0,x];
		return [parseInt(255*(rgb[0]+match),10), parseInt(255*(rgb[1]+match),10), parseInt(255*(rgb[2]+match),10)];
	},
	HslToRgb = function(hsl) {
		var h = hsl[0], s = hsl[1], l = hsl[2],
			c = (1 - Math.abs(2*l - 1))*s,
			m = l - 0.5*c;
		return RgbFromHCM(h,c,m);
	},
	HsvToRgb = function(hsv) {
		var h = hsv[0], s = hsv[1], v = hsv[2],
			c = v*s, m = v - c;
		return RgbFromHCM(h,c,m);
	},
	_RgbToHex = function(rgb) {
		var hex = [], bit;
		if(rgb[3] === 0) return 'transparent';
		for(var i = 0; i < 3; i++) {
			bit = (rgb[i] - 0).toString(16);
			hex.push(bit.length == 1 ? ('0' + bit) : bit);
		}
		return '#' + hex.join('');
	},
	RgbToHex = function(rgb) {
		var match;
		if(typeof rgb === "string") {
			if(isValidHex(rgb)) return rgb;
			match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			if(match) {
				match.shift();
				rgb = match;
			}
		}
		if(typeof rgb !== "object" || !(rgb instanceof Array)) return null;
		else return _RgbToHex(rgb);
	},
	HexToRgb = function(hex) {
		hex = hex.replace(/#/g,'');

		if(hex.length !== 6) return false;

		var
		r = parseInt(hex.substr(0,2), 16),
		g = parseInt(hex.substr(2,2), 16),
		b = parseInt(hex.substr(4,2), 16);
		return [r,g,b];
	},
	RgbToHsl = function(rgb) {
		var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			d, h, s, l = (max + min) / 2;

		if(max === min){
			h = s = 0;
		} else {
			d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h *= 60;
		}
		return [h,s,l];
	},
	RgbToHsv = function(rgb){
		var r = rgb[0]/255,
			g = rgb[1]/255,
			b = rgb[2]/255,
			max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			h, s, v = max,
			d = max - min;

		s = max === 0 ? 0 : d / max;

		if(max === min){
			h = 0;
		} else {
			switch(max){
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}
			h *= 60;
		}
		return [h, s, v];
	},

	HexToHsl = function(hex) { return RgbToHsl(HexToRgb(hex)); },
	HslToHex = function(hsl) { return _RgbToHex(HslToRgb(hsl)); },

	HexToHsv = function(hex) { return RgbToHsv(HexToRgb(hex)); },
	HsvToHex = function(hsv) { return _RgbToHex(HsvToRgb(hsv)); },

	HsvToHsl = function(hsv) {
		var h=hsv[0], s=hsv[1], v=hsv[2],
		L = v-0.5*v*s,
		S = v*s/(1-Math.abs(2*L-1));
		if(!S) S = 0;
		return [h,S,L];
	},

	/**
	 * Forces the number to be within a range. Format is [lower, upper)
	 * @param       n           Number to force within range
	 * @param       lower       Number lower range
	 * @param       upper       Number upper range
	 * @param       wrap        Boolean optional, determines if number should wrap around
	 */
	wrapInRange = function(n, lower, upper, wrap) {
		if(lower > upper) { var tmp = lower; lower = upper; upper = tmp; }

		if(wrap) {
			var d = upper - lower;      // normalize
			n = (n-lower)%d;

			if(n < 0) n += d;
			else if(n > d) n -= d;
			n += lower;
		} else {
			if(n < 0) n = lower;
			else if(n > upper) n = upper;
		}
		return n;
	},

	/**
	 * Performs color math on the given hex. If changes.wrap is set, will wrap lightness && saturation
	 * @param       hex         String representing the color to change
	 * @param       changes     Object where hash is either 'h', 's', or 'l' with amt value
	 */
	changeColor = function(hex, changes) {
		if(typeof changes !== 'object') return null;
		var hsl;

		if(isValidHex(hex)) {
			hsl = HexToHsl(hex);
		} else if(Object.prototype.toString.call(hex) === '[object Array]' && hex.length === 3) {
			hsl = [hex[0], hex[1], hex[2]];
		} else {
			return null;
		}

		if(typeof changes.h === 'number') {
			hsl[0] = wrapInRange(hsl[0] + changes.h, 0, 360, true);
		}
		if(typeof changes.s === 'number') {
			hsl[1] = wrapInRange(hsl[1] + changes.s, 0, 1, changes.wrap || changes.wrapS);
		}
		if(typeof changes.l === 'number') {
			hsl[2] = wrapInRange(hsl[2] + changes.l, 0, 1, changes.wrap || changes.wrapL);
		}
		return HslToHex(hsl);
	},

	lighten = function(hex, amt) { return changeColor(hex, {'l': amt}); },
	darken = function(hex, amt) { return lighten(hex, -amt); },
	saturate = function(hex, amt) { return changeColor(hex, {'s': amt}); },
	desaturate = function(hex, amt) { return saturate(hex, -amt); },
	changeHue = function(hex, deg) { return changeColor(hex, {'h': deg}); },
	complement = function(hex) { return changeColor(hex, {'h': 180}); },

	/**
	 * Function to turn write out CSS rule
	 * @param      selector      String css selector
	 * @param      attrObj       Object where key represents attribute and val represents value
	 */
	cssStringify = function(selector, attrObj) {
		var str = selector + " {\n";
		for(var key in attrObj) if(attrObj.hasOwnProperty(key)) {
			str += "\t" + key + ": " + attrObj[key] + ";\n";
		}
		str += "}\n";
		return str;
	};


	/**
	 * Utilities and stuff
	 */
	$.iDropper = {
		lighten:          lighten,
		darken:           darken,
		saturate:         saturate,
		desaturate:       desaturate,
		changeHue:        changeHue,
		complement:       complement,
		changeColor:      changeColor,
		RgbToHex:         RgbToHex,
		HslToHex:         HslToHex,
		cssStringify:     cssStringify
	};





	/**
	 * Mouse up and move events (drag and dragend) are attached only once on the body and triggers that event
	 * on the active iDropper instance. This allows dragging outside of container holding iDropper
	 */
	var activeDropper = null;



	/**
	 * Figuring out image path
	 * In order to support setting colorpicker dimension without relying on CSS3 (background-size) or Canvas to draw the picker model,
	 * we must represent with an image and resize it accordingly. The only way to reliably predict the path of the image to set on the
	 * src attribute (and also to keep a formal layer separation), the image is set as the background of a class in the CSS, we can
	 * then pull the image path by reading the background-image css attribute on that class.
	 */
	var $imgPathEl = $('<div/>').appendTo($("body"));
  var
		URL = {
			SATVAL:   $imgPathEl.attr('class','iD-img-sv').css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, ""),
			HUEBAR:   $imgPathEl.attr('class','iD-img-huebar').css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, ""),
			HUERING:  $imgPathEl.attr('class','iD-img-huering').css('background-image').replace(/"/g,"").replace(/url\(|\)$/ig, "")
		};
		$imgPathEl.remove();


	/**
	 * Global dimension setup
	 */
	var fullSize =    256,										// original width of the saturation-value map
		fullRSize =   482,										// full ring size, original width of hue ring
		ringHalf =    50/2,										// Hue ring's (outter_radius - inner_radius)/2

		indicatorPercent = (fullRSize/2-ringHalf)/fullRSize,	// percent of hue ring's width from center point where indicator sits
		radiansToDegrees = 360/(2*Math.PI),

		IE = /MSIE (\d+\.\d+);/.test(navigator.userAgent) ? parseFloat(RegExp.$1) : NaN,
		IE6 = IE === 6,

		keysToAccept = // Keys to filter in when user types in input field
		//BKSPACE TAB  LEFT UP  RIGHT DOWN  0  1  2  3  4  5  6  8  8  9    a  b  c  d  e  f    v    numpad 0-9
		 [8,      9,   37,  38, 39,   40,   48,49,50,51,52,53,54,55,56,57,  65,66,67,68,69,70,  86,  96,97,98,99,100,101,102,103,104,105];



	/**
	 * Color Picker Class
	 *
	 * Possible option settings:
	 * @param   size        Integer pixel of the width/height of the square hue/value box
	 * @param   onChange    Function that's triggered when the color selection changes
	 * @param   type        String indicates which type of layout to use. Either 'bar' or 'ring'. Default 'bar'
	 */
	 var IDropper = function(opts) {


		this.el =            opts.$el;                                  // jQuery reference to container that instantiated iDropper
		this.hooks =         {};                                        // Event stack (for bind and trigger)
		this.hideHash =      opts.hideHash;                             // Toggle for hash character in input field


		var
		self =               this,
		size =               opts.size || fullSize,                     // width-height of square saturation-value container
		ringSize =           fullRSize*size/fullSize,                   // hue ring is proportional to size input
		ringRadius =         ringSize/2,                                // allows for normalizing axis later
		hypotenuse =         ringSize*indicatorPercent,                 // hue ring's indicator radius

		activeHSV =          [0,1,1],                                   // current color of picker
		layout =             opts.layout === 'ring' ? 'ring' : 'bar',   // layout is either bar or ring
		dragInfo =           { type: '', tx: 0, ty: 0 },                // indicates either hue or sv dragging
		mousedownFlag =      false;


		/**
		 * Element Reference, tabbed in tree heirarchy
		 */
		var
		doc, win, $win, $body, $htmlbody,
		$el = opts.$el,
		$iD = $('<div/>').addClass('iD iD-layout-'+layout).appendTo($el),
			$svContainer = $('<div/>').addClass('iD-sv-container iD-sv-container-'+layout).appendTo($iD),
				$svImg = $('<img/>').addClass('iD-img').attr('src',URL.SATVAL).appendTo($svContainer),
				$colorIndicator = $('<div/>').addClass('iD-indicator-color').appendTo($svContainer),
				$colorCover = $('<div/>').addClass('iD-cover-color iD-pick iD-sv-pick').appendTo($svContainer),
			$hueContainer = $('<div/>').addClass('iD-hue-container iD-hue-container-'+layout).appendTo($iD),
				$hueImg = $('<img/>').addClass('iD-img').attr('src',(layout === 'ring' ? URL.HUERING : URL.HUEBAR)).appendTo($hueContainer),
				$hueIndicator = $('<div/>').addClass('iD-indicator-hue').appendTo($hueContainer),
				$hueCover = $('<div/>').addClass('iD-cover-hue iD-pick iD-hue-pick').appendTo($hueContainer),
			$previewInputContainer = $('<div/>').addClass('iD-preview-input').appendTo($iD),
				$preview = $('<div/>').addClass('iD-preview').appendTo($previewInputContainer),
				$inputContainer = $('<div/>').addClass('iD-input-container').appendTo($previewInputContainer),
					$input = $('<input/>').addClass("iD-input-field").attr("type", "text").appendTo($inputContainer);


		/**
		 * iDropper functions not in prototype for controlled privacy
		 */
		var
		fn = {
			/**
			 * @public
			 * Sets a color on iDropper with "change" callback disabling option
			 */
			set: function(hex, disableCallback) {
				hex = fn.setColor(hex);
				if(hex) {
					fn.updateInput(hex);

					// Option to disable "change" callback (in case we *only* want to update the color)
					if(!disableCallback) self.trigger('change', hex, self.hsl);
				}
				return hex;
			},

			setColor: function(hex) {
				hex = RgbToHex(hex);
				if(isValidHex(hex)) {
					var hsv = HexToHsv(hex);

					// sets instance's active hsv and color
					activeHSV = hsv;
					self.hex = hex;
					self.hsl = HsvToHsl(hsv);

					// Setting hue
					if(layout === 'ring') fn.huedrag({theta: (270-hsv[0])/radiansToDegrees});
					else fn.huedrag({y: size - size*hsv[0]/360});

					// Setting saturation/value
					fn.svdrag({x: size*hsv[1], y: size*(1-hsv[2])});

					hex = fn.setPreview(hex);
					return hex;
				}
			},


			/**
			 * Stores information before a drag since mousedown and mouseup/mousemove have different "targets"
			 */
			setFlag: function(e, type) {
				var tOffset = e.manual ? e : $(e.target).offset();
				var scrollTop = $win.scrollTop() || 0;
				tOffset.left -= $win.scrollLeft();
				tOffset.top -= scrollTop;

				dragInfo = { type: type, tx: tOffset.left, ty: tOffset.top };
				activeDropper = self;
			},
			setSVFlag: function(e) { fn.setFlag(e,'svdrag'); fn.mousedrag(e); },
			setHueFlag: function(e) { fn.setFlag(e,'huedrag'); fn.mousedrag(e); },


			/**
			 * Keydown from input field, filters out invalid characters
			 */
			inputKeydown: function(e) {
				return ($.inArray(e.keyCode, keysToAccept) !== -1);
			},

			/**
			 * Keyup from input field, only trigger "change" event if hex is valid
			 */
			inputKeyup: function() {
				var hex = fn.setColor($input.val());
				if(hex) self.trigger('change', hex, self.hsl);
				return false;
			},

			fetchBody: function() {
				if(!$body) {
					doc = $el[0].ownerDocument;
					win = doc.defaultView || doc.parentWindow;
					$win = $(win);
					$body = opts.$el.parents("body");
					$htmlbody = opts.$el.parents("html, body");
					// Fires active instance's mousedrag
					$body.bind("mousemove.iDfn", function(e) {
						if(activeDropper) activeDropper.trigger("mousedrag", e);
					});
					// Fires active instance's mouseup and dereference active instance
					$body.bind("mouseup.iDfn", function(e) {
						if(activeDropper) activeDropper.trigger("mouseup", e); activeDropper = null;
					});
					// Prevents dragging image ghost
					$body.delegate("img.iD-pick", "mousedown", function(e) { e.preventDefault(); });

					if(IE) $body.addClass("ie ie"+IE);
				}
			},


			mousedown: function() {
				fn.fetchBody();
				mousedownFlag = true;
				self.trigger('start', self.hex, self.hsl);
				$body.addClass('iD-dragging');
			},
			mouseup: function() {
				if(mousedownFlag) {
					self.trigger('end', self.hex, self.hsl);
					self.trigger('change', self.hex, self.hsl);
				}
				mousedownFlag = false;
				$body.removeClass('iD-dragging');
			},
			mousedrag: function(e) {
				var hex, m = { x : e.clientX - dragInfo.tx, y : e.clientY - dragInfo.ty };

				// Keep drag within valid boundary
				if(m.x < 0) m.x = 0;
				if(m.y < 0) m.y = 0;

				fn[dragInfo.type](m); // fires either svdrag or huedrag, activeHSV gets updated

				hex = fn.setPreview();
				if(hex) {
					self.hex = hex;
					self.hsl = HsvToHsl(activeHSV);

					fn.updateInput(hex);
					self.trigger('drag', hex, self.hsl);
				}
			},


			huedrag: function(m) {
				var hex;

				if(layout === 'ring') {
					var x, y, t, d;

					if(m.theta) {
						t = m.theta;
					} else {
						if(m.y > ringSize) m.y = ringSize;

						x = m.x - ringRadius;
						y = m.y - ringRadius;

						if(x === 0) x = 0.00000001;
						if(y === 0) y = 0.00000001;

						t = Math.atan(y/x);
						d = 90 - t*radiansToDegrees;

						if((x>0 && y>0) || (x>0 && y < 0)) d+= 180;
						activeHSV[0] = parseInt(d - 1, 10);
					}

					x = parseInt(hypotenuse*Math.cos(t) + ringRadius, 10);
					y = parseInt(hypotenuse*Math.sin(t) + ringRadius, 10);

					if(m.x < ringRadius) {
						x = ringSize-x;
						y = ringSize-y;
					}

					$hueIndicator.css({ top: y, left: x });
				} else if(layout === 'bar') {
					if(m.y > size) m.y = size-1;
					activeHSV[0] = parseInt(360*(1 - m.y/size), 10);
					if(activeHSV[0] >= 360) activeHSV[0] = 359;
					$hueIndicator.css({ top: m.y });
				}
				$svContainer.css('background-color', hex = fn.getHex([activeHSV[0], 1, 1]));
			},
			svdrag: function(m) {
				if(m.x > size) m.x = size;
				if(m.y > size) m.y = size;

				$colorIndicator.css({ left: m.x-3, top: m.y-3 });
				activeHSV[1] = m.x/size;
				activeHSV[2] = 1-m.y/size;
			},


			// Convert hsv to hex (or use instance's activeHSV if none is defined)
			getHex: function(hsv) {
				if(!hsv) hsv = activeHSV;
				return _RgbToHex(HsvToRgb(hsv));
			},
			setPreview: function(hex) {
				if(!hex) hex = fn.getHex();
				if(isValidHex(hex)) {
					if(hex.charAt(0) !== "#") hex = "#"+hex;
					$preview.css('background-color', hex);
					return hex;
				}
			},

			// Updates text input field
			updateInput: function(hex) {
				if(self.hideHash) hex = hex.substr(1);
				$input.val(hex);
			},


			colorMath: function(hex, set) { if(set) self.set(hex); return hex; },
			darken: function(val, set) { return fn.colorMath(darken(self.hsl, val), set); },
			lighten: function(val, set) { return fn.colorMath(lighten(self.hsl, val), set); },
			saturate: function(val, set) { return fn.colorMath(saturate(self.hsl, val), set); },
			desaturate: function(val, set) { return fn.colorMath(desaturate(self.hsl, val), set); },
			changeHue: function(val, set) { return fn.colorMath(changeHue(self.hsl, val), set); },
			complement: function(val, set) { return fn.colorMath(complement(self.hsl, val), set); },
			changeColor: function(changes, set) { return fn.colorMath(changeColor(self.hsl, changes), set); }
		};


		/**
		 * Event bindings for iDropper-created DOM nodes
		 */
		var
		events = [
			['.iD-hue-pick',      'mousedown',     'mousedown'],
			['.iD-hue-pick',      'mousedown',     'setHueFlag'],
			['.iD-sv-pick',       'mousedown',     'mousedown'],
			['.iD-sv-pick',       'mousedown',     'setSVFlag'],
			['.iD-input-field',   'keyup',         'inputKeyup'],
			['.iD-input-field',   'keydown',       'inputKeydown']
		];
		for(var i=0, len = events.length; i<len; i++) $el.find(events[i][0]).bind(events[i][1], fn[events[i][2]]);


		/**
		 * Events triggered from body on active dragger instance (activeDropper)
		 * Instance is set during a setFlag which happens during the iDropper's mousedown event
		 */
		this.bind('mousedrag', fn.mousedrag);
		this.bind('mouseup', fn.mouseup);


		/**
		 * Bind user-specified events
		 */
		if(typeof opts.onChange === "function") this.bind('change', opts.onChange);
		if(typeof opts.onStart === "function") this.bind('start', opts.onStart);
		if(typeof opts.onDrag === "function") this.bind('drag', opts.onDrag);
		if(typeof opts.onEnd === "function") this.bind('end', opts.onEnd);


		this.set =         fn.set;        // Expose the set [color on iDropper] method
		this.darken =      fn.darken;
		this.lighten =     fn.lighten;
		this.saturate =    fn.saturate;
		this.desaturate =  fn.desaturate;
		this.changeHue =   fn.changeHue;
		this.complement =  fn.complement;
		this.changeColor = fn.changeColor;
		this.utils =       $.iDropper;    // Expose color math and utility functions


		/**
		 * Final initializing and such
		 */
		var hueWidth = parseInt(size/13,10);
		if(typeof opts.size === 'number') {
			$svContainer.css({ width: size, height: size });

			if(layout === 'ring') {
				$iD.css({ width: ringSize, height: ringSize });
				$hueContainer.css({ width: ringSize, height: ringSize });
			} else {
				$hueContainer.css({ width: hueWidth, height: size });
			}
		}

		if(IE6) {
			if(layout === 'ring') {
				$hueImg.remove();
				$('<span/>')
					.addClass('iD-ie6huefix iD-pick')
					.prependTo($hueContainer)
					.height(ringSize);
			}
			$svImg.remove();
			$('<span/>')
				.addClass('iD-ie6svfix iD-pick')
				.prependTo($svContainer)
				.height(size);
		}

		// Set initial color
		opts.color = opts.color || '#ff0000';
		fn.set(opts.color, true);

	};
	IDropper.prototype.bind = function(event, fn) {
		if(typeof fn !== 'function') return this;
		if(!this.hooks[event]) this.hooks[event] = [];
		this.hooks[event].push(fn);
		return this;
	};
	IDropper.prototype.trigger = function(event) {
		var fns = this.hooks[event], args;
		if(!fns) return false;

		args = Array.prototype.slice.call(arguments, 1);
		for(var i=0; i<fns.length; i++) {
			fns[i].apply(this, args);
		}
	};

	$.fn.iDropper = function(opts) {
		var $els = this;
		return $els.each(function(i){
			var $el = $els.eq(i), settings = { $el: $el };

			$.extend(settings, opts);
			$el.data('iDropper', new IDropper(settings));
		});
	};

}(jQuery));
