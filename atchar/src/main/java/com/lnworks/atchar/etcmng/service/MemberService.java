package com.lnworks.atchar.etcmng.service;

import com.lnworks.atchar.etcmng.domain.MemberVO;
import com.lnworks.atchar.etcmng.mapper.Member;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class MemberService {
    @Autowired
    Member member;

    public int insData(MemberVO vo) throws Exception {
        return member.insData(vo);
    }

    public int delData(MemberVO vo) throws Exception {
        return member.delData(vo);
    }

    public List<MemberVO> getDataList(MemberVO vo) throws Exception {
        return member.getDataList(vo);
    }
}
