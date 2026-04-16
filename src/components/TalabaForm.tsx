import { useState, useEffect } from "react";
import type { Talaba, TalabaFormMalumot, FormXatolar } from "../types";

// ==========================================
// PROPS INTERFEYSI
// ==========================================
interface TalabaFormProps {
  // tahrirlashTalaba bo'lsa — tahrirlash rejimi, null bo'lsa — qo'shish rejimi
  tahrirlashTalaba: Talaba | null;
  
  // Qo'shganda chaqiriladigan funksiya (id siz, chunki id avtomatik yaratiladi)
  qoshish: (malumot: Omit<Talaba, "id">) => void;
  //                  ^^^^^^^^^^^^^^^^^^^^
  //                  Omit<Talaba, "id"> = Talaba dan "id" ni chiqarib tashlash
  
  // Tahrirlashda chaqiriladigan funksiya
  tahrirlash: (id: number, malumot: Omit<Talaba, "id">) => void;
  
  // Bekor qilish
  bekorQilish: () => void;
}

// ==========================================
// BOSHLANG'ICH FORM QIYMATI
// ==========================================
const boshlangichForm: TalabaFormMalumot = {
  ism: "",
  familiya: "",
  yosh: "",
  guruh: "",
  baho: "",
};

const TalabaForm: React.FC<TalabaFormProps> = ({
  tahrirlashTalaba,
  qoshish,
  tahrirlash,
  bekorQilish,
}) => {
  const [form, setForm] = useState<TalabaFormMalumot>(boshlangichForm);
  const [xatolar, setXatolar] = useState<FormXatolar>({});

  // ==========================================
  // TAHRIRLASH REJIMI: mavjud talaba ma'lumotlarini formga yuklash
  // useEffect — tahrirlashTalaba o'zgarganda ishga tushadi
  // ==========================================
  useEffect(() => {
    if (tahrirlashTalaba) {
      // Talabaning mavjud ma'lumotlarini formga solish
      setForm({
        ism: tahrirlashTalaba.ism,
        familiya: tahrirlashTalaba.familiya,
        yosh: String(tahrirlashTalaba.yosh),    // number → string
        guruh: tahrirlashTalaba.guruh,
        baho: String(tahrirlashTalaba.baho),    // number → string
      });
    } else {
      // Qo'shish rejimi: formni tozalash
      setForm(boshlangichForm);
    }
  }, [tahrirlashTalaba]); // tahrirlashTalaba o'zgarganda ishga tushadi

  // ==========================================
  // UNIVERSAL INPUT HANDLER
  // ==========================================
  const ozgartirish = (
    key: keyof TalabaFormMalumot
  ) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setForm({ ...form, [key]: event.target.value });
    // Xatoni tozalash
    if (xatolar[key]) {
      setXatolar({ ...xatolar, [key]: undefined });
    }
  };

  // ==========================================
  // VALIDATSIYA
  // ==========================================
  const tekshir = (): boolean => {
    const yangiXatolar: FormXatolar = {};

    if (!form.ism.trim()) yangiXatolar.ism = "Ism kiritilishi shart";
    if (!form.familiya.trim()) yangiXatolar.familiya = "Familiya kiritilishi shart";

    const yosh = Number(form.yosh);
    if (!form.yosh || isNaN(yosh) || yosh < 16 || yosh > 60) {
      yangiXatolar.yosh = "Yosh 16 dan 60 gacha bo'lishi kerak";
    }

    if (!form.guruh.trim()) yangiXatolar.guruh = "Guruh kiritilishi shart";

    const baho = Number(form.baho);
    if (!form.baho || isNaN(baho) || baho < 1 || baho > 5) {
      yangiXatolar.baho = "Baho 1 dan 5 gacha bo'lishi kerak";
    }

    setXatolar(yangiXatolar);
    return Object.keys(yangiXatolar).length === 0;
  };

  // ==========================================
  // FORM YUBORISH
  // ==========================================
  const yuborish = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!tekshir()) return; // Validatsiya o'tmasa — to'xtatamiz

    // string → number ga o'giramiz
    const malumot: Omit<Talaba, "id"> = {
      ism: form.ism.trim(),
      familiya: form.familiya.trim(),
      yosh: Number(form.yosh),
      guruh: form.guruh.trim(),
      baho: Number(form.baho),
      aktiv: true,
    };

    if (tahrirlashTalaba) {
      // Tahrirlash
      tahrirlash(tahrirlashTalaba.id, malumot);
    } else {
      // Qo'shish
      qoshish(malumot);
    }

    setForm(boshlangichForm);
  };

  // Tahrirlash yoki qo'shish rejimini aniqlaymiz
  const sarlavha = tahrirlashTalaba ? "✏️ Talabani tahrirlash" : "➕ Yangi talaba qo'shish";

  return (
    <div className="form-konteyner">
      <h2>{sarlavha}</h2>

      <form onSubmit={yuborish}>
        {/* ISM */}
        <div className="form-maydon">
          <label htmlFor="ism">Ism:</label>
          <input
            id="ism"
            type="text"
            value={form.ism}
            onChange={ozgartirish("ism")}
            placeholder="Ismni kiriting"
            className={xatolar.ism ? "xato" : ""}
          />
          {xatolar.ism && <span className="xato-matn">{xatolar.ism}</span>}
        </div>

        {/* FAMILIYA */}
        <div className="form-maydon">
          <label htmlFor="familiya">Familiya:</label>
          <input
            id="familiya"
            type="text"
            value={form.familiya}
            onChange={ozgartirish("familiya")}
            placeholder="Familiyani kiriting"
            className={xatolar.familiya ? "xato" : ""}
          />
          {xatolar.familiya && <span className="xato-matn">{xatolar.familiya}</span>}
        </div>

        {/* YOSH */}
        <div className="form-maydon">
          <label htmlFor="yosh">Yosh:</label>
          <input
            id="yosh"
            type="number"
            value={form.yosh}
            onChange={ozgartirish("yosh")}
            placeholder="Yoshni kiriting"
            min={16}
            max={60}
            className={xatolar.yosh ? "xato" : ""}
          />
          {xatolar.yosh && <span className="xato-matn">{xatolar.yosh}</span>}
        </div>

        {/* GURUH */}
        <div className="form-maydon">
          <label htmlFor="guruh">Guruh:</label>
          <input
            id="guruh"
            type="text"
            value={form.guruh}
            onChange={ozgartirish("guruh")}
            placeholder="Masalan: CS-101"
            className={xatolar.guruh ? "xato" : ""}
          />
          {xatolar.guruh && <span className="xato-matn">{xatolar.guruh}</span>}
        </div>

        {/* BAHO */}
        <div className="form-maydon">
          <label htmlFor="baho">O'rtacha baho (1-5):</label>
          <input
            id="baho"
            type="number"
            value={form.baho}
            onChange={ozgartirish("baho")}
            placeholder="1 dan 5 gacha"
            min={1}
            max={5}
            step={0.1}
            className={xatolar.baho ? "xato" : ""}
          />
          {xatolar.baho && <span className="xato-matn">{xatolar.baho}</span>}
        </div>

        {/* TUGMALAR */}
        <div className="form-tugmalar">
          <button type="submit" className="saqlash-btn">
            {tahrirlashTalaba ? "💾 Saqlash" : "➕ Qo'shish"}
          </button>
          <button type="button" className="bekor-btn" onClick={bekorQilish}>
            ❌ Bekor qilish
          </button>
        </div>
      </form>
    </div>
  );
};

export default TalabaForm;