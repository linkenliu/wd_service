/**
 * Created by liusheng on 16/8/18.
 */
$(function () {

    channelHistory();
    window.setInterval(channelHistory, (1000 * 60) * 2);


    function channelHistory() {
        $.post('/admin/channelHistory', {}, function (dataList) {
            var dataList = dataList.data;
            Highcharts.setOptions({global: {useUTC: true}});
            $('#container').highcharts('StockChart', {
                credits: false,
                yAxis: [{  //这里注意了  配置双Y轴的这里要看好了  这里的值是一个数组
                    min: 0,
                    title: {  //左边y轴的标题
                        text: 'QS/QC'
                    }
                    , opposite: false
                }, {
                    title: {  //这是第二天Y轴在右边
                        text: '观看人数'
                    },
                    labels: {
                        formatter: function () {//在labels里可以配置formatter属性可以对y轴设置单位之类的个性化东西
                            return this.value;//可以对照上面图表
                        }
                    },
                    opposite: true//这个属性的作用是说 是否与第一条y轴相反 当然是true咯
                }],
                title: {
                    text: '观看人数和频道质量'
                },
                scrollbar: {
                    barBorderRadius: 10
                },
                series: [
                    {
                        turboThreshold: 0,
                        type: 'spline',
                        name: '观看人数',
                        yAxis: 1,
                        data: dataList[0]
                    },
                    {
                        turboThreshold: 0,
                        type: 'spline',
                        name: 'QC',
                        yAxis: 0,
                        data: dataList[2]
                    },
                    {
                        turboThreshold: 0,
                        type: 'spline',
                        name: 'QS',
                        yAxis: 0,
                        data: dataList[1]
                    }
                ]
            });
        });
    }





    //当前统计信息
    currentChannel();
    window.setInterval(currentChannel2, (1000 * 60) * 2);


    //当前统计信息
    function currentChannel() {
        $.post('/admin/currentChannel', {}, function (data) {
            var example1 = new Vue({
                el: '#mytbody',
                data: {
                    currentList: data.data
                }
            })
        });
    }

    //当前统计信息
    function currentChannel2() {
        $.post('/admin/currentChannel', {}, function (data) {
            var example1 = new Vue({
                el: '#mytbody',
                data: {
                    currentList: data.data
                }
            });
            if(window.location.href.indexOf('index')>-1){
                window.location.href = '/admin/index';
            }else{
                window.location.href = '/admin/channelSPSS';
            }
        });
    }


});


function changeChannel() {
    var channel_id = $("#select_channel").val();
    $.post('/admin/channelHistory', {
        channel_id: channel_id
    }, function (dataList) {
        var dataList = dataList.data;
        Highcharts.setOptions({global: {useUTC: true}});
        $('#container').highcharts('StockChart', {
            credits: false,

            yAxis: [{  //这里注意了  配置双Y轴的这里要看好了  这里的值是一个数组
                min: 0,
                title: {  //左边y轴的标题
                    text: 'QS/QC'
                }
                , opposite: false
            }, {
                title: {  //这是第二天Y轴在右边
                    text: '观看人数'
                },
                labels: {
                    formatter: function () {//在labels里可以配置formatter属性可以对y轴设置单位之类的个性化东西
                        return this.value;//可以对照上面图表
                    }
                },
                opposite: true//这个属性的作用是说 是否与第一条y轴相反 当然是true咯
            }],
            title: {
                text: '观看人数和频道质量'
            },
            scrollbar: {
                barBorderRadius: 10
            },
            series: [
                {
                    turboThreshold: 0,
                    type: 'spline',
                    name: '观看人数',
                    yAxis: 1,
                    data: dataList[0]
                },
                {
                    turboThreshold: 0,
                    type: 'spline',
                    name: 'QC',
                    yAxis: 0,
                    data: dataList[2]
                },
                {
                    turboThreshold: 0,
                    type: 'spline',
                    name: 'QS',
                    yAxis: 0,
                    data: dataList[1]
                }
            ]
        });
    });
}


/*频道列表模糊查询*/
function channelSearch() {
    var keyWord = $("#keyWord").val().trim();
    keyWord = keyWord.toUpperCase();
    reset();
    if (keyWord) {
        $("#channelTable>tbody>tr").each(function () {
            $(this).find("input[name ='channel_name']").each(function () {
                var vn = $(this).val();
                vn = vn.toUpperCase();
                if (vn.indexOf(keyWord) == -1) {
                    $(this).parents("tr").hide();
                }
            });
        });
    }
}

/*清空数据*/
function reset() {
    $("#channelTable>tbody>tr").each(function () {
        $(this).find("input[name ='channel_name']").each(function () {
            $(this).parents("tr").show();
        });
    });
}