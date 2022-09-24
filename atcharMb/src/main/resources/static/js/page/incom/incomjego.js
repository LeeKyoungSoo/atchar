let Incomjego = {
    init : function () {
        Incomjego.config();
        Incomjego.button_init();
        Incomjego.ViewDataInt();
        Incomjego.dataTableIni();
        Incomjego.goDataList();
        Common.goPharmaList();
    },

    config : function () {
        $("#stdt").datepicker('setDate', '-3M');
        $("#endt").datepicker('setDate', 'today');
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Incomjego.goDataList();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            Incomjego.subChkDataExcContinue('rel');
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Incomjego.subChkDataExcContinue('abr');
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Incomjego.downloadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/incom/incomingApi/dataListJegoExcel';
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
                    "targets": [9],
                    "visible": false,
                    "searchable": false
                },
                {
                    'targets': [7,8],
                    'className': 'alCenter',
                },
                {
                    'targets': [3,6],
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
            Incomjego.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#iclass").val(data[0]);
        $("#ingcd").val(data[1]);
        $("#ingnm").val(data[2]);
        $("#phanm").val(data[4]);
        $("#prdnm").val(data[5]);
        Incomjego.goIncomDataList();
    },

    ViewDataInt : function () {

    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/incomingApi/jegodataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].iclass,
                        rowData[key].ingcd,
                        rowData[key].ingnm,
                        rowData[key].capacity,
                        rowData[key].phanm,
                        rowData[key].prdnm,
                        rowData[key].nowcnt,
                        rowData[key].reldt,
                        rowData[key].incdt,
                        rowData[key].phacd,     //9
                    ]).draw(false);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goIncomDataList : function () {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/incomingApi/incomDataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                $("#incomingList>tbody").empty();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $('<tr>\n' +
                        '<td class="tdTextCenter"><input type="checkbox" name="incomcdChk" value="' + rowData[key].incomcd + '"></td>\n' +
                        '<td class="tdTextCenter">' + rowData[key].expdt + '</td>\n' +
                        '<td class="tdTextCenter">' + rowData[key].phanm + '</td>\n' +
                        '<td class="tdTextCenter">' + rowData[key].prdnm + '</td>\n' +
                        '<td class="tdTextCenter">' + rowData[key].regdt + '</td>\n' +
                        '<td class="tdTextRight">' + rowData[key].incomstd + '</td>\n' +
                        '<td class="tdTextRight">' + rowData[key].incomcnt + '</td>\n' +
                        '<td class="tdTextRight">' + rowData[key].incomstdcnt + '</td>\n' +
                        '<td class="tdTextRight">' + rowData[key].nowcnt + '</td>\n' +
                        '<td class="tdTextCenter">' +
                        '   <input type="hidden" name="phacdChk" value="' + rowData[key].phacd + '">' +
                        '   <input type="hidden" name="prdnmChk" value="' + rowData[key].prdnm + '">' +
                        '   <input type="hidden" name="nowcnt" value="' + rowData[key].nowcnt + '">' +
                        '   <input type="input" class="input_h_w_60" name="minuscnt" value="">' +
                        '</td>\n' +
                        '</tr>');
                    $("#incomingList>tbody").append(option);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    subChkDataExcContinue : function (gubun) {
        let message = "";
        if ( gubun == "abr") {
            message = "체크된 상품을 폐기처분 하시겠습니까?<br>폐기처분은 남은 제고량을 모두 폐기합니다.";
        } else {
            message = "체크된 데이터를 출고 처리 합니다.";
        }
        modal({
            type: 'confirm',
            title: '주의',
            text: message,
            callback: function (result) {
                if ( result ) {
                    Incomjego.subChkDataExc(gubun);
                }
            }
        })
    },

    subChkDataExc : function (gubun) {
        let bDataExc = true;

        let incomcdChk = $("input[name=incomcdChk]");
        let nowcnt = $("input[name=nowcnt]");
        let minuscnt;
        if ( gubun == "abr") {
            minuscnt = $("input[name=nowcnt]");
        } else {
            minuscnt = $("input[name=minuscnt]");
        }
        let phacdChk = $("input[name=phacdChk]");
        let prdnmChk = $("input[name=prdnmChk]");

        let chk_incomcd = [];
        let chk_iscnt = [];
        let chk_phacd = [];
        let chk_prdnm = [];

        for( let i = 0; i < incomcdChk.length; i++ ) {
            if( incomcdChk[i].checked == true ) {

                if ( gubun != "abr") {
                    if (minuscnt[i].value == "") {
                        modal({
                            type: 'error',
                            title: 'error',
                            text: '입력된 수량이 없습니다'
                        });
                        bDataExc = false;
                        break;
                    }

                    if (Number(nowcnt[i].value.trim()) < Number(minuscnt[i].value.trim())) {
                        modal({
                            type: 'error',
                            title: 'error',
                            text: '재고수량보다 값이 큽니다.'
                        });
                        bDataExc = false;
                        break;
                    }
                }
                chk_incomcd.push(incomcdChk[i].value.trim());
                chk_iscnt.push(minuscnt[i].value.trim());
                chk_phacd.push(phacdChk[i].value.trim());
                chk_prdnm.push(prdnmChk[i].value.trim());
            }
        }
        $("#incomcd").val(chk_incomcd);
        $("#iscnt").val(chk_iscnt);
        $("#phacd").val(chk_phacd);
        $("#prdnm").val(chk_prdnm);

        if (bDataExc) {
            if ( chk_incomcd.length < 1 ) {
                modal({
                    type: 'error',
                    title: 'error',
                    text: '처리할 항목이 없습니다.'
                });
            } else {
                Incomjego.gChkDataExc(gubun);
            }
        }
    },

    gChkDataExc : function (gubun) {
        let param = $("form[name=dataFrm]").serialize();
        let message = "";
        let goUrl = "";
        if ( gubun == "abr") {
            message = "폐기처리 되었습니다. ";
            goUrl = "/incom/abrogationApi/dataEdit";
        } else {
            message = "출고처리 되었습니다. ";
            goUrl = "/incom/releaseApi/dataEdit";
        }

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
                $("#incomingList>tbody").empty();
                Incomjego.goDataList();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
}