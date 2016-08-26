require.config({
	paths: {
		jquery: ["http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min", '../jquery-2.1.4.min'] //配置第三方库，不能加.js后缀
	}
});
require(["jquery"], function($) {
	$(function() {

		//删除epg
		$(".delEpg").on('click',function(){
			var id = $(this).attr('id_date');
			var name = $(this).attr('name_data');
			$("#del_key_id").val(id);
			$("#delete_user_name_flag").text('['+name+']');
			$("#deleteModal").toggle();
		});

		$("#epgDelete").on('click',function(){
			var _this = $(this);
			var epg_id = $("#del_key_id").val();
			var channel_id = $('input[name="channel_id"]').val();
			var channel_name = $('input[name="channel_name"]').val();
			$.post('/admin/deleteEpg', {epg_id:epg_id}, function (data) {
				if (data.success == true) {
					$('#deleteModal').hide();
					 window.location.href = '/admin/epgList?channel_id='+channel_id+'&channel_name='+channel_name;
				} else {
					alert(data.message);
				}
			});
		});

		$("#releaseState").on('click',function(){
			var id = $("#unrelease_chid").val();
			var state = $(this).attr('state');
			$.post('/admin/updateChannel', {id:id,state:state}, function (data) {
				if (data.success == true) {
					$('#releaseModal').hide();
					window.location.href = '/admin/channelList';
				} else {
					alert(data.message);
				}
			});
		});


		$('.release').on('click',function(){
			var id = $(this).attr('id');
			var state = $(this).attr('state');
			$.post('/admin/updateChannel', {id:id,state:state}, function (data) {
				if (data.success == true) {
					window.location.href = '/admin/channelList';
				} else {
					alert(data.message);
				}
			});
		});




		$(".check_proportion").on('click',function(){
			var chid = $(this).attr('chid_date');
			var proportion = $(this).siblings().val();
			$.post('/admin/channelEdit', {chid:chid,proportion:proportion}, function (data) {
				if (data.success == true) {
					alert(data.message);
				} else {
					alert(data.message);
				}
			});

		});


		$(".check_key_code").on('click',function(){
			var chid = $(this).attr('chid_date');
			var key_code = $(this).siblings().val();
			var _this = $(this);
			$.post('/admin/channelEdit', {chid:chid,key_code:key_code}, function (data) {
				if (data.success == true) {
					alert(data.message);
				} else {
					alert(data.message);
				}
			});

		});


		if(window.location.href.indexOf('channelScreenshot')>-1){
			//电视墙
			currentScreenshot();
			window.setInterval(currentScreenshot2, (1000 * 60) * 2);

		}






	});
});


function showModal(mid) {
	$("#" + mid).toggle();
}

//取消发布
function unRelease(mid,chid,name){
	$("#unrelease_name_flag").text('['+name+']');
	$("#unrelease_chid").val(chid);
	$("#"+mid).toggle();
}


function showImg(img){
	$(".showImg").attr('src',img);
}


//电视墙
function currentScreenshot() {
	$.post('/admin/channelScreenshot', {}, function (data) {
		var example1 = new Vue({
			el: '#example',
			data: {
				list: data.data
			}
		});
	});
}
//电视墙
function currentScreenshot2() {
	$.post('/admin/channelScreenshot', {}, function (data) {
		var example1 = new Vue({
			el: '#example',
			data: {
				list: data.data
			}
		});
		window.location.href = '/admin/channelScreenshot'
	});
}



/*视频墙模糊查询*/
function channelScreenshotSearch() {
	var keyWord = $("#keyWord").val().trim();
	keyWord = keyWord.toUpperCase();
	reset();
	if (keyWord) {
		$("#example>div>span").each(function () {
			$(this).find("input[name ='channel_name']").each(function () {
				var vn = $(this).val();
				vn = vn.toUpperCase();
				if (vn.indexOf(keyWord) == -1) {
					$(this).parent().parent().hide();
				}
			});
		});
	}
}

/*清空数据*/
function reset() {
	$("#example>div>span").each(function () {
		$(this).find("input[name ='channel_name']").each(function () {
			$(this).parent().parent().show();
		});
	});
}
