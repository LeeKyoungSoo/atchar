package com.lnworks.atchar.util;

import com.lnworks.atchar.common.domain.FileVO;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

public class FileUpload {

    /**
     * 파일 업로드 처리
     * @param multiRequest
     * @param fileStorePath
     * @param path
     * @return
     */
    public static BaseMap uploadFileMap(MultipartHttpServletRequest multiRequest, String fileStorePath, String path) {
        String filePath = null;
        BaseMap resultMap = new BaseMap();
        String saveFileNm = DateTimeUtil.getNowDateTime();
        String subDir = saveFileNm.substring(0, 8);

        try {
            String fileStorePathStr = fileStorePath;

            if (path != null && !path.equals("")) {
                fileStorePathStr += File.separator + path + File.separator + subDir;
            }

            File uploadPath = new File(fileStorePathStr);

            if (!uploadPath.exists())
                uploadPath.mkdirs();

            int fileIdx = 1;

            List<FileVO> result = new ArrayList<FileVO>();
            final Map<String, MultipartFile> fileMap = multiRequest.getFileMap();
            for (Map.Entry<String, MultipartFile> entry : fileMap.entrySet()) {
                MultipartFile mFile = entry.getValue();

                String atchFileIdString = mFile.getName();
                String orginFileName = mFile.getOriginalFilename();
                // --------------------------------------
                // 원 파일명이 없는 경우 처리
                // (첨부가 되지 않은 input file type)
                // --------------------------------------
                if ("".equals(orginFileName)) {
                    continue;
                }
                // //------------------------------------

                int index = orginFileName.lastIndexOf(".");
                String fileExt = orginFileName.substring(index + 1);
                //String newName = DateTimeUtil.getNowDateTime() + String.format("%03d", fileIdx);
                String newName = saveFileNm + "." + fileExt;
                long _size = mFile.getSize();

                if (!"".equals(orginFileName)) {
                    filePath = fileStorePathStr + File.separator + newName;
                    mFile.transferTo(new File(filePath));

                    Thumbnail thumbnail = new Thumbnail();
                    thumbnail.makeThumbnail(uploadPath.getAbsolutePath(), newName, fileExt);
                }

                FileVO fvo = new FileVO();
                fvo.setFileExtsn(fileExt);
                fvo.setFileStreCours(fileStorePathStr);
                fvo.setFileMg(Long.toString(_size));
                fvo.setOrignlFileNm(orginFileName);
                fvo.setStreFileNm(newName);
                fvo.setAtchFileId(atchFileIdString);
                fvo.setFileSn(String.format("%03d", fileIdx));

                result.add(fvo);

                fileIdx++;
            }

            resultMap.put("_FILE_INFO", result);
            Enumeration<?> e = multiRequest.getParameterNames();

            while (e.hasMoreElements()) {
                String key = (String) e.nextElement();
                //if (Constants.SYSTEM_PROJECT_ID.equals(key)) {
                //    continue;
                //}
                String[] values = multiRequest.getParameterValues(key);
                resultMap.put(key, values.length == 1 ? values[0] : values);
            }
        } catch (IOException e1) {
            File file = new File(filePath);
            if (file.exists() && file.canWrite()) {
                file.delete();
            }
            throw new SystemException(e1);
        } catch (RuntimeException e) {
            File file = new File(filePath);
            if (file.exists() && file.canWrite()) {
                file.delete();
            }
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return resultMap;
    }

    public static int uploadFileDel(String fileName, String fileStorePath, String path) {
        int nReturn = 0;
        try {
            String fileStorePathStr = fileStorePath;
            if (path != null && !path.equals("")) {
                fileStorePathStr += File.separator + path;
            }

            String subDir = fileName.substring(0, 8);
            String filePath = fileStorePathStr + File.separator + subDir + File.separator + fileName;
            File file = new File(filePath);
            if (file.exists() && file.canWrite()) {
                file.delete();
                nReturn++;
            }

            String thumb_filePath = fileStorePathStr + File.separator  + subDir + File.separator + "thumb_" +fileName;
            File thumb_file = new File(thumb_filePath);
            if (thumb_file.exists() && thumb_file.canWrite()) {
                thumb_file.delete();
                nReturn++;
            }
        } catch (RuntimeException e) {
            //e.printStackTrace();
        }

        return nReturn;
    }
}
