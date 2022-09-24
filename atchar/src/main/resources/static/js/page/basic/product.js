let Product = {
    init : function () {
        Product.config();
        Product.button_init();
        Product.dataTableIni();
        Product.goPharmaList();
        Product.goIclassList();
        Product.goDataList();
    },

    config : function () {
        $("#creBtnView").hide();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Product.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Product.ViewDataInt();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            //$("#supcd").val(Product.createKey());
            if ( Product.validation()) {
                Product.goDataEdit('I');
            }
            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Product.validation()) {
                Product.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Product.deleteConfirm();
            return false;
        });

        $("#iclass").on("change", function(ev) {
            Product.goIngcdList();
            return false;
        });

        $("#ingcd").on("change", function(ev) {
            Product.goIngnmList();
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Product.downloadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/basic/productApi/dataListExcel';
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
                    'targets': [6,8],
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
            Product.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#iclass").val(data[0]).attr("selected", "selected");
        Product.goIngcdList(data[1]);
        Product.goIngnmList(data[2]);
        $("#phacd").val(data[9]).attr("selected", "selected");
        $("#useYn").val(data[8]).attr("selected", "selected");
        $("#prdnm").val(data[5]);
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#iclass option:eq('')").prop("selected", true);
        $("#ingcd").empty();
        $("#ingnm").empty();
        $("#ingcd").append("<option value=\"\">==선택==</option>");
        $("#ingnm").append("<option value=\"\">==선택==</option>");
        $("#phacd option:eq('')").prop("selected", true);
        $("#useYn option:eq('')").prop("selected", true);
        $("#prdnm").val("");
    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/productApi/dataList',
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
                        rowData[key].moddt,
                        rowData[key].modid,
                        rowData[key].useYn,
                        rowData[key].phacd,
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
            url: '/basic/productApi/dataEdit',
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
                    Product.ViewDataInt();
                }
                Product.goDataList();
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
            url: '/basic/productApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Product.ViewDataInt();
                Product.goDataList();
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
                    Product.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "SU" + Util.getToday();
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
                    let option2 = $("<option value='" + rowData[key].phacd + "'>" + rowData[key].phanm + "</option>");
                    $('#s_phacd').append(option2);
                    $('#phacd').append(option);
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
            url: '/basic/ingredientApi/iclassList',
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
            url: '/basic/ingredientApi/ingcdList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#ingcd').empty();
                $('#ingnm').empty();
                $("#ingcd").append("<option value=\"\">==선택==</option>");
                $("#ingnm").append("<option value=\"\">==선택==</option>");
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
            url: '/basic/ingredientApi/ingnmList',
            type: 'post',
            data: param,
            async: false,
            success: function (data) {
                console.log(data);
                $('#ingnm').empty();
                $("#ingnm").append("<option value=\"\">==선택==</option>");
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
}