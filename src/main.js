import ComponentsPresenter from '../src/presenter/components-presenter.js';
import UserProfileView from '../src/view/user-profile-view.js';
import { render } from '../src/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const componentsPresenter = new ComponentsPresenter();

render(new UserProfileView(), siteHeaderElement);

componentsPresenter.init(siteMainElement);
