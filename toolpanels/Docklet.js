/*vaporClouds*/
dojo.provide("imashup.toolpanels.Docklet");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dojox.widget.FisheyeList");
dojo.require("dijit.Dialog");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.Tooltip");
dojo.require("imashup.core.all");

dojo.declare(
  "imashup.toolpanels.Docklet",
  [dijit._Widget, dijit._Templated],
  {
    widgetsInTemplate: true,
    imashup_is_singleton: true,
    imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet_large.png"),
    imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet_small.png"),
    templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Docklet.html"),

    componentTypeEnumeration: {},

    postCreate: function(){
      dojo.connect(this.setupHwd,"onclick",this,"setup");
      dojo.subscribe("instance_manager/add", dojo.hitch(this, function(component){
            if (imashup.core.componentTypeManager.getInstanceCount(component.imashup_impl_name) >0 )
              this.launchItem(component.imashup_impl_name)
          }))
      dojo.subscribe("instance_manager/beforeremove", dojo.hitch(this, function(component){
            if (imashup.core.componentTypeManager.getInstanceCount(component.imashup_impl_name) <=0 )
              this.closeItem(component.imashup_impl_name)
          }))
      this.inherited("postCreate", arguments);
    },

    getComponentTypeEnumeration: function(){
      this.updateComponentTypeEnumeration();
      var obj={};
      obj.notLoopInPE= true;
      for (var i in this.componentTypeEnumeration){
        var o = this.componentTypeEnumeration[i];
        obj[i]= {};
        obj[i].value = o.flag;
        obj[i].humanname = o.humanname;
      }
      return obj;
    },

    setComponentTypeEnumeration: function(data){
      for (var i in data){
        var o = this.componentTypeEnumeration[i];
        o.flag = data[i];
      }
      this.updateComponentTypeEnumeration();
    },

    updateComponentTypeEnumeration: function(){
      var cte = this.componentTypeEnumeration;
      //Consistency with manager
      if(cte=={})
        imashup.core.componentTypeManager.forEach(function(name, impl){
            if (!impl.prototype.imashup_is_weboscomponent) return;
            cte.push({"name":name, "flag":false,"pNode":null, "humanname":imashup.core.componentTypeManager.getHumanName(name)+' Shortcut'});
          });
      else{
        var _temp = {};
        imashup.core.componentTypeManager.forEach(function(name, impl){
            if (!impl.prototype.imashup_is_weboscomponent) return;
            _temp[name] = name;
          });
        for (var i in cte){
          var o = cte[i];
          if(_temp[i]==null)
            delete cte[i];
          delete _temp[i];
        }
        for (var j in _temp)
          cte[_temp[j]] = {"flag":false, "pNode":null, "humanname":imashup.core.componentTypeManager.getHumanName(_temp[j])};
      }
      //Appearence
      for (var i in cte){
        if(cte[i].flag==false && cte[i].pNode!=null)
          this.removeItem(i);
        else if (cte[i].flag==true && cte[i].pNode==null)
        this.addItem(i);
      }
    },

    addItem: function(impl_name){
      var newItem = new dojox.widget.FisheyeListItem();
      try{
        var module, path, _this = this;
        path = imashup.core.componentTypeManager.getImpl(impl_name).prototype.imashup_webos_large_icon_url.toString();

        newItem.label=imashup.core.componentTypeManager.getHumanName(impl_name);
        newItem.iconSrc=path;
        dojo.connect(newItem,"onClick",function(){imashup.core.instanceManager.create(impl_name,{},null);})
        newItem.postCreate();
        this.dockTable.addChild(newItem);

        this.componentTypeEnumeration[impl_name].flag = true;
        this.componentTypeEnumeration[impl_name].pNode = newItem;

        newItem.startup();
        this.dockTable.startup();
        this.onIncrease(impl_name);
        if (imashup.core.componentTypeManager.getInstanceCount(impl_name) > 0) this.launchItem(impl_name)
          return true;
      }catch(e){
        newItem.destroy();
        this.componentTypeEnumeration[impl_name].flag = false;
        this.componentTypeEnumeration[impl_name].pNode = null;
        return false;
      }
    },

    removeItem: function(impl_name){
      try{
        var o = this.componentTypeEnumeration[impl_name];
        o.flag = false;
        if(o.pNode == null) return;
        o.pNode.destroy();
        o.pNode = null;
        this.dockTable.startup();
        this.onDecrease(impl_name);
        return true;
      }catch(e){
        return false;
      }
    },

    launchItem: function(impl_name){
      var o = this.componentTypeEnumeration[impl_name];
      if (o.pNode) o.pNode.domNode.className = "dojoxFisheyeListItemLaunched";
    },

    closeItem: function(impl_name){
      var o = this.componentTypeEnumeration[impl_name];
      if (o.pNode) o.pNode.domNode.className = "dojoxFisheyeListItem";
    },

    onIncrease: function(impl_name){
    },

    onDecrease: function(impl_name){
    },

    setup: function(){//should be a uniform function for all the panels!
    }
  }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels.Docklet',
    interface: {
      properties: {
        componentTypeEnumeration : {type:'object', humanname:"Shortcuts"}
      },
      methods: {},
      events: {}
    }
    //mixin_types : ['webos']
  });
