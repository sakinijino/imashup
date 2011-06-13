dojo.provide("imashup.components.crcc.BaseChart");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.crcc.BaseChart",
    [dijit._Widget, dijit._Templated],
    {
		templatePath: dojo.moduleUrl("imashup.components.crcc", "templates/Chart.html"),
		
		resizable: false,
		maxable: false,
		width: 300,
		height: 250,
		
		imashup_catergories: ['Widgets'],
		
		inputnode: null,
		canvas:null,
		data:[],
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
      this.onsubmit();
		},
		
    onset: function(){
      dojo.query("button", this.inputContainer)[0].style.display = "none"; 
      dojo.query("input", this.inputContainer)[0].style.display = ""; 
      dojo.query("button", this.inputContainer)[1].style.display = ""; 
    },
		
		onsubmit: function(){
      dojo.query("button", this.inputContainer)[0].style.display = ""; 
      dojo.query("input", this.inputContainer)[0].style.display = "none"; 
      dojo.query("button", this.inputContainer)[1].style.display = "none"; 
			this.setChart(eval(this.inputnode.value));
		},
		
		setChart: function(d){
			this.data = d;
			this.draw();
    },
		
		draw : function(){
		},
		
		handleChartClick : function  ( clickEvent ) {
  	},
		
		onclick : function(){
		}
});
