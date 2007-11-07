/*vaporClouds*/
dojo.provide("imashup.toolpanels.Docklet");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.widget.FisheyeList");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.ContentPane");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels.Docklet",
    [dijit._Widget, dijit._Templated],
    {
        widgetsInTemplate: true,
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet.html"),

        dockItems: [],

        postCreate: function(){
            this.container.style.border="solid black 2px";
            this.inherited("postCreate", arguments);
        },
        	
        addItem: function(impl_name){
        	var module, path, _this = this;
     		module = impl_name.match(/[^\.]+\.[^\..*]+/g);
     		if(module.length!=1) return false; 
    		module = module[0];
        	path = ["templates/",impl_name.substr(module.length+1),"_large.png"].join("");
			
         	var newItem = new dojox.widget.FisheyeListItem();
			newItem.label=impl_name;
         	newItem.iconSrc=dojo.moduleUrl(module, path).toString();
         	newItem.onClick = function(){_this.launchItem(newItem.label);};
        	newItem.postCreate();
        	this.dockTable.addChild(newItem);
        	this.dockItems.push(newItem);
        	
			newItem.startup();
        	this.dockTable.startup();
			this.onItemAdd(impl_name);
			return true;
        },
        
        removeItem: function(impl_name){
        	var index;
        	for (index = 0 ; index < this.dockItems.length; index ++)
        		if (this.dockItems[index].label == impl_name) break;
        	if (index < this.dockItems.length){
	        	this.dockItems[index].destroy();
	        	this.dockItems.splice(index,1);
	        	this.dockTable.startup();
		        this.onItemDelete(impl_name);
	        	return true;
	        }else{
	        	return false;
	        }
        },
        
        launchItem: function(impl_name){
        	return imashup.core.instanceManager.create(impl_name,{},null); 
        },
        		
        configure: function(){
        	this.dlgcon.destroyDescendants();
        	this.dlgcon.domNode.innerHTML = "";
        	var table = document.createElement("table");
			var _this = this;
        	imashup.core.componentTypeManager.forEach(function(impl_name,impl){  		
        		var tr = document.createElement("tr");
        		var cbx=new dijit.form.CheckBox({name:impl_name});
        		var label = document.createElement("label");
        		label.for = impl_name;
        		label.innerHTML = impl_name;
        		tr.appendChild(cbx.domNode);
        		tr.appendChild(label);
        		table.appendChild(tr);
        		
        		cbx.onChange = function(e){
        			if(this.checked) _this.addItem(impl_name);
        			else 			 _this.removeItem(impl_name);
        		}
        		cbx.startup();
        	});
        	this.dlgcon.domNode.appendChild(table);
        	this.dlgcon.startup();
        	this.dlg.show();
        },
        	
        saveChanged: function(){
        	
        },
        
        cancelChanged: function(){
        	this.dig.hide();
		},
			        	
        onItemAdd: function(impl_name){
        },
        
        onItemDelete: function(impl_name){
        }
    }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels.Docklet',
    interface: {
        properties: {
            wallpaperColor : {type:'string'},
            wallpaperUrl : {type:'string'}
		},
        methods: {},
        events: {}
    },
    mixin_types : ['webos']
});