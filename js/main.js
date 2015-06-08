'use strict';

// For the upload button
var materialUploadBTN = MaterialButton.getInstance($('#uploadButton'));
materialUploadBTN.init({
	backgroundColor : "#917466",
	icon : './images/icon_upload.png'
});


// // For the delete button
var materialDeleteButton = MaterialButton.getInstance($('#deleteButton'));
materialDeleteButton.init({
	icon : './images/icon_delete.png',
	backgroundColor : "#EB1220"
});

// For the Sharing button
var materialShareButton = MaterialButton.getInstance($('#commentButton'));
materialShareButton.init({
	backgroundColor : "#41AAF1",
	icon : './images/icon_comment.png'	
});

