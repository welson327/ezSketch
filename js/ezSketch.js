/*
 * Purpose: This plugin is for drawing something with canvas in easy way.
 * Sample Code:
 * 		$("#your_canvas").ezSketch();
 * 		(1) Change color/width
 * 			$("#your_canvas").setStrokeColor("#ff0000");
 * 			$("#your_canvas").setStrokeWidth(12);
 * 		(2) Clear whole canvas
 * 			$("#your_canvas").clear();
 * 		(3) Get data-url
 * 			var dataURL = $("#your_canvas").save();
 * Author: welson
 * Release: 2015.04.13
 */
var g_sketchController = {
	// dom
	canvas: null,
	ctx: null,
	// mouse 
	flag: false,
	prevX: 0,
	currX: 0,
	prevY: 0,
	currY: 0,
	dot_flag: false,
	// stroke
	strokeColor: "black",
	strokeWidth: 2,
	
	// history
	historySize: 30+1,
	history: [], //["data:image/png;base64,"],
	historyPointer: -1,
	
	//=============================================================
	// Purpose: 	HTML5 Canvas eraser, erase as transparent background
	// Parameters: 	
	// Return: 		
	// Remark: 		http://stackoverflow.com/questions/3790211/html5-canvas-eraser
	// Author: 		welson
	//=============================================================
	useEraser: function(isEnable) {
		if(isEnable) {
			//this.prevGlobalCompositeOperation = this.ctx.globalCompositeOperation;
			this.ctx.globalCompositeOperation = "destination-out";
		} else {
			//this.prevGlobalCompositeOperation = this.ctx.globalCompositeOperation;
			this.ctx.globalCompositeOperation = "source-over"; // default
		}
	},
	setStrokeColor: function(colorCode) {
		switch (colorCode) {
			case "green": this.strokeColor = "green"; break;
			case "blue": this.strokeColor = "blue"; break;
			case "red":	this.strokeColor = "#ff0000"; break;
			case "yellow": this.strokeColor = "yellow"; break;
			case "orange": this.strokeColor = "orange"; break;
			case "black": this.strokeColor = "black"; break;
			case "white": this.strokeColor = "white"; break;
			default: this.strokeColor = colorCode; break;
		}
		//if (this.strokeColor == "white") this.strokeWidth = 14;
		//else this.strokeWidth = 2;
	},
	setStrokeWidth: function(px) {
		if(px > 0 && px <= 500) {
			this.strokeWidth = px;
		}
	},
	setHistorySize: function(size) {
		this.historySize = size+1;
	},
	draw: function() {
		//http://www.w3schools.com/tags/ref_canvas.asp
		this.ctx.beginPath();
		this.ctx.lineJoin = "round";
	    this.ctx.lineCap = "round";
		this.ctx.moveTo(this.prevX, this.prevY);
		this.ctx.lineTo(this.currX, this.currY);
		this.ctx.strokeStyle = this.strokeColor;
		this.ctx.lineWidth = this.strokeWidth;
		this.ctx.stroke();
		this.ctx.closePath();
	},
	clear: function() {
		var yes = true;
		if (yes) {
			var w = this.canvas.width;
		    var h = this.canvas.height;
			this.ctx.clearRect(0, 0, w, h);
			
			this.history = [];
			this.historyPointer = -1;
		}
	},
	save: function() {
		var dataURL = this.canvas.toDataURL();
		return dataURL;
	},
	saveToHistory: function() {
		var dataUrl = this.save();
		var history = this.history;
		history = history.slice(0, this.historyPointer+1);
		if(history.length >= this.historySize) {
			history = history.splice(1, history.length);
		}
		history.push(dataUrl);
		
		this.historyPointer = history.length - 1;
		this.history = history;
		//console.log("history.length="+this.history.length);
	},
	undo: function() {
		this.historyPointer = this.historyPointer - 1;
		if(this.historyPointer >= 0) {
			var dataUrl = this.history[this.historyPointer];
			this.drawByDataUrl(dataUrl);
		} else {
			if(this.historyPointer == -1) {
				//ctx.clearRect(0, 0, w, h);
			}
			this.historyPointer = 0;
		}
	},
	redo: function() {
		var len = this.history.length;
		this.historyPointer = this.historyPointer + 1;
		if(this.historyPointer < len) {
			var dataUrl = this.history[this.historyPointer];
			this.drawByDataUrl(dataUrl);
		} else {
			this.historyPointer = len - 1;
		}
	},
	drawByDataUrl: function(dataUrl) {
		var ctx = this.ctx;
		var w = this.canvas.width;
		var h = this.canvas.height;
		if(dataUrl) {
			//var img = new Element('img', {'src':prevData});
			var img = new Image();
			img.src = dataUrl;
			img.onload = function() {
				// fix eraser mode
				var globalCompositeOperation = ctx.globalCompositeOperation;
				ctx.globalCompositeOperation = "source-over";
				
				ctx.clearRect(0, 0, w, h);
				ctx.drawImage(img, 0, 0);
				
				ctx.globalCompositeOperation = globalCompositeOperation;
			};
		}
	},
	saveToCanvas: function(canvasId) {
		var target = document.getElementById(canvasId);
		var dataURL = this.canvas.toDataURL();
		target.src = dataURL;
		target.style.display = "inline";
		//target.style.border = "2px solid";
	},
	//=============================================================
	// Purpose: 	get offset of elem (absolute coordinate)
	// Parameters: 	elem => is a DOM
	// Return: 		json
	// Remark: 		http://stackoverflow.com/questions/1044988/getting-offsettop-of-element-in-a-table
	// Author: 		welson
	//=============================================================
	findxy: function(mouseAction, e) {
		var c = this.canvas;
		var canvasOffset = $(c).offset();
		//console.log("(e.clientX,e.clientY)=("+e.clientX+","+e.clientY + "); (e.pageX,e.pageY)=("+e.pageX+","+e.pageY+")");// relative to window
		//var canvasOffset = {left: c.offsetLeft, top: c.offsetTop};
		//$.log(mouseAction);
		if (mouseAction == 'down') {
			this.prevX = this.currX;
			this.prevY = this.currY;
			//this.currX = e.clientX - c.offsetLeft;
			//this.currY = e.clientY - c.offsetTop;
			this.currX = e.pageX - canvasOffset.left;
			this.currY = e.pageY - canvasOffset.top;
			
			this.flag = true;
			this.dot_flag = true;
			if (this.dot_flag) {
				this.ctx.beginPath();
				this.ctx.fillStyle = this.strokeColor;
				this.ctx.fillRect(this.currX, this.currY, 2, 2);
				this.ctx.closePath();
				this.dot_flag = false;
			}
		}
		if (mouseAction == 'up' || mouseAction == "out") {
			this.flag = false;
			
			if(mouseAction == 'up') {
				this.saveToHistory();
			}
		}
		if (mouseAction == 'move') {
			if (this.flag) {
				this.prevX = this.currX;
				this.prevY = this.currY;
				//this.currX = e.clientX - c.offsetLeft;
				//this.currY = e.clientY - c.offsetTop;
				this.currX = e.pageX - canvasOffset.left;
				this.currY = e.pageY - canvasOffset.top;
				this.draw();
			}
		}
	},
	getOffset: function(elem) {
		if(!elem) elem = this;

		var x = elem.offsetLeft;
		var y = elem.offsetTop;

		while (elem = elem.offsetParent) {
			x += elem.offsetLeft;
			y += elem.offsetTop;
		}
		return { left: x, top: y };
	}
};

