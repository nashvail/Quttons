'use strict';
var materialDelete = MaterialButton.getInstance($('#deleteBox'));
// Initalize the dialog with final States
materialDelete.init({
	width : 250,
	height : 100,
	icon : './images/icon_delete.png',
	easing : 'easeInOutQuint'
});


$('.confirm').click(function(event) {
	console.log("Hey how are you doing");
	event.stopPropagation();
});