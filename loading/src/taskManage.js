/**
 * 任务处理队列
 *
 * by：felix
 */

import {TaskLevel} from './config'
import MinPQ from './MinPQ';
import taskHandle from './taskHandle';

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

    // 每个任务所占百分比的最小值
    const minEachTaskPercent = 1;

    const defaultPercent = 100;

    /**
     * 缺省任务类型
     * @type {string}
     */
    const defaultType = 'unknowTask';

    /**
     * 当前是否有任务在执行
     * @type {boolean}
     */
    let taskRun = false;

    /**
     * 进度回调函数
     * @type {null}
     */
    let progress = function(){};

    /**
     * 任务队列完成回调
     * @type {null}
     */
    let complete = function(){};

    let _helper = {
        /**
         * 获取数组前 n 项和
         * @param arr
         * @param ind
         * @returns {*}
         */
        arraySum: (arr, ind, num) => {
            ind = ind ? ind : arr.length;
            num = num ? num : 0;
            let reducer = (accumulator, currentValue, index) => {
                if (index > ind - 1) {
                    return accumulator + num;
                }
                if (num > 0 && currentValue == 0) currentValue = num;
                return accumulator+currentValue;
            };
            if (arr.length == 0) return 0;
            return arr.reduce(reducer);
        },
    };

    function setTaskPercent(task) {

        let taskPercent = task.percent ? task.percent : 0;
        let newEachPer = 0;

        if (taskPercent > 0) {
            if (taskPercent < minEachTaskPercent) {
                throw new taskManageError('任务: '+ task.type +' 所占百分比小于' + minEachTaskPercent);
            }
            params.taskHasPer++;
            params.eachTaskPer.push(taskPercent);
        } else {
            // 默认记录为 0
            params.eachTaskPer.push(0);
        }

        let taskOver = params.taskTotal - params.taskHasPer;
        if (taskOver > 0) {
            let surplusPer = defaultPercent - _helper.arraySum(params.eachTaskPer);
            if (surplusPer > 0 && params.percent < 100) newEachPer = surplusPer / taskOver;
            else console.error('任务所占百分比大于100%');
        }

        params.eachPercent = newEachPer;

    }

    function taskProgress(total = 1, comlpetions = 1) {
        let taskPer = params.taskObj.percent;
        let per = params.eachPercent;

        // 判断当前任务是否设置 percent 属性
        if (taskPer) per = taskPer;

        per = per * comlpetions / total;

        let percent = params.percent + per;

        /**
         * 超过默认百分比则将其设置为默认百分比
         */
        if (percent > defaultPercent) percent = defaultPercent;

        // 更新百分比
        if (comlpetions == total) params.percent = percent;

        // 返回获得的进度
        progress(percent);
    }

    function setProgress(fn) {
        if (taskRun) {
            throw new taskManageError('任务已经开始');
        }
        if(typeof fn !== 'function') {
            throw new taskManageError('setProgress 参数类型不符，必须为 function');
        }
        progress = fn;
    }

    function setComplete(fn) {
        if (taskRun) {
            throw new taskManageError('任务已经开始');
        }
        if(typeof fn !== 'function') {
            throw new taskManageError('setComplete 参数类型不符，必须为 function');
        }
        complete = fn;
    }

    /**
     * 添加任务
     * @param task
     */
    function addTask(task) {
        // if (taskRun) {
        //     return ;
        // }
        if(task instanceof Array){
            throw new taskManageError('参数类型必须为对象');
        }else if( task instanceof Object ){

            // 检查任务及其操作
            if (!task.type && !task.handle) {

                throw new taskManageError('未知任务及操作');

            }

            // 检查非预定任务是否设定相关操作
            if (Object.keys(TaskLevel).indexOf(task.type) < 0) {

                if (!task.handle) throw new taskManageError('任务: '+ task.type +' 的相关操作不存在');

                task.type = defaultType;

            }

            // 加入任务队列
            if (task.priority) {

                taskQuene.enqueue(task, task.priority);

            } else {

                taskQuene.enqueue(task, TaskLevel[task.type]);

            }

            // 初始化任务信息
            initTask(task);

        }else{
            throw new taskManageError('参数类型必须为对象');
        }

    }

    function initTask(task) {
        // 任务总数增加
        params.taskTotal++;

        // 设置每项任务所占百分比
        setTaskPercent(task);

        // 记录任务资源列表
        // 添加任务回调

    }

    /**
     * 开始任务队列
     */
    function startTask() {
        if (taskRun || params.taskTotal == 0) return;

        if(typeof progress !== 'function') progress = function() {};

        params.taskObj = taskQuene.dequeueElement();

        // console.log(params);

        handleTask(params.taskObj);
    }

    function handleTask(task) {
        let promises = taskHandle(task, params, taskProgress);

        promises.then(() => {

            task.complete && task.complete();

        }).catch((err) => {
            console.error(err);
        }).then(() => { // 一个任务完成

            // 完成数增加
            params.taskFinish++;

            // 获取下一个任务
            if (!taskQuene.isEmpty()) {
                params.taskObj = taskQuene.dequeueElement();
                handleTask(params.taskObj);
            } else {
                new Promise( resolve => {
                    complete && complete();
                    resolve();
                    return ;
                }).catch( err => {
                    console.error(err.name, ' : ',err.message);
                }).then( () => {
                    complete = function(){};
                    if (params.taskFinish === params.taskTotal) taskRun = false;
                });

            }

        });
    }

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