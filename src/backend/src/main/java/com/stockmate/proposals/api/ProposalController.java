package com.stockmate.proposals.api;

import com.stockmate.shared.contract.*;
import com.stockmate.shared.api.NotImplementedException;
import org.springframework.web.bind.annotation.*;

/** HTTP signatures from docs/openapi/openapi.json. All handlers are deliberate 501 stubs.
 * Roles below document requirements; actual role/ownership checks are not implemented.
 */
@RestController
@RequestMapping("/api/v1")
public class ProposalController {
    /** Calculate draft without saving | Roles: INVENTORY_PLANNER. */
    @PostMapping("/proposals/preview")
    public Calculation previewProposal(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody DraftInput body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("previewProposal");
    }

    /** Visible proposals | Roles: INVENTORY_PLANNER, MANAGER. */
    @GetMapping("/proposals")
    public ProposalList listProposals(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "status", required = false) String status
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("listProposals");
    }

    /** Save a draft | Roles: INVENTORY_PLANNER. */
    @PostMapping("/proposals")
    public Proposal createDraft(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody DraftInput body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("createDraft");
    }

    /** Proposal details | Roles: INVENTORY_PLANNER, MANAGER. */
    @GetMapping("/proposals/{proposalId}")
    public Proposal getProposal(@PathVariable(value = "proposalId", required = true) Long proposalId) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("getProposal");
    }

    /** Replace editable draft and recalculate | Roles: INVENTORY_PLANNER. */
    @PatchMapping("/proposals/{proposalId}")
    public Proposal updateDraft(
            @PathVariable(value = "proposalId", required = true) Long proposalId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody DraftUpdate body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("updateDraft");
    }

    /** Planner submits reviewed draft | Roles: INVENTORY_PLANNER. */
    @PostMapping("/proposals/{proposalId}/submit")
    public Proposal submitProposal(
            @PathVariable(value = "proposalId", required = true) Long proposalId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody SubmitInput body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("submitProposal");
    }

    /** Approve pending proposal | Roles: MANAGER. */
    @PostMapping("/proposals/{proposalId}/approve")
    public Proposal approveProposal(
            @PathVariable(value = "proposalId", required = true) Long proposalId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody ReviewInput body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("approveProposal");
    }

    /** Reject pending proposal with reason | Roles: MANAGER. */
    @PostMapping("/proposals/{proposalId}/reject")
    public Proposal rejectProposal(
            @PathVariable(value = "proposalId", required = true) Long proposalId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody RejectInput body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("rejectProposal");
    }

    /** Copy rejected proposal into a new draft | Roles: INVENTORY_PLANNER. */
    @PostMapping("/proposals/{proposalId}/copy")
    public Proposal copyRejectedProposal(
            @PathVariable(value = "proposalId", required = true) Long proposalId,
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody ReviewInput body
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("copyRejectedProposal");
    }

    /** Proposal edit and review history | Roles: INVENTORY_PLANNER, MANAGER. */
    @GetMapping("/proposals/{proposalId}/history")
    public AuditEventList listProposalHistory(
            @PathVariable(value = "proposalId", required = true) Long proposalId,
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(value = "page_size", required = false, defaultValue = "20") Integer pageSize,
            @RequestParam(value = "search", required = false) String search
    ) {
        // TODO: authenticate, authorize and delegate to ProposalService.
        throw new NotImplementedException("listProposalHistory");
    }

}
