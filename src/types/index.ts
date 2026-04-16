export interface Talaba {
  id: number;          // Unikal identifikator
  ism: string;         // Talabaning ismi
  familiya: string;    // Talabaning familiyasi
  yosh: number;        // Yoshi
  guruh: string;       // Guruhi (masalan "CS-101")
  baho: number;        // O'rtacha bahosi (1-5)
  aktiv: boolean;      // Aktiv talabami?
}

// ==========================================
// FORM HOLATI TURI
// ==========================================
export interface TalabaFormMalumot {
  ism: string;
  familiya: string;
  yosh: string;        // Input string qaytaradi, keyin number ga o'giramiz
  guruh: string;
  baho: string;        // Xuddi shu sabab
}

// ==========================================
// FORM XATOLARI TURI
// ==========================================
export interface FormXatolar {
  ism?: string;     
  familiya?: string;
  yosh?: string;
  guruh?: string;
  baho?: string;
}

// ==========================================
// SORT TURI — saralash uchun
// ==========================================
export type SortTuri = "ism" | "yosh" | "baho" | "guruh";
//          ^^^^^^^
//          "type" — bu faqat qiymatlar to'plami

// ==========================================
// FILTER TURI
// ==========================================
export interface FilterMalumot {
  qidiruv: string;     // Qidiruv matni
  guruh: string;       // Guruh bo'yicha filter
  aktiv: boolean | null; 
}