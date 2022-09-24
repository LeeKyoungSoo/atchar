package com.lnworks.atchar.user.service;

import com.lnworks.atchar.user.domain.UsersVO;
import com.lnworks.atchar.user.mapper.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UsersService {
    @Autowired
    Users users;

    public int getDataCnt(UsersVO vo) throws Exception {
        return users.getDataCnt(vo);
    }

    public List<UsersVO> getDataList(UsersVO vo) throws Exception {
        return users.getDataList(vo);
    }

    public UsersVO getUserCheck(UsersVO vo) throws Exception {
        return users.getUserCheck(vo);
    }

    public UsersVO getDataView(UsersVO vo) throws Exception {
        return users.getDataView(vo);
    }

    public int insData(UsersVO vo) throws Exception {
        return users.insData(vo);
    }

    public int uptData(UsersVO vo) throws Exception {
        return users.uptData(vo);
    }

    public int uptDataSp(UsersVO vo) throws Exception {
        return users.uptDataSp(vo);
    }

    public int delData(UsersVO vo) throws Exception {
        return users.delData(vo);
    }

    public int uptState(UsersVO vo) throws Exception {
        return users.uptState(vo);
    }

    public UsersVO getDataSrch(UsersVO vo) throws Exception {
        return users.getDataSrch(vo);
    }

    public int uptSrchPw(UsersVO vo) throws Exception {
        return users.uptSrchPw(vo);
    }
}
