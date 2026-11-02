# StockMate — Business Rules

These are the decisions agreed for the project. The [README](../README.md) remains the main project outline.

## 1. Replenishment Trigger and Demand Period

Flag a product when Inventory Position <= Reorder Point. A ROP of 30 is an example, not a fixed threshold for every product.

Use sales from the most recent 30 completed calendar days:

~~~text
Average Daily Demand = Total Sales over 30 Days / 30
Inventory Position = On-hand + On-order − Backorders
ROP = Average Daily Demand × Lead Time + Safety Stock
Suggested Quantity = max(0, Target Stock − Inventory Position)
~~~

Checks run daily or on request. Missing data must be reported, not assumed to be zero.

## 2. Data Entry and Responsibilities

Data is entered through StockMate forms.

| Role | Responsibility |
|---|---|
| Warehouse Staff | Receipts, sales issues, backorder deliveries and physical-count adjustments |
| Inventory Planner | Products, suppliers, prices, stock policies, placed orders, customer backorders and proposal preparation |
| Manager | Proposal approval or rejection |

The system calculates stock balances and outstanding quantities from the recorded changes:

~~~text
On-order = Ordered − Received − Cancelled
Backorders = Recorded Waiting Quantity − Delivered Quantity − Cancelled
~~~

Here, “Recorded Waiting Quantity” is the unmet quantity recorded when a customer backorder is created. All quantities in each formula are cumulative for the same record.

Example: order 100, receive 40 → on-order 60. Receive the remaining 60 → on-order 0; alternatively, cancel that 60 → on-order 0 without adding stock. Keep the history in either case.

## 3. Products and Suppliers in a Proposal

A proposal may combine multiple products and suppliers. When a product has several suppliers, the Planner chooses which one to use.

## 4. Exceeding the Budget

Show the amount over budget and block submission. The Planner changes quantities, removes products or changes the budget. Recalculate after each edit; do not automatically reduce quantities.

## 5. Budget per Proposal

The Planner enters a separate limit for each proposal. It is not a shared fund, and approving one proposal does not reduce another proposal's budget.

Line Cost = Selected Quantity × Supplier Price. Proposal Total = Sum of Line Costs.

## 6. Receipts and Sales Issues

Staff select a placed order when receiving goods. Increase on-hand stock and reduce on-order by the quantity received.

Stock issues in this project are sales. Reduce on-hand stock and record the sale once. A delivery to a waiting customer also reduces that customer's backorder.

A physical-count adjustment changes stock but is not a sale.

## 7. Customer Backorders

The Planner records the quantity a customer is waiting for because of insufficient stock. When Staff deliver against that record, reduce on-hand stock and backorders together, and record one sale.

If the customer cancels an undelivered quantity, the Planner records the cancellation. Reduce backorders only; keep stock unchanged and retain the history.

Example: stock 20/backorders 10 → deliver 6 → stock 14/backorders 4. Cancel the remaining 4 → stock 14/backorders 0.

## 8. Rejected Proposals

The Planner may copy a rejected proposal into a new draft, then edit and submit it. Keep the rejected original unchanged and link the new draft to it. Check current data and prices before submitting the new proposal.

## 9. AI Permissions

AI only creates or edits proposal drafts. It retrieves data, asks backend functions to calculate and explains the result. The Planner reviews and submits; the Manager approves or rejects.

AI does not submit proposals, approve decisions or record stock/order changes. Forms remain usable if AI fails.

## 10. Accounts and Access

Users sign in with an Admin-provisioned username/password. Admin is a separate fourth role with account-management permissions only; the three business roles retain their responsibilities. Each account has one role. Username is unique and immutable; locked accounts cannot sign in. No public registration or email recovery.

Admin creates active accounts and assigns temporary passwords. New/reset users must change their password before entering business screens. Passwords are 8–128 characters; the new password differs from the current one. Locking, role changes and password resets/changes invalidate previous sessions. Logout ends the current session.

Keep account IDs and history; do not hard-delete users. Do not permit self-lock/self-demotion or removal of the last active Admin. Log account actions by actor/target/time without credentials. Planner drafts belong to their creator.
