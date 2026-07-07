import { useState, useRef } from "react";
import { theme } from "../theme.js";

// ── MODAL SHEET ───────────────────────────────────────
export function ModalSheet({ children, onClose, dark, maxH = "90vh", title }) {
  const th = theme(dark);
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
      zIndex:400, display:"flex", alignItems:"flex-end",
      justifyContent:"center", maxWidth:430, margin:"0 auto",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background:th.card, borderRadius:"20px 20px 0 0",
        width:"100%", maxHeight:maxH, overflowY:"auto",
        padding:"0 0 32px", boxSizing:"border-box",
      }}>
        <div style={{ width:36, height:4, background:th.border2, borderRadius:2, margin:"12px auto 0" }} />
        {title && (
          <div style={{ padding:"14px 20px 0", fontSize:16, fontWeight:700, color:th.text }}>{title}</div>
        )}
        <div style={{ padding:"16px 20px 0" }}>{children}</div>
      </div>
    </div>
  );
}

// ── INPUT ─────────────────────────────────────────────
export function Input({ value, onChange, placeholder, type="text", dark, style={}, label, required, multiline, rows=3 }) {
  const th = theme(dark);
  const base = {
    width:"100%", padding:"13px 16px", borderRadius:12,
    border:`1.5px solid ${th.border2}`, background:th.card,
    fontSize:15, outline:"none", color:th.text,
    boxSizing:"border-box", fontFamily:"inherit",
  };
  return (
    <div style={{ marginBottom:16 }}>
      {label && (
        <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:6 }}>
          {label}{required && <span style={{ color:"#E74C3C", marginLeft:3 }}>*</span>}
        </label>
      )}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
            style={{ ...base, minHeight:90, resize:"vertical", ...style }} />
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            style={{ ...base, ...style }} />
      }
    </div>
  );
}

// ── BUTTON ────────────────────────────────────────────
export function Btn({ children, onClick, variant="primary", disabled, style={}, dark, small }) {
  const th = theme(dark);
  const variants = {
    primary:  { bg:"#5B2D8E", color:"#fff", border:"none" },
    outline:  { bg:"transparent", color:"#5B2D8E", border:"1.5px solid #5B2D8E" },
    ghost:    { bg:th.card2, color:th.text, border:`1.5px solid ${th.border}` },
    danger:   { bg:"#E74C3C", color:"#fff", border:"none" },
    success:  { bg:"#27AE60", color:"#fff", border:"none" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", padding: small ? "10px 16px" : "14px 20px",
      borderRadius:12, fontWeight:700, fontSize: small ? 13 : 15,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1, transition:"opacity 0.2s",
      background: v.bg, color: v.color, border: v.border,
      ...style,
    }}>{children}</button>
  );
}

// ── CHIP ──────────────────────────────────────────────
export function Chip({ label, active, onClick, color="#5B2D8E", dark }) {
  const th = theme(dark);
  return (
    <button onClick={onClick} style={{
      padding:"7px 14px", borderRadius:20, fontSize:13, fontWeight:600,
      cursor:"pointer", transition:"all 0.15s",
      background: active ? color : th.card2,
      color: active ? "#fff" : th.text2,
      border: active ? `2px solid ${color}` : `2px solid ${th.border}`,
      whiteSpace:"nowrap",
    }}>{label}</button>
  );
}

// ── TOGGLE ────────────────────────────────────────────
export function Toggle({ value, onChange, label, dark }) {
  const th = theme(dark);
  return (
    <div onClick={() => onChange(!value)} style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"12px 16px", background:th.card2, borderRadius:12,
      marginBottom:12, cursor:"pointer", border:`1px solid ${th.border}`,
    }}>
      <span style={{ fontSize:14, color:th.text }}>{label}</span>
      <div style={{
        width:44, height:24, borderRadius:12, position:"relative",
        background: value ? "#5B2D8E" : th.border2, transition:"background 0.2s",
      }}>
        <div style={{
          position:"absolute", top:3, left: value ? 22 : 3,
          width:18, height:18, borderRadius:9,
          background:"#fff", transition:"left 0.2s",
          boxShadow:"0 1px 4px rgba(0,0,0,0.2)",
        }} />
      </div>
    </div>
  );
}

