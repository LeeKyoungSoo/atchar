let Incoming = {
    init : function () {
        Incoming.config();
        Incoming.button_init();
        Incoming.ViewDataInt();
        Incoming.dataTableIni();
        Incoming.goDataList();
        $("#incomcd").val(Incoming.createKey());
    },

    config : function () {
        $("#stdt").datepicker('setDate', '-3M');
        $("#endt").datepicker('setDate', 'today');
        Incoming.goZipList("areasicd","", "");
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Incoming.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Incoming.ViewDataInt();
            $("#incomcd").val(Incoming.createKey());
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            // $("#incomcd").val(Incoming.createKey());
            if ( Incoming.validation()) {
                Incoming.goDataEdit('I');
            }
            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Incoming.validation()) {
                Incoming.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Incoming.deleteConfirm();
            return false;
        });

        $("#areasicd").on("change", function(ev) {
            $("#areasinm").val($("#areasicd option:checked").text());
            Incoming.goZipList("areagucd", $("#areasicd").val(), "");
        });

        $("#areagucd").on("change", function(ev) {
            $("#areagunm").val($("#areagucd option:checked").text());
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
                    "targets": [7,10,11, 12, 13],
                    "visible": false,
                    "searchable": false
                },
                {
                    'targets': [0,2,4],
                    'className': 'alCenter',
                },
                {
                    'targets': [6],
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
            //console.log(data);
            Incoming.ViewData(data);
            Incoming.fileListView(data);
        });

        $("#excelBtn").on("click", function(ev) {
            Incoming.downloadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/incom/etcItemApi/dataListExcel';
        let f = document.dataFrm;
        f.action = url;
        f.submit();
    },

    fileListView : function(data) {
        $("#f_bId").val(data[0]);
        let param = $("form[name=dataFileForm]").serialize();
        $.ajax({
            url: '/fileUpDownApi/fileUploadList',
            type: 'post',
            data: param,
            success: function (data) {
                $("#file").val("");
                FileListTable(data.fileList);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#incomcd").val(data[0]);
        $("#itemnm").val(data[1]);
        $("#areasinm").val(data[2]);
        $("#areagunm").val(data[4]);
        Incoming.goZipList("areasicd","", data[3]);
        Incoming.goZipList("areagucd", data[3], data[5]);

        $("#price").val(data[6]);
        $("#memo").val(data[7]);

        $("#regid").html(data[8]);
        $("#regdt").html(data[9]);
        $("#modid").html(data[10]);
        $("#moddt").html(data[11]);

        $("#itgu").val(data[13]);
        $("#mdopenyn").val(data[14]);
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#incomcd").val("");
        $("#itemnm").val("");
        $("#areasinm").val("");
        $("#areasicd option:eq('')").prop("selected", true);
        $("#areagunm").val("");
        $("#areagucd").empty();

        $("#price").val("");
        $("#memo").val("");

        $("#regid").html("");
        $("#regdt").html("");
        $("#modid").html("");
        $("#moddt").html("");

        $("#itgu").val('R');
        $("#mdopenyn").val('Y');
    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/etcItemApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].incomcd,
                        rowData[key].itemnm,
                        rowData[key].areasinm,
                        rowData[key].areasicd,
                        rowData[key].areagunm,
                        rowData[key].areagucd,
                        rowData[key].price,
                        rowData[key].memo,
                        rowData[key].regid,
                        rowData[key].regdt,
                        rowData[key].modid,
                        rowData[key].moddt,
                        rowData[key].useyn,
                        rowData[key].itgu,
                        rowData[key].mdopenyn
                    ]).draw(false);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goCodeList : function (prtId, mstCd, useYn, choiseValue) {
        $("#s_mstCd").val(mstCd);
        $("#s_useYn").val(useYn);
        let param = $("form[name=codeSch]").serialize();
        $.ajax({
            url: '/etcmng/comcodeApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                let rowData = data.dataList;
                $("#" + prtId).empty();
                $("#" + prtId).append("<option value='" +  "" + "'>" + "선택" + "</option>");
                $.each(rowData, function (key) {
                    $("#" + prtId).append("<option value='" +  rowData[key].comCd + "'>" + rowData[key].comNm + "</option>");
                });

                if ( choiseValue != "" ) {
                    $("#" + prtId).val(choiseValue);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goZipList : function (prtId, mstCd, choiseValue) {
        $("#si").val(mstCd);
        let param = $("form[name=zipSch]").serialize();
        $.ajax({
            url: '/etcmng/comcodeApi/sidoList',
            type: 'post',
            data: param,
            success: function (data) {
                let rowData = data.dataList;
                $("#" + prtId).empty();
                $("#" + prtId).append("<option value='" +  "" + "'>" + "선택" + "</option>");
                $.each(rowData, function (key) {
                    if ( mstCd == "" ) {
                        $("#" + prtId).append("<option value='" +  rowData[key].si + "'>" + rowData[key].si + "</option>");
                    } else {
                        $("#" + prtId).append("<option value='" +  rowData[key].gu + "'>" + rowData[key].gu + "</option>");
                    }
                });

                if ( choiseValue != "" ) {
                    $("#" + prtId).val(choiseValue);
                }
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
            url: '/incom/etcItemApi/dataEdit',
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
                    Incoming.ViewDataInt();
                }
                Incoming.goDataList();
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
            url: '/incom/etcItemApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Incoming.ViewDataInt();
                Incoming.goDataList();
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
                    Incoming.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "TC" + Util.getToday();
    },

    validation : function () {

        if ( $("#itemnm").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '품명을 입력해 주십시오.'
            });
            $("#itemnm").focus();
            return false;
        }

        return true;
    },
}