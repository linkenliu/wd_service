/**
 * Created by liusheng on 16/7/28.
 */
function Channel(){
    var sql = "";
    this.getChannelCHID = function(params){
        sql = "select c.chid from channel c";
        return sql;
    };
    this.getChannelCategory = function(params){
        sql = "select DISTINCT(c.category) from channel c ";
        return sql;
    };
    this.getChannelList = function(params){
        sql = "select c.* from channel c where 1=1 ";
        if(params.keyWord){
            if(params.postChoose == 1){
                sql+=" and c.name like '%"+params.keyWord+"%' ";
            }else if(params.postChoose == 2){
                sql+=" and c.chid like '%"+params.keyWord+"%' ";
            }else{
                sql+=" and c.name like '%"+params.keyWord+"%' ";
            }
        }
        if(params.category){
            if('其他' == params.category){
                params.category = "";
            }
            sql += " and c.category = '"+params.category+"' ";
        }
        if(params.chid){
            sql+=" and c.chid = '"+params.chid+"' ";
        }
        sql += " order by c.release_state,c.state desc";
        return sql;
    };
    this.getEpgList = function(params){
        sql = "select e.* from epg e where e.state = 1 and e.channel_id='"+params.channel_id+"' ";
              if(params.keyWord){
                  if(params.postChoose == 1){
                      sql+=" and e.name like '%"+params.keyWord+"%' ";
                  }
              }
              sql+=" order by e.create_date desc ";
        return sql;
    };
    this.getChannelHistory = function(params){
        sql = "select AVG(ch.users) users,avg(ch.qc) qc,avg(ch.qs) qs,ch.create_date from channel_history ch inner join channel c on c.chid = ch.chid ";
        if(params.channel_id){
            sql += " where c.chid = '"+params.channel_id+"' ";
        }
        sql += " group by ch.create_date HAVING 1=1 ";
        if(params.startDate && params.endDate){
            sql += " and ch.create_date >= '"+params.startDate+"' and ch.create_date<= '"+params.endDate+"'";
        }
        sql += " order by ch.create_date ";
        return sql;
    };
    this.getChannelHistoryByCHID = function(params){
        sql = "select ch.qs,ch.qc,ch.screenshot,ch.screenshot_small,ch.create_date from channel_history ch where ch.chid = '"+params.chid+"' order by ch.create_date desc limit 1";
        return sql;
    };

    /*接口*/
    //接口频道list
    this.getChannel = function(params){
        sql = "select c.chid id,c.sid,c.name,c.category,c.source,c.state,c.release_state,c.proportion,c.key_code from channel c order by c.key_code asc ";
        return sql;
    };
    //获取epg列表
    this.getEpgListForChannel = function(params){
        sql = "select e.epg_id epdId,e.start_date startTime,e.end_date endTime,c.state,c.release_state,c.chid channelId,e.name from channel c inner join epg e on c.chid = e.channel_id where e.state=1 " ;
            if(params.start_date && params.end_date){
                sql +=" and date_format(e.release_date,'%Y-%m-%d') >= '"+params.start_date+"' and date_format(e.release_date,'%Y-%m-%d') <= '"+params.end_date+"' ";
            }
            sql+=" order by e.start_date asc";
        return sql;
    };
}
module.exports = Channel;


