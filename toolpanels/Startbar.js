/*vaporClouds*/
dojo.provide("imashup.toolpanels.Startbar");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Menu");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.Tooltip");
dojo.require("dojox.layout.FloatingPane");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels.Startbar",
    [dijit._Widget, dijit._Templated],
    {
        widgetsInTemplate: true,
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Startbar_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Startbar_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Startbar.html"),
        
        categories: {},

        postCreate: function(){
			this.inherited("postCreate", arguments);
            this.loadComponents();
            dojo.subscribe("component_manager/register", this, "addComponent")
            this.refreshEra();
        },

		color: "",
		
        loadComponents: function(){
            var _this = this;
            imashup.core.componentTypeManager.forEach(function(impl_name, impl){
            		if (!impl.prototype.imashup_is_weboscomponent) return;
                _this.addComponent(impl_name, impl)
                _this.mStart.startup();
            });
        },
        
        addComponent: function(impl_name, impl){
        				var mi = new dijit.MenuItem({label:imashup.core.componentTypeManager.getHumanName(impl_name)});
                mi.onClick = function(){imashup.core.instanceManager.create(impl_name,{},null);};
                
               	var cs = imashup.core.componentTypeManager.getCategories(impl_name)
               	if (cs.length == 0)
               		this.mStart.addChild(mi);
               	else if (this.categories[cs[0]] != null)
               		this.categories[cs[0]].addChild(mi)
               	else {
               		this.categories[cs[0]] = new dijit.Menu();
               		this.categories[cs[0]].addChild(mi)
               		this.mStart.addChild(new dijit.PopupMenuItem({label:cs[0], popup:this.categories[cs[0]]}));
               	}
        },

        refreshEra: function(){ //TODO:CANLENDAR
            var t=this.time;
            var interFunc=function(){
                var gtm = new Date();
                dijit.byId("startbar").timeButton.containerNode.childNodes[1].innerHTML = dojo.date.locale.format(gtm, { datePattern: "yyyy-MM-dd HH:mm:ss", selector: "date"})
            }
            setInterval(interFunc,1000);
        }
    }
); 

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels.Startbar',
    interface: {
        properties: {
            color : {type:'string'}
        },
        methods: {},
        events: {}
    }
    //mixin_types : ['webos']
});
