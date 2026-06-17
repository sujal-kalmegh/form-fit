package com.formfit.formfit_backend.repository;

import com.formfit.formfit_backend.entity.User;
import com.formfit.formfit_backend.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findTop3ByUserOrderByCreatedAtDesc(User user);
}