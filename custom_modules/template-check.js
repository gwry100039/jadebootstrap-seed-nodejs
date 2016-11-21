//单条记录校验规则
var singleTableCheckFun = {
	NULLCOMMITTER : function (dataObj) {
		return dataObj.MODI_USER === undefined;
	},
	NULLCG : function (dataObj) {
		return dataObj.CG_ID === undefined || dataObj.CG_NAME === undefined;
	},
	NULLCOLUMNNAME : function (dataObj) {
		return dataObj.COLUMN_NAME === undefined;
	},
	CGNAMENOTMATCH : function (dataObj) {
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
	NULLCOMMITTER : function (dataList) {
		return dataObj.MODI_USER === undefined;
	},
	NULLCG : function (dataList) {
		return dataObj.CG_ID === undefined || dataObj.CG_NAME === undefined;
	},
	NULLCOLUMNNAME : function (dataList) {
		return dataObj.COLUMN_NAME === undefined;
	},
}
//涉及到数据库查询的校验规则
var dbTableCheckFun = {
	NULLCOMMITTER : function (dataObj) {
		return dataObj.MODI_USER === undefined;
	},
	NULLCG : function (dataObj) {
		return dataObj.CG_ID === undefined || dataObj.CG_NAME === undefined;
	},
	NULLCOLUMNNAME : function (dataObj) {
		return dataObj.COLUMN_NAME === undefined;
	},
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
					pArrayExcelData[i].INDEX = pArrayExcelData.indexOf(pArrayExcelData[i]);
					errorResult[funcName].push(pArrayExcelData[i]);
				}
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