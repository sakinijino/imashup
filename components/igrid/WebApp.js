dojo.provide("imashup.components.igrid.WebApp");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.igrid.WebApp",
    [dijit._Widget, dijit._Templated],
    {
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/WebApp_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/WebApp_small.png"),

        resizable: false,
        maxable:true,
        width:500,
        height:400,
        style: "width:500px;top:30px;overflow:hidden",
        url: "http://127.0.0.1:3001/test/index",

        templateString: "<div></div>",

        postCreate: function(){
            this.inherited("postCreate", arguments);
            this.iframe = elem = document.createElement('iframe');
            with(this.iframe){
                width = this.width;
                height = this.height;
                style.left = "-1px"
            }
            dojo.place(this.iframe, this.domNode, 0)
            dojo.io.script.get({
                url: this.url,
                content: {jsfunc:"imashup.core.instanceManager.byId('"+this.id+"').setSrc"},
                callbackParamName: "callback"
            });
        },

        setSrc: function(params) {
            if (params.url) this.iframe.src = params.url
            else if (params.src) this.iframe.src = params.src
        },

        resize : function(){
            var c = this.floatingpane._currentState
            //this.iframe.width = c.w
            //this.iframe.height = c.h
        }
    }
)

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.igrid.WebApp',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});