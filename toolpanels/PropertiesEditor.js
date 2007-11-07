dojo.provide("imashup.toolpanels.PropertiesEditor");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");

dojo.declare(
    "imashup.toolpanels.PropertiesEditor",
    [dijit._Widget, dijit._Templated],
    {
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/PropertiesEditor.html"),
        widgetsInTemplate: true,

        postCreate: function(){
            this.inherited("postCreate", arguments);
        },

        propinputs: null,
        ins: null,

        setFocusWidget: function(ins)
        {
            this.clear();
            if(ins == null) {
                this.dialog.hide();
                return;
            }
            this.ins = ins;
            this.propinputs = {"simple":null,"complex":null};
            this.dialog.titleNode.innerHTML = "Setting ["+ins.id+"]";
			
			var simpleGroup=[],complexGroup=[];
            for (var name in this.ins.imashup_interface.properties){
                var prop = this.ins.imashup_interface.properties[name];
                if(prop.type.toLowerCase()!="complex") 
                	simpleGroup.push({"name":name,"prop":prop});
                else
                	complexGroup.push({"name":name,"prop":prop});
            };
            if(simpleGroup.length) this.groupInSimple(simpleGroup);
            if(complexGroup.length) this.groupInComplex(complexGroup);
            this.dialog.show();
        },
        	
        groupInSimple: function(simpleGroup){
        	var form = new dijit.form.Form({"action":""});
        	var table = document.createElement("table");
        	for (var g=0 ; g < simpleGroup.length ; g++){
	        	var name=simpleGroup[g].name, prop=simpleGroup[g].prop;
	            var tr = document.createElement('tr');
	            var td = document.createElement('td');
	            td.innerHTML = name;
	            tr.appendChild(td);
	            var td = document.createElement('td');
	            td.innerHTML = prop.type.toLowerCase();
	            tr.appendChild(td);
	            var td = document.createElement('td');
	            var input = new dijit.form.TextBox();
	            input.name = name;
	            input.setValue(this.ins.imashup_getProperty(name));
	            //input.domNode.style.width="50%";
	            td.appendChild(input.domNode);
	            tr.appendChild(td);
	            table.appendChild(tr);
            }
            form.domNode.appendChild(table);
        	this.pane.domNode.appendChild(form.domNode);
        	this.propinputs.simple = form;
        	console.log(dojo.toJson(form.getValues()));
        	this.pane.startup();
        },
        
        groupInComplex: function(complexGroup){
        	for(var g=0 ; g < complexGroup.length ; g++){
        	var name = complexGroup[g].name;
        	var prop = complexGroup[g].prop;
			var form = new dijit.form.Form({"action":""});
			var table = document.createElement("table");
			var tr,td;
            var jsonExpr = this.ins.imashup_getProperty(name);
            var objExpr = dojo.fromJson(jsonExpr);

        	for (var i in objExpr.template){
				tr = document.createElement("tr");
        		piece = objExpr.template[i];
        		if(piece.dojoType!="dijit.layout.ContentPane"){
        			dojo.require(piece.dojoType);
        			eval("var _mustnotconflictgloblv = new "+piece.dojoType+"({name:'"+i.toString()+"'});");
					_mustnotconflictgloblv.value=piece.value;
					_mustnotconflictgloblv.startup();
					td = document.createElement("td");
					td.innerHTML = i;
					tr.appendChild(td);
					td = document.createElement("td");
					td.appendChild(_mustnotconflictgloblv.domNode);
					tr.appendChild(td);
        		}else{//recursive
        			
        		}
        		table.appendChild(tr);
        	}

        	form.domNode.appendChild(table);
			form.setValues(objExpr.data);
        	this.pane.domNode.appendChild(form.domNode);
        	this.propinputs.complex = form;
        	this.pane.startup();
        	}
        },
        	
        saveChanged: function() {
        	//simple
        	if(this.propinputs.simple)
            for (var name in this.ins.imashup_interface.properties){
                this.ins.imashup_setProperty(name, this.propinputs.simple.getValues()[name])
            }
        	//complex
        	if(this.propinputs.complex)
            for (var name in this.ins.imashup_interface.properties){
                this.ins.imashup_setProperty(name, this.propinputs.complex.getValues())
            }
            this.dialog.hide();
        },

        cancelChanged: function() {
            this.dialog.hide();
        },

        clear: function() {
            this.ins = null;
            this.dialog.titleNode.innerHTML = "";
            this.pane.destroyDescendants();
            this.propinputs = null;
            //this.pane.domNode.innerHTML="";
        }
    }
);