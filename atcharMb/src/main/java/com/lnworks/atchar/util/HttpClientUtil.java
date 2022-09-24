package com.lnworks.atchar.util;

import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.HttpEntityEnclosingRequest;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.methods.*;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class HttpClientUtil {
    protected static final Logger log = LogManager.getLogger();

    public enum Method {
        GET,
        POST,
        PUT,
        DELETE;
    }

    /*
    - HTTP Status 코드로 에러를 정의한다.
    - 200 OK : 성공
    - 204 No Content : 데이터 없음
    - 205 Reset Content : 콘텐츠 재설정
    - 400 Bad Request : 잘못된 요청
    - 401 Unauthorized : 인증실패
    - 403 Forbidden : 권한없음
    - 404 Not Found : 요청 URL 없음
    - 405 Method Not Allowed : 제한된 메소드 요청
    - 409 Conflict : 리소스 충돌
    - 410 Gone : 삭제된 API
    - 423 Locked : 토큰 만료
    - 500 Internal Server Error : 내부 서버 에러
    */

    /**
     * get
     *
     * @param url
     * @param paramMap
     * @return
     */
    public static BaseMap get(String url, BaseMap paramMap) {
        return HttpClientUtil.call(Method.GET, url, paramMap);
    }

    /**
     * post
     *
     * @param url
     * @param paramMap
     * @return
     */
    public static BaseMap post(String url, BaseMap paramMap) {
        return HttpClientUtil.call(Method.POST, url, paramMap);
    }

    /**
     * put
     *
     * @param url
     * @param paramMap
     * @return
     */
    public static BaseMap put(String url, BaseMap paramMap) {
        return HttpClientUtil.call(Method.PUT, url, paramMap);
    }

    /**
     * delete
     *
     * @param url
     * @param paramMap
     * @return
     */
    public static BaseMap delete(String url, BaseMap paramMap) {
        return HttpClientUtil.call(Method.DELETE, url, paramMap);
    }

    @SuppressWarnings("deprecation")
    private static BaseMap call(Method method, String pUrl, BaseMap paramMap) {
        HttpUriRequest httpUriRequest = null;
        CloseableHttpResponse response = null;
        BaseMap resMap = null;

        try {
            String url = pUrl;

            List<BasicNameValuePair> paramList = null;
            String cUrl = null;

            switch(method) {
                case GET :
                    paramList = new ArrayList<>();
                    for (int i = 0, j = paramMap.size(); i < j; i++) {
                        paramList.add(new BasicNameValuePair(paramMap.get(i).toString(), paramMap.getValue(i).toString()));
                    }
                    cUrl = new StringBuffer(url).append("?").append(URLEncodedUtils.format(paramList, "UTF-8")).toString();

                    httpUriRequest = new HttpGet(cUrl);
                    break;
                case POST :
                    httpUriRequest = new HttpPost(url);
                    HttpClientUtil.setEntity(httpUriRequest, paramMap);
                    break;
                case PUT :
                    httpUriRequest = new HttpPut(url);
                    HttpClientUtil.setEntity(httpUriRequest, paramMap);
                    break;
                case DELETE :
                    httpUriRequest = new HttpDelete(url);
                    HttpClientUtil.setEntity(httpUriRequest, paramMap);
                    break;
                default :
                    throw new SystemException();
            }

            log.info("========================================================");
            log.info("※ HttpClient Call Start !!!");
            log.info("1. URL : " + method + " " + url);
            log.info("2. Param : " + paramMap);

            CloseableHttpClient httpclient = HttpClients.createDefault();
            response = httpclient.execute(httpUriRequest);

            StatusLine statusLine = response.getStatusLine();
            int statusCode = statusLine.getStatusCode();

            if (statusCode != HttpStatus.SC_OK) {
                log.error("response : " + statusLine);
                log.error(statusLine.getReasonPhrase());

                String msg = statusLine.toString();
                log.error(msg);
                throw new SystemException();
            }

            HttpEntity entity = response.getEntity();
            String jsonStr = EntityUtils.toString(entity);
            EntityUtils.consume(entity);

            //log.info("3. Result JSON : " + jsonStr);
            log.info("※ Call End !!!");
            log.info("========================================================");

            Gson gsonObj = new Gson();
            resMap = gsonObj.fromJson(jsonStr, BaseMap.class);
        } catch (IOException e) {
            e.printStackTrace();
            log.error("IOException");
            throw new SystemException();
        } catch (RuntimeException e) {
            log.error("RuntimeException");
            throw e;
        } finally {
            if (response != null) {
                try {
                    response.close();
                } catch (IOException e) {
                    log.error("response.close() Error");
                }
            }
        }

        return resMap;
    }

    private static void setEntity(HttpUriRequest httpUriRequest, BaseMap paramMap) {
        Gson gsonObj = new Gson();
        ((HttpEntityEnclosingRequest)httpUriRequest).setEntity(new StringEntity(gsonObj.toJson(paramMap), ContentType.APPLICATION_JSON));
    }
}

