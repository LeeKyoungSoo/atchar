/*
* totalCnt 데이터 전체 개수
* currentPage 현재 선택 페이지
* dataPerPage 페이지 한개의 데이터 개수
* pageCount 나열할 페이지 목록
* tagId 적용할 테그아이디
* choiseCls 현재 선택 페이지 적용 Class
* functionName 호출 함수명
* */
function paging(totalCnt, currentPage, dataPerPage, pageCount, tagId, choiseCls, functionName) {
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
}




