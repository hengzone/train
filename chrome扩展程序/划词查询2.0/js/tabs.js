var API_key = '1086533570';
var keyfrom = 'xhTranslate';

// 卡片DOM的ID
var elID = 'FELIX_EXTENSION_CARD';

// 常见错误代码对应的提示信息
var errorMsg = {
    '20': '要翻译的文本过长',
    '30': '无法进行有效的翻译',
    '40': '不支持的语言类型',
    '50': '无效的key',
    '60': '无词典结果，仅在获取词典结果生效',
    '70': '无效查询字段',
};

// 卡片距离鼠标点击点的间距
var rad = {
    'top': 15,
    'left': 15,
};

// 记录鼠标点击点在可视区域的位置，用于计算卡片位置
var x, y;

// 清除选中的内容
var clearSlct = "getSelection" in window ? function(){
        window.getSelection().removeAllRanges();
    } : function(){
        document.selection.empty();
    };

// 创建卡片DOM
function creatHtml(data) {
    var html = '';
    var code = parseInt(data.errorCode);
    if (document.getElementById(elID)) {
        document.body.removeChild(document.getElementById(elID));
    }
    var el = document.createElement('div');
    document.body.appendChild(el);
    el.setAttribute('id', elID);
    el.setAttribute('style','display: none;left: 0px;top: 0px;');

    html += '<div id="FELIX_EXTENSION_HEAD">';
    if (code == 0) {
        html +=     '<span style="float: left;">'+ data.query +'</span>';
        if (data.basic) {
            if (data.basic.phonetic) {
                html += '<span style="float: right;">[ '+ data.basic.phonetic +' ]</span>';
            }
        }
    } else {
        html +=     '<span style="float: left;">'+ data.query +'</span>';
        html +=     '<span style="float: right;">出错了!</span>';
    }
    html += '</div>';

    html += '<div id="FELIX_EXTENSION_CONTEXT">';
    if (code == 0) {
        if (data.basic) {
            if (data.basic.explains.length > 0) {
                for (var i = 0; i < data.basic.explains.length; i++) {
                    html += '<p>' +data.basic.explains[i] +'</p>';
                }
            }
        }
        if (data.web) {
            if (data.web.length > 0) {
                html += '<div id="FELIX_EXTENSION_LINE">';
                html +=     '<span style="color: #666;">网络释义</span>';
                html +=     '<p></p>';
                html += '</div>';

                html += '<div id="FELIX_EXTENSION_WEB">';
                for (var i = 0; i < data.web.length; i++) {
                    html += '<p>';
                    html += data.web[i].key + '：';
                    for (var j = 0; j < data.web[i].value.length; j++) {
                        html += data.web[i].value[j];
                        if (j != data.web[i].value.length) {
                            html += '，';
                        }
                    }
                    html += '</p>';
                }
                html += '</div>';
            }
        }
    } else {
        html += '<p>'+ errorMsg[code] +'</p>';
    }
    html += '</div>';

    html += '<div class="foot"></div>';
    el.innerHTML = html;
    setXY(el);
    bindEvent(el);
    el.style.display="block";
    clearSlct();
    // console.log(data);
}

// 设置卡片的位置
function setXY(el) {
    var px = document.body.clientWidth; // 可视区域宽（X）
    var py = document.body.clientHeight; // 可视区域高（Y）
    var size = getSize(el.getAttribute('id')); // 获取隐藏元素的大小
    var yy, xx; // top & left

    // 判断top位置（YY）
    if (py <= size.height + rad.top) { // 首先判断可视区域高度
        yy = 0;
    } else { // 可视区域比元素高
        if (y <= size.height + rad.top) { // 点击处距离顶部空间高度不够放置card
            if (py - y <= size.height + rad.top) {// 点击处距离底部距离不够放置card
                yy = (py - size.height) / 2;
            } else {
                yy = y + rad.top;
            }
        } else {
            yy = y - size.height - rad.top;
        }
    }

    // 判断left位置（XX）
    if (px <= size.width + rad.left) { // 判断可视区域宽度
        xx = 0;
    } else {// 可视区域比元素宽
        if (x <= size.width + rad.left) {// 点击处距左边距离不够放置card
            if (px - x <= size.width + rad.left) {// 点击处距离右边不够放置card
                xx = (px - size.width) / 2;
            } else {
                xx = x + rad.left;
            }
        } else {
            xx = x - size.width - rad.left;
        } 
    }

    el.style.top = yy + 'px';
    el.style.left = xx + 'px';
}

