package com.casacontrol.casacontrol.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👇 Add this field since DB expects it
    private String name;

    private String username;
    private String email;
    private String password;

    private String role = "USER"; // Default role
}
