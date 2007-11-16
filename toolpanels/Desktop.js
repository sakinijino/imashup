dojo.provide("imashup.toolpanels.Desktop");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("dijit._Container");
dojo.require("dojo.dnd.Moveable");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels.Desktop",
    [dijit._Widget, dijit._Templated, dijit._Container],
    {
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop.html"),

        wallpaperUrl: "",
        wallpaperColor: "white",
        wallpaperStyle: "center",//center

        icons: [],

        postCreate: function(){
            this._layout();
            this._setWallpaper();
            this._resizeHandler = this.connect(window, "onresize", "_layout");
            this.inherited("postCreate", arguments);

            dojo.subscribe("instance/add", this, "_addInstance")
            dojo.subscribe("instance/beforeremove", this, "_removeInstance")
        },

        _addInstance : function(component){
            if (!component.imashup_is_windowcomponent) return;

            component.initFloatingPane()
            this.addChild(component.floatingpane)
            component.floatingpane.dockTo = {_positionDock:function(){}}

            component.floatingpane.bringToTop()

            img = document.createElement('img')
            img.comp = component
            img.style.position = "absolute";
            img.width = 48
            img.height = 48
            img.src = component.imashup_webos_small_icon_url

            this.icons.push(img)

            var _f = component.floatingpane
            dojo.connect(img, "onclick", function(){
                var anim = dojo.fadeIn({node:_f.domNode, duration:_f.duration,
                    beforeBegin: dojo.hitch(_f , function(){
                        this.domNode.style.display = "";
                        this.domNode.style.visibility = "visible";
                    })
                                       }).play();
            });

            this.wall.appendChild(img);
            this._placeIcons()
        },

        _removeInstance : function(id){
           for (var i=0; i < this.icons.length; ++i){
                        var ic = this.icons[i]
                        if (ic.comp.id == id ) break;
                }
                this.wall.removeChild(this.icons[i])
                this.icons.splice(i, 1)
          this._placeIcons()
        },

        _placeIcons : function() {
                var h = this.viewport.h
                var flag = 0;
                var border = parseInt((h - 50) / 100)
                var rol = 0;
                for (var i=0; i < this.icons.length; ++i){
                        var ic = this.icons[i]
                        ic.style.top = (100*flag + 50) + 'px'
                        ic.style.left = (100*rol + 50) + 'px'
                        flag++
                        if(flag == border) {rol++;flag=0}
                }
        },

/*        getWallpaperStyle: function(){
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
        _layout: function(){
            var viewport = dijit.getViewport();
            this.viewport = viewport
            this.wall.style.height = viewport.h + 'px';
            this._placeIcons();
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
            wallpaperColor : {type:'string'},
            wallpaperUrl : {type:'string'}
        },
        methods: {},
        events: {}
    },
    mixin_types : ['webos']
});