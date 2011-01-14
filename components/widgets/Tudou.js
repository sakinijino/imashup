dojo.provide("imashup.components.widgets.Tudou");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.widgets.Tudou",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/tudou_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/tudou_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/Tudou.html"),
		
		resizable: false,
		maxable: false,
		width: 400,
		height: 400,
		
		imashup_human_name: "Tudou",
		imashup_catergories: ['Search'],
		
		inputnode: null,
		result: null,
		keyword: "",
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onSubmit: function(){
			if (!this.inputNode.value || this.inputNode.value == "") {
				return;
			}
			this.searchVideo(this.inputNode.value);
		},
		
		searchVideo: function(/* String */ keywd) {
			this.keyword = keywd;
			var _url = 'http://api.tudou.com/v3'
      if (imashup.configs && imashup.configs.proxy) 
        _url = imashup.configs.proxy[_url] ? imashup.configs.proxy[_url] : _url 
      _url+="/gw";
			var self = this;
			var jsonArgs = {
				url: _url,
				content: {
					method: "item.search",
					appKey: "ec8f6ad9c2337c54",
					format: "json",
					kw: self.keyword,
					sort: "s",
					pageSize: "5"
				},
				load: function(response, ioArgs) {
					//Set the data from the search into the viewbox in nicely formatted JSON
					self.searchResult = dojo.fromJson(response).multiPageResult;
					self.displayResult();
				},
				error: function(response, ioArgs) {
					console.log("An unexpected error occurred");
				}
			}
			dojo.xhrGet(jsonArgs);
		},

		displayResult: function(/* String */jsonArg) {
			//console.log(this.searchResult);
			for(var i = 0; i < this.searchResult.results.length; i++) {
			
				var _content = "<img src='" + this.searchResult.results[i].picUrl + "' style='height:50px; float:left'/>"
				_content += "<span style='font-size:120%; font-weight: 700'>" + this.searchResult.results[i].title + "</span><br/>";
				_content += "Length:" + parseInt(this.searchResult.results[i].totalTime / 60000) + ":" 
					+ parseInt(this.searchResult.results[i].totalTime / 1000) % 60;
				_content += "&nbsp;&nbsp;&nbsp;&nbsp;Owner:" + this.searchResult.results[i].ownerNickname;
				_content += "<br/>Date:" + this.searchResult.results[i].pubDate;
				var _style = "width:380px; height: 60px; background-color:white; vertical-align: middle";
				_style += "padding:3px; overflow:hidden"
				var func = "imashup.core.instanceManager.byId('" + this.id + "').showVideo(" + i + ", event)";
				
				dojo.create("button", {
					onClick: func,
					style: _style,
					innerHTML: _content
				}, this.resultPane)
			}
			var infoMsg = "Result: "
			infoMsg += (this.searchResult.page.pageNo * 5) - 4
			infoMsg += " - " + this.searchResult.page.pageNo*5;
			infoMsg += " of " + this.searchResult.page.totalCount + " results in total.";
			this.resultInfo.innerHTML = infoMsg;
			if(this.searchResult.page.pageNo == 1)
				this.prevButton.disabled = true;
			else
				this.prevButton.disabled = false;
			if(this.searchResult.page.pageNo == this.searchResult.page.pageCount)
				this.nextButton.disabled = true;
			else
				this.nextButton.disabled = false;
		},
		
		showVideo: function(/* int */ i, /* mouseEvent */e) {
			// Create a floating pane to display the video
			var _width = 400;
			var _height = 300;
			var style = "width:" + (_width + 15) + "px; height:" + (_height + 45) + "px";
			var content = "<iframe width=" + _width + "px height=" + _height + "px style='margin:5px' src='" 
				+ this.searchResult.results[i].outerPlayerUrl + "'></iframe>";
			var videoPane = new dojox.layout.FloatingPane({
				maxable: false,
				resizable: false,
				closeable: true,
				title: this.searchResult.results[i].title,
				dockable: true,
				style:style})
			videoPane.setContent(content);
			dijit.byId("desktop").addChild(videoPane);
			videoPane.startup();
      videoPane.domNode.style.left = e.clientX + "px";
      videoPane.domNode.style.top= e.clientY + "px";
			videoPane.bringToTop();
		},
		
		prevPage: function() {
			this.resultPane.innerHTML = "";
			var _url = 'http://api.tudou.com/v3'
      if (imashup.configs && imashup.configs.proxy) 
        _url = imashup.configs.proxy[_url] ? imashup.configs.proxy[_url] : _url 
      _url+="/gw";
			var self = this;
			var jsonArgs = {
				url: _url,
				content: {
					method: "item.search",
					appKey: "ec8f6ad9c2337c54",
					format: "json",
					kw: self.keyword,
					pageNo: self.searchResult.page.pageNo - 1,
					sort: "s",
					pageSize: "5"
				},
				load: function(response, ioArgs) {
					//Set the data from the search into the viewbox in nicely formatted JSON
					self.searchResult = dojo.fromJson(response).multiPageResult;
					self.displayResult();
				},
				error: function(response, ioArgs) {
					console.log("An unexpected error occurred");
				}
			}
			dojo.xhrGet(jsonArgs);
		},
		
		nextPage: function() {
			this.resultPane.innerHTML = "";
			var _url = 'http://api.tudou.com/v3'
      if (imashup.configs && imashup.configs.proxy) 
        _url = imashup.configs.proxy[_url] ? imashup.configs.proxy[_url] : _url 
      _url+="/gw";
			var self = this;
			var jsonArgs = {
				url: _url,
				content: {
					method: "item.search",
					appKey: "ec8f6ad9c2337c54",
					format: "json",
					kw: self.keyword,
					pageNo: self.searchResult.page.pageNo + 1,
					sort: "s",
					pageSize: "5"
				},
				load: function(response, ioArgs) {
					//Set the data from the search into the viewbox in nicely formatted JSON
					self.searchResult = dojo.fromJson(response).multiPageResult;
					self.displayResult();
				},
				error: function(response, ioArgs) {
					console.log("An unexpected error occurred");
				}
			}
			dojo.xhrGet(jsonArgs);
		},
		
		searchAndDisplay: function(/* String */ keywd) {
			this.keyword = keywd;
			var _url = 'http://api.tudou.com/v3'
      if (imashup.configs && imashup.configs.proxy) 
        _url = imashup.configs.proxy[_url] ? imashup.configs.proxy[_url] : _url 
      _url+="/gw";
			var self = this;
			var jsonArgs = {
				url: _url,
				content: {
					method: "item.search",
					appKey: "ec8f6ad9c2337c54",
					format: "json",
					kw: self.keyword,
					sort: "s",
					pageSize: "5"
				},
				load: function(response, ioArgs) {
					//Set the data from the search into the viewbox in nicely formatted JSON
					self.searchResult = dojo.fromJson(response).multiPageResult;
					self.displayResult();
					if(self.searchResult.results[0] != null)
						self.showVideo(0);
				},
				error: function(response, ioArgs) {
					console.log("An unexpected error occurred");
				}
			}
			dojo.xhrGet(jsonArgs);
		}
	}

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.Tudou',
    interface: {
        properties: {},
        methods: {
			"searchVideo": { Function: "searchVideo", CustomMethod: "/* arguments[0]: String */" },
			"searchAndDisplay": { Function: "searchAndDisplay", CustomMethod: "/* arguments[0]: String */" }
		},
        events: {}
    },
    mixin_types : ['window']
});
