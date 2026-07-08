import { useState } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, timeAgo, DEMO_LISTINGS, CITIES_UZ, genId } from "../utils.js";

const G = "#16A34A";

const TASHKENT_DISTRICTS = {
  uz: ["Yunusobod","Chilonzor","Mirzo Ulug'bek","Shayxontohur","Yakkasaroy","Mirobod","Uchtepa","Sergeli","Olmazor","Bektemir","Yashnobod","Almazar","Zangiota"],
  ru: ["Юнусобад","Чиланзар","Мирзо Улугбек","Шайхантаур","Яккасарай","Мирабад","Учтепа","Сергели","Олмазор","Бектемир","Яшнабад","Алмазар","Зангиота"],
};

const DEMO_POSTS = [
  { id:"p1", type:"listing", author:{ name:"Jasur Toshmatov", district:"Yunusobod", verified:true }, text:{ uz:"Yunusobodda yaxshi holda iPhone 15 sotaman!", ru:"Продаю iPhone 15 в Юнусабаде в отличном состоянии!" }, likes:12, comments:3, time: new Date(Date.now()-3600000).toISOString(), emoji:"📱" },
  { id:"p2", type:"question", author:{ name:"Malika", district:"Chilonzor", verified:false }, text:{ uz:"Chilonzorda yaxshi santexnik bormi? 🔧", ru:"Есть хороший сантехник в Чиланзаре? 🔧" }, likes:5, comments:8, time: new Date(Date.now()-7200000).toISOString(), emoji:"🔧" },
  { id:"p3", type:"info", author:{ name:"Mahalla Kengashi", district:"Mirzo Ulug'bek", verified:true }, text:{ uz:"5-mavze ko'chasida ta'mirlash ishlari boshlanmoqda, ehtiyot bo'ling! 🚧", ru:"На улице 5-квартала начинается ремонт, будьте осторожны! 🚧" }, likes:34, comments:15, time: new Date(Date.now()-10800000).toISOString(), emoji:"🚧" },
  { id:"p4", type:"listing", author:{ name:"Sardor", district:"Sergeli", verified:false }, text:{ uz:"Sergelida yangi 3 xonali kvartira ijaraga beriladi 🏠", ru:"Сдаётся новая 3-комнатная квартира в Сергели 🏠" }, likes:8, comments:2, time: new Date(Date.now()-14400000).toISOString(), emoji:"🏠" },
  { id:"p5", type:"alert", author:{ name:"Xavfsizlik xizmati", district:"Toshkent", verified:true }, text:{ uz:"⚠️ Ehtiyot bo'ling! Soxta sotuvchilar faollashmoqda. Faqat MyID tasdiqlangan sotuvchilar bilan ishlang.", ru:"⚠️ Осторожно! Активизировались мошенники. Работайте только с верифицированными продавцами." }, likes:89, comments:22, time: new Date(Date.now()-86400000).toISOString(), emoji:"⚠️" },
];

function PostCard({ post, lang, dark, onLike }) {
  const th = theme(dark);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const typeColors = { listing:G, question:"#3B82F6", info:"#F59E0B", alert:"#EF4444" };
  const typeLabels = {
    listing:  { uz:"E'lon",    ru:"Объявление" },
    question: { uz:"Savol",    ru:"Вопрос" },
    info:     { uz:"Yangilik", ru:"Новость" },
    alert:    { uz:"Ogohlantirish", ru:"Предупреждение" },
  };
  const color = typeColors[post.type] || G;
  return (
    <div style={{ background:th.card, borderRadius:16, padding:"14px 16px", marginBottom:10, border:`1px solid ${th.border}` }}>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
        <div style={{ width:40, height:40, borderRadius:12, background:color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
          {post.emoji}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
            <span style={{ fontWeight:700, fontSize:14, color:th.text }}>{post.author.name}</span>
            {post.author.verified && (
              <span style={{ background:"#1DA1F220", color:"#1DA1F2", fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:6 }}>✓</span>
            )}
            <span style={{ background:color+"15", color:color, fontSize:10, fontWeight:700, padding:"1px 7px", borderRadius:6 }}>
              {typeLabels[post.type]?.[lang]}
            </span>
          </div>
          <div style={{ fontSize:11, color:th.sub, marginTop:2 }}>
            📍 {post.author.district} · {timeAgo(post.time, lang)}
          </div>
        </div>
      </div>
      <p style={{ fontSize:14, color:th.text, lineHeight:1.6, margin:"0 0 12px" }}>
        {post.text[lang]}
      </p>
      <div style={{ display:"flex", gap:14, alignItems:"center" }}>
        <button onClick={() => { setLiked(!liked); setLikeCount(p => liked ? p-1 : p+1); onLike?.(post.id); }} style={{
          background:"none", border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", gap:5, color:liked?"#EF4444":th.sub,
        }}>
          <span style={{ fontSize:16 }}>{liked ? "❤️" : "🤍"}</span>
          <span style={{ fontSize:12, fontWeight:600 }}>{likeCount}</span>
        </button>
        <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, color:th.sub }}>
          <span style={{ fontSize:16 }}>💬</span>
          <span style={{ fontSize:12, fontWeight:600 }}>{post.comments}</span>
        </button>
        <button style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, color:th.sub, marginLeft:"auto" }}>
          <span style={{ fontSize:14 }}>🔗</span>
          <span style={{ fontSize:12 }}>{lang==="uz"?"Ulash":"Поделиться"}</span>
        </button>
      </div>
    </div>
  );
}

