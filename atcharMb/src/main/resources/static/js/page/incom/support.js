let Support = {
    init : function () {
        Support.config();
        Support.button_init();
        Support.ViewDataInt();
        Support.dataTableIni();
        Support.goCodeList("cc211029164218");
        Support.goCodeList("cc211029165813");
        Support.goIclassList();
        Support.goDataList();
        Common.goPharmaList();
    },

    config : function () {
        $("#creBtnView").hide();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Support.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Support.ViewDataInt();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            $("#supcd").val(Support.createKey());
            if ( Support.validation()) {
                Support.goDataEdit('I');
            }

            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Support.validation()) {
                Support.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Support.deleteConfirm();
            return false;
        });

        $("#iclass").on("change", function(ev) {
            Support.goIngcdList();
            return false;
        });

        $("#ingcd").on("change", function(ev) {
            Support.goIngnmList();
            return false;
        });

        $("#ingnm").on("change", function(ev) {
            Support.goPhacdList();
            return false;
        });

        $("#phacd").on("change", function(ev) {
            Support.goPrdnmList();
            return false;
        });

        $("#prdnm").on("change", function(ev) {
            Support.goJangoCount();
            return false;
        });

        $("#decbtn").on("click", function(ev) {
            Support.goIncomingView();
            return false;
        });

        $("#incomClosebtn").on("click", function(ev) {
            $("#adMoniModal").hide();
            return false;
        });

        $("#decyn").on("change", function(ev) {
            if ($("#decyn").val() == "Y" ) {
                $("#decbtn").show();
            } else {
                $("#decbtn").hide();
            }
            return false;
        });

        $("#incomAddbtn").on("click", function(ev) {
            Support.IncomRowAdd();
            return false;
        });

        $("#incomSaveBtn").on("click", function(ev) {
            Support.IncomRowSave();
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Support.downloadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/incom/supportApi/dataListExcel';
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
                    "targets": [10,11,12,13,14],
                    "visible": false,
                    "searchable": false
                },
                {
                    'targets': [0,9],
                    'className': 'alCenter',
                },
                {
                    'targets': [3,6,7,8],
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
            Support.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $('#supcd').val(data[10]);
        $('#supcdView').html(data[10]);
        $("#gubun").val(data[11]).prop("selected", true);
        $("#iclass").val(data[12]).prop("selected", true);

        $('#ingcd').empty();
        $('#ingnm').empty();
        $('#phacd').empty();
        $('#prdnm').empty();
        $("#ingcd").append("<option value='" + data[1] + "'>" + data[1] + "</option>");
        $("#ingnm").append("<option value='" + data[2] + "'>" + data[2] + "</option>");
        $("#phacd").append("<option value='" + data[13] + "'>" + data[4] + "</option>");
        $("#prdnm").append("<option value='" + data[5] + "'>" + data[5] + "</option>");

        $('#jango').val(data[6]);
        $('#reqcnt').val(data[7]);
        $('#deccnt').val(data[8]);
        $("#decyn").val(data[14]).prop("selected", true);

        $("#jango").attr("readonly", true);
        $("#deccnt").attr("readonly", true);

        if ( data[9] == "Y" ) {
            $("#delBtnView").hide();
            $("#decbtn").show();
        }
        else {
            Support.goIngcdList(data[1]);
            Support.goIngnmList(data[2]);
            Support.goPhacdList(data[13]);
            Support.goPrdnmList(data[5]);
            $("#decbtn").hide();
        }
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $('#supcd').val("");
        $('#supcdView').html("");

        $("#gubun option:eq('')").prop("selected", true);
        $("#iclass option:eq('')").prop("selected", true);

        $('#ingcd').empty();
        $('#ingnm').empty();
        $('#phacd').empty();
        $('#prdnm').empty();
        $("#ingcd").append("<option value=\"\">==선택==</option>");
        $("#ingnm").append("<option value=\"\">==선택==</option>");
        $("#phacd").append("<option value=\"\">==선택==</option>");
        $("#prdnm").append("<option value=\"\">==선택==</option>");
        $("#ingcd option:eq('')").prop("selected", true);
        $("#ingnm option:eq('')").prop("selected", true);
        $("#phacd option:eq('')").prop("selected", true);
        $("#prdnm option:eq('')").prop("selected", true);

        $('#jango').val("0");
        $('#reqcnt').val("0");
        $('#deccnt').val("0");
        $("#decyn option:eq('N')").prop("selected", true);
        $("#decbtn").hide();

        $("#deccnt").attr("readonly", true);
        $("#decyn").attr("readonly", true);
    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/supportApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let state = "";
                    if ( rowData[key].decyn == "Y") {
                        state = "입고";
                    } else {
                        state =  "신청";
                    }
                    tableGrid.row.add([
                        rowData[key].regdt,
                        rowData[key].ingcd,
                        rowData[key].ingnm,
                        rowData[key].capacity,
                        rowData[key].phanm,
                        rowData[key].prdnm,
                        rowData[key].jango,
                        rowData[key].reqcnt,
                        rowData[key].deccnt,
                        state,
                        rowData[key].supcd,
                        rowData[key].gubun,
                        rowData[key].iclass,
                        rowData[key].phacd,
                        rowData[key].decyn,
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
            url: '/incom/supportApi/dataEdit',
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
                    Support.ViewDataInt();
                }
                Support.goDataList();
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
            url: '/incom/supportApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Support.ViewDataInt();
                Support.goDataList();
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
                    Support.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "cc" + Util.getToday();
    },

    validation : function () {
        if ( $("#prdnm").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '상품명을 입력해 주십시오.'
            });
            $("#prdnm").focus();
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
        return true;
    },

    goCodeList : function (code) {
        $("#s_mstCd").val(code);
        let param = $("form[name=codeFrm]").serialize();
        $.ajax({
            url: '/etcmng/comcodeApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].comCd + "'>" + rowData[key].comNm + "</option>");
                    let option2 = $("<option value='" + rowData[key].comCd + "'>" + rowData[key].comNm + "</option>");
                    if ( code == "cc211029164218" ) {
                        $('#gubun').append(option);
                        $('#s_gubun').append(option2);
                    }
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goIclassList : function () {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/iclassList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].iclass + "'>" + rowData[key].iclass + "</option>");
                    $('#iclass').append(option);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goIngcdList : function (ingcdVal) {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/ingcdList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#ingcd').empty();
                $('#ingnm').empty();
                $('#phacd').empty();
                $('#prdnm').empty();
                $("#ingcd").append("<option value=\"\">==선택==</option>");
                $("#ingnm").append("<option value=\"\">==선택==</option>");
                $("#phacd").append("<option value=\"\">==선택==</option>");
                $("#prdnm").append("<option value=\"\">==선택==</option>");
                $('#jango').val("0");
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].ingcd + "'>" + rowData[key].ingcd + "</option>");
                    $('#ingcd').append(option);
                });

                if ( ingcdVal != null && ingcdVal != "" ) {
                    $("#ingcd").val(ingcdVal).prop("selected", true);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goIngnmList : function (ingnmVal) {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/ingnmList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#ingnm').empty();
                $('#phacd').empty();
                $('#prdnm').empty();
                $("#ingnm").append("<option value=\"\">==선택==</option>");
                $("#phacd").append("<option value=\"\">==선택==</option>");
                $("#prdnm").append("<option value=\"\">==선택==</option>");
                $('#jango').val("0");
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].ingnm + "'>" + rowData[key].ingnm + "</option>");
                    $('#ingnm').append(option);
                });

                if ( ingnmVal != null && ingnmVal != "" ) {
                    $("#ingnm").val(ingnmVal).prop("selected", true);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goPhacdList : function (phacdVal) {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/phacdList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#phacd').empty();
                $('#prdnm').empty();
                $("#phacd").append("<option value=\"\">==선택==</option>");
                $("#prdnm").append("<option value=\"\">==선택==</option>");
                $('#jango').val("0");
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].phacd + "'>" + rowData[key].phanm + "</option>");
                    $('#phacd').append(option);
                });

                if ( phacdVal != null && phacdVal != "" ) {
                    $("#phacd").val(phacdVal).prop("selected", true);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goPrdnmList : function (prdnmVal) {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/prdnmList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#prdnm').empty();
                $("#prdnm").append("<option value=\"\">==선택==</option>");
                $('#jango').val("0");
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].prdnm + "'>" + rowData[key].prdnm + "</option>");
                    $('#prdnm').append(option);
                });

                if ( prdnmVal != null && prdnmVal != "" ) {
                    $("#prdnm").val(prdnmVal).prop("selected", true);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goJangoCount : function (prdnmVal) {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/incomingApi/jegoDataView',
            type: 'post',
            data: param,
            success: function (data) {
                let rowData = data.dataView;
                $('#jango').val(rowData.nowcnt);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goIncomingView : function()  {
        $("#adMoniModal").show();
        if ( $("#supcd").val() != "" ) {
            Support.IncomRowList();
        }
    },

    IncomRowAdd : function()  {
        let key = $("input[name=incomstd]").length;
        let option = $('<tr><td class="tdTextCenter"><input type="hidden" name="incomcd" value=" "/>' +
            '<input class="input_h" type="text" name="expdt" value=" "/></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="incomstd_'+key+'" name="incomstd" onchange="Support.cntInput('+key+');" value="0"/></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="incomcnt_'+key+'" name="incomcnt" onchange="Support.cntInput('+key+');" value="0"/></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="incomstdcnt_'+key+'" name="incomstdcnt" value="0"/></td></tr>');
        $("#incomingAddList>tbody").append(option);
    },

    IncomRowList : function()  {
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/incom/incomingApi/incomingSupCdList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                $("#incomingAddList>tbody").empty();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $('<tr><td class="tdTextCenter"><input type="hidden" name="incomcd" value="' + rowData[key].incomcd + '"/>' +
                        '<input class="input_h" type="text" name="expdt" value="' + rowData[key].expdt + '"/></td>' +
                        '<td class="tdTextCenter"><input class="input_h" type="text" id="incomstd_'+key+'" name="incomstd" value="' + rowData[key].incomstd + '" onchange="Support.cntInput('+key+');"/></td>' +
                        '<td class="tdTextCenter"><input class="input_h" type="text" id="incomcnt_'+key+'" name="incomcnt" value="' + rowData[key].incomcnt + '" onchange="Support.cntInput('+key+');"/></td>' +
                        '<td class="tdTextCenter"><input class="input_h_gray" type="text" id="incomstdcnt_'+key+'" name="incomstdcnt" value="' + rowData[key].incomstdcnt + '" readonly/></td></tr>');
                    $("#incomingAddList>tbody").append(option);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    IncomRowSave : function()  {
        let param = $("form[name=dataFrm]").serialize();
        let message = "등록 되었습니다. ";
        $.ajax({
            url: '/incom/incomingApi/dataEdit',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                $("#deccnt").val(data.incomCount);
                $("#adMoniModal").hide();
                Support.goDataList();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    cntInput : function (key) {
        let a = $("#incomstd_" + key).val();
        let b = $("#incomcnt_" + key).val();
        $("#incomstdcnt_" + key).val(a * b);
    },
}