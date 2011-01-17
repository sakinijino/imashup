dojo.provide("imashup.components.widgets.WeatherReport");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

dojo.declare(
    "imashup.components.widgets.WeatherReport",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/weather_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/weather_small.png"),
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/WeatherReport.html"),
		
		resizable: false,
		maxable: false,
		width: 300,
		height: 220,
		
		imashup_human_name: "Weather Report",
		imashup_catergories: ['Search'],
		
		inputnode: null,
		inputContainer: null,
		
		reportnode:null,
		errornode:null,
		locationnode1:null,
       		locationnode2:null,
		
		condition:null,
		temp_f:null,
		temp_c:null,
		humidity:null,
		wind_condition:null,
		icon:null,
		
		url: 'http://www.google.com/',
		map:null,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onsubmit: function(){
			var location = this.inputnode.value;
			this.setLocation(location, true);
		},
		
		setLocation: function(location, keep_input){
			var _this = this;
      var url = 'http://www.google.com/ig/api'
      if (imashup.configs && imashup.configs.proxy) 
        url = imashup.configs.proxy[url] ? imashup.configs.proxy[url] : url; 
      dojo.xhrGet({
          url: url+"?weather=" + location,
          timeout:3000,
          handleAs:"xml",
          load: function(response, ioargs){
            if(response){
              _this.setWeather(response, location, keep_input);
            }
          },
          error: function(){
            _this.errornode.style.display = "block";
            _this.reportnode.style.display = "none";
            _this.locationnode2.innerHTML = location;
          }
        });
    },

    setWeather: function(weather, location, keep_input){
      var weatherCurr = weather.childNodes[0].childNodes[0].childNodes[1];
      if(weather && weather.childNodes[0] && weather.childNodes[0].childNodes[0] &&
         weather.childNodes[0].childNodes[0].childNodes[1]){
         var weatherCurr = weather.childNodes[0].childNodes[0].childNodes[1];
         var keys = {"condition":true, "temp_c":true, "humidity":true, "wind_condition":true};
         this.locationnode1.innerHTML = location;
         for(var i = 0;i < weatherCurr.childNodes.length;i++){
           var key = weatherCurr.childNodes[i].tagName;
           if (keys[key]) this[key].innerHTML = weatherCurr.childNodes[i].attributes.item("data").value;
           if (key == "icon") this.icon.src = this.url + weatherCurr.childNodes[i].attributes.item("data").value;
         }
         if (!keep_input )this.inputContainer.style.display = "none";
         this.errornode.style.display = "none";
         this.reportnode.style.display = "";
       }else {
         this.errornode.style.display = "block";
         this.reportnode.style.display = "none";
         this.locationnode2.innerHTML = location;
       }
     }
   }

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.WeatherReport',
    interface: {
        properties: {},
        methods: {
			"setLocation": { Function: "setLocation", CustomMethod: "/* arguments[0]: String */" }
		},
        events: {}
    },
    mixin_types : ['window']
});
