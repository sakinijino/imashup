dojo.provide("imashup.components.widgets.GoogleLineChart");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.widgets.GoogleLineChart",
    [dijit._Widget, dijit._Templated],
    {
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/lc_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/lc_small.png"),

        resizable: true,
        maxable:true,
        width:215,
        style: "overflow:hidden",
        url: "http://www.google.com",
        
        imashup_human_name: "Google Line Chart",
        imashup_catergories : ["Misc"],

		imagenode:null,

        templateString: "<div style='text-align:center'><image dojoAttachPoint='imagenode' style='margin:5px' src='"+dojo.moduleUrl("imashup.components.widgets", "templates/lc_bg.png")+"' /></div>",

		setData: function(data){
			this.imagenode.src = 'http://chart.apis.google.com/chart?cht=lc&chs=200x150&chd=t:'+data.join(',')+'&chds=0,200';
		}
    }
)

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.GoogleLineChart',
    interface: {
        properties: {},
        methods: {
			'setData': { Function: 'setData', CustomMethod: '/* arguments[0]: Array */' }
		},
        events: {}
    },
    mixin_types : ['window']
});
