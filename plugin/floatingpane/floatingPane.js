arrow_down_path = dojo.moduleUrl("imashup.plugin.floatingpane", "arrow_down.gif")
arrow_up_path = dojo.moduleUrl("imashup.plugin.floatingpane", "arrow_up.gif")

dojo.require("imashup.plugin.jquery.all");
dojo.provide('imashup.plugin.floatingpane.floatingPane')

imashup.plugin.floatingpane.floatingPane = function(url, method) {
    this.menugen = new imashup.plugin.floatingpane.AjaxMenuGen(url, method);
    this.items = {};
    this.showing = false;
    this.menushowing = false;
    this.currentitemid = null;
    this.show_timer = null;
    this.hide_timer = null;
    this.showtimeout = 0;
    this.hidetimeout = 300;
    this.createPane();
    this.createArrow();
    this.createMenu();
};
imashup.plugin.floatingpane.floatingPane.prototype = {
    createPane : function() {
	var _this = this;
	this.pane = $("<div class='floatingpane'><div class='inner'/></div>");
	this.pane.mouseover(function(){_this.show()});
	this.pane.mouseout(function(){_this.setHideTimer()});
	$('body').append(this.pane);
	// add inner div, for replacing padding with margin. because there is a bug with padding in ff
	this.innerpane = $('div.inner', this.pane);
    },
    createArrow : function() {
	var _this = this;
	this.arrow = $("<img src='"+arrow_down_path+"' class='arrow' />");
	this.arrow.click(function(){if (!_this.menushowing) _this.showMenu(); else _this.hideMenu();})
    },
    createMenu : function() {
	this.menu =$("<div class='menu'></div>");
	this.menu.hide();
    },
    createImgLink : function(itemid) {
	var _this = this;
	var img = this.items[itemid].img;
	this.items[itemid].imglink = $("<img src='"+img.attr('src')+"' alt='"+ img.attr('alt') +"' title='"+ img.attr('alt') +"' />");
	if (img.parent() != null && img.parent().attr('href') != null)
	    this.items[itemid].imglink  = $("<a href='"+ img.parent().attr('href') + "' class='imglink'></a>").append(this.items[itemid].imglink);
    },
    bindImg : function(itemid, img, params) {
	this.items[itemid] = {};
	this.items[itemid].params = params;
	var _this = this;
	img.mouseover(function(){_this.items[itemid].img = img; _this.setShowTimer(itemid)});
	img.mouseout(function(){_this.clearShowTimer()});
    },
    setShowTimer : function(itemid) {
	var _this = this;
	this.clearShowTimer();
	this.show_timer = setTimeout(function(){_this.show(itemid)}, this.showtimeout)
    },
    clearShowTimer : function() {
	if (this.show_timer) clearTimeout(this.show_timer);
    },
    show : function(itemid) {
	if (!itemid) itemid = this.currentitemid;
	if (!itemid) return;
	this.clearHideTimer();
	this.clearShowTimer();
	if (!this.showing || itemid != this.currentitemid) if (this.menushowing) this.hideMenu();
	if (itemid != this.currentitemid) {
	    this.innerpane.html('');
	    if (!this.items[itemid].imglink) this.createImgLink(itemid);
	    this.innerpane.append(this.items[itemid].imglink);
	    this.innerpane.append(this.arrow);
	    this.innerpane.append(this.menu);
	}
	this.currentitemid = itemid;
	this.size();
	this.place();
	if (!this.showing) {
	    this.showing = true;
	    this.pane.show()
	}
    },
    setHideTimer : function() {
	var _this = this;
	this.hide_timer = setTimeout(function(){_this.hide()}, this.hidetimeout)
    },
    clearHideTimer : function() {
	if (this.hide_timer) clearTimeout(this.hide_timer);
    },
    hide : function() {
	this.clearHideTimer();
	if (this.menushowing) this.hideMenu();
	if (this.showing) {
	    this.showing = false;
	    this.pane.hide();
	}
	this.currentitemid = null;
    },
    size : function() {},
    place : function() {
	var imgoffset = this.items[this.currentitemid].img.offset();
	this.pane.css('left', imgoffset.left);
	this.pane.css('top', imgoffset.top);
	this.menu.css('top', this.innerpane.height() + 10);
    },
    showMenu : function() {
	if (!this.menushowing) {
	    var _this = this;
	    var callback = function() {
		_this.menushowing = true;
		_this.arrow.attr('src', arrow_up_path);
		_this.menu.show();
		if ($.browser.msie) _this.menu.css('width', _this.menu.width());
	    }
	    if (this.menugen!=null) 
		this.menugen.get(this, this.currentitemid, true, callback);
	}
    },
    hideMenu : function() {
	if (this.menushowing) {
	    this.arrow.attr('src', arrow_down_path);
	    this.menushowing = false;
	    this.menu.html("");
	    this.menu.hide();
	}
    }
}

