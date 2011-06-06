dojo.provide("imashup.components.widgets.Gobang");

dojo.require("dijit._Widget");
dojo.require("dijit._Templated");
dojo.require("imashup.core.all");
dojo.require("dojo.io.iframe");
dojo.require("dojo.io.script");

dojo.declare("imashup.components.widgets.GobangBoard",[],{array:new Array()});

dojo.declare(
    "imashup.components.widgets.Gobang",
    [dijit._Widget, dijit._Templated],
    {
		imashup_webos_large_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/Gobang_large.png"),
		imashup_webos_small_icon_url: dojo.moduleUrl("imashup.components.widgets", "templates/Gobang_small.png"),
		
		templatePath: dojo.moduleUrl("imashup.components.widgets", "templates/Gobang.html"),
		
		resizable: true,
		maxable: false,
		width: 400,
		height: 500,
		imashup_human_name: "Gobang",
		imashup_catergories: ['Entertaiment'],
		
		inputnode: null,		
		outputnode:null,
		regretnode:null,regretnum:0,
		helpnode:null,helpnum:0,
		debuginfo:null,
		row:15,col:15,Win:3,posScore:0.8,
		TopScore:19999.0,
		steps:null,stepn:0,
		playable:false,
		piece:[" ","O","X","W"],
    gBoard: new imashup.components.widgets.GobangBoard(),
		nowPiece:0,
		Level:1,
		lr:7,rr:7,lc:7,rc:7,searchnode:0,
		dx:[1, 1,1,0, 0,-1,-1,-1],
		dy:[1,-1,0,1,-1, 0, 1,-1],
		scoreTable:[0.0,1.0,10.0,51.0,256,200000.0],
		
		init:function(n){
			var i,j;
			var num,s;
		//	alert("start init row:"+this.row+" col:"+this.col);
			this.playable=true;
			this.Level=n;
			this.nowPiece=1;
			this.gBoard.array = new Array(this.row);
			this.regretnum=3;
			this.regretnode.innerHTML="Regret("+this.regretnum+")";
	//		this.helpnum=3;
	//		this.helpnode.innerHTML="Help("+this.helpnum+")";
	//		alert("Init Step1");
			for (i=0;i<this.row;i++){
				this.gBoard.array[i] = new Array(this.col);
				for (j=0;j<this.col;j++)
				 this.gBoard.array[i][j]=0;
			}
			for (num = 0; num < this.row * this.col; num++) {
				s="s";
				for (i = 100; num < i; i = Math.floor(i / 10)) 
					s = s + "0";
				if (num != 0) 
					s = s + num;
				//alert("Num="+num+" ID="+s);
				document.getElementById(s).innerHTML =" ";
			}
			this.stepn=0;
			this.steps=new Array(this.row*this.col);
	//		document.getElementById("outputInfo").innerHTML=" Your turn!";
			
	//		alert("InitOk!");
		},
/*		constructor:function(){
			init(1);
		},*/
		checkWin:function(board){
			var i,j,k,l;
			var row,col;
			var dx,dy;
			var judge=false;
			row=this.row; col=this.col; dx=this.dx; dy=this.dy;
			for (i=0;i<row&&!judge;i++)
				for (j=0;j<col&&!judge;j++)
				if (board[i][j])
				for (k=0;k<8&&!judge;k++)
					if (4*dx[k]+i<row&&4*dx[k]+i>=0&&4*dy[k]+j<col&&4*dy[k]+j>=0){
						judge=true;
						for (l=0;l<5&&judge;l++)	
							if (board[l*dx[k]+i][l*dy[k]+j]!=board[i][j]) judge=false;
						if (judge){
							if (board[i][j]==this.nowPiece) alert("You Win!");
							else alert("You Lose!");
							//this.playable=false;
							return judge;
						}
					}
			return judge;
		},
		scoreLine:function(line,nowp,len){
			var i,j,cn,c0,ct,reval;
		//	document.getElementById("s002").innerHTML="K";
			reval=0;
			for (i=0;i<=len-4;i++){
				cn=0; c0=0;ct=0;
				for (j=0;j<5;j++)
					if (line[j+i]==nowp) cn++;
					else if (line[j+i]==0) c0++;
					else ct++;
				if (ct == 0) {
					if (cn == 4 && i < len - 4 && line[i] == 0 && line[i + 5] == 0) {
						reval+=this.scoreTable[4]*10;
						this.debuginfo.innerHTML="Get double 4";
					}else	reval += this.scoreTable[cn];
					if (cn==5) return this.TopScore;
				}
			}
			return reval;
		},
		scoreBoard:function(board,nowp,x,y){
			var k,l,reval,low,up,line;
			var ddx=[0,1,1,1];
			var ddy=[1,0,1,-1];
			var row,col;
			row=this.row; col=this.col;
			reval=0;
			line=new Array(20);
			for (k=0;k<4;k++){
				low = -4; if (x+low*ddx[k]<0) low=-1*x; if (y+low*ddy[k]<0) low=-1*y;
				up = 4; if (x+up*ddx[k]>row-1) up =row-1-x; if (y+up*ddy[k]>col-1) up=col-1-y;
				if (k==3){
					if (y+low*ddy[k]>col-1) low = y+1-col;
					if (y+up*ddy[k]<0) up = y;
				}
				for (l = 0; l <= up - low; l++) {
					//if ((l + low) * ddx[k] + x<0||(l + low) * ddx[k] + x>=row||(l + low) * ddy[k] + y<0||(l + low) * ddy[k] + y>=col)
					//alert("X:"+x+" Y:"+y+" ERROR L:"+l+" X:"+((l + low) * ddx[k] + x)+" Y:"+((l + low) * ddy[k] + y));
					line[l] = board[(l + low) * ddx[k] + x][(l + low) * ddy[k] + y];
					
				}
				reval+=this.scoreLine(line,nowp,up-low);
				if (reval>=this.TopScore) return this.TopScore;
			}
		//	document.getElementById("s223").innerHTML="S";
			
			return reval;
			
		},
		cal:function(board,level,nowp){
			var reType={x:0,y:0,val:0},type={x:0,y:0,val:0};
			var first=true;
			var val,i,j;
			var lr,rr,lc,rc,row,col,posScore;
			var boardScore;
//			document.getElementById("s000").innerHTML="2";
			lr=this.lr;rr=this.rr; lc=this.lc;rc=this.rc;row=this.row;col=this.col;posScore=this.posScore;
	//		document.getElementById("s000").innerHTML="4";
		/*	if (level>0){
				alert("IN CAL!"+level);
			}*/
	//		alert("In Cal "+level);	
			for (i = lr; i <= rr; i++) {
			/*	if (level>0){
					alert("in call "+level+" line "+i);
				}*/
				for (j = lc; j <= rc; j++) 
					if (board[i][j] == 0) {
						val = ((row - i) * (i + 1) + (col - j) * (j + 1)) * posScore;
						board[i][j] = nowp;
						val+= this.scoreBoard(board, nowp, i, j);
						if (val>this.TopScore){
							reType = {x:i,y:j,val:this.TopScore};
							board[i][j]=0;
							return reType;
						}
						val -= this.scoreBoard(board, nowp%2 + 1, i, j);
						if (level > 0) {
							type = this.cal(board, level - 1, nowp % 2 + 1);
						}
						else {
							type = {
								x: 0,
								y: 0,
								val: 0
							};
							this.searchnode++;
						//	if (this.searchNode == 3000 || this.searchNode == 6000 || this.searchNode == 9000 || this.searchNode == 12000) 
							//	alert(this.searchNode + " ");
						}
						//if (type.val==this.TopScore) val=-1*this.TopScore;
						//else	
						if (type.val>this.scoreTable[4]*10) val=val/4;
						val = val - type.val;
						if (first || (val > reType.val)) {
							first = false;
							reType.x = i;
							reType.y = j;
							reType.val = val;
						}
						//		document.getElementById("s224").innerHTML=val;
						board[i][j] = 0;
					}
			}
	//	if (level>0)	document.getElementById("s224").innerHTML=reType.val;
			return reType;
		},
		updateRange:function(x,y){
			if (x-4<this.lr) this.lr=x-4;
			if (x+4>this.rr) this.rr=x+4;
			if (y-4<this.lc) this.lc=y-4;
			if (y+4>this.rc) this.rc=y+4;
			if (this.lr<0) this.lr=0;
			if (this.rr>this.row-1) this.rr=this.row-1;
			if (this.lc<0) this.lc=0;
			if (this.rc>this.col-1) this.rc=this.col-1;
		},
		fill:function(board,level,nowp){
			var i,j,ans;
			var num;
			var s;
		//	searchNode=0;
		//	document.getElementById("s000").innerHTML="1";
			num=0;
			this.searchnode=0;
			for (i=0;i<this.row;i++)
				for (j=0;j<this.col;j++)
					if (board[i][j]!=0){
				//		alert(" X:"+i+" Y:"+j+" V:"+board[i][j]);
						num++;
					}			//alert("Has "+num+" pieces on the board");
			ans = this.cal(board,level,nowp);
		//	document.getElementById("s000").innerHTML="3";
			//alert("Searched:"+this.searchNode+" After think! x:"+ans.x+" y:"+ans.y+" val="+Math.floor(ans.val));
	//		alert("Step "+this.stepn);
			this.steps[this.stepn] = ans.x*this.col+ans.y;
			this.stepn=this.stepn+1;
			this.outputnode.innerHTML="Step "+this.stepn+" Computer put "+ans.x+" "+ans.y+" Your turn!";
			board[ans.x][ans.y]=nowp;
			num = ans.x*this.col+ans.y;
			this.updateRange(ans.x,ans.y);
			s="s";
			for (i=100;num<i;i=Math.floor(i/10))
				s=s+"0";
			if (num!=0)	s=s+num;
			//alert("Num="+num+" ID="+s);
			this.debuginfo.innerHTML="Searched "+this.searchnode+this.debuginfo.innerHTML;
			document.getElementById(s).innerHTML=this.piece[nowp];
			this.checkWin(board);
		},
		
		nextStep:function(evt){
		//	alert("In Next Step!");
			this.debuginfo.innerHTML="";
			if (this.playable) {
				var sId = evt.target;
				var s = sId.id.substring(1, 4);
				var x, y;
				x = Math.floor(s / 15);
				y = (s/1) % 15;
			//	alert("getNum "+s+" x:"+x+" y:"+y+" nowPiece:"+this.nowPiece);
				if (this.gBoard.array[x][y] == 0) {
					this.updateRange(x, y);
					
					s = this.piece;
					this.steps[this.stepn] = x*this.col+y;
					this.stepn=this.stepn+1;
					this.gBoard.array[x][y] = this.nowPiece;
					//this.outputnode.innerHTML = "Computer think...";
				//	document.getElementById("outputInfo").innerHTML =" Computer is thinking...";
					sId.innerHTML = s[this.nowPiece];
					if (this.checkWin(this.gBoard.array) == false) {
						this.fill(this.gBoard.array, this.Level, this.nowPiece%2+1);
					}
					//	document.getElementById("outputInfo").innerHTML =" Your turn!";
				}
				else {
					alert(" x:" + x + " y:" + y + " has a piece..");
				}
			}
		},
		postCreate: function(){
			var list = this.id.split('_');
			this.imashup_human_name += ' ' + list[list.length-1];
			imashup.core.LocalStorageManager.newLocalStorage();
		},
		
		onInit: function(){
			if (this.inputnode.value && this.inputnode.value != "") {
				this.init(this.inputnode.value/1);
			//	alert("Start a "+(this.inputnode.value/1)+" level game!");
				this.outputnode.innerHTML="Start a new Game! Your turn!";
			}
		},		
		onRegret:function(){
			var x1,y1,x2,y2,i,s,num1,num2;
			if (this.playable&&this.stepn>0&&this.regretnum>0){
				this.regretnum--;
				this.regretnode.innerHTML="Regret("+this.regretnum+")";
				this.stepn--;
				x1 = Math.floor(this.steps[this.stepn]/this.col);
				y1 = this.steps[this.stepn]%this.col;
				s="s";
				for (i=100;this.steps[this.stepn]<i;i=Math.floor(i/10))
				s=s+"0";
				if (this.steps[this.stepn]!=0)	s=s+this.steps[this.stepn];
			//alert("Num="+num+" ID="+s);
				document.getElementById(s).innerHTML="";
				this.stepn--;
				x2 = Math.floor(this.steps[this.stepn]/this.col);
				y2 = this.steps[this.stepn]%this.col;
				s="s";
				for (i=100;this.steps[this.stepn]<i;i=Math.floor(i/10))
				s=s+"0";
				if (this.steps[this.stepn]!=0)	s=s+this.steps[this.stepn];
			//alert("Num="+num+" ID="+s);
				document.getElementById(s).innerHTML="";
				this.gBoard.array[x1][y1]=0;
				this.gBoard.array[x2][y2]=0;
				this.outputnode.innerHTML = "Regret successed, Your turn!";				
			}else{
				this.outputnode.innerHTML = "Regret failed, Your turn!";
			}
		},
		oninput: function(){
			
		},
    synchBoard:function(board){
      var i,j,num;
      var s;
      for (num=0;num<this.row*this.col;num++){
      	s="s";
  			for (i=100;num<i;i=Math.floor(i/10))
				s=s+"0";
	  		if (num!=0)	s=s+num;
			//alert("Num="+num+" ID="+s);
		  //	this.debuginfo.innerHTML="Searched "+this.searchnode+this.debuginfo.innerHTML;
        document.getElementById(s).innerHTML=this.piece[board[Math.floor(num/this.col)][num%this.col]];
      }
    },
		onLoad:function(){
            var localStorage = imashup.core.LocalStorageManager.LocalStorage;
            var arr = localStorage.get("imashup.components.widgets.GobangBoard",1);
      //var arr=new Array(this.row);
      //for (var i=0;i<this.row;i++){
      //  arr[i]= new Array(this.col);
      //  for (var j=0;j<this.col;j++) arr[i][j]=0;
      //}
      //arr[3][3]=1; arr[4][4]=2;
      this.gBoard.array=arr.array;
      this.synchBoard(this.gBoard.array);		
		},
		onSave:function(){
            var localStorage = imashup.core.LocalStorageManager.LocalStorage;
            localStorage.save(this.gBoard);
            alert("SAVE!");

		}
	}

);

imashup.core.componentTypeManager.registerComponentType({
    impl_name : 'imashup.components.widgets.Gobang',

    interface: {
        properties: {},
        methods: {},
        events: {
			"input": { Function: "oninput", CustomMethod: "/* arguments[0]: String */" }
		}
    },
    mixin_types : ['window']
});
