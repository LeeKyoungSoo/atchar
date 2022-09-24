package com.lnworks.atchar.incom.controller;

import com.lnworks.atchar.etcmng.domain.ComcodeVO;
import com.lnworks.atchar.incom.domain.IncomingVO;
import com.lnworks.atchar.incom.service.IncomingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/incom/incomingApi")
public class IncomApiController {

    @Autowired
    IncomingService incomingService;

    @PostMapping("/dataList")
    public HashMap goDataList(IncomingVO vo) throws Exception {
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
        List<IncomingVO> dataList = incomingService.getDataList(vo);
        resultMap.put("dataList", dataList);

        return resultMap;
    }

    @PostMapping("/dataEdit")
    public HashMap goDataEdit(IncomingVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setRegid(principal.getName());
        vo.setModid(principal.getName());
        int dataState = incomingService.insData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

    @PostMapping("/dataDelete")
    public HashMap goDataDelete(IncomingVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int dataState = incomingService.delData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }
}
