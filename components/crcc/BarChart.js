dojo.provide("imashup.components.crcc.BarChart");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.components.crcc.BaseChart");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.crcc.BarChart",
    [imashup.components.crcc.BaseChart],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/barchart_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/barchart_small.png"),
		
		imashup_human_name: "Bar Chart",
		
		draw : function(){
      var height=200;
      var width=200;
      var values = this.data;

      var yMargin = 25; //margin on top and bottom
      var xMargin = 10; //margin left and right and beetween bars
      var barMaxHeight = height - yMargin * 2; //maximum bar height depending on canvas height
      var barWidth = (width - (values.length + 2) * xMargin) / values.length; //width of bar depending on canvas width
      var yBarStartPoint = height - yMargin; //position where the bars start

      var xMiddleOfDiagram = (xMargin + xMargin * values.length + barWidth * values.length)/2
      var biggestValue = values[0].value;
      for (var i=1; i<values.length; ++i) if (values[i].value > biggestValue) biggestValue = values[i].value

      var context = this.canvas.getContext('2d');
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      context.font='14px sans-serif' 
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowBlur = 10;
      context.shadowColor = "rgba(64, 64, 64, 0.5)";

			for (var i = 0; i < values.length; i++) {
        var label = values[i].name;
        var value = values[i].value;

        var barHeight = (value / biggestValue) * barMaxHeight;
        var xMiddleOfBar = barWidth / 2 + xMargin + xMargin * i + barWidth * i;
        var yMiddleOfBar = yBarStartPoint - barHeight / 2;

        context.fillStyle = "#B2C9F1";
        context.fillRect (xMargin + xMargin * i + barWidth * i, yBarStartPoint, barWidth, barHeight * -1);
        context.fillStyle = "#000"; context.textBaseline = 'top'; context.textAlign = 'center'; 
        context.fillText(label, xMiddleOfBar , yBarStartPoint - barHeight - 16);
        context.fillText(value, xMiddleOfBar , yMiddleOfBar-8);
      }
		},
		
		handleChartClick : function  ( clickEvent ) {
  	},
		
		onclick : function(){
		}


});

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.crcc.BarChart',
    "interface": {
      properties: {},
      methods: {
				"setChart": { Function: "setChart", CustomMethod: "/* arguments[0]: String */" }
			},
      events: {
      	"click": { Function: "onclick", CustomMethod: "/* arguments[0]: String */" }
      }
    },
    mixin_types : ['window']
});
