dojo.require("dijit.form.Button");
dojo.require("imashup.core.manager.ComponentTypeManager");

dojo.provide("imashup.components.Button");

imashup.core.manager.componentTypeManager.registerComponentType({
    impl_name : 'dijit.form.Button',
    interface: {
        properties: {
            caption : {type:'string'}
        },
        methods: {
            setLabel : {
                parameters : [
                    {name:'content', type:'string'}
                ],
                returnvalue : {type:'null'}
            }
        },
        events: {
            onClick : {parameters : [
                {name:'event', type:'object'}
            ]}
        }
    },
    require_properties : {
        label : {type:'string'}
    },
    mixin_types : ['layout']
});