package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class ApplicationController {
    @Value("${page.admin}")
    private String adminPage;
    @Value("${page.user}")
    private String userPage;

    @GetMapping({"", "/", "/admin"})
    public String index(Model model) {
        model.addAttribute("pageName", adminPage);
        return "admin";
    }

    @GetMapping("/user")
    public String user(Model model) {
        model.addAttribute("pageName", userPage);
        return "user";
    }
}
