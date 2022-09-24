let pcn_accessToken="";
const pcn_server = "http://sandbox.procarenote.com";

function failMessage (type, send, error ){
    console.log("failMessage type : " + type);
    console.log("failMessage send : " + send);
    console.log("failMessage error : " + error);
    console.log("failMessage error response : " + error.response);
}

function apiMessage ( type, send, data ){
    console.log("apiMessage type : " + type);
    console.log("apiMessage send : " + send);
    console.log("apiMessage data : " + data);
}


/**
 * accessToken 취득 API [POST]
 * @param serverURL
 */
function apiToken(serverURL) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            "url": serverURL + "/gateway/bethesdasoft/auth/token",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": JSON.stringify({
                "secretKey": "911eea266daa4ea2817ab9a3a7a2c238"
            }),
            success: function (data) {
                console.log("success : " + data.code);
                console.log("success : " + data.data.accessToken);
                pcn_accessToken = data.data.accessToken;
                $("#pcn_accessToken").text(pcn_accessToken)
                apiMessage ( "accessToken 취득",
                    JSON.stringify({"secretKey": "911eea266daa4ea2817ab9a3a7a2c238"}) ,
                    JSON.stringify(data.data)
                )
            },
            error: function (error) {
                pcn_accessToken = "";
                $("#pcn_accessToken").text("")
                failMessage ("accessToken 취득",JSON.stringify({"secretKey": "911eea266daa4ea2817ab9a3a7a2c238"}) , error )
            },
            complete: function () {
                console.log("complete!!");
                resolve("complete!!");
            }
        });
    })
}




/**
 * 연구정보 [GET]
 * @param serverURL
 * @param studyId
 */
async function apiAeStudy(serverURL, studyId) {

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/study/"+ studyId,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer "+pcn_accessToken,
            "Content-Type": "application/json"
        },
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "연구정보",
                serverURL + "/gateway/bethesdasoft/study/"+ studyId,
                JSON.stringify(data.data)
            )
        },
        error: function (  error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ("연구정보",serverURL + "/gateway/bethesdasoft/study/"+ studyId,  error )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 연구대상자 등록 [PUT]
 * @param serverURL
 * @param studyId
 * @param prtcpntId
 * @param mobileNumber
 * @param status
 */
async function apiSubjectCreate(serverURL, studyId, prtcpntId, mobileNumber, status) {

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/"+ studyId +"/subject",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer "+pcn_accessToken,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "subjectKey": prtcpntId,
            "subjectStatus": status,
            "mappingKeyType": "Mobile",
            "mappingKeyCode": mobileNumber
        }),
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "3.연구대상자 등록",
                JSON.stringify({
                    "subjectKey": prtcpntId,
                    "subjectStatus": status,
                    "mappingKeyType": "Mobile",
                    "mappingKeyCode": mobileNumber
                }),
                JSON.stringify(data.data)
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ("3.연구대상자 등록",
                JSON.stringify({
                    "subjectKey": prtcpntId,
                    "subjectStatus": status,
                    "mappingKeyType": "Mobile",
                    "mappingKeyCode": mobileNumber
                }),  error )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 연구대상자 조회 [GET]
 * @param serverURL
 * @param studyId
 * @param prtcpntId
 */
async function apiSubjectRead(serverURL, studyId, prtcpntId) {

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/"+ studyId +"/subject/"+ prtcpntId,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer "+ pcn_accessToken,
        },
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "4. 연구대상자 조회",
                serverURL + "/gateway/bethesdasoft/"+ studyId +"/subject/"+ prtcpntId,
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ("4. 연구대상자 조회",serverURL + "/gateway/bethesdasoft/study/"+ studyId,  error )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 연구대상자 상태변경 [POST]
 * @param serverURL
 * @param studyId
 * @param prtcpntId
 */
