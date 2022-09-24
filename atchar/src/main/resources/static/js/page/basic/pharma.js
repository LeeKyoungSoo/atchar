let Pharma = {
    init : function () {
        Pharma.config();
        Pharma.button_init();
        Pharma.dataTableIni();
        Pharma.goDataList();
    },

    config : function () {
        $("#creBtnView").hide();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Pharma.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Pharma.ViewDataInt();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            $("#phacd").val(Pharma.createKey());
            if ( Pharma.validation()) {
                Pharma.goDataEdit('I');
            }

            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Pharma.validation()) {
                Pharma.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Pharma.deleteConfirm();
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Pharma.downloadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/basic/pharmaApi/dataListExcel';
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
                    'targets': [2],
                    'className': 'alCenter',
                },
            ],
            responsive: true,
            bInfo: false,
            lengthMenu: [20, 40, 60, 80]
        });

        $('#dataTable tbody').on('click', 'tr', function () {
            let data = $('#dataTable').DataTable().row(this).data();
            $("#dataTable tr").not(this).removeClass('selected');
            $(this).addClass('selected');
            console.log(data);
            Pharma.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#phacd").val(data[0]);
        $("#phanm").val(data[1]);
        $("#useYn").val(data[2]).prop("selected", true);
        $("#phacdView").html(data[0]);
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#phacd").val("");
        $("#phanm").val("");
        $("#useYn option:eq('')").prop("selected", true);
        $("#phacdView").empty();
    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/pharmaApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].phacd,
                        rowData[key].phanm,
                        rowData[key].useYn,
                    ]).draw(false);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goDataEdit : function (gubun) {
        let param = $("form[name=dataFrm]").serialize();
        let message = "";
        if ( gubun == 'I' ) {
            message = "등록 되었습니다. ";
        }
        else {
            message = "수정 되었습니다. ";
        }

        $.ajax({
            url: '/basic/pharmaApi/dataEdit',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                if ( gubun == 'I' ) {
                    Pharma.ViewDataInt();
                }
                Pharma.goDataList();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goDataDelete : function () {
        let param = $("form[name=dataFrm]").serialize();
        let message = "삭제 되었습니다.";
        $.ajax({
            url: '/basic/pharmaApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Pharma.ViewDataInt();
                Pharma.goDataList();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    deleteConfirm : function () {
        modal({
            type: 'confirm',
            title: '주의',
            text: '삭제 하시겠습니까?',
            callback: function (result) {
                if ( result ) {
                    Pharma.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "ph" + Util.getToday();
    },

    validation : function () {
        if ( $("#phanm").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '제약사명을 입력해 주십시오.'
            });
            $("#phanm").focus();
            return false;
        }

        return true;
    },
}