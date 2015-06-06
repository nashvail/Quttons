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

		// Stores initial(default) values of height and width for the div
		this.initialConfig = {
			width : this.$container.width(),
			height : this.$container.height()
		};

		this.finalConfig = {
			width : 500,
			height : 500
		};

		// Initializes the click listeners on the box itself and other elements
		this.init = function (finalConfig) {
			$.extend(this.finalConfig, finalConfig);
			// Set up the icon for the div 
			this.setIcon();
			var that = this;
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
				that.$container.velocity({
					width : that.finalConfig.width +"px",
					height : that.finalConfig.height + "px",
					borderRadius : "3px",
					background : "none",
					backgroundColor : "#fff"
				},{
					complete : function() {
						// resolve the promise on animation complete
						res();
					},
					duration : 500,
					easing : 'easeInOutQuint'
				});
			});
		};

		this.setIcon = function() {
			this.$container.css('background-image', 'url(' + this.finalConfig.icon + ')');
		};

		// Animates the container out to its initial state
		this.animateOut = function() {
			this.$container.velocity({
				width : this.initialConfig.width + "px",
				height : this.initialConfig.height + "px",
				// For a perfect circle we will give border radius the same value as height and width
				borderRadius : this.initialConfig.width
			},{easing : 'easeInOutQuint', duration : 300});

			// Set the backgroud color back to the icon
			this.setIcon();
		};

		this.closeDialog = function() {
			var that = this;
			this.$content.fadeOut("fast",function() {
				that.animateOut();
			});
		};
	}


})();