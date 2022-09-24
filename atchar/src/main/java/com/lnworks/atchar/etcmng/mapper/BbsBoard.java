package com.lnworks.atchar.etcmng.mapper;

import com.lnworks.atchar.etcmng.domain.BoardFileVO;
import com.lnworks.atchar.etcmng.domain.BoardVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface BbsBoard {
    int getBbsDataCnt(BoardVO vo) throws Exception;
    List<BoardVO> getBbsDataList(BoardVO vo) throws Exception;
    int insBbsData(BoardVO vo) throws Exception;
    int uptBbsData(BoardVO vo) throws Exception;
    int delBbsData(BoardVO vo) throws Exception;
    BoardVO getBbsDataView(BoardVO vo) throws  Exception;
    int uptBbsDataHitUp(BoardVO vo) throws Exception;
    int intFileData(BoardFileVO vo) throws  Exception;
    int delFileData(BoardFileVO vo) throws  Exception;
    BoardFileVO getFileData(BoardFileVO vo) throws  Exception;
    List<BoardFileVO> getFileDataList(BoardFileVO vo) throws  Exception;
}
