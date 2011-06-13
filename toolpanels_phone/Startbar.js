/*vaporClouds*/
dojo.provide("imashup.toolpanels_phone.Startbar");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit.Toolbar");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.DateTextBox");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels_phone.Startbar",
    [dijit._Widget, dijit._Templated],
    {
      widgetsInTemplate: true,
      imashup_is_singleton: true,
      imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Startbar_large.png"),
      imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Startbar_small.png"),
      templatePath: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Startbar.html"),

      categories: {},

      postCreate: function(){
        dojo.subscribe("channel/send", this, "_notifyChannelSend");

        this.inherited("postCreate", arguments);
        //this.loadComponents();
        //dojo.subscribe("component_manager/register", this, "addComponent")
        this.refreshEra();
		this.highlightEra();

        //dojo.subscribe("instance_manager/add", this, "_addInstance");
        //dojo.subscribe("instance_manager/beforeremove", this, "_removeInstance");
      },

      color: "",

      instanceConnection: null,
	  taskButtonHighlight: false,
	  taskButtonHighlightColor: "",

      _notifyChannelSend : function(){
        //this.taskButton.domNode.style.backgroundColor = "#FBEE99";
		this.taskButtonHighlight = true;
      },
	  
	  highlightEra: function() {
	    var self = this;
		var interFunc=function(){
		  if(self.taskButtonHighlight == false)
		    return;
		  self.taskButton.domNode.style.backgroundColor = self. taskButtonHighlightColor
		  
		  if(self.taskButtonHighlightColor == "")
		    self.taskButtonHighlightColor = "#FFFF00";
		  else
		    self.taskButtonHighlightColor = "";
        }
        setInterval(interFunc, 500);
	  },
	  
      /*
       _addInstance: function(component) {
       this.instanceTitle.set('label', component.imashup_human_name);
       this.instanceConnection = dojo.connect(this.instanceButton, "onClick",
				function() {
					imashup.core.instanceManager.destroy(component.id);
				}
			);
		},
		_removeInstance: function(component) {
			this.instanceTitle.set('label', "");
			//delete this.instanceConnection;
		},
		
        loadComponents: function(){
            var _this = this;
            imashup.core.componentTypeManager.forEach(function(impl_name, impl){
            		if (!impl.prototype.imashup_is_weboscomponent) return;
                _this.addComponent(impl_name, impl)
                _this.mStart.startup();
            });
        },
        
        addComponent: function(impl_name, impl){
        		var mi = new dijit.MenuItem({label:imashup.core.componentTypeManager.getHumanName(impl_name)});
                mi.onClick = function(){imashup.core.instanceManager.create(impl_name,{},null);};
                
               	var cs = imashup.core.componentTypeManager.getCategories(impl_name)
               	if (cs.length == 0)
               		this.mStart.addChild(mi);
               	else if (this.categories[cs[0]] != null)
               		this.categories[cs[0]].addChild(mi)
               	else {
               		this.categories[cs[0]] = new dijit.Menu();
               		this.categories[cs[0]].addChild(mi)
               		this.mStart.addChild(new dijit.PopupMenuItem({label:cs[0], popup:this.categories[cs[0]]}));
               	}
        },
		*/

      initTaskMgr: function() {
        //this.taskButton.domNode.style.backgroundColor = ""
		this.taskButtonHighlight = false;
        dijit.byId("desktop").initTaskMgr();
        dijit.byId("instancebar").initTaskMgr();
      },

      initSvcMenu: function() {
        dijit.byId("desktop").initSvcMenu();
        dijit.byId("instancebar").initSvcMenu();
      },

      refreshEra: function(){ //TODO:CANLENDAR
        var t=this.time;
        var interFunc=function(){
          var gtm = new Date();
          dijit.byId("startbar").timeButton.containerNode.childNodes[1].innerHTML = dojo.date.locale.format(gtm, { datePattern: "yyyy-MM-dd HH:mm:ss", selector: "date"})
        }
        setInterval(interFunc,1000);
      },
    }
  ); 

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels_phone.Startbar',
    interface: {
        properties: {
            color : {type:'string'}
        },
        methods: {},
        events: {}
    }
    //mixin_types : ['webos']
});
