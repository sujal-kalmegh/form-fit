package com.formfit.formfit_backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formfit.formfit_backend.dto.PlanHistoryResponse;
import com.formfit.formfit_backend.dto.WorkoutRequest;
import com.formfit.formfit_backend.entity.User;
import com.formfit.formfit_backend.entity.WorkoutPlan;
import com.formfit.formfit_backend.repository.UserRepository;
import com.formfit.formfit_backend.repository.WorkoutPlanRepository;
import com.formfit.formfit_backend.service.GroqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workout")
@RequiredArgsConstructor
public class WorkoutController{
    private final GroqService groqService;
    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final ObjectMapper objectMapper;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health(){
        return ResponseEntity.ok(Map.of("status", "ok", "service", "FormFit Backend"));
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generatePlan(
        @Valid @RequestBody WorkoutRequest request,
                Authentication authentication){
        try {
            Object plan = groqService.generateWorkoutPlan(request);

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException(("User not found.")));
            WorkoutPlan saved = WorkoutPlan.builder()
                    .user(user)
                    .goals(String.join(", ", request.getGoals()))
                    .level(request.getLevel())
                    .equipment(request.getLevel() != null ? String.join(", ", request.getEquipment()) : "")
                    .days(request.getDays())
                    .planJson(objectMapper.writeValueAsString(plan))
                    .build();

            workoutPlanRepository.save(saved);
            return ResponseEntity.ok(plan);
        }
        catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<PlanHistoryResponse>> getHistory(Authentication authentication){
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found."));
        List<WorkoutPlan> plans = workoutPlanRepository.findTop3ByUserOrderByCreatedAtDesc(user);
        List<PlanHistoryResponse> responses = plans.stream().map(p -> {
            try {
                Object parsed = objectMapper.readValue(p.getPlanJson(), Object.class);
                return new PlanHistoryResponse(
                        p.getId(), p.getGoals(), p.getLevel(), p.getEquipment(), p.getDays(), parsed, p.getCreatedAt()
                );
            }
            catch (Exception e){
                return null;
            }
        }).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}