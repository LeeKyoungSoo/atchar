package com.lnworks.atchar.common.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/mobile/guest")
public class UserLoginController {
    @RequestMapping(value = "/login")
    public ModelAndView goLogin(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/guest/regist.html");
        return mav;
    }

    @RequestMapping(value = "/accessDenied")
    public ModelAndView goAccessDenied(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/guest/accessDenied.html");
        return mav;
    }

    @RequestMapping(value = "/logoutAfter")
    public ModelAndView goLogout(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/guest/regist.html");
        return mav;
    }
}
