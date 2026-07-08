import { useState, useRef } from "react";
import { theme } from "../theme.js";
import { T, CATEGORIES } from "../translations.js";
import { formatPrice, DEMO_LISTINGS } from "../utils.js";

const G = "#16A34A";

// AI rasm tahlili (simulyatsiya)
function analyzeImage(imageDataUrl) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Tasodifiy kategoriya va ma'lumot (real da ML model ishlaydi)
      const cats = CATEGORIES;
      const cat = cats[Math.floor(Math.random() * cats.length)];
      const similar = DEMO_LISTINGS.filter(l => l.category === cat.id);
      const avgPrice = similar.length
        ? Math.round(similar.reduce((s, l) => s + (l.price > 0 ? l.price : 0), 0) / similar.length)
        : 500000;

      const suggestions = {
        uz: {
          electronics: ["Smartfon", "Noutbuk", "Planshet", "Quloqchin"],
          clothing:    ["Ko'ylak", "Shim", "Kurtka", "Poyabzal"],
          vehicles:    ["Chevrolet", "Toyota", "Hyundai", "BMW"],
          realEstate:  ["2 xonali kvartira", "3 xonali uy", "Ofis"],
          jobs:        ["Dasturchi", "Dizayner", "Menejer"],
          homeGoods:   ["Divan", "Stol", "Shkaf", "Televizor"],
          default:     ["Mahsulot", "Tovar", "Buyum"],
        },
        ru: {
          electronics: ["Смартфон", "Ноутбук", "Планшет", "Наушники"],
          clothing:    ["Рубашка", "Брюки", "Куртка", "Обувь"],
          vehicles:    ["Chevrolet", "Toyota", "Hyundai", "BMW"],
          realEstate:  ["2-комн. квартира", "3-комн. дом", "Офис"],
          jobs:        ["Программист", "Дизайнер", "Менеджер"],
          homeGoods:   ["Диван", "Стол", "Шкаф", "Телевизор"],
          default:     ["Товар", "Изделие", "Предмет"],
        },
      };

      resolve({
        category: cat.id,
        categoryEmoji: cat.emoji,
        categoryColor: cat.color,
        confidence: Math.floor(Math.random() * 20 + 78), // 78-98%
        suggestedTitles: {
          uz: (suggestions.uz[cat.id] || suggestions.uz.default).slice(0, 3),
          ru: (suggestions.ru[cat.id] || suggestions.ru.default).slice(0, 3),
        },
        suggestedPrice: {
          min: Math.round(avgPrice * 0.7),
          max: Math.round(avgPrice * 1.3),
          avg: avgPrice,
        },
        tags: {
          uz: ["Sifatli", "Yangi", "Arzon", "Yaxshi holat"].slice(0, 3),
          ru: ["Качественный", "Новый", "Недорого", "Хорошее состояние"].slice(0, 3),
        },
        similarCount: similar.length,
      });
    }, 1800);
  });
}

