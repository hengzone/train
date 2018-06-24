
let SelectParser = (function() {
    this.arr = [];
    this.index = 0;
});

SelectParser.prototype.addItem = function(item) {

    this.arr.push({
        array_index: this.arr.length,
        options_index: this.index,
        value: item.value,
        text: item.value,
    });

    return this.index += 1;

};

SelectParser.arrParser = function(arr) {

    if (Object.prototype.toString.call(arr) !== '[object Array]') {
        throw new TypeError('[selectPaeser.arrParser] 类型错误');
    }

    let parser = new SelectParser();
    for (let i = 0, len = arr.length; i < len; i++) {
        parser.addItem(arr[i]);
    }

    return parser.arr;

};

export default SelectParser;