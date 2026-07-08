import { useState, useEffect } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { ModalSheet, Btn } from "../components/UI.jsx";

const G = "#16A34A";

// ── Badge ta'riflari ──────────────────────────────────
export const BADGES = [
  { id:"first_listing",  icon:"🎯", color:"#3B82F6", xp:50,  name:{ uz:"Birinchi e'lon",   ru:"Первое объявление"    }, desc:{ uz:"Birinchi e'loningizni joylashtirdingiz",  ru:"Вы разместили первое объявление"   }, condition:n=>n.listings>=1  },
  { id:"verified",       icon:"✅", color:"#1DA1F2", xp:100, name:{ uz:"Tasdiqlangan",      ru:"Верифицирован"         }, desc:{ uz:"MyID orqali tasdiqlandingiz",             ru:"Верифицированы через MyID"          }, condition:n=>n.verified     },
  { id:"fast_reply",     icon:"⚡", color:"#F59E0B", xp:75,  name:{ uz:"Tez javob",         ru:"Быстрый ответ"         }, desc:{ uz:"5 daqiqa ichida javob berdingiz",         ru:"Ответили в течение 5 минут"         }, condition:n=>n.avgReplyMin<=5},
  { id:"trusted_seller", icon:"🛡️", color:G,         xp:200, name:{ uz:"Ishonchli sotuvchi",ru:"Надёжный продавец"     }, desc:{ uz:"10+ muvaffaqiyatli bitim",               ru:"10+ успешных сделок"                }, condition:n=>n.deals>=10    },
  { id:"popular",        icon:"🔥", color:"#EF4444", xp:150, name:{ uz:"Mashhur",           ru:"Популярный"            }, desc:{ uz:"E'loningiz 100+ marta ko'rildi",         ru:"Ваше объявление просмотрено 100+ раз"}, condition:n=>n.totalViews>=100},
  { id:"top_seller",     icon:"🏆", color:"#F59E0B", xp:300, name:{ uz:"Top sotuvchi",      ru:"Топ продавец"          }, desc:{ uz:"Oyning eng yaxshi sotuvchisi",            ru:"Лучший продавец месяца"             }, condition:n=>n.monthDeals>=5 },
  { id:"five_star",      icon:"⭐", color:"#F59E0B", xp:100, name:{ uz:"5 yulduz",          ru:"5 звёзд"               }, desc:{ uz:"5 ta 5 yulduzli sharh oldingiz",         ru:"Получили 5 отзывов по 5 звёзд"      }, condition:n=>n.fiveStars>=5  },
  { id:"hundred_views",  icon:"👁️", color:"#8B5CF6", xp:50,  name:{ uz:"100 ko'rish",      ru:"100 просмотров"        }, desc:{ uz:"E'lonlaringiz 100 marta ko'rildi",       ru:"Ваши объявления просмотрены 100 раз" }, condition:n=>n.totalViews>=100},
  { id:"king_seller",    icon:"👑", color:"#EF4444", xp:500, name:{ uz:"Savdo Qiroli",      ru:"Король продаж"         }, desc:{ uz:"50+ muvaffaqiyatli bitim",               ru:"50+ успешных сделок"                }, condition:n=>n.deals>=50    },
  { id:"live_streamer",  icon:"🎥", color:"#EF4444", xp:150, name:{ uz:"Live Streamer",     ru:"Стример"               }, desc:{ uz:"Birinchi jonli efir o'tkazdingiz",       ru:"Провели первый прямой эфир"         }, condition:n=>n.streams>=1   },
  { id:"negotiator",     icon:"🤝", color:"#10B981", xp:75,  name:{ uz:"Muzokarachi",       ru:"Переговорщик"          }, desc:{ uz:"5+ narx muzokarasi yakunladingiz",       ru:"Завершили 5+ переговоров"           }, condition:n=>n.negotiations>=5},
  { id:"barter_king",    icon:"🔄", color:"#F59E0B", xp:100, name:{ uz:"Barter ustasi",     ru:"Мастер обмена"         }, desc:{ uz:"3+ tovar almashish qildingiz",           ru:"Совершили 3+ обмена"                }, condition:n=>n.barters>=3   },
];

