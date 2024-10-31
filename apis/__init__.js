importScripts("apis/youdao.js");
importScripts("apis/baidu.js");

async function translateApi(text) {
    // 使用 Promise 包装 chrome.storage.sync.get
    const apiSelection = await new Promise((resolve) => {
        chrome.storage.sync.get(["selectedApi"], (data) => {
            resolve(data.selectedApi);
        });
    });

    let fanyiapi;

    switch (apiSelection) {
        case "youdao":
            fanyiapi = YouDaoFanyi;
            break; // 添加 break 防止 fall-through
        case "baidu":
            fanyiapi = BaiDuFanyi;
            break; // 添加 break 防止 fall-through
        default:
            fanyiapi = YouDaoFanyi; // 默认值
    }

    if (!fanyiapi) return "";
    return await fanyiapi(text); // 使用正确的翻译函数
}
