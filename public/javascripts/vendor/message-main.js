require.config({
	paths: {
		jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
	}
});
require(["jquery"], function($) {
	$(function() {

		$("#push_message").on('click',function(){
			var message = $("#message").val();
			if(message.trim()){
				$.post('/admin/pushMessage', {action: 'all',message:message}, function (data) {
					if (data.success == true) {
						alert(data.message);
						$('#myModal').hide();
						window.location.href = '/admin/messageList';
					} else {
						alert(data.message);
					}
				});
			}else{
				alert('消息内容不能为空!');
				return;
			}
		});

		$("#pull_message").on('click',function(){
			var message = $("#edit_message").val();
			var id = $("#edit_key_id").val();
			if(message.trim()){
				$.post('/admin/updateMessage', {id:id,message:message}, function (data) {
					if (data.success == true) {
						$('#editModal').hide();
						window.location.href = '/admin/messageList';
					} else {
						alert(data.message);
					}
				});
			}else{
				alert('消息内容不能为空!');
				return;
			}
		});


		$("#messageDelete").on('click',function(){
			var id = $("#del_key_id").val();
			$.post('/admin/deleteMessage', {id:id}, function (data) {
				if (data.success == true) {
					$('#myModal').hide();
					window.location.href = '/admin/messageList';
				} else {
					alert(data.message);
				}
			});
		});



	});
});

/*删除消息UI*/
function deleteMessage(mid, id) {
	$("#del_key_id").val(id);
	$("#" + mid).toggle();
}

/*编辑消息*/
function editMessage(mid, id,message) {
	$("#edit_key_id").val(id);
	$("#edit_message").val(message);
	$("#" + mid).toggle();
}

function showModal(mid) {
	$("#" + mid).toggle();
}

/*消息推送*/
function pushAllMessage(mid) {
	$("#" + mid).toggle();
}