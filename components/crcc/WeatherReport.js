dojo.provide("imashup.components.crcc.WeatherReport");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");

dojo.declare(
    "imashup.components.crcc.WeatherReport",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/weather_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/weather_small.png"),
		templatePath: dojo.moduleUrl("imashup.components.crcc", "templates/WeatherReport.html"),
		bgPath: dojo.moduleUrl("imashup.components.crcc", "templates/weather_bg.png"),
		
		resizable: false,
		maxable: false,
		width: 300,
		height: 250,
		
		imashup_human_name: "Weather Report",
		imashup_catergories: ['Widgets'],
		
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
      this.inputnode.value = "Beijing";
      this.onsubmit();
		},

    onset: function(){
      dojo.query("button", this.inputContainer)[0].style.display = "none"; 
      dojo.query("input", this.inputContainer)[0].style.display = ""; 
      dojo.query("button", this.inputContainer)[1].style.display = ""; 
    },
		
		onsubmit: function(){
			var location = this.inputnode.value;
      dojo.query("button", this.inputContainer)[0].style.display = ""; 
      dojo.query("input", this.inputContainer)[0].style.display = "none"; 
      dojo.query("button", this.inputContainer)[1].style.display = "none"; 
			this.setLocation(location);
		},
		
		setLocation: function(location){
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
              _this.setWeather(response, location);
            }
          },
          error: function(){
            _this.errornode.style.display = "block";
            _this.reportnode.style.display = "none";
            _this.locationnode2.innerHTML = location;
          }
        });
      this.City(location);
    },

    setWeather: function(weather, location){
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
         
         for (var i=2; i<=5; ++i) {
           var wf = weather.childNodes[0].childNodes[0].childNodes[i];
           var day_of_week = wf.childNodes[0].attributes.item("data").value;
           var low = wf.childNodes[1].attributes.item("data").value;
           var high = wf.childNodes[2].attributes.item("data").value;
           var icon = wf.childNodes[3].attributes.item("data").value;

           var div = this["weather-"+i]
           dojo.query("img", div)[0].src = this.url + icon;
           dojo.query("td label", div)[0].innerHTML = day_of_week;
           dojo.query("td label", div)[1].innerHTML = low + "~" + high;
         }

         this.errornode.style.display = "none";
         this.reportnode.style.display = "block";

       }else {
         this.errornode.style.display = "block";
         this.reportnode.style.display = "none";
         this.locationnode2.innerHTML = location;
       }
     },

     City: function(loc) {}
   }

);

imashup.core.componentTypeManager.registerComponentType({
  impl_name : 'imashup.components.crcc.WeatherReport',
  "interface": {
    properties: {},
    methods: {
      "setLocation": { Function: "setLocation", CustomMethod: "/* arguments[0]: String */" }
    },
    events: {
      "City": {Function: "City", CustomMethod: "/* arguments[0]: String */"}
    }
  },
  mixin_types : ['window']
});
