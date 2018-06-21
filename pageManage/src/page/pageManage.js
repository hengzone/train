/**
 * 页面栈
 */

let PageManage = {

  /**
   * 显示中的所有 page
   */
  pageStack: [],

  /**
   * 当前显示的 page
   */
  curPage: null,

  /**
   * 所有 page 对象
   */
  pages: {},

  push(name, ...arg) {

    let p = this.pages[name];

    if (!p) console.error(`[PageMgr] push page ${name} error!`);

    if (arguments.length > 1) {
      let args = [];
      args = Array.prototype.slice.call(arguments, 1); // 取得要传递的参数
      p.pageArgs = args;
    }

    p._enter();
    this.pageStack.push(p);

  },

  pop(name) {

    if (!name) {
      let curPage = this.pageStack.pop();
      if (curPage) curPage._exit();
      return;
    }

    let page = this.pages[name];
    page._exit();

    let index = this.pageStack.indexOf(name);
    if (index > -1) {
      this.pageStack.splice(index, 1);
    }

  },

  replace(name, ...args) {

    let p = this.pages[name];

    if (!p) console.error(`[PageMgr] replace page ${name} error!`);

    this.pop();
    this.push(name, ...args);

  }

}

export default PageManage;
