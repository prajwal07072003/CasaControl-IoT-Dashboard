package com.casacontrol.casacontrol.service;

import com.casacontrol.casacontrol.entity.User;
import com.casacontrol.casacontrol.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 🔹 Register using email + password (used by AuthController)
    public boolean registerUser(String email, String password) {

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return false;   // user already exists
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));

        userRepository.save(newUser);
        return true;
    }

    // 🔹 RESTORED VERSION — register using User object
    //     (this is the method UserController expects)
    public User registerUser(User user) {

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // 🔹 Original login method used by AuthController
    public boolean loginUser(String email, String password) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            return false;
        }

        return passwordEncoder.matches(password, existingUser.get().getPassword());
    }

    // 🔹 Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
