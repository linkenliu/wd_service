/**
 * Created by liusheng on 16/8/10.
 */
function Message() {
    var sql = "";
    //获取用户列表
    this.getMessageList = function (params) {
        sql = "select m.id as message_id,u.user_name,m.message,m.type,m.create_date from message m left join user u on u.user_id=m.user_id where 1=1";
            if(params.postChoose && params.keyWord){
                if(params.postChoose == 1){
                    sql+=" and u.user_name like '%"+params.keyWord+"%'";
                }else if(params.postChoose == 2){
                    sql+= " and m.message like '%"+params.keyWord+"%'";
                }else{
                    sql+=" and u.user_name like '%"+params.keyWord+"%'";
                }
            }
            sql+= " order by m.create_date desc ";
        return sql;
    }
    /*获取最后一条推送消息*/
    this.getLastMessage = function(params){
        sql = "select m.message from message m where 1=1 ";
            if(!params.user_id){
               sql+=" and m.type=0 ";
            }
            if(params.user_id){
                sql+=" and m.type=1 and m.user_id = '"+params.user_id+"' ";
            }
        sql+=" order by m.create_date desc limit 1";
        return sql;
    }
}
module.exports = Message;