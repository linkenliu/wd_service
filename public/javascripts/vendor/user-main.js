require.config({
    paths: {
        jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
    }
});
require(["jquery"], function ($) {
    $(function () {

        //冻结用户
        $("#userDelete").on('click', function () {
            var id = $("#del_key_id").val();
            $.post('/admin/userDelete', {id: id, action: 'edit'}, function (data) {
                if (data.success == true) {
                    $('#deleteModal').hide();
                    window.location.href = '/admin/userList';
                } else {
                    alert(data.message);
                }
            });
        });

        //删除用户
        $("#userDel").on('click', function () {
            var id = $("#del_user_id").val();
            $.post('/admin/userDelete', {id: id, action: 'delete'}, function (data) {
                if (data.success == true) {
                    $('#delModal').hide();
                    window.location.href = '/admin/userList';
                } else {
                    alert(data.message);
                }
            });
        });


        $("#push_message").on('click', function () {
            var id = $("#push_key_id").val();
            var message = $("#message").val();
            if (message.trim()) {
                $.post('/admin/pushMessage', {id: id, action: 'single', message: message}, function (data) {
                    if (data.success == true) {
                        alert(data.message);
                        $('#myModal').hide();
                    } else {
                        alert(data.message);
                    }
                });
            } else {
                alert('消息内容不能为空!');
                return;
            }

        });

        //删除用户缴费记录
        $("#userMoneyDelete").on('click', function () {
            var id = $("#del_user_money_id").val();
            var key_id = $("#del_user_money_keyid").val();
            $.post('/admin/deleteUserMoney', {id: id}, function (data) {
                if (data.success == true) {
                    $('#myModal').hide();
                    window.location.href = '/admin/userMoneyList?key_id=' + key_id;
                } else {
                    alert(data.message);
                }
            });
        });


    });
});

/*删除用户UI*/
function deleteUser(mid, id, username) {
    $("#del_key_id").val(id);
    $("#delete_user_name_flag").text('[' + username + ']');
    $("#" + mid).toggle();
}

function showModal(mid) {
    $("#" + mid).toggle();
}

function delUser(mid, id, username) {
    $("#del_user_id").val(id);
    $("#del_user_name_flag").text('[' + username + ']');
    $("#" + mid).toggle();
}

/*消息推送*/
function pushMessage(mid, id) {
    $("#push_key_id").val(id);
    $("#" + mid).toggle();
}
var flag = 0;
function checkID() {
    var device_id = $("#user_id_forAdd").val();
    $.post('/admin/checkUserID', {
        device_id: device_id.trim(), action: 'add'
    }, function (data) {
        if (data.success == true) {
            $("#eoor_id").text(data.message);
            flag = 1;
        } else {
            $("#eoor_id").text('');
            flag = 0;
        }
    });
}

function userAddForm() {
    var email = $("#email").val();
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (flag == 1) {
        return false;
    } else if (email && (!myreg.test(email))) {
        $("#error_email").show();
        $("#error_email").text("邮箱格式非法!");
        window.setTimeout(function () {
            $("#error_email").hide();
        }, 1500);
        return false;
    }
    else {
        $("#userAddForm").submit;
        return true;
    }
}


var flag2 = 0;
function checkID2(user_id) {
    var device_id = $("#user_id_forEdit").val();
    $.post('/admin/checkUserID', {
        device_id: device_id.trim(), action: 'edit', user_id: user_id
    }, function (data) {
        if (data.success == true) {
            $("#error_edit_id").text(data.message);
            flag2 = 1;
        } else {
            $("#error_edit_id").text('');
            flag2 = 0;
        }
    });
}

function userAddForm2() {
    var email = $("#email2").val();
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (flag2 == 1) {
        return false;
    } else if (email && (!myreg.test(email))) {
        $("#error_edit_email").show();
        $("#error_edit_email").text("邮箱格式非法!");
        window.setTimeout(function () {
            $("#error_edit_email").hide();
        }, 1500);
        return false;
    }
    else {
        $("#userEditForm").submit;
        return true;
    }
}


function delUserMoney(mid, id, key_id) {
    $("#del_user_money_id").val(id);
    $("#del_user_money_keyid").val(key_id);
    $("#" + mid).toggle();
}