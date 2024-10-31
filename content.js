// 是否开启插件
let isEnabled = false;

// 初始化设置
(function featureEnabled() {
    // 从存储中获取设置
    chrome.storage.sync.get("featureEnabled", (data) => {
        isEnabled = data.featureEnabled || false;
    });
})()


// 监听设置变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.featureEnabled) {
        isEnabled = changes.featureEnabled.newValue; // 获取新值
    }
});



// 获取 翻译 按钮
function GetMytranslateButton() {
    let translateButton = document.getElementById("MytranslateButton");

    // 检查按钮是否存在，不存在则创建
    if (!translateButton) {
        translateButton = document.createElement("button");
        translateButton.id = "MytranslateButton";
        translateButton.innerText = "翻译";
        translateButton.style.position = "absolute";
        translateButton.style.zIndex = "1000";
        translateButton.style.backgroundColor = "#4CAF50";
        translateButton.style.color = "white";
        translateButton.style.border = "none";
        translateButton.style.padding = "5px 10px";
        translateButton.style.borderRadius = "4px";
        translateButton.style.cursor = "pointer";

        BindMytranslateButtonEvent(translateButton);
        // 将按钮添加到页面
        document.body.appendChild(translateButton);

    }
    return translateButton
}

// 绑定 翻译 按钮 点击事件
function BindMytranslateButtonEvent(translateButton) {
    // 添加按钮点击事件
    translateButton.addEventListener("click", () => {
        SendMessage()
        translateButton.style.display = "none"; // 隐藏翻译按钮
    });
}

// 获取 翻译框 
function GettranslationBox() {
    let translationBox = document.getElementById("MytranslateBox");
    if (!translationBox) {

        translationBox = document.createElement("div");
        translationBox.id = "MytranslateBox";
        translationBox.style.position = "absolute";
        translationBox.style.zIndex = "1000";
        translationBox.style.backgroundColor = "#fff";
        translationBox.style.border = "1px solid #ccc";
        translationBox.style.padding = "10px";
        translationBox.style.borderRadius = "4px";
        translationBox.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
        translationBox.style.display = "none"; // 初始隐藏
        translationBox.style.color = "black"; // 初始隐藏
        document.body.appendChild(translationBox);
    }
    return translationBox;
}

// 发送消息
function SendMessage() {
    const selectedText = window.getSelection().toString().trim();
    // 发送消息到 background.js
    chrome.runtime.sendMessage({ text: selectedText }, (response) => {
        if (chrome.runtime.lastError) {
        } else {
            let translationBox = GettranslationBox();
            // 显示翻译结果
            translationBox.innerText = response.translation; // 更新翻译结果
            translationBox.style.display = "block"; // 显示翻译框

            // 设置翻译框位置
            const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
            translationBox.style.top = `${window.scrollY + rect.top - translationBox.offsetHeight - 5}px`;
            translationBox.style.left = `${window.scrollX + rect.left}px`;
        }
    });
}

// 监听 鼠标抬起 ,用来触发 翻译 按钮的显示
document.addEventListener("mouseup", (event) => {
    if (!isEnabled) return;
    
    let translateButton = GetMytranslateButton();
    let translationBox = GettranslationBox();
    
    if (event.target === translationBox) return;
    // 如果有选中的文本
    if (window.getSelection().toString().trim()) {
        // 定位按钮到鼠标位置上方
        translateButton.style.top = `${window.scrollY + event.clientY - 50}px`; // 考虑滚动位置
        translateButton.style.left = `${event.clientX - (translateButton.offsetWidth / 2)}px`; // 中心对齐
        translateButton.style.display = "block"; // 显示翻译按钮
    }
    else {
        // 如果没有选中文本，隐藏按钮
        if (!translateButton) return;
        translateButton.style.display = "none";
    }
});

// 如果点击页面其他区域，则隐藏按钮
document.addEventListener("mousedown", (event) => {
    if (!isEnabled) return;

    let translateButton = GetMytranslateButton();
    if (translateButton && event.target !== translateButton) {
        translateButton.style.display = "none";

    };

    let translationBox = GettranslationBox()
    if (translationBox && event.target !== translationBox) {
        translationBox.style.display = "none";
    };
});
