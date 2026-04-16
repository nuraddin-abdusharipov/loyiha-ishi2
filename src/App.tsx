import { useState } from "react";
import TalabaForm from "./components/TalabaForm";
import TalabalarRoyxati from "./components/TalabalarRoyxati";
import type { Talaba } from "./types";
import "./App.css";

// ==========================================
// NAMUNAVIY MA'LUMOTLAR
// ==========================================
const namunaData: Talaba[] = [
  { id: 1, ism: "Sardor", familiya: "Rahimov", yosh: 20, guruh: "CS-101", baho: 4.8, aktiv: true },
  { id: 2, ism: "Malika", familiya: "Yusupova", yosh: 21, guruh: "CS-101", baho: 4.2, aktiv: true },
  { id: 3, ism: "Bobur", familiya: "Nazarov", yosh: 19, guruh: "IT-201", baho: 3.5, aktiv: true },
  { id: 4, ism: "Dilnoza", familiya: "Karimova", yosh: 22, guruh: "IT-201", baho: 4.6, aktiv: false },
];

const App: React.FC = () => {
  // ==========================================
  // HOLAT (STATE)
  // ==========================================
  
  // Talabalar ro'yxati
  const [talabalar, setTalabalar] = useState<Talaba[]>(namunaData);
  
  // Tahrirlash rejimi (null = qo'shish rejimi)
  const [tahrirlashTalaba, setTahrirlashTalaba] = useState<Talaba | null>(null);
  
  // Form ko'rinishi
  const [formKorinish, setFormKorinish] = useState<boolean>(false);

  // ==========================================
  // AMALLAR
  // ==========================================

  // ID yaratish — eng katta ID + 1
  const yangiId = (): number => {
    return talabalar.length > 0
      ? Math.max(...talabalar.map((t) => t.id)) + 1
      : 1;
  };

  // Yangi talaba qo'shish
  const talabaqoshish = (malumot: Omit<Talaba, "id">): void => {
    const yangiTalaba: Talaba = {
      id: yangiId(),   // Avtomatik ID
      ...malumot,      // Qolgan ma'lumotlar
    };
    setTalabalar([...talabalar, yangiTalaba]);
    setFormKorinish(false);
  };

  // Talabani tahrirlash
  const talabaTahrirlash = (id: number, malumot: Omit<Talaba, "id">): void => {
    setTalabalar(
      talabalar.map((t) =>
        t.id === id
          ? { ...t, ...malumot }  // Mos talabani yangilash
          : t                      // Boshqalarni o'zgartirmaslik
      )
    );
    setTahrirlashTalaba(null);
    setFormKorinish(false);
  };

  // Talabani o'chirish
  const talabaOchirish = (id: number): void => {
    setTalabalar(talabalar.filter((t) => t.id !== id));
    // Agar o'chirilayotgan talaba tahrirlash rejimida bo'lsa — tozalash
    if (tahrirlashTalaba?.id === id) {
      setTahrirlashTalaba(null);
      setFormKorinish(false);
    }
  };

  // Aktiv/Passiv almashtirish
  const aktivToggle = (id: number): void => {
    setTalabalar(
      talabalar.map((t) =>
        t.id === id ? { ...t, aktiv: !t.aktiv } : t
      )
    );
  };

  // Tahrirlashni boshlash
  const tahrirlashBoshlash = (talaba: Talaba): void => {
    setTahrirlashTalaba(talaba);
    setFormKorinish(true);
    // Sahifaning yuqorisiga o'tish
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Bekor qilish
  const bekorQilish = (): void => {
    setTahrirlashTalaba(null);
    setFormKorinish(false);
  };

  return (
    <div className="app">
      {/* SARLAVHA */}
      <header className="sarlavha">
        <h1>🎓 Student Manager</h1>
        <p>TypeScript + React bilan qurilgan</p>
      </header>

      <main className="asosiy">
        {/* FORM TUGMASI */}
        {!formKorinish && (
          <button
            className="qoshish-tugma"
            onClick={() => setFormKorinish(true)}
          >
            ➕ Yangi talaba qo'shish
          </button>
        )}

        {/* FORM */}
        {formKorinish && (
          <TalabaForm
            tahrirlashTalaba={tahrirlashTalaba}
            qoshish={talabaqoshish}
            tahrirlash={talabaTahrirlash}
            bekorQilish={bekorQilish}
          />
        )}

        {/* RO'YXAT */}
        <TalabalarRoyxati
          talabalar={talabalar}
          tahrirlashBoshlash={tahrirlashBoshlash}
          ochirish={talabaOchirish}
          aktivToggle={aktivToggle}
        />
      </main>
    </div>
  );
};

export default App;