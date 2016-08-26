require.config({
    paths: {
        jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
    }
});
require(["jquery"], function ($) {
    $(function () {

        //登录
        $("#loginform").on('submit', function () {
            var name = $("#username").val();
            var password = $("#password").val();
            // 用户名、密码判空处理
            if ('' == username || '' == password) {
                $(".alert-error").css('display', 'block');
                $("#error-message").text('请检查用户名或密码是否填写完整');
            } else {
                // ajax异步请求后台数据
                $.post('/admin/login', {
                    name: name,
                    password: password
                }, function (data) {
                    if (data.code == 400) {
                        $(".alert-error").css('display', 'block');
                        $("#error-message").text(data.message);
                    } else if (data.code == 200) {
                        $(".alert-error").css('display', 'block');
                        $("#error-message").text(data.message);
                        window.location.href = "/admin/getMenu";
                    } else {
                        alert('非法请求');
                    }
                });
            }
        });

        //删除用户
        $(".delEditor").on('click', function () {
            var id = $(this).attr('id_data');
            var name = $(this).attr('name_data');
            $("#del_key_id").val(id);
            $("#delete_user_name_flag").text('[' + name + ']');
            $("#deleteModal").toggle();
            /*if(confirm("确认要删除吗?")){
             window.location.href = '/admin/editorDelete?id='+id;
             }*/
        });

        $("#editorDelete").on('click', function () {
            var id = $("#del_key_id").val();
            window.location.href = '/admin/editorDelete?id=' + id;
        });


    });
});


function showModal(min) {
    $("#" + min).toggle();
}


var flag = 0;
function checkName() {
    var name = $("#name").val();
    $.post('/admin/checkEditorName', {
        name: name.trim(),
        action: 'editorAdd'
    }, function (data) {
        if (data.success == true) {
            $("#eoor_name").text(data.message);
            flag = 1;
        } else {
            $("#eoor_name").text('');
            flag = 0;
        }
    });
}

function checkForm() {
    var email = $("#email").val();
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (flag == 1) {
        return false;
    } else if (email && (!myreg.test(email))) {
        $("#error_email").text("邮箱格式非法!");
        window.setTimeout(function () {
        }, 1500);
        return false;
    }
    else {
        $("#editorForm").submit;
        return true;
    }
}

var flag2 = 0;
function checkName2() {
    var name = $("#name2").val();
    var id = $("#editorId").val();
    $.post('/admin/checkEditorName', {
        name: name.trim(),
        id: id,
        action: 'editorEdit'
    }, function (data) {
        if (data.success == true) {
            $("#eoor_name2").text(data.message);
            flag2 = 1;
        } else {
            $("#eoor_name2").text('');
            flag2 = 0;
        }
    });
}

function checkForm2() {
    var email = $("#email2").val();
    var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (flag2 == 1) {
        return false;

    } else if (email && (!myreg.test(email))) {
        $("#error_email2").text("邮箱格式非法!");
        window.setTimeout(function () {
        }, 1500);
        return false;
    }
    else {
        $("#editorForm").submit;
        return true;
    }
}