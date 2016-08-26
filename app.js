var express = require('express');
var path = require('path');
var ejs = require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var log = require('./utils/log');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var routes = require('./routes/index');
var menu = require('./utils/menu');
var editorRoute = require('./routes/editorRoute');
var userRoute = require('./routes/userRoute');
var messageRoute = require('./routes/messageRoute');
var channelRoute = require('./routes/channelRoute');
var activeRoute = require('./routes/activeRoute');
var rightRoute = require('./routes/rightRoute');
var interfaceAPI = require('./routes/API');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
log.use(app);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
  reviver: function(k, v) {
    //console.log(k);//输出post请求的json数据
    return v;
  },
  verify: function(req, res, buf, encoding) {
    //console.log('encoding is: ' + encoding);//输出post请求的编码
  }
})); // for parsing application/json
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: true
})); // for parsing application/x-www-form-urlencoded with qs
app.use(cookieParser());

// 设置会话参数
app.use(session({
  name:'connect.sid',//这里的name值得是cookie的name，默认cookie的name是：connect.sid
  secret:'1234567890QWERTY',
  cookie: {
    secure: false
  },
  resave: true, // 即使 session 没有被修改，也保存 session 值，默认为 true。
  saveUninitialized: true
}));



//登陆验证
app.use('/admin',function(req,res,next){
  //session不存在并且不是登陆页面时跳转到对应的页面
  if (!req.session.sessionUser && req.url == "/login") {
    next();
  } else if(req.session.sessionUser){
    app.locals.sessionUser = req.session.sessionUser;
    app.locals.menuList = req.session.menuList;
    next();
  } else {
    //否则跳转到登陆页面
    res.render('admin/login',{});
  }
});


/*app.use(function (req, res, next) {
  if (req.session.sessionUser && req.url == "/admin/index") {
    menu.getMenu(req.session.sessionUser.id, function (data) {
      if (data.success == true) {
        req.session.menuList = data.data;
        req.session.save(function (error) {
          if (error) {
            res.send({error:error.message});
          }
          next();
        });
      } else {
        next();
      }
    });
  } else {
    next();
  }
});*/

app.use('/', routes);
app.use('/admin', editorRoute);
app.use('/admin',userRoute);
app.use('/admin',messageRoute);
app.use('/admin',channelRoute);
app.use('/admin',activeRoute);
app.use('/admin',rightRoute);
app.use('/',interfaceAPI);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
   err.status = 404;
   next(err);*/
  res.send({'error':'404 The export path was not found'})
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: '系统异常'
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
