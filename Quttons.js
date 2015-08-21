(function(factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory(require('jquery'));
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else {
    // Browser globals
    window.Qutton = factory(window.jQuery);
  }
})(function($) {

  /********************************************
  * Quttons.js                                *
  * Quttons are buttons made of Quantum Paper *
  * Author : Nash Vail                        *
  *********************************************/

  'use strict';

  // Qutton Object
  function Qutton(jQueryDOMElement) {

    // Cache the important elements as jQuery object
    this.$container = jQueryDOMElement;
    // Dialog is alias of the box that pops up on clicking the Qutton
    this.$dialog = this.$container.children();
    // Cache the close button if it exists
    this.$closeButton = this.$container.find('.close');

    // When button is expanded into a dialog isOpen holds true
    this.isOpen = false;

    // Configuration of the popped up dialog
    this.dialogConfig = {
      width : this.$dialog.outerWidth(),
      height : this.$dialog.outerHeight(),
      backgroundColor : toHex(this.$dialog.css('background-color')),
      borderRadius : this.$dialog.css('border-radius'),
      zIndex : this.$dialog.css('z-index')
    };

    // Configuration of Qutton
    this.quttonConfig = {
      width : 60,
      height : 60,
      backgroundColor : '#EB1220',
      icon : '', // Url of the icon that the button is supposed to hold
      easing : 'easeInOutQuint'
    };

  }

  // Initializes the click listeners on the qutton itself, document and close button
  Qutton.prototype.init = function(quttonConfig) {

    $.extend(this.quttonConfig, quttonConfig);

    this.$dialog.hide();

    // Set up the icon and other properties of the div
    this.setIcon();
    this.$container.css({
      'width' : this.quttonConfig.width + 'px',
      'height' : this.quttonConfig.height + 'px',
      'background-color' : this.quttonConfig.backgroundColor,
      'border-radius' : this.quttonConfig.height + 'px'
    });

    // Initialize the event handlers
    this.events.click.call(this);
    this.events.click_document.call(this);
    this.events.click_close_button.call(this);

  };

  Qutton.prototype.closeDialog = function() {
    var dialog = this;
    if (dialog.isOpen){
      dialog.setIcon();
      dialog.animateOut();
    } else if (dialog.isOpening) {
      setTimeout(function() {
        dialog.closeDialog();
      }, 100);
    }
  };

  Qutton.prototype.openDialog = function() {
    this.removeIcon();
    this.animateIn();
  };

  Qutton.prototype.setIcon = function() {
    this.$container.css('background-image', 'url(' + this.quttonConfig.icon + ')');
    this.$container.css('cursor', 'pointer');
  };

  Qutton.prototype.removeIcon = function() {
    this.$container.css('background-image', 'none');
    this.$container.css('cursor', 'auto');
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
      {
        e : this.$container,
        p : {
          width : this.dialogConfig.width +'px',
          height : this.dialogConfig.height + 'px',
          borderRadius : this.dialogConfig.borderRadius,
          backgroundColor : this.dialogConfig.backgroundColor,
          translateX : translate.X + this.keepInBounds().X + 'px',
          translateY : translate.Y + this.keepInBounds().Y + 'px'
        },
        o : {
          duration : 500,
          easing : this.quttonConfig.easing,
          begin : function() {
            // add a placeholder in place to maintain the flow of document
            if (!that.$container.next('.quttonClonePlaceHolder').length)
              that.$container.after(that.$container.clone().addClass('quttonClonePlaceHolder'));

            that.$container.css({
              'position' : 'absolute',
              'z-index' : '10000'
            });
          },
          complete : function() {
            that.isOpen = true;
            that.isOpening = false;
          }
        }
      },

      {
        e : this.$dialog,
        p : 'fadeIn',
        o : {
          duration : 300,
          complete : function() {
            that.isOpen = true;
          }
        }
      }
    ];

    $.Velocity.RunSequence(inSequence);
  };

  // Animtes dialog into button
  Qutton.prototype.animateOut = function() {
    var that = this;

    if (that.closing === true) {
      return;
    }

    that.closing = true;

    var outSequence = [
      {
        e : this.$dialog,
        p : 'fadeOut',
        o : {
          duration : 150
        }
      },

      {
        e : this.$container,
        p :{
          width : this.quttonConfig.width + 'px',
          height : this.quttonConfig.height + 'px',
          backgroundColor : this.quttonConfig.backgroundColor,
          // For a perfect circle we will give border radius the same value as height and width
          borderRadius : this.quttonConfig.width,
          // Neutralize movement of button after it translated to maintain position
          translateX : '0px',
          translateY : '0px'
        },
        o : {
          easing : this.quttonConfig.easing,
          duration : 200,
          complete : function() {
            // Remove the placeholder
            that.$container.next('.quttonClonePlaceHolder').remove();
            that.$container.css({
              'position' : 'static',
              'z-index' : that.dialogConfig.zIndex
            });
            that.isOpen = false;
            that.closing = false;
          }
        }
      }
    ];

    $.Velocity.RunSequence(outSequence);
  };

  // Check if the explosion of Qutton is within the document bounds.
  // Returns an object containing values to translate in X or Y direction in order to
  // keep the dialog in bounds of the document on explosion.
  Qutton.prototype.keepInBounds= function() {
    var $window = $(window);
    var windowWidth = $window.width();
    var windowHeight = $window.height();

    var position = this.$container.position();

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
    if ((extendSideOne < 0 && extendSideTwo < 0) ||
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
      this.$container.on('click', function(){
        if (!that.isOpen){
          that.openDialog();
        }
      });
    },

    // Handle clicks on the document, aimed at closing the dialog
    click_document : function() {
      var that = this;
      $(document).on('click', function(event) {
        if (!$(event.target).closest(that.$container.selector).length){
          if (that.isOpen){
            that.closeDialog();
          }
        }
      });
    },

    // Initializes clicks on close button if it exists
    click_close_button : function() {
      var that = this;
      if (this.$closeButton.length){
        this.$closeButton.on('click', function(event){
          if (that.isOpen){
            that.closeDialog();
          }
        });
      }
    }
  };

  // Converts and returns RGB color code to Hex Code(String)
  function toHex(rgb){
     rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
     return (rgb && rgb.length === 4) ? '#' +
      ('0' + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ('0' + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }

  // Factory method for producing new Material Dialog objects
  function factory(jQueryDOMElement) {
    if (jQueryDOMElement === null) throw new Error('Passed in element doesn\'t exist in DOM');
    return new Qutton(jQueryDOMElement);
  }

  return {
    getInstance: factory
  };
});
