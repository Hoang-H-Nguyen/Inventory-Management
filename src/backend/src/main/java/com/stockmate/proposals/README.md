# Đề xuất và quyết định phê duyệt

Nguồn: US06–US09; C3 trong [C4 architecture](../../../../../../../../docs/c4_architecture/C4_ARCHITECTURE.md).

- `api/`: nhận HTTP, validate và ánh xạ lỗi; hiện là stub 501.
- `application/`: interface use case; cần bổ sung actor/session từ backend trước khi hiện thực.
- `domain/`: entity/value object và invariant cần triển khai.
- `infrastructure/`: vị trí repository JPA, query adapter hoặc Gemini adapter cần triển khai.

Dữ liệu: REPLENISHMENT_PROPOSALS, REPLENISHMENT_PROPOSAL_ITEMS, ACTIVITY_LOG.

Draft thuộc người tạo. Planner gửi; Manager duyệt/từ chối Pending một lần. Kiểm tra budget và dữ liệu hiện tại, đóng băng snapshot khi gửi; copy bản bị từ chối sang Draft mới.

## Endpoint theo OpenAPI

- `POST /api/v1/proposals/preview` → `previewProposal`
- `GET /api/v1/proposals` → `listProposals`
- `POST /api/v1/proposals` → `createDraft`
- `GET /api/v1/proposals/{proposalId}` → `getProposal`
- `PATCH /api/v1/proposals/{proposalId}` → `updateDraft`
- `POST /api/v1/proposals/{proposalId}/submit` → `submitProposal`
- `POST /api/v1/proposals/{proposalId}/approve` → `approveProposal`
- `POST /api/v1/proposals/{proposalId}/reject` → `rejectProposal`
- `POST /api/v1/proposals/{proposalId}/copy` → `copyRejectedProposal`
- `GET /api/v1/proposals/{proposalId}/history` → `listProposalHistory`
