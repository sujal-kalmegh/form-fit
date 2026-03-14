package com.formfit.formfit_backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.List;

@Data
public class WorkoutRequest {
    @NotEmpty(message = "At least one goal is required!")
    private List<String> goals;

    @NotEmpty(message = "At least one equipment is required!")
    private List<String> equipment;

    @NotBlank(message = "Fitness level is required!")
    private String level;

    @Min(value = 1, message = "Minimum 1 day a week")
    @Max(value = 7, message = "Maximum 7 day a week")
    private int days;

    @Min(value = 10)
    @Max(value = 100)
    private Integer age;

//    @DecimalMin("20.0")
//    @DecimalMax("300.0")
    private Double weight;

    private String notes;
}
