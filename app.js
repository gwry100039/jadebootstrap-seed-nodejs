var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var templateCheck = require('./custom_modules/template-check');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


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
      var userName = '0014031';
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
app.post('/templates/upload', cpUpload, function (req, res, next) {
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
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
