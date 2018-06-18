
import pageManage from './pageManage'
import pageBase from './pageBase'

let defaultPage = {

  name: 'defaultPage',

  props: {
    name: String,
    enter: Function,
    exit: Function
  },

  data() {
    return {
      _page:null,
      state:null
    }
  },

  created() {

    if ( !this.name ) {
      console.error(`[defaultPage] must have a page name`);
      return;
    }

    console.log(`[defaultPage] created ${this.name}`);

    if( pageManage.pages[this.name]  ) {
      console.error(`[defaultPage] alreay has page ${this.name}`);
      return;
    }

    pageManage.pages[this.name] = new pageBase(this.name);

    this.page = pageManage.pages[this.name];
    // this.page.delayEmitEnter = true;

    this.state = this.page.state;

    let slots = this.$slots.default;
    let root = slots && slots.length > 0 ? slots[0] : null;
    if( this.enter ) this.page.enter = this.enter;
    if( this.exit ) this.page.exit = this.exit;

    if( root ) {

      let Options = root.componentOptions.Ctor.extendOptions;

      if( Options ) {

        if( Options.onEnter ) this.page.enter = Options.onEnter;
        if( Options.onExit ) this.page.exit = Options.onExit;

      }

    }

  },

  destroyed () {

    console.log(`[defaultPage] destroyed ${this.name}`);
    pageManage.pop( this.name );
    pageManage.pages[this.name] = null;
    this.page = null;

  },

  mounted(){
  },

  render: function render (c) {

    let slots = this.$slots.default;

    if( this.page.state.visible ) {

      let vnode =  c('div',{class:'ddd-page'}, slots);

      this.$nextTick( () => {

        console.log('vnode:', vnode);

        let root = vnode.children[0];

        if( root ) {
          this.page.ctx = root.componentInstance
        }

        // this.page.emitDelayEnter();

      });

      return vnode;

    }

    return null;

  }

};

export default defaultPage;
