var $g_canvas = null;

var g_activeController = {
	$strokeColor: null,
	$strokeWidth: null,
	$strokeWidthRanger: null,
	$strokeWidthRangerValue: null,
	$eraser: null,
	removeAllActiveOfStrokeColor: function() {
		this.$strokeColor = this.$strokeColor || $("#strokeColor a");
		this.$strokeColor.removeClass("actived");
	},
	removeAllActiveOfStrokeWidth: function() {
		this.$strokeWidth = this.$strokeWidth || $("#strokeWidth a");
		this.$strokeWidth.removeClass("actived");
	},
	removeRangerActive: function() {
		this.$strokeWidthRangerValue = this.$strokeWidthRangerValue || $("#strokeWidthRangerValue");
		this.$strokeWidthRangerValue.removeClass("actived");
	},
	removeEraserActive: function() {
		this.$eraser = this.$eraser || $(".eraser");
		this.$eraser.removeClass("actived");
	},
	addActive: function($dom) {
		$dom.addClass("actived");
	},
	removeActive: function($dom) {
		$dom.removeClass("actived");
	},
	setStrokeWidthByRanger: function(width) {
		this.$strokeWidthRanger = this.$strokeWidthRanger || $("#strokeWidthRanger");
		this.$strokeWidthRangerValue = this.$strokeWidthRangerValue || $("#strokeWidthRangerValue");
		this.$strokeWidthRanger.val(width);
		this.$strokeWidthRangerValue.val(width+"px");
	}
};

$(function(){
	
	$g_canvas = $("#canvas");
	$g_canvas.ezSketch({
		strokeWidth: 10,
		strokeColor: "black",
		strokeCallback: function(evt) {
			$("#drawAreaErrMsg").hide();
		}
	});
	
	$("#strokeWidth a").each(function(i) {
		$(this).click(function() {
			g_activeController.removeAllActiveOfStrokeWidth();
			g_activeController.removeRangerActive();
			g_activeController.addActive($(this));
			$g_canvas.useEraser(false);
			var width = $(this).text();
			$g_canvas.setStrokeWidth(width);
			g_activeController.setStrokeWidthByRanger(width);
		});
	});

	$("#strokeColor a").each(function(i) {
		$(this).click(function() {
			g_activeController.removeAllActiveOfStrokeColor();
			g_activeController.removeEraserActive();
			g_activeController.addActive($(this));
			$g_canvas.useEraser(false);
			$g_canvas.setStrokeColor($(this).css('background-color'));
		});
	});
	
	// stroke ranger
	$("#strokeWidthRanger").bind({
		mousedown: function() {
			g_activeController.removeAllActiveOfStrokeWidth();
			g_activeController.addActive($("#strokeWidthRangerValue"));
		},
		mousemove: function() {
			var width = $(this).val();
			$("#strokeWidthRangerValue").val(width+"px");
		},
		change: function() {
			var width = $(this).val();
			$.log("set stroke-size: " + width);
			$g_canvas.setStrokeWidth(width);
		}
	});
	
	$(".stroke").click(function() {
		g_activeController.removeAllActiveOfStrokeColor();
		g_activeController.addActive($(this));
		$g_canvas.useEraser(false);
	});
	$(".eraser").click(function() {
		g_activeController.removeAllActiveOfStrokeColor();
		g_activeController.addActive($(this));
		$g_canvas.useEraser(true);
	});
	
	$("#undo").bind({
		mousedown: function() {
			$(this).toggleClass("canNotUndo");
		}, 
		mouseup: function() {
			//$(this).addClass("canNotUndo canUndo");// why cannot use toggleClass()?
			$(this).toggleClass("canNotUndo");
		},
		click: function() {
			$g_canvas.undo();
		}
	});
	$("#redo").bind({
		mousedown: function() {
			$(this).toggleClass("canNotRedo");
		}, 
		mouseup: function() {
			$(this).addClass("canNotRedo canRedo");
		},
		click: function() {
			$g_canvas.redo();
		}
	});
	
	$("#clear").click(function() {
		$g_canvas.clear();
	});

	$("#save").click(function() {
		var dataUrl = $g_canvas.save();
		alert(dataUrl);
	});


});

