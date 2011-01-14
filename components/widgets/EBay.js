dojo.provide("imashup.components.widgets.EBay");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");
dojo.require("dijit.form.DropDownButton");
dojo.require("dijit.TooltipDialog");

dojo.declare(
    "imashup.components.widgets.EBay",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/ebay_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/ebay_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/EBay.html"),
		
		resizable: false,
		maxable: false,
		width: 450,
		height: 400,
		
		imashup_human_name: "EBay",
		imashup_catergories: ['Search'],
		
		inputNode: null,
		
		keyword: "",
		searchResult: null,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onSubmit: function(){
			if (this.inputNode.value && this.inputNode.value != "") {
				this.searchItem(this.inputNode.value);
			}
		},
		
		searchItem: function(/* String */ keywd) {
			this.keyword = keywd;
			this.sendRequest(keywd, 1);
		},
		
		sendRequest: function(/* String */ keywd, /* int */page) {
			var self = this;
      var url = 'http://svcs.ebay.com/services'
      if (imashup.configs && imashup.configs.proxy) 
        url = imashup.configs.proxy[url] ? imashup.configs.proxy[url] : url 

			var _url = url+"/search/FindingService/v1?"
					+ "GLOBAL-ID=EBAY-US"
					+ "&OPERATION-NAME=findItemsAdvanced"
					+ "&SERVICE-VERSION=1.0.0"
					+ "&SECURITY-APPNAME=DaimengW-0340-44ab-93fe-6d3ccc7b9741"
					+ "&RESPONSE-DATA-FORMAT=JSON"
					+ "&REST-PAYLOAD"
					+ "&keywords=" + keywd
					+ "&paginationInput.entriesPerPage=10"
					+ "&paginationInput.pageNumber=" + page;
					//+ "&descriptionSearch=true";
					
			if (this.countryNode.value != "") {
				_url += "&itemFilter(0).name=LocatedIn&itemFilter(0).value=" + this.countryNode.value;
			}
			if (this.postalNode.value != "") {
				_url += "&buyerPostalCode=" + this.postalNode.value
					+ "&sortOrder=DistanceNearest";
			}
			var jsonArgs = {
				url: _url,
				content: {
				},
				load: function(response, ioArgs) {
					//Set the data from the search into the viewbox in nicely formatted JSON
					self.searchResult = dojo.fromJson(response);
					self.displayResult();
				},
				error: function(response, ioArgs) {
					console.log("An unexpected error occurred");
				}
			}
			dojo.xhrGet(jsonArgs);
		},
		
		displayResult: function() {			
			var results = this.searchResult.findItemsAdvancedResponse[0].searchResult[0];
			this.resultContainer.innerHTML = "";
			this.resultInfo.innerHTML = "";
			
			if(results["@count"] == 0) {
				this.prevPageButton.disabled = true;
				this.nextPageButton.disabled = true;
				this.resultInfo.innerHTML = "Not found.";
				this.prevPageButton.disabled = true;
				this.nextPageButton.disabled = true;
				return;
			}
			
			for(var i = 0; i < results.item.length; i++) {
				var _content = "<img src='" + results.item[i].galleryURL[0] + "' style='height:70px; width:70px; float:left'/>"
					+ "<span style='font-size:120%; font-weight: 700'>" + results.item[i].title[0] + "</span><br/>"
					+ "Location:" + results.item[i].location[0]
					+ "&nbsp;&nbsp;&nbsp;&nbsp;Country:" + results.item[i].country[0]
					+ "<br/>Category:" + results.item[i].primaryCategory[0].categoryName[0]
				var _style = "width:420px; height: 80px; background-color:white; vertical-align: middle"
					+ "padding:3px; overflow:hidden";
				var func = "imashup.core.instanceManager.byId('" + this.id + "').showItem(" + i + ", event)";
				
				this.EveryItemName(results.item[i].title[0]);
				this.EveryItemLocation(results.item[i].location[0]);
				this.EveryItemCountry(results.item[i].country[0]);
				this.EveryItemInfo({
					"Name": results.item[i].title[0],
					"Location": results.item[i].location[0],
					"Country": results.item[i].country[0]
				});
				
				dojo.create("button", {
					onClick: func,
					style: _style,
					innerHTML: _content
				}, this.resultContainer)
			}
			var pageMsg = this.searchResult.findItemsAdvancedResponse[0].paginationOutput[0];
			var infoMsg = "Result: "
				+ ((pageMsg.pageNumber[0] - 1) * pageMsg.entriesPerPage[0] + 1)
				+ " - " + (pageMsg.pageNumber[0] * pageMsg.entriesPerPage[0])
				+ " of " + pageMsg.totalEntries[0] + " results in total.";
			this.resultInfo.innerHTML = infoMsg;
			
			if(pageMsg.pageNumber[0] == 1)
				this.prevPageButton.disabled = true;
			else
				this.prevPageButton.disabled = false;
				
			if(pageMsg.pageNumber[0] == pageMsg.totalPages[0])
				this.nextPageButton.disabled = true;
			else
				this.nextPageButton.disabled = false;
		},
		
		showItem: function(/* int */i, /* mouseEvent */e) {
			var results = this.searchResult.findItemsAdvancedResponse[0].searchResult[0];
			
			this.ItemName(results.item[i].title[0]);
			this.ItemLocation(results.item[i].location[0]);
			this.ItemCountry(results.item[i].country[0]);
			this.ItemInfo({
				"Name": results.item[i].title[0],
				"Location": results.item[i].location[0],
				"Country": results.item[i].country[0]
			});
			
			var _width = 350;
			var _height = 300;
			var _style = "width:" + (_width + 20) + "px; height:" + (_height + 20) + "px";
			var _content = "<div style='margin:10px'>"
				+ "<img style='float:left; margin:5px' src='" + results.item[i].galleryURL[0] + "'/>"
				+ "<div><h2>";
			if (results.item[i].condition[0].conditionDisplayName[0] == "New")
				_content += "<span style='color:red'>[NEW]</span>"
			_content += results.item[i].title[0] + "</h2>"
				+ "<span style='font-size:120%>" + results.item[i].sellingStatus[0].currentPrice[0].__value__
				+ " " + results.item[i].sellingStatus[0].currentPrice[0]["@currencyId"] + "</span><br/>";
			if (results.item[i].listingInfo[0].buyItNowAvailable[0] == "true")
				_content += "<span style='font-size:120%; color:blue'><b>But It Now for " 
					+ results.item[i].listingInfo[0].buyItNowPrice[0].__value__
					+ " " + results.item[i].listingInfo[0].buyItNowPrice[0]["@currencyId"]
					+ "</b></span>";
			_content += "</div><table><tbody><tr><td style='width:100px'>Location:</td><td style='width:280px'>" + results.item[i].location[0]
				+ "</td></tr><tr><td>Country:</td><td>" + results.item[i].country[0]
				+ "</td></tr><tr><td>Postal Code:</td><td>:" + results.item[i].postalCode[0]
				+ "</td></tr><tr><td>Category:</td><td>" + results.item[i].primaryCategory[0].categoryName[0]
				+ "</td></tr><tr><td>Start Time:</td><td>:" + results.item[i].listingInfo[0].startTime[0] 
				+ "</td></tr><tr><td>End Time:</td><td>:" + results.item[i].listingInfo[0].endTime[0]
				+ "</td></tr></tbody></table>";
			
			var floatingPane = new dojox.layout.FloatingPane({
				maxable: false,
				resizable: false,
				closeable: true,
				title: "Item Info",
				dockable: true,
				style: _style,
				content: _content
			})
			dijit.byId("desktop").addChild(floatingPane);
      floatingPane.startup();
      floatingPane.domNode.style.left = e.clientX + "px";
      floatingPane.domNode.style.top= e.clientY + "px";
			floatingPane.bringToTop();
		},
		
		prevPage: function() {
			this.sendRequest(
				this.keyword, 
				parseInt(this.searchResult.findItemsAdvancedResponse[0].paginationOutput[0].pageNumber[0]) - 1
			);
		},
		
		nextPage: function() {
			this.sendRequest(
				this.keyword, 
				parseInt(this.searchResult.findItemsAdvancedResponse[0].paginationOutput[0].pageNumber[0]) + 1
			);
		},
		
		setCountry: function(/* String */country) {
			this.countryNode.value = country;
		},
		
		setPostalCode: function(/* String */postalcode) {
			this.postalNode.value = postalcode;
		},
		
		ItemLocation: function(/* String */location) {
		},
		
		ItemCountry: function(/* String */country) {
		},
		
		ItemName: function(/* String */name) {
		},
		
		ItemInfo: function(/* Object */obj) {
		},
		
		EveryItemLocation: function(/* String */location) {
		},
		
		EveryItemCountry: function(/* String */country) {
		},
		
		EveryItemName: function(/* String */name) {
		},
		
		EveryItemInfo: function(/* Object */obj) {
		}
	}

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.EBay',
    interface: {
        properties: {},
        methods: {
          "searchItem": { Function: "searchItem", CustomMethod: "/* arguments[0]: String */" },
          "setCountry": { Function: "setCountry", CustomMethod: "/* arguments[0]: String */" },
          "setPostalCode": { Function: "setPostalCode", CustomMethod: "/* arguments[0]: String */" },
        },
        events: {
          "ItemLocation": { Function: "ItemLocation", CustomMethod: "/* arguments[0]: String */" },
          "ItemCountry": { Function: "ItemCountry", CustomMethod: "/* arguments[0]: String */" },
          "ItemName": { Function: "ItemName", CustomMethod: "/* arguments[0]: String */" },
          "ItemInfo": { Function: "ItemInfo", CustomMethod: "/* arguments[0]: { Name: String, Location: String, Country: String } */" },
          "EveryItemLocation": { Function: "EveryItemLocation", CustomMethod: "/* arguments[0]: String */" },
          "EveryItemCountry": { Function: "EveryItemCountry", CustomMethod: "/* arguments[0]: String */" },
          "EveryItemName": { Function: "EveryItemName", CustomMethod: "/* arguments[0]: String */" },
          "EveryItemInfo": { Function: "EveryItemInfo", CustomMethod: "/* arguments[0]: { Name: String, Location: String, Country: String } */" },
        }
      },
      mixin_types : ['window']
    });
