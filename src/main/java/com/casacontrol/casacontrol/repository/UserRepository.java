package com.casacontrol.casacontrol.repository;

import com.casacontrol.casacontrol.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 🔥 Finds user by email for login/authentication
    Optional<User> findByEmail(String email);

    // (Optional) check existence
    boolean existsByEmail(String email);
}
