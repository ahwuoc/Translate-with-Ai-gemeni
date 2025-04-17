chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'translate') {
    const text = message.text;
    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC-9fsF6UiYjxUw3IApBNMBGYb3TglW3hs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Chỉ dịch sang tiếng Việt, không giải thích: ${text}. Chỉ trả về bản dịch.`
          }]
        }]
      })
    })
    .then(res => res.json())
    .then(data => {
      const translated = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Không dịch được!';
      sendResponse({ translatedText: translated });
    })
    .catch(err => {
      console.error(err);
      sendResponse({ translatedText: 'Lỗi khi dịch!' });
    });
    return true; 
  }
});
