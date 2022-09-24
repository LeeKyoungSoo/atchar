package com.lnworks.atchar.user.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/users")
public class UsersController {
    @RequestMapping(value = "/registmember")
    public ModelAndView goReistMenger(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/users/registmember.html");
        return mav;
    }

    @RequestMapping(value = "/idsearch")
    public ModelAndView goIdSearch(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/users/idSearch.html");
        return mav;
    }

    @RequestMapping(value = "/pwsearch")
    public ModelAndView goPwSearch(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/users/pwSearch.html");
        return mav;
    }
}
