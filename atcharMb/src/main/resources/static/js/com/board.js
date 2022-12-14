let gv_rowDataList;

let Board = {
    dataList : function (viewId) {
        $.ajax({
            url: '/bbsApi/bbsDataList',
            type: 'post',
            data: {
                gubun : '002',
                pageNum : '1',
                pageSize : '100'
            },
            success: function (data) {
                gv_rowDataList = data.dataList;
                $("#" + viewId).empty();
                if (gv_rowDataList.length > 0 ) {
                    $.each(gv_rowDataList, function (key) {
                        $("#" + viewId).append(
                            '<ons-list-item onclick="Board.detailView(' + key + ');">\n' +
                            '  <div class="center">\n' +
                            '       <span class="list-item__title">' + gv_rowDataList[key].subject + '</span>' +
                            '       <span class="list-item__subtitle">' + gv_rowDataList[key].regDt  + '</span>\n' +
                            '  </div>\n' +
                            '</ons-list-item>'
                        );
                    });
                }
                else {

                }
            },
            error: function (data) {
                console.log(data);
            }
        });
    },

    detailView : function (key) {
        $("#Tab2-VIEW").empty();
        $("#Tab2-VIEW").append('<ons-toolbar>\n' +
            '           <div class="center" style="font-size: 16px;">' + gv_rowDataList[key].subject + '</div>\n' +
            '        </ons-toolbar>\n' +
            '        <ons-card class="card_op">\n' +
            '            <div class="content">\n' +
            '                <ons-list>\n' +
            '                    <ons-list-header>' + gv_rowDataList[key].regDt +  '</ons-list-header>\n' +
            '                    <ons-list-item>' + gv_rowDataList[key].cont +  '</ons-list-item>\n' +
            '                </ons-list>\n' +
            '            </div>\n' +
            '            <p class="btn_magin">\n' +
            '                <ons-button class="selbox_100" onclick="Board.dataclose();">??????</ons-button>\n' +
            '            </p>\n' +
            '        </ons-card>');
        $("#Tab2-VIEW").show();

    },

    dataclose : function () {
        $("#Tab2-VIEW").hide();
    },

    /*
    * totalCnt ????????? ?????? ??????
    * currentPage ?????? ?????? ?????????
    * dataPerPage ????????? ????????? ????????? ??????
    * pageCount ????????? ????????? ??????
    * tagId ????????? ???????????????
    * choiseCls ?????? ?????? ????????? ?????? Class
    * functionName ?????? ?????????
    * */
    paging : function(totalCnt, currentPage, dataPerPage, pageCount, tagId, choiseCls, functionName) {
        let strHtml = "";
        const totalPage = Math.ceil(totalCnt / dataPerPage);
        const pageGroup = Math.ceil(currentPage / pageCount);
        const pages = $("#" + tagId);
        pages.empty();

        let last = pageGroup * pageCount;
        if ( last > totalPage ) {
            last = totalPage;
        }
        let first = last - ( pageCount - 1);
        const next = last + 1;
        const prev = first - 1;

        if ( totalPage < 1 ) {
            first = last;
        }

        strHtml += '<p>';
        //console.log(prev,  first);
        if (first > pageCount || prev > 0 ) {
            //pages.append('<a class="btn-prev" onclick="goToPage(' + prev + ')"></a>');
            strHtml += '<a class="btn-prev" onclick="' + functionName + '(' + prev + ')" style="cursor: pointer"></a>';
        }

        for ( let i = first; i <= last; i++) {
            if ( currentPage == i ) {
                //pages.append('<a class="' + choiseCls + '" onclick="goToPage(' + i + ')">' + i + '</a>');
                strHtml += '<a class="' + choiseCls + '" onclick="' + functionName + '(' + i + ')" style="cursor: pointer">' + i + '</a>'
            }
            else if ( i > 0 ) {
                //pages.append('<a onclick="goToPage(' + i + ')">' + i + '</a>');
                strHtml += '<a onclick="' + functionName + '(' + i + ')" style="cursor: pointer">' + i + '</a>';
            }
        }

        if (next > pageCount && next < totalPage) {
            //pages.append('<a class="btn-next" onclick="goToPage(' + next + ')"></a>');
            strHtml += '<a class="btn-next" onclick="' + functionName + '(' + next + ')" style="cursor: pointer"></a>';
        }
        strHtml += '</p>';
        pages.html(strHtml);
    },

}





