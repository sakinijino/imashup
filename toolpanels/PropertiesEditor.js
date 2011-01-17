dojo.provide("imashup.toolpanels.PropertiesEditor");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberSpinner");
//dojo.require("dijit.form.ComboBox");
dojo.require("dijit.form.CheckBox");
//dojo.require("dijit.form.DateTextBox"); //fix me

dojo.declare(
  "imashup.toolpanels.PropertiesEditor",
  [dijit._Widget, dijit._Templated],
  {
    templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/PropertiesEditor.html"),
    widgetsInTemplate: true,

    postCreate: function(){
      dojo.isNumber = function(v){
        return (typeof v == 'number') || (v instanceof Number);
      }
      dojo.isBoolean = function(v){
        return (typeof v == 'boolean') || (v instanceof Boolean);
      }
      this.inherited("postCreate", arguments);
    },

    hashForms: null,
    ins: null,
    childDlgs: [],

    setFocusWidget: function(ins){
      this.clear();
      if(ins == null) {
        this.dialog.hide();
        return;
      }
      this.ins = ins;
      this.dialog.titleNode.innerHTML = "Setting ["+imashup.core.componentTypeManager.getHumanName(ins.imashup_impl_name)+"]";

      this.childDlgs = [];
      var form = new dijit.form.Form({"action":""});
      this.hashForms = {};
      this.hashForms[ins.id] = form;
      var table = document.createElement("table");

      for (var name in this.ins.imashup_interface.properties){
        this._prop2row(name, this.ins.imashup_getProperty(name), 
          table, this.ins.imashup_interface.properties[name].humanname==null?name:this.ins.imashup_interface.properties[name].humanname);
      };
      form.domNode.appendChild(table);
      this.pane.domNode.appendChild(form.domNode);
      this.pane.startup();

      this.dialog.show();			
    },

    _prop2row: function(propName, propIns, pTable, humanname){
      if (propIns == null || propIns == undefined)
        return null;
      //Group like this:
      //Simple type: one row
      //Complex type(array, object): one button, new Dialog
      var td = null, text = null;
      var tr = document.createElement("tr");
      var fun = function(input,setFunction,humanname){
        input.name = propName;
        input[setFunction](propIns);	

        td = document.createElement("td");
        //td.width="30%";
        text = document.createTextNode(humanname);
        td.appendChild(text);
        tr.appendChild(td);
        td = document.createElement("td");
        td.appendChild(input.domNode);
        tr.appendChild(td);
      }
      if (dojo.isString(propIns)){
        var input = new dijit.form.TextBox();
        fun(input,"setValue", humanname);
      }else if (dojo.isNumber(propIns)){
        var input = new dijit.form.NumberSpinner();
        fun(input,"setValue", humanname);
      }else if (dojo.isBoolean(propIns)){
        var input = new dijit.form.CheckBox();
        fun(input,"setChecked", humanname);
      }else if (dojo.isArray(propIns)){
        var _this = this, index=0;
        dojo.forEach(propIns, function(per){
            _this._prop2row(propName.concat("_"+index++), per, pTable, humanname==null?propName:humanname.concat("_"+index));
          })
      }else if (dojo.isArrayLike(propIns)){
        console.log("arraylike");
      }else if (dojo.isObject(propIns) && propIns.notLoopInPE){
        for (var i in propIns){
          if (i!='notLoopInPE')
            this._prop2row(propName+"."+i, propIns[i].value, pTable, propIns[i].humanname);
      }
      }else if (dojo.isObject(propIns)){
        //Create a button linked to new dialog
        var dlg = new dijit.Dialog();
        dlg.titleNode.innerHTML = humanname;
        var btn_ok = new dijit.form.Button();
        this.childDlgs.push(dlg);

        var btn = new dijit.form.Button(); //forget to delete
        btn.setLabel("More...");	
        btn.onClick = function(){dlg.show();}
        td = document.createElement("td");
        td.appendChild(document.createTextNode(humanname));
        tr.appendChild(td);
        td = document.createElement("td");
        td.appendChild(btn.domNode);
        tr.appendChild(td);

        var form = new dijit.form.Form({"action":""});
        this.hashForms[propName] = form;

        var table = document.createElement("table");
        for (var i in propIns){
          this._prop2row(propName+"."+i, propIns[i], table, propIns[i].humanname==null?propName+"."+i:propIns[i].humanname);
        }
        form.domNode.appendChild(table);
        btn = new dijit.form.Button();
        btn.setLabel("OK");
        btn.onClick = function(){dlg.hide();}
        form.domNode.appendChild(btn.domNode);
        form.startup();

        dlg.setContent(form.domNode);
        dlg.startup();
      }
      pTable.appendChild(tr);
    },

    saveChanged: function() {
      var _this = this;
      var getObjValue = function(name,prop,formName){
        var value = null;
        if(dojo.isArray(prop)){
          value = [];
          for (var i=0; i < prop.length; i++){
            value.push(getObjValue(name+"_"+i, prop[i], formName));
          }
        }else if(dojo.isObject(prop) && !prop.notLoopInPE){
          value = {};
          for (var i in prop){
            value[i] = getObjValue(name+"."+i, prop[i], name);
          }
        } else if(dojo.isObject(prop)) {
          value = {};
          for (var i in prop){
            if (i!='notLoopInPE')
              value[i] = getObjValue(name+"."+i, prop[i].value, formName);
          }
        }else{
          var ar = name.split('.');
          var i = 0;
          value = _this.hashForms[formName].getValues();
          while(i<ar.length)
            value = value[ar[i++]];
          value = (dojo.isBoolean(prop)?(value.length==0?false:true):value);
        }
        return value;
      }

      for (var name in this.ins.imashup_interface.properties){
        var prop = this.ins.imashup_getProperty(name);
        var value = getObjValue(name, prop, this.ins.id);
        this.ins.imashup_setProperty(name, value);
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
      for (var i in this.hashForms){
        //this.hashForms[i].destroyDescendants();
        this.hashForms[i].destroy();
        delete this.hashForms[i];
      }
      dojo.forEach(this.childDlgs,function(d){
          d.destroy();
        })
      this.hashForms = null;
      this.childDlgs = null;
      //this.pane.domNode.innerHTML="";
    }
  }
);
