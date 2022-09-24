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
}
