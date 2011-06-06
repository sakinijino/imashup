/*vaporClouds*/
dojo.provide("imashup.toolpanels_phone.InstanceBar");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.Menu");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dijit.Dialog");
dojo.require("dijit.Tooltip");
dojo.require("dojox.layout.FloatingPane");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels_phone.InstanceBar",
    [dijit._Widget, dijit._Templated],
    {
        widgetsInTemplate: true,
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Startbar_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Startbar_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels_phone", "templates/InstanceBar.html"),
        
        categories: {},

        postCreate: function(){
          this.inherited("postCreate", arguments);
          dojo.subscribe("instance_manager/add", this, "_addInstance");
          this.closeButton.disabled = true;
        },

        color: "",
		
        instanceConnection: null,
		
        _addInstance: function(component) {
          var self = this;
          this.instanceTitle.set('label', component.imashup_human_name);
          this.closeButton.set('label', 'x');
          this.closeButton.disabled = false;
          this.instanceConnection = dojo.connect(this.closeButton, "onClick",
            function() {
              imashup.core.instanceManager.destroy(component.id);
              self.reset();
            }
          );
        },
		
        initSvcMenu: function() {
          if(this.instanceConnection != null)
            dojo.disconnect(this.instanceConnection);
          var self = this;
          this.instanceTitle.set('label', 'All Services');
          this.closeButton.set('label', 'x');
          this.closeButton.disabled = false;
          this.instanceConnection = dojo.connect(this.closeButton, "onClick",
            function() {
              self.reset();
              dijit.byId("desktop").reset();
            }
          );
        },
		
        initTaskMgr: function() {
          if(this.instanceConnection != null)
            dojo.disconnect(this.instanceConnection);
          var self = this;
          this.instanceTitle.set('label', 'Task Manager');
          this.closeButton.set('label', 'x');
          this.closeButton.disabled = false;
          this.instanceConnection = dojo.connect(this.closeButton, "onClick",
            function() {
              self.reset();
              dijit.byId("desktop").reset();
            }
          );
        },
		
        reset: function() {
          this.instanceTitle.set('label', 'Welcome');
          this.closeButton.set('label', '');
          if(this.instanceConnection != null)
            dojo.disconnect(this.instanceConnection);
          this.closeButton.disabled = true;
        }
      }
    ); 

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels_phone.InstanceBar',
    interface: {
        properties: {
            color : {type:'string'}
        },
        methods: {},
        events: {}
    }
    //mixin_types : ['webos']
});
