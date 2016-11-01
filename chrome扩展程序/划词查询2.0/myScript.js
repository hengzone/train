if (!window.extension_translation_state) {
    window.extension_translation_state = false; // 默认关闭插件效果
}

// var select = chrome.contextMenus.create({"title":"有道翻译","contexts":["selection"],"onclick":selection});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.method === 'setTranState') {
        window.extension_translation_state = !window.extension_translation_state;
        sendResponse({
            method: 'returnTranState',
            message: window.extension_translation_state
        });
    }
    if (message.method === 'getTranState') {
        sendResponse({
            method: 'returnTranState',
            message: window.extension_translation_state
        });
    }
});