package com.lnworks.atchar.security;

import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

import javax.sql.DataSource;

@Log
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    DataSource dataSource;
    ZerockUserService zerockUserService;


    @Override
    // js, css, image 설정은 보안 설정의 영향 밖에 있도록 만들어주는 설정.
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    @Override
    protected  void configure(HttpSecurity http) throws  Exception {
        log.info("security config........");

        http
            .authorizeRequests()
                .antMatchers("/mobile/guest/**"
                        , "/incom/incomingApi/**"
                        , "/incom/etcItemApi/**"
                        , "/fileUpDownApi/**"
                        , "/etcmng/comcodeApi/**"
                        , "/etcmng/memberApi/**"
                        , "/usersApi/**")
                .permitAll().and()
           .authorizeRequests()
                .antMatchers("/mobile/member/**"
                       )
                    .hasRole("M").and()
            .formLogin()
                .loginPage("/mobile/guest/login")
                .defaultSuccessUrl("/mobile/member/item?start=Y").and()
            .exceptionHandling()
                .accessDeniedPage("/mobile/guest/accessDenied").and()
            .logout()
                .logoutUrl("/mobile/guest/logout")
                .logoutSuccessUrl("/mobile/guest/login")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID", "SOME", "OTHER", "COOKIES").and()
            .rememberMe()
                .key("zerock")
                .userDetailsService(zerockUserService)
                .tokenRepository(getTokenSeries())
                .tokenValiditySeconds(60*60*24*7).and()
            .csrf().disable().anonymous();
        //http.cors().and();
    }

    private PersistentTokenRepository getTokenSeries() {
        JdbcTokenRepositoryImpl repo = new JdbcTokenRepositoryImpl();
        repo.setDataSource(dataSource);
        return repo;
    }

    /*
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        log.info("build Auth global........");

        auth.inMemoryAuthentication()
                .withUser("manager")
                .password("{noop}1111")
                .roles("MANAGER");
    }
    */
}
