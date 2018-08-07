var app = new Vue({
	el: '#app',
	data: {
		hisIconFill:"#333333",
		className:"ClassName",
		tableName: "TableName",
		defaultJavaType: "String",
		defaultDatabaseType: "VARCHAR2(120)",
		defaultjdbcType:"VARCHAR",
		colstext: "",
		cols: [],
		specificTypes: [],
		properties: [],
		colunns: [],
		statement: []
	},
	methods:{
		hisConvert:function(){
			var name = this.tableName;
			var his = "_his";
			if(his == name.substr(name.length-4))
				this.tableName = name.replace('_his','');
			else
				this.tableName = name + his;
		}
	},
	computed: {
		getJavaProperties: function () {
			var pros = new Array();
			var prefix = 'private ';
			var suffix = ' ;';
			var propType;
			var c, s;
			for(var i = 0; i < this.cols.length; i++){
				c = this.cols[i];
				for(var j = 0; j < this.specificTypes.length; j++){
					if (s.column == c) {
						propType = s.javaType;
						break;
					}
				}
				if (!propType)
					propType = this.defaultJavaType;
				pros.push(prefix + propType + '\t' + c + suffix);
			}
			this.properties = pros;
			return this.properties.join('\n');
		},
		getDatabaseProperties: function () {
			var pros = new Array();
			var head = "CREATE TABLE " + this.tableName + "( \n id NUMBER(10),";
			pros.push(head);
			var suffix = ' ,';
			var propType;
			var c, s;
			for(var i = 0; i < this.cols.length; i++){
				c = this.cols[i];
				for(var j = 0; j < this.specificTypes.length; j++){
					s = this.specificTypes[j];
					if (s.column == c) {
						propType = s.databaseType;
						break;
					}
				}
				if (!propType)
					propType = this.defaultDatabaseType;
				pros.push( c + '\t' + propType + suffix);
			};
			pros.push('creationdate DATE DEFAULT SYSDATE');
			pros.push(',modifieddate DATE DEFAULT SYSDATE');
			pros.push(",deal_code CHAR(3) DEFAULT 'I'");
			pros.push(',deal_msg  VARCHAR2(4000)');
			pros.push(',PRIMARY KEY (id)');
			pros.push(');');
			this.colunns = pros;
			return this.colunns.join('\n');
		},
		getMybatisStatement: function () {
			var lines = new Array();
			var head = "INSERT INTO " + this.tableName + "( \n id";
			lines.push(head)
			var suffix = ' ,';
			var propType;
			var c, s;
			for(var i = 0; i < this.cols.length; i++){
				c = this.cols[i];
				lines.push( suffix + ' ' + c);
			}
			lines.push(')VALUES(');
			lines.push("get_sequences('"+ this.tableName +"')");
			for(var i = 0; i < this.cols.length; i++){
				c = this.cols[i];
				for(var j = 0; j < this.specificTypes.length; j++){
					s = this.specificTypes[j];
					if (s.column == c) {
						propType = s.jdbcType;
						break;
					}
				}
				if (!propType)
					propType = this.defaultjdbcType;
				lines.push( suffix + ' #{item.' + c + ', jdbcType=' + propType + '}');
			}
			lines.push(');');
			this.statement = lines;
			return this.statement.join('\n');
		}
	}
});

function parse() {
	var arr = $('#one-col-one-row').val().split('\n').filter(function(item, index, self){
		return item != '';
	});
	var trimArr = new Array();
	arr.forEach(function(item, index){
		trimArr.push(jQuery.trim(item).toLowerCase());
	});
	app._data.cols = trimArr;
	console.log(app);
}
$('.btn-copy').click(function () {
	var textareaId = 'tx-' + this.innerText;
	var textarea = document.getElementById(textareaId);
	textarea.select(); // 选择对象
	document.execCommand("Copy");
});
