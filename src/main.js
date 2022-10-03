import UserProfileView from './view/header/user-profile-view.js';

import MoviesPresenter from './presenter/movies-presenter.js';

import MoviesModel from './model/movies-model.js';
import MoviesApiService from './api/movies-api-service';

import { render } from './framework/render.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const moviesPresenter = new MoviesPresenter(siteFooterElement);

render(new UserProfileView(), siteHeaderElement);
moviesPresenter.init(siteMainElement, moviesModel);
moviesModel.init();
