package com.example.CivicResolve.repository;

import com.example.CivicResolve.Model.Role;
import com.example.CivicResolve.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {

    Optional<Users> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Boolean existsByRole(Role role);
    Optional<Users> findByEmail(String email);

}
