
import {imgScrs} from '../src/config'
import taskManage from '../src/taskManage';

let imgContainer = document.createElement('div');
imgContainer.setAttribute('id', 'preloadImg');
imgContainer.style.display = 'none';
document.body.appendChild(imgContainer);

let taskList = [
    {
        type: 'loadJsFile',
        percent: 20,
        priority: 0,
        complete: function() {
            console.log('loadJsFile completed!');
        }
    },
    {
        type: 'loadImage',
        relay: imgScrs,
        success: function(obj) {
            imgContainer.appendChild(obj);
        },
    },
    {
        type: 'test',
        handle: function(resolve, reject) {
            taskManage.add({
                type: 'test2',
                handle: function(resolve, reject) {
                    this.progress();
                    return resolve();
                }
            });
            this.progress();
            return resolve();
        }
    }
];

for(let i = 0; i < taskList.length; i++) {
    taskManage.add(taskList[i]);
}

taskManage.setProgress((per) => {
    console.log('percent:',per);
});
taskManage.setComplete(() => {
});

// taskManage.start();