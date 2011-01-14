dojo.provide("imashup.toolpanels.Desktop");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.require("dojo.dnd.Moveable");
dojo.require("imashup.core.all");
dojo.require("imashup.toolpanels.DesktopIcon");
//dojo.require("dojo.dnd.Selector")

dojo.declare(
    "imashup.toolpanels.Desktop",
    [dijit._Widget, dijit._Templated, dijit._Container],
    {
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop.html"),

        wallpaperUrl: "wallpapers/default.jpg",
        wallpaperColor: "#3C6EA4",
        wallpaperStyle: "center",//center
        
        dock : null,

        icons: [],

        postCreate: function(){
            this._resize();
            this._setWallpaper();
            this._resizeHandler = this.connect(window, "onresize", "_resize");
            dojo.subscribe("instance_manager/add", this, "_addInstance")
            dojo.subscribe("instance_manager/beforeremove", this, "_removeInstance")
            
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
            this.wall.style.height = viewport.h + 'px';
        },

        _initWindowComponent : function(component){
            if (!component.imashup_is_windowcomponent) return;
            component.initFloatingPane()
            if (this.dock) component.floatingpane.dockTo = this.dock
            var startbar_height = 20
            component.floatingpane.domNode.className += " imashupWindow";
            component.floatingpane.domNode.style.top = startbar_height+"px";
            component.floatingpane.maximize = function(){
							if(this._maximized){ return; }
							this._naturalState = dojo.coords(this.domNode);
							if(this._isDocked){
								this.show();
								setTimeout(dojo.hitch(this,"maximize"),this.duration);
							}
							dojo.addClass(this.focusNode,"floatingPaneMaximized");
							var v = dijit.getViewport()
							v.t = v.t+startbar_height
							v.h = v.h-startbar_height
							this.resize(v);
							this._maximized = true;
						},
            this.addChild(component.floatingpane)
            component.floatingpane.startup()
            component.floatingpane.bringToTop()
        },
        _addInstance : function(component){
            this._initWindowComponent(component)

            var icon = new imashup.toolpanels.DesktopIcon({component:component})
            icon.domNode.style.position = 'absolute'
            this.icons.push(icon);
            this.wall.appendChild(icon.domNode);
            this._placeIcons();
        },

        _removeInstance : function(component){
            for (var i=0; i < this.icons.length; ++i){
                var ic = this.icons[i]
                if (ic.component == component ) break;
            }
            this.wall.removeChild(this.icons[i].domNode)
            this.icons.splice(i, 1)
            this._placeIcons()
        },

        _placeIcons : function() {
            var h = this.viewport.h
            var flag = 0;
            var border = parseInt((h - 50) / 100)
            var rol = 0;
            for (var i=0; i < this.icons.length; ++i){
                var ic = this.icons[i].domNode
                ic.style.top = (100*flag + 50) + 'px'
                ic.style.left = (100*rol + 50) + 'px'
                flag++
                if(flag == border) {rol++;flag=0}
            }
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
                    default : style = "center center no-repeat";break;
                }
                this.wall.style.background = [color, url, style].join(' ');
            }
        }
    }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.toolpanels.Desktop',
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
