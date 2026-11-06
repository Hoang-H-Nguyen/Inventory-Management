import FeaturePlaceholder from '../../shared/components/FeaturePlaceholder.jsx';

export default function AuthPage() {
  return <FeaturePlaceholder
    title="Đăng nhập và phiên làm việc"
    stories="US13"
    description="Chuẩn hóa username; băm mật khẩu và token; phiên tối đa 8 giờ; đổi mật khẩu tạm; thu hồi phiên. Không dùng JWT thay cho opaque token đã đặc tả."
  />;
}
