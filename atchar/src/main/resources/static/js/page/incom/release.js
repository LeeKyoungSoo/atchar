let Release = {
    init : function () {
        Release.config();
        Release.button_init();
        Release.ViewDataInt();
        Release.dataTableIni();
        Release.goDataList();
        Common.goPharmaList();
    },

    config : function () {
        $("#stdt").datepicker('setDate', '-3M');
        $("#endt").datepicker('setDate', 'today');

        $("#relDataView").show();
        $("#relExcelUploadView").hide();

        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Release.goDataList();
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Release.downloadExcel();
            return false;
        });

        $("#excelUploadBtn").on("click", function(ev) {
            Release.uploadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/incom/releaseApi/dataListExcel';
        let f = document.dataFrm;
        f.action = url;
        f.submit();
    },

    dataTableIni : function () {
        $('#dataTable').DataTable({
            scrollY: "380px",
            scrollCollapse: true,
            scrollX: false,
            // 표시 건수기능 숨기기
            lengthChange: true,
            // 검색 기능 숨기기
            searching: false,
            // 정렬 기능 숨기기
            ordering: true,
            // 정보 표시 숨기기
            info: true,
            // 페이징 기능 숨기기
            paging: true,
            columnDefs: [
                {
                    "targets": [8,9,10],
                    "visible": false,
                    "searchable": false
                },
                {
                    'targets': [0],
                    'className': 'alCenter',
                },
                {
                    'targets': [3,6],
                    'className': 'alRight',
                },
            ],
            order: [[0, 'desc']],
            responsive: true,
            bInfo: false,
            lengthMenu: [20, 40, 60, 80]
        });

        $('#dataTable tbody').on('click', 'tr', function () {
            let data = $('#dataTable').DataTable().row(this).data();
            $("#dataTable tr").not(this).removeClass('selected');
            $(this).addClass('selected');
            console.log(data);
            Release.ViewData(data);
        });

    },

    ViewData : function (data) {

    },

    ViewDataInt : function () {

    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/releaseApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].regdt,
                        rowData[key].ingcd,
                        rowData[key].ingnm,
                        rowData[key].capacity,
                        rowData[key].phanm,
                        rowData[key].prdnm,
                        rowData[key].relcnt,
                        rowData[key].bigo,
                        rowData[key].incomcd,   //9
                        rowData[key].iclass,
                        rowData[key].phacd,
                    ]).draw(false);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    tabChange : function (code) {
        if ( code == 1 ) {
            Release.goDataList();
            $("#relDataView").show();
            $("#relExcelUploadView").hide();
        }
        else {
            $("#relDataView").hide();
            $("#relExcelUploadView").show();
        }
        console.log(code);
    },

    uploadExcel : function () {
        if ( $('#excelfile')[0].files[0] == null || $('#excelfile')[0].files[0] == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: "파일이 없습니다."
            });
            return;
        }

        let param = new FormData(document.getElementById("excelFrm"));
        $.ajax({
            url: '/incom/releaseApi/dataExcelUpload',
            type:'post',
            enctype: 'multipart/form-data',
            dataType: 'json',
            data: param,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data) {
                console.log(data);
                let result = data.result;
                if ( result == "SUCCESS") {
                    modal({
                        type: 'success',
                        title: 'success',
                        text: "엑셀데이터를 이용한 출고 처리를 완려하였습니다."
                    });
                }
                else {
                    modal({
                        type: 'error',
                        title: 'error',
                        text: "처리를 완료하지 못했습니다. (엑셀데이터형식을 확인해주십시오)"
                    });
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
}