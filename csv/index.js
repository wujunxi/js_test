(function() {

    var json = [{ "sch_id": "gzsyyz", "stu_id": "3306123466", "name": "杜少甫", "gender": 1, "grade_class": "高二二班", "birthday": "2017-09-07 00:00:00", "phone": "18000000000", "def_pwd": "002bda", "state": 1, "create_time": "2017-09-26 10:31:54", "modify_time": "2017-09-26 10:31:54", "report_count": 0 }, { "sch_id": "gzyz", "stu_id": "3306123449", "name": "李清照", "gender": 0, "grade_class": "高二一班", "birthday": "2012-08-12 00:00:00", "phone": "13511234565", "def_pwd": null, "state": 1, "create_time": "2017-09-20 15:23:02", "modify_time": "2017-09-20 15:23:02", "report_count": 0 }, { "sch_id": "gzyz", "stu_id": "3306123457", "name": "李白", "gender": 0, "grade_class": "高二一班", "birthday": "2012-08-12 00:00:00", "phone": "13511234565", "def_pwd": null, "state": 1, "create_time": "2017-09-20 15:23:02", "modify_time": "2017-09-20 15:23:02", "report_count": 0 }, { "sch_id": "gzyz", "stu_id": "3306123458", "name": "杜甫", "gender": 0, "grade_class": "高二一班", "birthday": "2012-08-12 00:00:00", "phone": "13511234565", "def_pwd": null, "state": 1, "create_time": "2017-09-20 15:23:02", "modify_time": "2017-09-20 15:23:02", "report_count": 0 }, { "sch_id": "gzyz", "stu_id": "3306123459", "name": "陆游", "gender": 0, "grade_class": "高二一班", "birthday": "2012-08-12 00:00:00", "phone": "13511234565", "def_pwd": null, "state": 1, "create_time": "2017-09-20 15:23:02", "modify_time": "2017-09-20 15:23:02", "report_count": 0 }, { "sch_id": "gzyz", "stu_id": "3306123460", "name": "辛弃疾", "gender": 0, "grade_class": "高一三班", "birthday": "2010-10-10 00:00:00", "phone": "18810101011", "def_pwd": "51731f", "state": 1, "create_time": "2017-09-21 13:52:22", "modify_time": "2017-09-21 13:52:22", "report_count": 0 }];

    var name = 'test-' + new Date().getTime() + '.csv';
    
    json2csv(json, {
        stu_id: '学号',
        name: '姓名',
        def_pwd: '初始密码'
    }, name);

})();


function json2csv(array, headers, filename) {
    var k, fields = [],
        fieldTexts = [],
        content = [];
    for (k in headers) {
        fields.push(k);
        fieldTexts.push(headers[k]);
    }
    // add header text
    content.push(fieldTexts.join(','));
    var i, len, item, row = [],
        j, len2, field;
    for (i = 0, len = array.length; i < len; i++) {
        item = array[i];
        row = [];
        for (j = 0, len2 = fields.length; j < len2; j++) {
            field = fields[j];
            row.push(item[field]);
        }
        content.push(row.join(','));
    }
    var csvContent = "data:text/csv;charset=utf-8,\ufeff";
    if (window.navigator.msSaveOrOpenBlob) {
        csvContent = "\ufeff";
    }
    csvContent += content.join('\n');
    //如果是IE浏览器  
    if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
            type: "text/csv;charset=utf-8;"
        });
        navigator.msSaveBlob(blob, filename);
    } else {
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
    }
}