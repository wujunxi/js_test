// $('[type=hidden]').each(function(i, e) { 
//     var $e = $(e); var id = $e.attr('id');
//     (id && id.indexOf('answer') != -1) ? console.log(id.match(/\d+$/g)[0] + ' ' + $e.val()): ''; 
// })

(function() {
    // 复制答案
    $('[type=hidden]').each(function(i, e) {
        var $e = $(e);
        var id = $e.attr('id');
        var index, answer;
        if (id && id.indexOf('answer') != -1) {
            index = id.match(/\d+$/g)[0];
            answer = $e.val();
            var $p = $e.closest('#t' + index);
            answer.split(',').forEach(function(item) {
                var selectStr = '[name=q' + index + '][value=' + item + ']';
                var $elem = $(selectStr, $p).prop('checked', true)
            });
        }
    })
    // 获取token
    var token = '';
    $('script').each(function(i, e) {
        var str = $(e).html();
        if (str) {
            var temp = str.match(/token=(\d+)/);
            token = temp ? temp[1] : '';
        }
    })
    // 提交结果
    $.ajax({
        cache: true,
        type: "POST",
        url: '/question/Post/Answer?token='+token,
        data: $('#surveyform').serialize(), 
        async: false,
        error: function(request) {
            alert("Connection error");
        },
        success: function(res) {
            if (res.status == "success") {
                window.location.href = '/question/mobile/result';
            }
        }
    });

})();