/*校验规则集，每个类型（table,primarykey,index，且可扩展）可以定义两种类型的函数：
* singleCheckFuncs(dataObj) 参数为单条记录
* multiCheckFuncs(dataList) 参数为记录数组
*/
var checkFunctions = {
	table : {
		singleCheckFuncs : {
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
		},
		multiCheckFuncs : {
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

	},
	primarykey : {

	},
	index : {

	}
}

function isEmptyObject( obj ) {
    for ( var name in obj ) {
        return false;
    }
    return true;
}
var templateCheckFunc = function (type, pArrayExcelData) {
	var errorResult = {};
	for ( var i in pArrayExcelData ) {
		var singleTableCheckFuncs = checkFunctions[type].singleCheckFuncs
		for ( var funcName in singleTableCheckFuncs ) {
			// console.log(funcName,pArrayExcelData[i]);
			if (singleTableCheckFuncs[funcName](pArrayExcelData[i])) {
				if ( errorResult[funcName] === undefined ) {
					errorResult[funcName] = [];
				}
				errorResult[funcName].push(pArrayExcelData[i]);
			}
		}
		pArrayExcelData[i].INDEX = pArrayExcelData.indexOf(pArrayExcelData[i]);
	}

	var multiTableCheckFuncs = checkFunctions[type].multiCheckFuncs
	for ( var funcName in multiTableCheckFuncs ) {
		var errorData = multiTableCheckFuncs[funcName](pArrayExcelData);
		//console.log("ERRORDATA:",errorData);
		if ( errorData.length > 0 ) {
			errorResult[funcName] = errorData;
		}
	}
	return isEmptyObject(errorResult) ? undefined : errorResult ;
}

exports = module.exports = templateCheckFunc;