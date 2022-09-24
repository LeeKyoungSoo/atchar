package com.lnworks.atchar.common.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/admin/accounts")
public class AdminLoginController {
    @RequestMapping(value = "/login")
    public ModelAndView goLogin(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/member/login.html");
        return mav;
    }

    @RequestMapping(value = "/accessDenied")
    public ModelAndView goAccessDenied(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/member/accessDenied.html");
        return mav;
    }

    @RequestMapping(value = "/logout")
    public ModelAndView goLogout(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/member/login.html");
        return mav;
    }
}
