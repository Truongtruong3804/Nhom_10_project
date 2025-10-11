import './App.css'

const highlights = [
  {
    icon: '🎁',
    title: 'Trao tặng miễn phí',
    description:
      'Chia sẻ lại những món đồ còn tốt để chúng tiếp tục được sử dụng và lan tỏa niềm vui.',
  },
  {
    icon: '🌱',
    title: 'Giảm rác thải',
    description:
      'Tái sử dụng giúp giảm lượng rác thải ra môi trường và xây dựng lối sống bền vững hơn.',
  },
  {
    icon: '🤝',
    title: 'Kết nối cộng đồng',
    description:
      'Gặp gỡ những người cùng chung tinh thần sẻ chia và giúp đỡ lẫn nhau mỗi ngày.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Đăng đồ cần cho tặng',
    description: 'Chụp ảnh, viết mô tả và đăng món đồ bạn muốn nhường lại cho người khác.',
  },
  {
    step: '02',
    title: 'Kết nối người nhận',
    description: 'Người có nhu cầu sẽ nhắn tin trao đổi, thống nhất cách nhận đồ thuận tiện nhất.',
  },
  {
    step: '03',
    title: 'Trao đi niềm vui',
    description: 'Gặp gỡ và trao món đồ – một hành động nhỏ góp phần tạo nên cộng đồng ấm áp.',
  },
]

const stats = [
  { value: '5k+', label: 'Đồ vật đã được trao tặng' },
  { value: '2k+', label: 'Thành viên đang hoạt động' },
  { value: '120+', label: 'Chiến dịch thiện nguyện' },
]

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__content">
          <span className="hero__tag">Cộng đồng sẻ chia đồ cũ</span>
          <h1 className="hero__title">Trao đi điều dư thừa, nhận lại niềm vui</h1>
          <p className="hero__description">
            Nơi kết nối những người muốn cho tặng đồ cũ với những ai thực sự cần. Cùng nhau xây dựng
            thói quen tái sử dụng, tiết kiệm chi phí và bảo vệ môi trường.
          </p>
          <div className="hero__actions">
            <button type="button" className="button button--primary">
              Khám phá đồ tặng
            </button>
            <button type="button" className="button button--secondary">
              Đăng cho tặng ngay
            </button>
          </div>
          <div className="hero__stats">
            {stats.map((item) => (
              <div key={item.label} className="hero__stat">
                <span className="hero__stat-value">{item.value}</span>
                <span className="hero__stat-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__card">
          <p className="hero__card-title">Vì một cộng đồng xanh</p>
          <p className="hero__card-text">
            Mỗi món đồ được trao tặng giúp tiết kiệm tài nguyên, giảm phát thải CO₂ và tạo nên vòng đời
            mới cho vật dụng cũ. Góp phần xây dựng một thành phố bền vững hơn.
          </p>
          <ul className="hero__list">
            {highlights.map((item) => (
              <li key={item.title} className="hero__list-item">
                <span className="hero__list-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="hero__list-title">{item.title}</p>
                  <p className="hero__list-description">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main className="main">
        <section className="steps">
          <div className="section-heading">
            <span className="section-tag">Bắt đầu thật dễ dàng</span>
            <h2 className="section-title">3 bước đơn giản để sẻ chia</h2>
            <p className="section-description">
              Tạo tài khoản miễn phí, đăng món đồ của bạn và kết nối với cộng đồng trong vài phút. Chúng
              tôi luôn đồng hành để việc cho tặng diễn ra thuận lợi nhất.
            </p>
          </div>
          <div className="steps__list">
            {steps.map((step) => (
              <article key={step.step} className="step-card">
                <span className="step-card__number">{step.step}</span>
                <h3 className="step-card__title">{step.title}</h3>
                <p className="step-card__description">{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Tham gia cùng <strong>FreeCycle Việt Nam</strong> để biến những món đồ cũ thành câu chuyện mới
          cho cộng đồng.
        </p>
      </footer>
    </div>
  )
}

export default App