// 获取卡片的实际大小
function getSize(id) {
    var width,
    height,
    elem = document.getElementById(id),
    noneNodes = [],
    nodeStyle = [];
    getNoneNode(elem); //获取多层display：none;的元素
    setNodeStyle();
    width = elem.clientWidth;
    height = elem.clientHeight;
    resumeNodeStyle();
   
   return {
     width : width,
     height : height
   };
 
    function getNoneNode(node){
        var display = getStyles(node).getPropertyValue('display'),
        tagName = node.nodeName.toLowerCase();
        if(display != 'none' && tagName != 'body'){
            (node.parentNode);
        } else {
            noneNodes.push(node);
            if (tagName != 'body') {
                getNoneNode(node.parentNode);
            }
        }
    };
   
   //这方法才能获取最终是否有display属性设置，不能style.display。
    function getStyles(elem) {
        var view = elem.ownerDocument.defaultView;
        if (!view || !view.opener) {
            view = window;
        }
        return view.getComputedStyle(elem);
    };
    function setNodeStyle(){
        var i = 0;
        for(; i < noneNodes.length; i++){
            var visibility = noneNodes[i].style.visibility,
                display = noneNodes[i].style.display,
                style = noneNodes[i].getAttribute("style");
                //覆盖其他display样式
                noneNodes[i].setAttribute("style", "visibility:hidden;display:block !important;" + style);
                nodeStyle[i] = {
                visibility :visibility,
                display : display
            }
        }
    };

    function resumeNodeStyle(){
        var i = 0;
        for(; i < noneNodes.length; i++){
            noneNodes[i].style.visibility = nodeStyle[i].visibility;
            noneNodes[i].style.display = nodeStyle[i].display;
        }
    };
}

// 为卡片绑定事件
function bindEvent(el) {
    el.onmouseleave = function(){// 鼠标从元素内移出事件
        document.body.removeChild(el);
    };
}

// 发送请求获取查询结果
function selection(info) {
    var xhr = new XMLHttpRequest();
    var url = 'https://fanyi.youdao.com/openapi.do?keyfrom='+ keyfrom +'&key='+ API_key +'&type=data&doctype=json&version=1.1&q=';
    xhr.onreadystatechange = function(){
        if (xhr.readyState==4 && xhr.status==200){
            var res;
            if (xhr.responseText != 'no query') {
                res = JSON.parse(xhr.responseText);
            } else {
                res = {
                    'errorCode': '70',
                    'query': getSelectedText(),
                };
            }
            creatHtml(res);
        }
    };
    xhr.open("GET",url + info,true);
    xhr.send(null); 
}

// 得到选中的字符
function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.getSelection) {
        return document.getSelection();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
}

// 判断是否含有中文
function isChina(str) {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) { 
        return false; 
    } 
    return true;
}

// 绑定鼠标点下回弹事件
document.onmouseup = function(e) {
    if (!e.button === 2) {
        return;
    }
    chrome.runtime.sendMessage({
        method: 'getTranState'
    }, function(response) {
        if (document.getElementById(elID)) {
            document.body.removeChild(document.getElementById(elID));
        }
        if (response.message) {
            var message = getSelectedText().trim();
            // 处理字符串中的特殊符号
            message = message.replace(/\s[&\|\\\1234567890!*^%$&#@\()-_=+<>,.，。\/?、]/g,' ').replace(/\s+/g, ' ');

            if (isChina(message) && message != '') {
                x = e.clientX;
                y = e.clientY;
                // console.log('x:'+e.clientX+'\ny:'+e.clientY);
                selection(message);
            }
        }
    });
};