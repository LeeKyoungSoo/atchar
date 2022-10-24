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
            message = "회원가입되었습니다. 로그인 후 서비스를 이용해 주세요.";
        }
        else {
            message = "수정 되었습니다. ";
        }

        $.ajax({
            url: '/etcmng/memberApi/dataEdit',
            type: 'post',
            data: param,
            success: function (data) {
                //console.log(data);
                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                document.querySelector('ons-tabbar').setActiveTab('0');
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

    idUseChk : function () {
        if ( $("#userId").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '아이디를 입력해 주십시오.'
            });
            $("#userId").focus();
            return false;
        }

        if (!$("#userId").val().includes('@')) {
            modal({
                type: 'error',
                title: 'error',
                text: '올바른 이메일 주소를 입력해 주십시오.'
            });
            $("#userId").focus();
            return false;
        }

        let userId = $("#userId").val();
        $.ajax({
            url: '/etcmng/memberApi/idDoubleCheck',
            type: 'post',
            data: {
                userId : userId
            },
            success: function (data) {
                //console.log(data.result);
                if ( data.result > 0 ) {
                    modal({
                        type: 'error',
                        title: 'error',
                        text: '이미 존재하는 아이디 입니다.'
                    });
                }
                else {
                    modal({
                        type: 'confirm',
                        title: '사용가능',
                        text: '입력하신 아이디를 사용하시겠습니까?',
                        callback: function (result) {
                            if ( result == true) {
                                $("#idchk").val("Y");
                                $("#userId").attr("readonly",true);
                            }
                        }
                    });
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    validation : function () {
        if ( $("#idchk").val() != "Y" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '아이디 입력 후 아이디 중복확인 버튼을 클릭하세요.'
            });
            $("#userId").focus();
            return false;
        }

        if ( $("#pwd").val() == "" || $("#newPwd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '비밀번호를 입력해 주십시오.'
            });
            $("#newPwd").focus();
            return false;
        }

        if ( $("#pwd").val().length < 8  ) {
            modal({
                type: 'error',
                title: 'error',
                text: '8자 이상 입력해 주십시오.'
            });
            $("#newPwd").focus();
            return false;
        }

        if ( $("#pwd").val() !=  $("#newPwd").val() ) {
            modal({
                type: 'error',
                title: 'error',
                text: '비밀번호와 확인된 비밀번호가 일치 하지 않습니다.'
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

        if ( $("#phone").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '연락처를 입력해 주십시오.'
            });
            $("#phone").focus();
            return false;
        }

        if ( $("#smsauth").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '인증번호를 입력해 주십시오.'
            });
            $("#smsauth").focus();
            return false;
        }

        if ( $("#email").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '이메일주소를 입력해 주십시오.'
            });
            $("#email").focus();
            return false;
        }

        if ( $("#exkey").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '인증번호를 생성해 주십시오.'
            });
            $("#smsauth").focus();
            return false;
        }

        if ( $("#smsauth").val() !=  $("#exkey").val() ) {
            modal({
                type: 'error',
                title: 'error',
                text: '인증번호를 다시 확인해 주십시오.'
            });
            $("#smsauth").focus();
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

        if ( $("#yacacc").val() != "Y" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '약관에 동의해 주십시오.'
            });
            $("#yacaccyn").focus();
            return false;
        }

        if ( $("#useacc").val() != "Y" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '개인정보 수집 및 이용에 동의해 주십시오.'
            });
            $("#useaccyn").focus();
            return false;
        }

        // if ( $("#prvacc").val() != "Y" ) {
        //     modal({
        //         type: 'error',
        //         title: 'error',
        //         text: '개인정보노출에 동의해 주십시오.'
        //     });
        //     $("#prvaccyn").focus();
        //     return false;
        // }
        return true;
    },

    goMyInfoEdit : function () {
        let param = $("form[name=dataFrm]").serialize();
        let message = "";

        if ( !Member.infoValidation() ) {
            return;
        }

        $.ajax({
            url: '/etcmng/memberApi/myInfoEdit',
            type: 'post',
            data: param,
            success: function (data) {
                //console.log(data);
                modal({
                    type: 'success',
                    title: '안내',
                    text: data.dataState
                });
                //document.querySelector('ons-tabbar').setActiveTab('0');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    infoValidation : function () {
        if ( $("#nowPwd").val() == ""  ) {
            modal({
                type: 'error',
                title: 'error',
                text: '사용중인 비밀번호를 입력해 주십시오.'
            });
            $("#nowPwd").focus();
            return false;
        }

        if ( $("#pwd").val() == "" || $("#newPwd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '사용할 비밀번호를 입력해 주십시오.'
            });
            $("#newPwd").focus();
            return false;
        }

        if ( $("#pwd").val().length < 8  ) {
            modal({
                type: 'error',
                title: 'error',
                text: '8자 이상 입력해 주십시오.'
            });
            $("#newPwd").focus();
            return false;
        }

        if ( $("#pwd").val() !=  $("#newPwd").val() ) {
            modal({
                type: 'error',
                title: 'error',
                text: '비밀번호와 확인된 비밀번호가 일치 하지 않습니다.'
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

        if ( $("#phone").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '연락처를 입력해 주십시오.'
            });
            $("#phone").focus();
            return false;
        }

        if ( $("#email").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '이메일을 입력해 주십시오.'
            });
            $("#email").focus();
            return false;
        }

        return true;
    },

    goMyInfo : function () {
        $.ajax({
            url: '/etcmng/memberApi/myInfo',
            type: 'post',
            data: {
                userid : ''
            },
            success: function (data) {
               $("#userNm").val(data.memberInfo.userNm);
               $("#phone").val(data.memberInfo.phone);
               $("#email").val(data.memberInfo.email);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goMyComInfo : function () {
        $.ajax({
            url: '/etcmng/memberApi/myComInfo',
            type: 'post',
            data: {
                userid : ''
            },
            success: function (data) {
                $("#comnm").val(data.memberInfo.comnm);
                $("#comphone").val(data.memberInfo.comphone);
                $("#comphonelink").val(data.memberInfo.comphonelink);

                if ( data.memberInfo.comfile == "" ) {
                    $("#fileyn").empty();
                } else {
                    $("#fileyn").html("등록하신 사업자 등록증이 있습니다.");
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    goMyComInfoEdit : function () {
        let param = $("form[name=comFrm]").serialize();
        let message = "";

        if ( !Member.comValidation() ) {
            return;
        }

        $.ajax({
            url: '/etcmng/memberApi/myComInfoEdit',
            type: 'post',
            data: param,
            success: function (data) {
                //console.log(data);
                modal({
                    type: 'success',
                    title: '안내',
                    text: data.dataState
                });

                Member.logout();
                //document.querySelector('ons-tabbar').setActiveTab('0');
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    comValidation : function () {
        if ( $("#comnm").val() == ""  ) {
            modal({
                type: 'error',
                title: 'error',
                text: '등록업체명을 입력해 주십시오.'
            });
            $("#comnm").focus();
            return false;
        }

        if ( $("#comphone").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '회사연력처를 입력해 주십시오.'
            });
            $("#comphone").focus();
            return false;
        }

        return true;
    },

    smsAuthKey : function () {
        let key = Member.generateRandomCode(4);
        modal({
            type: 'success',
            title: '인증번호',
            text: '[' + key + ']<br>생성된 인증번호를 입력해 주십시오.'
        });
        $("#exkey").val(key);
    },

    generateRandomCode : function (n) {
        let str = ''
        for (let i = 0; i < n; i++) {
            str += Math.floor(Math.random() * 10)
        }
        return str
    },

    logout : function () {
        //debugger;
        let form = document.logout;
        form.action = "/mobile/guest/logout";
        form.submit();
    },
}