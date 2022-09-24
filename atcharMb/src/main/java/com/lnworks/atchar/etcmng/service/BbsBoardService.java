package com.lnworks.atchar.etcmng.service;

import com.lnworks.atchar.etcmng.domain.BoardFileVO;
import com.lnworks.atchar.etcmng.domain.BoardVO;
import com.lnworks.atchar.etcmng.mapper.BbsBoard;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BbsBoardService {
    @Autowired
    BbsBoard bbsBoard;

    public int getBbsDataCnt(BoardVO vo) throws Exception {
        return  bbsBoard.getBbsDataCnt(vo);
    }

    public List<BoardVO> getBbsDataList(BoardVO vo) throws Exception {
        return bbsBoard.getBbsDataList(vo);
    }

    @Transactional
    public int insBbsData(BoardVO vo) throws Exception {
        return bbsBoard.insBbsData(vo);
    }

    @Transactional
    public int uptBbsData(BoardVO vo) throws Exception {
        return bbsBoard.uptBbsData(vo);
    }

    @Transactional
    public int delBbsData(BoardVO vo) throws Exception {
        return bbsBoard.delBbsData(vo);
    }

    public BoardVO getBbsDataView(BoardVO vo) throws  Exception {
        return bbsBoard.getBbsDataView(vo);
    }

    @Transactional
    public int uptBbsDataHitUp(BoardVO vo) throws Exception {
        return bbsBoard.uptBbsDataHitUp(vo);
    }

    @Transactional
    public int intFileData(BoardFileVO vo) throws  Exception {
        return bbsBoard.intFileData(vo);
    }

    @Transactional
    public int delFileData(BoardFileVO vo) throws  Exception {
        return bbsBoard.delFileData(vo);
    }

    public List<BoardFileVO> getFileDataList(BoardFileVO vo) throws  Exception {
        return bbsBoard.getFileDataList(vo);
    }

    public BoardFileVO getFileData(BoardFileVO vo) throws  Exception {
        return bbsBoard.getFileData(vo);
    }
}
