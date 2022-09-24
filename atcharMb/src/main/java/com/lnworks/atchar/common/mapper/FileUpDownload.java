package com.lnworks.atchar.common.mapper;

import com.lnworks.atchar.common.domain.FileUpDownVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface FileUpDownload {
    int intFileData(FileUpDownVO vo) throws  Exception;
    int delFileData(FileUpDownVO vo) throws  Exception;
    FileUpDownVO getFileData(FileUpDownVO vo) throws  Exception;
    List<FileUpDownVO> getFileDataList(FileUpDownVO vo) throws  Exception;
}
