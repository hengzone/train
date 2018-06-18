
import defaultPage from './page/defaultPage'
import pageManage from './page/pageManage'

let page = {};

page.install = function(vue, options) {

  //注册组件
  if (!window.pagePlugin) {
    vue.component(defaultPage.name, defaultPage)
  }

};

window.PageManage = pageManage;

export default page;
