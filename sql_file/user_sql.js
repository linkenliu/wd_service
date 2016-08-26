/**
 * Created by liusheng on 16/8/10.
 */
function User() {
    var sql = "";
    //获取用户列表
    this.getUserList = function (params) {
        sql = "select u.user_id,u.device_id,u.user_name,e.name editor_name,u.phone,u.email,u.gender,u.state,u.create_date from user u left join editor e on e.id = u.editor_id where 1=1 ";
            if(params.keyWord&&params.postChoose){
                if(params.postChoose == 1){
                    sql +=" and u.user_name like '%"+params.keyWord+"%'";
                }else if(params.postChoose == 2){
                    sql +=" and u.device_id like '%"+params.keyWord+"%'";
                }else if(params.postChoose == 3){
                    sql +=" and u.phone like '%"+params.keyWord+"%'";
                }
            }
            sql+=" order by u.create_date desc ";
            if(params.pageSize!=null && params.pageIndex!=null){
                sql += " LIMIT "+params.pageIndex+ " , "+params.pageSize+"";
            }
        return sql;
    };
    this.getUserCount = function(params){
        sql = "select count(*) count from user u left join editor e on e.id = u.editor_id where 1=1 ";
        if(params.keyWord&&params.postChoose){
            if(params.postChoose == 1){
                sql +=" and u.user_name like '%"+params.keyWord+"%'";
            }else if(params.postChoose == 2){
                sql +=" and u.device_id like '%"+params.keyWord+"%'";
            }else if(params.postChoose == 3){
                sql +=" and u.phone like '%"+params.keyWord+"%'";
            }
        }
        return sql;
    };
    //获取用户计费列表
    this.getUserMoneyList = function(params){
        sql = "select u.user_id,u.device_id,u.user_name,um.id,um.money,um.start_date,um.end_date,um.create_date from user u INNER JOIN user_money um on u.user_id = um.user_id where um.state=1 and u.user_id='"+params.key_id+"' order by um.end_date desc";
        return sql;
    };

    /*接口*/
    this.getMaxUserMoneyForEndDate = function(params){
        sql = "select max(m.end_date) as end_date from user_money m where m.state=1 and m.user_id = '"+params.user_id+"'";
        return sql;
    }
}
module.exports = User;