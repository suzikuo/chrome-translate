
let currentController = null;


// 抽象超时处理函数
async function fetchWithTimeout(url, options = {}, timeout = 3000) {
    // 创建新的 AbortController
    const controller = new AbortController();
    const { signal } = controller;

    // 创建超时 Promise
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            controller.abort(); // 超时时取消请求
            reject(new Error('请求超时'));
        }, timeout);
    });

    // 使用 Promise.race 来处理 fetch 和超时
    return Promise.race([
        fetch(url, { ...options, signal }),
        timeoutPromise
    ]);
}