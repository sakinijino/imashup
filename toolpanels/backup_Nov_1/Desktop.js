dojo.provide("imashup.toolpanels.Desktop");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.toolpanels.Desktop",
    [dijit._Widget, dijit._Templated],
    {
        imashup_is_singleton: true,
        imashup_webos_large_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop_large.png"),
        imashup_webos_small_icon_url: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop_small.png"),
        templatePath: dojo.moduleUrl("imashup.toolpanels", "templates/Desktop.html"),

        wallpaperUrl: "",
        wallpaperColor: "white",
        wallpaperStyle: "center",//center

        postCreate: function(){
            this._layout();
            this._setWallpaper();
            this._resizeHandler = this.connect(window, "onresize", "_layout");
            this.inherited("postCreate", arguments);
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
            this.wall.style.height = viewport.h + 'px';
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