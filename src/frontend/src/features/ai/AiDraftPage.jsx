import FeaturePlaceholder from '../../shared/components/FeaturePlaceholder.jsx';

export default function AiDraftPage() {
  return <FeaturePlaceholder
    title="Trợ lý soạn đề xuất"
    stories="US06"
    description="Gemini chỉ tạo/sửa Draft qua service có kiểm quyền và kiểm ownership. Không submit/approve/ghi stock/đặt hàng; không tự giảm số lượng để vừa budget. Form vẫn dùng được khi AI lỗi."
  />;
}
