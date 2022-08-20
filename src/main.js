import ComponentsPresenter from './presenter/components-presenter.js';
import UserProfileView from './view/header/user-profile-view.js';
import StatisticsView from "./view/footer/statistics-view.js";
import PopupView from "./view/popup/popup-view.js";

import { render } from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const componentsPresenter = new ComponentsPresenter();

render(new UserProfileView(), siteHeaderElement);
componentsPresenter.init(siteMainElement);
render(new StatisticsView(), siteFooterElement);
render(new PopupView(), siteBodyElement);
