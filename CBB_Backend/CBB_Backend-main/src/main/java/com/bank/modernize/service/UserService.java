package com.bank.modernize.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.modernize.dto.CreateUserRequest;
import com.bank.modernize.dto.UpdateUserRequest;
import com.bank.modernize.dto.UserResponse;
import com.bank.modernize.entity.User;
import com.bank.modernize.enums.Status;
import com.bank.modernize.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepo;

    @Transactional
    public UserResponse createUser(CreateUserRequest req) {

        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setFullName(req.getFullName());
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setPassword(req.getPassword());
        user.setRole(req.getRole());
        user.setStatus(req.getStatus() != null ? req.getStatus() : Status.ACTIVE);
        user.setMfaEnabled(req.isMfaEnabled());

        userRepo.save(user);

        return mapToResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest req) {

        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (req.getFullName() != null)
            user.setFullName(req.getFullName());

        if (req.getPhone() != null)
            user.setPhone(req.getPhone());

        if (req.getStatus() != null)
            user.setStatus(req.getStatus());

        if (req.getMfaEnabled() != null)
            user.setMfaEnabled(req.getMfaEnabled());

        userRepo.save(user);

        return mapToResponse(user);
    }

    @Transactional
    public String deleteUser(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setStatus(Status.INACTIVE);

        userRepo.save(user);

        return "User deactivated successfully";
    }

    private UserResponse mapToResponse(User user) {
        UserResponse res = new UserResponse();
        res.setUserId(user.getUserId());
        res.setFullName(user.getFullName());
        res.setEmail(user.getEmail());
        res.setPhone(user.getPhone());
        res.setRole(user.getRole());
        res.setStatus(user.getStatus());
        res.setMfaEnabled(user.getMfaEnabled() != null ? user.getMfaEnabled() : false);

        return res;
    }
}
