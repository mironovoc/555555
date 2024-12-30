package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Optional;

public interface UserService extends UserDetailsService {

    User findUserByName(String username);

    User findUserById(Long userId);

    List<User> allUsers();

    void deleteUser(Long userId);

    List<Role> listRoles();

    User insertUser(User user);
    User updateUser(User user);
    Iterable<Role> findAllRoles();
    String getPage(Model model, HttpSession session, Authentication auth);
}