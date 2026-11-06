package com.stockmate.ai.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class AiDraftController {
    /** Ask AI to create or edit a draft | Roles: INVENTORY_PLANNER. */
    @PostMapping("/ai/draft-requests")
    public AIResult createAIDraftRequest(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody AIInput body
    ) {
        // TODO: authenticate, authorize and delegate to AiDraftService.
        throw new NotImplementedException("createAIDraftRequest");
    }

    /** Recover AI request outcome | Roles: INVENTORY_PLANNER. */
    @GetMapping("/ai/draft-requests/{requestId}")
    public AIResult getAIRequest(@PathVariable(value = "requestId", required = true) Long requestId) {
        // TODO: authenticate, authorize and delegate to AiDraftService.
        throw new NotImplementedException("getAIRequest");
    }

}
