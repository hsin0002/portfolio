/* ====== 卡片滑動畫廊 ====== */
function initGallery(sectionSelector) {
  const gallery = document.querySelector(`${sectionSelector} .gallery-container`);
  if (!gallery) return;

  const container = gallery.querySelector('.cards-container');
  if (!container) return;

  const cards = container.querySelectorAll('.card');
  let currentIndex = 0;
  let startX = 0;
  let isDragging = false;

  function updateGallery() {
    const containerWidth = gallery.offsetWidth;
    const cardWidth = cards[0].offsetWidth;
    const gap = 16;

    const offset = currentIndex * (cardWidth + gap) - (containerWidth - cardWidth) / 2;
    container.style.transform = `translateX(${-offset}px)`;

    cards.forEach((card, i) => {
      if (i === currentIndex) {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        card.style.border = '2px solid #4CAF50';
      } else {
        card.style.opacity = '0.7';
        card.style.transform = 'scale(0.9)';
        card.style.border = '2px solid transparent';
      }
    });
  }

  // 點擊卡片切換
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentIndex = index;
      updateGallery();
    });
  });

  // 觸控滑動
  container.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });
  container.addEventListener('touchend', e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (diffX > 50 && currentIndex > 0) currentIndex--;
    else if (diffX < -50 && currentIndex < cards.length - 1) currentIndex++;

    updateGallery();
    isDragging = false;
  });

  // 滑鼠滾輪切換
  gallery.addEventListener('wheel', e => {
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < cards.length - 1) currentIndex++;
    else if (e.deltaY < 0 && currentIndex > 0) currentIndex--;
    updateGallery();
  });

  window.addEventListener('resize', updateGallery);
  updateGallery();
}


function initCardOverlay(lang) {
  const overlay = document.querySelector(".overlay");
  const overlayTitle = document.querySelector("#overlay-title");
  const overlayYear = document.querySelector("#overlay-year");
  const overlayText = document.querySelector("#overlay-text");
  const overlayImages = document.querySelector("#overlay-images");
  const overlayDots = document.querySelector("#overlay-dots");
  const captionEl = document.querySelector("#overlay-caption");
  const closeBtn = document.querySelector(".close-btn");
  let currentImageIndex = 0;
  let imagesData = [];
  let jsonData = null;

  async function loadJson() {
    if (!jsonData) {
      const res = await fetch(`assets/data/dataList_${lang}.json`);
      if (!res.ok) throw new Error(`dataList_${lang}.json not found`);
      jsonData = await res.json();
    }
    return jsonData;
  }

  async function loadFolder(folder) {
    try {
      const data = await loadJson();
      const project = data[folder];
      if (!project) {
        console.warn("Folder not found in JSON:", folder);
        return;
      }

      // 更新文字內容
      overlayTitle.textContent = project.title || "";
      overlayYear.textContent = project.year || "";
      overlayText.innerHTML = ""; 

      project.text.forEach(point => {
        if (Array.isArray(point)) {
          const ul = document.createElement("ul");
          point.forEach(liText => {
            const li = document.createElement("li");
            li.textContent = liText;
            ul.appendChild(li);
          });
          overlayText.appendChild(ul);
        } else {
          const p = document.createElement("p");
          p.textContent = point;
          overlayText.appendChild(p);
        }
      });

      // 更新圖片
      overlayImages.innerHTML = "";
      overlayDots.innerHTML = "";
      captionEl.textContent = "";

      imagesData = project.images || [];

      imagesData.forEach((imgData, i) => {
        const img = document.createElement("img");
        img.src = imgData.src;
        if (i === 0) img.classList.add("active");
        overlayImages.appendChild(img);

        const dot = document.createElement("div");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => showImage(i));
        overlayDots.appendChild(dot);
      });

      captionEl.textContent = imagesData[0]?.caption || "";
      currentImageIndex = 0;

      // 顯示 overlay
      overlay.classList.remove("hidden");

      // 重置 overlay 左右內容捲動，保證每次從頂部開始
      const scrollables = overlay.querySelectorAll(".overlay-left, .overlay-right , #overlay-text");
      scrollables.forEach(el => {
        el.scrollTop = 0;
      });

    } catch (err) {
      console.error("Error loading folder:", err);
    }
  }

  function showImage(index) {
    const imgs = overlayImages.querySelectorAll("img");
    const dots = overlayDots.querySelectorAll(".dot");

    imgs.forEach((img, i) => img.classList.toggle("active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("active", i === index));

    captionEl.textContent = imagesData[index]?.caption || "";
    currentImageIndex = index;
  }

  // 關閉 overlay
  closeBtn.addEventListener("click", () => overlay.classList.add("hidden"));

  // 綁定每個 More 按鈕
  document.querySelectorAll(".more-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const folder = btn.dataset.folder;
      if (folder) loadFolder(folder);
    });
  });

  // 滑鼠滾輪切換圖片 (Desktop)
  overlayImages.addEventListener("wheel", e => {
    e.preventDefault();
    if (!imagesData.length) return;
    currentImageIndex = e.deltaY > 0 
      ? (currentImageIndex + 1) % imagesData.length 
      : (currentImageIndex - 1 + imagesData.length) % imagesData.length;
    showImage(currentImageIndex);
  });

  // 觸控左右滑動切換圖片 (Mobile)
  let startX = 0;
  let isDragging = false;

  overlayImages.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  overlayImages.addEventListener("touchend", e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (diffX > 50) {
      currentImageIndex = (currentImageIndex - 1 + imagesData.length) % imagesData.length;
    } else if (diffX < -50) {
      currentImageIndex = (currentImageIndex + 1) % imagesData.length;
    }

    showImage(currentImageIndex);
    isDragging = false;
  });
}

