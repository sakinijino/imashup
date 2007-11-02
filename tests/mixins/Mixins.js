dojo.provide("imashup.tests.mixins.Mixins");

dojo.require("dijit._Widget");
dojo.require("imashup.mixins.all");

tests.register("imashup.tests.mixins.Mixins",
        [
            function test_basic(t){
                dojo.declare("im", dijit._Widget, {
                    i : 1,
                    setI : function(v) {this.i=v},
                    getI : function(){return this.i}
                });
                var option = {
                    impl_name : 'im',
                    interface: {
                        properties: {},
                        methods: {},
                        events: {}
                    }
                };
                var ctm = imashup.core.componentTypeManager;
                ctm.registerComponentType(option);
                var ins = new im;

                t.t(ins.imashup_is_imashupcomponent);
                ins.imashup_setProperty('i', 13);
                t.is(13, ins.imashup_getProperty('i'));
            }
        ]
);
