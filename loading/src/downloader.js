let downloader = (() => {

    function limitLoad(fn, options, srcs, max) {
        if (typeof fn !== 'function') throw TypeError('第一个参数必须是function');
        if (!Array.isArray(srcs)) throw TypeError('第二个参数必须是数组');
        if (srcs.length === 0) throw TypeError('资源请求列表为空');

        srcs = [].concat(srcs);
        let len = srcs.length; // 总数
        let completions = 0; // 完成数
        let count = 0;
        const promises = [];

        const load = function() {
            if (count > max || srcs.length <= 0) return ;

            count += 1;

            return fn(srcs.shift()).then((img) => {

                options.success(img);

            }).catch((err) => {
                options.error(err);
            }).then(() => {
                count -= 1;
                completions++;
                options.progress(len, completions);

                return load();
            });
        };

        for(let i = 0; i < max && i < len; i++){
            promises.push(load());
        }
        return Promise.all(promises);
    }

    return {
        /**
         * 处理下载任务
         */
        handle: function(options, max = maxThread) {

            if (options.async && options.async === false) {
                max = 1;
            }

            return limitLoad(downloaderHandle[options.type], options, options.srcs, max);

        }
    };

})();

export default downloader;