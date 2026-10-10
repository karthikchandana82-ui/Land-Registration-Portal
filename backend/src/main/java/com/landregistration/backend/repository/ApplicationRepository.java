package com.landregistration.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.landregistration.backend.model.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Integer> {

    Optional<Application> findByApplicationId(String applicationId);

    List<Application> findByStatusOrderBySubmittedAtDesc(String status);
}
