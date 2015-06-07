(function() {
	'use strict';
	// Exporting module to global
	window.MaterialButton = {};

	// Factory method for producing new Material Dialog objects
	window.MaterialButton.getInstance = function(jQueryDOMElement) {
		return new MaterialButton(jQueryDOMElement);
	};
	
	function MaterialButton(jQueryDOMElement) {

		// Cache the important elements as jQuery object
		this.$container = jQueryDOMElement;
		this.$dialog = this.$container.children();
		// Cache the close button if it exists
		this.$closeButton = this.$container.find('.close');

		// Configuration of the popped up dialog, direct child of
		this.dialogConfig = {
			width : this.$dialog.width(),
			height : this.$dialog.height(),
			backgroundColor : toHex(this.$dialog.css('background-color')),
			borderRadius : this.$dialog.css('border-radius')
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
				that.animateIn();
				event.stopPropagation();
			});

			// Handle click on the close button
			this.$closeButton.on('click', function(event){
				that.closeDialog.call(that);
				event.stopPropagation();
			});


			// If clicked out side the material box do same thing as closing the dialog
			$(document).on('click', function() {
				that.closeDialog();
			});

		};

		// Animates in the container, Returns a promise to chain animation
		this.animateIn = function() {
			this.removeIcon();
			var loadingSequence = [
				{e : this.$container, p : {
					width : this.dialogConfig.width +"px",
					height : this.dialogConfig.height + "px",
					borderRadius : this.dialogConfig.borderRadius,
					backgroundColor : this.dialogConfig.backgroundColor
				}, o : {duration : 500, easing : this.buttonConfig.easing}},

				{e : this.$dialog, p : "fadeIn", o : {duration : 300}}
			];

			$.Velocity.RunSequence(loadingSequence);
		};

		// Animates the container out to its initial state
		this.animateOut = function() {
			this.setIcon();
			var leavingSequence = [
				{e : this.$dialog, p : "fadeOut", o : {duration : 150}},
				{e : this.$container, p :{
					width : this.buttonConfig.width + "px",
					height : this.buttonConfig.height + "px",
					backgroundColor : this.buttonConfig.backgroundColor,
					// For a perfect circle we will give border radius the same value as height and width
					borderRadius : this.buttonConfig.width
				}, o : {easing : this.buttonConfig.easing, duration : 200}}

			];

			$.Velocity.RunSequence(leavingSequence);
		};

		this.closeDialog = function() {
			this.animateOut();
		};

		this.setIcon = function() {
			this.$container.css('background-image', 'url(' + this.buttonConfig.icon + ')');
			this.$container.css('cursor', 'pointer');
		};

		this.removeIcon = function() {
			this.$container.css('background-image', 'none');
			this.$container.css('cursor', 'auto');
		};

	}


	// Converts and returns RGB color code to Hex Code(String)
	function toHex(colorRGB) {
	    var parts = colorRGB.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	    delete(parts[0]);
	    for (var i = 1; i <= 3; ++i) {
	        parts[i] = parseInt(parts[i]).toString(16);
	        if (parts[i].length == 1) parts[i] = '0' + parts[i];
	    }
	    return '#' + parts.join('');
	}


})();