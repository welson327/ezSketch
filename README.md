# ezSketch
**ezSketch.js** is an easy stroke tool for javascript plugin to draw in canvas.

### Dependency: jQuery (>= 1.10)

Code Sample:
>
  $("#your_canvas").ezSketch({  
  &nbsp;&nbsp;  strokeWidth: 10,  
	&nbsp;&nbsp;  strokeColor: "black",  
	&nbsp;&nbsp;  strokeCallback: function(evt) {  
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// do something  
	&nbsp;&nbsp;&nbsp;&nbsp;}  
	});  

  
Methods:

  * Stroke color/width  
    $("#your_canvas").setStrokeColor("#ff0000");  
    $("#your_canvas").setStrokeWidth(12);  
  
  * Eraser, Undo, Redo  
    $("#your_canvas").useEraser(true);  
    $("#your_canvas").undo();  
    $("#your_canvas").redo();  
    $("#your_canvas").setHistorySize(30);
  
  * Clear canvas  
    $("#your_canvas").clear();  
  
  * Get data-url  
    $("#your_canvas").save();  
