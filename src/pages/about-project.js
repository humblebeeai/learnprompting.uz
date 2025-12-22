import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function AboutCollaboration() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Hamkorlik Haqida"
      description="Learn Prompting va HumblebeeAI hamkorligi"
    >
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ minHeight: "60vh", padding: "4rem 0" }}
      >
        <div className="hero-background">
          <div
            className="hero-gradient-orb hero-orb-1"
            style={{ opacity: 0.5 }}
          />
          <div className="hero-grid" />
        </div>

        <div
          className="container"
          style={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <div
            className="badge-pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(16, 185, 129, 0.1)",
              color: "var(--color-brand-primary)",
              padding: "0.5rem 1rem",
              borderRadius: "999px",
              fontSize: "0.9rem",
              fontWeight: "600",
              marginBottom: "2rem",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8V12L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>O'zbekiston uchun maxsus</span>
          </div>

          <h1
            style={{
              fontSize: "3.5rem",
              lineHeight: 1.1,
              marginBottom: "1.5rem",
              fontWeight: 800,
            }}
          >
            Zamonaviy bilimlar,{" "}
            <span className="title-accent" style={{ display: "inline" }}>
              Milliy rivojlanish
            </span>
          </h1>

          <p
            style={{
              fontSize: "1.25rem",
              color: "var(--color-text-secondary)",
              maxWidth: "700px",
              margin: "0 auto 3rem",
            }}
          >
            Ushbu loyiha <strong>Learn Prompting</strong>ning global tajribasi
            va <strong>HumblebeeAI</strong>ning mahalliy ekspertizasi
            birlashuvidir. Maqsadimiz - O'zbekistonda AI savodxonligini yangi
            bosqichga olib chiqish.
          </p>
        </div>
      </section>

      {/* Partners Logos/Grid */}
      <section
        style={{ padding: "4rem 0", background: "var(--color-bg-secondary)" }}
      >
        <div className="container">
          <div
            className="row"
            style={{
              alignItems: "center",
              justifyContent: "center",
              gap: "4rem",
            }}
          >
            {/* Learn Prompting */}
            <div className="col col--5" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                Learn Prompting
              </h3>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Dunyodagi eng yirik va mashhur ochiq manbali AI ta'lim
                platformasi. 3 milliondan ortiq foydalanuvchi, Google, OpenAI va
                Microsoft ekspertlari tomonidan e'tirof etilgan.
              </p>
            </div>

            {/* X divider */}
            <div
              className="col col--1"
              style={{ textAlign: "center", fontSize: "2rem", opacity: 0.3 }}
            >
              ×
            </div>

            {/* HumblebeeAI */}
            <div className="col col--5" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                HumblebeeAI
              </h3>
              <p style={{ color: "var(--color-text-secondary)" }}>
                Markaziy Osiyodagi yetakchi AI kompaniyasi. Bizning maqsadimiz -
                mintaqada sun'iy intellekt texnologiyalarini joriy etish va Top
                1% kadrlar tayyorlash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / President Initiative */}
      <section style={{ padding: "5rem 0" }}>
        <div className="container">
          <div className="row">
            <div
              className="col col--8 col--offset-2"
              style={{ textAlign: "center" }}
            >
              <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
                Nega bu kurs bepul?
              </h2>
              <p
                style={{
                  fontSize: "1.1rem",
                  marginBottom: "2rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                Biz ishonamizki, sun'iy intellekt bilimlariga ega bo'lish - bu
                hashamat emas, balki zamonaviy dunyoda zaruratdir.
              </p>

              <div
                className="alert alert--info"
                style={{
                  textAlign: "left",
                  padding: "2rem",
                  borderRadius: "16px",
                  border: "1px solid var(--color-brand-primary)",
                }}
              >
                <h4
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  Milliy Tashabbus
                </h4>
                <p style={{ marginBottom: 0 }}>
                  Ushbu loyiha O'zbekiston Respublikasi Prezidentining{" "}
                  <strong>"5 million o'zbek prompt muhandisi"</strong> (Digital
                  Uzbekistan 2030) strategiyasidan ilhomlangan holda yaratildi.
                  Biz har bir o'zbekistonlik - xoh u talaba, o'qituvchi yoki
                  tadbirkor bo'lsin - kelajak texnologiyalaridan erkin foydalana
                  olishini istaymiz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License & Attribution */}
      <section
        style={{
          padding: "4rem 0",
          background: "var(--color-bg-secondary)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col col--6">
              <h3>Litsenziya va Huquqlar</h3>
              <p>
                Ushbu kontent <strong>Creative Commons BY-NC-SA 4.0</strong>{" "}
                litsenziyasi asosida tarqatiladi.
              </p>
              <ul style={{ paddingLeft: "1.2rem", listStyle: "none" }}>
                <li
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    style={{ flexShrink: 0, marginTop: "0.2rem" }}
                  >
                    <path
                      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22 4 12 14.01 9 11.01"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <strong>Erkin foydalanish:</strong> O'qish, o'rganish va
                    ulashish bepul.
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    style={{ flexShrink: 0, marginTop: "0.2rem" }}
                  >
                    <path
                      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="22 4 12 14.01 9 11.01"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <strong>Moslashtirish:</strong> Materiallardan o'quv
                    dasturlari uchun foydalanish mumkin (manba ko'rsatilgan
                    holda).
                  </span>
                </li>
                <li
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    style={{ flexShrink: 0, marginTop: "0.2rem" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="15"
                      y1="9"
                      x2="9"
                      y2="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line
                      x1="9"
                      y1="9"
                      x2="15"
                      y2="15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>
                    <strong>Tijoriy foydalanish:</strong> Kontentni o'zlashtirib
                    sotish taqiqlanadi.
                  </span>
                </li>
              </ul>
            </div>
            <div className="col col--6">
              <h3>Bizga qo'shiling</h3>
              <p>
                Bu loyiha HumblebeeAI ochiq manba asosida tomonidan yuritiladi.
                Agar sizda takliflar bo'lsa yoki tarjimaga hissa qo'shmoqchi
                bo'lsangiz:
              </p>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <Link
                  className="button button--primary button--lg"
                  to="https://github.com/humblebeeai/Learn_Prompting"
                >
                  Loyihaga o'z hissangizni qo'shing
                </Link>
                <Link
                  className="button button--outline button--lg tg-button"
                  to="https://t.me/humblebeeai"
                >
                  Telegram kanalimiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
