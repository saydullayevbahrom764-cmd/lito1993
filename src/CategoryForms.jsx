import { useState, useRef, useEffect } from "react";

// =====================================================
// BREND → MODEL MAP (Avto servis)
// =====================================================
export const AUTO_MODELS = {
  "Chevrolet": ["Cobalt","Nexia","Gentra","Spark","Malibu","Tracker","Equinox","Onix","Damas","Labo"],
  "Toyota":    ["Camry","Corolla","Land Cruiser","RAV4","Prius","Yaris","Hilux","Fortuner","Venza","Alphard"],
  "Hyundai":   ["Accent","Elantra","Sonata","Tucson","Santa Fe","Creta","i30","Palisade","Kona","Venue"],
  "Kia":       ["Rio","Cerato","Sportage","Sorento","Optima","Picanto","Stinger","Seltos","Carnival","EV6"],
  "BMW":       ["3-Series","5-Series","7-Series","X3","X5","X6","M3","M5","X1","X7"],
  "Mercedes":  ["C-Class","E-Class","S-Class","GLC","GLE","G-Class","A-Class","GLS","CLA","EQS"],
  "Audi":      ["A3","A4","A6","A8","Q3","Q5","Q7","Q8","TT","e-tron"],
  "Volkswagen":["Golf","Passat","Tiguan","Polo","Touareg","Jetta","Atlas","ID.4","Arteon","T-Roc"],
  "Nissan":    ["Micra","Sentra","Altima","Maxima","X-Trail","Murano","Pathfinder","Qashqai","Leaf","Navara"],
  "Honda":     ["Civic","Accord","CR-V","HR-V","Pilot","Jazz","City","Fit","Odyssey","ZR-V"],
  "BYD":       ["Atto 3","Han","Tang","Song","Seal","Dolphin","Seagull","e6","Yuan Plus","Destroyer 05"],
  "Chery":     ["Tiggo 4","Tiggo 7","Tiggo 8","Arrizo 5","Arrizo 6","QQ","Fulwin","Exeed","Omoda 5","Tiggo 4 Pro"],
  "Haval":     ["H1","H2","H4","H6","H9","Jolion","F7","Dargo","Big Dog","XY"],
  "Tesla":     ["Model 3","Model Y","Model S","Model X","Cybertruck","Roadster"],
  "Boshqa":    [],
};

export const AUTO_SERVICES = {
  uz: [
    "Dvigatel (Motor)","Xodovoy","Elektrik","Diagnostika",
    "Kompyuter diagnostikasi","Moy almashtirish","Tormoz tizimi",
    "Transmissiya","Avtomat karobka","Mexanik karobka",
    "Sovutish tizimi","Konditsioner","Gaz uskunasi (LPG/CNG)",
    "Kuzov ishlari","Bo'yash","Payvandlash","Shina almashtirish",
    "Balansirovka","Disk ta'miri","Akkumulyator","Starter",
    "Generator","Signalizatsiya","Multimedia","Faralar",
    "Egzoz tizimi","Yoqilg'i tizimi","Osma tizim","Rul boshqaruvi","Boshqa",
  ],
  ru: [
    "Двигатель (Мотор)","Ходовая","Электрика","Диагностика",
    "Компьютерная диагностика","Замена масла","Тормозная система",
    "Трансмиссия","Автоматическая коробка","Механическая коробка",
    "Система охлаждения","Кондиционер","Газовое оборудование (LPG/CNG)",
    "Кузовные работы","Покраска","Сварка","Замена шин",
    "Балансировка","Ремонт дисков","Аккумулятор","Стартер",
    "Генератор","Сигнализация","Мультимедиа","Фары",
    "Выхлопная система","Топливная система","Подвеска","Рулевое управление","Другое",
  ],
};


// =====================================================
// SHARED FIELD COMPONENTS
// =====================================================
const L = (dark) => ({
  bg: dark ? "#0F0F1A" : "#F7F8FA",
  card: dark ? "#1A1A2E" : "#fff",
  card2: dark ? "#22223A" : "#F7F8FA",
  text: dark ? "#F0F0FF" : "#1A1A2E",
  sub: dark ? "#8888AA" : "#888",
  border: dark ? "#2A2A4A" : "#EBEBEB",
});

function Label({ children, required, dark }) {
  const th = L(dark);
  return (
    <label style={{ fontSize: 13, fontWeight: 600, color: th.sub, marginBottom: 6, display: "block" }}>
      {children} {required && <span style={{ color: "#16A34A" }}>*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", dark, style = {} }) {
  const th = L(dark);
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${th.border}`, background: th.card, fontSize: 15, outline: "none", marginBottom: 16, boxSizing: "border-box", color: th.text, ...style }}
    />
  );
}

function Textarea({ value, onChange, placeholder, dark }) {
  const th = L(dark);
  return (
    <textarea
      value={value} onChange={onChange} placeholder={placeholder}
      style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${th.border}`, background: th.card, fontSize: 15, outline: "none", marginBottom: 16, boxSizing: "border-box", color: th.text, minHeight: 80, resize: "vertical", fontFamily: "inherit" }}
    />
  );
}

function Toggle({ label, value, onChange, dark }) {
  const th = L(dark);
  return (
    <div onClick={() => onChange(!value)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: value ? "#00B89412" : th.card2, borderRadius: 14, marginBottom: 16, border: value ? "1.5px solid #00B894" : `1px solid ${th.border}`, cursor: "pointer" }}>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: value ? "#00B894" : th.text }}>{label}</span>
      <div style={{ width: 44, height: 24, borderRadius: 12, background: value ? "#00B894" : th.border, position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 3, left: value ? 22 : 3, width: 18, height: 18, borderRadius: 9, background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </div>
    </div>
  );
}

function Chips({ options, value, onChange, color = "#16A34A", multi = false, dark }) {
  const th = L(dark);
  const selected = multi ? (Array.isArray(value) ? value : []) : value;
  const toggle = (opt) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt]);
    } else {
      onChange(value === opt ? "" : opt);
    }
  };
  const isSelected = (opt) => multi ? (Array.isArray(selected) && selected.includes(opt)) : selected === opt;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => toggle(opt)} style={{ padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600, border: isSelected(opt) ? `2px solid ${color}` : `2px solid ${th.border}`, background: isSelected(opt) ? color : th.card, color: isSelected(opt) ? "#fff" : th.text, transition: "all 0.15s" }}>
          {isSelected(opt) ? "✓ " : ""}{opt}
        </button>
      ))}
    </div>
  );
}

