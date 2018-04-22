/**
 * 默认任务优先级
 * @type {number}
 */
const defaultTaskPriority = 2;

/**
 * 任务处理优先级
 */
export const TaskLevel = {
    // 加载
    loadJsFile: defaultTaskPriority,

    // 加载图片
    loadImage: defaultTaskPriority,

    // 未知任务
    unknowTask: 99
};

/**
 * 下载配置
 */
export const DownloaderConfig = {
    // 线程池"线程"数量
    maxThread: 5,
    // 加载失败重试次数
    // 重试2次，加上原有的一次，总共是3次
    // tryTimes: 2
};

/**
 * 测试用
 * @type {[string]}
 */
export const javaScriptScrs = [
    'http://apps.bdimg.com/libs/vue/1.0.14/vue.js',
];

export const imgScrs = [
    'https://cn.vuejs.org/images/logo.png',
];