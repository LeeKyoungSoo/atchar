package com.lnworks.atchar.incom.service;

import com.lnworks.atchar.incom.domain.MyItemVO;
import com.lnworks.atchar.incom.mapper.MyItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyItemService {
    @Autowired
    MyItem myItem;

    public int insMyData(MyItemVO vo) throws Exception {
        return myItem.insMyData(vo);
    }

    public int delMyData(MyItemVO vo) throws Exception {
        return myItem.delMyData(vo);
    }

    public int getItemCnt(MyItemVO vo) throws Exception {
        return myItem.getItemCnt(vo);
    }

    public List<MyItemVO> getMyDataList(MyItemVO vo) throws Exception {
        return myItem.getMyDataList(vo);
    }

    public List<MyItemVO> getClickDataList(MyItemVO vo) throws Exception {
        return myItem.getClickDataList(vo);
    }

    public int insClickData(MyItemVO vo) throws Exception {
        return myItem.insClickData(vo);
    }
}
