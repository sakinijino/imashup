dojo.provide("imashup.toolpanels.DesktopIcon");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
//dojo.require("dijit.Dialog")
//dojo.require("dojo.dnd.Moveable");
dojo.require("imashup.core.all");
//dojo.require("imashup.plugin.floatingpane.floatingPane");

dojo.declare(
    "imashup.toolpanels.DesktopIcon",
    [dijit._Widget, dijit._Templated],
    {
        templateString: "<div class='imashupDesktopIcon'><div dojoAttachPoint='min'>-</div><div dojoAttachPoint='max'>+</div><div dojoAttachPoint='cls'>*</div><img dojoAttachPoint='img' width=48 height=48 /></div>",
        component : null, // need default icon
        //floatingPane: new imashup.plugin.floatingpane.floatingPane('', 'get'),

        postCreate: function(){
            if (this.component!=null)
                this.img.src = this.component.imashup_webos_small_icon_url

            this.min.className = this.max.className = this.cls.className = "button"

            //this.floatingPane.bindImg(this.id, $(this.img));
            this.inherited("postCreate", arguments);
            //this.tooltipdialog = new dijit.TooltipDialog;
            //dojo.connect(this.img, 'onclick', this.tooltipdialog, 'show')
            dojo.connect(this.img, 'onclick', dojo.hitch(this.component.floatingpane, function(){
                        if (this._isDocked) this.show()
                        else this.minimize()
                }))
            dojo.connect(this.domNode, 'onmouseover', dojo.hitch(this, function(){this.min.className = this.max.className = this.cls.className = "button hover"}))
            dojo.connect(this.domNode, 'onmouseout', dojo.hitch(this, function(){this.min.className = this.max.className = this.cls.className = "button"}))
        }
    }
)