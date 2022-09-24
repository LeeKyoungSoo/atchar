package com.lnworks.atchar.incom.service;

import com.lnworks.atchar.incom.domain.IncomingVO;
import com.lnworks.atchar.incom.mapper.Incoming;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncomingService {
    @Autowired
    Incoming incoming;

    public int insData(IncomingVO vo) throws Exception {
        return incoming.insData(vo);
    }

    public int delData(IncomingVO vo) throws Exception {
        return incoming.delData(vo);
    }

    public List<IncomingVO> getDataList(IncomingVO vo) throws Exception {
        return incoming.getDataList(vo);
    }

    public List<IncomingVO> getMyDataList(IncomingVO vo) throws Exception {
        return incoming.getMyDataList(vo);
    }

    public List<IncomingVO> getClickDataList(IncomingVO vo) throws Exception {
        return incoming.getClickDataList(vo);
    }

    public int dataViewOpt(IncomingVO vo) throws Exception {
        return incoming.dataViewOpt(vo);
    }
}
