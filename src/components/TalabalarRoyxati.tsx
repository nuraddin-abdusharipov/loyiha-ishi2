import { useState, useMemo } from "react";
import TalabaElement from "./TalabaElement";
import type { Talaba, SortTuri } from "../types";

interface TalabalarRoyxatiProps {
  talabalar: Talaba[];
  tahrirlashBoshlash: (talaba: Talaba) => void;
  ochirish: (id: number) => void;
  aktivToggle: (id: number) => void;
}

const TalabalarRoyxati: React.FC<TalabalarRoyxatiProps> = ({
  talabalar,
  tahrirlashBoshlash,
  ochirish,
  aktivToggle,
}) => {
  // Qidiruv holati
  const [qidiruv, setQidiruv] = useState<string>("");
  
  // Saralash holati
  const [sortTuri, setSortTuri] = useState<SortTuri>("ism");
  
  // Filter holati
  const [faqatAktiv, setFaqatAktiv] = useState<boolean>(false);

  // ==========================================
  // useMemo — filterlangan va saralangan ro'yxat
  // Faqat bog'liq o'zgaruvchilar o'zgarganda qayta hisoblanadi
  // ==========================================
  const filterlangan = useMemo((): Talaba[] => {
    return talabalar
      // 1. Qidiruv bo'yicha filter
      .filter((t) => {
        const toliqIsm = `${t.ism} ${t.familiya}`.toLowerCase();
        const qidiruvMatni = qidiruv.toLowerCase();
        return (
          toliqIsm.includes(qidiruvMatni) ||
          t.guruh.toLowerCase().includes(qidiruvMatni)
        );
      })
      // 2. Aktiv filter
      .filter((t) => !faqatAktiv || t.aktiv)
      // 3. Saralash
      .sort((a, b) => {
        switch (sortTuri) {
          case "ism":
            return a.ism.localeCompare(b.ism); // Alfavit bo'yicha
          case "yosh":
            return a.yosh - b.yosh;            // Yoshdan kichikka
          case "baho":
            return b.baho - a.baho;            // Bahosi kattadan kichikka
          case "guruh":
            return a.guruh.localeCompare(b.guruh);
          default:
            return 0;
        }
      });
  }, [talabalar, qidiruv, sortTuri, faqatAktiv]);

  // Statistika
  const statistika = useMemo(() => ({
    jami: talabalar.length,
    aktiv: talabalar.filter((t) => t.aktiv).length,
    ortachaBaho: talabalar.length
      ? (talabalar.reduce((s, t) => s + t.baho, 0) / talabalar.length).toFixed(2)
      : "0.00",
  }), [talabalar]);

  return (
    <div className="royxat-konteyner">
      {/* STATISTIKA */}
      <div className="statistika">
        <div className="stat-karta">
          <span className="stat-raqam">{statistika.jami}</span>
          <span className="stat-nom">Jami talaba</span>
        </div>
        <div className="stat-karta">
          <span className="stat-raqam">{statistika.aktiv}</span>
          <span className="stat-nom">Aktiv</span>
        </div>
        <div className="stat-karta">
          <span className="stat-raqam">{statistika.ortachaBaho}</span>
          <span className="stat-nom">O'rtacha baho</span>
        </div>
      </div>

      {/* FILTER VA SARALASH */}
      <div className="filter-saralash">
        {/* Qidiruv */}
        <input
          type="text"
          placeholder="🔍 Ism yoki guruh bo'yicha qidiring..."
          value={qidiruv}
          onChange={(e) => setQidiruv(e.target.value)}
          className="qidiruv-input"
        />

        {/* Saralash */}
        <select
          value={sortTuri}
          onChange={(e) => setSortTuri(e.target.value as SortTuri)}
          // "as SortTuri" — string ni SortTuri ga o'tkazish (type assertion)
          className="sort-select"
        >
          <option value="ism">Ism bo'yicha</option>
          <option value="yosh">Yosh bo'yicha</option>
          <option value="baho">Baho bo'yicha</option>
          <option value="guruh">Guruh bo'yicha</option>
        </select>

        {/* Aktiv filter */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={faqatAktiv}
            onChange={(e) => setFaqatAktiv(e.target.checked)}
          />
          Faqat aktiv
        </label>
      </div>

      {/* RO'YXAT */}
      {filterlangan.length === 0 ? (
        <div className="bosh-holat">
          <p>😔 Talaba topilmadi</p>
          {qidiruv && (
            <button onClick={() => setQidiruv("")}>Filtrni tozalash</button>
          )}
        </div>
      ) : (
        <div className="talabalar-royxati">
          <p className="topilgan-son">
            {filterlangan.length} ta talaba topildi
          </p>
          {filterlangan.map((talaba) => (
            <TalabaElement
              key={talaba.id}                    // React uchun unikal kalit
              talaba={talaba}
              tahrirlashBoshlash={tahrirlashBoshlash}
              ochirish={ochirish}
              aktivToggle={aktivToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TalabalarRoyxati;