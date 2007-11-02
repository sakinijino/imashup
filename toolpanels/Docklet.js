/*vaporClouds*/
dojo.provide("imashup.toolpanels.Docklet");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels.Docklet",
    [dijit._Widget, dijit._Templated],
    {
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet.html"),

        dockStyle: "bottom",//[bottom,left,right,top]

        postCreate: function(){
            this._layout();
            this._resizeHandler = this.connect(window, "onresize", "_layout");
            this.inherited("postCreate", arguments);
        },

        _layout: function(){
            var viewport = dijit.getViewport();
            this.wall.style.height = viewport.h + 'px';
        }
    }
);


imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels.Docklet',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['webos']
});