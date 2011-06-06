dojo.provide("imashup.toolpanels_phone.Desktop");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.require("dojo.dnd.Moveable");
dojo.require("imashup.core.all");
dojo.require("imashup.toolpanels_phone.InstanceBar");
//dojo.require("dojo.dnd.Selector")

dojo.declare(
    "imashup.toolpanels_phone.Icon",
    [dijit._Widget, dijit._Templated],
    {
        templateString: "<div class='imashupDesktopIcon' style='width:60px'><table><tr><td width=100% style='text-align:center'>"
			+ "<img dojoAttachPoint='img' width=48 height=48 /></td></tr><tr>"
			+ "<td><div dojoAttachPoint='text' style='width:100%; text-align:center'></div></td></tr></table></div>",
        impl : null, // need default icon
        //floatingPane: new imashup.plugin.floatingpane.floatingPane('', 'get'),

        postCreate: function(){
            if (this.impl!=null) {
                this.img.src = this.impl.prototype.imashup_webos_small_icon_url;
				this.text.innerHTML = this.impl.prototype.imashup_human_name;
				//this.floatingPane.bindImg(this.id, $(this.img));
				this.inherited("postCreate", arguments);
				//this.tooltipdialog = new dijit.TooltipDialog;
				//dojo.connect(this.img, 'onclick', this.tooltipdialog, 'show')
				var self = this
				dojo.connect(this.img, 'onclick', function() {
					imashup.core.instanceManager.create(self.impl.prototype.declaredClass,{},null);
				})
			}
        }
    }
)

