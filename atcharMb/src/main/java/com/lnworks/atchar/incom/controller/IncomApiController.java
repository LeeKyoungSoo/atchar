package com.lnworks.atchar.incom.controller;

import com.lnworks.atchar.incom.domain.IncomingVO;
import com.lnworks.atchar.incom.domain.MyItemVO;
import com.lnworks.atchar.incom.service.IncomingService;
import com.lnworks.atchar.incom.service.MyItemService;
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

    @Autowired
    MyItemService myItemservice;

    @PostMapping("/myDataList")
    public HashMap goMyDataList(IncomingVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();
        int nLimit = 10;
        vo.setRegid(principal.getName());
        vo.setModid(principal.getName());
        if ( (vo.getPageNum() == null) || vo.getPageNum().equals("") ) {
            vo.setLimit(nLimit);
            vo.setOffSet(0);
        }
        else {
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

    @PostMapping("/dataList")
    public HashMap goDataList(IncomingVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();
        int nLimit = 10;
        vo.setAllyn("Y");
        if ( (vo.getPageNum() == null) || vo.getPageNum().equals("") ) {
            //vo.setOffSet(-1);
            vo.setLimit(nLimit);
            vo.setOffSet(0);
        } else {
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

    @PostMapping("/myAttentionDataList")
    public HashMap goMyAttentionDataList(IncomingVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();
        int nLimit = 10;
        vo.setRegid(principal.getName());
        vo.setAllyn("Y");
        if ( (vo.getPageNum() == null) || vo.getPageNum().equals("") ) {
            vo.setLimit(nLimit);
            vo.setOffSet(0);
        }
        else {
            if ( vo.getPageSize() != null && !vo.getPageSize().equals("") ) {
                nLimit = Integer.parseInt(vo.getPageSize());
            }
            int nOffSet = (Integer.parseInt(vo.getPageNum()) - 1) * nLimit;
            vo.setLimit(nLimit);
            vo.setOffSet(nOffSet);
        }
        List<IncomingVO> dataList = incomingService.getMyDataList(vo);
        resultMap.put("dataList", dataList);

        return resultMap;
    }

    @PostMapping("/clickDataList")
    public HashMap goClickDataList(IncomingVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();
        int nLimit = 10;
        vo.setRegid(principal.getName());
        vo.setAllyn("Y");
        if ( (vo.getPageNum() == null) || vo.getPageNum().equals("") ) {
            vo.setLimit(nLimit);
            vo.setOffSet(0);
        }
        else {
            if ( vo.getPageSize() != null && !vo.getPageSize().equals("") ) {
                nLimit = Integer.parseInt(vo.getPageSize());
            }
            int nOffSet = (Integer.parseInt(vo.getPageNum()) - 1) * nLimit;
            vo.setLimit(nLimit);
            vo.setOffSet(nOffSet);
        }
        List<IncomingVO> dataList = incomingService.getClickDataList(vo);
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

    @PostMapping("/dataViewOpt")
    public HashMap goDataViewOpt(IncomingVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setRegid(principal.getName());
        vo.setModid(principal.getName());
        int dataState = incomingService.dataViewOpt(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

    @PostMapping("/myitemIns")
    public HashMap goMyitemIns(MyItemVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setRegid(principal.getName());
        int dataState = myItemservice.insMyData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

    @PostMapping("/clickitemIns")
    public HashMap goClicitemIns(MyItemVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setRegid(principal.getName());
        int dataState = myItemservice.insClickData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

    @PostMapping("/myitemDel")
    public HashMap goMyitemDel(MyItemVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setRegid(principal.getName());
        int dataState = myItemservice.delMyData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

    @PostMapping("/myitemYn")
    public HashMap goMyitemYn(MyItemVO vo, Principal principal) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setRegid(principal.getName());
        int dataState = myItemservice.getItemCnt(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

}
