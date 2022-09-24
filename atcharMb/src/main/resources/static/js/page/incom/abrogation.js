let gGredRead = false;

let Abrogation = {
    init : function () {
        Abrogation.config();
        Abrogation.button_init();
        Abrogation.ViewDataInt();
        Abrogation.dataTableIni();
        Abrogation.targetTableIni();
        Abrogation.goIncomDataList();
        Common.goPharmaList();
    },

    config : function () {
        $("#stdt").datepicker('setDate', '-3M');
        $("#endt").datepicker('setDate', 'today');
        $("#t_stdt").datepicker('setDate', '-3M');
        $("#t_endt").datepicker('setDate', 'today');

        $("#abrTarget").show();
        $("#abrHistory").hide();

        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Abrogation.goDataList();
            return false;
        });

        $("#t_searchBtn").on("click", function(ev) {
            Abrogation.goIncomDataList();
            return false;
        });

        $('#select_all').on('click', function(){
            let rows = $('#targetTable').DataTable().rows({ 'search': 'applied' }).nodes();
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });

        $("#delBtn").on("click", function(ev) {
            let chk_iclass = [];
            let chk_ingcd = [];
            let chk_ingnm = [];
            let chk_incomcd = [];
            let chk_phacd = [];
            let chk_prdnm = [];
            let chk_iscnt = [];

            $('#targetTable').DataTable().$('input[type="checkbox"]').each(function(){
                if ( this.checked ) {
                    let data = $('#targetTable').DataTable().row($(this).parents("tr")).data();
                    console.log(data);
                    chk_iclass.push(data[9]);
                    chk_ingcd.push(data[10]);
                    chk_ingnm.push(data[11]);
                    chk_incomcd.push(data[0]);
                    chk_phacd.push(data[2]);
                    chk_prdnm.push(data[3]);
                    chk_iscnt.push(data[8]);
                }
            });

            $("#bigo").val($("#t_bigo").val());
            $("#iclass").val(chk_iclass);
            $("#ingcd").val(chk_ingcd);
            $("#ingnm").val(chk_ingnm);
            $("#incomcd").val(chk_incomcd);
            $("#phacd").val(chk_phacd);
            $("#prdnm").val(chk_prdnm);
            $("#iscnt").val(chk_iscnt);

            if ( chk_incomcd.length < 1 ) {
                modal({
                    type: 'error',
                    title: 'error',
                    text: '처리할 항목이 없습니다.'
                });
            } else {
                Abrogation.subChkDataExcContinue();
            }

           return false;
        });
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
                    'targets': [0, 6, 7],
                    'className': 'alCenter',
                },
                {
                    'targets': [3,8,9,10,11,12],
                    'className': 'alRight',
                },
                {
                    "targets": [14,15,16,17],
                    "visible": false,
                    "searchable": false
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
            Abrogation.ViewData(data);
        });

        $("#excelBtn").on("click", function(ev) {
            Abrogation.downloadExcel(1);
            return false;
        });

        $("#t_excelBtn").on("click", function(ev) {
            Abrogation.downloadExcel(2);
            return false;
        });
    },

    downloadExcel : function (code) {
        let url = '';
        if ( code == 1 ) { //폐기이력
            url = '/incom/abrogationApi/dataListExcel';
        } else {    //폐기처리
            url = '/incom/incomingApi/incomDataExcel';
        }

        let f = document.dataFrm;
        f.action = url;
        f.submit();
    },

    targetTableIni : function () {
        $('#targetTable').DataTable({
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
            columnDefs: [{
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'className': 'dt-body-center alCenter',
                'render': function (data, type, full, meta){
                        return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                    }
                },
                {
                    'targets': [1, 4],
                    'className': 'alCenter',
                },
                {
                    'targets': [5,6,7,8],
                    'className': 'alRight',
                },
                {
                    "targets": [9,10,11],
                    "visible": false,
                    "searchable": false
                },
            ],
            order: [[1, 'asc']],
            responsive: true,
            bInfo: false,
            lengthMenu: [20, 40, 60, 80]
        });

        $('#targetTable tbody').on('click', 'tr', function () {
            let data = $('#targetTable').DataTable().row(this).data();
            $("#targetTable tr").not(this).removeClass('selected');
            $(this).addClass('selected');
            console.log(data);

        });

        $('#targetTable tbody').on('change', 'input[type="checkbox"]', function(){
            if ( !this.checked ) {
                let el = $('#select_all').get(0);
                if ( el && el.checked && ('indeterminate' in el) ) {
                    el.indeterminate = true;
                }
            }
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
            url: '/incom/abrogationApi/dataList',
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
                        rowData[key].incomregdt,
                        rowData[key].expdt,
                        rowData[key].incomstd,
                        rowData[key].incomcnt,
                        rowData[key].incomstdcnt,
                        rowData[key].relcnt,
                        rowData[key].abrcnt,
                        rowData[key].bigo,
                        rowData[key].incomcd,   //14
                        rowData[key].supcd,
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
            Abrogation.goIncomDataList();
            $("#abrTarget").show();
            $("#abrHistory").hide();
        }
        else {
            Abrogation.goDataList();
            $("#abrTarget").hide();
            $("#abrHistory").show();
        }
    },

    goIncomDataList : function () {
        let tableGrid = $('#targetTable').DataTable();
        let param = $("form[name=targetFrm]").serialize();
        $.ajax({
            url: '/incom/incomingApi/incomDataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].incomcd,
                        rowData[key].expdt,
                        rowData[key].phanm,
                        rowData[key].prdnm,
                        rowData[key].regdt,
                        rowData[key].incomstd,
                        rowData[key].incomcnt,
                        rowData[key].incomstdcnt,
                        rowData[key].nowcnt,
                        rowData[key].iclass,
                        rowData[key].ingcd,
                        rowData[key].ingnm,
                    ]).draw(false);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    subChkDataExcContinue : function () {
        let message = "체크된 상품을 폐기처분 하시겠습니까?<br>폐기처분은 남은 제고량을 모두 폐기합니다.";

        modal({
            type: 'confirm',
            title: '주의',
            text: message,
            callback: function (result) {
                if ( result ) {
                    Abrogation.gChkDataExc();
                }
            }
        })
    },

    gChkDataExc : function () {
        let param = $("form[name=targetFrm]").serialize();
        let message = "폐기처리 되었습니다. ";
        let goUrl = "/incom/abrogationApi/dataEditAbr";

        $.ajax({
            url: goUrl,
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Abrogation.goIncomDataList();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
}