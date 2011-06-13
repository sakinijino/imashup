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
			this.instanceTitle.set('label', 'Welcome');
			
			this.refreshEra();
        },

        color: "",
		
        instanceConnection: null,
		
		instancePointList: {},
		
		currentComponent: null,
		highlightColor: "",
		
        _addInstance: function(component) {
			this.currentComponent = component;
		
			this.instancePointList = {};
		
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
			
			// Initialize Adapter Relocation Menu
			if(component.imashup_adapter != null) {
				for (var x in component.imashup_adapter.points) {
					//this.instancePointList[component.imashup_adapter.points[x]] = {item:menuItem, active:false};	
				
					var menuItem = new dijit.MenuItem({
						label:x});
					
					menuItem.onClick = function(div) { 
						return function() {
							imashup.core.interfaceAdapter.display(component, div);
							component.imashup_adapter.points[div].active = false;
						}
					}(x);
					
					this.instancePoints.containerNode.appendChild(menuItem.domNode);
					
					// Add Menu Item Reference to imashup_adapter of component
					component.imashup_adapter.points[x].menuItem = menuItem;
				}
			}
			//console.log(component);
        },
		
        initSvcMenu: function() {
			this.currentComponent = null;
			this.instanceTitle.domNode.backgroundColor = "";
		
			this.instancePoints.innerHTML = "";
			this.instancePointList = {};
		
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
			this.currentComponent = null;
			this.instanceTitle.domNode.backgroundColor = "";
		
			this.instancePoints.innerHTML = "";
			this.instancePointList = {};
		
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
			this.currentComponent = null;
			this.instanceTitle.set('label', 'Welcome');
			this.closeButton.set('label', '');
			if(this.instanceConnection != null)
				dojo.disconnect(this.instanceConnection);
			this.closeButton.disabled = true;
        },
		
		refreshEra: function(){
			var self = this;
			var interFunc=function(){
				if (self.currentComponent == null)
					return;
				if (self.currentComponent.imashup_adapter == null)
					return;
					
				var count = 0;
				for (var x in self.currentComponent.imashup_adapter.points) {
					if(self.currentComponent.imashup_adapter.points[x].active == true) {
						self.currentComponent.imashup_adapter.points[x].menuItem.domNode.style.backgroundColor = self.highlightColor;
						count ++;
					}
					
				}
				
				if(count > 0) {
					self.instanceTitle.domNode.style.backgroundColor = self.highlightColor;
				}
				
				if(self.highlightColor == "")
					self.highlightColor = "#FFFF00";
				else
					self.highlightColor = "";
			}
			setInterval(interFunc, 500);
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
