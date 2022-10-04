let gv_logData;

let $banner;
let $bannerWidth;   //이미지의 폭
let $bannerHeight;  // 높이
let $length;        //이미지의 갯수
let rollingId;
let itemListConfig = {};

let ItemAtchar = {
    init : function () {
        ItemAtchar.config();
        $("#Tab2-VIEW").hide();

        itemListConfig.gCode = 0;      //현재 선택된 목록형태  [0:바디검색목록][1:관심목록][2:최근검색]
        itemListConfig.pageNum = 1;     //페이지넘버
    },

    config : function () {
        ItemAtchar.goCodeList("itemcd", "CC211209002749", "Y", "");
        ItemAtchar.goCodeList("makecd", "CC211209002748", "Y", "");
        ItemAtchar.goCodeList("yearcd", "CC220131010600", "Y", "");
        ItemAtchar.goZipList("areasicd","", "");
        return false;
    },

    btn_search : function (code) {
        if ( code == 3) {
            $("#itemcd").val("");
            $("#makecd").val("");
            $("#carcd").val("");
            $("#modelcd").val("");
            $("#yearcd").val("");
            $("#areasicd").val("");
            $("#areagucd").val("");
            code = 0;
        }
        ItemAtchar.goDataList(code, "Y");
        return false;
    },

    chkcode : function (code) {
        if ( code == 1 )  {
            $("#itemnm").val($("#itemcd option:checked").text());
        }
        else if ( code == 2 )  {
            $("#modelcd").empty();
            $("#makenm").val($("#makecd option:checked").text());
            ItemAtchar.goCodeList("carcd", $("#makecd").val(), "Y", "");
        }
        else if ( code == 3 )  {
            $("#carnm").val($("#carcd option:checked").text());
            ItemAtchar.goCodeList("modelcd", $("#carcd").val(), "Y", "");
        }
        else if ( code == 4 )  {
            $("#modelnm").val($("#modelcd option:checked").text());
        }
        else if ( code == 5 )  {
            $("#yearnm").val($("#yearcd option:checked").text());
        }
        else if ( code == 6 )  {
            $("#areasinm").val($("#areasicd option:checked").text());
            ItemAtchar.goZipList("areagucd", $("#areasicd").val(), "");
        }
        else if ( code == 7 )  {
            $("#areagunm").val($("#areagucd option:checked").text());
        }
    },

    /**
     * 바디 상품 목록 가져오기
     *
     * @function goDataList
     * @param {number} code [0:바디검색목록][1:관심목록][2:최근검색]
     * @returns
     * @author lnworks
     * @lastupdate 2022.09.30
     */
    goDataList : function (code, gubun) {
        //debugger;
        if ( code == undefined ) {
            code = 0;
        }
debugger;
        if ( "" + code == "" ) {
            code = itemListConfig.gCode;
            itemListConfig.pageNum += 1;
        } else {
            itemListConfig.gCode = code;
            itemListConfig.pageNum = 1;
        }
        //console.log(itemListConfig);

        $("#orderbygubun").val($("#searchGubun").val());
        $("#pageNum").val(itemListConfig.pageNum);
        let param = $("form[name=dataFrm]").serialize();

        let url;
        if ( code == 1 ) {
            url = "/incom/incomingApi/myAttentionDataList";
        } else if ( code == 2 ) {
            url = "/incom/incomingApi/clickDataList";
        } else {
            url = "/incom/incomingApi/dataList";
        }

        $.ajax({
            url: url,
            type: 'post',
            data: param,
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
                } else {
                    $.each(rowData, function (key) {
                        let fileSavename = "";
                        let thumbName = "thumb_";
                        if ( rowData[key].fileList.length > 0 ) {
                            fileSavename = rowData[key].fileList[0].fileSaveNm;
                            thumbName = thumbName + fileSavename;
                            if (rowData[key].mdopenyn == "Y" ) {
                                $("#rowlist").append(
                                    '<ons-list-item onclick="ItemAtchar.detailView(' + key + ');">\n' +
                                    '  <div class="left" >\n' +
                                    '       <img class="list-item__thumbnail item_list_img" src="/fileUpDownApi/display?filename=' + thumbName + '">\n' +
                                    '  </div>\n' +
                                    '  <div class="center item_list_left">\n' +
                                    '       <span class="list-item__title">' + rowData[key].itemnm + ' <span class="red">(' + '판매중' + ')</span></span>' +
                                    '       <span class="list-item__subtitle">' + rowData[key].makenm + ' | ' + rowData[key].carnm + ' | ' + rowData[key].yearnm + '연식</span>' +
                                    '       <span class="list-item__subtitle">모델 : ' + rowData[key].modelnm + '</span>\n' +
                                    '  </div>\n' +
                                    '</ons-list-item>'
                                );
                            } else {
                                $("#rowlist").append(
                                    '<ons-list-item>\n' +
                                    '  <div class="left" >\n' +
                                    '       <img class="list-item__thumbnail item_list_img" src="/fileUpDownApi/display?filename=' + thumbName + '">\n' +
                                    '  </div>\n' +
                                    '  <div class="center item_list_left">\n' +
                                    '       <span class="list-item__title gray">' + rowData[key].itemnm + ' <span class="red">(' + '판매완료' + ')</span></span>' +
                                    '       <span class="list-item__subtitle">' + rowData[key].makenm + ' | ' + rowData[key].carnm + ' | ' + rowData[key].yearnm + '연식</span>' +
                                    '       <span class="list-item__subtitle">모델 : ' + rowData[key].modelnm + '</span>\n' +
                                    '  </div>\n' +
                                    '</ons-list-item>'
                                );
                            }

                        } else {
                            if (rowData[key].mdopenyn == "Y" ) {
                                $("#rowlist").append(
                                    '<ons-list-item onclick="ItemAtchar.detailView(' + key + ');">\n' +
                                    '  <div class="left" >\n' +
                                    '       <!--<img class="list-item__thumbnail" src="/fileUpDownApi/display?filename=' + fileSavename + '">-->\n' +
                                    '  </div>\n' +
                                    '  <div class="center item_list_left">\n' +
                                    '       <span class="list-item__title">' + rowData[key].itemnm + ' <span class="red">(' + '판매중' + ')</span></span>' +
                                    '       <span class="list-item__subtitle">' + rowData[key].makenm + ' | ' + rowData[key].carnm + ' | ' + rowData[key].yearnm + '연식</span>' +
                                    '       <span class="list-item__subtitle">모델 : ' + rowData[key].modelnm + '</span>\n' +
                                    '  </div>\n' +
                                    '</ons-list-item>'
                                );
                            }  else {
                                $("#rowlist").append(
                                    '<ons-list-item>\n' +
                                    '  <div class="left" >\n' +
                                    '       <!--<img class="list-item__thumbnail" src="/fileUpDownApi/display?filename=' + fileSavename + '">-->\n' +
                                    '  </div>\n' +
                                    '  <div class="center item_list_left">\n' +
                                    '       <span class="list-item__title gray">' + rowData[key].itemnm + ' <span class="red">(' + '판매완료' + ')</span></span>' +
                                    '       <span class="list-item__subtitle">' + rowData[key].makenm + ' | ' + rowData[key].carnm + ' | ' + rowData[key].yearnm + '연식</span>' +
                                    '       <span class="list-item__subtitle">모델 : ' + rowData[key].modelnm + '</span>\n' +
                                    '  </div>\n' +
                                    '</ons-list-item>'
                                );
                            }
                        }
                    });
                    document.querySelector('ons-tabbar').setActiveTab('0');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    detailView : function (key) {
        $("#Tab2-VIEW").empty();

        let itgu = "";
        let partnum = "";
        let vinnum = "";
        let mountyn = "";
        let coloryn = "";
        let memo = "";

        if ( gv_logData[key].itgu == "R" ) {
            itgu = "재생품";
        } else {
            itgu = "중고품";
        }

        if ( gv_logData[key].partnum != "" ) {
            partnum = '<ons-list-item>파트넘버 : ' + gv_logData[key].partnum +  '</ons-list-item>\n';
        }

        if ( gv_logData[key].vinnum != "" ) {
            vinnum = '<ons-list-item>차대번호 : ' + gv_logData[key].vinnum +  '</ons-list-item>\n';
        }

        if ( gv_logData[key].mountyn != "" ) {
            mountyn = '<ons-list-item>장착가능여부 : ' + gv_logData[key].mountyn +  '</ons-list-item>\n';
        }

        if ( gv_logData[key].coloryn != "" ) {
            coloryn = '<ons-list-item>도색가능여부 : ' + gv_logData[key].coloryn +  '</ons-list-item>\n';
        }

        if ( gv_logData[key].memo != "" ) {
            memo = '<ons-list-item>상세정보 : ' + gv_logData[key].memo +  '</ons-list-item>\n';
        }

        $("#Tab2-VIEW").append('<ons-toolbar>\n' +
            '           <div class="center" style="color: #0e62c7;font-weight: bold">' + gv_logData[key].itemnm + '</div>\n' +
            '           <div class="right">' +
            '                   <span id="itgu_val">' + '관심해제' + '</span> ' +
            '                   <ons-switch input-id="viewOpt" ' +
            '                       ' + '' + ' style="margin-top: 16px;margin-right: 16px;" onchange="ItemAtchar.ViewOption('+ key +');">' +
            '                   </ons-switch>\n' +
            '           </div>' +
            '        </ons-toolbar>\n' +
            '        <ons-card class="card_op" style="margin-top: 52px">\n' +
            '            <ul id="img_file_list" class="down-list"></ul>\n' +
            '            <div style="clear:both;color: #2d4373">사진을 클릭하면 이미지가 확대되고, 확대된 이미지를 클릭하면 이미지가 축소됩니다.</div>\n' +
            '            <p class="btn_magin" style="clear:both;">\n' +
            '                <ons-button class="selbox_100" onclick="ItemAtchar.dataclose();">닫기</ons-button>\n' +
            '            </p>\n' +
            '            <div class="title" >\n' +
            '                <span style="color: #0e62c7;font-weight: bold">' + gv_logData[key].price.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +  '원</span>' +
            '                <span class="red"  style="font-size: 16px">(VAT별도) - ' + itgu + '</span>\n' +
            '            </div>\n' +
            '            <div class="content">\n' +
            '                <ons-list>\n' +
            '                    <ons-list-header> 차종: ' + gv_logData[key].makenm +  '  ' + gv_logData[key].carnm +  '</ons-list-header>\n' +
            '                    <ons-list-header>모델 : ' + gv_logData[key].modelnm +  '</ons-list-header>\n' +
            '                    <ons-list-item>연식 : ' + gv_logData[key].yearnm +  '</ons-list-item>\n' +
            '                    <ons-list-item>지역 : ' + gv_logData[key].areasinm + ' ' + gv_logData[key].areagunm +  '</ons-list-item>\n' +
            '                    <ons-list-item>판매처 : ' + gv_logData[key].comnm +  ' ' +
            '                            <!--&nbsp;&nbsp;&nbsp;&nbsp;<span onclick="ItemAtchar.ViewCom('+ key +');"><img src="/img/cominfo.png" style="width: 36px"></span>-->' +
            '                            &nbsp;&nbsp;&nbsp;&nbsp;<a href="tel:' + gv_logData[key].comphonelink +  '"><img src="/img/tel.png" style="width: 36px"></a></ons-list-item>\n' +
            '                    ' + partnum + vinnum + mountyn + coloryn + memo +
            '                </ons-list>\n' +
            '            </div>\n' +
            '            <p class="btn_magin">\n' +
            '                <ons-button class="selbox_100" onclick="ItemAtchar.dataclose();">닫기</ons-button>\n' +
            '            </p>\n' +
            '        </ons-card> ' +
            '       <div class="empty_hi"></div>');
        $("#Tab2-VIEW").show();

        ItemAtchar.ClickItemLogAdd(gv_logData[key].incomcd);
        ItemAtchar.fileListView(gv_logData[key].incomcd);
        ItemAtchar.MyItemYn(gv_logData[key].incomcd);
    },

    dataclose : function () {
        ItemAtchar.img_banner_End();
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

    btn_levelUp : function () {
        $.ajax({
            url: '/etcmng/memberApi/userLvlUp',
            type: 'post',
            data: {},
            success: function (data) {
                if ( data.result > 0 ) {
                   //fn.pageurl('/mobile/member/manage?active=success');
                    fn.pageurl('/mobile/guest/login');
                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    fileListView : function(code) {
        console.log("fileListView : " + code);
        $.ajax({
            url:'/fileUpDownApi/fileUploadList',
            type: 'post',
            data: {
                f_bId : code
            },
            success: function (data) {
                ItemAtchar.IMG_FileListTable(data.fileList);
            },
            error: function (data) {
                console.log(data);
            }
        });
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
                    "<img class='itemImg' src='/fileUpDownApi/display?filename=" + "" +  retObj.fileSaveNm + "' style='width:100px;height:100px' />";
                strHtml = strHtml + "</li>";
            }
        }
        $("#img_file_list").html(strHtml);
    },

    /*
    IMG_FileListTable : function(data) {
        $("#img_file_list").empty();
        let strHtml = "";
        let resultList = data ;
        if(resultList && resultList.length > 0) {
            for(let i=0; i < resultList.length; i++) {
                let retObj = resultList[i];
                strHtml = strHtml + "<li>";
                strHtml = strHtml + "   <img src='/fileUpDownApi/display?filename=" + retObj.fileSaveNm + "' " +
                    " style='width:90%' />";
                strHtml = strHtml + "</li>";
            }
        }
        $("#img_file_list").html("<ul>" + strHtml + "</ul>");

        if ( resultList.length > 1 ) {
            //ItemAtchar.img_banner_int();
        }
    },
    */

    img_banner_int : function() {
        $banner = $("#img_file_list").find("ul");
        $bannerWidth = $banner.children().outerWidth();//이미지의 폭
        $bannerHeight = $banner.children().outerHeight(); // 높이
        $length = $banner.children().length;//이미지의 갯수

        //정해진 초마다 함수 실행
        rollingId = setInterval(function() { ItemAtchar.img_banner_Start(); }, 3000);//다음 이미지로 롤링 애니메이션 할 시간차
    },

    img_banner_Start : function() {
        $banner.css("width", $bannerWidth * $length + "px");
        $banner.css("height", $bannerHeight + "px");
        //alert(bannerHeight);
        //배너의 좌측 위치를 옮겨 준다.
        $banner.animate({left: - $bannerWidth + "px"}, 1500, function() { //숫자는 롤링 진행되는 시간이다.
            //첫번째 이미지를 마지막 끝에 복사(이동이 아니라 복사)해서 추가한다.
            $(this).append("<li>" + $(this).find("li:first").html() + "</li>");
            //뒤로 복사된 첫번재 이미지는 필요 없으니 삭제한다.
            $(this).find("li:first").remove();
            //다음 움직임을 위해서 배너 좌측의 위치값을 초기화 한다.
            $(this).css("left", 0);
            //이 과정을 반복하면서 계속 롤링하는 배너를 만들 수 있다.
        });
    },

    img_banner_End : function() {
        clearInterval(rollingId);
    },

    ClickItemLogAdd : function(code) {
        console.log("ClickItemLogAdd : " + code);
        $.ajax({
            url:'/incom/incomingApi/clickitemIns',
            type: 'post',
            data: {
                incomcd : code,
                clickcnt : '12'
            },
            success: function (data) {
                console.log(data);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    MyItemLogAdd : function(code) {
        $.ajax({
            url:'/incom/incomingApi/myitemIns',
            type: 'post',
            data: {
                incomcd : code
            },
            success: function (data) {
                $("#itgu_val").html("관심해제");
                modal({
                    type: 'success',
                    title: 'Success',
                    text: "관심등록으로 변경합니다."
                });
                ItemAtchar.btn_search(1);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    MyItemLogDel : function(code) {
        $.ajax({
            url:'/incom/incomingApi/myitemDel',
            type: 'post',
            data: {
                incomcd : code
            },
            success: function (data) {
                $("#itgu_val").html("관심등록");
                modal({
                    type: 'success',
                    title: 'Success',
                    text: "관심해제로 변경합니다."
                });
                ItemAtchar.btn_search(1);
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    MyItemYn : function(code) {
        $.ajax({
            url:'/incom/incomingApi/myitemYn',
            type: 'post',
            data: {
                incomcd : code
            },
            success: function (data) {
               if ( data.dataState == 0 ) {
                   $("#itgu_val").html("관심등록");
                   $("input:checkbox[id='viewOpt']").prop("checked", false);
               } else {
                   $("#itgu_val").html("관심해제");
                   $("input:checkbox[id='viewOpt']").prop("checked", true);
               }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    ViewOption : function (key) {
        debugger;
        let incomcd = gv_logData[key].incomcd;
        let useyn = $("#viewOpt").is(":checked");
        if ( useyn ) {
            ItemAtchar.MyItemLogAdd(incomcd);
        } else {
            ItemAtchar.MyItemLogDel(incomcd);
        }
    },

    ViewCom : function (key) {
        modal({
            type: 'success',
            title: '판매자정보',
            text: '상호 : ' + gv_logData[key].comnm + '<br>대표자 : ' + gv_logData[key].usernm + '<br>연락처 : ' + gv_logData[key].comphonelink + '<br>'
        });
    },
}