package com.lnworks.atchar.incom.mapper;

import com.lnworks.atchar.incom.domain.MyItemVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface MyItem {
    int insMyData(MyItemVO vo) throws Exception;
    int delMyData(MyItemVO vo) throws Exception;
    int getItemCnt(MyItemVO vo) throws Exception;
    List<MyItemVO> getMyDataList(MyItemVO vo) throws Exception;
    int insClickData(MyItemVO vo) throws Exception;
    List<MyItemVO> getClickDataList(MyItemVO vo) throws Exception;
}
