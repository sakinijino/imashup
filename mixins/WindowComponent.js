/*saki*/
dojo.require('dojo.string')
dojo.require('dojox.layout.FloatingPane')
dojo.require('imashup.mixins.WebOSComponent')
dojo.provide('imashup.mixins.WindowComponent')

dojo.declare("imashup.mixins.WindowComponent", imashup.mixins.WebOSComponent, {
    imashup_is_windowcomponent: true,
    resizable: true,
    maxable:false,
    style:"",

    initFloatingPane: function(){
        this.floatingpane = new dojox.layout.FloatingPane({
            maxable:this.maxable,
            title:this.id,
            resizable:this.resizable,
            style:this.style})
        this.floatingpane.setContent(this.domNode);
        var _this = this;
        dojo.connect(this.floatingpane, "close", function(){imashup.core.instanceManager.destroy(_this.id)})
        dojo.connect(this.floatingpane, "resize", this, "resize")
    },

    resize: function(){},

    close: function(){
        this.floatingpane.close()
    }
});