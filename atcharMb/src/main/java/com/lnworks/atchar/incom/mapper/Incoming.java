package com.lnworks.atchar.incom.mapper;

import com.lnworks.atchar.incom.domain.IncomingVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;


@Mapper
@Repository
public interface Incoming {
    int insData(IncomingVO vo) throws Exception;
    int delData(IncomingVO vo) throws Exception;
    List<IncomingVO> getDataList(IncomingVO vo) throws Exception;
    List<IncomingVO> getMyDataList(IncomingVO vo) throws Exception;
    List<IncomingVO> getClickDataList(IncomingVO vo) throws Exception;
    int dataViewOpt(IncomingVO vo) throws Exception;
}
