package com.lnworks.atchar.etcmng.mapper;

import com.lnworks.atchar.etcmng.domain.MemberVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface Member {
    int insData(MemberVO vo) throws Exception;
    int delData(MemberVO vo) throws Exception;
    List<MemberVO> getDataList(MemberVO vo) throws Exception;
    int getSelIdCnt(MemberVO vo) throws Exception;
    int updUserLvlUp(MemberVO vo) throws Exception;
    MemberVO getUserInfo(MemberVO vo) throws Exception;
    int updUserInfo(MemberVO vo) throws Exception;
    MemberVO getComInfo(MemberVO vo) throws Exception;
    int updComInfo(MemberVO vo) throws Exception;
}
