// 1. ตั้งค่า Webhook URL จาก Discord
const WEB_HOOK_URL =
  "https://discord.com/api/webhooks/1495037317600247891/3f5_f140FuhsyVLhBv6TeQx44komTDiN75SYjVCyAa8uCft7OMeLbgUYDeltOOgesP4Y";

// ส่งแจ้งเตือน Webhook
function sendToDiscord(message) {
  fetch(WEB_HOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: `💌 **Story Status:** ${message}`,
    }),
  });
}

// ตรวจสอบเมื่อมีการเลื่อนหน้า (ส่งแจ้งเตือนครั้งเดียวเมื่อเลื่อนลง)
let hasScrolled = false;
window.onscroll = function () {
  if (window.scrollY > 300 && !hasScrolled) {
    sendToDiscord("แฟนเริ่มเลื่อนอ่านคำเกริ่นนำแล้วนะ...");
    hasScrolled = true;
  }
};

function checkUnlock() {
  const code = document.getElementById("passcode").value;
  const correctCode = "04092567"; // เปลี่ยนเป็นรหัสจริง

  if (code === correctCode) {
    sendToDiscord("✅ ปลดล็อกสำเร็จ! กำลังเข้าสู่ช่วงเวลาที่เริ่มชอบ");
    nextPage(2);
  } else {
    alert("รหัสไม่ถูกนะคนดี ลองนึกอีกทีสิ...");
  }
}

// เก็บสถานะหน้าปัจจุบัน (เริ่มที่หน้า 1)
let currentPage = 1;

// แก้ไขฟังก์ชัน nextPage ให้เรียกใช้เอฟเฟกต์นี้
function nextPage(num) {
  currentPage = num;
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  const next = document.getElementById(`slide-${num}`);
  if (next) {
    next.classList.remove("hidden");
    window.scrollTo(0, 0);

    // ถ้าเป็นหน้า 5 ให้เริ่มเอฟเฟกต์ Collage
    if (num === 5) {
      startFinalCollage();
    }

    const videos = next.querySelectorAll("video");
    videos.forEach((v) => v.play().catch(() => {}));
  }
}

function prevPage() {
  // ถ้าอยู่หน้า 2 แล้ว จะไม่ยอมให้ถอยไปหน้า 1 (หน้าใส่รหัส)
  if (currentPage <= 2) {
    console.log("ล็อคไว้ ไม่ให้กลับไปหน้าใส่รหัส");
    return;
  }

  // ลดเลขหน้าลง 1
  currentPage--;

  sendToDiscord(`⏪ แฟนย้อนกลับไปดูหน้าที่ ${currentPage}`);

  // จัดการการแสดงผล
  document
    .querySelectorAll("section")
    .forEach((s) => s.classList.add("hidden"));
  const prev = document.getElementById(`slide-${currentPage}`);
  if (prev) {
    prev.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  // สั่งวิดีโอเล่น
  const videos = document.querySelectorAll(".memory-video");
  videos.forEach((vid) => vid.play());
}

// ฟังก์ชันสำหรับสุ่มสร้างรูปภาพล้อมรอบ (รันเมื่อเข้าหน้า 5)
function startFinalCollage() {
  const container = document.getElementById("final-collage");
  container.innerHTML = ""; // ล้างรูปเก่าก่อน

  // รายชื่อรูปภาพ/วิดีโอที่คุณต้องการให้ขึ้น (ดึงจาก allMedia หรือใส่เอง)
  const items = [
    "All/IMG_0968.JPG",
    "All/IMG_0984.JPG",
    "All/IMG_0987.JPG",
    "All/IMG_7994.JPG",
    "All/IMG_8930.PNG",
    "All/IMG_5437.PNG",
    // เพิ่มชื่อไฟล์รูปของคุณได้เรื่อยๆ เลย
  ];

  items.forEach((src, index) => {
    setTimeout(() => {
      const img = document.createElement("div");
      img.className =
        "pop-in absolute rounded-2xl shadow-xl border-4 border-white overflow-hidden";

      // สุ่มตำแหน่ง (เลี่ยงตรงกลางที่มีข้อความ)
      const side = index % 4; // 0:บน, 1:ขวา, 2:ล่าง, 3:ซ้าย
      let top, left;

      if (side === 0) {
        top = Math.random() * 20;
        left = Math.random() * 100;
      } else if (side === 1) {
        top = Math.random() * 100;
        left = 80 + Math.random() * 15;
      } else if (side === 2) {
        top = 80 + Math.random() * 15;
        left = Math.random() * 100;
      } else {
        top = Math.random() * 100;
        left = Math.random() * 15;
      }

      const size = 120 + Math.random() * 100; // สุ่มขนาด 120-220px
      const rotation = (Math.random() - 0.5) * 30; // สุ่มเอียง -15 ถึง 15 องศา

      img.style.cssText = `
                top: ${top}%; 
                left: ${left}%; 
                width: ${size}px; 
                height: ${size}px;
                --rotation: ${rotation}deg;
                z-index: 0;
            `;

      img.innerHTML = `<img src="${src}" class="w-full h-full object-cover">`;
      container.appendChild(img);
    }, index * 800); // ค่อยๆ ขึ้นทีละรูป ทุกๆ 0.8 วินาที
  });
}
