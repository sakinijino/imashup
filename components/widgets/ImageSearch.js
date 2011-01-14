dojo.provide("imashup.components.widgets.ImageSearch");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");
dojo.require("dijit.form.Button");

dojo.declare(
    "imashup.components.widgets.ImageSearch",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/imagesearch_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/imagesearch_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/ImageSearch.html"),
		
		resizable: false,
		maxable: false,
		width: 600,
		height: 200,
		
		imashup_human_name: "Google Images",
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
				this.searchImage(this.inputNode.value);
			}
		},
		
		searchImage: function(/* String */ keywd) {
			this.keyword = keywd;
			this.sendRequest(keywd, 0);
			this.prevPageButton.disabled = true;
		},
		
		sendRequest: function(/* String */keywd, /* int */_start) {
			var self = this;
      var url = 'http://ajax.googleapis.com/ajax/services/search'
      if (imashup.configs && imashup.configs.proxy) 
        url = imashup.configs.proxy[url] ? imashup.configs.proxy[url] : url 
			var jsonArgs = {
				url: url+'/images',
				content: {
					q: keywd,
					v: "1.0",
					key: "ABQIAAAAdctDWn12nbO3SPG6oZiHPBT2yXp_ZAY8_ufC3CFXhHIE1NvwkxR31NyxYblcoLcwxkwN5NJi_KEXkA",
					rsz: 4,
					start: _start
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
			this.photoContainer.innerHTML = "";
			var results = this.searchResult.responseData.results;
			for(var i = 0; i < results.length; i++) {
				var dialogContent = "<div style='margin:10px'>"
					+ results[i].title
					+ "<br/><img src='" + results[i].url + "' onclick:'" + func + "'/>"
					+ "</div>";
				var dialog = new dijit.TooltipDialog({
					content: dialogContent
				});
				var func = "imashup.core.instanceManager.byId('" + this.id + "').showPhoto(" + i + ")";
				var _content = "<div style='width:100px; height:100px; text-align:center; overflow:hidden'>"
					+ "<img align=center style='width:100%; height:100%' src='" + results[i].tbUrl + "'/></div>";
				var button = new dijit.form.DropDownButton({
					label: _content,
					dropDown: dialog
				});
				this.photoContainer.appendChild(button.domNode);
			}
			
			var index = this.searchResult.responseData.cursor.currentPageIndex - 1;
			if(index == 0)
				this.prevPageButton.disabled = true;
			else
				this.prevPageButton.disabled = false;
				
			if(index == 7)
				this.prevPageButton.disabled = false;
			else
				this.prevPageButton.disabled = true;
		},
		
		showPhoto: function(/* int */i) {

		},
		
		prevPage: function() {
			var index = this.searchResult.responseData.cursor.currentPageIndex - 1;
			this.sendRequest(this.keyword, this.searchResult.responseData.cursor.pages[index].start);
		},
		
		nextPage: function() {
			var index = this.searchResult.responseData.cursor.currentPageIndex + 1;
			this.sendRequest(this.keyword, this.searchResult.responseData.cursor.pages[index].start);
		}
	}

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.ImageSearch',
    interface: {
        properties: {},
        methods: {
			"searchImage": { Function: "searchImage", CustomMethod: "/* arguments[0]: String */" }
		},
        events: {}
    },
    mixin_types : ['window']
});
