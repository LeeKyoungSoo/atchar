package com.lnworks.atchar.etcmng.controller;

import com.lnworks.atchar.common.domain.FileVO;
import com.lnworks.atchar.etcmng.domain.BoardFileVO;
import com.lnworks.atchar.etcmng.domain.BoardVO;
import com.lnworks.atchar.etcmng.service.BbsBoardService;
import com.lnworks.atchar.util.BaseMap;
import com.lnworks.atchar.util.DateTimeUtil;
import com.lnworks.atchar.util.FileUpload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/bbsApi")
public class BbsBoardRestfulController {
    private static String OS = System.getProperty("os.name").toLowerCase();
    private static final String TAG_USER = "METADATA";

    @Value("${excel.fileDownPath.window}")
    private String fileDownPathWin;

    @Value("${excel.fileDownPath.linux}")
    private String fileDownPathLinux;

    @Autowired
    BbsBoardService bbsBoardService;

    @PostMapping("/bbsFileDelete")
    public HashMap goBbsFileDelete(BoardFileVO boardFileVO) throws Exception {
        HashMap resultMap = new HashMap<>();
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;

        FileUpload.uploadFileDel(boardFileVO.getFileSaveNm(), fileDownPath, "BBS");

        int resultCode = bbsBoardService.delFileData(boardFileVO);

        resultMap.put("fileList", bbsBoardService.getFileDataList(boardFileVO));
        resultMap.put("resultCode", resultCode);
        resultMap.put("resultMsg", "삭제되었습니다.");

        return  resultMap;
    }

    @GetMapping("/bbsFileDownload/{fileId}")
    public ResponseEntity<Resource> goBbsFileDownload(@PathVariable("fileId") int fid) throws Exception {
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;

        BoardFileVO boardFileVO = new BoardFileVO();
        boardFileVO.setFId(fid);
        boardFileVO = bbsBoardService.getFileData(boardFileVO);
        fileDownPath += File.separator + "BBS" + File.separator + boardFileVO.getFileSaveNm();
        Path path = Paths.get(fileDownPath);
        Resource resource = new InputStreamResource(Files.newInputStream(path));
        String fileNameOrg = new String(boardFileVO.getFileOrgNm().getBytes("UTF-8"), "ISO-8859-1");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileNameOrg + "\"")
                .body(resource);
    }

    @GetMapping("/fileDownload/{fileName}")
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
            BoardFileVO boardFileVO = new BoardFileVO();
            for (String fid : fidList) {
                int nFid = Integer.parseInt(fid);
                boardFileVO.setFId(nFid);
                boardFileVO = bbsBoardService.getFileData(boardFileVO);

                String fileNameSave = fileDownPathSub+ File.separator + boardFileVO.getFileSaveNm();
                String fileNameOrg = boardFileVO.getFileOrgNm();
                //String fileNameOrg = new String(boardFileVO.getFileOrgNm().getBytes("UTF-8"), "ISO-8859-1");
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

    @PostMapping("/bbsFileUpload")
    public HashMap goBbsFileUpload(final MultipartHttpServletRequest multiRequest) throws Exception {
        HashMap resultMap = new HashMap<>();
        String fileDownPath = OS.contains("win") ? fileDownPathWin : fileDownPathLinux;
        int resultCode = 0;
        BaseMap map = FileUpload.uploadFileMap(multiRequest, fileDownPath, "BBS");

        if (map != null) {
            List<FileVO> fileList = map.getFileInfo();
            if (fileList != null) {
                for (FileVO fileVo : fileList) {
                    BoardFileVO boardFileVO = new BoardFileVO();
                    boardFileVO.setFileOrgNm(fileVo.getOrignlFileNm());
                    boardFileVO.setFileSaveNm(fileVo.getStreFileNm());
                    boardFileVO.setFileSize(fileVo.getFileMg());
                    boardFileVO.setBId(map.get("bId").toString());
                    resultCode += bbsBoardService.intFileData(boardFileVO);
                }
            }
        }

        BoardFileVO fileDataListVO = new BoardFileVO();
        fileDataListVO.setBId(map.get("bId").toString());
        resultMap.put("fileList", bbsBoardService.getFileDataList(fileDataListVO));
        resultMap.put("resultCode", resultCode);
        resultMap.put("resultMsg", "등록되었습니다.");

        return  resultMap;
    }

    @PostMapping("/bbsDataList")
    public HashMap goBbsDataList(BoardVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        if ( (vo.getPageNum() == null) || vo.getPageNum().equals("") ) {
            vo.setOffSet(-1);
        }
        else {
            int nLimit = 10;
            if ( vo.getPageSize() != null && !vo.getPageSize().equals("") ) {
                nLimit = Integer.parseInt(vo.getPageSize());
            }
            int nOffSet = (Integer.parseInt(vo.getPageNum()) - 1) * nLimit;
            vo.setLimit(nLimit);
            vo.setOffSet(nOffSet);
        }

        int nTotalCnt = bbsBoardService.getBbsDataCnt(vo);
        List<BoardVO> metaDataList = bbsBoardService.getBbsDataList(vo);

        resultMap.put("totalCnt", nTotalCnt);
        resultMap.put("dataList", metaDataList);

        return resultMap;
    }

    @PostMapping("/bbsDataView")
    public HashMap goBbsDataView(BoardVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        bbsBoardService.uptBbsDataHitUp(vo);
        BoardVO boardVO = bbsBoardService.getBbsDataView(vo);
        resultMap.put("dataView", boardVO);
        return resultMap;
    }

    @PostMapping("/bbsDataInsert")
    public HashMap goBbsDataInsert(BoardVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int nResultCode = bbsBoardService.insBbsData(vo);
        String resultMsg = (nResultCode > 0) ?  "게시글이 등록 되었습니다.":"등록 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }

    @PostMapping("/bbsDataUpdate")
    public HashMap goBbsDataUpdate(BoardVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int nResultCode = bbsBoardService.uptBbsData(vo);
        String resultMsg = (nResultCode > 0) ?  "게시글이 수정 되었습니다.":"수정 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }

    @PostMapping("/bbsDataDelete")
    public HashMap goBbsDataDelete(BoardVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int nResultCode = bbsBoardService.delBbsData(vo);
        String resultMsg = (nResultCode > 0) ?  "게시글이 삭제 되었습니다.":"삭제 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }
}

