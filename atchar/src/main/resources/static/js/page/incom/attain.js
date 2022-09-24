let Attain = {
    init : function () {
        Attain.config();
        Attain.button_init();
        Attain.ViewDataInt();
        Attain.dataTableIni();
        Attain.goDataList();
    },

    config : function () {

        return false;
    },

    button_init : function () {
        $('#select_all').on('click', function(){
            let rows = $('#dataTable').DataTable().rows({ 'search': 'applied' }).nodes();
            $('input[type="checkbox"]', rows).prop('checked', this.checked);
        });

        $("#searchBtn").on("click", function(ev) {
            Attain.goDataList();
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Attain.downloadExcel();
            return false;
        });

        $("#huwonBtn").on("click", function(ev) {
            Attain.suppertDataRead(1);
            return false;
        });

        $("#gumaeBtn").on("click", function(ev) {
            Attain.suppertDataRead(2);
            return false;
        });

        $("#incomClosebtn").on("click", function(ev) {
            $("#adMoniModal").hide();
            return false;
        });

        $("#incomSaveBtn").on("click", function(ev) {
            Attain.IncomRowSave();
            return false;
        });
    },

    suppertDataRead : function (code) {
        let chk_iclass = [];
        $("#incomingAddList>tbody").empty();
        $('#dataTable').DataTable().$('input[type="checkbox"]').each(function(){
            if ( this.checked ) {
                let data = $('#dataTable').DataTable().row($(this).parents("tr")).data();
                console.log(data);
                chk_iclass.push(data[0]);
                Attain.IncomRowAdd(data[1], data[2], data[3], data[4]);
            }
        });

        if ( chk_iclass.length < 1 ) {
            modal({
                type: 'error',
                title: 'error',
                text: '처리할 항목이 없습니다.'
            });
        } else {
            Attain.goIncomingView(code);
        }
        return false;
    },

    IncomRowAdd : function(iclass, ingcd, ingnm, capacity)  {
        let key = $("input[name=sp_iclass]").length;
        let option = $('<tr>' +
            '<td class="tdTextCenter"><input type="hidden" id="sp_supcd'+key+'" name="sp_supcd" value=""/>' +
            '                         <input class="input_h" type="text" id="sp_iclass'+key+'" name="sp_iclass" value="' + iclass + '"/></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="sp_ingcd'+key+'" name="sp_ingcd" value="' + ingcd + '"/></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="sp_ingnm'+key+'" name="sp_ingnm" value="' + ingnm + '"/></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="sp_capacity'+key+'" name="sp_capacity" value="' + capacity + '"/></td>' +
            '<td class="tdTextCenter"><select class="input_h_w_100" id="sp_phacd'+key+'" name="sp_phacd" onchange="Attain.goPrdnmList('+key+');"></select></td>' +
            '<td class="tdTextCenter"><select class="input_h_w_100" id="sp_prdnm'+key+'" name="sp_prdnm" onchange="Attain.goJangoCount('+key+');"></select></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="sp_jango'+key+'" name="sp_jango" value="0"  style="text-align: right" /></td>' +
            '<td class="tdTextCenter"><input class="input_h" type="text" id="sp_reqcnt'+key+'" name="sp_reqcnt" value="0" style="text-align: right" /></td>' +
            '</tr>');
        $("#incomingAddList>tbody").append(option);

        Attain.goPhacdList(iclass, ingcd, ingnm, key);
    },

    IncomRowSave : function()  {
        let key = $("input[name=sp_iclass]").length;
        for ( let code = 0; code < key; code++) {
            $("#supcd").val($("#sp_supcd" + code).val());
            $("#iclass").val($("#sp_iclass" + code).val());
            $("#ingcd").val($("#sp_ingcd" + code).val());
            $("#ingnm").val($("#sp_ingnm" + code).val());
            $("#phacd").val($("#sp_phacd" + code).val());
            $("#prdnm").val($("#sp_prdnm" + code).val());
            $("#jango").val($("#sp_jango" + code).val());
            $("#reqcnt").val($("#sp_reqcnt" + code).val());

            if ($("#gubun").val() == "") {
                modal({
                    type: 'error',
                    title: 'error',
                    text: "신청에 대한 구분이 없습니다."
                });
                return;
            }

            if ($("#phacd").val() == "") {
                modal({
                    type: 'error',
                    title: 'error',
                    text: "재약사를 선택해 주십시오."
                });
                return;
            }

            if ($("#prdnm").val() == "") {
                modal({
                    type: 'error',
                    title: 'error',
                    text: "상품명을 선택해 주십시오."
                });
                return;
            }

            if ($("#reqcnt").val() == "0") {
                modal({
                    type: 'error',
                    title: 'error',
                    text: "신청수량을 입력해 주십시오."
                });
                return;
            }
        }

        for ( let code = 0; code < key; code++) {
            $("#supcd").val($("#sp_supcd" + code).val());
            $("#iclass").val($("#sp_iclass" + code).val());
            $("#ingcd").val($("#sp_ingcd" + code).val());
            $("#ingnm").val($("#sp_ingnm" + code).val());
            $("#phacd").val($("#sp_phacd" + code).val());
            $("#prdnm").val($("#sp_prdnm" + code).val());
            $("#jango").val($("#sp_jango" + code).val());
            $("#reqcnt").val($("#sp_reqcnt" + code).val());
            let param = $("form[name=supportFrm]").serialize();
            $.ajax({
                url: '/incom/supportApi/dataEdit',
                type: 'post',
                data: param,
                async: false,
                success: function (data) {
                    console.log(data);
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }

        modal({
            type: 'success',
            title: 'Success',
            text: key + "개 항목에 대한 신청처리를 완료하였습니다."
        });

        $("#adMoniModal").hide();
        Attain.goDataList();
    },

    goJangoCount : function (code) {
        $("#iclass").val($("#sp_iclass"+code).val());
        $("#ingcd").val($("#sp_ingcd"+code).val());
        $("#ingnm").val($("#sp_ingnm"+code).val());
        $("#phacd").val($("#sp_phacd"+code).val());
        $("#prdnm").val($("#sp_prdnm"+code).val());
        let param = $("form[name=supportFrm]").serialize();
        $.ajax({
            url: '/incom/incomingApi/jegoDataView',
            type: 'post',
            data: param,
            success: function (data) {
                let rowData = data.dataView;
                if (rowData != null ) {
                    $('#sp_jango'+code).val(rowData.nowcnt);
                } else {
                    $('#sp_jango'+code).val(0);
                }
                $('#sp_supcd'+code).val(Attain.createKey());
                console.log($('#sp_supcd'+code).val());
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goPrdnmList : function (code) {
        $("#iclass").val($("#sp_iclass"+code).val());
        $("#ingcd").val($("#sp_ingcd"+code).val());
        $("#ingnm").val($("#sp_ingnm"+code).val());
        $("#phacd").val($("#sp_phacd"+code).val());
        let param = $("form[name=supportFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/prdnmList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#sp_jango'+code).val(0);

                $("#sp_prdnm"+code).empty();
                $("#sp_prdnm"+code).append("<option value=\"\">==선택==</option>");
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].prdnm + "'>" + rowData[key].prdnm + "</option>");
                    $("#sp_prdnm"+code).append(option);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goPhacdList : function (iclass, ingcd, ingnm, code) {
        $("#iclass").val(iclass);
        $("#ingcd").val(ingcd);
        $("#ingnm").val(ingnm);
        let param = $("form[name=supportFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/phacdList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#sp_jango'+code).val(0);

                $("#sp_prdnm"+code).empty();
                $("#sp_prdnm"+code).append("<option value=\"\">==선택==</option>");

                $("#sp_phacd"+code).empty();
                $("#sp_phacd"+code).append("<option value=\"\">==선택==</option>");
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    let option = $("<option value='" + rowData[key].phacd + "'>" + rowData[key].phanm + "</option>");
                    $("#sp_phacd"+code).append(option);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goIncomingView : function(code)  {
        $("#adMoniModal").show();
        if ( code == 1 ) {
            $("#gubunTxt").html("후원신청등록");
            $("#gubun").val("cc211029164238");
        } else {
            $("#gubunTxt").html("구매신청등록");
            $("#gubun").val("cc211029164247");
        }
    },

    downloadExcel : function () {
        const url = '/incom/attainApi/dataListExcel';
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
                    'targets': 0,
                    'searchable': false,
                    'orderable': false,
                    'className': 'dt-body-center alCenter',
                    'render': function (data, type, full, meta){
                        return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
                    }
                },
                {
                    'targets': [4,5,6,7,8,9],
                    'className': 'alRight',
                },
            ],
            order: [[0, 'asc']],
            responsive: true,
            bInfo: false,
            lengthMenu: [20, 40, 60, 80]
        });

        $('#dataTable tbody').on('click', 'tr', function () {
            let data = $('#dataTable').DataTable().row(this).data();
            $("#dataTable tr").not(this).removeClass('selected');
            $(this).addClass('selected');
            console.log(data);
            Attain.ViewData(data);
        });

        $('#dataTable tbody').on('change', 'input[type="checkbox"]', function(){
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
            url: '/incom/attainApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].flgpercent,
                        rowData[key].iclass,
                        rowData[key].ingcd,
                        rowData[key].ingnm,
                        rowData[key].capacity,
                        rowData[key].nowcnt,
                        rowData[key].moncnt,
                        rowData[key].flgcnt,
                        rowData[key].flgpercentval,
                        rowData[key].reqcnt,
                    ]).draw(false);
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    createKey : function () {
        return "cc" + Util.getToday();
    },
}