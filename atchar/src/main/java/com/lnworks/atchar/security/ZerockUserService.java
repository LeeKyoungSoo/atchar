package com.lnworks.atchar.security;

import com.lnworks.atchar.common.domain.MemberRole;
import com.lnworks.atchar.user.domain.UsersVO;
import com.lnworks.atchar.user.service.UsersService;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@Log
public class ZerockUserService implements UserDetailsService {

    @Autowired
    private UsersService memberLoginService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsersVO loginVoIn = new UsersVO();
        loginVoIn.setUserid(username);

        UsersVO loginuser = null;
        try {
            loginuser = memberLoginService.getUserCheck(loginVoIn);

            MemberRole memberRole = new MemberRole();

            // 각 메뉴에 대한 정책이 없으므로 아래와 같이 처리
            memberRole.setRoleName("M");
            List<MemberRole> memberRoleList = new ArrayList<>();
            memberRoleList.add(memberRole);
            loginuser.setRoleList(memberRoleList);

            return new com.lnworks.atchar.security.ZerockSecurityUser(loginuser);
        } catch (Exception e) {
            return null;
        }
    }
}
