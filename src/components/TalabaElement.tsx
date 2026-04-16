import type { Talaba } from "../types";

// ==========================================
// PROPS
// ==========================================
interface TalabaElementProps {
  talaba: Talaba;
  tahrirlashBoshlash: (talaba: Talaba) => void;
  ochirish: (id: number) => void;
  aktivToggle: (id: number) => void;
}

// ==========================================
// YORDAMCHI FUNKSIYA — baho rangini aniqlash
// ==========================================
const bahoRangi = (baho: number): string => {
  if (baho >= 4.5) return "#27ae60"; // Yashil — A'lo
  if (baho >= 3.5) return "#f39c12"; // Sariq — Yaxshi
  if (baho >= 2.5) return "#e67e22"; // To'q sariq — Qoniqarli
  return "#e74c3c";                   // Qizil — Qoniqarsiz
};

const TalabaElement: React.FC<TalabaElementProps> = ({
  talaba,
  tahrirlashBoshlash,
  ochirish,
  aktivToggle,
}) => {
  // To'liq ismni birlashtirish
  const toliqIsm: string = `${talaba.ism} ${talaba.familiya}`;

  // Tasdiqlash bilan o'chirish
  const tasdiqlanganOchirish = (): void => {
    if (window.confirm(`"${toliqIsm}"ni o'chirishni tasdiqlaysizmi?`)) {
      ochirish(talaba.id);
    }
  };

  return (
    <div
      className={`talaba-element ${!talaba.aktiv ? "passiv" : ""}`}
      // Passiv talabalar uchun maxsus stil qo'shish
    >
      {/* TALABA MA'LUMOTLARI */}
      <div className="talaba-info">
        {/* Aktiv/Passiv belgisi */}
        <span
          className="aktiv-nuqta"
          style={{ backgroundColor: talaba.aktiv ? "#27ae60" : "#e74c3c" }}
          title={talaba.aktiv ? "Aktiv" : "Passiv"}
        />

        <div>
          <h3 className="talaba-ism">{toliqIsm}</h3>
          <div className="talaba-meta">
            <span>🎓 {talaba.guruh}</span>
            <span>📅 {talaba.yosh} yosh</span>
            <span
              style={{ color: bahoRangi(talaba.baho), fontWeight: "bold" }}
            >
              ⭐ {talaba.baho.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* AMALLAR */}
      <div className="amallar">
        {/* Tahrirlash */}
        <button
          className="tahrirlash-btn"
          onClick={() => tahrirlashBoshlash(talaba)}
          title="Tahrirlash"
        >
          ✏️
        </button>

        {/* Aktiv/Passiv toggle */}
        <button
          className="toggle-btn"
          onClick={() => aktivToggle(talaba.id)}
          title={talaba.aktiv ? "Passivga o'tkazish" : "Aktivlashtirish"}
        >
          {talaba.aktiv ? "⏸️" : "▶️"}
        </button>

        {/* O'chirish */}
        <button
          className="ochirish-btn"
          onClick={tasdiqlanganOchirish}
          title="O'chirish"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TalabaElement;