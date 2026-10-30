# Radial Functional Mind Map — Generation Prompt

Tool: built-in imagegen. Output: `functional-mindmap-radial.png`.

## Prompt

Use case: infographic-diagram.
Generate a polished high-resolution landscape RADIAL MIND MAP entirely in English for project documentation.
Composition: CENTRAL project name, six major branches radiating around it, smaller function branches extending outward, then short feature leaves. Genuine organic radial mindmap, NOT top-down hierarchy, NOT columns/cards, NOT a sequential flowchart. Balanced generous whitespace, readable sans-serif labels, white background, navy central rounded node, six distinct restrained colors with curved branching lines, branch thickness decreasing with depth. All branches clearly attached to parents, no crossing or overlap. Use full canvas with generous margins, text readable.
CENTER exact title: "Inventory Management System".
Arrange six major functional branches around center (3 on left, 3 on right); functions extend away from center toward the outside edges. Keep labels horizontal. Content hierarchy EXACTLY:
1 "Inventory Management"
  "UC01 · View Inventory"
    "SKU, name, quantity, unit"
    "Search by SKU or name"
  "UC02 · Update Inventory"
    "Warehouse Staff only"
    "Reject negative quantities"
2 "Demand Analysis"
  "UC03 · Sales History"
    "Filter by SKU and date"
  "UC04 · Estimate Demand"
    "Average daily demand"
    "Handle missing data"
3 "Low-stock Detection"
  "UC05 · Detect Low Stock"
    "Calculate reorder point"
    "Compare stock with ROP"
    "List low-stock SKUs"
4 "Replenishment Proposals"
  "UC06 · Generate Proposal"
    "Recommend non-negative quantity"
    "Consider stock and open orders"
    "Submit for approval"
  "UC07 · View Proposals"
    "SKU, quantity, status"
    "Filter by status"
5 "Approval Workflow"
  "UC08 · Approve Proposal"
    "Pending → Approved"
    "Prevent repeat processing"
  "UC09 · Reject Proposal"
    "Pending → Rejected"
    "Require rejection reason"
6 "Dashboard"
  "UC10 · View Overview"
    "Total SKUs"
    "Low-stock SKUs"
    "Pending proposals"
Small role annotation beside major branch labels: Inventory Management: "Staff / Planner"; Demand Analysis: "Planner"; Low-stock Detection: "Planner"; Replenishment Proposals: "Planner / Manager"; Approval Workflow: "Manager"; Dashboard: "Manager".
Small amber dot markers beside UC09 and Dashboard, with a small footer legend "Amber dot = Should Have · All other use cases = Must Have".
Small unobtrusive footer business rule: "ROP = Average Daily Demand × Lead Time + Safety Stock".
No extra invented functions, no user admin/supplier modules, no decorative illustrations, no watermark. Correct English spelling and all ten UC IDs once each. Design for clear functional exploration around a central idea.
