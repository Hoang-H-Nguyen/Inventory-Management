import AuthPage from '../features/auth/AuthPage.jsx';
import UserPage from '../features/users/UserPage.jsx';
import CatalogPage from '../features/catalog/CatalogPage.jsx';
import InventoryPage from '../features/inventory/InventoryPage.jsx';
import PlacedOrderPage from '../features/orders/PlacedOrderPage.jsx';
import BackorderPage from '../features/backorders/BackorderPage.jsx';
import DemandPage from '../features/demand/DemandPage.jsx';
import ReplenishmentPage from '../features/replenishment/ReplenishmentPage.jsx';
import ProposalPage from '../features/proposals/ProposalPage.jsx';
import AiDraftPage from '../features/ai/AiDraftPage.jsx';
import DashboardPage from '../features/dashboard/DashboardPage.jsx';

// Development navigation only. TODO: derive identity from GET /me and implement
// auth/forced-password-change/role guards. UI guards never replace backend checks.
export const featureRoutes = [
  { path: "/auth", title: "Đăng nhập và phiên làm việc", element: <AuthPage /> },
  { path: "/users", title: "Quản trị tài khoản", element: <UserPage /> },
  { path: "/catalog", title: "Sản phẩm, nhà cung cấp và chính sách", element: <CatalogPage /> },
  { path: "/inventory", title: "Tồn kho và biến động", element: <InventoryPage /> },
  { path: "/orders", title: "Đơn mua đã đặt", element: <PlacedOrderPage /> },
  { path: "/backorders", title: "Hàng còn nợ khách", element: <BackorderPage /> },
  { path: "/demand", title: "Lịch sử bán và phân tích nhu cầu", element: <DemandPage /> },
  { path: "/replenishment", title: "Cảnh báo và đợt kiểm tra bổ sung", element: <ReplenishmentPage /> },
  { path: "/proposals", title: "Đề xuất và quyết định phê duyệt", element: <ProposalPage /> },
  { path: "/ai", title: "Trợ lý soạn đề xuất", element: <AiDraftPage /> },
  { path: "/dashboard", title: "Tổng quan cho Manager", element: <DashboardPage /> },
];
