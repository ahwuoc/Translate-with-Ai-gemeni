let currentIcon = null;
let currentModal = null;
let container = null;

// Tạo container cố định và gắn sự kiện mouseleave
const getContainer = () => {
  if (!container) {
    container = document.createElement("div");
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "9999",
      pointerEvents: "none",
    });
    container.addEventListener("mouseleave", () => {
      if (currentModal) {
        currentModal.classList.remove("show");
        currentModal.style.display = "none";
      }
    });
    document.body.appendChild(container);
  }
  return container;
};

document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (!selectedText) return;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  removeCurrentElements();
  showTranslateIcon(rect.left, rect.top, rect.width, selectedText);
});

const showTranslateIcon = (x, y, width, text) => {
  const parent = getContainer();
  currentIcon = document.createElement("div");
  Object.assign(currentIcon.style, {
    position: "absolute",
    left: `${x + 5}px`,
    top: `${y + 5}px`,
    fontSize: "20px",
    cursor: "pointer",
    pointerEvents: "auto",
    transition: "opacity 0.2s ease",
  });
  currentIcon.textContent = "😌";
  

  currentModal = document.createElement("div");
  const modalWidth = 500;
  Object.assign(currentModal.style, {
    position: "absolute",
    left: `${Math.max(10, x + width / 2 - modalWidth / 2)}px`,
    top: `${y + 20}px`,
    maxWidth: `${modalWidth}px`,
    width: "90%",
    background: "#444",
    borderRadius: "1rem",
    padding: "1.5rem",
    color: "white",
    border: "2px solid #ff9500",
    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    lineHeight: "1.5",
    display: "none",
    pointerEvents: "auto",
    transition: "opacity 0.2s ease, transform 0.2s ease", 
    opacity: "0",
    transform: "translateY(10px)",
  });

  currentModal.innerHTML = `
    <div style="margin-bottom: 0.75rem;">
      <span style="font-weight: 600; font-size: 1.1rem; color: #ff9500;">🔸 Original</span>
      <p style="margin: 0.5rem 0 0; word-break: break-word;">${text}</p>
    </div>
    <hr style="border: none; border-top: 1px solid #aaa; margin: 0.75rem 0;">
    <div>
      <span style="font-weight: 600; font-size: 1.1rem; color: #ff9500;">🔸 Translated</span>
      <p style="margin: 0.5rem 0 0; word-break: break-word;">Click icon to translate</p>
    </div>
  `;
  currentIcon.addEventListener("click", () => {
    translateText(text, (translated) => {
      currentModal.innerHTML = `
        <div style="margin-bottom: 0.75rem;">
          <span style="font-weight: 600; font-size: 1.1rem; color: #ff9500;">🔸 Original</span>
          <p style="margin: 0.5rem 0 0; word-break: break-word;">${text}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #aaa; margin: 0.75rem 0;">
        <div>
          <span style="font-weight: 600; font-size: 1.1rem; color: #ff9500;">🔸 Translated</span>
          <p style="margin: 0.5rem 0 0; word-break: break-word;">${translated}</p>
        </div>
      `;
      currentModal.style.display = "block";
      currentModal.classList.add("show");
    });
  });

  // Thêm vào container
  parent.appendChild(currentIcon);
  parent.appendChild(currentModal);
};

const translateText = (text, callback) => {
  try {
    chrome.runtime.sendMessage({ action: "translate", text }, (response) => {
      if (chrome.runtime.lastError) {
        callback("Oops, dịch lỗi rồi! 😅");
        return;
      }
      callback(response.translatedText || "Không dịch được!");
    });
  } catch (error) {
    callback("Hỏng rồi, API dịch bị crash! 🚨");
  }
};

const removeCurrentElements = () => {
  if (currentIcon) currentIcon.remove();
  if (currentModal) currentModal.remove();
  currentIcon = null;
  currentModal = null;
};

const style = document.createElement("style");
style.textContent = `
  .show {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);