export default function FeaturePlaceholder({ title, stories, description }) {
  return <section>
    <p className="eyebrow">{stories} · Khung màn hình</p>
    <h1>{title}</h1>
    <p>{description}</p>
    <p role="status">Chức năng này chưa được triển khai. Chưa có dữ liệu nghiệp vụ được tải hoặc thay đổi.</p>
  </section>;
}
