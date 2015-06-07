(function() {
	'use strict';
	// Exporting module to global
	window.MaterialButton = {};

	// Factory method for producing new Material Dialog objects
	window.MaterialButton.getInstance = function(jQueryDOMElement) {
		return new MaterialButton(jQueryDOMElement);
	};
	
	function MaterialButton(jQueryDOMElement) {
		// Cache the importatn elements as jQuery object
		this.$container = jQueryDOMElement;
		this.$content = this.$container.children();
		this.$closeButton = this.$container.find('.close');

		// Stores initial(default) values of height and width and other properties
		this.initialConfig = {
			width : this.$container.width(),
			height : this.$container.height(),
			backgroundColor : toHex(this.$container.css('background-color'))
		};

		// Final Config specifies value of div once it pops up
		this.finalConfig = {
			width : 500,
			height : 500,
			backgroundColor : "#fff",
			easing : 'easeInOutQuint'
		};

		// Initializes the click listeners on the box itself and other elements
		this.init = function (finalConfig) {
			$.extend(this.finalConfig, finalConfig);
			var that = this;

			// Set up the icon for the div 
			this.setIcon();
			this.$content.hide();
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
					width : this.finalConfig.width +"px",
					height : this.finalConfig.height + "px",
					borderRadius : "4px",
					backgroundColor : this.finalConfig.backgroundColor
				}, o : {duration : 500, easing : this.finalConfig.easing}},

				{e : this.$content, p : "fadeIn", o : {duration : 300}}
			];

			$.Velocity.RunSequence(loadingSequence);
		};

		// Animates the container out to its initial state
		this.animateOut = function() {
			var leavingSequence = [
				{e : this.$content, p : "fadeOut", o : {duration : 150}},
				{e : this.$container, p :{
					width : this.initialConfig.width + "px",
					height : this.initialConfig.height + "px",
					backgroundColor : this.initialConfig.backgroundColor,
					// For a perfect circle we will give border radius the same value as height and width
					borderRadius : this.initialConfig.width
				}, o : {easing : this.finalConfig.easing, duration : 200}}

			];

			$.Velocity.RunSequence(leavingSequence);
		};

		// Close the dialog and return back to icon mode, is triggered
		// when clicked on close button or when clicked outside the dialog
		this.closeDialog = function() {
			this.animateOut();
			this.setIcon();
		};

		this.setIcon = function() {
			this.$container.css('background-image', 'url(' + this.finalConfig.icon + ')');
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