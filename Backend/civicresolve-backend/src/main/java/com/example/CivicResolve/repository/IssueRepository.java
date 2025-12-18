package com.example.CivicResolve.repository;

import com.example.CivicResolve.Model.Issue;
import com.example.CivicResolve.Model.Users;
import com.example.CivicResolve.dto.CategoryCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Integer> {
    List<Issue> findByUser(Users user);

    @Query("Select new com.example.CivicResolve.dto.CategoryCount(i.category, COUNT(i)) from Issue i group by i.category")
    List<CategoryCount> countIssuesByCategory();
}
