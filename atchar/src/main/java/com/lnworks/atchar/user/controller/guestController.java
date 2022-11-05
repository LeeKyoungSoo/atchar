package com.lnworks.atchar.user.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/guest")
public class guestController {
    @RequestMapping(value = "/personalData")
    public ModelAndView goPersonalData(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/guest/personalData.html");
        return mav;
    }
}
