package com.lnworks.atchar.incom.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/admin/incom")
public class IncomController {
    @RequestMapping(value = "/incoming")
    public ModelAndView goIncoming(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/incom/incoming.html");
        return mav;
    }

    @RequestMapping(value = "/etcIncoming")
    public ModelAndView goEtcIncoming(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/incom/etcIncoming.html");
        return mav;
    }
}
