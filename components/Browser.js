dojo.provide("imashup.components.Browser");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.Browser",
    [dijit._Widget, dijit._Templated],
    {
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components", "templates/Browser_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components", "templates/Browser_small.png"),

        resizable: true,
        maxable:true,
        width:640,
        style: "overflow:hidden",
        url: "http://www.pku.edu.cn",
        
        imashup_human_name: "Browser",
        imashup_catergories : ["WWW"],

        templateString: "<div><input size=40 dojoAttachPoint='bar'/><button dojoAttachPoint='gotobutton'>Goto</button><div dojoAttachPoint='webpage' /></div>",

        postCreate: function(){
            this.inherited("postCreate", arguments);
            this.iframe = elem = document.createElement('iframe');
            with(this.iframe){
                width = this.width-3;
                height = 480;
                style.left = "-1px"
            }
            this.bar.value = this.url;
            
            dojo.connect(this.gotobutton, 'onclick', dojo.hitch(this, function(){
            	if (!this.bar.value.match("[a-zA-Z]+://")) this.bar.value = "http://" + this.bar.value ;
            	this.iframe.src = this.bar.value
            }))
            dojo.place(this.iframe, this.webpage, 0)
            this.iframe.src = this.url
        },
        
        resize : function(){
        	if (this.floatingpane._currentState) {
          	c = this.floatingpane._currentState
          	if (c.w) this.iframe.width = c.w-3
          	if (c.h) this.iframe.height = c.h-45
         	}
       	}
    }
)

if (dojo.isFF) {
	imashup.components.Browser.prototype.imashup_webos_large_icon_url = dojo.moduleUrl("imashup.components", "templates/FF_large.png");
	imashup.components.Browser.prototype.imashup_webos_small_icon_url = dojo.moduleUrl("imashup.components", "templates/FF_small.png");
	imashup.components.Browser.prototype.imashup_human_name = "Firefox";
}
if (dojo.isIE) {
	imashup.components.Browser.prototype.imashup_webos_large_icon_url = dojo.moduleUrl("imashup.components", "templates/IE_large.png");
	imashup.components.Browser.prototype.imashup_webos_small_icon_url = dojo.moduleUrl("imashup.components", "templates/IE_small.png");
	imashup.components.Browser.prototype.imashup_human_name = "Internet Explorer";
}

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.Browser',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});