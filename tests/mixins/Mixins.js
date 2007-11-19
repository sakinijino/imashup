dojo.provide("imashup.tests.mixins.Mixins");

dojo.require("dijit._Widget");
dojo.require("imashup.mixins.all");

tests.register("imashup.tests.mixins.Mixins",
               [
                   function test_basic(t){
                       dojo.declare("im", dijit._Widget, {
                           i : 1,
                           setI : function(v) {this.i=v},
                           getI : function(){return this.i},
                           imashup_human_name : 'implementation',
                           imashup_catergories : ['Test']
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
                       t.is('implementation', ins.imashup_getHumanName())
                       t.is(1, ins.imashup_getCategories().length)
                       ins.imashup_setProperty('i', 13);
                       t.is(13, ins.imashup_getProperty('i'));
                       ctm.unregisterComponentType('im');
                   },
                   
                   function test_basic_no_human_name(t){
                   		 dojo.declare("im.bc.test", dijit._Widget, {
                       });
                       var option = {
                           impl_name : 'im.bc.test',
                           interface: {
                               properties: {},
                               methods: {},
                               events: {}
                           }
                       };
                       var ctm = imashup.core.componentTypeManager;
                       ctm.registerComponentType(option);
                       var ins = new im.bc.test;

                       t.is('test', ins.imashup_getHumanName())
                   		 ctm.unregisterComponentType('im.bc.test');
                   },

                   function test_window(t){
                       dojo.declare("im", dijit._Widget, {
                           i : 1,
                           width:20,
                           height:50,
                           style:"overflow:hidden"
                       });
                       var option = {
                           impl_name : 'im',
                           interface: {
                               properties: {},
                               methods: {},
                               events: {}
                           },
                           mixin_types: 'window'
                       };
                       var ctm = imashup.core.componentTypeManager;
                       ctm.registerComponentType(option);
                       var ins = new im({id:'ins1'});
                       ins._initFloatingPane()

                       t.is("20px",
                            ins.floatingpane.domNode.style.width);
                       t.is("50px",
                            ins.floatingpane.domNode.style.height);
                       t.is("hidden",
                            ins.floatingpane.domNode.style.overflow);
                       ins.floatingpane.close()
                       imashup.core.instanceManager.byId('ins1')
                       ctm.unregisterComponentType('im');
                   }
               ]
              );