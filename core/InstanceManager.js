dojo.require('dijit._base.manager')
dojo.provide('imashup.core.InstanceManager')

dojo.declare("imashup.core.InstanceManager", dijit.WidgetSet, {
    constructor: function(componentTypeManager){
        this.componentTypeManager = componentTypeManager;
    },
    create: function(type, param, node){
        with (this.componentTypeManager) {
            var impl = getImpl(type);
            if (impl == null) return;
            if (hasSingletonInstance(type)) return getSingletonInstance(type);
        }
        var component = new impl(param, node);
        this.add(component);
        if (impl.prototype.imashup_is_singleton) impl.prototype.imashup_singleton = component
        this.onAdd(component);
        return component;
    },
    destroy : function(id) {
        if (this.byId(id)==null) return
        this.onBeforeRemove(this.byId(id));
        this.byId(id).destroy();
        this.remove(id);
        this.onAfterRemove(id);
    },
    onAdd : function(component){
        dojo.publish('instance_manager/add', [component])
    },
    onBeforeRemove : function(component){
        dojo.publish('instance_manager/beforeremove', [component])
    },
    onAfterRemove : function(id){
        dojo.publish('instance_manager/afterremove', [id])
    }
});

imashup.core.instanceManager = new imashup.core.InstanceManager(imashup.core.componentTypeManager)