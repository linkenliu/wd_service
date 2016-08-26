require.config({
    paths: {
        jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
    }
});
require(["jquery"], function ($) {
    $(function () {

        var ckRightLength = $("input[name = 'role_right']:checked").length;var unckRightLength = $("input[name = 'role_right']").length;
        if(ckRightLength == unckRightLength){
            $("#allCheckbox").parent().addClass("checked");
            $("#allCheckbox").attr('checked','checked');
        }

        $("#rightDel").on('click', function () {
            var right_id = $("#del_right_id").val();
            $.post('/admin/deleteRight', {right_id:right_id}, function (data) {
                if (data.success == true) {
                    $('#delModal').hide();
                    window.location.href = '/admin/rightList';
                } else {
                    alert(data.message);
                }
            });
        });



        $("#roleDel").on('click',function(){
            var role_id = $("#del_role_id").val();
            $.post('/admin/deleteRole', {role_id:role_id}, function (data) {
                if (data.success == true) {
                    $('#delRoleModal').hide();
                    window.location.href = '/admin/roleList';
                } else {
                    alert(data.message);
                }
            });
        });



















        //复选框选中
        $("#allCheckbox").on('click',function(){
            var ck = $(this).attr('checked');
            if(ck == 'checked'){
                $("input[type='checkbox']").each(function(){
                    $(this).parent().removeClass("checked")
                    $(this).removeAttr('checked');
                });
            }else{
                $("input[type='checkbox']").each(function(){
                    $(this).parent().addClass("checked")
                    $(this).attr('checked','checked');
                });
            }
        });

        $(".checkedSumBox").on('click',function(){
            var ck = $(this).attr('checked');
            if(ck == 'checked'){
                $("#allCheckbox").parent().removeClass("checked");
                $("#allCheckbox").removeAttr('checked');
                $(this).parent().parent().parent().parent().find("input[type='checkbox']").removeAttr('checked');
                $(this).parent().parent().parent().parent().find("span").removeClass("checked");
            }else{
                $(this).parent().parent().parent().parent().find("input[type='checkbox']").attr('checked','checked');
                $(this).parent().parent().parent().parent().find("span").addClass("checked")
            }
        });

        $(".checkedSubBox").on('click',function(){
            var ck = $(this).attr('checked');
            if(ck == 'checked'){
                $("#allCheckbox").parent().removeClass("checked");
                $("#allCheckbox").removeAttr('checked');
                $(this).removeAttr('checked');
                $(this).parent().removeClass("checked");
            }else{
                $(this).attr('checked','checked');
                $(this).parent().addClass("checked");
            }
            var subMaxLength = $(this).parent().parent().parent().parent().find('dd').find("input[type='checkbox']").length;
            var subCheckLength = $(this).parent().parent().parent().parent().find('dd').find("input[type='checkbox']:checked").length;
            if(subMaxLength > subCheckLength){
                //$(this).parent().parent().parent().parent().find("dt").find("input[type='checkbox']").removeAttr('checked');
                //$(this).parent().parent().parent().parent().find("dt").find("span").removeClass("checked")
            }else{
                $(this).parent().parent().parent().parent().find("dt").find("input[type='checkbox']").attr('checked');
                $(this).parent().parent().parent().parent().find("dt").find("span").addClass("checked");
            }
        });




    });
});


function showModal(min) {
    $("#" + min).toggle();
}


function delRight(mid,right_id,right_name){
    $("#del_right_id").val(right_id);
    $("#del_right_name_flag").text('['+right_name+']');
    $("#"+mid).toggle();
}



function delRole(mid,right_id,right_name){
    $("#del_role_id").val(right_id);
    $("#del_role_name_flag").text('['+right_name+']');
    $("#"+mid).toggle();
}