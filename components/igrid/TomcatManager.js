dojo.provide("imashup.components.igrid.TomcatManager");

dojo.require("imashup.components.Browser");
dojo.require("imashup.core.all");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.igrid.TomcatManager",
    [imashup.components.Browser],
    {
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/iGrid_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/iGrid_small.png"),

				url:"about:blank",
        service_url: "http://192.168.1.232:8080/MGService/MGService",
        imashup_human_name : "Tomcat Manager",
        imashup_catergories : ['Managment'],

        postCreate: function(){
            this.inherited("postCreate", arguments);
            dojo.io.script.get({
                url: this.service_url,
                content: {
                		"function":"imashup.core.instanceManager.byId('"+this.id+"').setIframeSrc",
                		instanceId: "192.168.1.232",
                		method: "getApplicationService",
                		params: "tomcat"
                	},
                callbackParamName: "callback"
            });
            //this.listPlatform({"message":"success","content":["tomcat4.1.24","pkuas2005","jboss44.0.3SP1"],"status":"200"})
        },

        setIframeSrc: function(params) {
        		if (params.message != "success" || params.status !="200") {return;}
        		this.iframe.src = params.content
        }
    }
)

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.igrid.TomcatManager',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});