export default function MahallaFeed({ lang, dark, onBack, currentUser }) {
  const th = theme(dark);
  const [district, setDistrict] = useState(lang==="uz" ? "Yunusobod" : "Юнусобад");
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [showPost, setShowPost] = useState(false);
  const [newText, setNewText] = useState("");
  const [postType, setPostType] = useState("listing");
  const [activeTab, setActiveTab] = useState("feed");

  const filteredPosts = posts.filter(p =>
    p.author.district === district ||
    p.author.district === "Toshkent" ||
    p.author.district === "Ташкент"
  );

  const localListings = DEMO_LISTINGS.filter(l =>
    l.city === "Toshkent" || l.city === "Ташкент"
  ).slice(0, 6);

  const handlePost = () => {
    if (!newText.trim()) return;
    const newPost = {
      id: genId(),
      type: postType,
      author: { name: currentUser?.name || "Men", district, verified: currentUser?.verified || false },
      text: { uz: newText, ru: newText },
      likes: 0, comments: 0,
      time: new Date().toISOString(),
      emoji: { listing:"📦", question:"❓", info:"ℹ️", alert:"⚠️" }[postType],
    };
    setPosts(p => [newPost, ...p]);
    setNewText("");
    setShowPost(false);
  };

  return (
    <div style={{ background:th.bg, minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${G},#15803D)`, padding:"50px 16px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer" }}>←</button>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:18 }}>🏘️ Mahalla</div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>
              {lang==="uz" ? "Mahalliy jamiyat xabarlari" : "Местные новости района"}
            </div>
          </div>
        </div>
        {/* District selector */}
        <div style={{ display:"flex", gap:6, overflowX:"auto", scrollbarWidth:"none" }}>
          {(lang==="uz" ? TASHKENT_DISTRICTS.uz : TASHKENT_DISTRICTS.ru).map(d => (
            <button key={d} onClick={() => setDistrict(d)} style={{
              flexShrink:0, padding:"6px 12px", borderRadius:16, border:"none", cursor:"pointer", fontSize:11, fontWeight:600,
              background: district===d ? "#fff" : "rgba(255,255,255,0.15)",
              color: district===d ? G : "rgba(255,255,255,0.85)",
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", background:th.card, borderBottom:`1px solid ${th.border}` }}>
        {[["feed",lang==="uz"?"Lenta":"Лента"],["listings",lang==="uz"?"E'lonlar":"Объявления"],["neighbors",lang==="uz"?"Qo'shnilar":"Соседи"]].map(([v,l])=>(
          <button key={v} onClick={() => setActiveTab(v)} style={{
            flex:1, padding:"12px 0", background:"none", border:"none", cursor:"pointer",
            fontSize:13, fontWeight:activeTab===v?700:500,
            color:activeTab===v?G:th.sub,
            borderBottom:activeTab===v?`2px solid ${G}`:"2px solid transparent",
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:"12px 16px 0" }}>
        {/* Post qo'shish */}
        {currentUser && activeTab === "feed" && (
          <div style={{ background:th.card, borderRadius:14, padding:"12px 14px", marginBottom:14, border:`1px solid ${th.border}` }}>
            {!showPost ? (
              <div onClick={() => setShowPost(true)} style={{ display:"flex", gap:10, alignItems:"center", cursor:"pointer" }}>
                <div style={{ width:36, height:36, borderRadius:10, background:G+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                  {currentUser.name?.[0] || "👤"}
                </div>
                <div style={{ flex:1, padding:"9px 14px", background:th.card2, borderRadius:10, fontSize:13, color:th.sub }}>
                  {lang==="uz" ? "Mahallada nima bo'lmoqda?" : "Что происходит в районе?"}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                  {[["listing","📦",lang==="uz"?"E'lon":"Объявление"],["question","❓",lang==="uz"?"Savol":"Вопрос"],["info","ℹ️",lang==="uz"?"Yangilik":"Новость"]].map(([v,ic,l])=>(
                    <button key={v} onClick={() => setPostType(v)} style={{
                      flex:1, padding:"7px 4px", borderRadius:10, border:`1.5px solid ${postType===v?G:th.border}`,
                      background:postType===v?G+"15":th.card2, color:postType===v?G:th.sub,
                      fontSize:11, fontWeight:700, cursor:"pointer",
                    }}>{ic} {l}</button>
                  ))}
                </div>
                <textarea value={newText} onChange={e => setNewText(e.target.value)} rows={3}
                  placeholder={lang==="uz" ? "Xabaringizni yozing..." : "Напишите сообщение..."}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${th.border2}`, background:th.card2, fontSize:13, outline:"none", resize:"none", color:th.text, fontFamily:"inherit", boxSizing:"border-box", marginBottom:8 }} />
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={() => setShowPost(false)} style={{ flex:1, padding:"9px", borderRadius:10, background:th.card2, border:`1px solid ${th.border}`, color:th.sub, cursor:"pointer", fontSize:12 }}>
                    {lang==="uz"?"Bekor":"Отмена"}
                  </button>
                  <button onClick={handlePost} disabled={!newText.trim()} style={{ flex:2, padding:"9px", borderRadius:10, background:newText.trim()?G:th.border2, color:newText.trim()?"#fff":th.sub, border:"none", cursor:newText.trim()?"pointer":"default", fontWeight:700, fontSize:12 }}>
                    {lang==="uz"?"Joylash ✓":"Опубликовать ✓"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feed */}
        {activeTab === "feed" && (
          filteredPosts.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:th.sub }}>
              <div style={{ fontSize:48, marginBottom:10 }}>🏘️</div>
              <div style={{ fontWeight:700, color:th.text, marginBottom:6 }}>
                {lang==="uz" ? "Hozircha post yo'q" : "Пока нет постов"}
              </div>
              <div style={{ fontSize:13 }}>
                {lang==="uz" ? "Birinchi bo'ling!" : "Будьте первым!"}
              </div>
            </div>
          ) : filteredPosts.map(post => (
            <PostCard key={post.id} post={post} lang={lang} dark={dark} />
          ))
        )}

        {/* Local listings */}
        {activeTab === "listings" && (
          <div>
            <div style={{ fontSize:13, color:th.sub, marginBottom:12, fontWeight:600 }}>
              {district} {lang==="uz"?"dagi e'lonlar":"объявления"}
            </div>
            {localListings.map(l => {
              const cat = CATEGORIES.find(c => c.id === l.category);
              return (
                <div key={l.id} style={{ background:th.card, borderRadius:14, marginBottom:10, display:"flex", overflow:"hidden", border:`1px solid ${th.border}` }}>
                  <div style={{ width:80, height:80, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>
                    {l.photos?.[0] ? <img src={l.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : cat?.emoji}
                  </div>
                  <div style={{ flex:1, padding:"10px 12px" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:th.text, marginBottom:3 }}>{l.title}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:G }}>
                      {l.price===0?"Bepul":l.price===-1?"Kelishiladi":`${formatPrice(l.price)} so'm`}
                    </div>
                    <div style={{ fontSize:11, color:th.sub, marginTop:2 }}>
                      {l.seller?.verified && <span style={{ background:"#1DA1F220", color:"#1DA1F2", fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:5, marginRight:4 }}>✓</span>}
                      {l.seller?.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Neighbors */}
        {activeTab === "neighbors" && (
          <div>
            <div style={{ fontSize:13, color:th.sub, marginBottom:12, fontWeight:600 }}>
              {district} {lang==="uz"?"dagi foydalanuvchilar":"пользователи"}
            </div>
            {[
              { name:"Jasur T.", rating:4.8, deals:12, verified:true, badge:"🏆" },
              { name:"Malika R.", rating:4.5, deals:7, verified:true, badge:"⭐" },
              { name:"Sardor K.", rating:4.2, deals:4, verified:false, badge:"🛒" },
              { name:"Nodira X.", rating:5.0, deals:23, verified:true, badge:"👑" },
            ].map((u,i)=>(
              <div key={i} style={{ background:th.card, borderRadius:14, padding:"12px 14px", marginBottom:8, border:`1px solid ${th.border}`, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:G+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{u.badge}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontWeight:700, color:th.text }}>{u.name}</span>
                    {u.verified && <span style={{ background:"#1DA1F220", color:"#1DA1F2", fontSize:10, fontWeight:700, padding:"1px 5px", borderRadius:5 }}>✓</span>}
                  </div>
                  <div style={{ fontSize:11, color:th.sub }}>
                    ⭐ {u.rating} · {u.deals} {lang==="uz"?"bitim":"сделок"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
