package com.lnworks.atchar.security;

import com.lnworks.atchar.user.domain.UsersVO;
import com.lnworks.atchar.user.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAuthenticationProvider implements AuthenticationProvider {

    @Autowired
    private com.lnworks.atchar.security.ZerockUserService zerockUserService;

    @Autowired
    private UsersService memberLoginService;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException
    {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();
        String enpassword = null;
        try {
            enpassword = CustomEncrypt.encryptPassword(password,username);
        } catch (Exception e) {
            e.printStackTrace();
        }

        User user = null;
        //Collection<GrantedAuthority> authorities = null;

        try {
            user = (User)zerockUserService.loadUserByUsername(username);

            if ( user == null )
                throw new BadCredentialsException("회원정보 없음");

            // 이용자가 로그인 폼에서 입력한 비밀번호와 DB로부터 가져온 암호화된 비밀번호를 비교한다
            if (!enpassword.equals(user.getPassword()))
                throw new BadCredentialsException("비밀번호 불일치");

            UsersVO loginVoIn = new UsersVO();
            loginVoIn.setUserid(username);
            loginVoIn = memberLoginService.getUserCheck(loginVoIn);

            //Session 처리
            ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
            HttpSession session= attr.getRequest().getSession(true);
            session.setAttribute("userId", loginVoIn.getUserid());
            session.setAttribute("userNm", loginVoIn.getUsernm());
            session.setAttribute("userLv", loginVoIn.getLevel());

        } catch(UsernameNotFoundException e) {
            e.printStackTrace();
            throw new UsernameNotFoundException(e.getMessage());
        } catch(BadCredentialsException e) {
            e.printStackTrace();
            throw new BadCredentialsException(e.getMessage());
        } catch(Exception e) {
            e.printStackTrace();
            //throw new RuntimeException(e.getMessage());
            throw new UsernameNotFoundException(e.getMessage());
        }

        return new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword(), user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> arg0) {
        return true;
    }
}
