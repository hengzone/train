let downloaderHandle = {};

downloaderHandle.loadImage = function(url) {
    return new Promise((resolve, reject) => {

        let img = new Image();
        img.onload = function () {
            // console.log('ignm1:',img);
            resolve(img);
            // console.log('ignm2:',img);
        };
        img.onerror = function() {
            reject();
        };
        img.src = url;

    });
};

downloaderHandle.loadJsFile = function(url) {
    return new Promise((resolve, reject) => {

        let nHead = document.head || document.getElementsByTagName('head')[0];

        var script = document.createElement('script');
        script.type = 'text/javascript';

        if (script.readyState){  //IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    return resolve(url);
                }
            };
        } else {  //Others
            script.onload = function(){
                return resolve(url);
            };
        }

        script.onerror = function() {
            reject(Error(url + 'load error!'));
        };

        script.src = url;
        nHead.appendChild(script);

    });
};

export default downloaderHandle;