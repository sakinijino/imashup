dojo.provide('imashup.core.LocalStorageManager');

dojo.require('imashup.core.LocalStorage');
dojo.require('imashup.core.InstanceManager');

// imashup.core.LocalStorageManager
dojo.declare("imashup.core.LocalStorageManager", null, {
	constructor : function(/* InstanceManager */insManager) {
		this.instanceManager = insManager;
		this.LocalStorage = null;
	},
    newLocalStorage: function(){
        this.LocalStorage =  new imashup.core.LocalStorage(
				this.instanceManager);
    }
})

imashup.core.LocalStorageManager = new imashup.core.LocalStorageManager(
		imashup.core.instanceManager);
