package com.lnworks.atchar.etcmng.mapper;

import com.lnworks.atchar.etcmng.domain.ComcodeVO;
import com.lnworks.atchar.etcmng.domain.ZipCordVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface Comcode {
    int insData(ComcodeVO vo) throws Exception;
    int delData(ComcodeVO vo) throws Exception;
    List<ComcodeVO> getDataList(ComcodeVO vo) throws Exception;
    List<ZipCordVO> getSidoList(ZipCordVO vo) throws Exception;
    List<ZipCordVO> getGugunList(ZipCordVO vo) throws Exception;
}
