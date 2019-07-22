import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import Navbar from '~/components/layout/navbar.vue'

const stubs = {
  NuxtLink: RouterLinkStub,
  BIcon: '<i />'
}
//

describe('Navbar', () => {
  // test('renders correctly', () => {
  //  const wrapper = shallowMount(Navbar, { stubs })
  //  expect(wrapper.element).toMatchSnapshot()
  // })
  test('is a Vue instance', () => {
    const wrapper = shallowMount(Navbar, { stubs })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
