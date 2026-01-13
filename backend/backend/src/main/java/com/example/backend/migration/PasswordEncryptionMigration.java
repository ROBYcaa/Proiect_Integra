package com.example.backend.migration;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("migration")
public class PasswordEncryptionMigration implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordEncryptionMigration(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        for (User user : userRepository.findAll()) {
            String password = user.getPassword();

            if (password == null || isAlreadyEncoded(password)) {
                System.out.println("Skipped user: " + user.getEmail());
                continue;
            }

            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);

            System.out.println("Migrated password for user: " + user.getEmail());
        }

        System.out.println("Password migration finished.");
    }

    private boolean isAlreadyEncoded(String password) {
        return password.startsWith("{bcrypt}")
                || password.startsWith("{argon2}")
                || password.startsWith("{pbkdf2}")
                || password.startsWith("$2a$")
                || password.startsWith("$2b$")
                || password.startsWith("$2y$");
    }
}
