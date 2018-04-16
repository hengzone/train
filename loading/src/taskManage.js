/**
 * 任务处理队列
 *
 * by：felix
 */

import MinPQ from './MinPQ';

let exampleTask = {

    type: '', // 任务类型，对应默认处理方式

    priority: 0, // 任务优先级

    /**
     * 串行或并行，仅对部分任务有效
     */
    async: true,

    /**
     * 单项任务所占用的进度百分比
     * 最后一项任务完成后再添加任务无任何处理进度提示（在 taskProgress 中作处理）
     */
    percent: 0,

    relay: Object() || [], // 任务的依赖内容

    /**
     * 自定义任务处理方式，重写该任务的默认处理方式
     * 接受 resolve 和 reject 作结果处理
     * @param resolve
     * @param reject
     */
    handle: function(resolve, reject) {},

    /**
     * 任务成功执行一次的回调函数
     * @param obj 执行成功返回相关对象: img / audio / video / object / ...
     */
    success: function(obj) {},

    error: function(err) {}, // 任务执行失败一次的回调函数

    /**
     * 任务完成的回调函数
     * @param obj
     */
    complete: function() {},

};

let taskManage = (() => {

    /**
     * 任务队列
     */
    let taskQuene = new MinPQ();

    /**
     * 参数
     */
    let params = {
        taskObj: null, // 正在进行中的任务
        taskTotal: 0,
        taskFinish: 0,

        percent: 0,
        eachPercent: 0,
        eachTaskPer: [],
        taskHasPer: 0,

        resTotal: 0,
        resLoad: 0,

        eachTaskTotal: [],
    };

    function taskManageError(message) {
        this.message = message;
        this.name = 'TaskManage';
    }

    function setProgress(fn) {
        if(typeof fn !== 'function') {
            throw new taskManageError('setProgress 参数类型不符，必须为 function');
        }
    }

    function setComplete(fn) {
        if(typeof fn !== 'function') {
            throw new taskManageError('setComplete 参数类型不符，必须为 function');
        }
    }

    /**
     * 添加任务
     * @param task
     */
    function addTask(task) {}

    /**
     * 开始任务队列
     */
    function startTask() {}

    return {
        add: function(task) {
            try {
                addTask(task);
            } catch(e) {
                console.error(e.name, ' : ',e.message);
            }
        },
        start: function() {
            startTask();
        },
        setProgress: function(fn) {
            try {
                setProgress(fn);
            } catch(e) {
                console.error(e.name, ' : ',e.message);
            }

        },
        setComplete: function(fn) {
            try {
                setComplete(fn);
            } catch(e) {
                console.error(e.name, ' : ',e.message);
            }

        }
    };

})();

export default taskManage;