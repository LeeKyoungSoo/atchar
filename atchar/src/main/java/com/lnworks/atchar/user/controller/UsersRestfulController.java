package com.lnworks.atchar.user.controller;

import com.lnworks.atchar.security.CustomEncrypt;
import com.lnworks.atchar.user.domain.UsersVO;
import com.lnworks.atchar.user.service.UsersService;
import com.lnworks.atchar.util.MailSend;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;


@RestController
@RequestMapping("/usersApi")
public class UsersRestfulController {
    @Autowired
    UsersService usersService;

    @Autowired
    MailSend mailSend;

    @PostMapping("/dataList")
    public HashMap goDataList(UsersVO vo) throws Exception {
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

        int totalCnt = usersService.getDataCnt(vo);
        List<UsersVO> dataList = usersService.getDataList(vo);

        resultMap.put("totalCnt", totalCnt);
        resultMap.put("dataList", dataList);

        return resultMap;
    }

    @PostMapping("/getUserCheck")
    public HashMap getUserCheck(UsersVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();
        String returnVal = "N";
        UsersVO dataView = usersService.getUserCheck(vo);
        if ( dataView != null ) {
            returnVal = "Y";
        }
        resultMap.put("resultCode", returnVal);
        resultMap.put("resultMsg", returnVal);
        return resultMap;
    }

    @PostMapping("/dataView")
    public HashMap goDataView(UsersVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        if (vo.getUserid() == null || vo.getUserid().equals("") ) {
            HttpSession session = request.getSession();
            vo.setUserid(session.getAttribute("userKey").toString());
        }

        UsersVO dataView = usersService.getDataView(vo);
        resultMap.put("dataView", dataView);
        return resultMap;
    }

    @PostMapping("/dataInsert")
    public HashMap goDataInsert(UsersVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        vo.setPwd(CustomEncrypt.encryptPassword(vo.getPwd(), vo.getUserid()));

        int nResultCode = usersService.insData(vo);
        String resultMsg = (nResultCode > 0) ?  "사용자정보가 등록 되었습니다. 로그인창으로 이동합니다.":"등록 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }

    @PostMapping("/dataUpdate")
    public HashMap goDataUpdate(UsersVO vo, HttpServletRequest request) throws Exception {
        HashMap resultMap = new HashMap<>();

        if (vo.getUserid() == null || vo.getUserid().equals("") ) {
            HttpSession session = request.getSession();
            vo.setUserid(session.getAttribute("userKey").toString());
        }

        if (vo.getLevel() == null || vo.getLevel().equals("") ) {
            HttpSession session = request.getSession();
            vo.setLevel(session.getAttribute("userLv").toString());
        }

        if (vo.getUseyn() == null || vo.getUseyn().equals("") ) {
            vo.setUseyn("Y");
        }

        int nResultCode = usersService.uptData(vo);
        String resultMsg = (nResultCode > 0) ?  "사용자정보가 수정 되었습니다.":"수정 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }

    @PostMapping("/dataDelete")
    public HashMap goDataDelete(UsersVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int nResultCode = usersService.delData(vo);
        String resultMsg = (nResultCode > 0) ?  "사용자정보가 삭제 되었습니다.":"삭제 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }

    @PostMapping("/dataState")
    public HashMap dataState(UsersVO vo) throws Exception {
        HashMap resultMap = new HashMap<>();

        int nResultCode = usersService.uptState(vo);
        String resultMsg = (nResultCode > 0) ?  "사용자정보가 수정 되었습니다.":"수정 실패 입니다.";

        resultMap.put("resultCode", nResultCode);
        resultMap.put("resultMsg", resultMsg);
        return resultMap;
    }
}
