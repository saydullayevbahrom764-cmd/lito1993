import { useState } from "react";
import { theme } from "../theme.js";
import { T } from "../translations.js";
import { formatPrice } from "../utils.js";

const G = "#16A34A";

function MiniBarChart({ data, color, dark }) {
  const th = theme(dark);
  const max = Math.max(...data, 1);
  return (
    <div style={{ display:"flex", gap:4, alignItems:"flex-end", height:50 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
          <div style={{ width:"100%", borderRadius:"3px 3px 0 0", background:`linear-gradient(180deg,${color},${color}99)`, height:`${Math.round((v/max)*44)+4}px`, minHeight:4, transition:"height 0.4s" }} />
        </div>
      ))}
    </div>
  );
}

function MiniLineChart({ data, color, dark }) {
  const max = Math.max(...data, 1);
  const w = 280, h = 50;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 6) - 3;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow:"visible" }}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill="url(#lg)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (v / max) * (h - 6) - 3;
        return <circle key={i} cx={x} cy={y} r={i===data.length-1?4:2.5} fill={color} />;
      })}
    </svg>
  );
}

export function SellerDashboard({ lang, dark, myListings, offers, onBack }) {
  const th = theme(dark);
  const tx = T[lang];
  const [period, setPeriod] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");

  const weekLabels = lang==="uz"
    ? ["Du","Se","Ch","Pa","Ju","Sh","Ya"]
    : ["Пн","Вт","Ср","Чт","Пт","Сб","Вс"];
  const monthLabels = lang==="uz"
    ? ["1","5","10","15","20","25","30"]
    : ["1","5","10","15","20","25","30"];

  const viewsData  = period==="week" ? [12,28,45,31,67,89,54] : [120,145,98,200,167,220,189,145,210,167,188,198,156,230];
  const callsData  = period==="week" ? [2,5,8,4,12,15,9]      : [20,25,18,35,28,40,32,25,38,30,35,42,28,44];
  const chatsData  = period==="week" ? [1,3,5,3,8,10,6]       : [10,15,8,20,16,25,18,14,22,17,20,28,15,30];
  const revenueData= period==="week" ? [0,50000,0,100000,200000,150000,80000] : [];

  const totalViews   = viewsData.reduce((a,b)=>a+b,0);
  const totalCalls   = callsData.reduce((a,b)=>a+b,0);
  const totalChats   = chatsData.reduce((a,b)=>a+b,0);
  const totalRevenue = 2450000;
  const convRate     = totalViews > 0 ? ((totalCalls/totalViews)*100).toFixed(1) : 0;

  const topListings = [...(myListings||[])].sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,5).map(l=>({
    ...l, views:l.views||Math.floor(Math.random()*200+20),
    calls:Math.floor(Math.random()*15+2),
    chats:Math.floor(Math.random()*10+1),
  }));

  const statCards = [
    { icon:"👁️", label:lang==="uz"?"Ko'rishlar":"Просмотры", value:totalViews, color:"#3B82F6", data:viewsData },
    { icon:"📞", label:lang==="uz"?"Qo'ng'iroqlar":"Звонки",  value:totalCalls, color:"#10B981", data:callsData },
    { icon:"💬", label:"Chat", value:totalChats, color:"#8B5CF6", data:chatsData },
    { icon:"💰", label:lang==="uz"?"Daromad":"Доход", value:formatPrice(totalRevenue)+" so'm", color:G, data:[] },
  ];

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${G},#15803D)`, padding:"50px 16px 20px" }}>
        <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer", marginBottom:14 }}>←</button>
        <div style={{ color:"#fff", fontWeight:800, fontSize:20, marginBottom:4 }}>
          📊 {lang==="uz" ? "Sotuvchi Dashboard" : "Панель продавца"}
        </div>
        <div style={{ color:"rgba(255,255,255,0.7)", fontSize:13 }}>
          {lang==="uz" ? "E'lonlaringiz statistikasi" : "Статистика ваших объявлений"}
        </div>

        {/* Period toggle */}
        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.15)", borderRadius:10, padding:3, marginTop:14, width:"fit-content" }}>
          {[["week", lang==="uz"?"Hafta":"Неделя"],["month",lang==="uz"?"Oy":"Месяц"]].map(([v,l])=>(
            <button key={v} onClick={()=>setPeriod(v)} style={{
              padding:"6px 16px", borderRadius:8, border:"none", cursor:"pointer",
              background:period===v?"#fff":"transparent",
              color:period===v?G:"rgba(255,255,255,0.8)",
              fontWeight:700, fontSize:12,
            }}>{l}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:th.card, borderBottom:`1px solid ${th.border}` }}>
        {[["overview",lang==="uz"?"Umumiy":"Обзор"],["listings",lang==="uz"?"E'lonlar":"Объявления"],["offers",lang==="uz"?"Takliflar":"Предложения"]].map(([v,l])=>(
          <button key={v} onClick={()=>setActiveTab(v)} style={{
            flex:1, padding:"13px 0", background:"none", border:"none", cursor:"pointer",
            fontSize:13, fontWeight:activeTab===v?700:500,
            color:activeTab===v?G:th.sub,
            borderBottom:activeTab===v?`2px solid ${G}`:"2px solid transparent",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:16 }}>
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Stat cards 2x2 */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {statCards.map((s,i)=>(
                <div key={i} style={{ background:th.card, borderRadius:14, padding:"14px 16px", border:`1px solid ${th.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <div style={{ fontSize:11, color:th.sub, marginBottom:4 }}>{s.label}</div>
                      <div style={{ fontSize:18, fontWeight:900, color:s.color }}>
                        {typeof s.value === "number" ? s.value.toLocaleString("ru-RU") : s.value}
                      </div>
                    </div>
                    <div style={{ width:36, height:36, borderRadius:10, background:s.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{s.icon}</div>
                  </div>
                  {s.data.length > 0 && <MiniBarChart data={s.data.slice(-7)} color={s.color} dark={dark} />}
                </div>
              ))}
            </div>

            {/* Ko'rishlar grafigi */}
            <div style={{ background:th.card, borderRadius:16, padding:"16px", border:`1px solid ${th.border}`, marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <div style={{ fontSize:14, fontWeight:700, color:th.text }}>📈 {lang==="uz"?"Ko'rishlar":"Просмотры"}</div>
                <div style={{ fontSize:12, color:G, fontWeight:700 }}>+{Math.floor(Math.random()*30+10)}%</div>
              </div>
              <MiniLineChart data={viewsData} color={G} dark={dark} />
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                {(period==="week" ? weekLabels : monthLabels.filter((_,i)=>i%2===0)).map((l,i)=>(
                  <span key={i} style={{ fontSize:9, color:th.sub }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Conversion rate */}
            <div style={{ background:th.card, borderRadius:14, padding:"14px 16px", border:`1px solid ${th.border}`, marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:700, color:th.text, marginBottom:10 }}>
                🎯 {lang==="uz"?"Konversiya ko'rsatkichi":"Показатель конверсии"}
              </div>
              <div style={{ display:"flex", gap:16 }}>
                <div style={{ flex:1, textAlign:"center" }}>
                  <div style={{ fontSize:28, fontWeight:900, color:G }}>{convRate}%</div>
                  <div style={{ fontSize:11, color:th.sub }}>
                    {lang==="uz"?"Ko'rish→Qo'ng'iroq":"Просмотр→Звонок"}
                  </div>
                </div>
                <div style={{ width:1, background:th.border }} />
                <div style={{ flex:1 }}>
                  {[
                    { label:lang==="uz"?"Ko'rish":"Просмотры", val:totalViews, color:"#3B82F6" },
                    { label:lang==="uz"?"Qo'ng'iroq":"Звонки", val:totalCalls, color:"#10B981" },
                    { label:"Chat", val:totalChats, color:"#8B5CF6" },
                  ].map((r,i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ width:8, height:8, borderRadius:4, background:r.color }} />
                        <span style={{ fontSize:11, color:th.sub }}>{r.label}</span>
                      </div>
                      <span style={{ fontSize:12, fontWeight:700, color:r.color }}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* LISTINGS TAB */}
        {activeTab === "listings" && (
          <>
            <div style={{ fontSize:13, color:th.sub, marginBottom:12, fontWeight:600 }}>
              {lang==="uz" ? "Eng ko'p ko'rilgan e'lonlar" : "Самые просматриваемые объявления"}
            </div>
            {topListings.length === 0 ? (
              <div style={{ textAlign:"center", padding:"40px 0", color:th.sub }}>
                <div style={{ fontSize:48, marginBottom:10 }}>📋</div>
                <div>{lang==="uz"?"E'lonlar yo'q":"Нет объявлений"}</div>
              </div>
            ) : topListings.map((l, i) => (
              <div key={l.id} style={{ background:th.card, borderRadius:14, padding:"12px 14px", marginBottom:10, border:`1px solid ${th.border}` }}>
                <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:G+"20", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:G, fontSize:13 }}>#{i+1}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.title}</div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6 }}>
                  {[
                    { icon:"👁️", val:l.views, label:lang==="uz"?"Ko'rish":"Просмотры", color:"#3B82F6" },
                    { icon:"📞", val:l.calls, label:lang==="uz"?"Qo'ng'iroq":"Звонки", color:"#10B981" },
                    { icon:"💬", val:l.chats, label:"Chat", color:"#8B5CF6" },
                  ].map((s,j)=>(
                    <div key={j} style={{ background:s.color+"10", borderRadius:10, padding:"8px", textAlign:"center", border:`1px solid ${s.color}20` }}>
                      <div style={{ fontSize:15 }}>{s.icon}</div>
                      <div style={{ fontWeight:800, color:s.color, fontSize:15 }}>{s.val}</div>
                      <div style={{ fontSize:9, color:th.sub }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Mini views bar */}
                <div style={{ marginTop:10, height:4, background:th.card2, borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${Math.min(100,(l.views/(topListings[0]?.views||1))*100)}%`, background:G, borderRadius:2, transition:"width 0.5s" }} />
                </div>
              </div>
            ))}
          </>
        )}

        {/* OFFERS TAB */}
        {activeTab === "offers" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[
                { label:lang==="uz"?"Jami takliflar":"Всего предложений", val:offers?.length||0, color:"#3B82F6", icon:"🤝" },
                { label:lang==="uz"?"Qabul qilingan":"Принято", val:offers?.filter(o=>o.status==="accepted").length||0, color:G, icon:"✅" },
                { label:lang==="uz"?"Rad etilgan":"Отклонено", val:offers?.filter(o=>o.status==="rejected").length||0, color:"#EF4444", icon:"❌" },
                { label:lang==="uz"?"Kutilmoqda":"Ожидание", val:offers?.filter(o=>o.status==="pending").length||0, color:"#F59E0B", icon:"⏳" },
              ].map((s,i)=>(
                <div key={i} style={{ background:th.card, borderRadius:14, padding:"14px 12px", border:`1px solid ${th.border}`, textAlign:"center" }}>
                  <div style={{ fontSize:24, marginBottom:4 }}>{s.icon}</div>
                  <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
                  <div style={{ fontSize:11, color:th.sub, marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {!offers?.length && (
              <div style={{ textAlign:"center", padding:"40px 0", color:th.sub }}>
                <div style={{ fontSize:48, marginBottom:10 }}>🤝</div>
                <div>{lang==="uz"?"Takliflar yo'q":"Предложений нет"}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
