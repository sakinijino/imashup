dojo.provide("imashup.components.widgets.InputPane");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.widgets.InputPane",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/input_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/input_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/InputPane.html"),
		
		resizable: false,
		maxable: false,
		width: 300,
		height: 60,
		
		imashup_human_name: "Text  Input",
		imashup_catergories: ['Misc'],
		
		inputnode: null,		
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onsubmit: function(){
			if (this.inputnode.value && this.inputnode.value != "") {
				this.oninput(this.inputnode.value);
			}
		},
		
		oninput: function(){
			
		}
		
	}

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.InputPane',
    interface: {
        properties: {},
        methods: {},
        events: {
			"input": { Function: "oninput", CustomMethod: "/* arguments[0]: String */" }
		}
    },
    mixin_types : ['window']
});
