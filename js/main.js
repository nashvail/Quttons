(function() {
	
	'use strict';

	// Initialize the buttons

	// For the upload button
	var quttonUpload = MaterialButton.getInstance($('#qutton_upload'));
	quttonUpload.init({
		icon : './images/icon_upload.png',
		backgroundColor : "#917466"
	});


	// // For the delete button
	var quttonDelete = MaterialButton.getInstance($('#qutton_delete'));
	quttonDelete.init({
		icon : './images/icon_delete.png',
		backgroundColor : "#EB1220"
	});

	// For the Sharing button
	var quttonComment= MaterialButton.getInstance($('#qutton_comment'));
	quttonComment.init({
		icon : './images/icon_comment.png',
		backgroundColor : "#41AAF1"
	});

})();
