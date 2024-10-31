importScripts("utils/md5.js");

let is_init = false;
let appId = "";
let secretKey = ""

//监听设置变化
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.apiParams) {
        chrome.storage.sync.get(["apiParams"], (data) => {
            var apiParams = data.apiParams || {};
            var conf = apiParams.baidu;
            appId = conf.find(item => item.key === "appId")?.value;
            secretKey = conf.find(item => item.key === "secretKey")?.value;
            is_init = true;
        });
    }
});

// 初始化配置
async function InitConf() {
    if (is_init) return;
    const conf = await new Promise((resolve) => {
        chrome.storage.sync.get(["apiParams"], (data) => {
            var apiParams = data.apiParams || {};
            resolve(apiParams["baidu"]);
        });
    });
    appId = conf.find(item => item.key === "appId")?.value;
    secretKey = conf.find(item => item.key === "secretKey")?.value;
    is_init = true;
}

async function BaiDuFanyi(query, timeout = 3000) {
    //百度翻译平台：https://api.fanyi.baidu.com/api/trans/product/desktop

    await InitConf();
    const salt = Date.now(); // 随机码

    // Step 1: 拼接字符串
    const str1 = appId + query + salt + secretKey;

    // Step 2: 计算签名
    const sign = md5(str1);

    const url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';

    // 拼接完整请求
    const requestUrl = `${url}?q=${encodeURIComponent(query)}&from=en&to=zh&appid=${appId}&salt=${salt}&sign=${sign}`;

    try {
        // 使用 fetchWithTimeout 发送请求
        const response = await fetchWithTimeout(requestUrl, { method: 'GET' }, timeout);

        if (!response.ok) {
            throw new Error('网络错误');
        }

        const data = await response.json();
        return data.trans_result[0].dst; // 返回翻译结果
    } catch (error) {
        return "翻译失败: " + error.message; // 更详细的错误信息
    }
}
