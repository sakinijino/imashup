dojo.provide('imashup.core.LocalStorage')


dojo.declare("imashup.core.LocalStorage", null, {
    constructor: function(insManager){
        //this.componentTypeManager = componentTypeManager;
        this.instanceManager = insManager;
    },
    getClassName: function(objClass){
        if(objClass.declaredClass!=undefined && objClass.declaredClass!=null){
            return objClass.declaredClass;
        }
        if (objClass && objClass.constructor) {
            var strFun = objClass.constructor.toString();
            var className = strFun.substr(0, strFun.indexOf('('));
            className = className.replace('function', '');
            return className.replace(/(^\s*)|(\s*$)/ig, '');
        }
        return typeof(objClass);
    },
    save: function(obj){
    	//获取类名
	    var type = this.getClassName(obj);
        //获取id
        var id = this.getId(type);
        //生成key
        var key = type + "$" + id;
        //添加设置id
        obj.id = id;
        //将对象属性值转化为JSON格式
        var value = this.getJSONString(obj);
        //存储
	    window.localStorage.setItem(key, value);
    },

    remove: function(obj){
	    //获取类名
	    var type = this.getClassName(obj);
        /**判断是否有id*/
        if(obj.id != undefined && obj.id != null){
            var id = obj.id;
            //生成key
            var key = type + "$" + id;
            window.localStorage.removeItem(key);
        }else{
            throw new Error("obj has not persisten");
        }
    },

    update: function(obj){
        //获取类名
        var type = this.getClassName(obj);
        //获取id
        ///**判断是否有id*/
        if(obj.id != undefined && obj.id != null){
            var id = obj.id;
            //生成key
            var key = type + "$" + id;
            //将对象属性值转化为JSON格式
            var value = this.getJSONString(obj);
            window.localStorage.setItem(key, value);
        }else{
            throw new Error("obj has not persisten");
        }
    },

    get: function(type, id){
        var key = type + "$" + id;
        //返回对象
        var obj = this.getObject(type,window.localStorage.getItem(key));
        //var obj = eval(evalString);
        if(obj == null){
            throw new Error("obj not exsist in local storage");
        }else{
            return obj;
        }
    },
        
    getObject: function(type,JSONString){
        var obj = eval("(" + JSONString + ")");

        var type_obj = eval("(" + "new " + type + "()" + ")");

        //Array
        if(type == "Array"){
            var length = obj.length;
            for(var i = 0; i < obj.length; i++){
                if(typeof (obj[i]) == "object"){
                    //alert("here");
                    //not array
                    if(!(Object.prototype.toString.apply(obj[i]) === '[object Array]')){
                        var typeInner_id = obj[i].objectId;
                        var typeInner = typeInner_id.split("$")[0];
                        var JSONStringInner = window.localStorage.getItem(typeInner_id);
                        //alert("InArray_Object:" + i + ":" + obj[i]);
                        eval("(" + "type_obj[" + i + "]" + "= this.getObject(typeInner,JSONStringInner)"+")");
                    }else{
                        //alert("InArray_Array:" + i + ":" + obj[i]);
                        eval("(" + "type_obj[" + i + "]" + "= this.getObject(\"Array\",this.getJSONString(obj[i]))"+")");
                    }
                }           
                else{
                    //alert("InArray_simple" + i + ":" + obj[i]);
                    eval("(" + "type_obj[" + i + "]" + "= obj[i]" + ")");
                }
            }
            //alert(this.getJSONString(type_obj));
            return type_obj;
        } 
        for (var key in obj){
            var value = obj[key];
            if(typeof value == "object"){
                //alert("here");
                //not array
                if(!(Object.prototype.toString.apply(value) === '[object Array]')){
                    //alert("Object:" + key + ":" + value); 
                    var typeInner_id = value.objectId;
                    var typeInner = typeInner_id.split("$")[0];
                    var JSONStringInner = window.localStorage.getItem(typeInner_id);
                    eval("(" + "type_obj." + key + "= this.getObject(typeInner,JSONStringInner)"+")");
                }else{
                    //alert("Array:" + key + ":" + value);
                    eval("(" + "type_obj." + key + "= this.getObject(\"Array\",this.getJSONString(value))"+")");
                }
            }
            else{
                //alert("simple:" + key + ":" + value);
                eval("(" + "type_obj." + key + "= value" + ")");
            }
        }
        //alert(this.getJSONString(type_obj));
        return type_obj;
    },

    findAll: function(type)
    {
        var result = [];
        //遍历storage
        for (var i = 0; i < window.localStorage.length; i++) {
            var key =  window.localStorage.key(i);
            var currentType = key.split("$")[0];
            //alert("currentType:" + currentType);
            if(currentType == type){
                var obj = this.getObject(type,window.localStorage.getItem(key));
                result.push(obj);
            }
        }
        return result;
    },

    removeAll: function(type){
       //alert("type:"+type);
       var keys = [];
       //遍历storage
       //alert(window.localStorage.length);
       for (var i = 0; i < window.localStorage.length; i++) {
           var key =  window.localStorage.key(i);
           var currentType = key.split("$")[0];
           //alert("currentType:" + currentType);
           if(currentType == type){
               //alert("remove" + i);
               //window.localStorage.removeItem(key);
               keys.push(key);
           }
       }
       for (var i = 0; i < keys.length; i++){
           window.localStorage.removeItem(keys[i]);
       }
    },

    getJSONString: function(object){
        var parts = [];
        var is_list = (Object.prototype.toString.apply(object) === '[object Array]');

        for (var key in object) {
            var value = object[key];
            if (typeof value == "object") {
                //parts.push(getJSONString(value));
                //not array
                if(!(Object.prototype.toString.apply(value) === '[object Array]')){
                    if(value.id == undefined || value.id == null){
                        //alert("new obj here");
                        this.save(value);
                    }
                    else{
                        this.update(value);
                    }
                    var type = this.getClassName(value);
                    key = key.replace(/"/,'\"');
                    var objString = '\"' + key + '\":';
                    objString += '{' + '\"objectId\":' + '\"' + type + '$' + value.id + '\"' + '}';
                    parts.push(objString);
                }else{          //array
                    //var arrayString = '\"' + key + '\":';
                    var arrayString = "";
                    if(isNaN(key)){
                        arrayString = '\"' + key + '\":';
                    }
                    arrayString = arrayString + this.getJSONString(value);
                    parts.push(arrayString); 
                }
            }
            else 
                if (typeof value == "function") {
                    //function是否保存
                    //value = value.toString().replace(/(\n[\s|\t]*\r*\n)/g, '').replace(/\n|\r|(\r\n)/g, '').replace(/\s{2,}/, '').replace(/"/, '\"');
                    //parts.push('\"' + value + '\"');
                }
                else {
                    var str = "";
                    if (!is_list) {
                        key = key.replace(/"/, '\"');
                        str = '\"' + key + '\":';
                    }

                    //Custom handling for multiple data types
                    if (typeof value == "number") {//Numbers
                        str += value;
                    }
                    else 
                        if (value === false) {//The booleans false
                            str += 'false';
                        }
                        else 
                            if (value === true) {//The booleans true
                                str += 'true';
                            }
                            else {//string
                                value = value.replace(/"/, '\"');
                                str += '\"' + value + '\"';
                            }

                    parts.push(str);
                }
        }
        var json = parts.join(",");
        if (is_list) 
            return '[' + json + ']';//array
        return '{' + json + '}';//object
    },
    getId: function(type){
      //计算id
      if(imashup.core.LocalStorage.types[type]==undefined){
                imashup.core.LocalStorage.types[type] = 0;
            }
	        var id = ++(imashup.core.LocalStorage.types[type]);
	        //this.static.types[type]++;
	        return id;
        }        
});

imashup.core.LocalStorage.types = function(){
    //生成类的计数器
    var types = [];
    //alert("init:" + window.localStorage.length); 
    //遍历storage
    if(window.localStorage == undefined){
        alert('This browser does NOT support localStorage');
    }
    for (var i = 0; i < window.localStorage.length; i++) {
        var key =  window.localStorage.key(i);
        //alert(key+":" + window.localStorage.getItem(key));
        var type = key.split("$")[0];

        if(types[type]==undefined){
            types[type] = 0;
        }
        var id = key.split("$")[1]*1;
        //alert("id:" + id);
        if(types[type] < id){
            //alert("maxId:" + id);
            types[type] = id;
        }
    }
    return types;
}()
