import React, { useState } from "react";

const data = {
  pr: {
    number: 3,
    title: "netlify-deploy → main",
    deployUrl: "https://deploy-preview-3--peppy-torte-10214f.netlify.app",
    latestCommit: "ce7f947e4dfadf8a91275270dcffaa17b6e17414",
    status: "ready",
  },
  project: {
    name: "OsonTop",
    description: "O'zbekiston uchun e'lonlar platformasi (OLX/BirBir analogи)",
    stack: ["React 18", "Vite", "Firebase", "Netlify", "Yandex Maps"],
    color: "#16A34A",
    maxWidth: "430px (mobil-first)",
  },
  commits: [
    { hash: "6cd6f7a", msg: "fix: barcha 13 feature to'liq integratsiya qilindi" },
    { hash: "65fc453", msg: "feat: 13 ta yangi funksiya qo'shildi — OsonTop complete" },
    { hash: "ce7f947", msg: "merge: OsonTop full app - green theme, Yandex Maps, Live Stream" },
    { hash: "fb7f978", msg: "fix: rebrand to OsonTop + yashil tema + Yandex Maps + Live Stream" },
    { hash: "2f996e0", msg: "feat: full BirBir-inspired classified ads frontend" },
    { hash: "4458d97", msg: "fix: netlify.toml + SPA redirects qo'shildi" },
  ],
  stats: {
    filesChanged: 27,
    additions: 5092,
    deletions: 994,
    totalLines: 6548,
    features: 13,
    pages: 9,
  },
  newFeatures: [
    { file: "AIRecommendations.jsx", desc: "AI asosida 'Siz uchun' va 'Trending' feed", lines: 175 },
    { file: "PriceNegotiation.jsx", desc: "Narx muzokarasi — taklif, qarama-qarshi, qabul/rad", lines: 348 },
    { file: "SafeDeal.jsx", desc: "Xavfsiz bitim — escrow (Payme/Click/Uzum)", lines: 189 },
    { file: "BoostPremium.jsx", desc: "E'lonni ko'tarish — Basic/Super/Premium", lines: 190 },
    { file: "AIImageAnalysis.jsx", desc: "AI rasm tahlili — kategoriya, narx, sarlavha avtomatik", lines: 232 },
    { file: "SellerDashboard.jsx", desc: "Sotuvchi statistika paneli — grafik, konversiya", lines: 259 },
    { file: "NearbyGPS.jsx", desc: "GPS yaqin atrofdagi e'lonlar — 500m/1/2/5km radius", lines: 239 },
    { file: "BarterSystem.jsx", desc: "Tovar almashtirish tizimi (barter)", lines: 157 },
    { file: "QRCode.jsx", desc: "SVG QR-kod generator va ulashish", lines: 156 },
    { file: "MahallaFeed.jsx", desc: "Mahalliy jamiyat tasmasi", lines: 266 },
    { file: "GroupBuy.jsx", desc: "Birga sotib olish — timer, progress, ulgurji narx", lines: 289 },
    { file: "Delivery.jsx", desc: "Yetkazib berish — Yandex Go/Express/Standart", lines: 249 },
    { file: "Gamification.jsx", desc: "XP tizimi, 12 badge, 7 daraja, leaderboard", lines: 327 },
  ],
  modifiedFiles: [
    { file: "App.jsx", change: "Barcha 13 feature bilan to'liq integratsiya", lines: 479 },
    { file: "ListingDetail.jsx", change: "Feature tugmalar, AI o'xshash e'lonlar, Yandex Maps mini-xarita", lines: 498 },
    { file: "LiveStream.jsx", change: "Yangi sahifa — jonli efir (MyID tasdiq kerak)", lines: 451 },
    { file: "Profile.jsx", change: "XP progress bar, level badge, feature menyu", lines: 407 },
    { file: "AddListing.jsx", change: "AI rasm tahlili step 0 ga qo'shildi", lines: 420 },
    { file: "Search.jsx", change: "Qidiruv tarixi (localStorage) qo'shildi", lines: 226 },
    { file: "theme.js", change: "Yashil rang sxemasi (OsonTop brending)", lines: 62 },
    { file: "translations.js", change: "UZ + RU to'liq tarjimalar", lines: 14 },
    { file: "netlify.toml", change: "Build config va SPA redirect sozlamalari", lines: 8 },
  ],
  positives: [
    "13 ta noyob funksiya — OLX/Avito da yo'q (barter, group buy, mahalla feed)",
    "Ikki tilli qo'llab-quvvatlash — O'zbekcha va Ruscha to'liq i18n",
    "Netlify deploy — SPA redirect to'g'ri sozlangan, preview ishlaydi ✅",
    "Yashil OsonTop brendlashi barcha komponentlarda izchil",
    "LocalStorage — auth, favorites, XP, offers ma'lumotlari saqlanadi",
    "Mobil-first dizayn — max-width 430px, responsive",
  ],
  issues: {
    critical: [
      {
        title: "Yandex Maps API kaliti ochiq (index.html)",
        detail: `<script src="https://api-maps.yandex.ru/2.1/?apikey=7a29e12a-...">`,
        fix: "Environment variable (.env) ga o'tkazish kerak: VITE_YANDEX_API_KEY",
      },
      {
        title: "index.html da eski BirBir brending qolgan",
        detail: `<meta name="description" content="BirBir - ..."> va <title>BirBir — E'lonlar...</title>`,
        fix: "OsonTop ga o'zgartirish kerak",
      },
      {
        title: "package.json name hali 'birbir-clone'",
        detail: `"name": "birbir-clone"`,
        fix: `"name": "osontop" ga o'zgartirish`,
      },
    ],
    medium: [
      {
        title: "AI tavsiyalar Math.random() asosida",
        detail: "score: (catCount[l.category] || 0) + Math.random() * 2",
        fix: "Haqiqiy ML model yoki Firebase-based recommendation engine kerak",
      },
      {
        title: "GPS simulyatsiya (haqiqiy emas)",
        detail: "NearbyGPS.jsx da demo koordinatalar ishlatilgan",
        fix: "navigator.geolocation.getCurrentPosition() haqiqiy API bilan almashtirish",
      },
      {
        title: "SafeDeal/Delivery — UI mockup, real to'lov yo'q",
        detail: "Payme/Click/Uzum integratsiya faqat vizual",
        fix: "Haqiqiy to'lov API larni ulash kerak",
      },
      {
        title: "Duplicate badge condition",
        detail: "popular va hundred_views — ikkalasi ham totalViews >= 100",
        fix: "Har bir badge uchun alohida shart belgilash",
      },
    ],
    minor: [
      { title: "QR kod — haqiqiy algoritm yo'q, SVG simulyatsiya" },
      { title: "LiveStream — WebRTC/socket.io integratsiya yo'q, faqat UI" },
      { title: "DEMO_LISTINGS — haqiqiy Firebase data bilan almashtirilmagan" },
    ],
  },
};

