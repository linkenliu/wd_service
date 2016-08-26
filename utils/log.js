/**
 * Created by liusheng on 16/8/3.
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        //控制台输出
        {
            type: "dateFile",
            filename: './sqlscript/logger.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        }//日期文件格式,,
    ],
    levels:{
        dateFileLog: 'INFO'
    }
});

var dateFileLog = log4js.getLogger('dateFileLog');

exports.logger = dateFileLog;

exports.use = function(app) {
    //页面请求日志,用auto的话,默认级别是WARN
    //app.use(log4js.connectLogger(dateFileLog, {level:'auto', format:':method :url'}));
    app.use(log4js.connectLogger(dateFileLog, {level:'info', format:':method :url'}));
}