var API_key = '1086533570';
var keyfrom = 'xhTranslate';

function selection(info, tab) {
    if (isChina(info.selectionText)) {
        var xhr = new XMLHttpRequest();
        var url = 'http://fanyi.youdao.com/openapi.do?keyfrom='+ keyfrom +'&key='+ API_key +'&type=data&doctype=json&version=1.1&q=';
        xhr.onreadystatechange = function(){
            if (xhr.readyState==4 && xhr.status==200){
                var res = xhr.responseText;
                alert(res);
            }
        };
        xhr.open("GET",url + info.selectionText,true);
        xhr.send(null); 
    }
}

function isChina(str) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) { 
        return false; 
    } 
    return true;
}

var select = chrome.contextMenus.create({"title":"有道翻译","contexts":["selection"],"onclick":selection});