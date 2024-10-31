importScripts("apis/__init__.js");
const escapeText = (text) => {
  return encodeURIComponent(
    text.replace(/([A-Z])/g, " $1").replace(/-/g, " ").toLowerCase()
  );
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.text) {
    (async () => {
      const translation = await translateApi(message.text);
      sendResponse({ translation: translation }); // 发送失败消息
    })();
  };
  return true
});


chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});
