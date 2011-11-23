dojo.provide("imashup.core.InterfaceAdapter");

dojo.declare("imashup.core.InterfaceAdapter", null, {
	types: null,
	connections: null,
	
	postCreate: function() {
		this.types = {};
		this.connections = {};
	},

	register: function(impl_name, option) {
	
		var impl = dojo.getObject(impl_name);
		if (!dojo.isObject(impl)) return;
		
		impl.prototype.imashup_adapter = {};
		impl.prototype.imashup_adapter.points = {};
		impl.prototype.imashup_adapter.events = {};
		
		for (var x in option.points)
			impl.prototype.imashup_adapter.points[option.points[x]] = {menuItem: null, active: false};
		
		for (var x in option.events) {
			var event = function(div) {
				return option.events[div];
			}(x);
			console.log(event);
			impl.prototype.imashup_adapter.events[x] = {display: event, connection: null};
		}
	},
	
	onCreate: function(component) {
		if(component.imashup_adapter == null)
			return;
			
		var self = this;
		
		// Display the first area
		for (var x in component.imashup_adapter.points) {
			this.display(component, x);
			break;
		}
		
		for (var x in component.imashup_adapter.points) {
			//component.imashup_adapter.points[x].menuItem = dojo.hitch(component, x);
			var node = eval("dijit.byId('" + component.id + "')." + x);
			node.style["float"] = "";
			node.style.top = "0px";
			node.style.left = "0px";
			node.style.position = "absolute";
			node.style.width = "100%";
			node.style.height = "100%";
			//console.log(node);
		}
		
		for (var x in component.imashup_adapter.events) {
			var success = function(div) {
				component.imashup_adapter.events[div].connection = dojo.connect(
					component, 
					div, 
					function(){
						//self.display(component, component.imashup_adapter.events[div].display);
						component.imashup_adapter.points[component.imashup_adapter.events[div].display].active = true;
						console.log(component.imashup_adapter.events[div].display);
					}
				)
			}(x);
		}
	},
	
	onDestroy: function(component) {
	},
	
	display: function(component, point) {
		//console.log(point);
		for (var x in component.imashup_adapter.points) {
			if(x != point) {
				/*
				var cmd = "dijit.byId('" + component.id + "')." + x + ".style.display = 'none'";
				eval(cmd);
				*/
				var node = eval("dijit.byId('" + component.id + "')." + x);
				node.style.display = "none";
			} else {
				var node = eval("dijit.byId('" + component.id + "')." + x);
				node.style.display = "block";
				/*
				var cmd = "dijit.byId('" + component.id + "')." + x + ".style.display = 'block'";
				console.log(cmd);
				eval(cmd);
				*/
			}
		}
	}
});

imashup.core.interfaceAdapter = new imashup.core.InterfaceAdapter();
