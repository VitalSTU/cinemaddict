import UserProfileView from './view/header/user-profile-view.js';
import StatisticsView from './view/footer/statistics-view.js';

import MoviesPresenter from './presenter/movies-presenter.js';

import MoviesModel from './model/movies-model.js';
// import CommentsModel from './model/comments-model.js';//TODO delete
import MoviesApiService from './api/movies-api-service';

import { render } from './framework/render.js';
import { AUTHORIZATION, END_POINT } from './const.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterElement = document.querySelector('.footer');

// const commentsModel = new CommentsModel();//TODO delete
const moviesModel = new MoviesModel(new MoviesApiService(END_POINT, AUTHORIZATION));
const moviesPresenter = new MoviesPresenter();

render(new UserProfileView(), siteHeaderElement);
render(new StatisticsView(moviesModel.movies.length), siteFooterElement);
moviesPresenter.init(siteMainElement, moviesModel/*, commentsModel*/);//TODO delete commentsModel
moviesModel.init();
