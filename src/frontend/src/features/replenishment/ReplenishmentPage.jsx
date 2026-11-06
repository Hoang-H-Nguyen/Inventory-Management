import FeaturePlaceholder from '../../shared/components/FeaturePlaceholder.jsx';

export default function ReplenishmentPage() {
  return <FeaturePlaceholder
    title="Cảnh báo và đợt kiểm tra bổ sung"
    stories="US05"
    description="Position = on-hand + on-order - backorders; ROP = demand × lead time + safety stock; cảnh báo khi Position <= ROP; gợi ý max(0, target - Position). Daily và manual dùng chung service."
  />;
}
