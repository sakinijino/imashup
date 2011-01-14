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
			dojo.xhrGet({
		        	url: "/service/weather?location=" + location,
				timeout:3000,
				handleAs:"json",
			        load: function(response, ioargs){
					console.debug(arguments);
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
			console.debug(weather);
			var weatherCurr = weather.xml_api_reply.weather.current_conditions;
			if(weatherCurr){				
		            var keys = ["condition", "temp_c", "humidity", "wind_condition"];
    			    this.locationnode1.innerHTML = location;
		            for(var i = 0;i < keys.length;i ++){
		                this[keys[i]].innerHTML = weatherCurr[keys[i]].data;
	        	    }
		            this.icon.src = this.url + weatherCurr.icon.data;
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
