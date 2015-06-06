'use strict';

var materialDelete = MaterialButton.getInstance($('#deleteBox'));
// Initalize the dialog with final States icon and easing
materialDelete.init({
	width : 250,
	height : 100,
	icon : './images/icon_delete.png',
	easing : 'easeInOutQuint'
});


// You can indepdently handle click events on buttons inside the dialog
$('.confirm').click(function(event) {
	console.log("Hey how are you doing");
	event.stopPropagation();
});