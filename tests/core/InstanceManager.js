dojo.provide("imashup.tests.core.InstanceManager");

dojo.require("dijit._Widget");
dojo.require("imashup.core.InstanceManager");

tests.register("imashup.tests.core.InstanceManager",
        [
            function test_instanceManager(t){
                var r = new imashup.core.Register
                dojo.declare("im", dijit._Widget, {});
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

                var itm = imashup.core.instanceManager;
                var onadd = false;
                var h1 = dojo.connect(itm, 'onAdd', function(cmp){onadd=cmp});
                var onbr = false;
                var h2 = dojo.connect(itm, 'onBeforeRemove', function(comp){onbr=comp});
                var onar = false;
                var h3 = dojo.connect(itm, 'onAfterRemove', function(id){onar=itm.byId(id)});

                var ins = itm.create('im', {id:'ins1'});
                t.is(ins, itm.byId('ins1'));
                t.is(ins, onadd);
                itm.destroy('ins1');
                t.is(null, itm.byId('ins1'));
                t.is(ins, onbr);
                t.is(null, onar);

                dojo.disconnect(h1);
                dojo.disconnect(h2);
                dojo.disconnect(h3);
            },
            function test_singleton(t) {
                var r = new imashup.core.Register
                dojo.declare("im1", dijit._Widget, {imashup_is_singleton:true});
                var option = {
                    impl_name : 'im1',
                    interface: {
                        properties: {},
                        methods: {},
                        events: {}
                    }
                };
                var ctm = imashup.core.componentTypeManager;
                ctm.registerComponentType(option);

                var itm = imashup.core.instanceManager;
                var onadd = 0;
                var h1 = dojo.connect(itm, 'onAdd', function(cmp){onadd++});

                var ins = itm.create('im1', {id:'ins1'});
                t.is(ins, itm.byId('ins1'));
                t.is(1, onadd);
                var ins2 = itm.create('im1', {});
                t.is(ins2, itm.byId('ins1'));
                t.is(1, onadd);

                itm.destroy(ins.id)
                itm.destroy(ins2.id)
                dojo.disconnect(h1);
            }
        ]
);
