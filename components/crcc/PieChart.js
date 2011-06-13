dojo.provide("imashup.components.crcc.PieChart");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.components.crcc.BaseChart");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.crcc.PieChart",
    [imashup.components.crcc.BaseChart],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/piechart_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/piechart_small.png"),
		
		imashup_human_name: "Pie Chart",
		
		draw : function(){
			var myColor = ["#ECD078","#D95B43","#C02942","#542437","#53777A"];
			var myData = this.data;
			function getTotal(myData){
				var myTotal = 0;
				for (var j = 0; j < myData.length; j++) {
					myTotal += (typeof (myData[j].value) == 'number') ? myData[j].value : 0;
				}
				return myTotal;
			}
			var canvas;
			var ctx;
			var lastend = 0;
			var myTotal = getTotal(myData);
      var h = 80; var w = 100;

			canvas = this.canvas;
			ctx = canvas.getContext("2d");
			ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px sans-serif'

			for (var i = 0; i < myData.length; i++) {
				ctx.fillStyle = myColor[i%5];
				ctx.beginPath();
				ctx.moveTo(w,h);
				ctx.arc(w,h,70,lastend,lastend+
					(Math.PI*2*(myData[i].value/myTotal)),false);
				ctx.fill();
				middleAngle = lastend+(Math.PI*(myData[i].value/myTotal));
				var mx = w + 45*Math.cos(middleAngle);
				var my = h + 45*Math.sin(middleAngle);
				ctx.beginPath();
				ctx.lineWidth=1;
				ctx.moveTo(mx,my);
				ctx.fillStyle = '#000000';
				var isLeft = mx>w ? false : true;
				mx += mx>w?30:-30;
				ctx.lineTo(mx,my);
				mx -= isLeft ? ctx.measureText(myData[i].name).width+2 : -2;
				ctx.fillText(myData[i].name,mx,my+5);
				ctx.stroke();
				lastend += Math.PI*2*(myData[i].value/myTotal);
			}
		},
		
		handleChartClick : function  ( clickEvent ) {
      var centreX = 80; var centreY = 100;
			var chartRadius = 60;
			var chartData = this.chartData;		//need handle

		  // Get the mouse cursor position at the time of the click, relative to the canvas
		  var mouseX = clickEvent.pageX - this.canvas.offsetLeft;
		  var mouseY = clickEvent.pageY - this.canvas.offsetTop;

		  // Was the click inside the pie chart?
		  var xFromCentre = mouseX - centreX;
		  var yFromCentre = mouseY - centreY;
		  var distanceFromCentre = Math.sqrt( Math.pow( Math.abs( xFromCentre ), 2 ) + Math.pow( Math.abs( yFromCentre ), 2 ) );

		  if ( distanceFromCentre <= chartRadius ) {

		    // Yes, the click was inside the chart.
		    // Find the slice that was clicked by comparing angles relative to the chart centre.

		    var clickAngle = Math.atan2( yFromCentre, xFromCentre ) - chartStartAngle;
		    if ( clickAngle < 0 ) clickAngle = 2 * Math.PI + clickAngle;
		                
		    for ( var slice in chartData ) {
		      if ( clickAngle >= chartData[slice]['startAngle'] && clickAngle <= chartData[slice]['endAngle'] ) {

		        // Slice found. Pull it out or push it in, as required.
		        //toggleSlice ( slice );
		        this.onclick(chartData[slice].name);
		        return;
		      }
		    }
		  }
  	},
		
		onclick : function(){
		}


});

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.crcc.PieChart',
    interface: {
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
