/*saki*/
dojo.provide('imashup.mixins.SizableComponent')

dojo.declare("imashup.mixins.SizableComponent", null, {
    getDesktopBox: function(){
      return dojo.position(dijit.byId("desktop").wall);
    },
    getCssHeight : function() {
        return this.domNode.style.height;
    },
    setCssHeight : function(value) {
        this.domNode.style.height = value;
    },
    getCssWidth : function(value) {
        return this.domNode.style.width;
    },
    setCssWidth : function(value) {
        this.domNode.style.width = value;
    },
    imashup_interface : {
        properties: {
            cssWidth : {type:'string'},
            cssHeight : {type:'string'}
        },
        methods:{},
        events:{}
    }
});