// ── STAR RATING ───────────────────────────────────────
export function Stars({ value, onChange, size=20, readOnly=false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:3 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          onClick={() => !readOnly && onChange?.(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
          style={{
            fontSize:size, lineHeight:1, cursor:readOnly?"default":"pointer",
            color: n <= (hover || value) ? "#F39C12" : "#DDDDDD",
          }}>★</span>
      ))}
    </div>
  );
}

// ── PHOTO UPLOADER ────────────────────────────────────
export function PhotoUploader({ photos, onChange, dark, max=8 }) {
  const th = theme(dark);
  const ref_ = useRef(null);
  const handle = (e) => {
    Array.from(e.target.files || []).slice(0, max - photos.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => onChange([...photos, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
      {photos.map((src, i) => (
        <div key={i} style={{ position:"relative", width:80, height:80, borderRadius:10, overflow:"hidden", flexShrink:0 }}>
          <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
          <button onClick={() => onChange(photos.filter((_,j) => j !== i))} style={{
            position:"absolute", top:3, right:3, width:20, height:20,
            background:"rgba(0,0,0,0.6)", border:"none", borderRadius:6,
            color:"#fff", fontSize:11, cursor:"pointer", display:"flex",
            alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>
      ))}
      {photos.length < max && (
        <button onClick={() => ref_.current?.click()} style={{
          width:80, height:80, borderRadius:10, border:`2px dashed ${th.border2}`,
          background:th.card2, color:th.sub, fontSize:24, cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", gap:3,
        }}>
          <span style={{ fontSize:22 }}>📷</span>
          <span style={{ fontSize:9, color:th.sub }}>+</span>
        </button>
      )}
      <input ref={ref_} type="file" accept="image/*" multiple onChange={handle} style={{ display:"none" }} />
    </div>
  );
}

// ── BADGE ─────────────────────────────────────────────
export function Badge({ label, color="#5B2D8E", bg, icon }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      padding:"3px 8px", borderRadius:20, fontSize:11, fontWeight:700,
      background: bg || color + "18", color,
    }}>
      {icon && <span>{icon}</span>}{label}
    </span>
  );
}

// ── DIVIDER ───────────────────────────────────────────
export function Divider({ dark, my=16 }) {
  const th = theme(dark);
  return <div style={{ height:1, background:th.border, margin:`${my}px 0` }} />;
}

// ── SKELETON ──────────────────────────────────────────
export function Skeleton({ w="100%", h=16, r=8, dark }) {
  const th = theme(dark);
  return (
    <div style={{
      width:w, height:h, borderRadius:r,
      background:`linear-gradient(90deg,${th.card2} 25%,${th.card3} 50%,${th.card2} 75%)`,
      backgroundSize:"200% 100%",
      animation:"shimmer 1.4s infinite",
    }} />
  );
}

// ── SELECT DROPDOWN ───────────────────────────────────
export function Select({ value, onChange, options, placeholder, dark, label }) {
  const th = theme(dark);
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ fontSize:13, fontWeight:600, color:th.text2, display:"block", marginBottom:6 }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width:"100%", padding:"13px 16px", borderRadius:12, fontSize:15,
        border:`1.5px solid ${th.border2}`, background:th.card, color:value ? th.text : th.sub,
        outline:"none", boxSizing:"border-box", appearance:"none",
      }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value || o} value={o.value || o}>{o.label || o}</option>
        ))}
      </select>
    </div>
  );
}

// ── TOAST NOTIFICATION ────────────────────────────────
export function Toast({ message, type="success", onHide }) {
  const colors = { success:"#27AE60", error:"#E74C3C", info:"#2980B9" };
  return (
    <div style={{
      position:"fixed", top:60, left:"50%", transform:"translateX(-50%)",
      background: colors[type] || colors.success, color:"#fff",
      padding:"12px 20px", borderRadius:12, fontSize:14, fontWeight:600,
      zIndex:9999, maxWidth:350, textAlign:"center",
      boxShadow:"0 4px 20px rgba(0,0,0,0.25)",
      animation:"slideDown 0.3s ease",
    }}>
      {message}
    </div>
  );
}
