package com.lnworks.atchar.common.service;

import com.lnworks.atchar.common.domain.FileUpDownVO;
import com.lnworks.atchar.common.mapper.FileUpDownload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FileUpDownService {
    @Autowired
    FileUpDownload fileUpDownload;

    public List<FileUpDownVO> getFileDataList(FileUpDownVO vo) throws  Exception {
        return fileUpDownload.getFileDataList(vo);
    }

    public FileUpDownVO getFileData(FileUpDownVO vo) throws  Exception {
        return fileUpDownload.getFileData(vo);
    }

    @Transactional
    public int intFileData(FileUpDownVO vo) throws  Exception {
        return fileUpDownload.intFileData(vo);
    }

    @Transactional
    public int delFileData(FileUpDownVO vo) throws  Exception {
        return fileUpDownload.delFileData(vo);
    }

}
