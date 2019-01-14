class PriorityQueueElement {            
    constructor(object, priority) {
        this.object = object;
        this.priority = priority;
    }
};        

class PriorityQueue {

    constructor(comparatorCb) {
        this.elements = [];
        this.comparator = comparatorCb;
    }

    add(object, priority) {
        var element = new PriorityQueueElement(object, priority); 
        var contain = false;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.comparator(this.elements[i], element)) {                         
                this.elements.splice(i, 0, element);
                contain = true;
                break;
            }
        }
        if (!contain) {
            this.elements.push(element);
        }
    }

    remove() {
        if (!this.isEmpty()) {
            return this.elements.shift();
        }
    }

    isEmpty() {
        return this.elements.length === 0;
    }

    size() {
        return this.elements.length;
    }
    
    clear() {
        this.elements = [];
    }
};

/*
 var pq = new PriorityQueue(function (a, b) {
    return a.priority > b.priority;
});
 */
