package com.lnworks.atchar.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@Slf4j
@Component
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        // 해당 session 시간은 application.properties에
        HttpSession session = request.getSession();
        //session.setMaxInactiveInterval(1814400);
        log.info("sessionId={}", session.getId());
        log.info("maxInactiveInterval={}", session.getMaxInactiveInterval());

        //userAgent.matches(".*Android.*"))
        String userAgent = request.getHeader("user-app");
        if ( userAgent != null && userAgent.equals("androidAtchar")) {
            response.sendRedirect("/usersApi/login/success");
        } else {
            response.sendRedirect("/mobile/member/item?start=Y");
        }
    }
}
