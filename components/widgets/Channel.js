dojo.provide("imashup.components.widgets.Channel");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dijit.Dialog");

dojo.declare(
    "imashup.components.widgets.Channel",
    [dijit._Widget, dijit._Templated],
    {
		templatePath : dojo.moduleUrl("imashup.components.widgets", "templates/Channel.html"),
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/mashup_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/mashup_small.png"),
		
		resizable : false,
		maxable : false,
		width : 450,
		height : 350,
		
		imashup_human_name : "Channel",
		imashup_catergories : [ 'Mashup' ],
		
		postCreate : function() {
			imashup.core.channelManager.newChannel(this.id);
			this.refresh();
			
			// Refresh list whenever an instance is created or destroyed
			this.connection_create = dojo.connect(
								imashup.core.instanceManager, "create", this,
								"refresh");
			this.connection_destroy = dojo.connect(
								imashup.core.instanceManager, "destroy", this,
								"refresh");
			
			// When an instance is destroyed, remove it from the publisher/reciever list
			this.connection_destroy_1 = dojo.connect(
								imashup.core.instanceManager, "destroy", this,
								"removeById");
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
			this.CPMDialog.id = this.id + "_CPM";
			this.CRMDialog.id = this.id + "_CRM";
		},
		
		refresh : function() {
			this.publisherList.innerHTML = "";
			this.recieverList.innerHTML = "";
			var eventsCount = 0;
			var methodsCount = 0;
			
			// Check every instance for whether it has events or methods
			for ( var item in imashup.core.instanceManager._hash) {
				eventsCount = 0;
				methodsCount = 0;
				for ( var i in imashup.core.instanceManager
									.byId(item).imashup_interface.events)
					eventsCount++;
				for ( var i in imashup.core.instanceManager
									.byId(item).imashup_interface.methods)
					methodsCount++;
				if (eventsCount != 0)
					dojo.create("option", {
									innerHTML : item
								}, this.publisherList);
				if (methodsCount != 0)
					dojo.create("option", {
									innerHTML : item
								}, this.recieverList);
			}
			
			// Update publisherFunc and recieverFunc list
			this.changePublisher();
			this.changeReciever();
		},
		
		removeById : function(/* String */id) {
			var channel = imashup.core.channelManager.channels[this.id];
			var pList = this.currentPublisherList;
			var rList = this.currentRecieverList;
			var id_temp;

			if (channel.publisherByInsId(id)) {
				id_temp = channel.publisherByInsId(id).ID;
				for ( var i = 0; i < pList.options.length; i++) {
					if (pList.options[i].innerHTML == id_temp) {
						pList.remove(i);
						channel.removePublisher(id_temp);
					}
				}
			} else {
				while (channel.recieverByInsId(id)) {
					id_temp = channel.recieverByInsId(id).ID;
					for ( var i = 0; i < rList.options.length; i++) {
						if (rList.options[i].innerHTML == id_temp) {
							rList.remove(i);
							channel.removeReciever(id_temp);
						}
					}
				}
			}
		},
		
		addPublisher : function() {
			if (!this.publisherList.value || !this.publisherFuncList.value)
				return false;
			var channel = imashup.core.channelManager.channels[this.id];
			var publisher = imashup.core.instanceManager
								.byId(this.publisherList.value);
			var func = publisher.imashup_interface.events[this.publisherFuncList.value].Function;
			var customMethod = publisher.imashup_interface.events[this.publisherFuncList.value].CustomMethod;
			var succeed = channel.addPublisher(this.publisherList.value, func, customMethod);
			if (succeed) {
				var id = this.publisherList.value + '.' + func;
				var func = "imashup.core.instanceManager.byId('" 
					+ this.id + "').inputCPM()";
				dojo.create("option", {
								innerHTML : id,
								onDblClick : func
							}, this.currentPublisherList);
			}
			return true;
		},
		
		addReciever : function() {
			if (!this.recieverList.value || !this.recieverFuncList.value)
				return false;
			var channel = imashup.core.channelManager.channels[this.id];
			var reciever = imashup.core.instanceManager
								.byId(this.recieverList.value);
			var func = reciever.imashup_interface.methods[this.recieverFuncList.value].Function;
			var customMethod = reciever.imashup_interface.methods[this.recieverFuncList.value].CustomMethod;
			var succeed = channel.addReciever(this.recieverList.value, func, customMethod);
			if (succeed) {
				var id = this.recieverList.value + '.' + func;
				var func = "imashup.core.instanceManager.byId('" 
					+ this.id + "').inputCRM()";
				dojo.create("option", {
								innerHTML : id,
								onDblClick : func
							}, this.currentRecieverList);
			}
			return true;
		},
		
		changePublisher : function() {
			if (!this.publisherList.value) {
				this.publisherFuncList.innerHTML = "";
				return;
			}
			var events = imashup.core.instanceManager
								.byId(this.publisherList.value).imashup_interface.events;
			this.publisherFuncList.innerHTML = "";
			for ( var item in events) {
				var func = "imashup.core.instanceManager.byId('" 
					+ this.id + "').inputCPM()";
				dojo.create("option", {
								innerHTML : item,
								onDblClick : func
							}, this.publisherFuncList);
			}
		},
		
		changeReciever : function() {
			if (!this.recieverList.value) {
				this.recieverFuncList.innerHTML = "";
				return;
			}
			var methods = imashup.core.instanceManager
								.byId(this.recieverList.value).imashup_interface.methods;
			this.recieverFuncList.innerHTML = "";
			for ( var item in methods) {
				var func = "imashup.core.instanceManager.byId('" 
					+ this.id + "').inputCRM()";
				dojo.create("option", {
								innerHTML : item,
								onDblClick : func
							}, this.recieverFuncList);
			}
		},
		
		inputCPM : function() {
			var dialog = dijit.byId(this.id + "_CPM");
			var pList = this.currentPublisherList;
			var ID = pList.options[pList.selectedIndex].innerHTML;
			var channel = imashup.core.channelManager.channels[this.id];
			this.codeCPM.value = channel.publishers[ID].method;
			dialog.show();
		},
		
		setCPM : function() {
			var dialog = dijit.byId(this.id + "_CPM");
			dialog.hide();
			var channel = imashup.core.channelManager.channels[this.id];
			var pList = this.currentPublisherList;
			var ID = pList.options[pList.selectedIndex].innerHTML;
			var method = this.codeCPM.value;
			channel.changeCPM(ID, method);
		},
		
		inputCRM : function() {
			var dialog = dijit.byId(this.id + "_CRM");
			var rList = this.currentRecieverList;
			var ID = rList.options[rList.selectedIndex].innerHTML;
			var channel = imashup.core.channelManager.channels[this.id];
			this.codeCRM.value = channel.recievers[ID].method;
			dialog.show();
		},
		
		setCRM : function() {
			var dialog = dijit.byId(this.id + "_CRM");
			dialog.hide();
			var channel = imashup.core.channelManager.channels[this.id];
			var rList = this.currentRecieverList;
			var ID = rList.options[rList.selectedIndex].innerHTML;
			var method = this.codeCRM.value;
			channel.changeCRM(ID, method);
		},
		
		removeSelected : function() {
			var channel = imashup.core.channelManager.channels[this.id];
			var pList = this.currentPublisherList;
			var pSelected = new Array();
			var pCount = 0;
			var rList = this.currentRecieverList;
			var rSelected = new Array();
			var rCount = 0;
			
			// Get all selected options and remove them from channel
			for ( var i = 0; i < pList.options.length; i++) {
				if (pList.options[i].selected) {
					pSelected[pCount] = i;
					pCount++;
					channel.removePublisher(pList.options[i].value);
				}
			}
			for ( var i = 0; i < rList.options.length; i++) {
				if (rList.options[i].selected) {
					rSelected[rCount] = i;
					rCount++;
					channel.removeReciever(rList.options[i].value);
				}
			}
			
			// Remove all selected from option list
			for ( var i = pCount - 1; i >= 0; i--)
				pList.remove(pSelected[i]);
			for ( var i = rCount - 1; i >= 0; i--)
				rList.remove(rSelected[i]);
		},
		
		destroy : function() {
			imashup.core.channelManager.deleteChannel(this.id);
			dojo.disconnect(this.connection_create);
			dojo.disconnect(this.connection_destroy);
			dojo.disconnect(this.connection_destroy_1);
		}
	}
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.Channel',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});
