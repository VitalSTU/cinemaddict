import MoviesPresenter from './presenter/movies-presenter.js';
import UserProfileView from './view/header/user-profile-view.js';
import StatisticsView from './view/footer/statistics-view.js';
import MoviesModel from './model/movies-model.js';

import { render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');
const popupContainerElement = document.querySelector('body');

const moviesModel = new MoviesModel();
const moviesPresenter = new MoviesPresenter();

render(new UserProfileView(), siteHeaderElement);
render(new StatisticsView(moviesModel.movies.length), siteFooterElement);
moviesPresenter.init(siteMainElement, moviesModel, popupContainerElement);
