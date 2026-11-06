package com.stockmate.proposals.application;

import com.stockmate.shared.contract.*;

/** Proposed application port, not yet wired to HTTP or persistence.
 * TODO: add server-derived actor/session context before implementation;
 * never accept acting user or role from a request body.
 * Draft thuộc người tạo. Planner gửi; Manager duyệt/từ chối Pending một lần. Kiểm tra budget và dữ liệu hiện tại, đóng băng snapshot khi gửi; copy bản bị từ chối sang Draft mới.
 */
public interface ProposalService {
    // POST /proposals/preview | INVENTORY_PLANNER
    Calculation previewProposal(String idempotencyKey, DraftInput body);

    // GET /proposals | INVENTORY_PLANNER, MANAGER
    ProposalList listProposals(Integer page, Integer pageSize, String search, String status);

    // POST /proposals | INVENTORY_PLANNER
    Proposal createDraft(String idempotencyKey, DraftInput body);

    // GET /proposals/{proposalId} | INVENTORY_PLANNER, MANAGER
    Proposal getProposal(Long proposalId);

    // PATCH /proposals/{proposalId} | INVENTORY_PLANNER
    Proposal updateDraft(Long proposalId, String idempotencyKey, DraftUpdate body);

    // POST /proposals/{proposalId}/submit | INVENTORY_PLANNER
    Proposal submitProposal(Long proposalId, String idempotencyKey, SubmitInput body);

    // POST /proposals/{proposalId}/approve | MANAGER
    Proposal approveProposal(Long proposalId, String idempotencyKey, ReviewInput body);

    // POST /proposals/{proposalId}/reject | MANAGER
    Proposal rejectProposal(Long proposalId, String idempotencyKey, RejectInput body);

    // POST /proposals/{proposalId}/copy | INVENTORY_PLANNER
    Proposal copyRejectedProposal(Long proposalId, String idempotencyKey, ReviewInput body);

    // GET /proposals/{proposalId}/history | INVENTORY_PLANNER, MANAGER
    AuditEventList listProposalHistory(Long proposalId, Integer page, Integer pageSize, String search);

}
