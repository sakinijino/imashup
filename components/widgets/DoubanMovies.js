dojo.provide("imashup.components.widgets.DoubanMovies");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

/*
dojo.create("script", 
	{ type : "text/javascript", src : "http://www.douban.com/js/api.js?v=2"}, 
	document.getElementsByTagName("head")[0]);
dojo.create("script", 
	{ type : "text/javascript", src : "http://www.douban.com/js/api-parser.js?v=1"}, 
	document.getElementsByTagName("head")[0]);
*/
	
dojo.declare(
    "imashup.components.widgets.DoubanMovies",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/douban_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/douban_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/DoubanMovies.html"),
		
		resizable: false,
		maxable: false,
		width: 600,
		height: 500,
		
		imashup_human_name: "Douban Movies",
		imashup_catergories: ['Search'],
		
		inputnode: null,
		
		movieList: null,
		movieCur: -1,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
		},
		
		onsubmit: function(){
			if (this.inputnode.value && this.inputnode.value != "") {
				this.findMovie(this.inputnode.value);
			}
		},
		
		findMovie: function(/* String */ input) {
			// Variable used in DOUBAN.searchMovies
			var my_douban = this;
			
			// Reset movie list
			this.movieList = null;
			this.movieList = new Array();
			this.movieCur = -1;
			
			this.clearList();
			
			DOUBAN.searchMovies({
				tag: input,
				callback: function(re){
					var list = DOUBAN.parseSubjects(re);
					
					if(list == null)
						return;
					var subj = list.entries[0];
					if(subj == null)
						return;
					
					for ( var i = 0; i < list.entries.length; i ++ ) {
						my_douban.movieList[i] = list.entries[i].nid;
						
						// Insert option 
						var content = "<img src="+list.entries[i].link.image+" style='margin-right: 5px; float:left'>";
						content += "<div><h5>"+ list.entries[i].title +"</h5></div>";
						if (list.entries[i].attribute.author) {
							content += "<div>Authors : "+(subj.attribute.author.join(' / '))+"</div>";
						}
						if (list.entries[i].attribute.director) {
							content += "<div>Director : "+(subj.attribute.director.join(' / '))+"</div>";
						}
						if (list.entries[i].attribute.cast) {
							content += "<div>Casts : "+(subj.attribute.cast.join(' / '))+"</div>";
						}
						
						var _style = "height:100px; overflow: hidden; vertical-align: text-center";
						dojo.create("option", { innerHTML : content, style : _style}, my_douban.resultList);
					}
					
					my_douban.movieCur = 0;
					my_douban.resultList.options[0].selected = true;
					my_douban.display();
				}
			});
		},
		
		authorName: function(){
			
		},
		
		directorName: function(){
			
		},
		
		castName: function(){
		
		},
		
		movieTitle: function(){
		},
		
		display: function(){
			// Variable used in DOUBAN.getMovie
			var my_douban = this;
			
			var id_temp = this.movieList[this.movieCur];

			DOUBAN.getMovie({
				id: id_temp,
				callback: function(re){
					var subj = DOUBAN.parseSubject(re);
					if(subj == null)
						return;
					
					// Build page describing the movie
					var tl = subj.title ? subj.title : "";
					var tmp = "<img src="+subj.link.image+" style='margin:10px;float:left'>";
					tmp += "<div>Title : <a href="+subj.link.alternate+" target='_blank'>"+tl+"</a></div>";
					my_douban.movieTitle(subj.title);
					if (subj.attribute.author) {
						tmp += "<div>Authors : "+(subj.attribute.author.join(' / '))+"</div>";
						my_douban.authorName(subj.attribute.author[0]);
					}
					if (subj.attribute.director) {
						tmp += "<div>Director : "+(subj.attribute.director.join(' / '))+"</div>";
						my_douban.directorName(subj.attribute.director[0]);
					}
					if (subj.attribute.cast) {
						tmp += "<div>Casts : "+(subj.attribute.cast.join(' / '))+"</div>";
						my_douban.castName(subj.attribute.cast[0]);
					}
					if (subj.attribute.aka) tmp += "<div>A.k.a : "+(subj.attribute.aka.join(' / '))+"</div>";
					if (subj.attribute.language) tmp += "<div>Language : "+(subj.attribute.language.join(' / '))+"</div>";
					if (subj.attribute.country) tmp += "<div>Country : "+(subj.attribute.country.join(' / '))+"</div>";
					if (subj.rating.average)
						tmp +="<div>Rating: "+subj.rating.average+" / "+subj.rating.numRaters+decodeURI("%E4%BA%BA")+ "</div>"
					tmp += "<p>"+(subj.summary ? subj.summary : "")+"</p>";
					
					my_douban.result.innerHTML = tmp;
				}
			});
		},
		
		onprev: function(){
			if (this.movieList == null) return;
			if (this.movieCur == 0)
				this.movieCur = this.movieList.length - 1;
			else
				this.movieCur = this.movieCur - 1;
			this.resultList.selectedIndex = this.movieCur;
			this.display();
		},
		
		onnext: function(){
			if (this.movieList == null) return;
			this.movieCur = (this.movieCur + 1) % this.movieList.length;
			this.resultList.selectedIndex = this.movieCur;
			this.display();
		},
		
		changeSelected: function() {
			this.movieCur = this.resultList.selectedIndex;
			this.display();
		},
		
		clearList: function() {
			for(var i = this.resultList.options.length - 1; i >= 0 ; i --)
				this.resultList.remove(i);
		}
	}

);
	
imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.DoubanMovies',
    interface: {
        properties: {},
        methods: {
			"FindMovie" : { Function: "findMovie", CustomMethod: "/* arguments[0]: String */" },
		},
        events: {
			"Title" : { Function: "movieTitle", CustomMethod: "/* arguments[0]: String */" },
			"Director" : { Function: "directorName", CustomMethod: "/* arguments[0]: String */" },
			"Author" : { Function: "authorName", CustomMethod: "/* arguments[0]: String */" },
			"Cast" : { Function: "castName", CustomMethod: "/* arguments[0]: String */" },
		}
    },
    mixin_types : ['window']
});
