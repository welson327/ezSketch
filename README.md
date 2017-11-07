# ezSketch
**ezSketch.js** is an easy stroke tool for javascript plugin to draw in canvas.

**Demo** : [https://rawgit.com/welson327/ezSketch/master/demo.html](https://rawgit.com/welson327/ezSketch/master/demo.html)

### Dependency: jQuery (>= 1.10)

Code Sample:
```js
$("#your_canvas").ezSketch({  
  strokeWidth: 10,  
  strokeColor: "black",  
  strokeCallback: function(evt) {  
    // do something  
  }  
});  
```
  
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
