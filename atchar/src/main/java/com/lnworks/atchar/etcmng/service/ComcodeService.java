package com.lnworks.atchar.etcmng.service;

import com.lnworks.atchar.etcmng.domain.ComcodeVO;
import com.lnworks.atchar.etcmng.domain.ZipCordVO;
import com.lnworks.atchar.etcmng.mapper.Comcode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComcodeService {
    @Autowired
    Comcode comcode;

    public int insData(ComcodeVO vo) throws Exception {
        return comcode.insData(vo);
    }

    public int delData(ComcodeVO vo) throws Exception {
        return comcode.delData(vo);
    }

    public List<ComcodeVO> getDataList(ComcodeVO vo) throws Exception {
        return comcode.getDataList(vo);
    }

    public List<ZipCordVO> getSidoList(ZipCordVO vo) throws Exception {
        return comcode.getSidoList(vo);
    }

    public List<ZipCordVO> getGugunList(ZipCordVO vo) throws Exception {
        return comcode.getGugunList(vo);
    }
}
