dojo.provide("imashup.components.crcc.Contacts");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
  "imashup.components.crcc.ContactPerson",
  [],
  {
    name: "",
    email: "",
    phone: "",
    city: ""
  }
)

dojo.declare(
    "imashup.components.crcc.Contacts",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/contacts_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/contacts_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.crcc", "templates/Contacts.html"),
		
		resizable: false,
		maxable: false,
		width: 400,
		height: 300,
		
		imashup_human_name: "Contacts",
		imashup_catergories: ['Applications'],
		
		curPerson: null,
    persons: {},
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
			imashup.core.LocalStorageManager.newLocalStorage();
      var localStorage = imashup.core.LocalStorageManager.LocalStorage;
      var persons = localStorage.findAll("imashup.components.crcc.ContactPerson");
      for (var i = 0; i<persons.length; ++i)
        this.persons[persons[i].id] = persons[i]
      this.updateList();
		},
		
		clearList: function() {
      dojo.query("table.list tbody", this.listPanel)[0].innerHTML = ""
		},

		updateList: function() {
			this.clearList();
      var flag = 0;
      var _this = this;
			for ( var i in this.persons ) {	
        var klass = flag++ % 2 ? "row_even" : "row_odd";
        if (this.curPerson && i == this.curPerson.id) klass += " selected";
				var tr = dojo.create("tr", { 
            innerHTML : "<td>"+this.persons[i].name+"</td>",
            "class": klass
          }, 
          dojo.query("table.list tbody", this.listPanel)[0]
        );
        dojo.connect(tr, "click", function(id){ return function(){
            _this.curPerson = _this.persons[id];
            _this.displayCurPerson();
            _this.CurrentContact(_this.curPerson);
          }}(i))
			}
			this.displayCurPerson();
		},
    
    hideAllPanels: function(){
      this.result.style.display = "none";
      this.addPanel.style.display = "none";
    },
		
		displayCurPerson: function(){
      this.hideAllPanels()
      if(this.curPerson == null) return;

      this.result.style.display="block";
      this.result_name.innerHTML = this.curPerson.name; 
      this.result_email.innerHTML = this.curPerson.email;
      this.result_phone.innerHTML = this.curPerson.phone;
      this.result_city.innerHTML = this.curPerson.city;
    },

    CurrentContact: function(/* Person */ person){},
		
		onnew:function(){
      this.hideAllPanels()
      this.curPerson = null;
      this.addPanel.style.display="block";
      this.input_name.value = ""; 
      this.input_email.value = "";
      this.input_phone.value = "";
      this.input_city.value = "";
		},

		onupdate: function(){
      this.hideAllPanels()
      this.addPanel.style.display="block";
      this.input_name.value = this.curPerson.name; 
      this.input_email.value = this.curPerson.email;
      this.input_phone.value = this.curPerson.phone;
      this.input_city.value = this.curPerson.city;
		},
		
		onsubmit: function(){
			if (this.input_name.value && this.input_name.value != "") {
        if(this.curPerson==null){
          this.curPerson = new imashup.components.crcc.ContactPerson()
          this.curPerson.name =this.input_name.value;
          this.curPerson.email =this.input_email.value;
          this.curPerson.phone =this.input_phone.value;
          this.curPerson.city =this.input_city.value;
          var localStorage = imashup.core.LocalStorageManager.LocalStorage;
          localStorage.save(this.curPerson);
          this.persons[this.curPerson.id] = this.curPerson
        }
        else{             
          this.curPerson.name =this.input_name.value;
          this.curPerson.email =this.input_email.value;
          this.curPerson.phone =this.input_phone.value;
          this.curPerson.city =this.input_city.value;
          var localStorage = imashup.core.LocalStorageManager.LocalStorage;
          localStorage.update(this.curPerson);
        }
        this.updateList();
      }
      else {
        alert("Person name can't be blank");
      }
		},
		
		ondelete: function(){
      if(this.curPerson==null) return;
      var localStorage = imashup.core.LocalStorageManager.LocalStorage;
      localStorage.remove(this.curPerson);
      delete this.persons[this.curPerson.id]
      this.curPerson = null
      this.updateList();
		},

    oncancel: function(){
      this.hideAllPanels();
      this.displayCurPerson();
    }
	}
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.crcc.Contacts',
    "interface": {
      properties: {},
      methods: {},
      events: {
        "CurrentContact": { Function: "CurrentContact", CustomMethod: "/* arguments[0]: Person */" }
      }
    },
    mixin_types : ['window']
});
