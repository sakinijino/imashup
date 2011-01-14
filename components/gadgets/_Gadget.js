dojo.provide("imashup.components.gadgets._Gadget");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.gadgets._Gadget",
    [dijit._Widget, dijit._Templated],
    {
        resizable: false,
        maxable: false,
        width:0,
        style: "overflow:hidden",

        templateString: "<div></div>",

        postCreate: function(){
                var elem = document.createElement('iframe');
                elem.width = this.width;
                elem.height = this.iframe_height;
                elem.style.left = "-1px"
                dojo.place(elem, this.domNode, 0)
                elem.src = this.src
                this.width = this.width+3;
                this.inherited("postCreate", arguments);
        }
    }
);

imashup.components.gadgets.defGadget = function(name, params){
        dojo.declare(
            "imashup.components.gadgets."+name,
            imashup.components.gadgets._Gadget,
            {
                imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.gadgets", "templates/"+name+"_large.png"),
                imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.gadgets", "templates/"+name+"_small.png"),
                width:params.width,
                iframe_height:params.height,
                src:params.src,
                imashup_human_name: params.hn,
                imashup_catergories : params.c
            }
        );

        imashup.core.componentTypeManager.registerComponentType({
            impl_name : 'imashup.components.gadgets.'+name,
            interface: {
                properties: {},
                methods: {},
                events: {}
            },
            mixin_types : ['window']
        });
}