export const XP_LEVELS = [
  { level:1,  xp:0,    title:{ uz:"Yangi foydalanuvchi", ru:"Новичок"        }, color:"#9CA3AF" },
  { level:2,  xp:100,  title:{ uz:"Faol sotuvchi",       ru:"Активный"       }, color:"#10B981" },
  { level:3,  xp:300,  title:{ uz:"Tajribali sotuvchi",  ru:"Опытный"        }, color:"#3B82F6" },
  { level:4,  xp:600,  title:{ uz:"Professional",        ru:"Профессионал"   }, color:"#8B5CF6" },
  { level:5,  xp:1000, title:{ uz:"Ekspert sotuvchi",    ru:"Эксперт"        }, color:"#F59E0B" },
  { level:6,  xp:2000, title:{ uz:"Savdo Ustasi",        ru:"Мастер продаж"  }, color:"#EF4444" },
  { level:7,  xp:5000, title:{ uz:"Savdo Qiroli",        ru:"Король продаж"  }, color:"#FFD700" },
];

// XP dan level hisoblash
export function calcLevel(xp) {
  let current = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (xp >= lvl.xp) current = lvl;
  }
  const idx = XP_LEVELS.indexOf(current);
  const next = XP_LEVELS[idx + 1];
  const progress = next
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100
    : 100;
  return { ...current, next, progress, xp };
}

// Foydalanuvchi badge'larini hisoblash
export function calcBadges(stats) {
  return BADGES.filter(b => b.condition(stats || {}));
}

// ── XP animatsiya ─────────────────────────────────────
export function XPToast({ xp, reason, onHide }) {
  useEffect(() => {
    const t = setTimeout(onHide, 2500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position:"fixed", top:64, left:"50%", transform:"translateX(-50%)",
      background:"linear-gradient(135deg,#F59E0B,#EAB308)",
      color:"#fff", padding:"10px 18px", borderRadius:14,
      fontSize:14, fontWeight:700, zIndex:9998,
      display:"flex", alignItems:"center", gap:8,
      boxShadow:"0 4px 20px rgba(245,158,11,0.4)",
      animation:"slideDown 0.3s ease",
    }}>
      <span style={{ fontSize:20 }}>⚡</span>
      <span>+{xp} XP — {reason}</span>
    </div>
  );
}

// ── Badge Card ────────────────────────────────────────
function BadgeCard({ badge, earned, lang, dark }) {
  const th = theme(dark);
  return (
    <div style={{
      background: earned ? badge.color+"15" : th.card2,
      borderRadius:14, padding:"14px 12px",
      border:`2px solid ${earned ? badge.color+"50" : th.border}`,
      opacity: earned ? 1 : 0.5,
      textAlign:"center",
      position:"relative",
    }}>
      {earned && (
        <div style={{ position:"absolute", top:6, right:6, width:16, height:16, borderRadius:8, background:badge.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"#fff", fontSize:9, fontWeight:800 }}>✓</span>
        </div>
      )}
      <div style={{ fontSize:28, marginBottom:6 }}>{badge.icon}</div>
      <div style={{ fontSize:11, fontWeight:700, color:earned ? badge.color : th.sub, lineHeight:1.3 }}>
        {badge.name[lang]}
      </div>
      <div style={{ fontSize:9, color:th.sub, marginTop:3 }}>+{badge.xp} XP</div>
    </div>
  );
}

