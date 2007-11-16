dojo.provide("imashup.components.gadget._Gadget");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.gadget._Gadget",
    [dijit._Widget, dijit._Templated],
    {
        resizable: false,
        width:"",
        height:"",
        style: "",
        src:"",

        templateString: "<div></div>",

        postCreate: function(){
                this.inherited("postCreate", arguments);
                var elem = document.createElement('iframe');
                elem.style.width = this.width;
                elem.style.height = this.height;
                elem.style.left = "-1px"
                dojo.place(elem, this.domNode, 0)
                elem.src = this.src
        }
    }
);

imashup.components.gadget.defGadget = function(name, params){
        dojo.declare(
            "imashup.components.gadget."+name,
            imashup.components.gadget._Gadget,
            {
                imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.gadget", "templates/"+name+"_large.png"),
                imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.gadget", "templates/"+name+"_small.png"),
                width:params.width,
                height:params.height,
                style: params.style,
                src:params.src,
            }
        );

        imashup.core.componentTypeManager.registerComponentType({
            impl_name : 'imashup.components.gadget.'+name,
            interface: {
                properties: {},
                methods: {},
                events: {}
            },
            mixin_types : ['window']
        });
}