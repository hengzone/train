
let emptyFn = function(){};

let taskHandle = {};

taskHandle.loadJsFile = function(options) {

    if (options.srcs.length == 0) options.srcs = javaScriptScrs;

    return downloader.handle(options);

};

taskHandle.unknowTask = function(options) {

    return new Promise((resolve, reject) => {

        // 将 resolve 传递至 handle，由处理函数自行控制流程
        options.handle && options.handle(resolve, reject);

    });

};

export default function(task, params, progress) {
    let srcs = task.relay ? [].concat(task.relay) : [];
    let options = {};
    options.handle = task.handle || emptyFn;
    options.progress = progress || emptyFn;
    options.success = task.success || emptyFn;
    options.complete = task.complete || emptyFn;
    options.error = task.error || emptyFn;
    options.params = params;
    options.type = task.type;
    options.srcs = srcs;
    if (task.async) options.async = task.async;

    console.log('task.type:',task.type);

    return taskHandle[task.type](options);
}