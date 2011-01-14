dojo.provide('imashup.core.ChannelManager');

dojo.require('imashup.core.Channel');
dojo.require('imashup.core.InstanceManager');

// imashup.core.ChannelManager
dojo.declare("imashup.core.ChannelManager", null, {
	constructor : function(/* InstanceManager */insManager) {
		this.instanceManager = insManager;
		this.channels = {};
	},
	newChannel : function(/* String */channelName) {
		if (this.channels[channelName] != null)
			return false;
		this.channels[channelName] = new imashup.core.Channel(
				this.instanceManager);
		this.channels[channelName].name = channelName;
		return true;
	},
	deleteChannel : function(/* String */channelName) {
		if (this.channels[channelName] == null)
			return false;
		this.channels[channelName].clear();
		delete this.channels[channelName];
		return true;
	}
})

imashup.core.channelManager = new imashup.core.ChannelManager(
		imashup.core.instanceManager);