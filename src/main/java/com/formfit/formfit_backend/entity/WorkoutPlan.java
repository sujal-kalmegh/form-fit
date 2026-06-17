package com.formfit.formfit_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workout_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String goals;

    @Column(nullable = false)
    private String level;

    private String equipment;

    private Integer days;

    @Column(columnDefinition = "TEXT")
    private String planJson;

    @Column(nullable = false)
    private LocalDateTime createAt;

    @PrePersist
    protected void onCreate(){
        createAt = LocalDateTime.now();
    }
}
