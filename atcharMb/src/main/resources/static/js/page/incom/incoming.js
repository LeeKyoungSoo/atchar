let gv_logData;
let itemListConfig = {};

let Incoming = {
    init : function () {
        $("#Tab2-VIEW").hide();
        Incoming.config();
        //Incoming.goDataList();
        Incoming.ViewDataInt();
        //debugger;
        //처음 진입 시점에 등록하게 되면 생성된 키가 필요
        if ($("#incomcd").val() == "") {
            $("#incomcd").val(Incoming.createKey());
            $("#f_bId").val($("#incomcd").val());
        }

        $("#f_bId").val($("#incomcd").val());

        itemListConfig.pageNum = 1;     //페이지넘버
    },

    config : function () {
        Incoming.goCodeList("itemcd", "CC211209002749", "Y", "");
        Incoming.goCodeList("makecd", "CC211209002748", "Y", "");
        Incoming.goCodeList("yearcd", "CC220131010600", "Y", "");
        Incoming.goZipList("areasicd","", "");
        return false;
    },

    btn_create : function() {
        //debugger;
        if ($("#incomcd").val() == "") {
            $("#incomcd").val(Incoming.createKey());
            $("#f_bId").val($("#incomcd").val());
        }
        $("#file_list").empty();
        Incoming.ViewDataInt();
        return false;
    },

    btn_insert : function() {
        if ( Incoming.validation()) {
            Incoming.goDataEdit('I');
        }
        return false;
    },

    btn_update : function() {
        if ( Incoming.validation()) {
            Incoming.goDataEdit('U');
        }
        return false;
    },

    btn_delete : function() {
        Incoming.deleteConfirm();
        return false;
    },

    chkcode : function (code) {
        if ( code == 1 )  {
            $("#itemnm").val($("#itemcd option:checked").text());
        }
        else if ( code == 2 )  {
            $("#modelcd").empty();
            $("#makenm").val($("#makecd option:checked").text());
            Incoming.goCodeList("carcd", $("#makecd").val(), "Y", "");
        }
        else if ( code == 3 )  {
            $("#carnm").val($("#carcd option:checked").text());
            Incoming.goCodeList("modelcd", $("#carcd").val(), "Y", "");
        }
        else if ( code == 4 )  {
            $("#modelnm").val($("#modelcd option:checked").text());
        }
        else if ( code == 5 )  {
            $("#yearnm").val($("#yearcd option:checked").text());
        }
        else if ( code == 6 )  {
            $("#areasinm").val($("#areasicd option:checked").text());
            Incoming.goZipList("areagucd", $("#areasicd").val(), "");
        }
        else if ( code == 7 )  {
            $("#areagunm").val($("#areagucd option:checked").text());
        }
    },

    downloadExcel : function () {
        const url = '/incom/incomingApi/dataListExcel';
        let f = document.dataFrm;
        f.action = url;
        f.submit();
    },

    ViewOption : function (key) {
        let message = "";
        let useyn = $("#viewOpt").is(":checked");
        if ( useyn ) {
            useyn = "Y";
            message = "노출 상태로 변경합니다.";
            $("#itgu_val").html("노출");
        } else {
            useyn = "N";
            message = "노출안함 상태로 변경합니다.";
            $("#itgu_val").html("노출안함");
        }
        let incomcd = gv_logData[key].incomcd;
        $.ajax({
            url: '/incom/incomingApi/dataViewOpt',
            type: 'post',
            data: {
                incomcd : incomcd,
                useyn : useyn
            },
            success: function (data) {
                modal({
                    type: 'success',
                    title: 'Success',
                    text: message
                });
                Incoming.goDataList();
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    ViewData : function (key) {
        document.querySelector('ons-tabbar').setActiveTab('0');
        $("#Tab2-VIEW").hide();

        $("#creBtnView").show();
        $("#insBtnView").hide();
        $("#udtBtnView").show();
        $("#delBtnView").show();

        $("#incomcd").val(gv_logData[key].incomcd);
        Incoming.goCodeList("itemcd", "CC211209002749", "Y", gv_logData[key].itemcd);
        Incoming.goCodeList("makecd", "CC211209002748", "Y", gv_logData[key].makecd);
        Incoming.goCodeList("carcd", gv_logData[key].makecd, "Y", gv_logData[key].carcd);
        Incoming.goCodeList("modelcd", gv_logData[key].carcd, "Y", gv_logData[key].modelcd);
        Incoming.goCodeList("yearcd", "CC220131010600", "Y", gv_logData[key].yearcd);
        Incoming.goZipList("areasicd","", gv_logData[key].areasicd);
        Incoming.goZipList("areagucd", gv_logData[key].areasicd, gv_logData[key].areagucd);

        $("#itemnm").val(gv_logData[key].itemnm);
        $("#makenm").val(gv_logData[key].makenm);
        $("#carnm").val(gv_logData[key].carnm);
        $("#modelnm").val(gv_logData[key].modelnm);
        $("#yearnm").val(gv_logData[key].yearnm);
        $("#areasinm").val(gv_logData[key].areasinm);
        $("#areagunm").val(gv_logData[key].areagunm);

        $("#price").val(gv_logData[key].price);
        $("#partnum").val(gv_logData[key].partnum);
        $("#vinnum").val(gv_logData[key].vinnum);
        $("#memo").val(gv_logData[key].memo);
        $("#itgu").val(gv_logData[key].itgu);

        //$("#regid").html(gv_logData[key].regid);
        $("#regdt").html(gv_logData[key].regdt);
        //$("#modid").html(gv_logData[key].modid);
        $("#moddt").html(gv_logData[key].moddt);

        $("#mountyn").val(gv_logData[key].mountyn);
        $("#coloryn").val(gv_logData[key].coloryn);

        Incoming.fileListView(gv_logData[key].incomcd, "reg");
    },

    ViewDataInt : function () {
        $("#creBtnView").hide();
        $("#insBtnView").show();
        $("#udtBtnView").hide();
        $("#delBtnView").hide();

        $("#incomcd").val("");
        $("#itemcd option:eq('')").prop("selected", true);
        $("#makecd option:eq('')").prop("selected", true);
        $("#carcd").empty();
        $("#modelcd").empty();
        $("#yearcd option:eq('')").prop("selected", true);
        $("#areasicd option:eq('')").prop("selected", true);
        $("#areagucd").empty();

        $("#itemnm").val("");
        $("#makenm").val("");
        $("#carnm").val("");
        $("#modelnm").val("");
        $("#yearnm").val("");
        $("#areasinm").val("");
        $("#areagunm").val("");
        
        $("#price").val("");
        $("#partnum").val("");
        $("#vinnum").val("");
        $("#memo").val("");
        $("#itgu").val("");

        $("#mountyn option:eq('Y')").prop("selected", true);
        $("#coloryn option:eq('Y')").prop("selected", true);

        //$("#regid").html("");
        $("#regdt").html("");
        //$("#modid").html("");
        $("#moddt").html("");

        $("#file_list").empty();
    },

    goDataList : function (gubun) {
        /*
        let allyn = $("#allyn").is(":checked");
        if ( allyn ) {
            allyn = "";
        }
        else {
            allyn = "Y";
        }
        */

        if ( gubun == "N" ) {
            itemListConfig.pageNum += 1;
        } else {
            itemListConfig.pageNum = 1;
        }

        let allyn = "";
        $.ajax({
            url: '/incom/incomingApi/myDataList',
            type: 'post',
            data: {
                allyn : allyn,
                pageNum : itemListConfig.pageNum
            },
            success: function (data) {
                if ( gubun != "N" ) {
                    $("#rowlist").empty();
                }
                let rowData = data.dataList;
                gv_logData = rowData;

                if ( rowData.length < 1 ) {
                    if ( gubun != "N" ) {
                        modal({
                            type: 'success',
                            title: '검색결과',
                            text: "요청하신 상품검색결과는 0건입니다."
                        });
                    } else {
                        modal({
                            type: 'success',
                            title: '검색결과',
                            text: "추가 목록이 존재하지 않습니다."
                        });
                    }
                    return;
                }

                $.each(rowData, function (key) {
                    let useyn = "노출";
                    if (rowData[key].useyn == 'N' ) {
                        useyn = "노출안함";
                    }
                    let fileSavename = "";
                    let thumbName = "thumb_";
                    if ( rowData[key].fileList.length > 0 ) {
                        fileSavename = rowData[key].fileList[0].fileSaveNm;
                        thumbName = thumbName + fileSavename;
                        $("#rowlist").append(
                            '<ons-list-item onclick="Incoming.detailView(' + key + ');">\n' +
                            '  <div class="left" >\n' +
                            '       <img class="list-item__thumbnail item_list_img" src="/fileUpDownApi/display?filename=' + thumbName + '">\n' +
                            '  </div>\n' +
                            '  <div class="center item_list_left">\n' +
                            '       <span class="list-item__title">' + rowData[key].itemnm + '&nbsp;&nbsp;<span style="color:red">(' + useyn + ')</span>' + '</span>' +
                            '       <span class="list-item__subtitle">' + rowData[key].makenm + ' | ' + rowData[key].carnm + ' | ' + rowData[key].yearnm + '연식</span>' +
                            '       <span class="list-item__subtitle">모델 : ' + rowData[key].modelnm + '</span>\n' +
                            '  </div>\n' +
                            '</ons-list-item>'
                        );
                    } else {
                        $("#rowlist").append(
                            '<ons-list-item onclick="Incoming.detailView(' + key + ');">\n' +
                            '  <div class="left" >\n' +
                            '       <!--<img class="list-item__thumbnail" src="/fileUpDownApi/display?filename=' + thumbName + '">-->\n' +
                            '  </div>\n' +
                            '  <div class="center item_list_left">\n' +
                            '       <span class="list-item__title">' + rowData[key].itemnm + '&nbsp;&nbsp;<span style="color:red">(' + useyn + ')</span>' + '</span>' +
                            '       <span class="list-item__subtitle">' + rowData[key].makenm + ' | ' + rowData[key].carnm + ' | ' + rowData[key].yearnm + '연식</span>' +
                            '       <span class="list-item__subtitle">모델 : ' + rowData[key].modelnm + '</span>\n' +
                            '  </div>\n' +
                            '</ons-list-item>'
                        );
                    }
                });
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    detailView : function (key) {
        let useyn = "checked";
        let itgu_val = "노출";
        let itgu = "중고품";
        if (gv_logData[key].useyn == 'N' ) {
            useyn = "";
            itgu_val = "노출안함";
        }

        if (gv_logData[key].itgu == 'R' ) {
            itgu = "재생품";
        }

        $("#Tab2-VIEW").empty();
        $("#Tab2-VIEW").append('<ons-toolbar>\n' +
            '            <div class="center">\n' +
            '                   ' + gv_logData[key].itemnm + ' ' +
            '           </div>\n' +
            '           <div class="right">\n' +
            '               <span id="itgu_val">' + itgu_val + '</span> <ons-switch input-id="viewOpt" onchange="Incoming.ViewOption('+ key +');"' +
            '                       ' + useyn + ' style="margin-top: 16px;margin-right: 16px;"></ons-switch>\n' +
            '           </div>' +
            '        </ons-toolbar>\n' +
            '        <ons-card class="card_op">\n' +
            '            <ul id="img_file_list" class="down-list"></ul>\n' +
            '            <div style="clear:both;color: #2d4373">사진을 클릭하면 이미지가 확대되고, 확대된 이미지를 클릭하면 이미지가 축소됩니다.</div>\n' +
            '            <p class="btn_magin" style="clear:both;">\n' +
            '                <ons-button class="selbox_100" onclick="Incoming.dataclose();">닫기</ons-button>\n' +
            '            </p>\n' +
            '            <div class="title" style="clear:both;">\n' +
            '                ' + gv_logData[key].makenm +  '  ' + gv_logData[key].carnm + '\n' +
            '            </div>\n' +
            '            <div class="content">\n' +
            '                <ons-list>\n' +
            '                    <ons-list-header>모델 : ' + gv_logData[key].modelnm +  '</ons-list-header>\n' +
            '                    <ons-list-item>연식 : ' + gv_logData[key].yearnm +  '</ons-list-item>\n' +
            '                    <ons-list-item>지역 : ' + gv_logData[key].areasinm + ' ' + gv_logData[key].areagunm +  '</ons-list-item>\n' +
            '                    <ons-list-item>구분 : ' + itgu +  '</ons-list-item>\n' +
            '                    <ons-list-item>가격 : ' + gv_logData[key].price +  '</ons-list-item>\n' +
            '                    <ons-list-item>파트넘버 : ' + gv_logData[key].partnum +  '</ons-list-item>\n' +
            '                    <ons-list-item>차대번호 : ' + gv_logData[key].vinnum +  '</ons-list-item>\n' +
            '                    <ons-list-item>장착가능여부 : ' + Incoming.changeCodeToValue(gv_logData[key].mountyn) +  '</ons-list-item>\n' +
            '                    <ons-list-item>도색가능여부 : ' + Incoming.changeCodeToValue(gv_logData[key].coloryn) +  '</ons-list-item>\n' +
            '                    <ons-list-item>' + gv_logData[key].memo +  '</ons-list-item>\n' +
            '                </ons-list>\n' +
            '            </div>\n' +
            '            <p class="btn_magin">\n' +
            '                <ons-button class="selbox_100" onclick="Incoming.dataclose();">닫기</ons-button>\n' +
            '            </p>\n' +
            '            <p class="btn_magin">\n' +
            '                <ons-button class="selbox_100" onclick="Incoming.ViewData('+ key +');">수정전환</ons-button>\n' +
            '            </p>\n' +
            '        </ons-card> ' +
            '        <div class="empty_hi"></div>');
        $("#Tab2-VIEW").show();

        Incoming.fileListView(gv_logData[key].incomcd, "view");
    },

    changeCodeToValue : function(code) {
       if ( code == "Y" ) {
           return "가능";
       } else {
           return "불가능";
       }
    },

    dataclose : function () {
        $("#file_list").empty();
        $("#Tab2-VIEW").hide();
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
        //debugger;
        let param = $("form[name=dataFrm]").serialize();
        let message = "";
        if ( gubun == 'I' ) {
            message = "등록 되었습니다. ";
        }
        else {
            message = "수정 되었습니다. ";
        }

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
            url: '/incom/incomingApi/dataDelete',
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
        return "IC" + Util.getToday();
    },

    validation : function () {

        if ( $("#itemcd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '품명을 선택해 주십시오.'
            });
            $("#itemcd").focus();
            return false;
        }
        
        if ( $("#makecd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '제조사를 선택해 주십시오.'
            });
            $("#makecd").focus();
            return false;
        }

        if ( $("#carcd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '차량명을 선택해 주십시오.'
            });
            $("#carcd").focus();
            return false;
        }

        if ( $("#modelcd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '모델명을 선택해 주십시오.'
            });
            $("#modelcd").focus();
            return false;
        }

        if ( $("#itgu").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '재생/중보 구분을 선택해 주십시오.'
            });
            $("#itgu").focus();
            return false;
        }

        if ( $("#yearcd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '연식을 선택해 주십시오.'
            });
            $("#yearcd").focus();
            return false;
        }

        if ( $("#areasicd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '지역(시군)을 선택해 주십시오.'
            });
            $("#areasicd").focus();
            return false;
        }

        if ( $("#areagucd").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '지역(구군)을 선택해 주십시오.'
            });
            $("#areagucd").focus();
            return false;
        }

        if ( $("#price").val() == "" ) {
            modal({
                type: 'error',
                title: 'error',
                text: '가격을 입력해 주십시오.'
            });
            $("#price").focus();
            return false;
        }

        //debugger;
        // 키 값이 있는지 확인
        if ($("#incomcd").val() == "") {
            $("#incomcd").val(Incoming.createKey());
            $("#f_bId").val($("#incomcd").val());
        }

        return true;
    },

    goFileUpload : function () {
        //debugger;
        if ( $("#file_list").find("li").length > 5 ) {
            alert("사진 파일은 6개까지 올릴 수 있습니다.");
            $("#file").val("");
            return;
        }

        if ( $('#file')[0].files[0] == null || $('#file')[0].files[0] == "" ) {
            return;
        }

        //상품고유값은 incomcd임
        if ($("#incomcd").val() == "") {
            $("#incomcd").val(Incoming.createKey());
            $("#f_bId").val($("#incomcd").val());
        }

        if ( $("#f_bId").val() == "" ) {
            $("#f_bId").val($("#incomcd").val());
        }

        let params = new FormData();
        params.append('gubun',$("#f_gubun").val());
        params.append('bId',$("#f_bId").val());
        params.append('file',$('#file')[0].files[0]);

        $.ajax({
            url:'/fileUpDownApi/fileUpload',
            type:'POST',
            enctype: 'multipart/form-data',
            dataType: 'json',
            data: params,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success:function(data){
                console.log(data);
                Incoming.FileListTable(data.fileList);
            },
            error: function(xhr, status, error) {
                console.error("오류 발생:", error);
            }
        });
    },

    goComFileUpload : function () {
        if ( $('#comfile')[0].files[0] == null || $('#comfile')[0].files[0] == "" ) {
            return;
        }

        //상품고유값은 incomcd임
        if ($("#incomcd").val() == "") {
            $("#incomcd").val(Incoming.createKey());
            $("#f_bId").val($("#incomcd").val());
        }

        if ( $("#f_bId").val() == "" ) {
            $("#f_bId").val($("#incomcd").val());
        }

        let params = new FormData();
        params.append('gubun', 'COM');
        params.append('bId', $('#f_bId').val());
        params.append('file', $('#comfile')[0].files[0]);

        $.ajax({
            url:'/fileUpDownApi/fileUploadOneChg',
            type:'post',
            enctype: 'multipart/form-data',
            dataType: 'json',
            data: params,
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success:function(data){
                console.log(data);
                modal({
                    type: 'success',
                    title: 'success',
                    text: '사업자등록증을 등록하였습니다.'
                });
            }
        });
    },

    FileListTable : function(data) {
        $("#file").val("");
        $("#file_list").empty();
        $("#fileUp").val("");
        let strHtml = "";
        let resultList = data ;
        if(resultList && resultList.length > 0) {
            for(let i=0; i<resultList.length; i++) {
                let retObj = resultList[i];
                strHtml = strHtml + "<li class='ulist'>";
                strHtml = strHtml + "   <div class='check-box'><img src='/fileUpDownApi/display?filename=" + retObj.fileSaveNm + "' " +
                    " style='width:60%' />" + retObj.fileOrgNm + "</div>";
                //strHtml = strHtml + "<a href='/fileUpDownApi/fileDownloadId/" + retObj.fid + "' class='btn' download='" + retObj.fileOrgNm + "'>다운로드</a>";
                strHtml = strHtml + "&nbsp;&nbsp;&nbsp;&nbsp;";
                strHtml = strHtml + "<a href=\"javascript:Incoming.goFileDelete('" + retObj.fid + "','" + retObj.fileSaveNm + "');\" class='btn' download='" + retObj.fileOrgNm + "'>삭제</a>";
                strHtml = strHtml + "</li>";
            }
        }
        $("#file_list").html(strHtml);
    },

    IMG_FileListTable : function(data) {
        $("#img_file_list").empty();
        let strHtml = "";
        let resultList = data ;
        if(resultList && resultList.length > 0) {
            for(let i=0; i<resultList.length; i++) {
                let retObj = resultList[i];
                strHtml = strHtml + "<li class='ulist_w_33'>";
                strHtml = strHtml + "   " +
                    "<img class='itemImg' src='/fileUpDownApi/display?filename=" + retObj.fileSaveNm + "' style='width:100px;height:100px' />";
               strHtml = strHtml + "</li>";
            }
        }
        $("#img_file_list").html(strHtml);
    },

    goFileAllDownload : function () {
        let fidList = $("input[name=fidList]");

        let fidArr = new Array();
        let j = 0;
        for(let i=0; i < fidList.length; i++) {
            if (fidList.eq(i).is(":checked") == true) {
                fidArr[j++] = fidList.eq(i).val();
            }
        }

        if ( fidArr == null || fidArr.length < 1 ) {
            return;
        }

        $("#f_fidList").val(fidArr);
        const f = document.zipDown;
        f.method = "GET";
        f.action = "/fileUpDownApi/fileDownload/All";

        console.log($("#f_fidList").val());
        f.submit();
    },

    goFileDelete : function(fId, savaFileName) {
        $.ajax({
            url:'/fileUpDownApi/fileDelete',
            type:'post',
            dataType: 'json',
            data: {
                fId : fId,
                gubun : $("#f_gubun").val(),
                bId : $("#f_bId").val(),
                fileSaveNm : savaFileName
            },
            success:function(data){
                Incoming.FileListTable(data.fileList);
            }
        });
    },

    fileListView : function(data, gubun) {
        $.ajax({
            url:'/fileUpDownApi/fileUploadList',
            type: 'post',
            data: {
                f_bId : data
            },
            success: function (data) {
                if ( gubun == "reg") {
                   Incoming.FileListTable(data.fileList);
                } else {
                    Incoming.IMG_FileListTable(data.fileList);
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },
}