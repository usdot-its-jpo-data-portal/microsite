import {shallowMount} from '@vue/test-utils';
import DOTCategorySearch from '@/components/dot-category-search.vue';

describe('DOT Microsite - Home : Category Search', () => {
  let $router;
  let $store;
  let committedKey;
  let committedVal;
  let routerPushed;

  beforeEach( () => {
    routerPushed = [];
    $router = {
      push: function(a) {
        routerPushed.push(a);
      }
    };
    $store = {
      commit: function(a,b){
        committedKey = a;
        committedVal = b;
      },
      dispatch: function(a,b){}
    };

  });

  it('contains a title', () => {
    const wrapper = shallowMount(DOTCategorySearch, {attachTo: document.body});
    let f = wrapper.find('h3');
    expect(f.is('h3')).toBe(true);
    expect(f.text()).toMatch('RECOMMENDED DATASET SEARCHES');
  });
  it('renders the right number of categories', () => {
    const wrapper = shallowMount(DOTCategorySearch, {attachTo: document.body});
    let htmlButtons = wrapper.findAll('button');
    let h = htmlButtons.length;
    let b = wrapper.vm.buttons.length;
    expect(h).toEqual(b);
  });
  it('renders the categories label', () => {
    const wrapper = shallowMount(DOTCategorySearch, {attachTo: document.body});
    let htmlButtons = wrapper.findAll('button');
    for(let i=0; i<htmlButtons.length; i++) {
      expect(wrapper.vm.buttons[i].labels).toMatch(htmlButtons.at(i).find('p').text());
    }
  });
  it('renders the categories Alt Text', () => {
    const wrapper = shallowMount(DOTCategorySearch, {attachTo: document.body});
    let htmlButtons = wrapper.findAll('button');
    for(let i=0; i<htmlButtons.length; i++) {
      let img = htmlButtons.at(i).find('img').html();
      let target = `alt="${wrapper.vm.buttons[i].altText}"`;
      let ifAlt = img.includes(target);
      expect(ifAlt).toBe(true);
    }
  });
  it('renders the categories Image source', () => {
    const wrapper = shallowMount(DOTCategorySearch, {attachTo: document.body});
    let htmlButtons = wrapper.findAll('button');
    for(let i=0; i<htmlButtons.length; i++) {
      let img = htmlButtons.at(i).find('img').html();
      let target = `src="${wrapper.vm.buttons[i].imgIcons}"`;
      let ifSrc = img.includes(target);
      expect(ifSrc).toBe(true);
    }
  });
  it('test searchSend', () => {
    const wrapper = shallowMount(DOTCategorySearch, {mocks: { $store, $router }});
    wrapper.vm.searchSend("test");
    expect(committedVal.term).toEqual("test");
    expect(routerPushed[0]).toEqual("search");
  })

});
