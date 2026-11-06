package com.stockmate.ai.infrastructure;

/** Provider boundary. Implement server-side with a configurable model, timeout and safe parsing.
 * Never send credentials to the model; validate tool requests through application services.
 * Not a Spring bean until a real provider adapter is supplied.
 */
public interface GeminiClient {
    String generateDraftSuggestion(String authorizedPlanningContext, String plannerPrompt);
}
