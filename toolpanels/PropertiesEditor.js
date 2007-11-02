dojo.provide("imashup.toolpanels.PropertiesEditor");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Dialog");

dojo.declare(
    "imashup.toolpanels.PropertiesEditor",
    [dijit._Widget, dijit._Templated],
    {
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/PropertiesEditor.html"),
        widgetsInTemplate: true,

        postCreate: function(){
            this.inherited("postCreate", arguments);
        },

        propinputs: {},
        ins: null,

        setFocusWidget: function(ins)
        {
            this.clear();
            if(ins == null) {
                this.dialog.hide();
                return;
            }
            this.ins = ins;
            this.dialog.titleNode.innerHTML = ins.id+" Setting";

            for (var name in this.ins.imashup_interface.properties){
                var prop = this.ins.imashup_interface.properties[name];
                var tr = document.createElement('tr');
                var td = document.createElement('td');
                td.innerHTML = name;
                tr.appendChild(td);
                var td = document.createElement('td');
                td.innerHTML = prop.type.toLowerCase();
                tr.appendChild(td);
                var td = document.createElement('td');
                var input = document.createElement('input');
                input.size = 15;
                this.propinputs[name] = input;
                input.value = ins.imashup_getProperty(name)
                td.appendChild(input);
                tr.appendChild(td);
                this.propstable.appendChild(tr);
            };
            this.dialog.show();
        },

        saveChanged: function() {
            for (var name in this.ins.imashup_interface.properties){
                this.ins.imashup_setProperty(name, this.propinputs[name].value)
            }
            this.dialog.hide();
        },

        cancelChanged: function() {
            this.dialog.hide();
        },

        clear: function() {
            this.ins = null;
            this.dialog.titleNode.innerHTML = "";
            if (dojo.isIE) {
                this.propstable; //???? to be fixed
            }
            else this.propstable.innerHTML = "";
            this.propinputs = {};
        }
    }
);