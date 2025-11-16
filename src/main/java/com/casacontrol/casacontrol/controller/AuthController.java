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

    // LOGIN (original)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        boolean isAuthenticated = userService.loginUser(email, password);

        Map<String, Object> response = new HashMap<>();

        if (isAuthenticated) {
            String token = jwtUtil.generateToken(email);

            response.put("token", token);
            response.put("email", email);
            response.put("message", "Login successful");
        } else {
            response.put("message", "Invalid credentials");
        }

        return response;
    }

    // REGISTER (original)
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Map<String, Object> response = new HashMap<>();

        boolean success = userService.registerUser(email, password);

        if (success) {
            response.put("message", "User registered successfully!");
        } else {
            response.put("message", "User already exists or invalid data");
        }

        return response;
    }

    // TOKEN VALIDATION (original)
    @GetMapping("/validate")
    public Map<String, Object> validateToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();

        String email = jwtUtil.extractUsername(token);

        if (jwtUtil.validateToken(token, email)) {
            response.put("valid", true);
            response.put("email", email);
        } else {
            response.put("valid", false);
        }

        return response;
    }
}
