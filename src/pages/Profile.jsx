import { useState } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS } from "../utils.js";
import { ModalSheet, Btn, Stars, Divider } from "../components/UI.jsx";

const G = "#16A34A";
const GD = "#15803D";

// ── MyAds component ───────────────────────────────────
function MyAds({ lang, dark, ads, onOpen, onDelete }) {
  const th = theme(dark);
  const tx = T[lang];
  const [tab, setTab] = useState("active");
  const active = ads.filter(a => a.active !== false);
  const archive = ads.filter(a => a.active === false);
  const list = tab === "active" ? active : archive;

  return (
    <div>
      <div style={{ display:"flex", gap:4, background:th.card2, borderRadius:12, padding:4, marginBottom:16 }}>
        {[["active", tx.activeAds], ["archive", tx.inactiveAds]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            flex:1, padding:"10px", borderRadius:9, border:"none", cursor:"pointer",
            background: tab===v ? G : "transparent",
            color: tab===v ? "#fff" : th.sub, fontWeight:700, fontSize:13,
          }}>{l} ({v==="active" ? active.length : archive.length})</button>
        ))}
      </div>
      {list.map(ad => {
        const cat = CATEGORIES.find(c => c.id === ad.category);
        return (
          <div key={ad.id} style={{
            background:th.card, borderRadius:14, marginBottom:10,
            border:`1px solid ${th.border}`, overflow:"hidden",
          }}>
            {/* E'lon satri — bosilsa detail ochiladi */}
            <div style={{ display:"flex", gap:12, padding:"12px 14px", cursor:"pointer" }}
              onClick={() => onOpen(ad)}>
              <div style={{
                width:70, height:70, borderRadius:12, background:th.card2,
                flexShrink:0, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:30, overflow:"hidden",
              }}>
                {ad.photos?.[0]
                  ? <img src={ad.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : cat?.emoji || "📦"}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:3,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {ad.title}
                </div>
                <div style={{ fontSize:15, fontWeight:800, color:G, marginBottom:4 }}>
                  {ad.price===0 ? tx.free : ad.price===-1 ? tx.negotiable : `${formatPrice(ad.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:11, color:th.sub }}>
                  👁️ {ad.views||0} {tx.views} · {timeAgo(ad.createdAt, lang)}
                </div>
              </div>
            </div>
            {/* Action buttons */}
            <div style={{ display:"flex", borderTop:`1px solid ${th.border}` }}>
              <button style={{ flex:1, padding:"10px", background:"none", border:"none", color:th.sub, fontSize:12, fontWeight:600, cursor:"pointer", borderRight:`1px solid ${th.border}` }}>
                ✏️ {tx.edit}
              </button>
              <button style={{ flex:1, padding:"10px", background:"none", border:"none", color:th.sub, fontSize:12, fontWeight:600, cursor:"pointer", borderRight:`1px solid ${th.border}` }}>
                🚀 {tx.boost}
              </button>
              <button onClick={() => onDelete(ad.id)} style={{ flex:1, padding:"10px", background:"none", border:"none", color:"#EF4444", fontSize:12, fontWeight:600, cursor:"pointer" }}>
                🗑️ {tx.delete}
              </button>
            </div>
          </div>
        );
      })}
      {list.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 20px", color:th.sub }}>
          <div style={{ fontSize:48, marginBottom:10 }}>📋</div>
          <div style={{ fontSize:15, color:th.text }}>
            {lang==="uz" ? "E'lonlar yo'q" : "Нет объявлений"}
          </div>
        </div>
      )}
    </div>
  );
}


// ── Profile main export ───────────────────────────────
export default function Profile({
  lang, dark, currentUser, onLogin, onLangChange, onDarkToggle,
  myListings, onOpenListing, onAddListing, favIds, onOpenFav,
  onStartLive, onVerified,
}) {
  const th = theme(dark);
  const tx = T[lang];
  const [view, setView] = useState("main");
  const [showVerify, setShowVerify] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0); // 0=info, 1=selfie, 2=done
  const [isVerified, setIsVerified] = useState(currentUser?.verified || false);

  const headerGrad = `linear-gradient(135deg,${G},${GD})`;

  // ── MyID Verification flow ──────────────────────────
  const handleVerifyDone = () => {
    setIsVerified(true);
    setVerifyStep(2);
    onVerified?.();
  };

  // ── Inner pages ─────────────────────────────────────
  if (view === "myads") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:headerGrad, padding:"50px 16px 16px" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>{tx.myAds}</div>
      </div>
      <div style={{ padding:16 }}>
        <Btn dark={dark} onClick={onAddListing} style={{ marginBottom:16, background:G }}>
          + {lang==="uz" ? "Yangi e'lon qo'shish" : "Добавить объявление"}
        </Btn>
        <MyAds lang={lang} dark={dark}
          ads={myListings || []}
          onOpen={onOpenListing}
          onDelete={() => {}} />
      </div>
    </div>
  );

  if (view === "favorites") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:headerGrad, padding:"50px 16px 16px" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>❤️ {tx.favorites}</div>
      </div>
      <div style={{ padding:16 }}>
        {DEMO_LISTINGS.filter(l => favIds?.includes(l.id)).map(l => {
          const cat = CATEGORIES.find(c => c.id === l.category);
          return (
            <div key={l.id} onClick={() => onOpenFav(l)} style={{
              background:th.card, borderRadius:14, marginBottom:10,
              border:`1px solid ${th.border}`, display:"flex",
              overflow:"hidden", cursor:"pointer",
            }}>
              <div style={{ width:90, height:90, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>
                {l.photos?.[0]
                  ? <img src={l.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : cat?.emoji}
              </div>
              <div style={{ flex:1, padding:"10px 12px" }}>
                <div style={{ fontSize:14, fontWeight:600, color:th.text, marginBottom:4 }}>{l.title}</div>
                <div style={{ fontSize:15, fontWeight:800, color:G }}>
                  {l.price===0 ? tx.free : l.price===-1 ? tx.negotiable : `${formatPrice(l.price)} ${tx.sum}`}
                </div>
                <div style={{ fontSize:11, color:th.sub, marginTop:4 }}>📍 {l.city}</div>
              </div>
            </div>
          );
        })}
        {!favIds?.length && (
          <div style={{ textAlign:"center", padding:"60px 0", color:th.sub }}>
            <div style={{ fontSize:56, marginBottom:12 }}>🤍</div>
            <div style={{ fontWeight:700, color:th.text }}>
              {lang==="uz" ? "Saqlangan e'lonlar yo'q" : "Нет избранных"}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (view === "settings") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:headerGrad, padding:"50px 16px 16px" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:10 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>⚙️ {tx.settings}</div>
      </div>
      <div style={{ padding:16 }}>
        {/* Appearance */}
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}`, marginBottom:16 }}>
          <div style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:th.sub, borderBottom:`1px solid ${th.border}` }}>
            {lang==="uz" ? "KO'RINISH" : "ВНЕШНИЙ ВИД"}
          </div>
          <div onClick={onDarkToggle} style={{ padding:"16px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
            <span style={{ fontSize:14, color:th.text }}>{dark ? "☀️" : "🌙"} {tx.darkMode}</span>
            <div style={{ width:46, height:26, borderRadius:13, background:dark?G:th.border2, position:"relative", transition:"background 0.3s" }}>
              <div style={{ position:"absolute", top:3, left:dark?23:3, width:20, height:20, borderRadius:10, background:"#fff", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
            </div>
          </div>
        </div>
        {/* Language */}
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}`, marginBottom:16 }}>
          <div style={{ padding:"12px 16px", fontSize:11, fontWeight:700, color:th.sub, borderBottom:`1px solid ${th.border}` }}>TIL / ЯЗЫК</div>
          <div style={{ padding:"12px 16px", display:"flex", gap:10 }}>
            {[["uz","🇺🇿 O'zbekcha"],["ru","🇷🇺 Русский"]].map(([l,label]) => (
              <button key={l} onClick={() => onLangChange(l)} style={{
                flex:1, padding:"12px 8px", borderRadius:12, cursor:"pointer",
                border:`2px solid ${lang===l?G:th.border}`,
                background:lang===l?G+"20":th.card,
                color:lang===l?G:th.text, fontWeight:700, fontSize:13,
              }}>{label}</button>
            ))}
          </div>
        </div>
        {/* Logout */}
        <div onClick={() => onLogin(null)} style={{
          background:th.card, borderRadius:16, padding:"16px",
          border:`1px solid ${th.border}`, cursor:"pointer",
          display:"flex", alignItems:"center", gap:12,
        }}>
          <div style={{ width:36, height:36, borderRadius:10, background:"#EF444420", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🚪</div>
          <span style={{ fontSize:15, color:"#EF4444", fontWeight:600 }}>{tx.logout}</span>
        </div>
      </div>
    </div>
  );

  if (view === "about") return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      <div style={{ background:headerGrad, padding:"50px 16px 28px", textAlign:"center" }}>
        <button onClick={() => setView("main")} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", display:"block", marginBottom:16 }}>←</button>
        <div style={{ width:70, height:70, borderRadius:20, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 10px" }}>🛒</div>
        <div style={{ color:"#fff", fontWeight:900, fontSize:24 }}>OsonTop</div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12, marginTop:4 }}>v2.0.0</div>
      </div>
      <div style={{ padding:16 }}>
        {[
          ["📦","Version","2.0.0"],
          ["👨‍💻",lang==="uz"?"Ishlab chiquvchi":"Разработчик","OsonTop Team"],
          ["📧","Email","support@osontop.uz"],
          ["📱","Telegram","@osontop_uz"],
        ].map(([icon,label,val],i)=>(
          <div key={i} style={{ background:th.card, borderRadius:14, padding:"14px 16px", marginBottom:8, display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${th.border}` }}>
            <span style={{ fontSize:14, color:th.text }}>{icon} {label}</span>
            <span style={{ fontSize:13, color:th.sub, fontWeight:600 }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── MAIN PROFILE ─────────────────────────────────────
  const menuItems = [
    { icon:"📋", label:tx.myAds,       color:G,         action:() => setView("myads") },
    { icon:"❤️", label:tx.favorites,   color:"#EF4444", action:() => setView("favorites") },
    { icon:"⭐", label:tx.myReviews,   color:"#F59E0B", action:() => {} },
    { icon:"✅", label:tx.verifyId,    color:"#1DA1F2", action:() => setShowVerify(true) },
    { icon:"🎥", label: tx.liveStream || "Jonli efir", color:"#EF4444", action:() => {
        if (isVerified) onStartLive?.();
        else setShowVerify(true);
    }},
    { icon:"🔔", label:tx.notifications,color:"#F59E0B",action:() => {} },
    { icon:"⚙️", label:tx.settings,    color:"#6B7280", action:() => setView("settings") },
    { icon:"🎧", label:tx.help,        color:G,         action:() => {} },
    { icon:"ℹ️", label:tx.about,       color:"#3B82F6", action:() => setView("about") },
  ];

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:headerGrad, padding:"50px 16px 24px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:16 }}>
          <div style={{
            width:64, height:64, borderRadius:20,
            background:"rgba(255,255,255,0.2)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, border:"2px solid rgba(255,255,255,0.3)",
          }}>
            {currentUser?.name?.[0] || "👤"}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>
              {currentUser?.name || (lang==="uz" ? "Mehmon" : "Гость")}
            </div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13, marginTop:2 }}>
              {currentUser?.phone || (lang==="uz" ? "Kirish qilinmagan" : "Не авторизован")}
            </div>
            {currentUser && (
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:6 }}>
                <div style={{
                  background: isVerified ? "#27AE60" : "rgba(255,255,255,0.15)",
                  borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700,
                  color:"#fff", display:"flex", alignItems:"center", gap:4,
                }}>
                  {isVerified ? "✓ " + tx.verified : "○ " + tx.notVerified}
                </div>
                {isVerified && (
                  <div style={{ background:"#EF4444", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, color:"#fff" }}>
                    🎥 LIVE
                  </div>
                )}
              </div>
            )}
          </div>
          {currentUser && (
            <button style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.25)", borderRadius:10, width:36, height:36, color:"#fff", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>✏️</button>
          )}
        </div>

        {/* Stats */}
        {currentUser && (
          <div style={{ display:"flex", background:"rgba(255,255,255,0.1)", borderRadius:12, overflow:"hidden" }}>
            {[
              [myListings?.length || 0, lang==="uz" ? "E'lonlar" : "Объявления"],
              [favIds?.length || 0,     lang==="uz" ? "Saqlangan" : "Избранное"],
              [currentUser.reviewCount || 0, tx.reviews],
            ].map(([v,l],i,arr) => (
              <div key={i} style={{ flex:1, padding:"12px 8px", textAlign:"center", borderRight:i<arr.length-1?"1px solid rgba(255,255,255,0.15)":"none" }}>
                <div style={{ color:"#fff", fontWeight:900, fontSize:20 }}>{v}</div>
                <div style={{ color:"rgba(255,255,255,0.6)", fontSize:11, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding:"16px 16px 0" }}>
        {/* Guest CTA */}
        {!currentUser ? (
          <div style={{ background:th.card, borderRadius:16, padding:"20px", border:`1px solid ${th.border}`, textAlign:"center", marginBottom:16 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🔐</div>
            <div style={{ fontSize:16, fontWeight:700, color:th.text, marginBottom:6 }}>
              {lang==="uz" ? "Kirish qiling" : "Войдите в аккаунт"}
            </div>
            <div style={{ fontSize:13, color:th.sub, marginBottom:16 }}>
              {lang==="uz" ? "E'lon joylash va xabar yozish uchun" : "Для подачи объявлений и переписки"}
            </div>
            <Btn dark={dark} onClick={onLogin} style={{ background:G }}>
              {lang==="uz" ? "Kirish / Ro'yxatdan o'tish" : "Войти / Зарегистрироваться"}
            </Btn>
          </div>
        ) : !isVerified ? (
          /* Verify banner */
          <div onClick={() => setShowVerify(true)} style={{
            background: G+"12", borderRadius:14, padding:"14px 16px",
            border:`1px solid ${G}30`, marginBottom:16,
            display:"flex", alignItems:"center", gap:12, cursor:"pointer",
          }}>
            <span style={{ fontSize:24 }}>✅</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:G }}>{tx.verifyId}</div>
              <div style={{ fontSize:12, color:th.sub }}>{tx.verifyIdDesc}</div>
            </div>
            <span style={{ fontSize:14, color:th.sub }}>→</span>
          </div>
        ) : (
          /* Live Stream banner (verified users) */
          <div onClick={() => onStartLive?.()} style={{
            background:"linear-gradient(135deg,#EF4444,#DC2626)",
            borderRadius:14, padding:"14px 16px", marginBottom:16,
            display:"flex", alignItems:"center", gap:12, cursor:"pointer",
            boxShadow:"0 4px 16px rgba(239,68,68,0.3)",
          }}>
            <div style={{ width:42, height:42, borderRadius:12, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🎥</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:800, color:"#fff" }}>
                {tx.goLive || "Jonli efir boshlash"}
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)" }}>
                {lang==="uz" ? "Mahsulotlaringizni ko'rsating" : "Покажите товары в эфире"}
              </div>
            </div>
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:8, padding:"4px 10px" }}>
              <span style={{ color:"#fff", fontSize:12, fontWeight:700 }}>LIVE →</span>
            </div>
          </div>
        )}

        {/* Menu list */}
        <div style={{ background:th.card, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}` }}>
          {menuItems.map((item, i, arr) => (
            <div key={i} onClick={item.action} style={{
              display:"flex", alignItems:"center", gap:14, padding:"15px 16px",
              borderBottom: i<arr.length-1 ? `1px solid ${th.border}` : "none",
              cursor:"pointer",
            }}>
              <div style={{ width:36, height:36, borderRadius:10, background:item.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                {item.icon}
              </div>
              <span style={{ flex:1, fontSize:15, color:th.text }}>{item.label}</span>
              {item.label === (tx.liveStream||"Jonli efir") && !isVerified && (
                <span style={{ fontSize:10, background:"#F59E0B20", color:"#F59E0B", padding:"2px 7px", borderRadius:6, fontWeight:700 }}>
                  {lang==="uz" ? "Tasdiqlov kerak" : "Нужна верификация"}
                </span>
              )}
              {item.label === (tx.liveStream||"Jonli efir") && isVerified && (
                <span style={{ fontSize:10, background:"#EF444420", color:"#EF4444", padding:"2px 7px", borderRadius:6, fontWeight:700 }}>LIVE</span>
              )}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={th.sub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          ))}
        </div>
      </div>

      {/* MyID Verify Modal */}
      {showVerify && (
        <ModalSheet dark={dark} onClose={() => { setShowVerify(false); setVerifyStep(0); }}>
          {verifyStep === 0 && (
            <div>
              <div style={{ textAlign:"center", marginBottom:20 }}>
                <div style={{ fontSize:52, marginBottom:8 }}>✅</div>
                <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:6 }}>MyID Verification</div>
                <div style={{ fontSize:13, color:th.sub, lineHeight:1.6 }}>
                  {lang==="uz"
                    ? "Tasdiqlash orqali Live Stream va Premium funksiyalardan foydalaning"
                    : "После верификации получите доступ к Live Stream и Premium функциям"}
                </div>
              </div>
              {[
                { icon:"🪪", text: lang==="uz"?"Passport yoki ID kartangizni tayyorlang":"Подготовьте паспорт или ID карту" },
                { icon:"📸", text: lang==="uz"?"Selfie suratga oling":"Сделайте селфи" },
                { icon:"✅", text: lang==="uz"?"Ma'lumotlar 1 daqiqada tekshiriladi":"Данные проверяются за 1 минуту" },
                { icon:"🎥", text: lang==="uz"?"Live Stream funksiyasi ochiladi":"Откроется функция Live Stream" },
              ].map((s,i)=>(
                <div key={i} style={{ display:"flex", gap:12, padding:"11px 0", borderBottom:i<3?`1px solid ${th.border}`:"none", alignItems:"center" }}>
                  <span style={{ fontSize:22 }}>{s.icon}</span>
                  <span style={{ fontSize:14, color:th.text }}>{s.text}</span>
                </div>
              ))}
              <div style={{ marginTop:20, display:"flex", gap:10 }}>
                <Btn dark={dark} variant="ghost" onClick={() => { setShowVerify(false); setVerifyStep(0); }} style={{ flex:1 }}>
                  {lang==="uz" ? "Keyinroq" : "Позже"}
                </Btn>
                <Btn dark={dark} onClick={() => setVerifyStep(1)} style={{ flex:2, background:G }}>
                  {lang==="uz" ? "Tasdiqlashni boshlash" : "Начать верификацию"}
                </Btn>
              </div>
            </div>
          )}

          {verifyStep === 1 && (
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:52, marginBottom:8 }}>📸</div>
              <div style={{ fontSize:17, fontWeight:800, color:th.text, marginBottom:6 }}>
                {lang==="uz" ? "Selfie oling" : "Сделайте селфи"}
              </div>
              <div style={{ fontSize:13, color:th.sub, marginBottom:20, lineHeight:1.6 }}>
                {lang==="uz"
                  ? "Passport bilan birga selfie oling va MyID ga yuboring"
                  : "Сделайте селфи с паспортом и отправьте через MyID"}
              </div>
              <div style={{
                width:"80%", aspectRatio:"4/3", background:th.card2,
                borderRadius:16, margin:"0 auto 20px",
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`2px dashed ${th.border2}`, cursor:"pointer",
              }}>
                <div>
                  <div style={{ fontSize:40, marginBottom:6 }}>📷</div>
                  <div style={{ fontSize:12, color:th.sub }}>
                    {lang==="uz" ? "Kamera" : "Камера"}
                  </div>
                </div>
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <Btn dark={dark} variant="ghost" onClick={() => setVerifyStep(0)} style={{ flex:1 }}>← {lang==="uz"?"Orqaga":"Назад"}</Btn>
                <Btn dark={dark} onClick={handleVerifyDone} style={{ flex:2, background:G }}>
                  {lang==="uz" ? "MyID ga yuborish" : "Отправить в MyID"}
                </Btn>
              </div>
            </div>
          )}

          {verifyStep === 2 && (
            <div style={{ textAlign:"center", padding:"10px 0" }}>
              <div style={{ fontSize:64, marginBottom:12 }}>🎉</div>
              <div style={{ fontSize:18, fontWeight:800, color:G, marginBottom:8 }}>
                {lang==="uz" ? "Tabriklaymiz!" : "Поздравляем!"}
              </div>
              <div style={{ fontSize:14, color:th.text, marginBottom:6 }}>
                {lang==="uz" ? "Siz muvaffaqiyatli tasdiqlandingiz" : "Вы успешно верифицированы"}
              </div>
              <div style={{ fontSize:13, color:th.sub, marginBottom:24, lineHeight:1.6 }}>
                {lang==="uz"
                  ? "Endi Live Stream va barcha premium funksiyalardan foydalanishingiz mumkin 🎥"
                  : "Теперь вам доступны Live Stream и все премиум функции 🎥"}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                <Btn dark={dark} onClick={() => { setShowVerify(false); setVerifyStep(0); onStartLive?.(); }} style={{ background:"#EF4444" }}>
                  🎥 {lang==="uz" ? "Hoziroq efir boshlash" : "Начать эфир сейчас"}
                </Btn>
                <Btn dark={dark} variant="ghost" onClick={() => { setShowVerify(false); setVerifyStep(0); }}>
                  {lang==="uz" ? "Keyinroq" : "Позже"}
                </Btn>
              </div>
            </div>
          )}
        </ModalSheet>
      )}
    </div>
  );
}