$.fn.ezSketch = function(options) {
	//var canvas = document.getElementById(domId);
	var canvas = this[0];
	
	g_sketchController.canvas = canvas;
	g_sketchController.ctx = canvas.getContext("2d");

//	canvas.addEventListener("mouseleave", function (e) {
//		g_sketchController.findxy('move', e);
//	}, false);
    canvas.addEventListener("mousemove", function (e) {
    	g_sketchController.findxy('move', e);
    }, false);
    canvas.addEventListener("mousedown", function (e) {
    	g_sketchController.findxy('down', e);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
    	g_sketchController.findxy('up', e);
    }, false);
    canvas.addEventListener("mouseout", function (e) {
    	g_sketchController.findxy('out', e);
    }, false);
    
    // fail! for 'this' inside the g_sketchController.setStrokeColor()
    //this.setStrokeColor = g_sketchController.setStrokeColor;
    
    this.setStrokeColor = function(colorCode) {
    	g_sketchController.setStrokeColor(colorCode);
    };
    this.setStrokeWidth = function(w) {
    	g_sketchController.setStrokeWidth(w);
    };
    this.setHistorySize = function(size) {
    	g_sketchController.setHistorySize(size);
    };
    this.useEraser = function(isEnable) {
    	g_sketchController.useEraser(isEnable);
    };
    this.save = function() {
    	return g_sketchController.save();
    };
    this.undo = function() {
    	return g_sketchController.undo();
    };
    this.redo = function() {
    	return g_sketchController.redo();
    };
    this.clear = function() {
    	g_sketchController.clear();
    };
    
    if(options) {
    	if(options.strokeWidth) g_sketchController.strokeWidth = options.strokeWidth;
    	if(options.strokeColor) g_sketchController.strokeColor = options.strokeColor;
    }
    
    // add empty state to history
    g_sketchController.saveToHistory();
    
    return this;
};

