#Quttons are buttons made of Quantum Paper
* Qunatum Paper is a digital paper that can change its size, shape and color to accomodate new content.
Quantum paper is part of Google's new Material Design language.

* With this plugin you can hide any div behind a Quantum [Paper] Button or Qutton

[WIP] Installation instructions coming soon.
Meanwhile check out this [demo(beta)](http://nashvail.github.io/Quttons)

#[Online Demo](http://nashvail.github.io/Quttons)

 ![Slow Mo Demo](http://i.imgur.com/I6xeQkn.gif)

#Dependencies 
* jQuery
* [Velocity.js](https://raw.githubusercontent.com/julianshapiro/velocity/master/velocity.js) with [UI Pack](https://raw.githubusercontent.com/julianshapiro/velocity/master/velocity.ui.js)

#How To Use 

##Step 1, Include Dependencies :
* Download and include all dependencies in your html file. 
* After all the dependencies have been included, include Quttons.js or Quttons.min.js and Quttons.css after downloading from this repo.
* In the following order
```
    <script src = "Path/To/jQuery" type = "text/javascript"></script>
	<script src = "Path/To/velocity.js" type = "text/javascript"></script>
	<script src = "Path/To/velocity.ui.js" type = "text/javascript"></script>
	<script src = "Path/To/Quttons.js" type = "text/javascript"></script>
```
* And CSS
```
<link rel = "stylesheet" href = "Path/To/Quttons.css" />
```

#Step 2, Design your dialog :
* Design your dialog box.
* Design a div as you normally would, with all the css styles you want. You can put whatever you want inside your div.
* Here is sample code for the Upload File Qutton from the [Demo Site](http://nashvail.github.io/Quttons).
```
<div id="uploadDialog">
	<h2>Upload a new file</h2>
		<input type="text" id = "fileUrl" placeholder = "Enter URL">
	<div id="button_basic_upload"> Choose a file to upload
	</div>
</div>
```

#Step 3, Wrap created dialog in a div
* Wrap dialog created in previous step in a div with class of ***qutton*** and one ***custom id which will be used to reference this qutton in your js file***.
* Example 
```
<div class = "qutton" id = "qutton_upload">
 ...(Dialog created in previous step) ...
</div>
```

#Step 4, Initialize Qutton
* In your .js file start by referencing the qutton in the following manner. 
```
	var quttonUpload = Qutton.getInstance($('#qutton_upload'));
	quttonUpload.init({
		icon : './images/icon_upload.png',
		backgroundColor : "#917466"
	});
```
* Inside `getInstance` you pass in the jQuery object r
* `init` function takes in an object specifying the configuration of the button, following are currently supported

|Argument   | Description  | Default  |   |   |
|---|---|---|---|---|
| icon  | Icon to be displayed in Qutton  | None  |   |   |
|  backgroundColor | Background Color of Qutton  | #FE0000  |   |   |
|  width | Width of the Qutton  | 60  |   |   |
|  height | Height of the Qutton  | 60  |   |   |
|  easing | Easing for the animation  | easeInOutQuint  |   |   |




