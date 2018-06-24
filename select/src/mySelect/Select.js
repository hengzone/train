
import SelectParser from './SelectParser'
import selectConfig from '../config/select_config'

class Select {

    constructor(id, arr) {
        this._rootDom = document.getElementById(id);
        this._currentSelectd = null;
        this._inputTimer = null;
        this._searchDelay = selectConfig.search_delay;

        this._drawTimer = null;
        this._drawDelay = selectConfig.draw_delay;
        this._drawIndex = 0;
        this._drawGroupSize = selectConfig.draw_groupSize;

        this._inputValue = '';
        this._lastRes = [];

        this._testArr = SelectParser.arrParser(arr);

        this.Init();
    }

    Drop_hide() {
        this._dropDom.style.display = 'none';
    }
    Drop_show() {
        this._dropDom.style.display = 'block';
    }

    Init() {
        this.Set_dom();
        this.Register_event();
    }

    Input_keyup(event) {

        let text = this._inputDom.value;
        this._inputValue = text;
        let key = event.which != null ? event.which : event.keyCode;

        switch(key) {
            case 8: // TODO
            case 13: // TODO
            case 27: // TODO
                    // ...
                break;
            default:
                // 去抖
                clearTimeout(this._inputTimer);
                this._inputTimer = setTimeout(() => {
                    this.Item_search(text);
                }, this._searchDelay);
                break;
        }

        event.preventDefault();
    }

    Input_val_match(val, regex) {
        let match = regex.exec(val);
        if (match != null ? match[1] : void 0) {
            match.index += 1;
        }
        return match;
    };

    Mouse_click(event) {

        this.Drop_show();
        this._inputDom.focus();

        event.preventDefault();

    }

    Item_search(val) {

        if (val == '') return;

        let item, startpos, prefix, fix, suffix, search_match, text;
        let results = 0;
        let query = val.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '');
        let regex = new RegExp( query, 'i');
        let arr = this._testArr;

        this._lastRes = [];

        for (let i = 0, len = arr.length; i < len; i++) {

            item = arr[i];
            item.search_match = false;
            search_match = null;

            text = item.text;
            search_match = this.Input_val_match(text, regex);
            item.search_match = search_match != null;
            if (item.search_match) {
                results += 1;

                // 保存结果
                this._lastRes.push(item);

                if (query.length) {
                    startpos = search_match.index;
                    prefix = text.slice(0, startpos);
                    fix = text.slice(startpos, startpos + query.length);
                    suffix = text.slice(startpos + query.length);
                    item.highlighted_html = prefix + "<em>" + fix + "</em>" + suffix;
                }
            }

        }

        if (results < 1 && query.length) {
            console.log('没有结果！');
            return ;
        } else {
            // TODO: to draw
            this.Draw_res();
        }

    }

    Item_click(event) {

        this._currentSelectd = event.target;

        this._selectdDom.innerHTML = this._currentSelectd.innerText;

        this.Drop_hide();

        event.preventDefault();

    }

    Draw_res() {

        if(this._lastRes.length < 1) return;

        if(this._drawTimer) {
            clearTimeout(this._drawTimer);
        }
        this._drawIndex = 0;
        let groups = this.Make_group(this._lastRes, this._drawGroupSize);
        console.log(groups)
        for (let i = 0, len = groups.length; i < len; i++) {

            this._drawTimer = setTimeout(() => {
                let group = groups[i];
                let index = i + 1;
                this.Add_item(group, index);
            }, this._drawDelay);

        }

    }

    Add_item(arr, index) {

        let html = '';
        for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i];
            html += '<li>'+ item.highlighted_html +'</li>'
        }

        while (index - this._drawIndex == 1) {
            this._listDom.innerHTML = html;
            this._drawIndex = index;
        }

    }

    /**
     * 将大数组分成几个小数组
     * @param arr 原数组
     * @param range 分组大小
     */
    Make_group(arr, range = 500) {

        let resArr = [];

        for (let i = 0, len = arr.length; i < len; i += range) {

            resArr.push(arr.slice(i, i + range));

        }

        return resArr;

    }

    Register_event() {

        this._btnDom.onclick = (event) => {
            this.Mouse_click(event);
        };

        this._listDom.onclick = (event) => {
            this.Item_click(event);
        }

        this._inputDom.onkeyup = (event) => {
            this.Input_keyup(event)
        }

    }

    Set_dom() {

        this._inputDom = this._rootDom.getElementsByClassName('select-input')[0];
        this._btnDom = this._rootDom.getElementsByClassName('select-item')[0];
        this._listDom = this._rootDom.getElementsByClassName('select-list')[0];
        this._dropDom = this._rootDom.getElementsByClassName('select-drop')[0];
        this._selectdDom = this._rootDom.getElementsByClassName('selected-item')[0];

    }
}

export default Select;