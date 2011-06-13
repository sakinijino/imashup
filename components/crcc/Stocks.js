dojo.provide("imashup.components.crcc.Stocks");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.crcc.Stocks",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/stocks_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/stocks_small.png"),
		templatePath: dojo.moduleUrl("imashup.components.crcc", "templates/Stocks.html"),
		bgPath: dojo.moduleUrl("imashup.components.crcc", "templates/stocks_bg.jpg"),
		stockboxPath: dojo.moduleUrl("imashup.components.crcc", "templates/stocks_box.png"),
		
		resizable: false,
		maxable: false,
		width: 300,
		height: 250,
		
		imashup_human_name: "Stocks",
		imashup_catergories: ['Widgets'],
		
		inputnode: null,
		inputContainer: null,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
      this.inputnode.value = "sh601186";
      this.reportnode.style.background = "url("+this.stockboxPath+") repeat-x scroll center center";
      this.onsubmit();
		},

    onset: function(){
      dojo.query("button", this.inputContainer)[0].style.display = "none"; 
      dojo.query("input", this.inputContainer)[0].style.display = ""; 
      dojo.query("button", this.inputContainer)[1].style.display = ""; 
    },
		
		onsubmit: function(){
			var num = this.inputnode.value;
      dojo.query("button", this.inputContainer)[0].style.display = ""; 
      dojo.query("input", this.inputContainer)[0].style.display = "none"; 
      dojo.query("button", this.inputContainer)[1].style.display = "none"; 
			this.setNumber(num);
		},
		
		setNumber: function(num){
			var _this = this;
      var url = 'http://hq.sinajs.cn'
      if (imashup.configs && imashup.configs.proxy) 
        url = imashup.configs.proxy[url] ? imashup.configs.proxy[url] : url; 
      dojo.xhrGet({
          url: url+"/list=" + num,
          timeout:5000,
          handleAs:"text",
          load: function(response, ioargs){
            if(response){
              _this.setData(response, num);
            }
          },
          error: function(){
            _this.errornum.innerHTML = num;
            _this.errornode.style.display = "block";
            _this.reportnode.style.display = "none";
          }
        });
    },

    setData: function(data, num){
      var data = data.substring(data.search('"')+1, data.length-3).split(",");
      var name = data[0];
      var curprice = data[3];
      var opprice = data[1];
      var spread = curprice - opprice;
      var rate = (spread / opprice * 100).toFixed(2);
      var date = data[30] + ' ' + data[31];

      this.name.innerHTML = name;
      this.number.innerHTML = num.substring(2);
      this.price.innerHTML = curprice;
      this.rate.innerHTML = rate + "%";
      this.date.innerHTML = date;

      if (rate > 0) this.dataPanel.className = "data up"
      else if (rate < 0) this.dataPanel.className = "data down"
      else this.dataPanel.className = "data"
      
      this.errornode.style.display = "none";
      this.reportnode.style.display = "block";
    }
   }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.crcc.Stocks',
    interface: {
        properties: {},
        methods: {
			"setNumber": { Function: "setNumber", CustomMethod: "/* arguments[0]: String */" }
		},
        events: {}
    },
    mixin_types : ['window']
});
