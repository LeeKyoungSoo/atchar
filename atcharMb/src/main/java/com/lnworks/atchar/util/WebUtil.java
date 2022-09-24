package com.lnworks.atchar.util;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;


public class WebUtil {
    protected static final Logger log = LogManager.getLogger();

    /**
     * 전달된 파라미터에 맞게 난수를 생성한다
     * @param len : 생성할 난수의 길이
     * @param dupCd : 중복 허용 여부 (1: 중복허용, 2:중복제거)
     */
    public static String getTempPassword(int length) {
        int index = 0;
        char[] charArr = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a',
                'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                'w', 'x', 'y', 'z' };

        StringBuffer sb = new StringBuffer();

        for (int i = 0; i < length; i++) {
            index = (int) (charArr.length * Math.random());
            sb.append(charArr[index]);
        }

        return sb.toString();
    }

    /**
     * 파일다운로드
     *
     * @param file
     * @param fileNm
     */
    public static void downFile(File file, String fileNm) {
        downFile(file, fileNm, false);
    }


    /**
     * 파일다운로드
     *
     * @param file
     * @param fileNm
     * @param isDelFile
     */
    public static void downFile(File file, String fileNm, boolean isDelFile) {
        try {
            HttpServletRequest req = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            HttpServletResponse res = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();

            res.reset();

            res.setContentType("application/octet-stream; charset=utf-8");
            res.setContentLength((int)file.length());
            res.setHeader("Content-Transfer-Encoding", "binary");

            // 파일 인코딩
            String browser = req.getHeader("User-Agent");
            if(browser.contains("MSIE") || browser.contains("Trident") || browser.contains("Edge")){
                fileNm = URLEncoder.encode(fileNm,"UTF-8").replaceAll("\\+", "%20");
            } else {
                if (System.getProperty("catalina.home") != null) {
                    // Tomcat
                    fileNm = new String(fileNm.getBytes("UTF-8"), "ISO-8859-1");
                }
            }

            res.setHeader("Content-Disposition", "attachment;fileName=\"" + fileNm + "\"");

            OutputStream os = res.getOutputStream();
            FileInputStream fis = new FileInputStream(file);

            FileCopyUtils.copy(fis, os);
        } catch (UnsupportedEncodingException e) {
            log.error("UnsupportedEncodingException");
            throw new SystemException(e);
        } catch (IOException e) {
            log.error("IOException");
            throw new SystemException(e);
        } catch (RuntimeException e) {
            log.error("RuntimeException");
            throw new SystemException(e);
        } finally {
            if (isDelFile && file != null && file.exists()) {
                file.delete();
            }
        }
    }
}

