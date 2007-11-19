dojo.provide("imashup.components.igrid.PlatformLister");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.igrid.PlatformLister",
    [dijit._Widget, dijit._Templated],
    {
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/iGrid_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/iGrid_small.png"),

        resizable: false,
        maxable:false,
        width:190,
        url: "http://192.168.1.232:8080/MGService/MGService",
        imashup_human_name : "List All Platforms",
        imashup_catergories : ['Managment'],

        templateString: "<div class='imashupiGrid'></div>",

        postCreate: function(){
            this.inherited("postCreate", arguments);
            /*dojo.io.script.get({
                url: this.url,
                content: {
                		"function":"imashup.core.instanceManager.byId('"+this.id+"').listPlatform",
                		instanceId: "192.168.1.232",
                		method: "listAllPlatform"
                	},
                callbackParamName: "callback"
            });*/
            this.listPlatform({"message":"success","content":["tomcat4.1.24","pkuas2005","jboss44.0.3SP1"],"status":"200"})
        },

        listPlatform: function(params) {
        		var table=document.createElement('table')
            var tbody=document.createElement('tbody')
            table.appendChild(tbody)
            for (var i=0; i<params.content.length; i++) {
            	var tr = document.createElement('tr')
            	var td = document.createElement('td')
            	td.className = "name"
            	td.innerHTML = params.content[i];
            	tr.appendChild(td)
            	var td = document.createElement('td')
            	td.innerHTML = "<a href='javascript:void(0)'>start</a>";
            	tr.appendChild(td)
            	var td = document.createElement('td')
            	td.innerHTML = "<a href='javascript:void(0)'>stop</a>";
            	tr.appendChild(td)
            	var td = document.createElement('td')
            	td.innerHTML = "<a href='javascript:void(0)'>restart</a>";
            	tr.appendChild(td)
            	tbody.appendChild(tr)
            }
            this.domNode.appendChild(table);
        }
    }
)

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.igrid.PlatformLister',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});