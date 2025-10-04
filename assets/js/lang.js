async function loadLanguage(lang) {
  const navTexts = {
    en: {
      profile: "Profile",
      education: "Education",
      experience: "Experience",
      mainSkills: "Main Skills",
      softSkills: "Soft Skills",
      contact: "Contact",
      headerText: "Master of Computer Science<br>Seeking AI, Data Science & Embedded Systems Internship<br>6-month internship from Feb 2026"
    },
    fr: {
      profile: "Profil",
      education: "Éducation",
      experience: "Expérience",
      mainSkills: "Compétences principales",
      softSkills: "Compétences relationnelles",
      contact: "Contact",
      headerText: "Diplôme d'ingénieur en informatique<br>À la recherche d'un stage en IA, Data Science et Systèmes Embarqués<br>Stage de 6 mois dès février 2026"
    }
  };

  const sections = ["profile", "education", "experience", "mainSkills", "softSkills", "contact"];
  const main = document.getElementById("main");
  main.innerHTML = ""; // 清空 main

  // 更新 nav bar 文字
  const navItems = document.querySelectorAll("#nav ul li a");
  sections.forEach((section, index) => {
    if (navItems[index]) {
      navItems[index].textContent = navTexts[lang][section];
    }
  });

  // 更新 Header 文字
  const headerP = document.getElementById("header-text");
  if (headerP) {
    headerP.innerHTML = navTexts[lang].headerText;
  }

  // 儲存使用者選擇的語言
  localStorage.setItem("preferredLang", lang);

  // 載入 section 內容
  for (const section of sections) {
    try {
      const response = await fetch(`content/${lang}/${section}.html`);
      if (!response.ok) throw new Error(`Failed to load ${section}.html`);

      const html = await response.text();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      const sectionElement = tempDiv.firstElementChild;

      // 設定初始透明度
      sectionElement.style.opacity = 0;
      sectionElement.style.transform = "translateY(20px)";
      sectionElement.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      main.appendChild(sectionElement);

      // 觸發動畫
      requestAnimationFrame(() => {
        sectionElement.style.opacity = 1;
        sectionElement.style.transform = "translateY(0)";
      });

      // 若載入 softSkills section，初始化 gallery
      if (section === "softSkills") {
        initGallery();
        initCardOverlay(lang);
      }

    } catch (err) {
      console.error(err);
    }
  }
}

// 頁面載入時讀取 localStorage 的語言
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("preferredLang") || "fr";
  loadLanguage(savedLang);
});
