dojo.provide("imashup.components.crcc.Todos");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.date.locale");

dojo.declare("imashup.components.crcc.TodoItem", [], 
  {
    content: "",
    createTime: 0,
    deadline: 0,
    isDone: false,
    
    constructor: function(/* Object */args){
      this.content = args.content;
      this.setDeadline(args.deadline);
      this.createTime = new Date().getTime();
      this.id = this.createTime;
    },

    getCreateTime: function() {
      return dojo.date.locale.format(new Date(this.createTime), {datePattern: "yyyy-MM-dd", selector: "date"})
    },
    getDeadline: function() {
      return dojo.date.locale.format(new Date(this.deadline), {datePattern: "yyyy-MM-dd", selector: "date"})
    },
    setDeadline: function(time) {
      if (dojo.isNumber(time)) this.deadline = time;
      else if (dojo.isString(time)) this.deadline = Date.parse(time).getTime();
      else this.deadline = time.getTime();
    }
  }
)

dojo.declare(
    "imashup.components.crcc.Todos",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/todos_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.crcc", "templates/todos_small.png"),
		templatePath: dojo.moduleUrl("imashup.components.crcc", "templates/Todos.html"),
		
		resizable: false,
		maxable: false,
		width: 400,
		height: 300,
		
		imashup_human_name: "Todos",
		imashup_catergories: ['Applications'],

    undolist: {},
    donelist: {},
    currentSet : null,
    startIndex: 0,
    pageLength: 7,
		
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
      this.currentSet = this.undolist
      this.updateList();
      this.hideAllPanels();
      this.listPanel.style.display = "block";
		},

    _clearList: function(){
      dojo.query("table.list tbody", this.listPanel)[0].innerHTML = "";
    },
    _updateList: function(set, startIndex, length) {
      var list = []
			for ( var i in set ) {	
        list.push(set[i]);
        list = list.sort(function(i,j){return i.deadline - j.deadline});
      }

      var flag = 0;
      var _this = this;
      var end = (startIndex+length > list.length) ? list.length : startIndex+length; 

      for (var i = startIndex; i<end ; ++i) {
        var klass = flag++ % 2 ? "row_even" : "row_odd";
        klass += list[i].isDone ? " done" : "";
        var ct = list[i].content;
        var ctime = list[i].getCreateTime();
        var dtime = list[i].getDeadline();
        var checked = list[i].isDone ? "checked" : "";
				var tr = dojo.create("tr", { 
            innerHTML : '<td><input type="checkbox" '+checked+' name="broadcast"></td><td style="text-align:left" title="'+ct+'">'+ct+'</td> <td>'+ctime+'</td> <td>'+dtime+'</td> <td class="del">X</td>',
            class: klass
          }, 
          dojo.query("table.list tbody", this.listPanel)[0]
        );
        dojo.connect(dojo.query("td input[type='checkbox']", tr)[0], "change", function(id){
            return function(){
              var srcset = list[id].isDone ? _this.donelist : _this.undolist;
              var tarset = list[id].isDone ? _this.undolist : _this.donelist;
              delete srcset[list[id].id];
              tarset[list[id].id] = list[id];
              list[id].isDone = !list[id].isDone;
              _this.updateList();
            }
        }(i));
        dojo.connect(dojo.query("td", tr)[4], "click", function(id){
            return function(){
              delete _this.undolist[list[id].id]
              delete _this.donelist[list[id].id]
              _this.updateList();
            }
        }(i));
      }

      this.totalNum.innerHTML = list.length;
    },
    _getDateTextBox: function(){
      return dijit.findWidgets(this.domNode)[0]
    },
    hideAllPanels: function(){
      this.newPanel.style.display = "none";
      this.listPanel.style.display = "none";
    },

    updateList: function(){
      this._clearList();
      this._updateList(this.currentSet, this.startIndex, this.pageLength);
    },

    onnew: function(){
      this.hideAllPanels();
      this.newPanel.style.display = "block";
    },
    ontodo: function(e){
      this.startindex = 0;
      this.currentSet = this.undolist
      this.updateList();
      dojo.query("ul.nav li.activeTitle", this.listPanel)[0].className = "inactiveTitle";
      e.target.className = "activeTitle";
    },
    ondone: function(e){
      this.startindex = 0;
      this.currentSet = this.donelist
      this.updateList();
      dojo.query("ul.nav li.activeTitle", this.listPanel)[0].className = "inactiveTitle";
      e.target.className = "activeTitle";
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
      var smy = this.summary.value;
      var ddl = this._getDateTextBox().value;
      var i = new imashup.components.crcc.TodoItem({content: smy, deadline:ddl});
      this.undolist[i.id] = i;

      this.ontodo({target: dojo.query("ul.nav li", this.listPanel)[0]});
      this.oncancel();
    },
    oncancel:function(){
      this.summary.value = "";
      this._getDateTextBox().attr('value', new Date())
      this.hideAllPanels();
      this.listPanel.style.display = "block";
    }
   }
);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.crcc.Todos',
    interface: {
        properties: {},
        methods: {},
        events: {}
    },
    mixin_types : ['window']
});
