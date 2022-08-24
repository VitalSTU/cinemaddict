import MoviesPresenter from './presenter/movies-presenter.js';
import PopupPresenter from './presenter/popup-presenter.js';
import UserProfileView from './view/header/user-profile-view.js';
import StatisticsView from './view/footer/statistics-view.js';
import MoviesModel from './model/movies-model.js';
import CommentsModel from './model/comments-model.js';

import { render } from './render.js';

const siteHeaderElement = document.querySelector('.header');
const siteBodyElement = document.querySelector('body');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

const moviesModel = new MoviesModel();
const commentsModel = new CommentsModel();
const moviesPresenter = new MoviesPresenter();
const popupPresenter = new PopupPresenter();

render(new UserProfileView(), siteHeaderElement);
render(new StatisticsView(), siteFooterElement);
moviesPresenter.init(siteMainElement, moviesModel);

const testMovie = [...moviesModel.getMovies()][0];
popupPresenter.init(siteBodyElement, testMovie, commentsModel);
