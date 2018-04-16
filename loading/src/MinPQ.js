/**
 * 优先队列
 */

let MinPQ = (function() {

    let items = null;

    /**
     * 优先队列元素（元素，优先级）
     */
    class QueueElement {
        constructor(element, priority){
            this.element = element;
            this.priority = priority;
        }
    }

    class MinPQ {

        constructor(...args) {
            items = [];
        }

        enqueue(element, priority) {
            let queueElement = new QueueElement(element, priority);

            this._sink(queueElement);
        }

        _sink(newQueueElement) {

            let added = false;
            for (let i = 0; i < items.length; i++) {
                if (newQueueElement.priority < items[i].priority) {
                    items.splice(i, 0, newQueueElement);
                    added = true;
                    break;
                }
            }
            if (!added){
                items.push(newQueueElement);
            }

        }

        dequeue() {
            return items.shift();
        }

        dequeueElement() {
            return items.shift().element;
        }

        front() {
            return items[0];
        }

        isEmpty() {
            return items.length == 0;
        }

        size() {
            return items.length;
        }

        clear() {
            items = [];
            return items;
        }

        print(){
            for (let i = 0; i < items.length; i++){
                console.log(items[i].element, ' : ', items[i].priority);
            }
        }

    }

    return MinPQ;

})();

export default MinPQ;