(function() {
	'use strict';
	// Exporting module to global
	window.MaterialDialog = {};

	// Factory method for producing new Material Dialog objects
	window.MaterialDialog.getNewInstance = function(jQueryDOMElement) {
		return new MaterialDialog(jQueryDOMElement);
	};
	
	function MaterialDialog(jQueryDOMElement) {
		this.$container = jQueryDOMElement;
		this.$content = this.$container.children();
		this.$closeButton = this.$container.find('.close');

		// Stores initial(default) values of height and width and others 
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
				that.animateIn().then(function() {
					that.$content.fadeIn();
				});
				event.stopPropagation();
			});

			// Handle click on the close button
			this.$closeButton.on('click', function(event){
				that.closeDialog.call(that);
				event.stopPropagation();
			});


			// If clicked out side the material box do same thing as closing the dialog
			$(document).on('click', function() {
				that.closeDialog.call(that);
			});

		};

		// Animates in the container, Returns a promise to chain animation
		this.animateIn = function() {
			var that = this;
			return new Promise(function(res, rej){
				that.removeIcon();
				that.$container.velocity({
					width : that.finalConfig.width +"px",
					height : that.finalConfig.height + "px",
					borderRadius : "3px",
					backgroundColor : that.finalConfig.backgroundColor
				},{
					complete : function() {
						// resolve the promise on animation complete
						res();
					},
					duration : 500,
					easing : that.finalConfig.easing
				});
			});

		};

		// Animates the container out to its initial state
		this.animateOut = function() {
			this.$container.velocity({
				width : this.initialConfig.width + "px",
				height : this.initialConfig.height + "px",
				backgroundColor : this.initialConfig.backgroundColor,
				// For a perfect circle we will give border radius the same value as height and width
				borderRadius : this.initialConfig.width
			},{easing : this.finalConfig.easing, duration : 300});
		};

		this.closeDialog = function() {
			var that = this;
			this.$content.fadeOut("fast",function() {
				that.animateOut();
			});
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