package com.bank.modernize.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

import com.bank.modernize.entity.User;
import com.bank.modernize.enums.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUserId(Long userId);

    long count();

    List<User> findByRoleNot(Role role);
}