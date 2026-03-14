package com.formfit.formfit_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.formfit.formfit_backend.dto.GroqRequest;
import com.formfit.formfit_backend.dto.GroqResponse;
import com.formfit.formfit_backend.dto.WorkoutRequest;
import com.formfit.formfit_backend.dto.WorkoutResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroqService {

    private final WebClient groqWebClient;       // ✅ groqWebClient
    private final ObjectMapper objectMapper;

    @Value("${groq.api.model}")                  // ✅ groq not anthropic
    private String model;

    @Value("${groq.api.max-tokens}")             // ✅ groq not anthropic
    private int maxTokens;

    public WorkoutResponse generateWorkoutPlan(WorkoutRequest request) {
        String prompt = buildPrompt(request);
        log.debug("Sending prompt to Groq:\n{}", prompt);

        GroqRequest apiRequest = GroqRequest.builder()
                .model(model)
                .maxTokens(maxTokens)
                .messages(List.of(
                        GroqRequest.Message.builder()
                                .role("user")
                                .content(prompt)
                                .build()
                ))
                .build();

        GroqResponse apiResponse = groqWebClient
                .post()
                .bodyValue(apiRequest)
                .retrieve()
                .onStatus(status -> status.isError(), clientResponse ->
                        clientResponse.bodyToMono(String.class)
                                .flatMap(body -> {
                                    log.error("Groq API error {}: {}", clientResponse.statusCode(), body);
                                    return reactor.core.publisher.Mono.error(
                                            new RuntimeException("Groq API error: " + body));
                                })
                )
                .bodyToMono(GroqResponse.class)
                .block();

        return parseResponse(apiResponse);
    }

    private String buildPrompt(WorkoutRequest req) {
        String goals      = String.join(", ", req.getGoals());
        String equipments = String.join(", ", req.getEquipment());
        String level      = req.getLevel();
        int    days       = req.getDays();

        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert personal trainer. ");
        sb.append("Create a detailed ").append(days).append("-day/week workout plan for:\n");
        sb.append("- Fitness Level: ").append(level).append("\n");
        sb.append("- Goals: ").append(goals).append("\n");
        sb.append("- Equipment: ").append(equipments).append("\n");
        sb.append("- Days per week: ").append(days).append("\n");

        if (req.getAge() != null)
            sb.append("- Age: ").append(req.getAge()).append("\n");

        if (req.getWeight() != null)
            sb.append("- Weight: ").append(req.getWeight()).append(" kg\n");

        if (req.getNotes() != null && !req.getNotes().isBlank())
            sb.append("- Notes: ").append(req.getNotes()).append("\n");

        sb.append("""
                Respond ONLY with valid JSON - no markdown, no backticks, no extra text.
                Use this exact structure:
                {
                  "planTitle": "string",
                  "intro": "2-3 sentence personalised intro mentioning their weight and age if provided",
                  "weekSchedule": [
                    {
                      "day": 1,
                      "label": "Day 1",
                      "focus": "e.g. Upper Body Push",
                      "isRest": false,
                      "exercises": [
                        {
                          "name": "string",
                          "sets": "3",
                          "reps": "10-12",
                          "rest": "60s",
                          "tip": "short form tip"
                        }
                      ]
                    }
                  ],
                  "generalTips": [
                    { "label": "Nutrition", "text": "tip" },
                    { "label": "Recovery", "text": "tip" },
                    { "label": "Progression", "text": "tip" },
                    { "label": "Consistency", "text": "tip" }
                  ]
                }
                Rules:
                - Generate exactly\s""");
        sb.append(days);
        sb.append("""
                 entries in weekSchedule.
                - Rest days: isRest = true, exercises = []
                - Workout days: 5-7 exercises suited to the person's level and equipment.
                - Return ONLY the JSON object, nothing else.
                """);

        return sb.toString();
    }

    private WorkoutResponse parseResponse(GroqResponse apiResponse) {
        if (apiResponse == null || apiResponse.getChoices() == null  // ✅ getChoices
                || apiResponse.getChoices().isEmpty()) {
            throw new RuntimeException("Empty response received from Groq API.");
        }

        // ✅ Groq returns choices[0].message.content
        String rawJson = apiResponse.getChoices().get(0).getMessage().getContent();
        log.debug("Raw JSON from Groq:\n{}", rawJson);

        rawJson = rawJson
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("```", "")
                .trim();

        try {
            return objectMapper.readValue(rawJson, WorkoutResponse.class);
        } catch (Exception e) {
            log.error("Failed to parse Groq response: {}", rawJson, e);
            throw new RuntimeException("Failed to parse workout plan: " + e.getMessage());
        }
    }
}