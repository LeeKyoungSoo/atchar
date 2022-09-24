let Common = {
    goPharmaList : function () {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/pharmaApi/pharmaList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].phacd + "'>" + rowData[key].phanm + "</option>");
                    $('#s_phacd').append(option);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goBoardView : function (bbsCd, viewId) {
        $.ajax({
            url:'/bbsApi/bbsDataView',
            type: 'post',
            data: {
                bId : bbsCd
            },
            success: function (data) {
               console.log(data.dataView.cont);
                $("#" + viewId).empty();
                $("#" + viewId).html(data.dataView.cont);
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
}