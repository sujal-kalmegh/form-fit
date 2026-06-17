package com.formfit.formfit_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class PlanHistoryResponse {
    private Long id;
    private String goals;
    private String level;
    private String equipment;
    private Integer days;
    private Object plan;
    private LocalDateTime createAt;
}
