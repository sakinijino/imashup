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

        componentTypeEnumeration: [],

        postCreate: function(){
            dojo.connect(this.setupHwd,"onclick",this,"setup");
            this.inherited("postCreate", arguments);
        },

        getComponentTypeEnumeration: function(){
            this.updateComponentTypeEnumeration();
            var template = {};
            var data = {};
            dojo.forEach(this.componentTypeEnumeration, function(o){
                var name = o.name.replace(/\./g,'_');//erase ambiguity of . in form auto-filling
                                template[name] = {"dojoType":"dijit.form.CheckBox", "value":"on"};
                data[name] = (o.flag==true?["on"]:[]);
            })
            return dojo.toJson({"template":template,"data":data}, true);
        },

        setComponentTypeEnumeration: function(data){
            var cte = this.componentTypeEnumeration;
            for (var i = 0 ; i < cte.length ; i++){
                var name = cte[i].name.replace(/\./g,'_');//erase ambiguity of . in form auto-filling
                var choice = (data[name].join("")=="on"?true:false);
                if(cte[i].flag ^ choice)
                    if(cte[i].flag==true)
                        this.removeItem(cte[i].name);
                else
                    this.addItem(cte[i].name);
            }
        },

        updateComponentTypeEnumeration: function(){
            var cte = this.componentTypeEnumeration;
            if(cte.length==0)
                imashup.core.componentTypeManager.forEach(function(name, impl){
                    cte.push({"name":name,"flag":false,"pNode":null});
                });
            else{
                var _temp = {};
                imashup.core.componentTypeManager.forEach(function(name, impl){
                    _temp[name] = name;
                });
                for (var i=0; i < cte.length; i++){
                    var o = cte[i];
                    if(_temp[o.name]==null)
                        cte.splice(i, 1);
                    delete _temp[o.name];
                }
                for (var j in _temp)
                    cte.push({"name":_temp[j],"flag":false,"pNode":null});
            }
        },

        addItem: function(impl_name){
            var newItem = new dojox.widget.FisheyeListItem();
            try{
                var module, path, _this = this;
                path = imashup.core.componentTypeManager.getImpl(impl_name).prototype.imashup_webos_large_icon_url.toString();

                newItem.label=impl_name;
                newItem.iconSrc=path;
                //newItem.onClick = function(){_this.launchItem(newItem.label);};
                dojo.connect(newItem,"onClick",function(){_this.launchItem(newItem.label);})
                newItem.postCreate();
                this.dockTable.addChild(newItem);
                for (var i = 0;i < this.componentTypeEnumeration.length;i++){
                    var o = this.componentTypeEnumeration[i];
                    if (o.name == impl_name){
                        o.flag = true;
                        o.pNode = newItem;
                        break;
                    }
                }

                newItem.startup();
                this.dockTable.startup();
                this.onIncrease(impl_name);
                return true;
            }catch(e){
                newItem.destroy();
                return false;
            }
        },

        removeItem: function(impl_name){
            try{
                for (var i = 0;i < this.componentTypeEnumeration.length;i++){
                    var o = this.componentTypeEnumeration[i];
                    if (o.name == impl_name){
                        if(o.flag == false)
                            return;
                        o.flag = false;
                        o.pNode.destroy();
                        o.pNode = null;
                    }
                }
                this.dockTable.startup();
                this.onDecrease(impl_name);
                return true;
            }catch(e){
                return false;
            }
        },

        launchItem: function(impl_name){
            for (i = 0;i < this.componentTypeEnumeration.length;i++){
                var o = this.componentTypeEnumeration[i];
                if (o.name == impl_name){
                    o.pNode.domNode.className = "dojoxFisheyeListItemLaunched";
                }
            }
            //return; //fix me
            return imashup.core.instanceManager.create(impl_name,{},null);
        },

        closeItem: function(impl_name){
            //maybe we get impl_name from instance.declaredClass???
            for (var i = 0;i < this.componentTypeEnumeration.length;i++){
                var o = this.componentTypeEnumeration[i];
                if (o.name == impl_name){
                    o.pNode.domNode.className = "dojoxFisheyeListItem";
                }
            }
            return; //fix me
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
            componentTypeEnumeration : {type:'complex'}
                },
        methods: {},
        events: {}
    },
    mixin_types : ['webos']
});