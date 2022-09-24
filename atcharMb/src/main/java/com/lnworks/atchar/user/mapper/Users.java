package com.lnworks.atchar.user.mapper;

import com.lnworks.atchar.user.domain.UsersVO;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Mapper
@Repository
public interface Users {
    int uptSrchPw(UsersVO vo) throws Exception;
    UsersVO getDataSrch(UsersVO vo) throws Exception;
    int insData(UsersVO vo) throws Exception;
    int uptState(UsersVO vo) throws Exception;
    int uptData(UsersVO vo) throws Exception;
    int uptDataSp(UsersVO vo) throws Exception;
    int delData(UsersVO vo) throws Exception;
    UsersVO getUserCheck(UsersVO vo) throws Exception;
    UsersVO getDataView(UsersVO vo) throws Exception;
    int getDataCnt(UsersVO vo) throws Exception;
    List<UsersVO> getDataList(UsersVO vo) throws Exception;
}

