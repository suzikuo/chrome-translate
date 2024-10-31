const apiSelection = document.getElementById("apiSelection");
const buttonSelection = document.getElementById("buttonSelection");
const customParamsContainer = document.getElementById("customParamsContainer");
const addParamButton = document.getElementById("addParamButton");
const saveButton = document.getElementById("saveSettings");

let apiParams = {};

// 从存储中加载设置
chrome.storage.sync.get(["selectedApi", "apiParams","buttonParams"], (data) => {
  apiSelection.value = data.selectedApi || "youdao";
  buttonSelection.value = data.buttonParams || "left_top";
  apiParams = data.apiParams || {};

  // 加载存储的凭证参数
  updateCustomParamsUI();
});

// 切换 API 时更新 UI
apiSelection.addEventListener("change", () => {
  updateCustomParamsUI();
});

// 添加新凭证参数输入字段
addParamButton.addEventListener("click", () => {
  if (!apiParams.hasOwnProperty(apiSelection.value)) apiParams[apiSelection.value] = [];

  apiParams[apiSelection.value].push({ key: "", value: "" });
  updateCustomParamsUI();
});

// 更新 UI 以显示自定义参数输入字段
function updateCustomParamsUI() {
  customParamsContainer.innerHTML = "";
  if (apiParams.hasOwnProperty(apiSelection.value)) {
    

    apiParams[apiSelection.value].forEach((param, index) => {
      const paramDiv = document.createElement("div");
      paramDiv.classList.add("dynamic-field");

      const keyInput = document.createElement("input");
      keyInput.type = "text";
      keyInput.placeholder = "参数名";
      keyInput.value = param.key;
      keyInput.oninput = (e) => (param.key = e.target.value);

      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.placeholder = "值";
      valueInput.value = param.value;
      valueInput.oninput = (e) => (param.value = e.target.value);
      // 添加删除按钮
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");

      deleteButton.onclick = () => {
        // 删除参数
        apiParams[apiSelection.value].splice(index, 1);
        updateCustomParamsUI(); // 更新 UI
      };
      paramDiv.appendChild(keyInput);
      paramDiv.appendChild(valueInput);
      paramDiv.appendChild(deleteButton);
      customParamsContainer.appendChild(paramDiv);
    });
  }

}

// 保存设置到存储
saveButton.addEventListener("click", () => {

  chrome.storage.sync.set({ "selectedApi": apiSelection.value, "apiParams": apiParams, "buttonParams": buttonSelection.value }, () => {
    showMessage("设置已保存！");
  });
});
// 显示消息框并自动隐藏
function showMessage(message) {
  messageBox.textContent = message;
  messageBox.style.display = "block";

  setTimeout(() => {
    messageBox.style.display = "none";
  }, 1000); // 2秒后自动隐藏
}