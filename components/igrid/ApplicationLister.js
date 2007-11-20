dojo.provide("imashup.components.igrid.ApplicationLister");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.igrid.ApplicationLister",
    [dijit._Widget, dijit._Templated],
    {
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/iGrid_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.igrid", "templates/iGrid_small.png"),

        resizable: false,
        maxable:false,
        width:190,
        //height:100,
        url: "http://192.168.1.232:8080/MGService/MGService",
        imashup_human_name : "All Running Applications",
        imashup_catergories : ['Managment'],

        templateString: "<div class='imashupiGrid'></div>",

        postCreate: function(){
            this.inherited("postCreate", arguments);
            dojo.io.script.get({
                url: this.url,
                content: {
                		"function":"imashup.core.instanceManager.byId('"+this.id+"').listAllApplication",
                		instanceId: "192.168.1.232",
                		method: "listAllApplication"
                	},
                callbackParamName: "callback"
            });
            //this.listPlatform({"message":"success","content":["tomcat4.1.24","pkuas2005","jboss44.0.3SP1"],"status":"200"})
        },

        listAllApplication: function(params) {
        		if (params.message != "success" || params.status !="200") {this.domNode.innerHTML = "Connection Failed"; return;}
        		var table=document.createElement('table')
            var tbody=document.createElement('tbody')
            table.appendChild(tbody)
            for (var i=0; i<params.content.length; i++) {
            	var tr = document.createElement('tr')
            	var td = document.createElement('td')
            	td.className = "name"
            	td.innerHTML = params.content;
            	tr.appendChild(td)
            	var td = document.createElement('td')
            	td.innerHTML = "<a href='javascript:void(0)'>browser</a>";
            	td.onclick = function(){
            	}
            	tr.appendChild(td)
            	tbody.appendChild(tr)
            }
            this.domNode.appendChild(table);
        }
    }
)

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.igrid.ApplicationLister',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});