/**
 * 所有 page 基类
 */

import pageManage from './pageManage'

function PageBase(name) {

  if (name && name !== '' && (typeof name == 'string')) {

    this.name = name

  } else {

    this.name = '';
    console.log('you should call PageManage with name param');

  }

  this.ctx = this;
  this._entered = false;
  // this.delayEmitEnter = false;

  this.pageManage = pageManage;

  this.curPage = null;

  /**
   * 需要 Vue 页面响应的数据
   * @type {Object}
   */
  this.state = {
    visible: false,
  };

  /**
   * 保存上一页传递到当前页的参数
   */
  this.pageArgs = [];

  /**
   * 这个函数在页面切换时显示页面调用，这里仅仅会把this.state.visible设置为true，Vue页面需要响应state.visible来显示或者隐藏页面，
   * 其中会调用this.enter如果需要在进入页面时进行操作，子类需要实现this.enter函数
   * @private
   */
  this._enter = function() {

    console.log(`[PageBase] show page ${this.name}`);

    this.state.visible = true;
    this.curPage = this.pageManage.curPage;

    // if (this.frameUpdate && this.sceneName) {
    //   let app = this.curPage[this.sceneName];
    //   app.onUpdate(this._update, this.ctx);
    // }

    this._entered = false;

    this.enter && this.enter.call(this.ctx, ...this.pageArgs);

  };

  /**
   * 这个函数在页面切换时隐藏页面调用，这里仅仅会把this.state.visible设置为false，Vue页面需要响应state.visible来显示或者隐藏页面，
   * 其中会调用this.exit如果需要在退出页面时进行操作，子类需要实现this.exit函数
   * @private
   */
  this._exit = function() {

    console.log(`[PageBase] hide page ${this.name}`);

    this.state.visible = false;
    this.exit && this.exit.call( this.ctx );

  }

  this._update = function(ftime){
    this.frameUpdate && this.frameUpdate.call(this.ctx, ftime);
  }

  this.addPage = function(pageName) {

    if (this.name === '') {
      if (pageName && pageName !== '' && typeof pageName === 'string') {
        this.name = pageName
      } else {
        console.error('you should set page name in the call pageBase')
      }
    }

    let page = this.pageManage.pages[this.name];
    if (!page) {
      this.pageManage.pages[this.name] = this;
      console.log(`[PageBase] add page ${this.name} success`);
    } else {
      console.warn(`[PageBase] the page of name ${this.name} have aready exist`);
    }

  }

  if (this.name !== '') this.addPage();

}

export default PageBase;