// ── Level Progress Bar ────────────────────────────────
export function LevelBar({ lang, dark, xp, compact }) {
  const th = theme(dark);
  const lvlInfo = calcLevel(xp);

  if (compact) return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:28, height:28, borderRadius:9, background:lvlInfo.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:lvlInfo.color }}>
        {lvlInfo.level}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
          <span style={{ fontSize:10, fontWeight:700, color:lvlInfo.color }}>{lvlInfo.title[lang]}</span>
          <span style={{ fontSize:10, color:th.sub }}>{xp} XP</span>
        </div>
        <div style={{ height:4, background:th.card2, borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${lvlInfo.progress}%`, background:lvlInfo.color, borderRadius:2, transition:"width 0.5s" }} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background:`linear-gradient(135deg,${lvlInfo.color}20,${lvlInfo.color}08)`, borderRadius:16, padding:"16px", border:`1px solid ${lvlInfo.color}30` }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <div style={{ width:52, height:52, borderRadius:16, background:lvlInfo.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, color:"#fff", boxShadow:`0 4px 16px ${lvlInfo.color}50` }}>
          {lvlInfo.level}
        </div>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:lvlInfo.color }}>{lvlInfo.title[lang]}</div>
          <div style={{ fontSize:12, color:th.sub }}>
            {xp} XP {lvlInfo.next ? `· ${lang==="uz"?`${lvlInfo.next.xp - xp} XP kerak`:`Ещё ${lvlInfo.next.xp - xp} XP`}` : ""}
          </div>
        </div>
        {!lvlInfo.next && (
          <div style={{ marginLeft:"auto", background:lvlInfo.color+"20", borderRadius:10, padding:"4px 10px", fontSize:11, fontWeight:700, color:lvlInfo.color }}>
            MAX 👑
          </div>
        )}
      </div>
      <div style={{ height:8, background:th.card2, borderRadius:4, overflow:"hidden", marginBottom:6 }}>
        <div style={{ height:"100%", width:`${lvlInfo.progress}%`, background:`linear-gradient(to right,${lvlInfo.color},${lvlInfo.color}CC)`, borderRadius:4, transition:"width 0.7s" }} />
      </div>
      {lvlInfo.next && (
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:th.sub }}>
          <span>{lvlInfo.title[lang]}</span>
          <span>{lvlInfo.next.title[lang]}</span>
        </div>
      )}
    </div>
  );
}

// ── Gamification Page ─────────────────────────────────
export default function GamificationPage({ lang, dark, onBack, stats, xp }) {
  const th = theme(dark);
  const [activeTab, setActiveTab] = useState("badges");
  const userStats = stats || { listings:3, verified:true, avgReplyMin:4, deals:11, totalViews:150, monthDeals:3, fiveStars:2, streams:1, negotiations:6, barters:1 };
  const earnedBadges = calcBadges(userStats);
  const earnedIds = earnedBadges.map(b => b.id);
  const totalXP = xp || earnedBadges.reduce((s,b) => s+b.xp, 0);
  const lvlInfo = calcLevel(totalXP);

  const leaderboard = [
    { name:"Jasur T.",  xp:2840, level:5, badge:"🏆", verified:true },
    { name:"Sardor K.", xp:2200, level:5, badge:"⭐", verified:true },
    { name:"Malika R.", xp:1850, level:4, badge:"🔥", verified:false },
    { name:"Bobur A.",  xp:1600, level:4, badge:"🛡️", verified:true },
    { name:"Siz",       xp:totalXP, level:lvlInfo.level, badge:"👤", verified:userStats.verified, isMe:true },
  ].sort((a,b) => b.xp - a.xp);

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,#F59E0B,#D97706)`, padding:"50px 16px 20px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:14 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:4 }}>
          🏆 {lang==="uz" ? "Mening Reytingim" : "Мой Рейтинг"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13 }}>
          {lang==="uz" ? "Badge'lar, XP va liderlar taxtasi" : "Значки, XP и таблица лидеров"}
        </div>
        {/* Level compact */}
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"12px 14px", marginTop:14, backdropFilter:"blur(8px)" }}>
          <LevelBar lang={lang} dark={false} xp={totalXP} />
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display:"flex", gap:0, background:th.card, borderBottom:`1px solid ${th.border}` }}>
        {[
          [earnedBadges.length, lang==="uz"?"Badge":"Значков"],
          [totalXP, "XP"],
          [userStats.deals||0, lang==="uz"?"Bitim":"Сделок"],
          [lvlInfo.level, lang==="uz"?"Daraja":"Уровень"],
        ].map(([v,l],i,arr)=>(
          <div key={i} style={{ flex:1, padding:"12px 8px", textAlign:"center", borderRight:i<arr.length-1?`1px solid ${th.border}`:"none" }}>
            <div style={{ fontWeight:900, fontSize:18, color:"#F59E0B" }}>{v}</div>
            <div style={{ fontSize:10, color:th.sub, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:th.card, borderBottom:`1px solid ${th.border}` }}>
        {[["badges",lang==="uz"?"Badge'lar":"Значки"],["level",lang==="uz"?"Daraja":"Уровень"],["leaderboard",lang==="uz"?"Reyting":"Рейтинг"]].map(([v,l])=>(
          <button key={v} onClick={()=>setActiveTab(v)} style={{
            flex:1, padding:"12px 0", background:"none", border:"none", cursor:"pointer",
            fontSize:13, fontWeight:activeTab===v?700:500,
            color:activeTab===v?"#F59E0B":th.sub,
            borderBottom:activeTab===v?"2px solid #F59E0B":"2px solid transparent",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:16 }}>
        {/* BADGES TAB */}
        {activeTab === "badges" && (
          <>
            <div style={{ fontSize:13, color:th.sub, marginBottom:12, fontWeight:600 }}>
              {earnedBadges.length}/{BADGES.length} {lang==="uz"?"ta badge olindi":"значков получено"}
            </div>
            {/* Earned */}
            {earnedBadges.length > 0 && (
              <>
                <div style={{ fontSize:12, fontWeight:700, color:G, marginBottom:8 }}>
                  ✅ {lang==="uz"?"Olingan":"Получено"} ({earnedBadges.length})
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:20 }}>
                  {earnedBadges.map(b => <BadgeCard key={b.id} badge={b} earned lang={lang} dark={dark} />)}
                </div>
              </>
            )}
            {/* Not earned */}
            <div style={{ fontSize:12, fontWeight:700, color:th.sub, marginBottom:8 }}>
              🔒 {lang==="uz"?"Qulfda":"Заблокировано"} ({BADGES.length - earnedBadges.length})
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
              {BADGES.filter(b => !earnedIds.includes(b.id)).map(b =>
                <BadgeCard key={b.id} badge={b} earned={false} lang={lang} dark={dark} />
              )}
            </div>
          </>
        )}

        {/* LEVEL TAB */}
        {activeTab === "level" && (
          <>
            <LevelBar lang={lang} dark={dark} xp={totalXP} />
            <div style={{ marginTop:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:12 }}>
                {lang==="uz"?"Barcha darajalar":"Все уровни"}
              </div>
              {XP_LEVELS.map((lvl,i) => {
                const isCurrent = lvlInfo.level === lvl.level;
                const isPast = lvlInfo.level > lvl.level;
                return (
                  <div key={i} style={{
                    display:"flex", gap:12, padding:"12px 14px", marginBottom:8,
                    background: isCurrent ? lvl.color+"15" : th.card,
                    border:`2px solid ${isCurrent ? lvl.color : th.border}`,
                    borderRadius:14, alignItems:"center",
                  }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:lvl.color+(isPast||isCurrent?"":"20"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:800, color:isPast||isCurrent?"#fff":lvl.color }}>
                      {isPast ? "✓" : lvl.level}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, color:isCurrent ? lvl.color : th.text }}>
                        {lvl.title[lang]}
                        {isCurrent && <span style={{ fontSize:10, background:lvl.color, color:"#fff", padding:"1px 6px", borderRadius:6, marginLeft:6, fontWeight:700 }}>Siz</span>}
                      </div>
                      <div style={{ fontSize:11, color:th.sub }}>{lvl.xp}+ XP</div>
                    </div>
                    {isCurrent && (
                      <div style={{ fontSize:20 }}>{lvl.level === 7 ? "👑" : "⭐"}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <>
            <div style={{ fontSize:13, color:th.sub, marginBottom:14, fontWeight:600 }}>
              🏆 {lang==="uz"?"Oy reytingi — Toshkent":"Рейтинг месяца — Ташкент"}
            </div>
            {leaderboard.map((u, i) => (
              <div key={i} style={{
                display:"flex", gap:12, padding:"12px 14px", marginBottom:8,
                background: u.isMe ? G+"15" : th.card,
                border:`2px solid ${u.isMe ? G : th.border}`,
                borderRadius:14, alignItems:"center",
              }}>
                <div style={{
                  width:32, height:32, borderRadius:10, flexShrink:0,
                  background: i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":th.card2,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:16, fontWeight:900,
                  color: i<3?"#fff":th.sub,
                }}>
                  {i===0?"🥇":i===1?"🥈":i===2?"🥉":`#${i+1}`}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontWeight:700, color:u.isMe?G:th.text }}>{u.name}</span>
                    {u.verified && <span style={{ background:"#1DA1F220", color:"#1DA1F2", fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:5 }}>✓</span>}
                    {u.isMe && <span style={{ background:G+"20", color:G, fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:5 }}>Siz</span>}
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:3 }}>
                    <div style={{ height:4, width:80, background:th.card2, borderRadius:2, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${(u.xp/leaderboard[0].xp)*100}%`, background:"#F59E0B", borderRadius:2 }} />
                    </div>
                    <span style={{ fontSize:11, color:"#F59E0B", fontWeight:700 }}>{u.xp} XP</span>
                  </div>
                </div>
                <div style={{ fontSize:20 }}>{u.badge}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
