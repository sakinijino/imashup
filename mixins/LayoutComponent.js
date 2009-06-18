/*saki*/
dojo.provide('imashup.mixins.LayoutComponent')

dojo.declare("imashup.mixins.LayoutComponent", null, {
    getCssTop : function() {
        return this.domNode.style.top;
    },
    setCssTop : function(value) {
        this.domNode.style.top = value;
    },
    getCssLeft : function(value) {
        return this.domNode.style.left;
    },
    setCssLeft : function(value) {
        this.domNode.style.left = value;
    },
    getCssBottom : function() {
        return this.domNode.style.bottom;
    },
    setCssBottom : function(value) {
        this.domNode.style.bottom = value;
    },
    getCssRight : function(value) {
        return this.domNode.style.right;
    },
    setCssRight : function(value) {
        this.domNode.style.right = value;
    },
    getCssFloat : function() {
        return this.domNode.style.cssFloat;
    },
    setCssFloat : function(value) {
        this.domNode.style.cssFloat = value;
    },
    getCssZIndex : function(value) {
        return this.domNode.style.zIndex;
    },
    setCssZIndex : function(value) {
        this.domNode.style.zIndex = value;
    },
    getCssPosition : function() {
        return this.domNode.style.position;
    },
    setCssPosition : function(value) {
        this.domNode.style.position = value;
    },
    getCssClear : function(value) {
        return this.domNode.style.clear;
    },
    setCssClear : function(value) {
        this.domNode.style.clear = value;
    },
    imashup_interface : {
        properties: {
            cssTop : {type:'string'},
            cssLeft : {type:'string'},
            cssRight : {type:'string'},
            cssBottom : {type:'string'},
            cssFloat : {type:'string'},
            cssZIndex : {type:'integer'},
            cssPosition : {type:'string'},
            cssClear : {type:'string'}
        },
        methods:{},
        events:{}
    }
});