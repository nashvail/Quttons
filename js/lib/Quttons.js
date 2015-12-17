/********************************************
* Quttons.js                                *
* Quttons are buttons made of Quantum Paper *
* Author : Nash Vail       		              *
* @license MIT															*
*********************************************/

(function() {
	'use strict';
	// Exporting module to global
	window.Qutton= {};

	// Factory method for producing new Material Dialog objects
	window.Qutton.getInstance = function(domElement) {
		if(domElement === null) throw new Error("Passed in element doesn't exist in DOM");
		return new Qutton(domElement);
	};

	// Qutton Object
	function Qutton(domElement) {

		// Cache the important elements as jQuery object
		this.$container = domElement;
		// Dialog is alias of the box that pops up on clicking the Qutton
		this.$dialog = this.$container.children;
		// Cache the close button if it exists
		this.$closeButton = this.$container.querySelectorAll('.close');

		// When button is expanded into a dialog isOpen holds true
		this.isOpen = false;

		// Configuration of the popped up dialog
		this.dialogConfig = {
			width : parseInt(getComputedStyle(this.$dialog[0])['width']),
			height : parseInt(getComputedStyle(this.$dialog[0])['height']),
			backgroundColor : toHex(getComputedStyle(this.$dialog[0])['background-color']),
			borderRadius : getComputedStyle(this.$dialog[0])['border-radius'],
			zIndex : getComputedStyle(this.$dialog[0])['z-index']
		};


		// Configuration of Qutton
		this.quttonConfig = {
			width : 60,
			height : 60,
			backgroundColor : "#EB1220",
			icon : "", // Url of the icon that the button is supposed to hold
			easing : 'easeInOutQuint'
		};


	}

	// Initializes the click listeners on the qutton itself, document and close button
	Qutton.prototype.init = function(quttonConfig) {

		deepExtend(this.quttonConfig, quttonConfig);

		this.$dialog[0].style.display = 'none';

		// Set up the icon and other properties of the div
		this.setIcon();

		this.$container.style.width = this.quttonConfig.width + "px";
		this.$container.style.height = this.quttonConfig.height + "px";
		this.$container.style.backgroundColor = this.quttonConfig.backgroundColor;
		this.$container.style.borderRadius = this.quttonConfig.height + "px";

		// Initialize the event handlers
		this.events.click.call(this);
		this.events.click_document.call(this);
		this.events.click_close_button.call(this);

	};



	Qutton.prototype.closeDialog = function() {
        var dialog = this;
        if(dialog.isOpen){
            dialog.setIcon();
            dialog.animateOut();
        } else if (dialog.isOpening) {
            setTimeout(function(){
                dialog.closeDialog();
            }, 100);
        }
	};

	Qutton.prototype.openDialog = function() {
		this.removeIcon();
		this.animateIn();
	};

	Qutton.prototype.setIcon = function() {
		this.$container.style.backgroundImage = 'url(' + this.quttonConfig.icon + ')';
		this.$container.style.cursor = 'pointer';
	};

	Qutton.prototype.removeIcon = function() {
		this.$container.style.backgroundImage = 'none';
		this.$container.style.cursor = 'auto';
	};

	// Animates the button into dialog
	Qutton.prototype.animateIn = function() {
		var that = this;
		if (that.isOpening === true) {
			return;
		}
        that.isOpening = true;
		// Translate amount to make the dialog look like exploding from desired location
		var translate = {
			X : -1 * (this.dialogConfig.width/2 - this.quttonConfig.width/2),
			Y : -0.5 * (this.dialogConfig.height/2 - this.quttonConfig.width/2)
		};

		var inSequence  = [
			{e : this.$container, p : {
				width : this.dialogConfig.width +"px",
				height : this.dialogConfig.height + "px",
				borderRadius : this.dialogConfig.borderRadius,
				backgroundColor : this.dialogConfig.backgroundColor,
				translateX : translate.X + this.keepInBounds().X + "px",
				translateY : translate.Y + this.keepInBounds().Y + "px"
			}, o : {
				duration : 500,
				easing : this.quttonConfig.easing,
				begin : function() {
					var nextElement = that.$container.nextElementSibling;
					var containerClone;
					// add a placeholder in place to maintain the flow of document
					if(!(nextElement && nextElement.classList.contains('quttonClonePlaceHolder'))) {
						containerClone = that.$container.cloneNode(true);
						containerClone.classList.add('quttonClonePlaceHolder');
						that.$container.parentNode.insertBefore(containerClone, nextElement);
					}
					that.$container.style.position = 'absolute';
					that.$container.style.zIndex = '10000';
				},
				complete : function() {
					that.isOpen = true;
          that.isOpening = false;
				}
			}},

			{e : this.$dialog, p : "fadeIn", o : {duration : 300, complete : function() { that.isOpen = true;}}}
		];

		Velocity.RunSequence(inSequence);
	};

	// Animtes dialog into button
	Qutton.prototype.animateOut = function() {
		var that = this;
        if (that.closing === true) {
            return;
        }
        that.closing = true;
		var outSequence = [
			{e : this.$dialog, p : "fadeOut", o : {duration : 150}},
			{e : this.$container, p :{
				width : this.quttonConfig.width + "px",
				height : this.quttonConfig.height + "px",
				backgroundColor : this.quttonConfig.backgroundColor,
				// For a perfect circle we will give border radius the same value as height and width
				borderRadius : this.quttonConfig.width,
				// Neutralize movement of button after it translated to maintain position
				translateX : "0px",
				translateY : "0px"
			}, o : {
				easing : this.quttonConfig.easing,
				duration : 200,
				complete : function() {
					var nextElement = that.$container.nextElementSibling;
					// Remove the placeholder
					if (nextElement && nextElement.classList.contains('quttonClonePlaceHolder')) {
						nextElement.parentNode.removeChild(nextElement);
					}

					that.$container.style.position = 'static';
					that.$container.style.zIndex = that.dialogConfig.zIndex;
					that.isOpen = false;
          that.closing = false;
				}
			}}

		];

		Velocity.RunSequence(outSequence);
	};

	// Check if the explosion of Qutton is within the document bounds.
	// Returns an object containing values to translate in X or Y direction in order to
	// keep the dialog in bounds of the document on explosion.
	Qutton.prototype.keepInBounds= function() {
		var windowWidth = window.document.documentElement.clientWidth;
		var windowHeight = window.document.documentElement.clientHeight;

		var position = {
			left: this.$container.offsetLeft,
			top: this.$container.offsetTop
		};

		// Coordinates of top center of Qutton before it converts to a a dialog
		var buttonCenterTop = {
			top : position.top,
			left : position.left + (this.quttonConfig.width/2)
		};

		// Coordinates of the dialog once it opens
		var dialogCoords = {
			top : buttonCenterTop.top - ( 0.5 * (this.dialogConfig.height/2 - this.quttonConfig.height/2)),
			left : buttonCenterTop.left - (this.dialogConfig.width/2),
		};

		// How much the dialog extends beyond the document
		var extend  = {
			left : dialogCoords.left,
			right : windowWidth - (dialogCoords.left + this.dialogConfig.width),
			top : dialogCoords.top,
			bottom : windowHeight - (dialogCoords.top + this.dialogConfig.height)
		};

		// Amount to translate in X and Y if possible to bring dialog in bounds of document
		var translateInBounds = {
			X : this.calculateTranslateAmount(extend.left, extend.right),
			Y : this.calculateTranslateAmount(extend.top, extend.bottom)
		};

		return translateInBounds;
	};

	// Calculates and returns the amount to translate the dialog to keep in bounds of the window
	Qutton.prototype.calculateTranslateAmount = function(extendSideOne, extendSideTwo) {
		if((extendSideOne < 0 && extendSideTwo < 0) ||
		   (extendSideOne > 0 && extendSideTwo > 0 )) {
			return 0;
		}

		// We want to translate in opposite direction of extension
		return (extendSideOne < 0 ? -extendSideOne : extendSideTwo);

	};


	// Event listeners
	Qutton.prototype.events = {
		// Handles the click on Qutton
		click : function() {
			var that = this;
			this.$container.addEventListener('click', function(){
				if(!that.isOpen){
					that.openDialog();
				}
			});

		},

		// Handle clicks on the document, aimed at closing the dialog
		click_document : function() {
			var that = this;
			document.addEventListener('click', function(event) {
				if(!closest(event.target, that.$container.selector).length){
					if(that.isOpen){
						that.closeDialog();
					}
				}
			});
		},

		// Initializes clicks on close button if it exists
		click_close_button : function() {
			var that = this;
			if(this.$closeButton.length){
				this.$closeButton.addEventListener('click', function(event){
					if(that.isOpen){
						that.closeDialog();
					}
				});
			}
		}

	};

	// Converts and returns RGB color code to Hex Code(String)
	function toHex(rgb){
		 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		 return (rgb && rgb.length === 4) ? "#" +
		  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}

	// Source: http://youmightnotneedjquery.com/
	function deepExtend(out) {
  	out = out || {};

  	for (var i = 1; i < arguments.length; i++) {
    	var obj = arguments[i];

    	if (!obj)
      	continue;

    	for (var key in obj) {
      	if (obj.hasOwnProperty(key)) {
        	if (typeof obj[key] === 'object')
          	deepExtend(out[key], obj[key]);
        	else
          	out[key] = obj[key];
      	}
    	}
  	}

  	return out;
	};

	// Source: http://youmightnotneedjquery.com/
	function closest(el, selector) {
  	var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  	while (el) {
    	if (matchesSelector.call(el, selector)) {
      	return el;
    	} else {
      	el = el.parentElement;
    	}
  	}
  	return [];
	};
})();