// ─── UI Komponentlar ───────────────────────────────────────────────

const Badge = ({ color, children }) => {
  const colors = {
    green: { bg: "#dcfce7", text: "#15803d" },
    red: { bg: "#fee2e2", text: "#b91c1c" },
    yellow: { bg: "#fef9c3", text: "#a16207" },
    blue: { bg: "#dbeafe", text: "#1d4ed8" },
    gray: { bg: "#f3f4f6", text: "#374151" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span
      style={{
        background: c.bg,
        color: c.text,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {children}
    </span>
  );
};

const Card = ({ children, style }) => (
  <div
    style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      padding: 20,
      marginBottom: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon, title }) => (
  <h2
    style={{
      fontSize: 17,
      fontWeight: 700,
      color: "#111827",
      marginBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}
  >
    <span>{icon}</span> {title}
  </h2>
);

const StatBox = ({ label, value, color }) => (
  <div
    style={{
      textAlign: "center",
      padding: "12px 8px",
      background: "#f9fafb",
      borderRadius: 10,
      border: "1px solid #e5e7eb",
      flex: 1,
    }}
  >
    <div style={{ fontSize: 22, fontWeight: 800, color: color || "#111827" }}>{value}</div>
    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{label}</div>
  </div>
);

// ─── Asosiy Komponent ──────────────────────────────────────────────

export default function PRAnalysis() {
  const [tab, setTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "📋 Umumiy" },
    { id: "features", label: "🚀 Features" },
    { id: "files", label: "📁 Fayllar" },
    { id: "issues", label: "⚠️ Muammolar" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        maxWidth: 860,
        margin: "0 auto",
        padding: "24px 16px",
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: "#bbf7d0", marginBottom: 4 }}>
              github.com/saydullayevbahrom764-cmd/lito1993
            </div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff" }}>
              Pull Request #3 — Tahlil
            </h1>
            <div style={{ color: "#dcfce7", fontSize: 14, marginTop: 6 }}>
              {data.pr.title}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
            <Badge color="green">✅ Deploy Ready</Badge>
            <a
              href={data.pr.deployUrl}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#bbf7d0", fontSize: 12, textDecoration: "underline" }}
            >
              Preview → Netlify
            </a>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "Fayl", value: data.stats.filesChanged, color: "#fff" },
            { label: "+Qatorlar", value: `+${data.stats.additions.toLocaleString()}`, color: "#4ade80" },
            { label: "-Qatorlar", value: `-${data.stats.deletions}`, color: "#fca5a5" },
            { label: "Features", value: data.stats.features, color: "#fde68a" },
            { label: "Sahifalar", value: data.stats.pages, color: "#c4b5fd" },
            { label: "Jami qator", value: data.stats.totalLines.toLocaleString(), color: "#fff" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                padding: "10px 14px",
                background: "rgba(255,255,255,0.15)",
                borderRadius: 10,
                flex: 1,
                minWidth: 80,
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#dcfce7" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              background: tab === t.id ? "#16a34a" : "#fff",
              color: tab === t.id ? "#fff" : "#374151",
              boxShadow: tab === t.id ? "0 2px 8px rgba(22,163,74,0.3)" : "0 1px 3px rgba(0,0,0,0.08)",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <>
          <Card>
            <SectionTitle icon="🏗️" title="Loyiha haqida" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Nomi", value: data.project.name },
                { label: "Tavsif", value: data.project.description },
                { label: "Asosiy rang", value: data.project.color },
                { label: "Dizayn", value: data.project.maxWidth },
              ].map((r) => (
                <div key={r.label} style={{ background: "#f9fafb", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>TEXNOLOGIYA STEKI</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {data.project.stack.map((s) => (
                  <Badge key={s} color="blue">{s}</Badge>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle icon="📜" title="Commit tarixi" />
            {data.commits.map((c, i) => (
              <div
                key={c.hash}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: i < data.commits.length - 1 ? "1px solid #f3f4f6" : "none",
                }}
              >
                <code
                  style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    padding: "2px 8px",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {c.hash}
                </code>
                <span style={{ fontSize: 13, color: "#374151" }}>{c.msg}</span>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle icon="✅" title="Yaxshi jihatlar" />
            {data.positives.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < data.positives.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <span style={{ color: "#16a34a", fontSize: 16 }}>✓</span>
                <span style={{ fontSize: 13, color: "#374151" }}>{p}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* ── FEATURES ── */}
      {tab === "features" && (
        <Card>
          <SectionTitle icon="🚀" title="13 ta yangi funksiya (src/features/)" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {data.newFeatures.map((f, i) => (
              <div
                key={f.file}
                style={{
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "14px 16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 12,
                    fontSize: 11,
                    color: "#9ca3af",
                    background: "#e5e7eb",
                    padding: "2px 6px",
                    borderRadius: 6,
                  }}
                >
                  {f.lines} qator
                </div>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    background: "#16a34a",
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  {i + 1}
                </div>
                <code style={{ fontSize: 12, color: "#16a34a", fontWeight: 700, display: "block", marginBottom: 4 }}>
                  {f.file}
                </code>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── FILES ── */}
      {tab === "files" && (
        <Card>
          <SectionTitle icon="📁" title="O'zgartirilgan asosiy fayllar" />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f3f4f6" }}>
                {["Fayl", "O'zgarish", "Qatorlar"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      color: "#6b7280",
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.modifiedFiles.map((f, i) => (
                <tr
                  key={f.file}
                  style={{ background: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ padding: "10px 12px" }}>
                    <code style={{ color: "#16a34a", fontWeight: 700 }}>{f.file}</code>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#374151" }}>{f.change}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {f.lines}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── ISSUES ── */}
      {tab === "issues" && (
        <>
          {/* Critical */}
          <Card>
            <SectionTitle icon="🔴" title="Kritik muammolar" />
            {data.issues.critical.map((issue, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #fecaca",
                  borderLeft: "4px solid #ef4444",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 12,
                  background: "#fff5f5",
                }}
              >
                <div style={{ fontWeight: 700, color: "#b91c1c", fontSize: 14, marginBottom: 6 }}>
                  🔴 {issue.title}
                </div>
                <code
                  style={{
                    display: "block",
                    background: "#fee2e2",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#7f1d1d",
                    marginBottom: 8,
                    wordBreak: "break-all",
                  }}
                >
                  {issue.detail}
                </code>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ Tuzatish:</span>
                  <span style={{ fontSize: 12, color: "#374151" }}>{issue.fix}</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Medium */}
          <Card>
            <SectionTitle icon="🟡" title="O'rtacha muammolar" />
            {data.issues.medium.map((issue, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #fde68a",
                  borderLeft: "4px solid #f59e0b",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 12,
                  background: "#fffbeb",
                }}
              >
                <div style={{ fontWeight: 700, color: "#b45309", fontSize: 14, marginBottom: 6 }}>
                  🟡 {issue.title}
                </div>
                <code
                  style={{
                    display: "block",
                    background: "#fef3c7",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "#78350f",
                    marginBottom: 8,
                    wordBreak: "break-all",
                  }}
                >
                  {issue.detail}
                </code>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ Tuzatish:</span>
                  <span style={{ fontSize: 12, color: "#374151" }}>{issue.fix}</span>
                </div>
              </div>
            ))}
          </Card>

          {/* Minor */}
          <Card>
            <SectionTitle icon="🟢" title="Kichik muammolar" />
            {data.issues.minor.map((issue, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 14px",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderLeft: "4px solid #16a34a",
                  borderRadius: 8,
                  marginBottom: 10,
                  fontSize: 13,
                  color: "#374151",
                }}
              >
                <span>🟢</span>
                {issue.title}
              </div>
            ))}
          </Card>

          {/* Xulosa */}
          <Card style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", border: "none" }}>
            <h2 style={{ color: "#f8fafc", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>🏁 Xulosa</h2>
            <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              Bu PR <strong style={{ color: "#4ade80" }}>juda katta va muhim o'zgarishlar</strong> qiladi — aslida butun
              ilova qayta yozilgan. Netlify deploy preview muvaffaqiyatli ishlaydi. Asosiy muammo — ba'zi funksiyalar
              (AI, GPS, To'lov, QR, LiveStream) haqiqiy backend integratsiyasiz faqat{" "}
              <strong style={{ color: "#fbbf24" }}>UI mockup</strong> sifatida ishlaydi.{" "}
              <code style={{ background: "#334155", padding: "1px 6px", borderRadius: 4, color: "#f87171" }}>
                index.html
              </code>{" "}
              dagi eski brending va{" "}
              <strong style={{ color: "#f87171" }}>API kalitining ochiq turishini</strong> tezda tuzatish kerak.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ background: "#16a34a", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                ✅ Deploy: Tayyor
              </div>
              <div style={{ background: "#dc2626", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                🔴 3 ta kritik fix kerak
              </div>
              <div style={{ background: "#d97706", color: "#fff", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
                🟡 4 ta o'rtacha issue
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 8, paddingBottom: 24 }}>
        Tahlil qilindi: Kiro AI · PR #3 · saydullayevbahrom764-cmd/lito1993
      </div>
    </div>
  );
}
