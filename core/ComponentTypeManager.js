/*saki*/

dojo.require('imashup.mixins.all');
dojo.provide('imashup.core.Register')
dojo.provide('imashup.core.ComponentTypeManager')

dojo.declare("imashup.core.Register", null, {
    register: function(option) {
        var impl = dojo.getObject(option.impl_name);
        if (!dojo.isObject(impl)) return;

        impl.prototype.imashup_impl_name = option.impl_name;
        impl.prototype.imashup_interface = option.interface;
        impl.prototype.imashup_require_properties = (option.require_properties!=null)?option.require_properties:{};

        option.mixin_types = [imashup.mixins.BasicComponent].concat(option.mixin_types);
        if (option.mixin_types) this.mixinTypes(impl, option);

        return {impl:impl, interface:impl.prototype.imashup_interface, reqprops:impl.prototype.imashup_require_properties};
    },
    mixinTypes: function(impl, option){
        for (var i=0; i<option.mixin_types.length; i++) {
            var mixintype = option.mixin_types[i];
            if (dojo.isString(mixintype)) mixintype = this._TYPESTRINGMAPPING[mixintype]

            if (dojo.isObject(mixintype)) {
                this._mixin(impl.prototype, mixintype.prototype);

                if (mixintype.prototype.imashup_interface!=null) {
                    this._mixin(impl.prototype.imashup_interface.properties, mixintype.prototype.imashup_interface.properties);
                    this._mixin(impl.prototype.imashup_interface.methods, mixintype.prototype.imashup_interface.methods);
                    this._mixin(impl.prototype.imashup_interface.events, mixintype.prototype.imashup_interface.events);
                };

                if (mixintype.prototype.imashup_require_properties!=null)
                    this._mixin(impl.prototype.imashup_require_properties, mixintype.prototype.imashup_require_properties);
            }
        }
    },
    _TYPESTRINGMAPPING: imashup.mixins.all._TYPESTRINGMAPPING,
    _mixin : function(obj, props) {
        var tobj = {};
        for (var x in props)
          if ((typeof obj[x] == "undefined") &&
            (typeof tobj[x] == "undefined" || tobj[x] != props[x]))
            obj[x] = props[x];
    }
});

dojo.declare("imashup.core.ComponentTypeManager", null, {
    register : new imashup.core.Register,
    constructor: function() {
        this.types = {};
    },
    registerComponentType: function(option) {
        if (option.impl_name == null) return;
        this.types[option.impl_name] = this.register.register(option);
        this.types[option.impl_name].instance_count = 0
        this.onRegister(option.impl_name);
    },
    unregisterComponentType: function(impl_name){
        delete this.types[impl_name]
    },
    onRegister: function(impl_name) {
        dojo.publish('component_manager/register', [impl_name])
    },
    getInterface: function(name) {
        if (this.types[name]==null) return null;
        return this.types[name].interface;
    },
    getImpl: function(name) {
        if (this.types[name]==null) return null;
        return this.types[name].impl;
    },
    getRequireProperties: function(name) {
        if (this.types[name]==null) return null;
        return this.types[name].reqprops;
    },
    getInstanceCount: function(name) {
        if (this.types[name]==null) return null;
        return this.types[name].instance_count;
    },
    getHumanName: function(name) {
    		var impl = this.getImpl(name);
        if (impl == null) return;
        return impl.prototype.imashup_getHumanName();
    },
    getCategories: function(name) {
    		var impl = this.getImpl(name);
        if (impl == null) return;
        return impl.prototype.imashup_getCategories();
    },
    hasSingletonInstance: function(name) {
        var impl = this.getImpl(name);
        if (impl == null) return;
        if (impl.prototype.imashup_is_singleton &&
            impl.prototype.imashup_singleton != null) return true;
        return false
    },
    getSingletonInstance: function(name) {
        var impl = this.getImpl(name);
        if (impl == null) return;
        if (impl.prototype.imashup_is_singleton &&
            impl.prototype.imashup_singleton != null) return impl.prototype.imashup_singleton;
        return null
    },
    forEach: function(func) {
        for(var id in this.types){
            func(id,this.getImpl(id));
        }
    }
});

imashup.core.componentTypeManager = new imashup.core.ComponentTypeManager

dojo.subscribe('instance_manager/add',
  function(comp){
    with (imashup.core.componentTypeManager) {
      if (types[comp.imashup_impl_name])
        types[comp.imashup_impl_name].instance_count++
    }
  })

dojo.subscribe('instance_manager/beforeremove',
  function(comp){
    with (imashup.core.componentTypeManager) {
      if (types[comp.imashup_impl_name])
        types[comp.imashup_impl_name].instance_count--
    }
  })
