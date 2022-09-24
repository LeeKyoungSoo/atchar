package com.lnworks.atchar.common.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/admin")
public class AdminPageController {
    @RequestMapping(value = {"/"})
    public ModelAndView goMain(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/welcome.html");
        return mav;
    }

    @RequestMapping(value = {"/member/main"})
    public ModelAndView goMemberMainPage(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/member/main.html");
        return mav;
    }
}

