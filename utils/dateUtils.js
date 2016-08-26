var moment = require('moment');

var DISPLAY_DATE_FORMAT = 'YYYY-MM-DD HH:mm';

var API_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

var BIRTHDAY_DATE_FORMAT = 'YYYY-MM-DD';

var PUSH_DATE_FORMAT = 'YYYY-MM-DDTHH:mm';
var UTC_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SSS';

/**
 * 格式化日期，为web端页面显示使用
 * @param date
 * @returns {*}
 */
exports.format = function(date) {
	return moment(date).format(DISPLAY_DATE_FORMAT);
};

exports.currentDate = function(){
	return moment().format(API_DATE_FORMAT);
}

/**
 * 日期格式化
 * @return {[type]} [description]
 */
exports.formatDate = function(date) {
	return moment(date).format(API_DATE_FORMAT);
};

exports.formatBirthday = function(date) {
	return moment(date).format(BIRTHDAY_DATE_FORMAT);
};


exports.diffDate = function(datestr1,datestr2){
	var date1 = new Date(Date.parse(datestr1.replace(/-/g, "/")));
	var date2 = new Date(Date.parse(datestr2.replace(/-/g, "/")));
	var datetimeTemp;
	var isLater = true;

	/*if (date1.getTime() > date2.getTime()) {
		isLater = false;
		datetimeTemp = date1;
		date1 = date2;
		date2 = datetimeTemp;
	}*/

	difference = date2.getTime() - date1.getTime();
	thisdays = Math.floor(difference / (1000 * 60 * 60 * 24));

	difference = difference - thisdays * (1000 * 60 * 60 * 24);
	thishours = Math.floor(difference / (1000 * 60 * 60));


	//var strRet = thisdays + '天' + thishours + '小时';
	var strRet = thisdays+2;
	return strRet;
}



exports.formatCurrentDate = function(){
	/*var   today=new   Date();
	var   yesterday_milliseconds=today.getTime()-1000*60*60*24;

	var   yesterday=new   Date();
	yesterday.setTime(yesterday_milliseconds);

	var strYear=yesterday.getFullYear();

	var strDay=yesterday.getDate();
	var strMonth=yesterday.getMonth()+1;

	if(strMonth<10)
	{
		strMonth="0"+strMonth;
	}
	if(strDay<10){
		strDay="0"+strDay;
	}
	var strYesterday=strYear+"-"+strMonth+"-"+strDay;
	return strYesterday;*/
	return moment().format(BIRTHDAY_DATE_FORMAT);
}

exports.formatWeekDate = function(){
	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay();
	var nowDay = (now.getDate()+1)-7;
	var nowMonth = now.getMonth()+1;
	var nowYear = now.getFullYear();
	if(nowMonth <10){
		nowMonth ="0"+nowMonth;
	}
	if(nowDay<10){
		nowDay="0"+nowDay;
	}
	var date=nowYear+"-"+nowMonth+"-"+nowDay;
	return date;

}

exports.formatMonthDate = function(){
	//return moment(moment().subtract(30, 'days').calendar()).format(BIRTHDAY_DATE_FORMAT);
	var date = moment().subtract(30, 'days').calendar();
	//var _date = date.replace(/\//g,'-');
	var strDate = date.split('/');
	date = strDate[2]+"-"+strDate[0]+"-"+strDate[1];
	//var $date = moment(_date).format('L');
	return date;
}

/**
 * 时间本地化
 * "createDate": "2015-07-22T03:29:48.000Z",
 * 格式化为"createDate": "2015-07-22 11:29",
 * @param obj sequelize对象
 * @param field 字段名
 * @returns {*}
 */
exports.localFormat = function(obj, field) {
	obj.setDataValue(field, this.format(obj.getDataValue(field)));
};

/**
 * 判断日期是否是当天，不是放回false
 * @param date
 * @returns {boolean}
 */
exports.isToday = function(date) {
	date = new Date(date);
	var currentTime = new Date();
	if (date.getYear() != currentTime.getYear()) {
		return false;
	}else if (date.getMonth() != currentTime.getMonth()) {
		return false;
	}else if (date.getDay() != currentTime.getDay()) {
		return false;
	}else{
		return true;
	}
};

/**
 * 格式化UTC时间
 * @param date
 */
exports.formatUTCTime = function(date){
    var utcTime = moment(date,PUSH_DATE_FORMAT).utc().format(UTC_DATE_FORMAT);
    return utcTime+"Z";
};

/**
 *格式化GMT时间 
 * @param {Object} date
 */
exports.formatGMTDate = function(date){
	var dateTZ = new Date(date).toJSON();
	var datetime = moment(dateTZ).format(API_DATE_FORMAT);
	return datetime;
};


/**
 *获取每月的每周时间(周一到周日)
 * @param {Object} date
 */
exports.getweekDate = function(date){
	var now = new Date(); //当前日期
	var nowDayOfWeek = now.getDay();
	var nowDay = now.getDate();
	var nowMonth = now.getMonth();
	var nowYear = now.getFullYear();
	var Hours = now.getHours();
	var Minutes = now.getMinutes();
	var Seconds = now.getSeconds();

	/*if(nowDayOfWeek == 0){nowDayOfWeek = 7;}else{nowDayOfWeek= nowDayOfWeek;}
	var weekStartDate = new Date(nowYear, nowMonth, (nowDay+1) - (nowDayOfWeek));
	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (nowDayOfWeek - 6),Hours,Minutes,Seconds);
	weekStartDate = moment(weekStartDate).format(API_DATE_FORMAT);
	weekEndDate = moment(weekEndDate).format(API_DATE_FORMAT);
	return {weekStartDate:weekStartDate,weekEndDate:weekEndDate};*/
};

exports.getYesterdayDate = function(){
	var dd = new Date();
	dd.setDate(dd.getDate()-1);
	var y = dd.getFullYear();
	var m = dd.getMonth()+1;
	if(m < 10){
		m = '0'+m;
	}
	var d = dd.getDate();
	if(d < 10){
		d = '0'+d;
	}
	var date = y+'-'+m+'-'+d;
	return date;
};

exports.getNumberDate = function(number){
	var dd = new Date();
	dd.setDate(dd.getDate()+(number));
	var y = dd.getFullYear();
	var m = dd.getMonth()+1;
	if(m < 10){
		m = '0'+m;
	}
	var d = dd.getDate();
	if(d < 10){
		d = '0'+d;
	}
	var date = y+'-'+m+'-'+d;
	return date;
};
