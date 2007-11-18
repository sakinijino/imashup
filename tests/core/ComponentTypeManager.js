dojo.provide("imashup.tests.core.ComponentTypeManager");

dojo.require("dijit._Widget");
dojo.require("imashup.core.all");

tests.register("imashup.tests.core.ComponentTypeManager",
               [
                   function test_register(t){
                       var r = new imashup.core.Register
                       dojo.declare("implementation", null, {});
                       var option = {
                           impl_name : 'implementation',
                           interface: {
                               properties: {},
                               methods: {},
                               events: {}
                           }
                       };
                       var o = r.register(option);
                       t.is(implementation, o.impl);
                       t.is(option.interface, o.interface);
                       t.is(implementation.prototype.imashup_interface, o.interface);
                       t.is({}, o.reqprops);
                   },

                   function test_register_mixin(t){
                       var r = new imashup.core.Register
                       dojo.declare("implementation", null, {
                           p1 : 'first',
                           m1 : function(){return 'first'}
                       });

                       dojo.declare("mixins", null, {
                           p1 : 'second',
                           m1 : function(){return 'second'},
                           p2 : 'second',
                           m2 : function(){return 'second'},
                           imashup_interface: {
                               properties: {p1:{type:'integer'}, p2:{}},
                               methods: {m1 : {parameters : [{name:'second', type:'string'}], returnvalue : {type:'null'}}, m2:{}},
                               events: {e1 : {parameters : [{name:'second', type:'string'}]}, e2:{}}
                           },
                           imashup_require_properties : {r1 : {type:'integer'}, r2:{}}
                       });

                       var option = {
                           impl_name : 'implementation',
                           interface: {
                               properties: {p1:{type:'string'}},
                               methods: {m1 : {parameters : [{name:'first', type:'string'}], returnvalue : {type:'null'}}},
                               events: {e1 : {parameters : [{name:'first', type:'string'}]}}
                           },
                           require_properties : {r1 : {type:'string'}},
                           mixin_types : mixins
                       };

                       var o = r.register(option);
                       t.is('first', implementation.prototype.p1);
                       t.is('first', implementation.prototype.m1());
                       t.is('second', implementation.prototype.p2);
                       t.is('second', implementation.prototype.m2());
                       t.t(implementation.prototype.imashup_interface.properties.p2!=null);
                       t.t(implementation.prototype.imashup_interface.properties.p1.type=='string');
                       t.t(implementation.prototype.imashup_interface.methods.m2!=null);
                       t.t(implementation.prototype.imashup_interface.methods.m1.parameters[0].name=='first');
                       t.t(implementation.prototype.imashup_interface.events.e2!=null);
                       t.t(implementation.prototype.imashup_interface.events.e1.parameters[0].name=='first');
                       t.t(implementation.prototype.imashup_require_properties.r2!=null);
                       t.t(implementation.prototype.imashup_require_properties.r1.type=='string');
                   },

                   function test_componentTypeManager(t){
                       dojo.declare("implementation", null, {});
                       var option = {
                           impl_name : 'implementation',
                           interface: {
                               properties: {},
                               methods: {},
                               events: {}
                           }
                       };
                       var ctm = imashup.core.componentTypeManager;
                       var onregistercalled = false;
                       //dojo.connect(ctm, 'onRegister', function(name){onregistercalled=name});
                       dojo.subscribe('component_manager/register', function(name){onregistercalled=name});

                       var o = ctm.registerComponentType(option);
                       t.is(implementation, ctm.getImpl('implementation'));
                       t.is(implementation.prototype.imashup_interface, ctm.getInterface('implementation'));
                       t.is(implementation.prototype.imashup_require_properties, ctm.getRequireProperties('implementation'));
                       t.is(implementation.prototype.imashup_interface, ctm.getInterface('implementation'));
                       t.is("implementation", ctm.getHumanName('implementation'));
                       t.is('implementation', onregistercalled);
                       ctm.unregisterComponentType('implementation')
                       t.is(null, ctm.getImpl('implementation'));
                   },

                   function test_instance_count(t){
                       dojo.declare("implementation", dijit._Widget, {});
                       var option = {
                           impl_name : 'implementation',
                           interface: {
                               properties: {},
                               methods: {},
                               events: {}
                           }
                       };
                       var ctm = imashup.core.componentTypeManager;
                       var itm = imashup.core.instanceManager;

                       var o = ctm.registerComponentType(option);
                       var i1 = itm.create('implementation', {id:'im1'});
                       t.is(1, ctm.getInstanceCount('implementation'));
                       var i2 = itm.create('implementation', {id:'im2'});
                       t.is(2, ctm.getInstanceCount('implementation'));
                       itm.destroy(i1.id);
                       t.is(1, ctm.getInstanceCount('implementation'));
                       itm.destroy(i2.id);
                       t.is(0, ctm.getInstanceCount('implementation'));
                       ctm.unregisterComponentType('implementation')
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

                       var ins = itm.create('im1', {id:'ins1'});
                       t.t(ctm.hasSingletonInstance('im1'));
                       t.is(ins, ctm.getSingletonInstance('im1'));

                       itm.destroy(ins.id)
                   }
               ]
              );