package com.lnworks.atchar.etcmng.controller;

import com.lnworks.atchar.etcmng.domain.MemberVO;
import com.lnworks.atchar.etcmng.mapper.Member;
import com.lnworks.atchar.etcmng.service.MemberService;
import com.lnworks.atchar.security.CustomEncrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
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

    @PostMapping("/idDoubleCheck")
    public HashMap goIdDoubleCheck(MemberVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int memCnt = memberService.getSelIdCnt(vo);

        resultMap.put("result", memCnt);

        return resultMap;
    }

    @PostMapping("/userLvlUp")
    public HashMap goUserLvlUp(MemberVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        HttpSession session = request.getSession();
        vo.setUserId(session.getAttribute("userId").toString());

        int memCnt = memberService.updUserLvlUp(vo);
        if ( memCnt > 0) session.setAttribute("userLv", "2");

        resultMap.put("result", memCnt);

        return resultMap;
    }

    @PostMapping("/myInfoEdit")
    public HashMap goMyInfoEdit(MemberVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        HttpSession session = request.getSession();
        vo.setUserId(session.getAttribute("userId").toString());

        String enpassword = null;
        try {
            enpassword = CustomEncrypt.encryptPassword(vo.getNowPwd(), vo.getUserId());
        } catch (Exception e) {
            e.printStackTrace();
        }

        MemberVO memberInfo = memberService.getUserInfo(vo);
        if ( memberInfo == null ) {
            resultMap.put("dataState", "사용자정보가 없습니다.");
        } else {
            if (!enpassword.equals(memberInfo.getPwd())) {
                resultMap.put("dataState", "사용하고 계신 비밀번호를 확인해 주십시오.");
            } else {
                vo.setPwd(CustomEncrypt.encryptPassword(vo.getPwd(), vo.getUserId()));
                int dataState = memberService.updUserInfo(vo);
                if ( dataState > 0 ) {
                    resultMap.put("dataState", "사용자 정보가 수정되었습니다.");
                } else {
                    resultMap.put("dataState", "정상 처리가 안되었습니다. 관리자에게 문의하세요.");
                }
            }
        }

        return resultMap;
    }

    @PostMapping("/myInfo")
    public HashMap goMyInfo(MemberVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        HttpSession session = request.getSession();
        vo.setUserId(session.getAttribute("userId").toString());

        MemberVO memberInfo = memberService.getUserInfo(vo);
        resultMap.put("memberInfo", memberInfo);

        return resultMap;
    }


    @PostMapping("/myComInfo")
    public HashMap goMyComInfo(MemberVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        HttpSession session = request.getSession();
        vo.setUserId(session.getAttribute("userId").toString());

        MemberVO memberInfo = memberService.getComInfo(vo);
        resultMap.put("memberInfo", memberInfo);

        return resultMap;
    }

    @PostMapping("/myComInfoEdit")
    public HashMap goMyComInfoEdit(MemberVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        HttpSession session = request.getSession();
        vo.setUserId(session.getAttribute("userId").toString());

        MemberVO memberInfo = memberService.getComInfo(vo);
        if ( memberInfo == null ) {
            resultMap.put("dataState", "등록자(회사)정보가 없습니다.");
        } else {
            int dataState = memberService.updComInfo(vo);
            if ( dataState > 0 ) {

                int memCnt = memberService.updUserLvlUp(vo);
                if ( memCnt > 0) session.setAttribute("userLv", "2");

                resultMap.put("dataState", "권한 생성 및 등록자정보가 반영 되었습니다.");
            } else {
                resultMap.put("dataState", "정상 처리가 안되었습니다. 관리자에게 문의하세요.");
            }
        }
        return resultMap;
    }
}