async function apiSubjectUpdate(serverURL, studyId, prtcpntId, status) {

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/"+ studyId +"/subject/"+ prtcpntId +"/subject-status",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer "+pcn_accessToken,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "subjectStatus": status
        }),
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "5. 연구대상자 상태변경",
                JSON.stringify({ "subjectStatus": status}),
                JSON.stringify(data.data)
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ( "5. 연구대상자 상태변경",
                JSON.stringify({ "subjectStatus": status}),
                error
            )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 이상반응 메시지 확인 [POST]
 * @param serverURL
 * @param ae_messageNo
 */
async function apiMessageReadCheck(serverURL, ae_messageNo) {

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/aemessage/" + ae_messageNo + "/message-status",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + pcn_accessToken,
        },
        success: function (data) {
            console.log("success : " + data.code);
            console.log("success : " + data.data.messageNo);
            console.log("success : " + data.data.messageStatus);
            apiMessage ( "6. 이상반응 메시지 확인",
                serverURL + "/gateway/bethesdasoft/aemessage/" + ae_messageNo + "/message-status",
                JSON.stringify(data.data)
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ( "6. 이상반응 메시지 확인",
                serverURL + "/gateway/bethesdasoft/aemessage/" + ae_messageNo + "/message-status",
                error
            )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 이상반응 메시지 답변 작성 [PUT]
 * @param serverURL
 * @param studyId
 * @param prtcpntId
 */
async function apiMessageComment(serverURL, studyId, prtcpntId, type, answer) {
    if ( answer == "") {
        alert("전송할 답변 내용을 작성해 주십시오");
        return;
    }

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/aemessage",
        "method": "PUT",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + pcn_accessToken,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "studyCode": studyId,
            "subjectKey": prtcpntId,
            "mediaType": type,
            "body": answer
        }),
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "7. 이상반응 메시지 답변 작성",
                JSON.stringify({
                    "studyCode": studyId,
                    "subjectKey": prtcpntId,
                    "mediaType": type,
                    "body": answer
                }),
                JSON.stringify(data.data)
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ( "7. 이상반응 메시지 답변 작성",
                JSON.stringify({
                    "studyCode": studyId,
                    "subjectKey": prtcpntId,
                    "mediaType": type,
                    "body": answer
                }),
                error
            )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 이상반응 연동정보 설정 및 변경
 * @param serverURL
 * @param studyId
 * @param prtcpntId
 * @param mobileNumber
 * @returns {Promise<void>}
 */
async function apiMappingConnect(serverURL, studyId, prtcpntId, mobileNumber) {
    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/"+ studyId +"/subject/"+ prtcpntId +"/connect",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + pcn_accessToken,
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "mappingKeyType": "Mobile",
            "mappingKeyCode": mobileNumber
        }),
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "8. 이상반응 연동정보 설정 및 변경",
                JSON.stringify({ "mappingKeyType": "Mobile", "mappingKeyCode": mobileNumber}),
                JSON.stringify(data.data)
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ( "8. 이상반응 연동정보 설정 및 변경",
                JSON.stringify({ "mappingKeyType": "Mobile", "mappingKeyCode": mobileNumber}),
                error
            )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}

/**
 * 이상반응 연동정보 설정해제
 * @param serverURL
 * @param studyId
 * @param prtcpntId
 * @returns {Promise<void>}
 */
async function apiMappingDisconnect(serverURL, studyId, prtcpntId) {

    if( pcn_accessToken == "" ) {
        let returnVal = await apiToken(serverURL);
        console.log("returnVal : " + returnVal);
    }

    $.ajax({
        "url": serverURL + "/gateway/bethesdasoft/"+ studyId +"/subject/"+ prtcpntId +"/disconnect",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Authorization": "Bearer " + pcn_accessToken,
            "Content-Type": "application/json"
        },
        "data": {},
        success: function (data) {
            console.log("success : " + data);
            apiMessage ( "9. 이상반응 연동정보 설정해제",
                '',
                JSON.stringify(data.data)
            )
        },
        error: function (error) {
            console.log("error : " + error.code);
            console.log("error : " + error.message);
            failMessage ( "9. 이상반응 연동정보 설정해제",
                '',
                error
            )
        },
        complete: function () {
            console.log("complete!!");
        }
    });
}