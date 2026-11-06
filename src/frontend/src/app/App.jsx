import { NavLink, Route, Routes } from 'react-router-dom';
import { featureRoutes } from './routes.jsx';

export default function App() {
  return <div className="shell">
    <aside>
      <strong>StockMate</strong>
      <p>Code structure</p>
      <nav aria-label="Module trong khung dự án">
        {featureRoutes.map(route => <NavLink key={route.path} to={route.path}>{route.title}</NavLink>)}
      </nav>
    </aside>
    <main>
      <div className="notice">Đây là khung phát triển. Đăng nhập và phân quyền chưa được triển khai.</div>
      <Routes>
        <Route path="/" element={<section><h1>Khung mã nguồn StockMate</h1><p>Chọn module để xem trách nhiệm và các quy tắc cần triển khai theo tài liệu.</p></section>} />
        {featureRoutes.map(route => <Route key={route.path} path={route.path} element={route.element} />)}
        <Route path="*" element={<section><h1>Không tìm thấy trang</h1></section>} />
      </Routes>
    </main>
  </div>;
}
