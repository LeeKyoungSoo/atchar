package com.lnworks.atchar.etcmng.controller;

import lombok.extern.java.Log;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
@Log
@RequestMapping("/admin/etcmng")
public class EtcmngController {

    @RequestMapping(value = {"/codemng"})
    public ModelAndView goCodemng(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/etcmng/code.html");
        return mav;
    }

    @RequestMapping(value = {"/membermng"})
    public ModelAndView goMembermng(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/etcmng/member.html");
        return mav;
    }

    @RequestMapping(value = {"/notiboard"})
    public ModelAndView goNotiboard(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/etcmng/notiboard.html");
        return mav;
    }

    @RequestMapping(value = {"/notiboardEdit"})
    public ModelAndView goNotiboardEdit(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/etcmng/notiboardEdit.html");
        return mav;
    }

    @RequestMapping(value = {"/etcboard"})
    public ModelAndView goEtcboard(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/etcmng/etcboard.html");
        return mav;
    }

    @RequestMapping(value = {"/etcboardEdit"})
    public ModelAndView goEtcboardEdit(HttpServletRequest request) throws Exception {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("content/admin/etcmng/etcboardEdit.html");
        return mav;
    }
}
