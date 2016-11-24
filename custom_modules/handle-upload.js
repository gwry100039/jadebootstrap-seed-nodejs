var templateCheck = require('./template-check');
//file upload
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var multer  = require('multer') 
var storage = multer.diskStorage({
     //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    }, 
     //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
      var fileFormat = (file.originalname).split(".");
      // TODO 获取请求人的员工号，考虑接入统一认证
      console.log('filename session:'+req.session);
      var userName = req.session.username;
      cb(null, file.fieldname + '-' + userName + '-' + (new Date()).Format('yyyyMMdd-hhmmss') + "." + fileFormat[fileFormat.length - 1]);
    }
 });
var filter = function fileFilter (req, file, cb) {

  var fileFormat = (file.originalname).split(".");
  var suffix = fileFormat[fileFormat.length - 1];
  console.log('文件后缀名:'+suffix);
  // cb(null, false)
  // To accept the file pass `true`, like so:
  if ( suffix != 'xlsx' )
    cb(new Error('文件格式错误!'));
  cb(null, true);
};
var upload = multer({
  storage: storage,
  fileFilter : filter
});
var cpUpload = upload.fields([
  { name: 'table', maxCount: 1 }, 
  { name: 'primarykey', maxCount: 1 }, 
  { name: 'index', maxCount: 1 }
])

var uploadHandler = function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
  console.log (req.files);
  var XLSX = require('xlsx');

  //TODO 对excel内容的校验，一部分校验需要连接数据库
  if(req.files['table']) {
    var tableArray = req.files['table'];
    for ( var i in tableArray ) {
      var tab = tableArray[i];
      console.log(tab);
      var workbook = XLSX.readFile(tab.path);
      var name0 = workbook.SheetNames[0];
      var templateArrayData = XLSX.utils.sheet_to_json(workbook.Sheets[name0]);
      var errorResults = templateCheck.checkTable(templateArrayData);
      console.log(errorResults);
    }
    
  }

  if(req.files['primarykey']) {
    var tableArray = req.files['primarykey'];
    for ( var i in tableArray ) {
      var tab = tableArray[i];
      console.log(tab);
      var workbook = XLSX.readFile(tab.path);
      console.log( workbook.SheetNames);
    }
  }

  if(req.files['index']) {
    var tableArray = req.files['index'];
    for ( var i in tableArray ) {
      var tab = tableArray[i];
      console.log(tab);
      var workbook = XLSX.readFile(tab.path);
      console.log( workbook.SheetNames);
    }
  }
  //res.send(req.files);
  res.render('submit-result', { errorResults: errorResults })
}

module.exports = {
  uploadHandler : uploadHandler,
  cpUpload : cpUpload
}