//by vaporClouds
dojo.require("dijit.Dialog"); //for ColorPanatte use, pls fix me

dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.NumberSpinner");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.DateTextBox");
dojo.require("dojo.date.locale");
dojo.require("dijit.ColorPalette");

dojo.provide('imashup.toolpanels.module.FormElement');
dojo.provide('imashup.toolpanels.module.DateElement');
dojo.provide('imashup.toolpanels.module.StringElement');
		dojo.provide('imashup.toolpanels.module.StringColorElement');
		dojo.provide('imashup.toolpanels.module.StringURLElement');	
dojo.provide('imashup.toolpanels.module.StringDispatcher');
dojo.provide('imashup.toolpanels.module.NumberElement');
dojo.provide('imashup.toolpanels.module.BooleanElement');
dojo.provide("imashup.toolpanels.module.FormGenerator");

/**
*FormElement is the abstract class of all the element
*/

dojo.declare(
		'imashup.toolpanels.module.FormElement', 
		null, {
				element: null,
				namespace: "",
				
				_constructor: function(name, value){
						this.setElement(name, value);
				},
				getName: function(){
						return this.element.name;
				},
				getNameNoNS: function(){
						return this.getName().substr(this.getNamespace().length+1);
				},
				getValue: function(){
						return this.element.getValue();
				},
				setElement: function(name, value){ //TODO
						//this.element.name = name;
				},
				getElement: function(){
						return this.element;
				},
				setNamespace: function(ns){
						this.namespace = ns;
				},
				getNamespace: function(){
						return this.namespace;
				},
				
				getBorder: function(){
						var div=document.createElement('div');
						div.appendChild(this.element.domNode);
						return div;
				}
});

/**
*DateElement matches date objects
*/
dojo.declare(
		'imashup.toolpanels.module.DateElement', 
		imashup.toolpanels.module.FormElement, {
				setElement: function(name, value){
						var node = document.createElement('node');/*what does this fucking for?*/
						this.element = new dijit.form.DateTextBox({
								'name':name,
								'value':value,
								'lang':"zh-cn", //fix me with i18n, auto-get from OS
								'promptMessage':"mm/dd/yyyy"
						},node);
				}
});

/**
*StringElement accomodates with normal prop & method with strings
*/
dojo.declare(
		'imashup.toolpanels.module.StringElement', 
		imashup.toolpanels.module.FormElement, {			
				setElement: function(name, value){
						this.element = new dijit.form.TextBox();
						this.element.setValue(value);
						this.element.name = name;
				}
});

/**
*StringColorElement matches color strings
*/
dojo.declare(
		'imashup.toolpanels.module.StringColorElement', 
		imashup.toolpanels.module.StringElement, {
				colorDlg: null,
				invokeBtn: null,
				setElement: function(name, value){	
						this.element = new dijit.form.TextBox();
						this.element.setValue(value);
						this.element.domNode.style.width = "76%";
						this.element.name = name;
						this.setDlg();
				},
				setDlg: function(){
						var _this = this;
						var cp = new dijit.ColorPalette({palette: "7x10"}); //This should be the PE's property, 
																																//which could be modified by user by PE itself!!
						this.colorDlg = new dijit.TooltipDialog();
						this.colorDlg.setContent(cp.domNode);

						this.invokeBtn=new dijit.form.DropDownButton({
								label: '&nbsp;&nbsp;',
								dropDown: _this.colorDlg
						});
						//Remove ¨‹: dojo.query('span.dijitA11yDownArrow',c.invokeBtn.domNode)[0].style.display='none'
						
						this.invokeBtn.domNode.style.fontSize = "xx-small";
						this.invokeBtn.containerNode.style.backgroundColor = this.element.getValue();
						this.invokeBtn.containerNode.style.border = '1px solid #bfbfbf';
						
						cp.onChange = function(color){
								_this.element.setValue(color);
								_this.colorDlg.domNode.style.display = 'none';
								_this.invokeBtn.containerNode.style.backgroundColor = color;
						}
				},
				getBorder: function(){
						var div=document.createElement('div');
						div.appendChild(this.element.domNode);
						div.appendChild(this.invokeBtn.domNode);
						return div;
				},
				getDlg: function(){
						return this.colorDlg;
				}
});

