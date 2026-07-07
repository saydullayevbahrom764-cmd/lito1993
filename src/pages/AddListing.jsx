import { useState, useRef, useEffect } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { CONDITIONS, CITIES_UZ, CITIES_RU, genId } from "../utils.js";
import { Btn, Input, Select, Chip, PhotoUploader, Toggle } from "../components/UI.jsx";

const G = "#16A34A";
const GD = "#15803D";
const STEPS = ["category","info","price","location","photos","review"];

function StepBar({ step, total, dark }) {
  const th = theme(dark);
  return (
    <div style={{ display:"flex", gap:4, marginBottom:20 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          flex:1, height:3, borderRadius:2,
          background: i < step ? G : i === step ? "#22C55E" : th.border2,
          transition:"background 0.3s",
        }} />
      ))}
    </div>
  );
}

// ── Yandex mini map picker ────────────────────────────
function YandexMapPicker({ lang, lat, lng, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const placmarkRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      if (!window.ymaps || mapRef.current || !containerRef.current) return;
      window.ymaps.ready(() => {
        const center = lat && lng ? [lat, lng] : [41.299, 69.240];
        const map = new window.ymaps.Map(containerRef.current, {
          center, zoom: 13,
          controls: ["geolocationControl", "zoomControl"],
        });

        const updatePlacemark = (coords) => {
          onChange({ lat: coords[0], lng: coords[1] });
          if (placmarkRef.current) {
            placmarkRef.current.geometry.setCoordinates(coords);
          } else {
            placmarkRef.current = new window.ymaps.Placemark(coords, {}, {
              preset: "islands#greenDotIcon",
              draggable: true,
            });
            placmarkRef.current.events.add("dragend", () => {
              const c = placmarkRef.current.geometry.getCoordinates();
              onChange({ lat: c[0], lng: c[1] });
            });
            map.geoObjects.add(placmarkRef.current);
          }
        };

        if (lat && lng) updatePlacemark([lat, lng]);

        map.events.add("click", (e) => {
          updatePlacemark(e.get("coords"));
        });
        mapRef.current = map;
      });
    };

    if (window.ymaps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://api-maps.yandex.ru/2.1/?apikey=your-api-key&lang=ru_RU";
      script.onload = initMap;
      document.head.appendChild(script);
    }
    return () => { mapRef.current = null; placmarkRef.current = null; };
  }, []);

  return (
    <div>
      <div ref={containerRef} style={{
        height:220, borderRadius:14,
        border:"1.5px solid #E8E8E8", overflow:"hidden",
      }} />
      {lat && lng && (
        <div style={{ marginTop:8, fontSize:12, color:G, fontWeight:600 }}>
          ✓ {lang==="uz"?"Joylashuv belgilandi":"Местоположение указано"}
          {" "}({lat.toFixed(4)}, {lng.toFixed(4)})
        </div>
      )}
    </div>
  );
}


