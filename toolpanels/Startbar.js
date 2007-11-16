/*vaporClouds*/
dojo.provide("imashup.toolpanels.Startbar");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Menu");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.Tooltip");
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

        postCreate: function(){
            dojo.connect(this.setupHwd,"onClick",this,"setup");
            this.loadComponents();
            this.refreshEra();
            this.inherited("postCreate", arguments);
        },

        loadComponents: function(){
            var mi = null, _this = this;
            imashup.core.componentTypeManager.forEach(function(impl_name, impl){
                name = impl_name.match(/[^\.]+$/g)[0];
                mi = new dijit.MenuItem({label:name});
                mi.onClick = function(){imashup.core.instanceManager.create(impl_name,{},null);};
                _this.mStart.addChild(mi);
                _this.mStart.startup();
            });
        },

        refreshEra: function(){ //TODO:CANLENDAR
            var t=this.time;
            var interFunc=function(){
                var gtm = new Date();
                t.innerHTML=gtm.toLocaleString();
            }
            setInterval(interFunc,1000);
        },

        setup: function(){//should be a uniform function for all the panels!
        }
    }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels.Startbar',
    interface: {
        properties: {
            unknown : {type:'complex'}
        },
        methods: {},
        events: {}
    },
    mixin_types : ['webos']
});