dojo.declare(
    "imashup.toolpanels_phone.Desktop",
    [dijit._Widget, dijit._Templated, dijit._Container],
    {
      imashup_is_singleton: true,
      imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Desktop_large.png"),
      imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Desktop_small.png"),
      templatePath: dojo.moduleUrl("imashup.toolpanels_phone", "templates/Desktop.html"),

      wallpaperUrl: "wallpapers/default_phone.jpg",
      wallpaperColor: "#3C6EA4",
      wallpaperStyle: "center",//center
      welcomeBackgroundUrl: "wallpapers/default_phone.jpg",
      instanceBackgroundUrl: "wallpapers/insbg.png",

      dock : null,

      icons: [],
      currentComponent: null,
      changedComponents: {},

      postCreate: function(){
        this._resize();
        this._setWallpaper();
        this._resizeHandler = this.connect(window, "onresize", "_resize");
        dojo.subscribe("instance_manager/add", this, "_addInstance");
        dojo.subscribe("instance_manager/beforeremove", this, "_removeInstance");
        dojo.subscribe("channel/send", this, "_notifyChannelSend");
	  
        //this.iconSelector = new dojo.dnd.Selector();

        this.inherited("postCreate", arguments);
      },

      _resize: function(){
        this._layout();
        this._placeIcons();
      },
      _layout: function(){
        var viewport = dijit.getViewport();
        this.viewport = viewport
        this.wall.style.height = viewport.h - 40 + 'px';
      },

      _addInstance : function(component){
        this.wall.innerHTML = "";
        this.setWallpaperUrl(this.instanceBackgroundUrl);
        //this.setWallpaperColor('#FFFFFF');
        this._initWindowComponent(component);
        this.currentComponent = component;
      },

      _removeInstance : function(component){
        if(this.currentComponent == component)
          this.setWallpaperUrl(this.welcomeBackgroundUrl);
      }, 

      _notifyChannelSend : function(channel, args){
        for (var id in channel.recievers)
          this.changedComponents[channel.recievers[id].rID] = true
      },

      _initWindowComponent : function(component) {
        this.wall.appendChild(component.domNode);
        dojo.parser.parse(this.wall);
      },

      // Section for All Services Menu Functions
      icons: [],
      initSvcMenu : function() {
        this.wall.innerHTML = "";
        this.currentComponent = null;
        this.setWallpaperUrl(this.instanceBackgroundUrl);
        var _this = this;
        this.icons.length = 0;
        imashup.core.componentTypeManager.forEach(function(impl_name, impl){
            if (!impl.prototype.imashup_is_weboscomponent) return;
            var icon = new imashup.toolpanels_phone.Icon({impl:impl})
            icon.domNode.style.position = 'absolute'
            _this.icons.push(icon);
            _this.wall.appendChild(icon.domNode);
            _this._placeIcons();
          });
      },

      _placeIcons : function() {
        var w = window.innerWidth;
        var flag = 0;
        var border = parseInt((w - 10) / 80)
        var rol = 0;
        for (var i=0; i < this.icons.length; ++i){
          var ic = this.icons[i].domNode
          ic.style.top = (100*rol + 15) + 'px'
          ic.style.left = (80*flag + 15) + 'px'
          flag++
            if(flag == border) {rol++;flag=0}
        }
      },

      // Section for Task Manager Functions
      taskRefreshConnection: null,
      initTaskMgr : function() {
        this.wall.innerHTML = "";
        this.currentComponent = null;
        this.setWallpaperUrl(this.instanceBackgroundUrl);
        var panel = dojo.create("div", {
            style: "margin:10px",
            innerHTML: "<table style='border:1px solid gray; border-spacing: 0px'><thead><tr><th width=95%></th><th width=5%></th></tr></thead><tbody></tbody></table>"
          }, this.wall);
        // Check every instance for whether it has events or methods
        var count = 0
        var self = this;
        for ( var item in imashup.core.instanceManager._hash) {
          var normalcol = "#EFEFEF";
          var highlightcol = "#FBEE99";
          var bcolor = this.changedComponents[item] ? highlightcol : normalcol;
          var tr = dojo.create("tr", {style:"background:"+bcolor+"; cursor:pointer;"}, dojo.query("tbody", panel)[0]);
          var td = dojo.create("td", {
              style:"padding: 5px; border-bottom: 1px solid #D6D6D6",
              innerHTML: "<img style='width:16px;height:16px;margin:0 5px 0 0' src='"+ imashup.core.instanceManager.byId(item).imashup_webos_small_icon_url +"'>"
                + imashup.core.instanceManager.byId(item).imashup_human_name
            }, tr);
          dojo.connect(td, "onclick", function(id) {return function(){
              dijit.byId('desktop')._addInstance(imashup.core.instanceManager.byId(id));
              dijit.byId('instancebar')._addInstance(imashup.core.instanceManager.byId(id));
              self.changedComponents[id]=false
            }}(item) );
          var td = dojo.create("td", {style:"border-bottom: 1px solid #D6D6D6"}, tr);
          var button = dojo.create("button", {innerHTML: "x"}, td);
          dojo.connect(button, "onclick", function(id){ return function(){
              imashup.core.instanceManager.destroy(id)
              dijit.byId('desktop').initTaskMgr();
            }}(item));
          ++count;
        }
        if (count==0) this.wall.innerHTML = '';
      },

      reset: function() {
        this.wall.innerHTML = "";
        this.setWallpaperUrl(this.welcomeBackgroundUrl);
      },

      /*getWallpaperStyle: function(){
       return this.wallpaperStyle;
      },
      setWallpaperStyle: function(wallpaperStyle){
        this.wallpaperStyle = wallpaperStyle;
        this._setWallpaper();
      },*/

      getWallpaperColor: function(){
        return this.wallpaperColor;
      },
      setWallpaperColor: function(wallpaperColor){
        this.wallpaperColor = wallpaperColor
        this._setWallpaper();
      },
      getWallpaperUrl: function(){
        return this.wallpaperUrl;
      },
      setWallpaperUrl: function(wallpaperUrl){
        this.wallpaperUrl = wallpaperUrl
        this._setWallpaper();
      },
      _setWallpaper: function(){
        if (this.wallpaperUrl=="" || this.wallpaperUrl==null)
          this.wall.style.background = this.wallpaperColor
        else {
          var color = this.wallpaperColor;
          var url = "url("+this.wallpaperUrl+")";
          var style = ""
          switch (this.wallpaperStyle.toLowerCase()) {
            case "center":
              style = "center no-repeat"; break;
            case "top-left":
              style = "top left no-repeat"; break;
            default : style = "center center no-repeat"; break;
          }
          this.wall.style.background = [color, url, style].join(' ');
        }
      }
    }
  );

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels_phone.Desktop',
    interface: {
        properties: {
            wallpaperColor : {type:'string', humanname:"Wall Paper Color"},
            wallpaperUrl : {type:'string', humanname:"Wall Paper Image URL"}
        },
        methods: {},
        events: {}
    }
    //mixin_types : ['webos']
});