export default function AddListing({ lang, dark, onDone, onCancel, currentUser }) {
  const th = theme(dark);
  const tx = T[lang];
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    category:"", title:"", description:"", price:"",
    priceType:"fixed", condition:"", city:"", district:"",
    photos:[], lat:null, lng:null,
    brand:"", model:"", year:"", mileage:"", fuel:"", transmission:"", color:"",
    roomCount:"", area:"", floor:"", totalFloors:"", furnished:false, dealType:"forSale",
    company:"", jobType:"fullTime", experience:"", salary:"",
  });
  const [loading, setLoading] = useState(false);
  const u = (patch) => setData(p => ({ ...p, ...patch }));

  const canNext = () => {
    if (step === 0) return !!data.category;
    if (step === 1) return data.title.trim().length >= 3 && data.description.trim().length >= 5;
    if (step === 2) return data.priceType === "free" || data.priceType === "negotiable" || !!data.price;
    if (step === 3) return !!data.city;
    return true;
  };

  const handlePublish = () => {
    setLoading(true);
    setTimeout(() => {
      const listing = {
        id: genId(), ...data,
        price: data.priceType==="free" ? 0 : data.priceType==="negotiable" ? -1 : Number(data.price),
        seller: {
          id: currentUser?.uid || "demo",
          name: currentUser?.name || (lang==="uz"?"Foydalanuvchi":"Пользователь"),
          phone: currentUser?.phone || "+998901234567",
          verified: false, rating: 0, reviewCount: 0,
        },
        views:0, favorites:0, active:true,
        createdAt: new Date().toISOString(),
        lat: data.lat || 41.299, lng: data.lng || 69.240,
      };
      setLoading(false);
      onDone(listing);
    }, 1000);
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, background:th.bg, maxWidth:430, margin:"0 auto", overflowY:"auto", paddingBottom:100 }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${G},${GD})`, padding:"50px 16px 16px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
          <button onClick={() => step===0 ? onCancel() : setStep(s=>s-1)} style={{
            background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10,
            width:36, height:36, color:"#fff", fontSize:18, cursor:"pointer",
          }}>←</button>
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:16 }}>{tx.newAd}</div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11 }}>
              {lang==="uz" ? `${step+1} / ${STEPS.length} bosqich` : `Шаг ${step+1} из ${STEPS.length}`}
            </div>
          </div>
        </div>
        <StepBar step={step} total={STEPS.length} dark={dark} />
      </div>

      <div style={{ padding:"20px 16px" }}>
        {/* STEP 0 — Category */}
        {step === 0 && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:th.text, marginBottom:6 }}>
              {lang==="uz"?"Kategoriya tanlang":"Выберите категорию"}
            </h2>
            <p style={{ color:th.sub, fontSize:13, marginBottom:20 }}>
              {lang==="uz"?"E'loningiz qaysi toifaga tegishli?":"К какой категории относится объявление?"}
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => u({ category:c.id })} style={{
                  background: data.category===c.id ? c.color+"20" : th.card,
                  border: `2px solid ${data.category===c.id ? c.color : th.border}`,
                  borderRadius:14, padding:"16px 12px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:10, textAlign:"left",
                }}>
                  <div style={{ width:40, height:40, borderRadius:12, background:c.color+"20", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.emoji}</div>
                  <span style={{ fontSize:13, fontWeight:700, color:th.text }}>{tx[c.id]||c.id}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — Info */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:th.text, marginBottom:20 }}>
              {lang==="uz"?"E'lon ma'lumotlari":"Информация об объявлении"}
            </h2>
            <Input dark={dark} label={tx.adTitle} required value={data.title}
              onChange={e => u({ title:e.target.value })} placeholder={tx.adTitlePh} />
            <Input dark={dark} label={tx.description} required value={data.description}
              onChange={e => u({ description:e.target.value })} placeholder={tx.descPh} multiline rows={4} />

            {!["jobs","realEstate","services"].includes(data.category) && (
              <div style={{ marginBottom:16 }}>
                <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:8 }}>{tx.condition}</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {CONDITIONS[lang].map(c => (
                    <Chip key={c} label={c} active={data.condition===c}
                      onClick={() => u({ condition:c })} dark={dark} color={G} />
                  ))}
                </div>
              </div>
            )}

            {data.category === "vehicles" && (
              <div>
                <div style={{ height:1, background:th.border, margin:"16px 0" }} />
                <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:12 }}>🚗 {lang==="uz"?"Avtomobil ma'lumotlari":"Данные автомобиля"}</h3>
                <Input dark={dark} label={tx.brand} value={data.brand} onChange={e=>u({brand:e.target.value})} placeholder="Chevrolet" />
                <Input dark={dark} label={tx.model} value={data.model} onChange={e=>u({model:e.target.value})} placeholder="Malibu" />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Input dark={dark} label={tx.year} value={data.year} onChange={e=>u({year:e.target.value})} type="number" placeholder="2022" />
                  <Input dark={dark} label={tx.mileage} value={data.mileage} onChange={e=>u({mileage:e.target.value})} type="number" placeholder="45000" />
                </div>
                <Select dark={dark} label={tx.fuel} value={data.fuel} onChange={v=>u({fuel:v})}
                  placeholder={lang==="uz"?"Tanlang":"Выберите"}
                  options={lang==="uz"?["Benzin","Dizel","Gaz","Elektr","Gibrid"]:["Бензин","Дизель","Газ","Электро","Гибрид"]} />
                <Select dark={dark} label={tx.transmission} value={data.transmission} onChange={v=>u({transmission:v})}
                  placeholder={lang==="uz"?"Tanlang":"Выберите"}
                  options={lang==="uz"?["Avtomat","Mexanik","Variator"]:["Автомат","Механика","Вариатор"]} />
              </div>
            )}

            {data.category === "realEstate" && (
              <div>
                <div style={{ height:1, background:th.border, margin:"16px 0" }} />
                <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:12 }}>🏠 {lang==="uz"?"Ko'chmas mulk":"Недвижимость"}</h3>
                <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                  {[["forSale",tx.forSale],["forRent",tx.forRent]].map(([v,l]) => (
                    <button key={v} onClick={()=>u({dealType:v})} style={{
                      flex:1, padding:"12px", borderRadius:12,
                      border:`2px solid ${data.dealType===v?G:th.border}`,
                      background:data.dealType===v?G+"20":th.card,
                      color:data.dealType===v?G:th.text, fontWeight:700, fontSize:13, cursor:"pointer",
                    }}>{l}</button>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <Input dark={dark} label={tx.roomCount} value={data.roomCount} onChange={e=>u({roomCount:e.target.value})} type="number" placeholder="3" />
                  <Input dark={dark} label={`${tx.area} (m²)`} value={data.area} onChange={e=>u({area:e.target.value})} type="number" placeholder="82" />
                  <Input dark={dark} label={tx.floor} value={data.floor} onChange={e=>u({floor:e.target.value})} type="number" placeholder="5" />
                  <Input dark={dark} label={tx.totalFloors} value={data.totalFloors} onChange={e=>u({totalFloors:e.target.value})} type="number" placeholder="16" />
                </div>
                <Toggle dark={dark} value={data.furnished} onChange={v=>u({furnished:v})} label={tx.furnished} />
              </div>
            )}

            {data.category === "jobs" && (
              <div>
                <div style={{ height:1, background:th.border, margin:"16px 0" }} />
                <h3 style={{ fontSize:14, fontWeight:700, color:th.text, marginBottom:12 }}>💼 {lang==="uz"?"Ish o'rni":"Вакансия"}</h3>
                <Input dark={dark} label={tx.company} value={data.company} onChange={e=>u({company:e.target.value})} placeholder="Company Name" />
                <Input dark={dark} label={tx.experience} value={data.experience} onChange={e=>u({experience:e.target.value})} placeholder={lang==="uz"?"1-3 yil":"1-3 года"} />
                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:8 }}>{tx.jobType}</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {[["fullTime",tx.fullTime],["partTime",tx.partTime],["remote",tx.remote],["internship",tx.internship]].map(([v,l])=>(
                      <Chip key={v} label={l} active={data.jobType===v} onClick={()=>u({jobType:v})} dark={dark} color={G} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2 — Price */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:th.text, marginBottom:20 }}>
              {data.category==="jobs" ? tx.salary : tx.price}
            </h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
              {[["fixed",lang==="uz"?"Narx":"Цена","💰"],["free",tx.free,"🎁"],["negotiable",tx.negotiable,"🤝"]].map(([v,l,ic])=>(
                <button key={v} onClick={()=>u({priceType:v})} style={{
                  background:data.priceType===v?G+"20":th.card,
                  border:`2px solid ${data.priceType===v?G:th.border}`,
                  borderRadius:12, padding:"14px 8px", cursor:"pointer",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                }}>
                  <span style={{ fontSize:22 }}>{ic}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:data.priceType===v?G:th.text }}>{l}</span>
                </button>
              ))}
            </div>
            {data.priceType === "fixed" && (
              <Input dark={dark}
                label={data.category==="realEstate"?`${tx.price} (USD)`:`${tx.price} (${tx.sum})`}
                required value={data.price}
                onChange={e=>u({price:e.target.value})} type="number"
                placeholder={data.category==="realEstate"?"50000":"1 000 000"} />
            )}
            {data.priceType==="free" && (
              <div style={{ background:"#16A34A18", borderRadius:12, padding:"12px 16px", border:"1px solid #16A34A30" }}>
                <span style={{ color:G, fontSize:14, fontWeight:600 }}>
                  🎁 {lang==="uz"?"Bu e'lon bepul joylashtiriladi":"Это объявление будет бесплатным"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — Location (Yandex Map) */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:th.text, marginBottom:20 }}>📍 {tx.location}</h2>
            <div style={{ marginBottom:16 }}>
              <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:8 }}>
                {lang==="uz"?"Shahar":"Город"} <span style={{ color:"#EF4444" }}>*</span>
              </label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {(lang==="uz" ? CITIES_UZ : CITIES_RU).map(c => (
                  <Chip key={c} label={c} active={data.city===c}
                    onClick={() => u({ city:c })} dark={dark} color={G} />
                ))}
              </div>
            </div>
            <Input dark={dark} label={lang==="uz"?"Tuman / Ko'cha":"Район / Улица"}
              value={data.district} onChange={e=>u({district:e.target.value})}
              placeholder={lang==="uz"?"Masalan: Yunusobod":"Напр: Юнусобад"} />
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:th.text2, marginBottom:8 }}>
                {lang==="uz"?"Yandex xaritada belgilang":"Отметьте на Яндекс карте"}
              </div>
              <YandexMapPicker lang={lang} lat={data.lat} lng={data.lng}
                onChange={({ lat, lng }) => u({ lat, lng })} />
            </div>
          </div>
        )}

        {/* STEP 4 — Photos */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:th.text, marginBottom:8 }}>📸 {tx.photos}</h2>
            <p style={{ color:th.sub, fontSize:13, marginBottom:20 }}>
              {lang==="uz"?"Kamida 1 ta rasm qo'shing. Yaxshi rasmlar e'lonni tez sotadi!":"Добавьте хотя бы 1 фото. Хорошие фото ускоряют продажу!"}
            </p>
            <PhotoUploader dark={dark} photos={data.photos} onChange={photos=>u({photos})} max={8} />
            {data.photos.length === 0 && (
              <div style={{ background:th.card2, borderRadius:12, padding:14, border:`1px dashed ${th.border2}`, marginTop:16 }}>
                <p style={{ fontSize:13, color:th.sub, textAlign:"center", margin:0 }}>
                  {lang==="uz"?"Rasmsiz ham davom etishingiz mumkin":"Можно продолжить без фото"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — Review */}
        {step === 5 && (
          <div>
            <h2 style={{ fontSize:18, fontWeight:800, color:th.text, marginBottom:20 }}>
              {lang==="uz"?"E'lonni ko'rib chiqing":"Проверьте объявление"}
            </h2>
            <div style={{ background:th.card, borderRadius:16, overflow:"hidden", border:`1px solid ${th.border}`, marginBottom:16 }}>
              <div style={{ height:160, background:th.card2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:56 }}>
                {data.photos[0]
                  ? <img src={data.photos[0]} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : CATEGORIES.find(c=>c.id===data.category)?.emoji || "📦"}
              </div>
              <div style={{ padding:"14px 16px" }}>
                <div style={{ fontSize:18, fontWeight:900, color:G, marginBottom:4 }}>
                  {data.priceType==="free" ? tx.free : data.priceType==="negotiable" ? tx.negotiable : `${Number(data.price||0).toLocaleString("ru-RU")} ${tx.sum}`}
                </div>
                <div style={{ fontSize:15, fontWeight:600, color:th.text, marginBottom:6 }}>{data.title}</div>
                <div style={{ fontSize:13, color:th.sub }}>📍 {data.city}{data.district?", "+data.district:""}</div>
              </div>
            </div>
            <div style={{ background:G+"12", borderRadius:12, padding:"12px 16px", marginBottom:16, border:`1px solid ${G}20` }}>
              <p style={{ fontSize:13, color:G, margin:0, lineHeight:1.6 }}>
                ✅ {lang==="uz"?"E'lon 24 soat ichida ko'rib chiqiladi":"Объявление будет проверено в течение 24 часов"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav buttons */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:430, padding:"12px 16px 28px",
        background:th.card, borderTop:`1px solid ${th.border}`,
        display:"flex", gap:10, zIndex:60,
      }}>
        {step > 0 && (
          <Btn dark={dark} variant="ghost" onClick={() => setStep(s=>s-1)} style={{ flex:1 }}>
            ← {lang==="uz"?"Orqaga":"Назад"}
          </Btn>
        )}
        {step < STEPS.length - 1 ? (
          <Btn dark={dark} onClick={() => canNext() && setStep(s=>s+1)} disabled={!canNext()} style={{ flex:2, background:canNext()?G:undefined }}>
            {lang==="uz"?"Davom etish":"Продолжить"} →
          </Btn>
        ) : (
          <Btn dark={dark} onClick={handlePublish} disabled={loading} style={{ flex:2, background:G }}>
            {loading ? "⏳ "+(lang==="uz"?"Joylashtirilmoqda...":"Публикация...") : "✅ "+tx.publish}
          </Btn>
        )}
      </div>
    </div>
  );
}
