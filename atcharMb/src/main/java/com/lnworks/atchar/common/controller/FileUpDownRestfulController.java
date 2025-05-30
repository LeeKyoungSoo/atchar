package com.lnworks.atchar.common.controller;

import com.lnworks.atchar.common.domain.FileUpDownVO;
import com.lnworks.atchar.common.domain.FileVO;
import com.lnworks.atchar.common.service.FileUpDownService;
import com.lnworks.atchar.util.BaseMap;
import com.lnworks.atchar.util.DateTimeUtil;
import com.lnworks.atchar.util.FileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/fileUpDownApi")
public class FileUpDownRestfulController {
    private static String OS = System.getProperty("os.name").toLowerCase();

    @Value("${excel.fileDownPath.window}")
    private String fileDownPathWin;

    @Value("${excel.fileDownPath.linux}")
    private String fileDownPathLinux;

    @Autowired
    FileUpDownService fileUpDownService;
    
    @PostMapping("/fileDelete")
    public HashMap goBbsFileDelete(FileUpDownVO fileUpDownVO) throws Exception {
        HashMap resultMap = new HashMap<>();
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;

        FileUpload.uploadFileDel(fileUpDownVO.getFileSaveNm(), fileDownPath, "BBS");

        int resultCode = fileUpDownService.delFileData(fileUpDownVO);

        resultMap.put("fileList", fileUpDownService.getFileDataList(fileUpDownVO));
        resultMap.put("resultCode", resultCode);
        resultMap.put("resultMsg", "삭제되었습니다.");

        return  resultMap;
    }

