import UserProfileView from './view/header/user-profile-view.js';
import StatisticsView from './view/footer/statistics-view.js';

import MoviesPresenter from './presenter/movies-presenter.js';

import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import { render } from './framework/render.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();

const moviesPresenter = new MoviesPresenter();

render(new UserProfileView(), siteHeaderElement);
render(new StatisticsView(moviesModel.movies.length), siteFooterElement);
moviesPresenter.init(siteMainElement, moviesModel, commentsModel);
