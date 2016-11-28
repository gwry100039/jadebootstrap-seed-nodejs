function isDelete (dataObj) { 
	return dataObj.IS_DELETE && dataObj.IS_DELETE.trim() === '1' ;
}

/*校验规则集，每个类型（table,primarykey,index，且可扩展）可以定义两种类型的函数：
* singleCheckFuncs(dataObj) 参数为单条记录
* multiCheckFuncs(dataList) 参数为记录数组
*/
var checkFunctions = {
	table : {
		singleCheckFuncs : {
			提交人为空 : function (dataObj) {// deprecated 接入统一认证以后应该不会有了
				return dataObj.MODI_USER === undefined;
			},
			CG_ID为空 : function (dataObj) {
				return dataObj.CG_ID === undefined ;
			},
			CG_NAME为空 : function (dataObj) {
				return dataObj.CG_NAME === undefined;
			},
			COLUMN_NAME为空 : function (dataObj) {
				return dataObj.COLUMN_NAME === undefined;
			},
			分词ID后一个与CG_ID不一致 : function (dataObj) {
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
			COLUMN_NAME重复 : function (dataList) {
				var tableMap = {};
				var errorData = [];
				for ( var i in dataList ) {
					var tableName = dataList[i]['TABLE_NAME'];
					var columnName = dataList[i]['COLUMN_NAME'];
					if ( tableMap[tableName] === undefined ) {
						tableMap[tableName] = {};
					} 
					if ( tableMap[tableName][columnName] != undefined ) {
						if ( errorData.indexOf(tableMap[tableName][columnName]) === -1 ) {
							errorData.push(tableMap[tableName][columnName]);
						}
						errorData.push(dataList[i]);
					}
					else {
						tableMap[tableName][columnName] = dataList[i];
					}
				}
				return errorData;
			},
			COLUMN_ID重复 : function (dataList) {
				var tableMap = {};
				var errorData = [];
				for ( var i in dataList ) {
					var tableName = dataList[i]['TABLE_NAME'];
					var columnId = dataList[i]['COLUMN_ID'];
					if ( tableMap[tableName] === undefined ) {
						tableMap[tableName] = {};
					} 
					if ( tableMap[tableName][columnId] != undefined ) {
						if ( errorData.indexOf(tableMap[tableName][columnId]) === -1 ) {
							errorData.push(tableMap[tableName][columnId]);
						}
						errorData.push(dataList[i]);
					}
					else {
						tableMap[tableName][columnId] = dataList[i];
					}
				}
				return errorData;
			},
			同一张表有多个表描述 : function (dataList) {
				var tableMap = {};
				var errorData = [];
				for ( var i in dataList ) {
					var tableName = dataList[i]['TABLE_NAME'];
					var tableComments = dataList[i]['TAB_COMMENTS']
					if ( tableMap[tableName] === undefined ) {
						tableMap[tableName] = dataList[i];
					}
					else if ( tableMap[tableName]['TAB_COMMENTS'] != tableComments ) {
						if ( errorData.indexOf(tableMap[tableName]) === -1 ) {
							errorData.push(tableMap[tableName]);
						}
						errorData.push(dataList[i]);
					}
				}
				return errorData;
			}
		}

	},
	primarykey : {
		singleCheckFuncs : {
			字段格式不合法 : function (dataObj) {
				console.log(dataObj);
				if( isDelete(dataObj) ) return false;
				else if(dataObj.PK_COLUMNS) {
					var reg = /^([a-zA-Z0-9#_]+)( *, *[a-zA-Z0-9#_]+)*$/g;
					var length = dataObj.PK_COLUMNS.match(reg).length;
					if(!length) return true;
					else return false;
				} else {
					return true;
				}				
			}
		},
		multiCheckFuncs : {
			主键字段重复 : function (dataList) {
				var tableMap = {};
				var errorData = [];
				for ( var i in dataList ) {
					if( !isDelete(dataList[i]) ) {
						var tableName = dataList[i]['TABLE_NAME'];
						var pkColumns = dataList[i]['PK_COLUMNS']
						if ( tableMap[tableName] === undefined ) {
							tableMap[tableName] = dataList[i];
						}
						else if ( tableMap[tableName]['PK_COLUMNS'] != pkColumns ) {
							if ( errorData.indexOf(tableMap[tableName]) === -1 ) {
								errorData.push(tableMap[tableName]);
							}
							errorData.push(dataList[i]);
						}
					}					
				}
				return errorData;
			}
		}
	},
	index : {
		singleCheckFuncs : {
			字段格式不合法 : function (dataObj) {
				if( isDelete(dataObj) ) return false;
				else if(dataObj.INDEX_COLUMNS) {
					var reg = /^([a-zA-Z0-9#_]+)( *, *[a-zA-Z0-9#_]+)*$/g;
					var length = dataObj.INDEX_COLUMNS.match(reg).length;
					if(!length) return true;
					else return false;
				} else {
					return true;
				}				
			}
		},
		multiCheckFuncs : {
			索引字段重复 : function (dataList) {
				var tableMap = {};
				var errorData = [];
				for ( var i in dataList ) {
					if( !isDelete(dataList[i]) ) {
						var tableName = dataList[i]['TABLE_NAME'];
						var indexColumns = dataList[i]['INDEX_COLUMNS']
						if ( tableMap[tableName] === undefined ) {
							tableMap[tableName] = dataList[i];
						}
						else if ( tableMap[tableName]['INDEX_COLUMNS'] != indexColumns ) {
							if ( errorData.indexOf(tableMap[tableName]) === -1 ) {
								errorData.push(tableMap[tableName]);
							}
							errorData.push(dataList[i]);
						}
					}					
				}
				return errorData;
			},
			索引名重复 : function (dataList) {
				var tableMap = {};
				var errorData = [];
				for ( var i in dataList ) {
					if( !isDelete(dataList[i]) ) {
						var tableName = dataList[i]['TABLE_NAME'];
						var indexName = dataList[i]['INDEX_NAME']
						if ( tableMap[tableName] === undefined ) {
							tableMap[tableName] = dataList[i];
						}
						else if ( tableMap[tableName]['INDEX_NAME'] != indexName ) {
							if ( errorData.indexOf(tableMap[tableName]) === -1 ) {
								errorData.push(tableMap[tableName]);
							}
							errorData.push(dataList[i]);
						}
					}					
				}
				return errorData;
			}
		}
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
		pArrayExcelData[i].INDEX = pArrayExcelData.indexOf(pArrayExcelData[i]);

		var singleTableCheckFuncs = checkFunctions[type].singleCheckFuncs
		for ( var funcName in singleTableCheckFuncs ) {
			// console.log(funcName,pArrayExcelData[i]);
			if (singleTableCheckFuncs[funcName](pArrayExcelData[i])) {
				if ( errorResult[funcName] === undefined ) {
					errorResult[funcName] = [];
				}
				errorResult[funcName].push(pArrayExcelData[i]);
				console.log(pArrayExcelData[i]);
			}
		}
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