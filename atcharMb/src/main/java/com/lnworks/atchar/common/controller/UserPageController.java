package com.lnworks.atchar.common.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@Log
@RequestMapping("/mobile")
public class UserPageController {
    @RequestMapping(value = {"/guest/main"})
    public ModelAndView goMobileGuestMain(HttpServletRequest request) throws Exception {
        String device = "web";
        if ( request.getHeader("app-device") != null) {
            device = request.getHeader("app-device");
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("device", device);
        mav.setViewName("content/mobile/guest/main.html");
        return mav;
    }

    @RequestMapping(value = {"/member/item"})
    public ModelAndView goMobileGuestItem(HttpServletRequest request) throws Exception {
        String device = "web";
        if ( request.getHeader("app-device") != null) {
            device = request.getHeader("app-device");
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("device", device);
        mav.setViewName("content/mobile/member/item.html");
        return mav;
    }

    @RequestMapping(value = {"/member/etcitem"})
    public ModelAndView goMobileGuestEtcItem(HttpServletRequest request) throws Exception {
        String device = "web";
        if ( request.getHeader("app-device") != null) {
            device = request.getHeader("app-device");
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("device", device);
        mav.setViewName("content/mobile/member/etcitem.html");
        return mav;
    }

    @RequestMapping(value = {"/member/manage"})
    public ModelAndView goMobileManage(HttpServletRequest request) throws Exception {
        String device = "web";
        if ( request.getHeader("app-device") != null) {
            device = request.getHeader("app-device");
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("device", device);
        mav.setViewName("content/mobile/member/manage.html");
        return mav;
    }

    @RequestMapping(value = {"/member/eb_manage"})
    public ModelAndView goMobileEtcManage(HttpServletRequest request) throws Exception {
        String device = "web";
        if ( request.getHeader("app-device") != null) {
            device = request.getHeader("app-device");
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("device", device);
        mav.setViewName("content/mobile/member/eb_manage.html");
        return mav;
    }

    @RequestMapping(value = {"/member/mypage"})
    public ModelAndView goMobileMypage(HttpServletRequest request) throws Exception {
        String device = "web";
        if ( request.getHeader("app-device") != null) {
            device = request.getHeader("app-device");
        }
        ModelAndView mav = new ModelAndView();
        mav.addObject("device", device);
        mav.setViewName("content/mobile/member/mypage.html");
        return mav;
    }
}

