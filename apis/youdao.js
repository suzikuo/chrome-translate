importScripts("utils/currentController.js");

async function YouDaoFanyi(text, timeout = 10000) { // 默认超时为 10 秒
    const url = `http://aidemo.youdao.com/trans?q=${escapeText(text)}&from=Auto&to=Auto`;

    try {
        const response = await fetchWithTimeout(url, { method: 'GET' }, timeout);

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        
        if (data.errorCode == "0") {
            return data.translation[0] || "翻译失败,文本太长";
        } else if (data.msg) {
            return data.msg;
        } else {
            return "翻译失败";
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            return "请求被取消";
        } else {
            return "发生错误: " + error.message; // 更详细的错误信息
        }
    }
}