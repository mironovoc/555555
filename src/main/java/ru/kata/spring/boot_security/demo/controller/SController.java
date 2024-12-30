package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.service.UserServiceImp;


import javax.servlet.http.HttpSession;

@Controller
public class SController {
    private final UserServiceImp userService;

    @Autowired
    public SController(UserServiceImp userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String mainPage(Model model) {
        return "main-page"; // This should match the template name without the .html extension
    }

    @GetMapping("/access-denied")
    public String accessDenied() {
        return "access-denied-page";
    }
}