/**
 * Created by liusheng on 16/8/10.
 */
function User() {
    var sql = "";

    this.getRightParent = function(params){
        sql = "select r.* from `right` r where r.is_parent = 1 order by r.sort ";
        return sql;
    };
    this.getRightByParentID = function(params){
        sql = "select r.* from `right` r where r.right_parent_id = '"+params.right_id+"' order by r.sort ";
        return sql;
    };
    this.getRoleList = function(params){
        sql = "select * from role order by create_date desc";
        return sql;
    };
    this.findOneEditorRole = function(params){
        sql = "select e.*,ur.role_id from editor e left join user_role ur on e.id=ur.user_id where e.id = '"+params.id+"'";
        return sql;
    };
    this.getMenu = function(params){
        sql = "select r.right_node from `right` r INNER join role_right rr  on r.right_id = rr.right_id where rr.role_id = '"+params.role_id+"'";
        return sql;
    };
    this.getUserRoleByUSERID = function(params){
        sql = "select r.role_id from role r inner join user_role ur on r.role_id=ur.role_id where ur.user_id = '"+params.user_id+"'";
        return sql;
    };
    this.findEditorAndRole = function(params){
        sql = "select r.role_name,e.* from editor e LEFT join user_role ur ON e.id = ur.user_id  LEFT JOIN role r on ur.role_id = r.role_id where e.name = '"+params.name+"'";
        return sql;
    }
}
module.exports = User;