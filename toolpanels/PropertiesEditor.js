dojo.provide("imashup.toolpanels.PropertiesEditor");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("imashup.toolpanels.module.all");

dojo.declare(
    "imashup.toolpanels.PropertiesEditor",
    [dijit._Widget, dijit._Templated],
    {
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/PropertiesEditor.html"),
        widgetsInTemplate: true,

        ins: null,
        dlgs: [],
        formManager: null,
        compManager: null,
        
        postCreate: function(){
        		this.formManager = imashup.toolpanels.module.FormGenerator;
        		this.compManager = imashup.core.componentTypeManager;
        		this.inherited('postCreate', arguments);
        },
				setFocusWidget: function(ins){
            this.clear();
            if(ins == null) {
                this.dialog.hide();
                return;
            }
            this.ins = ins;
            var humanName = this.compManager.getHumanName(ins.imashup_impl_name);
            this.dialog.titleNode.innerHTML = "Setting ["+humanName+"]";
			      
			      var mixIn={}; //TODO: remove this, by changing dialog->window, 
			      							//			with every tab corresponding to every property
			      for (var name in this.ins.imashup_interface.properties){
			      		mixIn[name] = this.ins.imashup_getProperty(name);
			      }
			      this.formManager.build(this.ins.id, mixIn, humanName);
						this.threadButtons();
						var div = document.createElement('div');
	        	var f = this.formManager.get()[this.ins.id].domNode;
	        	this.pane.setContent(f);
	        	this.pane.startup();
	 					this.dialog.show();			
				},
        
        threadButtons: function(){
        		var dlgCollection = this.dlgs;
        		var forms = this.formManager.get();
        		for (var i in forms){
        			var form = forms[i];
	        		dojo.forEach(form.getDescendants(), function(element){
	        				if(element.declaredClass=='dijit.form.Button'){
	        						var dlg = new dijit.Dialog();
	        						var dueForm = forms[element.name];
	        						if(!dueForm) console.debug('No such form created:', element.name);
	        						var btn = new dijit.form.Button({label:"OK"});
	        						btn.onClick = function(){dlg.hide();};
	        						dlg.titleNode.innerHTML =  element.name;
	        						var div = document.createElement("div");
	        						div.appendChild(dueForm.domNode);
	        						div.appendChild(document.createElement("BR"));
	        						div.appendChild(document.createElement("BR"));
	        						div.appendChild(btn.domNode);
	        						dlg.setContent(div);
	        						dlg.startup();
	        						dlg.hide();
	        						
	        						element.onClick = function(){dlg.show();};
	        						dlgCollection.push(dlg);
	        				}
	        		})
        		}
        },
		    saveChanged: function() {/*TODO: See TODO in setFocusWidget*/
		    	var valueObj = this.formManager.getValues(this.ins.id);
		    	
		      for (var name in this.ins.imashup_interface.properties){
							this.ins.imashup_setProperty(name, valueObj[name]);
		      }
		      this.dialog.hide();
		    },

		    cancelChanged: function() {
		        this.dialog.hide();
		    },

		    clear: function() {
		        this.ins = null;
		        this.dialog.titleNode.innerHTML = "";
						this.pane.domNode.innerHTML = "";
						
		        dojo.forEach(this.dlgs, function(dlg){
		        		dlg.destroy();
		        });
		        this.dlgs = [];
		        
		        if(this.formManager) this.formManager.clear();
		    }
}
);
