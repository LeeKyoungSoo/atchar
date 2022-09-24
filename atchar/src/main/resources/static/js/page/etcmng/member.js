let Member = {
    init : function () {
        Member.config();
        Member.button_init();
        Member.dataTableIni();
        Member.goDataList();
    },

    config : function () {
        $("#creBtnView").hide();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();
        return false;
    },

    button_init : function () {
        $("#searchBtn").on("click", function(ev) {
            Member.goDataList();
            return false;
        });

        $("#creBtn").on("click", function(ev) {
            Member.ViewDataInt();
            return false;
        });

        $("#insBtn").on("click", function(ev) {
            //$("#comCd").val(Member.createKey());
            if ( Member.validation()) {
                Member.goDataEdit('I');
            }

            return false;
        });

        $("#udtBtn").on("click", function(ev) {
            if ( Member.validation()) {
                Member.goDataEdit('U');
            }
            return false;
        });

        $("#delBtn").on("click", function(ev) {
            Member.deleteConfirm();
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
                    "targets": [4],
                    "visible": false,
                    "searchable": false
                },
                {
                    'targets': [3],
                    'className': 'alCenter',
                },
                {
                    'targets': [2],
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
            Member.ViewData(data);
        });

    },

    ViewData : function (data) {
        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#userId").val(data[0]);
        $("#userNm").val(data[1]);
        $("#level").val(data[2]).prop("selected", true);
        $("#useYn").val(data[3]).prop("selected", true);
        $("#pwd").val(data[4]);
        $("#phone").val(data[5]);
        $("#email").val(data[6]);
        $("#regroot").val(data[7]);
        $("#memo").val(data[8]);

        $("#newPwdInfo").html("입력값이 없으면 기존 비밀번호를 유지합니다.");
        $("#userId").attr("readonly", true);
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#userId").val("");
        $("#userNm").val("");
        $("#level option:eq('')").prop("selected", true);
        $("#useYn option:eq('')").prop("selected", true);
        $("#pwd").val("");
        $("#newPwd").val("");
        $("#phone").val("");
        $("#email").val("");
        $("#regroot").val("");
        $("#memo").val("");

        $("#newPwdInfo").empty();
        $("#userId").attr("readonly", false);
        $("#pwd").attr("readonly", false);
    },

    goDataList : function () {
        let tableGrid = $('#dataTable').DataTable();
        let param = $("form[name=dataFrm]").serialize();
        $.ajax({
            url: '/etcmng/memberApi/dataList',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);
                tableGrid.clear().draw();
                let rowData = data.dataList;
                $.each(rowData, function (key) {
                    tableGrid.row.add([
                        rowData[key].userId,
                        rowData[key].userNm,
                        rowData[key].level,
                        rowData[key].useYn,
                        rowData[key].pwd,
                        rowData[key].phone,
                        rowData[key].regroot,
                        rowData[key].email,
                        rowData[key].memo,
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
            url: '/etcmng/memberApi/dataEdit',
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
                    Member.ViewDataInt();
                }
                Member.goDataList();
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
            url: '/etcmng/memberApi/dataDelete',
            type: 'post',
            data: param,
            success: function (data) {
                console.log(data);

                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Member.ViewDataInt();
                Member.goDataList();
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
                    Member.goDataDelete();
                }
            }
        })
    },

    createKey : function () {
        return "cc" + Util.getToday();
    },

    validation : function () {

        if ( $("#userId").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '아이디를 입력해 주십시오.'
            });
            $("#userId").focus();
            return false;
        }

        if ( $("#pwd").val() == "" && $("#newPwd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '비밀번호를 입력해 주십시오.'
            });
            $("#newPwd").focus();
            return false;
        }

        if ( $("#userNm").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '사용자명을 입력해 주십시오.'
            });
            $("#userNm").focus();
            return false;
        }

        if ( $("#level").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '레벨을 입력해 주십시오.'
            });
            $("#level").focus();
            return false;
        }

        return true;
    },
}