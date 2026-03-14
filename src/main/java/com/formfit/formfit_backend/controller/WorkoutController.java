package com.formfit.formfit_backend.controller;

import com.formfit.formfit_backend.dto.WorkoutRequest;
import com.formfit.formfit_backend.dto.WorkoutResponse;
import com.formfit.formfit_backend.service.GroqService;   // ✅ updated import
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/workout")
@RequiredArgsConstructor
public class WorkoutController {

    private final GroqService groqService;   // ✅ updated

    @PostMapping("/generate")
    public ResponseEntity<?> generateWorkoutPlan(@Valid @RequestBody WorkoutRequest request) {
        log.info("Received workout request - level: {}, days: {}, goals: {}",
                request.getLevel(), request.getDays(), request.getGoals());
        try {
            WorkoutResponse plan = groqService.generateWorkoutPlan(request);
            log.info("Successfully generated plan: {}", plan.getPlanTitle());
            return ResponseEntity.ok(plan);
        } catch (Exception e) {
            log.error("Failed to generate workout plan.", e);
            return ResponseEntity
                    .internalServerError()
                    .body(Map.of(
                            "error", "Failed to generate workout plan",
                            "message", e.getMessage()
                    ));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "ok",
                "service", "FormFit Backend"
        ));
    }
}