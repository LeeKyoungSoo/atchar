let Comcode = {
    init : function () {
        Comcode.config();
        Comcode.button_init();
        Comcode.dataTableIni();
        //Comcode.goDataList();
    },

    config : function () {
        $("#creBtnView").hide();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Comcode.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Comcode.ViewDataInt();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            $("#comCd").val(Comcode.createKey());
            if ( Comcode.validation()) {
                Comcode.goDataEdit('I');
            }

            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Comcode.validation()) {
                Comcode.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Comcode.deleteConfirm();
            return false;
        });

        $("#comCdSubView").on("click", function(ev) {
            $("#s_mstCd").val($("#comCd").val());
            Comcode.goDataList();
            return false;
        });

        $("#comCdAdd").on("click", function(ev) {
            Comcode.ViewDataInt($("#comCd").val());
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
                    'targets': [0, 2,4],
                    'className': 'alCenter',
                },
                {
                    'targets': [3],
                    'className': 'alRight',
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
            Comcode.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#comCd").val(data[0]);
        $("#comNm").val(data[1]);
        $("#mstCd").val(data[2]);
        $("#odNo").val(data[3]);
        $("#useYn").val(data[4]).prop("selected", true);
        $("#comCdView").html(data[0]);

        //$("#mstCd").attr("readonly", true);
    },

    ViewDataInt : function (mstCd) {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#comCd").val("");
        $("#comNm").val("");

        if ( mstCd != null && mstCd != "" ) {
            $("#mstCd").val(mstCd);
        } else {
            $("#mstCd").val("");
        }
        $("#odNo").val("");
        $("#useYn option:eq('')").prop("selected", true);
        $("#comCdView").empty();

        $("#mstCd").attr("readonly", false);
    },

    goDataList : function () {
        if ( $("#s_mstCd").val() == "" && $("#s_comNm").val() == ""
            && $("#s_comCd").val() == "" ) {
            $("#s_mstCd").val(" ");
        }

        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/etcmng/comcodeApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].comCd,
                        rowData[key].comNm,
                        rowData[key].mstCd,
                        rowData[key].odNo,
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
            url: '/etcmng/comcodeApi/dataEdit',
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
                    Comcode.ViewDataInt();
                }
                Comcode.goDataList();
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
            url: '/etcmng/comcodeApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Comcode.ViewDataInt();
                Comcode.goDataList();
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
                    Comcode.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "CC" + Util.getToday();
    },

    validation : function () {
        if ( $("#comNm").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '코드명을 입력해 주십시오.'
            });
            $("#comNm").focus();
            return false;
        }

        if ( $("#odNo").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '우선순위를 입력해 주십시오.'
            });
            $("#odNo").focus();
            return false;
        }

        if ( $("#mstCd").val() == "" ) {
            $("#mstCd").val(" ");
        }
        return true;
    },
}