    @GetMapping("/fileDownloadId/{fileId}")
    public ResponseEntity<Resource> goBbsFileDownload(@PathVariable("fileId") int fid) throws Exception {
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;

        FileUpDownVO fileUpDownVO = new FileUpDownVO();
        fileUpDownVO.setFId(fid);
        fileUpDownVO = fileUpDownService.getFileData(fileUpDownVO);

        String subDir = fileUpDownVO.getFileSaveNm().substring(0, 8);
        fileDownPath += File.separator + "BBS" + File.separator + subDir + File.separator + fileUpDownVO.getFileSaveNm();
        Path path = Paths.get(fileDownPath);
        Resource resource = new InputStreamResource(Files.newInputStream(path));
        String fileNameOrg = new String(fileUpDownVO.getFileOrgNm().getBytes("UTF-8"), "ISO-8859-1");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileNameOrg + "\"")
                .body(resource);
    }

    @GetMapping("/fileDownloadName/{fileName}")
    public ResponseEntity<Resource> fileDownload(@PathVariable("fileName") String fNm) throws Exception {
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;

        fileDownPath += File.separator + "files" + File.separator + fNm;
        Path path = Paths.get(fileDownPath);
        Resource resource = new InputStreamResource(Files.newInputStream(path));
        String fileNameOrg = new String(fNm.getBytes("UTF-8"), "ISO-8859-1");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileNameOrg + "\"")
                .body(resource);
    }

    @GetMapping("/bbsFileDownload/All")
    public ResponseEntity<Resource> goBbsFileDownload(@RequestParam(value="f_fidList") String fidArr) throws Exception {
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;
        String subDir = "BBS";
        String fileDownPathSub = fileDownPath + File.separator + subDir;

        ZipOutputStream zout = null;
        String zipName = "BBS_DonloadFile_" + DateTimeUtil.getNowDate() + ".zip";
        zout = new ZipOutputStream(new FileOutputStream(fileDownPathSub  + File.separator + zipName));
        byte[] buffer = new byte[1024];
        FileInputStream in = null;

        String[] fidList = fidArr.split(",");
        if ( fidList.length > 0 ) {
            FileUpDownVO fileUpDownVO = new FileUpDownVO();
            for (String fid : fidList) {
                int nFid = Integer.parseInt(fid);
                fileUpDownVO.setFId(nFid);
                fileUpDownVO = fileUpDownService.getFileData(fileUpDownVO);

                String fileNameSave = fileDownPathSub+ File.separator + fileUpDownVO.getFileSaveNm();
                String fileNameOrg = fileUpDownVO.getFileOrgNm();
                //String fileNameOrg = new String(fileUpDownVO.getFileOrgNm().getBytes("UTF-8"), "ISO-8859-1");
                in = new FileInputStream(fileNameSave); //압축 대상 파일
                zout.putNextEntry(new ZipEntry(fileNameOrg)); //압축파일에 저장될 파일명
                int len;
                while ((len = in.read(buffer)) > 0) {
                    zout.write(buffer, 0, len); //읽은 파일을 ZipOutputStream에 Write
                }
                zout.closeEntry();
                in.close();
            }
            zout.close();

            Path path = Paths.get(fileDownPathSub  + File.separator + zipName);
            Resource resource = new InputStreamResource(Files.newInputStream(path));
            FileUpload.uploadFileDel(zipName, fileDownPath, subDir);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("application/octet-stream"))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zipName + "\"")
                    .body(resource);
        }
        else {
            return  null;
        }
    }

    @PostMapping(value="/fileUpload", consumes="multipart/form-data")
    public HashMap<String, Object>  goBbsFileUpload(MultipartHttpServletRequest multiRequest) throws Exception {
        HashMap<String, Object> resultMap = new HashMap<>();
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;
        int resultCode = 0;
        BaseMap map = FileUpload.uploadFileMap(multiRequest, fileDownPath, "BBS");

        if (!map.isEmpty()) {
            List<FileVO> fileList = map.getFileInfo();
            if (fileList != null) {
                for (FileVO fileVo : fileList) {
                    FileUpDownVO fileUpDownVO = new FileUpDownVO();
                    fileUpDownVO.setFileOrgNm(fileVo.getOrignlFileNm());
                    fileUpDownVO.setFileSaveNm(fileVo.getStreFileNm());
                    fileUpDownVO.setFileSize(fileVo.getFileMg());
                    fileUpDownVO.setBId(map.get("bId").toString());
                    resultCode += fileUpDownService.intFileData(fileUpDownVO);
                }
            }
        }

        FileUpDownVO fileDataListVO = new FileUpDownVO();
        fileDataListVO.setBId(map.get("bId").toString());
        resultMap.put("fileList", fileUpDownService.getFileDataList(fileDataListVO));
        resultMap.put("resultCode", resultCode);
        resultMap.put("resultMsg", "등록되었습니다.");

        return  resultMap;
    }

    @PostMapping("/fileUploadOneChg")
    public HashMap goBbsFileUploadOneChg(final MultipartHttpServletRequest multiRequest, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;
        int resultCode = 0;
        HttpSession session = request.getSession();
        multiRequest.setAttribute("bId", session.getAttribute("userId").toString());

        FileUpDownVO fileUpDownVO = new FileUpDownVO();
        fileUpDownVO.setBId(session.getAttribute("userId").toString());
        List<FileUpDownVO> fileList = fileUpDownService.getFileDataList(fileUpDownVO);
        if ( fileList.size() > 0 ) {
            FileUpDownVO delfileUpDownVO = fileList.get(0);
            FileUpload.uploadFileDel(delfileUpDownVO.getFileSaveNm(), fileDownPath, "BBS");
            int delCode = fileUpDownService.delFileData(delfileUpDownVO);
        }

        BaseMap map = FileUpload.uploadFileMap(multiRequest, fileDownPath, "BBS");
        if (map != null) {
            List<FileVO> infileList = map.getFileInfo();
            if (infileList != null) {
                for (FileVO fileVo : infileList) {
                    FileUpDownVO inFileUpDownVO = new FileUpDownVO();
                    inFileUpDownVO.setFileOrgNm(fileVo.getOrignlFileNm());
                    inFileUpDownVO.setFileSaveNm(fileVo.getStreFileNm());
                    inFileUpDownVO.setFileSize(fileVo.getFileMg());
                    inFileUpDownVO.setBId(map.get("bId").toString());
                    resultCode += fileUpDownService.intFileData(inFileUpDownVO);
                }
            }
        }

        resultMap.put("resultCode", resultCode);
        resultMap.put("resultMsg", "등록되었습니다.");

        return  resultMap;
    }

    @PostMapping("/fileUploadList")
    public HashMap goFileUploadList(FileUpDownVO fileUpDownVO) throws Exception {
        HashMap resultMap = new HashMap<>();

        fileUpDownVO.setBId(fileUpDownVO.getF_bId());
        resultMap.put("fileList", fileUpDownService.getFileDataList(fileUpDownVO));

        return  resultMap;
    }

    @GetMapping("/display")
    public ResponseEntity<Resource> display(@RequestParam("filename") String filename) {
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;
        String pathSe = OS.contains("win") ? "\\" : "/";
        String subDir = "BBS";

        if ( filename.contains("thumb") ) {
            subDir +=  File.separator + filename.substring(6,14);
        } else {
            subDir +=  File.separator + filename.substring(0,8);
        }
        String fileDownPathSub = fileDownPath + File.separator + subDir + pathSe;

        Resource resource = new FileSystemResource(fileDownPathSub + filename);
        if(!resource.exists())
            return new ResponseEntity<Resource>(HttpStatus.NOT_FOUND);
        HttpHeaders header = new HttpHeaders();
        Path filePath = null;
        try{
            filePath = Paths.get(fileDownPathSub + filename);
            header.add("Content-type", Files.probeContentType(filePath));
        }catch(IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<Resource>(resource, header, HttpStatus.OK);
    }
}
