// $('[type=hidden]').each(function(i, e) { 
//     var $e = $(e); var id = $e.attr('id');
//     (id && id.indexOf('answer') != -1) ? console.log(id.match(/\d+$/g)[0] + ' ' + $e.val()): ''; 
// })


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

$.ajax({
    cache: true,
    type: "POST",
    url: '/question/Post/Answer?token=636431455604115902',
    data: $('#surveyform').serialize(), // 你的formid
    async: false,
    error: function(request) {
        alert("Connection error");
        ////console.log(request);
    },
    success: function(res) {
        ////console.log(res);
        if (res.status == "success") {
            window.location.href = '/question/mobile/result';
        }
    }
});