package com.formfit.formfit_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutResponse {
    private String planTitle;
    private String intro;
    private List<DaySchedule> weekSchedule;
    private List<GeneralTip> generalTip;

    @Data
    public static class Exercise{
        private String name;
        private String sets;
        private String reps;
        private String rest;
        private String tip;
    }
    @Data
    public static class DaySchedule{
        private int day;
        private String label;
        private String focus;
        private boolean isRest;
        private List<Exercise> exercises;
    }

    @Data
    public static class GeneralTip{
        private String label;
        private String text;

    }
}
