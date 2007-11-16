dojo.require('dijit._base.manager')
dojo.provide('imashup.core.InstanceManager')

dojo.declare("imashup.core.InstanceManager", dijit.WidgetSet, {
    constructor: function(componentTypeManager){
        this.componentTypeManager = componentTypeManager;
    },
    create: function(type, param, node){
        var impl = this.componentTypeManager.getImpl(type);
        if (impl == null) return;
        if (impl.prototype.imashup_is_singleton &&
            impl.prototype.imashup_singleton != null) return impl.prototype.imashup_singleton;
        var component = new impl(param, node);
        this.add(component);
        if (impl.prototype.imashup_is_singleton) impl.prototype.imashup_singleton = component
        this.onAdd(component);
        return component;
    },
    destroy : function(id) {
        this.onBeforeRemove(id);
        if (this.byId(id)!=null) this.byId(id).destroy();
        this.remove(id);
        this.onAfterRemove(id);
    },
    onAdd : function(component){
        dojo.publish('instance/add', [component])
    },
    onBeforeRemove : function(id){
    	dojo.publish('instance/beforeremove', [id])
    },
    onAfterRemove : function(id){
    }
});

imashup.core.instanceManager = new imashup.core.InstanceManager(imashup.core.componentTypeManager)