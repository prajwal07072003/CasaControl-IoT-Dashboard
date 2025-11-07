package com.casacontrol.casacontrol.controller;

import com.casacontrol.casacontrol.service.UserService;
import com.casacontrol.casacontrol.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        boolean isAuthenticated = userService.loginUser(email, password);

        Map<String, Object> response = new HashMap<>();
        if (isAuthenticated) {
            String token = jwtUtil.generateToken(email);
            response.put("token", token);
            response.put("message", "Login successful!");
        } else {
            response.put("message", "Invalid credentials");
        }

        return response;
    }
}