export function AIImageAnalyzer({ lang, dark, onResult }) {
  const th = theme(dark);
  const tx = T[lang];
  const fileRef = useRef(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      setAnalyzing(true);
      const res = await analyzeImage(dataUrl);
      setResult(res);
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleApply = (title) => {
    onResult?.({
      photo: preview,
      category: result.category,
      title,
      suggestedPrice: result.suggestedPrice.avg,
      tags: result.tags[lang],
    });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Upload area */}
      {!preview && (
        <button onClick={() => fileRef.current?.click()} style={{
          width: "100%", padding: "24px", borderRadius: 16,
          border: `2px dashed ${G}`, background: G + "08",
          cursor: "pointer", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: G + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🤖</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: G }}>
            {lang === "uz" ? "AI bilan rasm tahlil qiling" : "Анализировать фото с AI"}
          </div>
          <div style={{ fontSize: 12, color: th.sub, textAlign: "center", lineHeight: 1.5 }}>
            {lang === "uz"
              ? "Rasm yuklang — AI kategoriya, sarlavha va narxni taklif qiladi"
              : "Загрузите фото — AI предложит категорию, заголовок и цену"}
          </div>
          <div style={{ background: G, color: "#fff", padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
            📷 {lang === "uz" ? "Rasm tanlash" : "Выбрать фото"}
          </div>
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />

      {/* Preview + analyzing */}
      {preview && (
        <div>
          <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", marginBottom: 12 }}>
            <img src={preview} alt="" style={{ width: "100%", height: 200, objectFit: "cover" }} />
            {analyzing && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, border: `3px solid ${G}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>
                  🤖 {lang === "uz" ? "AI tahlil qilmoqda..." : "AI анализирует..."}
                </div>
              </div>
            )}
          </div>

          {result && !analyzing && (
            <div>
              {/* Kategoriya */}
              <div style={{ background: result.categoryColor + "15", borderRadius: 14, padding: "14px 16px", marginBottom: 12, border: `1px solid ${result.categoryColor}30` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{result.categoryEmoji}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: result.categoryColor }}>
                        {lang === "uz" ? "Kategoriya aniqlandi" : "Категория определена"}
                      </div>
                      <div style={{ fontSize: 12, color: th.sub }}>
                        {lang === "uz" ? `${result.similarCount} o'xshash e'lon` : `${result.similarCount} похожих объявлений`}
                      </div>
                    </div>
                  </div>
                  <div style={{ background: result.categoryColor + "20", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: result.categoryColor }}>
                    {result.confidence}%
                  </div>
                </div>
              </div>

              {/* Sarlavha tavsiylari */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: th.sub, marginBottom: 8 }}>
                  🏷️ {lang === "uz" ? "Sarlavha tavsiyalari (bosing)" : "Предложения заголовков (нажмите)"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {result.suggestedTitles[lang].map((t, i) => (
                    <button key={i} onClick={() => handleApply(t)} style={{
                      padding: "8px 14px", borderRadius: 20, background: G + "15",
                      border: `1.5px solid ${G}40`, color: G, fontWeight: 600,
                      fontSize: 13, cursor: "pointer",
                    }}>
                      {t} →
                    </button>
                  ))}
                </div>
              </div>

              {/* Narx tavsiyasi */}
              <div style={{ background: th.card2, borderRadius: 12, padding: "12px 16px", marginBottom: 12, border: `1px solid ${th.border}` }}>
                <div style={{ fontSize: 12, color: th.sub, marginBottom: 8 }}>
                  💰 {lang === "uz" ? "Tavsiya narx diapazoni" : "Рекомендуемый ценовой диапазон"}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: th.sub }}>{lang === "uz" ? "Min" : "Мин"}</div>
                    <div style={{ fontWeight: 700, color: th.text, fontSize: 14 }}>
                      {formatPrice(result.suggestedPrice.min)}
                    </div>
                  </div>
                  <div style={{ flex: 1, height: 3, background: `linear-gradient(to right, #3B82F6, ${G}, #EF4444)`, borderRadius: 2, margin: "0 10px" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: th.sub }}>{lang === "uz" ? "Max" : "Макс"}</div>
                    <div style={{ fontWeight: 700, color: th.text, fontSize: 14 }}>
                      {formatPrice(result.suggestedPrice.max)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: 6 }}>
                  <span style={{ fontSize: 11, color: th.sub }}>
                    {lang === "uz" ? "O'rtacha: " : "Среднее: "}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: G }}>
                    {formatPrice(result.suggestedPrice.avg)} {lang === "uz" ? "so'm" : "сум"}
                  </span>
                </div>
              </div>

              {/* Taglar */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {result.tags[lang].map((tag, i) => (
                  <span key={i} style={{ background: th.card2, border: `1px solid ${th.border}`, borderRadius: 12, padding: "4px 10px", fontSize: 11, color: th.text2 }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <button onClick={() => { setPreview(null); setResult(null); }} style={{
                background: "none", border: "none", color: th.sub,
                fontSize: 13, cursor: "pointer", textDecoration: "underline",
              }}>
                🔄 {lang === "uz" ? "Boshqa rasm" : "Другое фото"}
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
