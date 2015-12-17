(function() {

	'use strict';

	// Initialize the buttons

	// For the upload button
	var quttonUpload = Qutton.getInstance(document.querySelector('#qutton_upload'));
	quttonUpload.init({
		icon : './images/icon_upload.png',
		backgroundColor : "#917466"
	});


	// For the delete button
	var quttonDelete = Qutton.getInstance(document.querySelector('#qutton_delete'));
	quttonDelete.init({
		icon : './images/icon_delete.png',
		backgroundColor : "#EB1220"
	});

	// For the Sharing button
	var quttonComment= Qutton.getInstance(document.querySelector('#qutton_comment'));
	quttonComment.init({
		icon : './images/icon_comment.png',
		backgroundColor : "#41AAF1"
	});

})();
