package com.grievance.grievance_system.config;

import com.grievance.grievance_system.entity.Role;
import com.grievance.grievance_system.entity.User;
import com.grievance.grievance_system.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserLoader implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.findByEmail("admin@jansamadhan.ai").isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@jansamadhan.ai")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created: admin@jansamadhan.ai / Admin@123");
        }
    }
}
