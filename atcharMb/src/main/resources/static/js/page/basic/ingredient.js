let Ingredient = {
    init : function () {
        Ingredient.config();
        Ingredient.button_init();
        Ingredient.dataTableIni();
        Ingredient.goDataList();
    },

    config : function () {
        $("#creBtnView").hide();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Ingredient.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Ingredient.ViewDataInt();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            //$("#comCd").val(Ingredient.createKey());
            if ( Ingredient.validation()) {
                Ingredient.goDataEdit('I');
            }

            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Ingredient.validation()) {
                Ingredient.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Ingredient.deleteConfirm();
            return false;
        });

        $("#excelBtn").on("click", function(ev) {
            Ingredient.downloadExcel();
            return false;
        });
    },

    downloadExcel : function () {
        const url = '/basic/ingredientApi/dataListExcel';
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
                    'targets': [4,6],
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
            Ingredient.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#iclass").val(data[0]);
        $("#ingcd").val(data[1]);
        $("#ingnm").val(data[2]);
        $("#capacity").val(data[3]);
        $("#useYn").val(data[6]).prop("selected", true);
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#iclass").val("");
        $("#ingcd").val("");
        $("#ingnm").val("");
        $("#capacity").val("");
        $("#useYn option:eq('')").prop("selected", true);
    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/basic/ingredientApi/dataList',
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
                        rowData[key].moddt,
                        rowData[key].modid,
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
            url: '/basic/ingredientApi/dataEdit',
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
                    Ingredient.ViewDataInt();
                }
                Ingredient.goDataList();
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
            url: '/basic/ingredientApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Ingredient.ViewDataInt();
                Ingredient.goDataList();
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
                    Ingredient.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "in" + Util.getToday();
    },

    validation : function () {
        if ( $("#iclass").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '분류명을 입력해 주십시오.'
            });
            $("#iclass").focus();
            return false;
        }

        if ( $("#ingcd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '코드명을 입력해 주십시오.'
            });
            $("#ingcd").focus();
            return false;
        }

        if ( $("#ingnm").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '성분명을 입력해 주십시오.'
            });
            $("#ingnm").focus();
            return false;
        }

        if ( $("#capacity").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '용량을 입력해 주십시오.'
            });
            $("#capacity").focus();
            return false;
        }

        return true;
    },
}