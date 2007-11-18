/*saki*/
dojo.require('dojo.string')
dojo.require('dojox.layout.FloatingPane')
dojo.require('imashup.mixins.WebOSComponent')
dojo.provide('imashup.mixins.WindowComponent')

dojo.declare("imashup.mixins.WindowComponent", imashup.mixins.WebOSComponent, {
    imashup_is_windowcomponent: true,
    resizable: true,
    maxable: true,
    width: null,
    height: null,
    style:"",

    initFloatingPane: function(){
        this._initFloatingPane()
        this.floatingpane.setContent(this.domNode);
    },
    _initFloatingPane: function(){
        var width= this.width==null?"":("width:"+this.width+'px')
        var height= this.height==null?"":("height:"+this.height+'px')
        var style = [this.style, width, height].join(';')
        this.floatingpane = new dojox.layout.FloatingPane({
            maxable:this.maxable,
            resizable:this.resizable,
            closeable:true,
            title:this.imashup_human_name,
            dockable: true,
            style:style})
        if (this.width) this.floatingpane.domNode.style.width = this.width+'px'
        if (this.height) this.floatingpane.domNode.style.height = this.height+'px'
        dojo.connect(this.floatingpane, "close", dojo.hitch(this, function(){imashup.core.instanceManager.destroy(this.id)}))
        if (dojo.isFunction(this.close)) dojo.connect(this.floatingpane, "close", this, 'close')
        if (dojo.isFunction(this.resize)) dojo.connect(this.floatingpane, "resize", this, 'resize')
    }
});