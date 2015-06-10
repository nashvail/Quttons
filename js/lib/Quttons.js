(function() {

	/********************************************
	* 	              Quttons.js  			    *
	* Quttons are buttons made of Quantum Paper *
	*********************************************/

	'use strict';
	// Exporting module to global
	window.Qutton= {};

	// Factory method for producing new Material Dialog objects
	window.Qutton.getInstance = function(jQueryDOMElement) {
		if(jQueryDOMElement === null) throw new Error("Passed in element doesn't exist in DOM");
		return new Qutton(jQueryDOMElement);
	};
	
	function Qutton(jQueryDOMElement) {

		// Cache the important elements as jQuery object
		this.$container = jQueryDOMElement;
		// Dialog is alias of the box that pops up on clicking the Qutton
		this.$dialog = this.$container.children();
		// Cache the close button if it exists
		this.$closeButton = this.$container.find('.close');

		// When button is expanded into a dialog isExpanded holds true
		this.isExpanded = false;

		// Configuration of the popped up dialog
		this.dialogConfig = {
			width : this.$dialog.outerWidth(),
			height : this.$dialog.outerHeight(),
			backgroundColor : toHex(this.$dialog.css('background-color')),
			borderRadius : this.$dialog.css('border-radius'),
			zIndex : this.$dialog.css('z-index')
		};


		// The width, height, icon, color of the formed button 
		this.buttonConfig = {
			width : 60,
			height : 60,
			backgroundColor : "#EB1220",
			icon : "", // Url of the icon that the button is supposed to hold
			easing : 'easeInOutQuint'
		};

		// Initializes the click listeners on the box itself and other elements
		this.init = function (buttonConfig) {

			$.extend(this.buttonConfig, buttonConfig);
			
			this.$dialog.hide();

			// Set up the icon and other properties of the div
			this.setIcon();
			this.$container.css({
				'width' : this.buttonConfig.width + "px",
				'height' : this.buttonConfig.height + "px",
				'background-color' : this.buttonConfig.backgroundColor,
				'border-radius' : this.buttonConfig.height + "px"
			});



			var that = this;
			// Handle Click on the whole container
			this.$container.on('click', function(event) {
				if(!that.isExpanded){
					that.openDialog();
				}
			});

			// Handle click on the close button
			this.$closeButton.on('click', function(event){
				if(that.isExpanded){
					that.closeDialog();
				}
			});


			// If clicked out side the material box do same thing as closing the dialog
			$(document).on('click', function(event) {
				if(!$(event.target).closest(that.$container.selector).length){
					if(that.isExpanded){
						that.closeDialog();
					}
				}
			});

		};


		this.closeDialog = function() {
			this.setIcon();
			this.animateOut();
			this.isExpanded = false;
		};

		this.openDialog = function() {
			this.removeIcon();
			this.animateIn();
			this.isExpanded = true;
		};

		this.setIcon = function() {
			this.$container.css('background-image', 'url(' + this.buttonConfig.icon + ')');
			this.$container.css('cursor', 'pointer');
		};

		this.removeIcon = function() {
			this.$container.css('background-image', 'none');
			this.$container.css('cursor', 'auto');
		};

		// Animates the button into dialog
		this.animateIn = function() {
			var that = this;
			// Translate amount to make the dialog look like exploding from desired location
			var translate = {
				X : -1 * (this.dialogConfig.width/2 - this.buttonConfig.width/2),
				Y : -0.5 * (this.dialogConfig.height/2 - this.buttonConfig.width/2)
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
					easing : this.buttonConfig.easing,
					begin : function() {
						that.$container.after(that.$container.clone().css('visibility', 'hidden'));
						that.$container.css({
							'position' : 'absolute',
							'z-index' : '10000'
						});
					}

				}},

				{e : this.$dialog, p : "fadeIn", o : {duration : 300}}
			];
			$.Velocity.RunSequence(inSequence );
		};

		// Animtes dialog into button
		this.animateOut = function() {
			var that = this;
			var outSequence = [
				{e : this.$dialog, p : "fadeOut", o : {duration : 150}},
				{e : this.$container, p :{
					width : this.buttonConfig.width + "px",
					height : this.buttonConfig.height + "px",
					backgroundColor : this.buttonConfig.backgroundColor,
					// For a perfect circle we will give border radius the same value as height and width
					borderRadius : this.buttonConfig.width,
					// Neutralize movement of button after it translated to maintain position
					translateX : "0px",
					translateY : "0px"
				}, o : {
					easing : this.buttonConfig.easing, 
					duration : 200,
					complete : function() {
						that.$container.css({
							'position' : 'static',
							'z-index' : that.dialogConfig.zIndex
						});
						that.$container.next().remove();
					}
				}}

			];

			$.Velocity.RunSequence(outSequence);
		};

		// Check if the explosion of Qutton is within the document bounds.
		// Returns an object containing values to translate in X or Y direction in order to 
		// keep the dialog in bounds of the document on explosion.
		this.keepInBounds= function() {
			var $window = $(window);
			var windowWidth = $window.width();
			var windowHeight = $window.height();

			var position = this.$container.position();	

			// Coordinates of top center of Qutton before it converts to a a dialog
			var buttonCenterTop = {
				top : position.top,
				left : position.left + (this.buttonConfig.width/2)
			};

			// Coordinates of the dialog once it opens
			var dialogCoords = {
				top : buttonCenterTop.top - ( 0.5 * (this.dialogConfig.height/2 - this.buttonConfig.height/2)),
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
		this.calculateTranslateAmount = function(extendSideOne, extendSideTwo) {
			if((extendSideOne < 0 && extendSideTwo < 0) || 
			   (extendSideOne > 0 && extendSideTwo > 0 )) { 
				return 0;	
			}

			// We want to translate in opposite direction of extension
			return (extendSideOne < 0 ? -extendSideOne : extendSideTwo);

		}

	}


	// Converts and returns RGB color code to Hex Code(String)
	function toHex(colorRGB) {
	    var parts = colorRGB.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	    delete(parts[0]);
	    for (var i = 1; i <= 3; i++) {
	        parts[i] = parseInt(parts[i]).toString(16);
	        if (parts[i].length == 1) parts[i] = '0' + parts[i];
	    }
	    return '#' + parts.join('');
	}

})();
