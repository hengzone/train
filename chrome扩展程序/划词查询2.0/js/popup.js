var checkbox = document.getElementById('translate');
// document.addEventListener('click', function(event){
//     var e = event || window.event;
//     console.log('x:'+e.clientX+'\ny:'+e.clientY);
// });
// document.onmouseup = function (event){
//     var e = event || window.event;
//     console.log('x:'+e.clientX+'\ny:'+e.clientY);
// }

chrome.runtime.sendMessage({
    method: 'getTranState'
}, function(response) {
    checkbox.checked = response.message;
});

checkbox.addEventListener("click", function(){
    chrome.runtime.sendMessage({
        method: 'setTranState'
    }, function(response) {
        checkbox.checked = response.message;
    });
});

