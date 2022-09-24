package com.lnworks.atchar.etcmng.controller;

import com.lnworks.atchar.etcmng.domain.MemberVO;
import com.lnworks.atchar.etcmng.service.MemberService;
import com.lnworks.atchar.security.CustomEncrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/etcmng/memberApi")
public class MemberApiController {
    @Autowired
    MemberService memberService;

    @PostMapping("/dataList")
    public HashMap goDataList(MemberVO vo) throws Exception {
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
        List<MemberVO> dataList = memberService.getDataList(vo);
        resultMap.put("dataList", dataList);

        return resultMap;
    }

    @PostMapping("/dataEdit")
    public HashMap goDataEdit(MemberVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        if ( vo.getPwd().equals("") ) {
            vo.setPwd(CustomEncrypt.encryptPassword(vo.getNewPwd(), vo.getUserId()));
        } else {
            if ( !vo.getNewPwd().equals("") ) {
                vo.setPwd(CustomEncrypt.encryptPassword(vo.getNewPwd(), vo.getUserId()));
            }
        }

        int dataState = memberService.insData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }

    @PostMapping("/dataDelete")
    public HashMap goDataDelete(MemberVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int dataState = memberService.delData(vo);

        resultMap.put("dataState", dataState);

        return resultMap;
    }
}
