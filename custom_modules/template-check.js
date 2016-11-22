//单条记录校验规则
var singleTableCheckFun = {
	提交人为空 : function (dataObj) {
		return dataObj.MODI_USER === undefined;
	},
	NULL_CGID : function (dataObj) {
		return dataObj.CG_ID === undefined ;
	},
	NULL_CGNAME : function (dataObj) {
		return dataObj.CG_NAME === undefined;
	},
	NULL_COLUMNNAME : function (dataObj) {
		return dataObj.COLUMN_NAME === undefined;
	},
	CGNAME_NOTMATCH : function (dataObj) {
		return 
		(dataObj.C1_ID != dataObj.CG_ID || dataObj.C1_ID === undefined ) &&
		(dataObj.C2_ID != dataObj.CG_ID || dataObj.C2_ID === undefined ) &&
		(dataObj.C3_ID != dataObj.CG_ID || dataObj.C3_ID === undefined ) &&
		(dataObj.C4_ID != dataObj.CG_ID || dataObj.C4_ID === undefined ) &&
		(dataObj.C5_ID != dataObj.CG_ID || dataObj.C5_ID === undefined ) &&
		(dataObj.C6_ID != dataObj.CG_ID || dataObj.C6_ID === undefined ) ;
	}
}
//多条记录校验规则
var multiTableCheckFun = {
	DUPLICATE_COLUMNNAME : function (dataList) {
		var tableMap = {};
		var errorData = [];
		for ( var i in dataList ) {
			var tableName = dataList[i]['TABLE_NAME'];
			var columnName = dataList[i]['COLUMN_NAME'];
			if ( tableMap[tableName] === undefined ) {
				tableMap[tableName] = {};
			} 
			if ( tableMap[tableName][columnName] != undefined ) {
				errorData.push(dataList[i]);
				console.log(columnName,dataList[i]);
			}
			else {
				tableMap[tableName][columnName] = 1;
			}
		}
		return errorData;
	},
	DUPLICATE_COLUMNID : function (dataList) {
		var tableMap = {};
		var errorData = [];
		for ( var i in dataList ) {
			var tableName = dataList[i]['TABLE_NAME'];
			var columnId = dataList[i]['COLUMN_ID'];
			if ( tableMap[tableName] === undefined ) {
				tableMap[tableName] = {};
			} 
			if ( tableMap[tableName][columnId] != undefined ) {
				errorData.push(dataList[i]);
				console.log(columnId,dataList[i])
			}
			else {
				tableMap[tableName][columnId] = 1;
			}
		}
		return errorData;
	},
	MULTI_TABLECOMMENTS : function (dataList) {
		var tableMap = {};
		var errorData = [];
		for ( var i in dataList ) {
			var tableName = dataList[i]['TABLE_NAME'];
			var tableComments = dataList[i]['TAB_COMMENTS']
			if ( tableMap[tableName] === undefined ) {
				tableMap[tableName] = tableComments;
			}
			else if ( tableMap[tableName] != tableComments ) {
				errorData.push(dataList[i]);
			}
		}
		return errorData;
	}
}
//涉及到数据库查询的校验规则
var dbTableCheckFun = {
	
}


var templateCheckFuns = {
	checkTable : function (pArrayExcelData) {
		var errorResult = {};
		for ( var i in pArrayExcelData ) {
			for ( var funcName in singleTableCheckFun ) {
				//console.log(funcName,pArrayExcelData[i]);
				if (singleTableCheckFun[funcName](pArrayExcelData[i])) {
					if ( errorResult[funcName] === undefined ) {
						errorResult[funcName] = [];
					}
					errorResult[funcName].push(pArrayExcelData[i]);
				}
			}
			pArrayExcelData[i].INDEX = pArrayExcelData.indexOf(pArrayExcelData[i]);
		}

		for ( var funcName in multiTableCheckFun ) {
			var errorData = multiTableCheckFun[funcName](pArrayExcelData);
			//console.log("ERRORDATA:",errorData);
			if ( errorData.length > 0 ) {
				errorResult[funcName] = errorData;
			}
		}
		return errorResult;
	},
	checkPrimarykey : function (pArrayExcelData) {

	},
	checkIndex : function (pArrayExcelData) {

	},
}
exports = module.exports = templateCheckFuns;