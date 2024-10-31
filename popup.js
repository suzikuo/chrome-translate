const toggleCheckbox = document.getElementById("featureToggle");
const openSettingsButton = document.getElementById("openSettings");

// 从存储中获取设置
chrome.storage.sync.get("featureEnabled", (data) => {
  toggleCheckbox.checked = data.featureEnabled || false;
});

// 监听开关状态变化
toggleCheckbox.addEventListener("change", () => {
  chrome.storage.sync.set({ featureEnabled: toggleCheckbox.checked });
});

// 监听管理面板按钮点击，跳转到配置页面
openSettingsButton.addEventListener("click", () => {
  chrome.runtime.openOptionsPage(); // 打开配置中心
});
