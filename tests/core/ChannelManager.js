dojo.provide("imashup.tests.core.ChannelManager");

dojo.require("dijit._Widget");
dojo.require("imashup.core.all");

tests.register("imashup.tests.core.ChannelManager",
		[ function test_channel_management(t) {
			var channelManager = imashup.core.channelManager;
			var result_1 = channelManager.newChannel("c0");
			t.t(result_1, (channelManager.channels["c0"] != null));
			var result_2 = channelManager.newChannel("c0");
			t.t(!result_2);
			var result_3 = channelManager.deleteChannel("c0");
			t.is(result_3, (channelManager.channels["c0"] == null));
			var result_4 = channelManager.deleteChannel("c0");
			t.t(!result_4);
		} ]);