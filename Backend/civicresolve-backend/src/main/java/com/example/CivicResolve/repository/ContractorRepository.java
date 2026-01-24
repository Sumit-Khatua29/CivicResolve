package com.example.CivicResolve.repository;

import com.example.CivicResolve.Model.Contractor;
import com.example.CivicResolve.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ContractorRepository extends JpaRepository<Contractor, Long> {
    Optional<Contractor> findByUser(Users user);

    @Query("SELECT c FROM Contractor c JOIN c.user u WHERE u.enabled = false AND u.role = 'ROLE_CONTRACTOR'")
    List<Contractor> findAllPendingContractors();

    @Query("SELECT c FROM Contractor c JOIN c.user u WHERE u.enabled = true AND u.role = 'ROLE_CONTRACTOR'")
    List<Contractor> findAllApprovedContractors();
}
