dojo.provide("imashup.components.crcc.Inbox");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.date.locale");

dojo.declare("imashup.components.crcc.InboxUser", [], 
  {
    id: null,
    name: "",
    
    constructor: function(/* Object */args){
      this.id = args.id;
      this.name = args.name;
    },
  }
)
dojo.declare("imashup.components.crcc.InboxMail", [], 
  {
    id: null,
    sender: null,
    reciever: null,
    title: "",
    content: "",
    createTime: 0,
    unread: true,
    
    constructor: function(){
      this.createTime = new Date().getTime();
    },
    
    getCreateTime: function() {
      return dojo.date.locale.format(new Date(this.createTime), {datePattern: "yyyy-MM-dd", selector: "date"})
    }
  }
)

dojo.declare(
    "imashup.components.crcc.Inbox",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/inbox_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/inbox_small.png"),
		templatePath: dojo.moduleUrl("imashup.components.crcc", "templates/Inbox.html"),
		
		resizable: false,
		maxable: false,
		width: 400,
		height: 300,
		
		imashup_human_name: "Inbox",
		imashup_catergories: ['Applications'],

    currentuser: null,
    currentmail: null,
    userlist: {},
    maillist: {},
    startIndex: 0,
    pageLength: 7,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];

      this.currentuser = this._getCurrentUser();
      var l = this._getUserList();
      for (var i=0; i< l.length; ++i) 
        this.userlist[l[i].id] = l[i];
      var l = this._getMailList();
      for (var i=0; i< l.length; ++i) 
        this.maillist[l[i].id] = l[i];

      for (var i in this.userlist)
        dojo.create('option', {value: this.userlist[i].id, innerHTML: this.userlist[i].name}, this.reciever_input)

      this.updateList();
      this.hideAllPanels();
      this.listPanel.style.display = "block";
		},

    _getCurrentUser: function(){
      return new imashup.components.crcc.InboxUser({name: "Zhao Qi", id:1})
    },
    _getUserList: function(){
      return [
        new imashup.components.crcc.InboxUser({name: "Wang Xudong", id:2}),
        new imashup.components.crcc.InboxUser({name: "Chen Xing", id:3}),
        new imashup.components.crcc.InboxUser({name: "Liu Xuanzhe", id:4})
        ]
    },
    _getMailList: function(){
      var u = [];
      for (var i in this.userlist) 
        u.push(this.userlist[i])

      var l = []
      for (var i=0; i<15; ++i) {
        var m = new imashup.components.crcc.InboxMail();
        m.id = i+1;
        m.sender = u[i%3];
        m.reciever = this.currentuser;
        m.title = "test"+i;
        m.content = "test"+i;
        l.push(m);
      }
      return l;
    },

    _clearList: function(){
      dojo.query("table.list tbody", this.listPanel)[0].innerHTML = "";
    },
   _updateList: function(set, startIndex, length) {
      var list = []
			for ( var i in set ) {	
        list.push(set[i]);
        list = list.sort(function(i,j){return i.ctime- j.ctime});
      }

      var flag = 0;
      var _this = this;
      var end = (startIndex+length > list.length) ? list.length : startIndex+length; 

      for (var i = startIndex; i<end ; ++i) {
        var klass = flag++ % 2 ? "row_even" : "row_odd";
        klass += list[i].unread? " unread" : "";
        var sn = list[i].sender.name;
        var t = list[i].title;
        var ctime = list[i].getCreateTime();
				var tr = dojo.create("tr", { 
            innerHTML : '<td style="text-align:left" class="tl">'+t+'</td> <td>'+sn+'</td> <td>'+ctime+'</td> <td class="del">X</td>',
            "class": klass
          }, 
          dojo.query("table.list tbody", this.listPanel)[0]
        );
        dojo.connect(dojo.query("td", tr)[0], "click", function(id){
            return function(){
              list[id].unread = false;
              _this.currentmail = list[id];
              _this.detail_title.innerHTML = list[id].title; 
              _this.detail_sname.innerHTML = list[id].sender.name;
              _this.detail_ctime.innerHTML = list[id].getCreateTime();
              _this.detail_content.innerHTML = list[id].content;
              _this.hideAllPanels();
              _this.detailPanel.style.display = "block";
            }
        }(i));
        dojo.connect(dojo.query("td", tr)[3], "click", function(id){
            return function(){
              delete _this.maillist[list[id].id]
              _this.updateList();
            }
        }(i));
      }

      this.totalNum.innerHTML = list.length;
    },

    hideAllPanels: function(){
      this.newPanel.style.display = "none";
      this.detailPanel.style.display = "none";
      this.listPanel.style.display = "none";
    },

    updateList: function(){
      this._clearList();
      this._updateList(this.maillist, this.startIndex, this.pageLength);
    },

    onnew: function(){
      this.hideAllPanels();
      this.newPanel.style.display = "block";
    },
    onprev: function(){
      this.startIndex -= this.pageLength;
      if (this.startIndex < 0) this.startIndex = 0
      this.updateList();
    },
    onnext: function(){
      this.startIndex += this.pageLength;
      this.updateList();
    },
    onsubmit:function(){
      var m = new imashup.components.crcc.InboxMail();
      m.sender = this.currentuser;
      m.reciever = this.userlist[this.reciever_input.value];
      m.title = this.title_input.value;
      m.content = this.content_input.value;
      this.oncancel();
    },
    oncancel:function(){
      this.title_input.value = "";
      this.content_input.value = "";
      this.hideAllPanels();
      this.listPanel.style.display = "block";
    },
    onback: function(){
      this.hideAllPanels();
      this.listPanel.style.display = "block";
      this.updateList();
    },
    ondelete: function(){
      delete this.maillist[this.currentmail.id]
      this.hideAllPanels();
      this.listPanel.style.display = "block";
      this.updateList();
    }
   }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.crcc.Inbox',
    "interface": {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});
