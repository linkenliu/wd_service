/**
 * Created by liusheng on 16/8/10.
 */
function Active() {
    var sql = "";
    //获取活跃度列表
    this.getActiveList = function (params) {
        sql = "select u.user_id,u.user_name,sum(a.look_long) as look_long,u.state from active a inner join user u on a.user_id = u.user_id where 1=1 ";
        if (params.keyWord) {
            if (params.postChoose == 1) {
                sql += " and u.user_name like '%" + params.keyWord + "%' ";
            } else if (params.postChoose == 2) {
                sql += " and u.user_id = '" + params.keyWord + "' ";
            }
        }
        sql += " group by u.user_id ORDER BY look_long desc";
        if (params.pageSize != null && params.pageIndex != null) {
            sql += " LIMIT " + params.pageIndex + " , " + params.pageSize + "";
        }
        return sql;
    };
    this.getActiveCount = function (params) {
        sql = "select u.user_id,u.user_name,sum(a.look_long) as look_long,u.state from active a inner join user u on a.user_id = u.user_id where 1=1 ";
        if (params.keyWord) {
            if (params.postChoose == 1) {
                sql += " and u.user_name like '%" + params.keyWord + "%' ";
            } else if (params.postChoose == 2) {
                sql += " and u.user_id = '" + params.keyWord + "' ";
            }
        }
        sql += " group by u.user_id ORDER BY look_long desc";
        return sql;
    };
}
module.exports = Active;