function Select({ options, value, onChange, placeholder, dark }) {
  const th = L(dark);
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", padding: "13px 16px", borderRadius: 14, border: `1.5px solid ${th.border}`, background: th.card, fontSize: 15, outline: "none", marginBottom: 16, boxSizing: "border-box", color: value ? th.text : th.sub, appearance: "none" }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}


// =====================================================
// LEAFLET MAP PICKER — GPS + search + pin
// =====================================================
export function MapPicker({ lang, location, onChange, dark }) {
  const th = L(dark);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const pinIconHtml = `<div style="background:#16A34A;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.35)"></div>`;

  useEffect(() => {
    if (!window.L || leafletMap.current) return;
    const Lf = window.L;
    const map = Lf.map(mapRef.current, { center: [location?.lat || 41.299, location?.lng || 69.240], zoom: 14 });
    Lf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    const icon = Lf.divIcon({ className: "", html: pinIconHtml, iconSize: [30, 30], iconAnchor: [15, 30] });
    if (location) {
      markerRef.current = Lf.marker([location.lat, location.lng], { icon, draggable: true }).addTo(map);
      markerRef.current.on("dragend", e => { const ll = e.target.getLatLng(); onChange({ lat: ll.lat, lng: ll.lng }); });
    }
    map.on("click", e => {
      const { lat, lng } = e.latlng;
      onChange({ lat, lng });
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else {
        markerRef.current = Lf.marker([lat, lng], { icon, draggable: true }).addTo(map);
        markerRef.current.on("dragend", ev => { const ll = ev.target.getLatLng(); onChange({ lat: ll.lat, lng: ll.lng }); });
      }
    });
    leafletMap.current = map;
  }, []);

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      onChange({ lat, lng });
      if (leafletMap.current) {
        leafletMap.current.setView([lat, lng], 16);
        const Lf = window.L;
        const icon = Lf.divIcon({ className: "", html: pinIconHtml, iconSize: [30, 30], iconAnchor: [15, 30] });
        if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
        else { markerRef.current = Lf.marker([lat, lng], { icon, draggable: true }).addTo(leafletMap.current); markerRef.current.on("dragend", e => { const ll = e.target.getLatLng(); onChange({ lat: ll.lat, lng: ll.lng }); }); }
      }
      setGpsLoading(false);
    }, () => setGpsLoading(false));
  };

  const handleSearch = async () => {
    if (!searchVal.trim()) return;
    try {
      const res = await fetch("https://nominatim.openstreetmap.org/search?format=json&q=" + encodeURIComponent(searchVal + " Toshkent"));
      const data = await res.json();
      if (data[0]) {
        const lat = parseFloat(data[0].lat), lng = parseFloat(data[0].lon);
        onChange({ lat, lng });
        if (leafletMap.current) {
          leafletMap.current.setView([lat, lng], 16);
          const Lf = window.L;
          const icon = Lf.divIcon({ className: "", html: pinIconHtml, iconSize: [30, 30], iconAnchor: [15, 30] });
          if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
          else { markerRef.current = Lf.marker([lat, lng], { icon, draggable: true }).addTo(leafletMap.current); markerRef.current.on("dragend", e => { const ll = e.target.getLatLng(); onChange({ lat: ll.lat, lng: ll.lng }); }); }
        }
      }
    } catch {}
  };

  return (
    <div>
      {/* Search */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder={lang === "uz" ? "Manzil qidirish..." : "Поиск адреса..."}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 12, border: `1.5px solid ${th.border}`, background: th.card, fontSize: 14, outline: "none", color: th.text }} />
        <button onClick={handleSearch} style={{ padding: "10px 14px", borderRadius: 12, background: "#16A34A", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🔍</button>
        <button onClick={handleGPS} style={{ padding: "10px 14px", borderRadius: 12, background: "#0984E3", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          {gpsLoading ? "⏳" : "📍 GPS"}
        </button>
      </div>
      {/* Map */}
      <div style={{ borderRadius: 16, overflow: "hidden", height: 260, border: `1.5px solid ${th.border}`, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      </div>
      {/* Status */}
      {location ? (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, background: "#00B89415", borderRadius: 10, padding: "8px 12px", border: "1px solid #00B89430" }}>
          <span>📍</span>
          <span style={{ fontSize: 12, color: "#00B894", fontWeight: 700 }}>
            {lang === "uz" ? "Joylashuv belgilandi ✓" : "Местоположение указано ✓"}
          </span>
          <span style={{ fontSize: 11, color: "#00B894", marginLeft: "auto" }}>{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
        </div>
      ) : (
        <p style={{ fontSize: 12, color: th.sub, marginTop: 8, textAlign: "center" }}>
          {lang === "uz" ? "Xaritaga bosing yoki GPS dan foydalaning" : "Нажмите на карту или используйте GPS"}
        </p>
      )}
    </div>
  );
}


// =====================================================
// PHOTOS UPLOADER (shared)
// =====================================================
export function PhotosUploader({ photos, onChange, dark, lang }) {
  const th = L(dark);
  const fileRef = useRef(null);
  const handleFiles = (e) => {
    Array.from(e.target.files || []).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => onChange([...photos, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        {photos.map((src, i) => (
          <div key={i} style={{ position: "relative", width: 88, height: 88, borderRadius: 12, overflow: "hidden" }}>
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <button onClick={() => onChange(photos.filter((_, j) => j !== i))}
              style={{ position: "absolute", top: 3, right: 3, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 8, color: "#fff", width: 22, height: 22, fontSize: 12, cursor: "pointer" }}>✕</button>
          </div>
        ))}
        <button onClick={() => fileRef.current?.click()}
          style={{ width: 88, height: 88, borderRadius: 12, border: `2px dashed ${th.border}`, background: th.card2, color: th.sub, fontSize: 28, cursor: "pointer" }}>＋</button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
    </div>
  );
}


// =====================================================
// 🚗 AVTO SERVIS FORMA — 8 bosqich
// =====================================================
export function AutoForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const [step, setStep] = useState(data.autoStep || 1);
  const TOTAL = 8;
  const u = patch => onChange({ ...data, ...patch });

  const models = data.autoBrand && data.autoBrand !== "Boshqa" ? (AUTO_MODELS[data.autoBrand] || []) : [];
  const services = AUTO_SERVICES[lang] || AUTO_SERVICES.uz;

  const STEPS = lang === "uz"
    ? ["Brend","Model","Xizmat","Narx","Vaqt","Izoh","Rasmlar","Xarita"]
    : ["Марка","Модель","Услуга","Цена","Время","Описание","Фото","Карта"];

  const canNext = (() => {
    if (step === 1) return !!data.autoBrand;
    if (step === 2) return !!data.autoModel || data.autoBrand === "Boshqa";
    if (step === 3) return !!data.autoService;
    if (step === 4) return !!data.originalPrice;
    return true;
  })();

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Step indicator */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, margin: "0 auto 4px", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", background: step > i + 1 ? "#00B894" : step === i + 1 ? "#16A34A" : th.border, color: step >= i + 1 ? "#fff" : th.sub }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <div style={{ fontSize: 9, color: step === i + 1 ? "#16A34A" : th.sub, fontWeight: step === i + 1 ? 700 : 400 }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 4, borderRadius: 2, background: th.border, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#16A34A,#15803D)", width: `${((step - 1) / (TOTAL - 1)) * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>

      {/* Step 1 — Brend */}
      {step === 1 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🚗 {lang === "uz" ? "Avtomobil brendini tanlang" : "Выберите марку авто"}</h3>
          <p style={{ color: th.sub, fontSize: 13, marginBottom: 16 }}>{lang === "uz" ? "Qaysi avtomobil uchun xizmat?" : "Для какого автомобиля?"}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.keys(AUTO_MODELS).map(b => (
              <button key={b} onClick={() => u({ autoBrand: b, autoModel: "" })}
                style={{ padding: "10px 16px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, border: data.autoBrand === b ? "2px solid #0652DD" : `2px solid ${th.border}`, background: data.autoBrand === b ? "#0652DD" : th.card, color: data.autoBrand === b ? "#fff" : th.text }}>
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Model */}
      {step === 2 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🔩 {lang === "uz" ? "Modelni tanlang" : "Выберите модель"}</h3>
          <p style={{ color: th.sub, fontSize: 13, marginBottom: 16 }}>{data.autoBrand}</p>
          {models.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {models.map(m => (
                <button key={m} onClick={() => u({ autoModel: m })}
                  style={{ padding: "10px 16px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, border: data.autoModel === m ? "2px solid #0652DD" : `2px solid ${th.border}`, background: data.autoModel === m ? "#0652DD" : th.card, color: data.autoModel === m ? "#fff" : th.text }}>
                  {m}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <Label dark={dark}>{lang === "uz" ? "Model nomini yozing" : "Введите модель"}</Label>
              <Input dark={dark} value={data.autoModel || ""} onChange={e => u({ autoModel: e.target.value })} placeholder={lang === "uz" ? "Masalan: Malibu 2021" : "Например: Malibu 2021"} />
            </div>
          )}
        </div>
      )}

      {/* Step 3 — Xizmat turi */}
      {step === 3 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🔧 {lang === "uz" ? "Xizmat turini tanlang" : "Выберите вид услуги"}</h3>
          <p style={{ color: th.sub, fontSize: 13, marginBottom: 16 }}>{data.autoBrand} {data.autoModel}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {services.map(sv => (
              <button key={sv} onClick={() => u({ autoService: sv })}
                style={{ padding: "12px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left", fontWeight: data.autoService === sv ? 700 : 500, fontSize: 14, border: data.autoService === sv ? "2px solid #16A34A" : `2px solid ${th.border}`, background: data.autoService === sv ? "#F0FDF4" : th.card, color: data.autoService === sv ? "#16A34A" : th.text }}>
                {data.autoService === sv ? "✓ " : ""}{sv}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 — Narx */}
      {step === 4 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>💰 {lang === "uz" ? "Xizmat narxini kiriting" : "Введите стоимость услуги"}</h3>
          <div style={{ background: th.card2, borderRadius: 14, padding: 14, marginBottom: 16, border: `1px solid ${th.border}` }}>
            <div style={{ fontSize: 12, color: th.sub }}>
              {data.autoBrand} {data.autoModel} — {data.autoService}
            </div>
          </div>
          <Label dark={dark} required>{lang === "uz" ? "Narx (so'm)" : "Цена (сум)"}</Label>
          <Input dark={dark} type="number" value={data.originalPrice || ""} onChange={e => u({ originalPrice: e.target.value })} placeholder="150 000" />
          <Label dark={dark}>{lang === "uz" ? "Chegirma % (ixtiyoriy)" : "Скидка % (необязательно)"}</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {[0,10,15,20,25,30,40,50].map(pct => (
              <button key={pct} onClick={() => u({ discountPercent: pct })}
                style={{ padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 700, fontSize: 13, border: (data.discountPercent || 0) === pct ? "2px solid #16A34A" : `2px solid ${th.border}`, background: (data.discountPercent || 0) === pct ? "#16A34A" : th.card, color: (data.discountPercent || 0) === pct ? "#fff" : th.text }}>
                {pct === 0 ? (lang === "uz" ? "Yo'q" : "Нет") : `-${pct}%`}
              </button>
            ))}
          </div>
          {data.discountPercent > 0 && (
            <div>
              <Label dark={dark}>{lang === "uz" ? "Chegirma muddati" : "Срок скидки"}</Label>
              <Input dark={dark} type="date" value={data.discountExpiry || ""} onChange={e => u({ discountExpiry: e.target.value })} min={new Date().toISOString().slice(0,10)} />
            </div>
          )}
        </div>
      )}

      {/* Step 5 — Ish vaqti */}
      {step === 5 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>⏰ {lang === "uz" ? "Ish vaqti va davomiylik" : "Режим работы"}</h3>
          <Label dark={dark}>{lang === "uz" ? "Ish vaqti (masalan 09:00–18:00)" : "Часы работы (напр. 09:00–18:00)"}</Label>
          <Input dark={dark} value={data.workTime || ""} onChange={e => u({ workTime: e.target.value })} placeholder="09:00 – 18:00" />
          <Label dark={dark}>{lang === "uz" ? "Taxminiy davomiylik (masalan 2-3 soat)" : "Примерная длительность (напр. 2–3 часа)"}</Label>
          <Input dark={dark} value={data.duration || ""} onChange={e => u({ duration: e.target.value })} placeholder={lang === "uz" ? "2-3 soat" : "2–3 часа"} />
          <Toggle dark={dark} label={lang === "uz" ? "🏠 Uyga borish xizmati mavjud" : "🏠 Выезд на дом"} value={!!data.homeVisit} onChange={v => u({ homeVisit: v })} />
        </div>
      )}

      {/* Step 6 — Izoh */}
      {step === 6 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>📝 {lang === "uz" ? "Qo'shimcha ma'lumot" : "Дополнительная информация"}</h3>
          <Label dark={dark}>{lang === "uz" ? "Servis haqida tavsif" : "Описание сервиса"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder={lang === "uz" ? "Tajriba, kafolat, qo'shimcha xizmatlar..." : "Опыт, гарантия, дополнительные услуги..."} />
          <Label dark={dark}>{lang === "uz" ? "Telegram (ixtiyoriy)" : "Telegram (необязательно)"}</Label>
          <Input dark={dark} value={data.telegram || ""} onChange={e => u({ telegram: e.target.value })} placeholder="@servis_nomi" />
          <Label dark={dark}>{lang === "uz" ? "Telefon" : "Телефон"}</Label>
          <Input dark={dark} type="tel" value={data.phone || ""} onChange={e => u({ phone: e.target.value })} placeholder="+998 90 123 45 67" />
        </div>
      )}

      {/* Step 7 — Rasmlar */}
      {step === 7 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>📸 {lang === "uz" ? "Servis rasmlari" : "Фото сервиса"}</h3>
          <p style={{ color: th.sub, fontSize: 13, marginBottom: 16 }}>{lang === "uz" ? "Servis, asboblar yoki oldingi ishlar rasmlari" : "Фото сервиса, инструментов или примеров работ"}</p>
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>
      )}

      {/* Step 8 — Xarita */}
      {step === 8 && (
        <div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🗺️ {lang === "uz" ? "Servis joylashuvi" : "Расположение сервиса"}</h3>
          <p style={{ color: th.sub, fontSize: 13, marginBottom: 12 }}>{lang === "uz" ? "Xaritada aniq manzilni belgilang" : "Укажите точный адрес на карте"}</p>
          <Label dark={dark} required>{lang === "uz" ? "Manzil" : "Адрес"}</Label>
          <Input dark={dark} value={data.address || ""} onChange={e => u({ address: e.target.value })} placeholder={lang === "uz" ? "Ko'cha, mahalla, uy raqami" : "Улица, квартал, номер дома"} />
          <Label dark={dark}>{lang === "uz" ? "Xaritada belgilang" : "Отметьте на карте"}</Label>
          <MapPicker lang={lang} dark={dark} location={data.location} onChange={loc => u({ location: loc })} />
        </div>
      )}

      {/* Nav buttons */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: th.card, borderTop: `1px solid ${th.border}`, padding: "12px 20px 24px", display: "flex", gap: 10, boxSizing: "border-box", zIndex: 50 }}>
        <button onClick={() => step === 1 ? onBack() : setStep(s => s - 1)}
          style={{ flex: 1, padding: "14px", borderRadius: 14, border: `1.5px solid ${th.border}`, background: th.card, color: th.text, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          ← {lang === "uz" ? "Orqaga" : "Назад"}
        </button>
        {step < TOTAL ? (
          <button onClick={() => canNext && setStep(s => s + 1)}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: canNext ? "#16A34A" : th.border, color: canNext ? "#fff" : th.sub, fontWeight: 800, cursor: canNext ? "pointer" : "default", fontSize: 14, boxShadow: canNext ? "0 4px 16px rgba(230,57,70,0.3)" : "none" }}>
            {lang === "uz" ? "Davom etish" : "Продолжить"} →
          </button>
        ) : (
          <button onClick={() => data.address ? onSubmit(data) : null}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: data.address ? "#16A34A" : th.border, color: data.address ? "#fff" : th.sub, fontWeight: 800, cursor: data.address ? "pointer" : "default", fontSize: 14, boxShadow: data.address ? "0 4px 16px rgba(230,57,70,0.3)" : "none" }}>
            ✅ {lang === "uz" ? "Saqlash" : "Сохранить"}
          </button>
        )}
      </div>
    </div>
  );
}


// =====================================================
// SHARED: PRICE + DISCOUNT + CONTACT + MAP STEP
// =====================================================
function PriceStep({ lang, dark, data, onChange, pricePlaceholder = "100 000", priceLabel }) {
  const th = L(dark);
  const u = patch => onChange({ ...data, ...patch });
  const DISCOUNTS = [0, 10, 15, 20, 25, 30, 40, 50];
  return (
    <div>
      <Label dark={dark} required>{priceLabel || (lang === "uz" ? "Narx (so'm)" : "Цена (сум)")}</Label>
      <Input dark={dark} type="number" value={data.originalPrice || ""} onChange={e => u({ originalPrice: e.target.value })} placeholder={pricePlaceholder} />
      <Label dark={dark}>{lang === "uz" ? "Chegirma (ixtiyoriy)" : "Скидка (необязательно)"}</Label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {DISCOUNTS.map(pct => (
          <button key={pct} onClick={() => u({ discountPercent: pct })}
            style={{ padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontWeight: 700, fontSize: 13,
              border: (data.discountPercent || 0) === pct ? "2px solid #16A34A" : `2px solid ${th.border}`,
              background: (data.discountPercent || 0) === pct ? "#16A34A" : th.card,
              color: (data.discountPercent || 0) === pct ? "#fff" : th.text }}>
            {pct === 0 ? (lang === "uz" ? "Yo'q" : "Нет") : `-${pct}%`}
          </button>
        ))}
      </div>
      {data.discountPercent > 0 && (
        <Input dark={dark} type="date" value={data.discountExpiry || ""}
          onChange={e => u({ discountExpiry: e.target.value })}
          min={new Date().toISOString().slice(0, 10)} />
      )}
    </div>
  );
}

function ContactMapStep({ lang, dark, data, onChange }) {
  const u = patch => onChange({ ...data, ...patch });
  return (
    <div>
      <Label dark={dark} required>{lang === "uz" ? "Manzil" : "Адрес"}</Label>
      <Input dark={dark} value={data.address || ""} onChange={e => u({ address: e.target.value })}
        placeholder={lang === "uz" ? "Ko'cha, mahalla, uy raqami" : "Улица, квартал, номер дома"} />
      <Label dark={dark}>{lang === "uz" ? "Telefon" : "Телефон"}</Label>
      <Input dark={dark} type="tel" value={data.phone || ""} onChange={e => u({ phone: e.target.value })} placeholder="+998 90 123 45 67" />
      <Label dark={dark}>{lang === "uz" ? "Telegram (ixtiyoriy)" : "Telegram (необязательно)"}</Label>
      <Input dark={dark} value={data.telegram || ""} onChange={e => u({ telegram: e.target.value })} placeholder="@username" />
      <Label dark={dark}>{lang === "uz" ? "Xaritada belgilang" : "Отметьте на карте"}</Label>
      <MapPicker lang={lang} dark={dark} location={data.location} onChange={loc => u({ location: loc })} />
    </div>
  );
}


// =====================================================
// GENERIC MULTI-STEP FORM WRAPPER
// =====================================================
function MultiStepForm({ steps, lang, dark, canNext, onBack, onSubmit, data, children }) {
  const th = L(dark);
  const [step, setStep] = useState(1);
  const total = steps.length;
  const isLast = step === total;
  const canSubmit = data.address?.trim().length > 0;
  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div style={{ width: "100%", height: 4, borderRadius: 2, background: step > i ? "#16A34A" : th.border }} />
            <span style={{ fontSize: 9, color: step === i + 1 ? "#16A34A" : th.sub, fontWeight: step === i + 1 ? 700 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
      {/* Content */}
      {children(step)}
      {/* Buttons */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: th.card, borderTop: `1px solid ${th.border}`, padding: "12px 20px 24px", display: "flex", gap: 10, boxSizing: "border-box", zIndex: 50 }}>
        <button onClick={() => step === 1 ? onBack() : setStep(s => s - 1)}
          style={{ flex: 1, padding: "14px", borderRadius: 14, border: `1.5px solid ${th.border}`, background: th.card, color: th.text, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          ← {lang === "uz" ? "Orqaga" : "Назад"}
        </button>
        {!isLast ? (
          <button onClick={() => (canNext ? canNext(step) : true) && setStep(s => s + 1)}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: (canNext ? canNext(step) : true) ? "#16A34A" : th.border, color: (canNext ? canNext(step) : true) ? "#fff" : th.sub, fontWeight: 800, cursor: "pointer", fontSize: 14, boxShadow: "0 4px 16px rgba(230,57,70,0.25)" }}>
            {lang === "uz" ? "Davom etish" : "Продолжить"} →
          </button>
        ) : (
          <button onClick={() => canSubmit && onSubmit(data)}
            style={{ flex: 2, padding: "14px", borderRadius: 14, border: "none", background: canSubmit ? "#16A34A" : th.border, color: canSubmit ? "#fff" : th.sub, fontWeight: 800, cursor: canSubmit ? "pointer" : "default", fontSize: 14, boxShadow: canSubmit ? "0 4px 16px rgba(230,57,70,0.3)" : "none" }}>
            ✅ {lang === "uz" ? "Saqlash" : "Сохранить"}
          </button>
        )}
      </div>
    </div>
  );
}


// =====================================================
// 🍕 OZIQ-OVQAT
// =====================================================
const FOOD_CATS = { uz: ["Meva va sabzavot","Non va pishiriq","Go'sht va baliq","Sut mahsulotlari","Shirinliklar","Ichimliklar","Tayyor taomlar","Organik","Boshqa"], ru: ["Фрукты и овощи","Хлеб и выпечка","Мясо и рыба","Молочные продукты","Сладости","Напитки","Готовая еда","Органика","Другое"] };
const FOOD_UNITS = { uz: ["kg","dona","litr","gr","litr","paket","quti","boshqa"], ru: ["кг","шт","л","г","мл","пачка","коробка","другое"] };

export function FoodForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Tur","Ma'lumot","Narx","Manzil"] : ["Тип","Инфо","Цена","Адрес"];
  const canNext = step => {
    if (step === 1) return !!data.catType;
    if (step === 2) return !!data.name && !!data.unit;
    if (step === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🍕 {lang === "uz" ? "Mahsulot turini tanlang" : "Выберите тип товара"}</h3>
          <Chips dark={dark} options={FOOD_CATS[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#E17055" />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>📝 {lang === "uz" ? "Mahsulot ma'lumotlari" : "Информация о товаре"}</h3>
          <Label dark={dark} required>{lang === "uz" ? "Mahsulot nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: Olma, Tarvuz..." : "Напр: Яблоки, Арбуз..."} />
          <Label dark={dark} required>{lang === "uz" ? "O'lchov birligi" : "Единица измерения"}</Label>
          <Chips dark={dark} options={FOOD_UNITS[lang]} value={data.unit} onChange={v => u({ unit: v })} color="#E17055" />
          <Label dark={dark}>{lang === "uz" ? "Yaroqlilik muddati" : "Срок годности"}</Label>
          <Input dark={dark} type="date" value={data.expiryDate || ""} onChange={e => u({ expiryDate: e.target.value })} min={new Date().toISOString().slice(0,10)} />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder={lang === "uz" ? "Mahsulot haqida..." : "О товаре..."} />
          <Label dark={dark}>{lang === "uz" ? "Rasmlar" : "Фото"}</Label>
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="25 000" priceLabel={lang === "uz" ? `Narx (so'm / ${data.unit || "dona"})` : `Цена (сум / ${data.unit || "шт"})`} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}

// =====================================================
// 👕 KIYIM-KECHAK
// =====================================================
const CLOTH_CATS = { uz: ["Ko'ylak","Shim","Kurtka","Palto","Jinsi","Sport kiyim","Yubka","Ko'ylakcha","Oyoq kiyim","Aksessuarlar","Sumka","Boshqa"], ru: ["Рубашка","Брюки","Куртка","Пальто","Джинсы","Спортивный костюм","Юбка","Платье","Обувь","Аксессуары","Сумка","Другое"] };
const GENDERS = { uz: ["Erkak 👨","Ayol 👩","Bolalar 👶","Unisex"], ru: ["Мужское 👨","Женское 👩","Детское 👶","Унисекс"] };
const SIZES = ["XS","S","M","L","XL","XXL","3XL","44","46","48","50","52","54"];
const COLORS = ["⬜ Oq","⬛ Qora","🟥 Qizil","🟦 Ko'k","🟩 Yashil","🟨 Sariq","🟧 To'q sariq","🟫 Jigarrang","Kulrang","Pushti","Binafsha","Boshqa"];

export function ClothingForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Jins/Tur","Ma'lumot","Narx","Manzil"] : ["Пол/Тип","Инфо","Цена","Адрес"];
  const canNext = step => {
    if (step === 1) return !!data.gender && !!data.catType;
    if (step === 2) return !!data.name;
    if (step === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>👕 {lang === "uz" ? "Jins tanlang" : "Выберите пол"}</h3>
          <Chips dark={dark} options={GENDERS[lang]} value={data.gender} onChange={v => u({ gender: v })} color="#2D3436" />
          <Label dark={dark} required>{lang === "uz" ? "Kiyim turi" : "Тип одежды"}</Label>
          <Chips dark={dark} options={CLOTH_CATS[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#2D3436" />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>📝 {lang === "uz" ? "Kiyim ma'lumotlari" : "Данные одежды"}</h3>
          <Label dark={dark} required>{lang === "uz" ? "Nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: Erkaklar ko'ylagi" : "Напр: Мужская рубашка"} />
          <Label dark={dark}>{lang === "uz" ? "Brend (ixtiyoriy)" : "Бренд (необязательно)"}</Label>
          <Input dark={dark} value={data.catBrand || ""} onChange={e => u({ catBrand: e.target.value })} placeholder="Zara, H&M, Lacoste..." />
          <Label dark={dark}>{lang === "uz" ? "O'lchamlar" : "Размеры"}</Label>
          <Chips dark={dark} options={SIZES} value={data.sizes || []} onChange={v => u({ sizes: v })} multi color="#2D3436" />
          <Label dark={dark}>{lang === "uz" ? "Rang" : "Цвет"}</Label>
          <Chips dark={dark} options={COLORS} value={data.color} onChange={v => u({ color: v })} color="#2D3436" />
          <Label dark={dark}>{lang === "uz" ? "Material (ixtiyoriy)" : "Материал (необязательно)"}</Label>
          <Input dark={dark} value={data.material || ""} onChange={e => u({ material: e.target.value })} placeholder="100% paxta, Polyester..." />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <Label dark={dark}>{lang === "uz" ? "Rasmlar" : "Фото"}</Label>
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="250 000" />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}


// =====================================================
// 📱 ELEKTRONIKA
// =====================================================
const ELEC_BRANDS = ["Apple","Samsung","Xiaomi","Huawei","LG","Sony","Lenovo","Asus","HP","Dell","Oppo","Vivo","Realme","Honor","Boshqa"];
const ELEC_CATS = { uz: ["Smartfon","Noutbuk","Planshet","TV","Maishiy texnika","Kamera","Quloqchin/Kolonka","O'yin qurilmasi","Aksessuarlar","Boshqa"], ru: ["Смартфон","Ноутбук","Планшет","Телевизор","Бытовая техника","Камера","Наушники/Колонка","Игровая консоль","Аксессуары","Другое"] };
const ELEC_MEMORY = ["16GB","32GB","64GB","128GB","256GB","512GB","1TB","2TB"];
const ELEC_CONDITION = { uz: ["Yangi (muhr yopilmagan)","Yangi (ochilgan)","Zo'r holat","Yaxshi holat","Qoniqarli"], ru: ["Новый (запечатан)","Новый (вскрытый)","Отличное","Хорошее","Удовлетворительное"] };

export function ElectronicsForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Tur/Brend","Ma'lumot","Narx","Manzil"] : ["Тип/Бренд","Инфо","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.catType && !!data.catBrand;
    if (s === 2) return !!data.name && !!data.condition;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>📱 {lang === "uz" ? "Kategoriya" : "Категория"}</h3>
          <Chips dark={dark} options={ELEC_CATS[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#0984E3" />
          <Label dark={dark} required>{lang === "uz" ? "Brend" : "Бренд"}</Label>
          <Chips dark={dark} options={ELEC_BRANDS} value={data.catBrand} onChange={v => u({ catBrand: v })} color="#0984E3" />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>📝 {lang === "uz" ? "Mahsulot ma'lumotlari" : "Данные товара"}</h3>
          <Label dark={dark} required>{lang === "uz" ? "Nomi va modeli" : "Название и модель"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: iPhone 15 Pro" : "Напр: iPhone 15 Pro"} />
          <Label dark={dark} required>{lang === "uz" ? "Holati" : "Состояние"}</Label>
          <Chips dark={dark} options={ELEC_CONDITION[lang]} value={data.condition} onChange={v => u({ condition: v })} color="#0984E3" />
          <Label dark={dark}>{lang === "uz" ? "Xotira (ixtiyoriy)" : "Память (необязательно)"}</Label>
          <Chips dark={dark} options={ELEC_MEMORY} value={data.memory} onChange={v => u({ memory: v })} color="#0984E3" />
          <Toggle dark={dark} label={lang === "uz" ? "✅ Kafolat mavjud" : "✅ Гарантия есть"} value={!!data.warranty} onChange={v => u({ warranty: v })} />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <Label dark={dark}>{lang === "uz" ? "Rasmlar" : "Фото"}</Label>
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="3 500 000" />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}

// =====================================================
// 💄 GO'ZALLIK
// =====================================================
const BEAUTY_SERVICES = { uz: ["Soch kesish","Soch bo'yash","Soch davolash","Tirnoq dizayni","Manikur","Pedikur","Kosmetologiya","Massaj","Qash dizayni","Kipriklash","Vizaj","Solarium","Boshqa"], ru: ["Стрижка","Окрашивание","Лечение волос","Дизайн ногтей","Маникюр","Педикюр","Косметология","Массаж","Дизайн бровей","Наращивание ресниц","Визаж","Солярий","Другое"] };
const SALON_TYPES = { uz: ["Go'zallik saloni","Sartaroshxona","Nail studio","Spa markaz","Kosmetolog kabineti","Massaj saloni","Boshqa"], ru: ["Салон красоты","Парикмахерская","Nail studio","СПА центр","Кабинет косметолога","Массажный салон","Другое"] };

export function BeautyForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Salon","Xizmat","Narx","Manzil"] : ["Салон","Услуга","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.salonType;
    if (s === 2) return !!data.catType && !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>💄 {lang === "uz" ? "Salon turini tanlang" : "Тип салона"}</h3>
          <Chips dark={dark} options={SALON_TYPES[lang]} value={data.salonType} onChange={v => u({ salonType: v })} color="#E84393" />
          <Label dark={dark}>{lang === "uz" ? "Salon nomi (ixtiyoriy)" : "Название салона (необязательно)"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: Beauty Studio" : "Напр: Beauty Studio"} />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>✂️ {lang === "uz" ? "Xizmat turini tanlang" : "Вид услуги"}</h3>
          <Chips dark={dark} options={BEAUTY_SERVICES[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#E84393" />
          <Label dark={dark} required>{lang === "uz" ? "Xizmat nomi" : "Название услуги"}</Label>
          <Input dark={dark} value={data.serviceName || ""} onChange={e => u({ serviceName: e.target.value })} placeholder={lang === "uz" ? "Masalan: Soch kesish + ukладка" : "Напр: Стрижка + укладка"} />
          <Label dark={dark}>{lang === "uz" ? "Davomiyligi" : "Длительность"}</Label>
          <Input dark={dark} value={data.duration || ""} onChange={e => u({ duration: e.target.value })} placeholder={lang === "uz" ? "45 daqiqa" : "45 минут"} />
          <Label dark={dark}>{lang === "uz" ? "Ish vaqti" : "Часы работы"}</Label>
          <Input dark={dark} value={data.workTime || ""} onChange={e => u({ workTime: e.target.value })} placeholder="09:00 – 20:00" />
          <Label dark={dark}>{lang === "uz" ? "Rasmlar" : "Фото"}</Label>
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="50 000" priceLabel={lang === "uz" ? "Xizmat narxi (so'm)" : "Стоимость услуги (сум)"} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}


// =====================================================
// ☕ RESTORAN / KAFE
// =====================================================
const CUISINE_TYPES = { uz: ["O'zbek","Rus","Turk","Italyan","Xitoy","Yapon/Sushi","Koreys","Fast Food","Pizza","Burger","Kavkaz","Hind","Meksikan","Boshqa"], ru: ["Узбекская","Русская","Турецкая","Итальянская","Китайская","Японская/Суши","Корейская","Фастфуд","Пицца","Бургер","Кавказская","Индийская","Мексиканская","Другое"] };

export function RestaurantForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Tur","Menyu","Narx","Manzil"] : ["Тип","Меню","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.catType && !!data.name;
    if (s === 2) return true;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>☕ {lang === "uz" ? "Restoran/Kafe turi" : "Тип ресторана"}</h3>
          <Label dark={dark} required>{lang === "uz" ? "Nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Restoran / kafe nomi" : "Название ресторана"} />
          <Label dark={dark} required>{lang === "uz" ? "Oshxona turi" : "Тип кухни"}</Label>
          <Chips dark={dark} options={CUISINE_TYPES[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#FDCB6E" />
          <Label dark={dark}>{lang === "uz" ? "Ish vaqti" : "Часы работы"}</Label>
          <Input dark={dark} value={data.workTime || ""} onChange={e => u({ workTime: e.target.value })} placeholder="10:00 – 23:00" />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>🍽️ {lang === "uz" ? "Menyu va imkoniyatlar" : "Меню и возможности"}</h3>
          <Label dark={dark}>{lang === "uz" ? "Mashhur taomlar (vergul bilan)" : "Популярные блюда (через запятую)"}</Label>
          <Textarea dark={dark} value={data.menuItems || ""} onChange={e => u({ menuItems: e.target.value })} placeholder={lang === "uz" ? "Oshpaz oshi, Manti, Lagman..." : "Плов, Манты, Лагман..."} />
          <Toggle dark={dark} label={lang === "uz" ? "🚚 Yetkazib berish mavjud" : "🚚 Есть доставка"} value={!!data.delivery} onChange={v => u({ delivery: v })} />
          <Toggle dark={dark} label={lang === "uz" ? "📅 Stol bron qilish" : "📅 Бронирование столиков"} value={!!data.tableBooking} onChange={v => u({ tableBooking: v })} />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <Label dark={dark}>{lang === "uz" ? "Menyu rasmlari" : "Фото меню"}</Label>
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="50 000" priceLabel={lang === "uz" ? "O'rtacha narx (so'm/kishi)" : "Средний чек (сум/чел)"} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}

// =====================================================
// 🏠 UY-RO'ZG'OR
// =====================================================
const HOME_CATS = { uz: ["Mebel","Maishiy texnika","Idish-tovoq","Uy bezaklari","Ko'rpa-yostiq","Bog' anjomlar","Tozalash vositalari","Ta'mirlash mollari","Boshqa"], ru: ["Мебель","Бытовая техника","Посуда","Декор","Постельное бельё","Садовый инвентарь","Средства уборки","Стройматериалы","Другое"] };
const CONDITION_LIST = { uz: ["Yangi","Zo'r holat","Yaxshi holat","Qoniqarli"], ru: ["Новое","Отличное","Хорошее","Удовлетворительное"] };

export function HomeCatForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Tur","Ma'lumot","Narx","Manzil"] : ["Тип","Инфо","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.catType;
    if (s === 2) return !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🏠 {lang === "uz" ? "Kategoriya" : "Категория"}</h3>
          <Chips dark={dark} options={HOME_CATS[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#00B894" />
        </div>)}
        {step === 2 && (<div>
          <Label dark={dark} required>{lang === "uz" ? "Nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: Ikki kishilik divan" : "Напр: Двуспальный диван"} />
          <Label dark={dark}>{lang === "uz" ? "Material" : "Материал"}</Label>
          <Input dark={dark} value={data.material || ""} onChange={e => u({ material: e.target.value })} placeholder="Yog'och, Temir, Plastik..." />
          <Label dark={dark}>{lang === "uz" ? "Holati" : "Состояние"}</Label>
          <Chips dark={dark} options={CONDITION_LIST[lang]} value={data.condition} onChange={v => u({ condition: v })} color="#00B894" />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}


// =====================================================
// ⚽ SPORT  |  🛠️ XIZMATLAR  |  💊 DORIXONA
// =====================================================
const SPORT_TYPES = { uz: ["Futbol","Basketbol","Tennis","Badminton","Fitness","Velosiped","Suzish","Yugurish","Boks","Kurash","Yoga","Boshqa"], ru: ["Футбол","Баскетбол","Теннис","Бадминтон","Фитнес","Велоспорт","Плавание","Бег","Бокс","Борьба","Йога","Другое"] };
const SERVICE_TYPES = { uz: ["Santexnika","Elektrik","Qurilish","Bo'yash","Qulf ustasi","Kompyuter ta'mirlash","Yuklovchi","Haydovchi","Uy tozalash","Kir yuvish","Parda tikish","Konditsioner o'rnatish","Boshqa"], ru: ["Сантехника","Электрика","Строительство","Маляр","Слесарь","Ремонт ПК","Грузчик","Водитель","Уборка","Стирка","Пошив штор","Установка кондиционера","Другое"] };

function SimpleForm({ lang, dark, data, onChange, onSubmit, onBack, catLabel, types, color, pricePlaceholder }) {
  const u = p => onChange({ ...data, ...p });
  const th = L(dark);
  const steps = lang === "uz" ? ["Tur","Ma'lumot","Narx","Manzil"] : ["Тип","Инфо","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.catType;
    if (s === 2) return !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>{catLabel}</h3>
          <Chips dark={dark} options={types[lang]} value={data.catType} onChange={v => u({ catType: v })} color={color} />
        </div>)}
        {step === 2 && (<div>
          <Label dark={dark} required>{lang === "uz" ? "Nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Xizmat / mahsulot nomi" : "Название услуги / товара"} />
          <Label dark={dark}>{lang === "uz" ? "Brend (ixtiyoriy)" : "Бренд (необязательно)"}</Label>
          <Input dark={dark} value={data.catBrand || ""} onChange={e => u({ catBrand: e.target.value })} placeholder="..." />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder={pricePlaceholder} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}

export function SportForm(props) { return <SimpleForm {...props} catLabel="⚽ Sport" types={SPORT_TYPES} color="#6C5CE7" pricePlaceholder="150 000" />; }
export function ServicesForm(props) { return <SimpleForm {...props} catLabel="🛠️ Xizmatlar" types={SERVICE_TYPES} color="#636E72" pricePlaceholder="100 000" />; }

export function PharmacyForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Ma'lumot","Holat","Narx","Manzil"] : ["Инфо","Статус","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>💊 {lang === "uz" ? "Dori ma'lumotlari" : "Данные о лекарстве"}</h3>
          <Label dark={dark} required>{lang === "uz" ? "Dori nomi" : "Название лекарства"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder="Paracetamol, Amoxicillin..." />
          <Label dark={dark}>{lang === "uz" ? "Ishlab chiqaruvchi" : "Производитель"}</Label>
          <Input dark={dark} value={data.manufacturer || ""} onChange={e => u({ manufacturer: e.target.value })} placeholder="Pharmstandard, Bayer..." />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder={lang === "uz" ? "Ko'rsatmalar, tarkib..." : "Показания, состав..."} />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>ℹ️ {lang === "uz" ? "Qo'shimcha ma'lumot" : "Дополнительно"}</h3>
          <Toggle dark={dark} label={lang === "uz" ? "📋 Retsept talab qilinadi" : "📋 Требуется рецепт"} value={!!data.prescription} onChange={v => u({ prescription: v })} />
          <Toggle dark={dark} label={lang === "uz" ? "🕐 24 soat ishlaydi" : "🕐 Работает 24 часа"} value={!!data.open24h} onChange={v => u({ open24h: v })} />
          <Toggle dark={dark} label={lang === "uz" ? "🚚 Yetkazib berish mavjud" : "🚚 Есть доставка"} value={!!data.delivery} onChange={v => u({ delivery: v })} />
          <Label dark={dark}>{lang === "uz" ? "Mavjud soni" : "Наличие (кол-во)"}</Label>
          <Input dark={dark} type="number" value={data.stock || ""} onChange={e => u({ stock: e.target.value })} placeholder="100" />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="15 000" />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}


// =====================================================
// 📚 TA'LIM  |  🏨 MEHMONXONA
// =====================================================
const EDU_DIRECTIONS = { uz: ["Ingliz tili","Rus tili","Xitoy tili","Matematika","Fizika","Kimyo","Dasturlash","Dizayn","SMM/Marketing","Buxgalteriya","Tibbiyot","Huquq","Musiqa","Rasm","Sport","Boshqa"], ru: ["Английский","Русский","Китайский","Математика","Физика","Химия","Программирование","Дизайн","SMM/Маркетинг","Бухгалтерия","Медицина","Право","Музыка","Рисование","Спорт","Другое"] };
const ROOM_TYPES = { uz: ["Standart","Lyuks","Prezident suite","2 kishilik","3 kishilik","Oilaviy","Pansion","Boshqa"], ru: ["Стандарт","Люкс","Президентский люкс","Двухместный","Трёхместный","Семейный","Пансион","Другое"] };

export function EducationForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Yo'nalish","Kurs","Narx","Manzil"] : ["Напр.","Курс","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.direction;
    if (s === 2) return !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>📚 {lang === "uz" ? "O'quv yo'nalishini tanlang" : "Выберите направление"}</h3>
          <Chips dark={dark} options={EDU_DIRECTIONS[lang]} value={data.direction} onChange={v => u({ direction: v })} color="#F79F1F" />
        </div>)}
        {step === 2 && (<div>
          <Label dark={dark} required>{lang === "uz" ? "O'quv markazi / Kurs nomi" : "Центр / Название курса"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: Ingliz tili — Beginner" : "Напр: Английский — Beginner"} />
          <Label dark={dark}>{lang === "uz" ? "O'qituvchi" : "Преподаватель"}</Label>
          <Input dark={dark} value={data.teacher || ""} onChange={e => u({ teacher: e.target.value })} placeholder={lang === "uz" ? "Ism Familiya" : "Имя Фамилия"} />
          <Label dark={dark}>{lang === "uz" ? "Davomiyligi" : "Длительность"}</Label>
          <Input dark={dark} value={data.duration || ""} onChange={e => u({ duration: e.target.value })} placeholder={lang === "uz" ? "3 oy, 72 soat" : "3 месяца, 72 часа"} />
          <Label dark={dark}>{lang === "uz" ? "Boshlanish sanasi" : "Дата начала"}</Label>
          <Input dark={dark} type="date" value={data.startDate || ""} onChange={e => u({ startDate: e.target.value })} min={new Date().toISOString().slice(0,10)} />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="500 000" priceLabel={lang === "uz" ? "Kurs narxi (so'm/oy)" : "Стоимость курса (сум/мес)"} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}

export function HotelForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Ma'lumot","Qulayliklar","Narx","Manzil"] : ["Инфо","Удобства","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.name && !!data.roomType;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>🏨 {lang === "uz" ? "Mehmonxona ma'lumotlari" : "Данные гостиницы"}</h3>
          <Label dark={dark} required>{lang === "uz" ? "Nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Mehmonxona nomi" : "Название гостиницы"} />
          <Label dark={dark} required>{lang === "uz" ? "Xona turi" : "Тип номера"}</Label>
          <Chips dark={dark} options={ROOM_TYPES[lang]} value={data.roomType} onChange={v => u({ roomType: v })} color="#1289A7" />
          <Label dark={dark}>{lang === "uz" ? "Necha kishilik" : "Вместимость"}</Label>
          <Chips dark={dark} options={["1","2","3","4","5+"]} value={data.capacity} onChange={v => u({ capacity: v })} color="#1289A7" />
          <Label dark={dark}>{lang === "uz" ? "Yulduzcha" : "Звёздность"}</Label>
          <Chips dark={dark} options={["★","★★","★★★","★★★★","★★★★★"]} value={data.stars} onChange={v => u({ stars: v })} color="#FFB400" />
        </div>)}
        {step === 2 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 16px" }}>✅ {lang === "uz" ? "Qulayliklar" : "Удобства"}</h3>
          <Toggle dark={dark} label="🍳 Nonushta" value={!!data.breakfast} onChange={v => u({ breakfast: v })} />
          <Toggle dark={dark} label="📶 Wi-Fi" value={!!data.wifi} onChange={v => u({ wifi: v })} />
          <Toggle dark={dark} label="🚗 Avtoturargoh" value={!!data.parking} onChange={v => u({ parking: v })} />
          <Toggle dark={dark} label="🏊 Basseyn" value={!!data.pool} onChange={v => u({ pool: v })} />
          <Toggle dark={dark} label="❄️ Konditsioner" value={!!data.ac} onChange={v => u({ ac: v })} />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="350 000" priceLabel={lang === "uz" ? "Bir tunlik narxi (so'm)" : "Цена за ночь (сум)"} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}


// =====================================================
// 🔧 TA'MIRLASH  |  🧸 BOLALAR  |  🏥 TIBBIYOT
// =====================================================
const REPAIR_TYPES = { uz: ["Telefon ta'mirlash","Noutbuk ta'mirlash","Maishiy texnika","Eshik-deraza","Mebel ta'mirlash","Santexnika","Elektr ishlari","Avtomobil ta'miri","Velosiped ta'miri","Boshqa"], ru: ["Ремонт телефонов","Ремонт ноутбуков","Бытовая техника","Двери/Окна","Ремонт мебели","Сантехника","Электрика","Ремонт авто","Ремонт велосипеда","Другое"] };
const KIDS_TYPES = { uz: ["Kiyim","O'yinchoqlar","Kitoblar","Arava","Maktab buyumlari","Ovqat","Sport","Yotoq","Boshqa"], ru: ["Одежда","Игрушки","Книги","Коляска","Школьные товары","Питание","Спорт","Кроватка","Другое"] };
const MEDICAL_TYPES = { uz: ["Terapevt","Stomatolog","Ko'z shifokori","Kardiolog","Nevropatolog","Jarroh","Dermatolog","Ginekolog","Otorinolaringolog","Ortoped","Laboratoriya","UZI","Boshqa"], ru: ["Терапевт","Стоматолог","Офтальмолог","Кардиолог","Невролог","Хирург","Дерматолог","Гинеколог","Отоларинголог","Ортопед","Лаборатория","УЗИ","Другое"] };
const KIDS_AGES = { uz: ["0-1 yosh","1-3 yosh","3-7 yosh","7-12 yosh","12+ yosh"], ru: ["0-1 год","1-3 года","3-7 лет","7-12 лет","12+ лет"] };

export function RepairForm(props) { return <SimpleForm {...props} catLabel="🔧 Ta'mirlash" types={REPAIR_TYPES} color="#5758BB" pricePlaceholder="80 000" />; }

export function KidsForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Tur","Ma'lumot","Narx","Manzil"] : ["Тип","Инфо","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.catType;
    if (s === 2) return !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🧸 {lang === "uz" ? "Kategoriya" : "Категория"}</h3>
          <Chips dark={dark} options={KIDS_TYPES[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#FDA7DF" />
          <Label dark={dark}>{lang === "uz" ? "Yosh guruhi" : "Возраст"}</Label>
          <Chips dark={dark} options={KIDS_AGES[lang]} value={data.ageGroup} onChange={v => u({ ageGroup: v })} color="#E84393" />
        </div>)}
        {step === 2 && (<div>
          <Label dark={dark} required>{lang === "uz" ? "Nomi" : "Название"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder="..." />
          <Label dark={dark}>{lang === "uz" ? "Holati" : "Состояние"}</Label>
          <Chips dark={dark} options={CONDITION_LIST[lang]} value={data.condition} onChange={v => u({ condition: v })} color="#FDA7DF" />
          <Label dark={dark}>{lang === "uz" ? "Tavsif" : "Описание"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}

export function MedicalForm({ lang, dark, data, onChange, onSubmit, onBack }) {
  const th = L(dark);
  const u = p => onChange({ ...data, ...p });
  const steps = lang === "uz" ? ["Mutaxassis","Ma'lumot","Narx","Manzil"] : ["Специалист","Инфо","Цена","Адрес"];
  const canNext = s => {
    if (s === 1) return !!data.catType;
    if (s === 2) return !!data.name;
    if (s === 3) return !!data.originalPrice;
    return true;
  };
  return (
    <MultiStepForm steps={steps} lang={lang} dark={dark} canNext={canNext} onBack={onBack} onSubmit={onSubmit} data={data}>
      {step => (<>
        {step === 1 && (<div>
          <h3 style={{ fontWeight: 800, color: th.text, margin: "0 0 6px" }}>🏥 {lang === "uz" ? "Mutaxassisni tanlang" : "Выберите специалиста"}</h3>
          <Chips dark={dark} options={MEDICAL_TYPES[lang]} value={data.catType} onChange={v => u({ catType: v })} color="#ED4C67" />
        </div>)}
        {step === 2 && (<div>
          <Label dark={dark} required>{lang === "uz" ? "Klinika / Shifokor nomi" : "Клиника / Врач"}</Label>
          <Input dark={dark} value={data.name || ""} onChange={e => u({ name: e.target.value })} placeholder={lang === "uz" ? "Masalan: Dr. Aliyev Ahmad" : "Напр: Др. Алиев Ахмад"} />
          <Label dark={dark}>{lang === "uz" ? "Ish vaqti" : "Часы приёма"}</Label>
          <Input dark={dark} value={data.workTime || ""} onChange={e => u({ workTime: e.target.value })} placeholder="09:00 – 18:00" />
          <Label dark={dark}>{lang === "uz" ? "Tajriba" : "Опыт"}</Label>
          <Input dark={dark} value={data.experience || ""} onChange={e => u({ experience: e.target.value })} placeholder={lang === "uz" ? "10 yil" : "10 лет"} />
          <Label dark={dark}>{lang === "uz" ? "Tavsif / Ixtisoslik" : "Описание / Специализация"}</Label>
          <Textarea dark={dark} value={data.description || ""} onChange={e => u({ description: e.target.value })} placeholder="..." />
          <Toggle dark={dark} label={lang === "uz" ? "🏠 Uyga borish xizmati" : "🏠 Выезд на дом"} value={!!data.homeVisit} onChange={v => u({ homeVisit: v })} />
          <PhotosUploader dark={dark} lang={lang} photos={data.photos || []} onChange={photos => u({ photos })} />
        </div>)}
        {step === 3 && <PriceStep lang={lang} dark={dark} data={data} onChange={onChange} pricePlaceholder="100 000" priceLabel={lang === "uz" ? "Bitta qabul narxi (so'm)" : "Цена приёма (сум)"} />}
        {step === 4 && <ContactMapStep lang={lang} dark={dark} data={data} onChange={onChange} />}
      </>)}
    </MultiStepForm>
  );
}


// =====================================================
// 🎮 O'YIN-KULGI  |  🐾 UY HAYVONLARI  |  🧹 TOZALASH
// =====================================================
const ENTERTAIN_TYPES = { uz: ["Kinoteatr","O'yin markazi","Karaoke","Bowling","Quest room","Akvapark","Tsirk","Kontsert","Laser tag","Paintball","Boshqa"], ru: ["Кинотеатр","Игровой центр","Караоке","Боулинг","Квест","Аквапарк","Цирк","Концерт","Лазертаг","Пейнтбол","Другое"] };
const PET_TYPES = { uz: ["It","Mushuk","Quyon","Parrandalar","Baliqlar","Veterinar","Oziq-ovqat","Aksessuarlar","Grooming","Boshqa"], ru: ["Собака","Кошка","Кролик","Птицы","Рыбы","Ветеринар","Корма","Аксессуары","Груминг","Другое"] };
const CLEAN_TYPES = { uz: ["Kvartira","Ofis","Oyna","Gilam","Mebel tozalash","Avtomobil","Qurilishdan keyin","Boshqa"], ru: ["Квартира","Офис","Окна","Ковры","Химчистка мебели","Автомойка","После ремонта","Другое"] };

export function EntertainmentForm(props) { return <SimpleForm {...props} catLabel="🎮 O'yin-kulgi" types={ENTERTAIN_TYPES} color="#9980FA" pricePlaceholder="50 000" />; }
export function PetForm(props) { return <SimpleForm {...props} catLabel="🐾 Uy hayvonlari" types={PET_TYPES} color="#D980FA" pricePlaceholder="80 000" />; }
export function CleaningForm(props) { return <SimpleForm {...props} catLabel="🧹 Tozalash" types={CLEAN_TYPES} color="#C4E538" pricePlaceholder="200 000" />; }

// =====================================================
// 🎯 DYNAMIC CATEGORY FORM — asosiy dispatcher
// =====================================================
export default function DynamicCategoryForm({ category, lang, dark, data, onChange, onSubmit, onBack }) {
  const props = { lang, dark, data, onChange, onSubmit, onBack };
  switch (category) {
    case "auto":          return <AutoForm {...props} />;
    case "food":          return <FoodForm {...props} />;
    case "clothing":      return <ClothingForm {...props} />;
    case "electronics":   return <ElectronicsForm {...props} />;
    case "beauty":        return <BeautyForm {...props} />;
    case "restaurant":    return <RestaurantForm {...props} />;
    case "home_cat":      return <HomeCatForm {...props} />;
    case "sport":         return <SportForm {...props} />;
    case "services":      return <ServicesForm {...props} />;
    case "pharmacy":      return <PharmacyForm {...props} />;
    case "education":     return <EducationForm {...props} />;
    case "hotel":         return <HotelForm {...props} />;
    case "repair":        return <RepairForm {...props} />;
    case "kids":          return <KidsForm {...props} />;
    case "medical":       return <MedicalForm {...props} />;
    case "entertainment": return <EntertainmentForm {...props} />;
    case "pet":           return <PetForm {...props} />;
    case "cleaning":      return <CleaningForm {...props} />;
    default:              return <SimpleForm {...props} catLabel="📦 Boshqa" types={{ uz: ["Boshqa"], ru: ["Другое"] }} color="#16A34A" pricePlaceholder="100 000" />;
  }
}
