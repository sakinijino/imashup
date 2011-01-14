dojo.provide('imashup.core.Channel');
dojo.provide('imashup.core.ChannelUser');

// imashup.core.Channel
dojo.declare("imashup.core.Channel", null, {
	constructor : function(/* InstanceManager */insManager) {
		this.name = "";
		this.recievers = new Array();
		this.publishers = new Array();
		this.instanceManager = insManager;
	},

	removePublisher : function(/* String */ID) {
		// Delete the connection between Publisher and Channel
		dojo.disconnect(this.publishers[ID].connection);
		dojo.unsubscribe(this.publishers[ID].alarm);
		delete this.publishers[ID];
	},

	removeReciever : function(ID) {
		dojo.unsubscribe(this.recievers[ID].alarm);
		delete this.recievers[ID];
	},

	addPublisher : function(/* String */publisherID, /* String */
			publisherFunc, /* String */customMethod) {
		var ID = publisherID + '.' + publisherFunc;
		var self = this;
		if (this.publishers[ID] != null)
			return false;
		if (this.insAsPublisher(publisherID))
			return false;
		if (this.insAsReciever(publisherID))
			return false;
		// Publish message = "publisherID.publisherFunc/channel_call"
		var msg = ID + "/channel_call";
		this.publishers[ID] = {
			ID : ID,
			pID : publisherID,
			func : publisherFunc,
			method : customMethod ? customMethod : "",
			connection : null,
			alarm : null
		};
		// Establish connection using dojo.connect
		this.publishers[ID].connection = dojo.connect(this.instanceManager
				.byId(publisherID), publisherFunc, function() {
			eval(self.publishers[ID].method);
			dojo.publish(msg, arguments);
		});
		this.publishers[ID].alarm = dojo.subscribe(msg, null, dojo.hitch(this,
				"execute"));
		return true;
	},

	addReciever : function(/* String */recieverID, 
			/* String */recieverFunc, /* String */customMethod) {
		var ID = recieverID + '.' + recieverFunc;
		var self = this;
		if (this.recievers[ID] != null)
			return false;
		if (this.insAsPublisher(recieverID))
			return false;
		// Channel message = "channelName/channel_send"
		var msg = this.name + "/channel_send";
		this.recievers[ID] = {
			ID : ID,
			rID : recieverID,
			func : recieverFunc,
			method : customMethod ? customMethod : "",
			alarm : null
		};
		this.recievers[ID].alarm = dojo.subscribe(msg, null, function() {
			eval(self.recievers[ID].method);
			dojo.hitch(self.instanceManager.byId(recieverID), recieverFunc).apply(null, arguments)
		});
		return true;
	},

	execute : function() {
		// Channel message = "channelName/channel_send"
		var msg = this.name + "/channel_send";
		dojo.publish(msg, arguments);
	},
	
	changeCPM: function (/* String */ ID, 
			/* String */ customMethod) {
		if(this.publishers[ID] != null) {
			this.publishers[ID].method = customMethod;
		}
	},
	
	changeCRM: function (/* String */ ID, 
			/* String */ customMethod) {
		if(this.recievers[ID] != null) {
			this.recievers[ID].method = customMethod;
		}
	},
	
	clear : function() {
		// Remove everything in the Arrays
		for ( var item in this.publishers) {
			this.removePublisher(item);
		}
		for ( var item in this.recievers) {
			this.removeReciever(item);
		}
	},
	
	insAsPublisher : function(/* String */ id) {
		for ( var item in this.publishers) {
			if(this.publishers[item].pID == id)
				return true;
		}
		return false;
	},
	
	insAsReciever : function(/* String */ id) {
		for ( var item in this.recievers) {
			if(this.recievers[item].rID == id)
				return true;
		}
		return false;
	},
	
	publisherByInsId : function(/* String */ id) {
		for ( var item in this.publishers) {
			if(this.publishers[item].pID == id) {
				return this.publishers[item];
			}
		}
		return null;
	},
	
	recieverByInsId : function(/* String */ id) {
		for ( var item in this.recievers) {
			if(this.recievers[item].rID == id)
				return this.recievers[item];
		}
		return null;
	},
});