imashup.plugin.floatingpane.getObject = function(str) {
    if (str==null) return null;
    var parts = str.split("."), i = 0, obj = window;
    do {
	obj = obj[parts[i++]];
    } while (i < parts.length && obj);
    return (obj != window) ? obj : null;
}

imashup.plugin.floatingpane.AjaxMenuGen = function(url, method) {
    this.url = url;
    if (method != null && method != '') this.method = method
};
imashup.plugin.floatingpane.AjaxMenuGen.prototype = {
    url : '',
    method : 'GET',
    get : function(pane, itemid, cache, callback) {
	if (!cache || pane.items[itemid].menu == null)
	    this.generate(pane, itemid, {}, callback);
	else {
	    pane.menu.html("");
	    $.each(pane.items[itemid].menu, function(i, li){pane.menu.append(li)});
	    if (callback) callback();
	}
    },
    setMenu : function(pane, itemid, props) {
	pane.items[itemid].menu = this._generate(pane, itemid, props);
	if (pane.currentitemid != itemid) return;
	pane.menu.html("");
	$.each(pane.items[itemid].menu, function(i, li){pane.menu.append(li)});
    },
    generate : function(pane, itemid, props, callback) {
	var _this = this;
	$.ajax({
	    type : this.method,
	    url : this.url,
	    data : $.extend({id: itemid}, pane.items[itemid].params),
	    success : function(props){
		_this.setMenu(pane, itemid, props);
		if (callback) callback();
	    },
	    error : function (obj, msg, exp) {
		//EXP = exp;
	    },
	    dataType : 'json'
	});
    },
    _generate : function(pane, itemid, props) {
	var menu_item = [];
	var _this = this;
	$.each(props, function(i, item){
	    var elem = _this._generateMenuItem(item, pane, itemid);
	    if (elem != null) menu_item.push(elem);
	})
	return menu_item;
    },
    _generateMenuItem : function(item, pane, itemid) {
	var elem;
	var _this = this;
	switch (item.type) {
	case 'text': 
	    elem = document.createElement('span');
	    elem.innerHTML = item.text;
	    break;
	case 'hr' :
	    elem = document.createElement('hr');
	    break;	    
	case 'redirect':
	    elem = document.createElement('a');
	    elem.innerHTML = item.text;
	    elem.href = item.url;
	    if (item.openinblank) elem.target = '_blank';
	    break;
	case 'ajax':
	    elem = document.createElement('a');
	    elem.innerHTML = item.text;
	    elem.href = 'javascript:;';
	    $(elem).click(function(){
		var before = imashup.plugin.floatingpane.getObject(item.before);
		if (before != null && typeof before == 'function')
		    if (!before.apply(null, [item.before_params, pane, itemid])) return;
		$.ajax({
		    type : item.method || 'get',
		    url : item.url,
		    data : $.extend({id: itemid}, item.data),
		    dataType : 'json',
		    success : function(data) {
			if (item.updateMenu)
			    _this.setMenu(pane, itemid, data)
			var callback = imashup.plugin.floatingpane.getObject(item.callback);
			if (callback != null && typeof callback == 'function')
			    callback.apply(null, [data, pane, itemid]);
		    },
		    error : function(obj, msg, exp) {
			//EXP = exp;
		    }
		});
	    });
	    break;
	case 'function' : 
	    elem = document.createElement('a');
	    elem.innerHTML = item.text;
	    elem.href = 'javascript:;';
	    $(elem).click(function(){
		var func = imashup.plugin.floatingpane.getObject(item.func);
		if (func != null && typeof func == 'function')
		    func.apply(null, [item.params, pane, itemid]);
	    });
	    break;
	default: 
	    elem = null;
	}
	return $(elem);
    }
};