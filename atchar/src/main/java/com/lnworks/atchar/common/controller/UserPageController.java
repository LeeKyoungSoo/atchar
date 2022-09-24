package com.lnworks.atchar.common.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/user")
public class UserPageController {
    @RequestMapping(value = {"/mobile/guest/main"})
    public ModelAndView goMobileGuestMain(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/guest/main.html");
        return mav;
    }

    @RequestMapping(value = {"/mobile/guest/regist"})
    public ModelAndView goMobileGuestRegist(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/guest/regist.html");
        return mav;
    }

    @RequestMapping(value = {"/mobile/member/item"})
    public ModelAndView goMobileGuestItem(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/member/item.html");
        return mav;
    }

    @RequestMapping(value = {"/mobile/member/manage"})
    public ModelAndView goMobileGuestManage(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/mobile/member/manage.html");
        return mav;
    }
}

