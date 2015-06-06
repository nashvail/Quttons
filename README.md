#Turn any div into a Material Button

[WIP] Installation instructions coming soon.
Meanwhile check out this [demo](http://nashvail.github.io/MaterialButton)

* Demo Code (js/main.js)


```
var materialDelete = MaterialButton.getInstance($('#deleteBox'));
// Initalize the dialog with final States, icon and easing
materialDelete.init({
	width : 250,
	height : 100,
	icon : './images/icon_delete.png',
	easing : 'easeInOutQuint'
});
```