/**
*StringURLElement will be 'Ajaxing' preViews for the URL, TODO
*/
dojo.declare(
		'imashup.toolpanels.module.StringURLElement', 
		imashup.toolpanels.module.StringElement, {
		}
);
/**
*StringDispatcher dispatch strings to corresponding StringElement
*/
dojo.declare(
		'imashup.toolpanels.module.StringDispatcher', 
		null, {
				register: function(name, str){
						if(str.match(/#([\daAbBcCdDeEfF]{6}|[\daAbBcCdDeEfF]{3})/g))
								return new imashup.toolpanels.module.StringColorElement(name, str);
						//else if(str.match(/\d\d\d\d-\d\d-\d\d/g))
						//		return new imashup.toolpanels.module.StringDateElement(name, str);
						else
								return new imashup.toolpanels.module.StringElement(name, str);
				}
});

/**
*NumberElement accomodates with normal prop & method with number
*/
dojo.declare(
		'imashup.toolpanels.module.NumberElement', 
		imashup.toolpanels.module.FormElement, {
				setElement: function(name, value){
						this.element = new dijit.form.NumberSpinner();
						this.element.setValue(value);
						this.element.name = name;
				}
});

/**
*BooleanElement accomodates with normal prop & method with boolean
*/
dojo.declare(
		'imashup.toolpanels.module.BooleanElement', 
		imashup.toolpanels.module.FormElement, {
				setElement: function(name, value){
						this.element = new dijit.form.CheckBox();
						this.element.setChecked(value);
						this.element.name = name;
						this.element.getValue = function(){
							return this.checked;
						}
				},
				getValue: function(){
						return this.element.checked;
				}
});

/**
*ObjectElement is a button
*/
dojo.declare(
		'imashup.toolpanels.module.ObjectElement', 
		imashup.toolpanels.module.FormElement, {
				setElement: function(name, value){
						this.element = new dijit.form.Button();
						this.element.setLabel(value);
						this.element.name = name; /*This may not be necessary, cauz I take over the standard dijit.form.Form.getValues() function*/
				},
				getValue: function(){
						return imashup.toolpanels.module.FormGenerator.getValues(this.getName());
				}
});

dojo.declare(
    "imashup.toolpanels.module.FormGenerator", null, {
    		_hashTables: {},
    		_hashForms: {},
    		_hashElements: {},
		
    		_constructor: function(){
	        	dojo.isNumber = function(v){return (typeof v == 'number') || (v instanceof Number);
	        	}
	        	dojo.isBoolean = function(v){return (typeof v == 'boolean') || (v instanceof Boolean);
	        	}
	        	dojo.isDate = function(v){return (v instanceof Date);
	        	}
    		},
		build: function(name, value, label){
				this.clear();
				this._hashForms[name] = new dijit.form.Form();
				this._hashTables[name] = document.createElement('tbody');
				var table = document.createElement("table");
				table.appendChild(this._hashTables[name]);
				this._hashElements[name] = [];
				this._hashForms[name].domNode.appendChild(table);
				
				if(dojo.isObject(value))
					for (var i in value)
						this.add(name+'.'+i, value[i], name+'.'+i, name);
				else
					this.add(name, value, label, name);
		},
		add: function(name, value, label, formKey){
				if (arguments.length!=4)
						return;
				
				var t = null;
				if (dojo.isString(value))
						t = new imashup.toolpanels.module.StringDispatcher().register(name, value);
				else if (dojo.isNumber(value))
						t = new imashup.toolpanels.module.NumberElement(name, value);
				else if (dojo.isBoolean(value))
						t = new imashup.toolpanels.module.BooleanElement(name, value);
				else if (dojo.isDate(value))
						t = new imashup.toolpanels.module.DateElement(name, value);
				/*(else if (dojo.isArray(value)){
						for (var i = 0 ; i < value.length ; i ++)
								this.add(name+'_'+i, value[i], name+'_'+i, formKey);
						return;
					  
				}*/
				else if (dojo.isObject(value)){
						this._hashForms[name] = new dijit.form.Form();
						this._hashTables[name] = document.createElement('tbody');
						var table = document.createElement("table");
						table.appendChild(this._hashTables[name]);
						this._hashElements[name] = [];
						this._hashForms[name].domNode.appendChild(table);
						
						t = new imashup.toolpanels.module.ObjectElement(name, 'more');
						for (var i in value)
								this.add(name+'.'+i, value[i], name+'.'+i, name);
				}else{
						t = new imashup.toolpanels.module.FormElement(name, value);
				}

				t.setNamespace(formKey);
								
				var tr,td;
				tr = document.createElement("tr");
				td = document.createElement("td");
				td.appendChild(document.createTextNode(t.getNameNoNS()));
				tr.appendChild(td);
				td = document.createElement("td");
				td.appendChild(t.getBorder());
				tr.appendChild(td);

				this._hashElements[formKey].push(t);
				this._hashTables[formKey].appendChild(tr);
				this._hashForms[formKey].startup();
		},
		get: function(){
				return this._hashForms;
		},
		getValues: function(rootFormKey){
				/*return this._hashForms[rootFormKey].getValues();//This has been taken over!*/
				
				var o={};
				dojo.forEach(this._hashElements[rootFormKey], function(element){
						o[element.getNameNoNS()] = element.getValue();
				});
				return o;
		},
		clear: function(){
				for (var i in this._hashForms) 					//Maybe we don't destroy forms, 
					this._hashForms[i].destroyRecursive();//for the sake of outter references

				this._hashForms = {};
				this._hashElements = {};
				this._hashTables = {};
		}
});

imashup.toolpanels.module.FormGenerator = new imashup.toolpanels.module.FormGenerator();