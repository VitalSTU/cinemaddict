import PopupWithoutCommentsView from '../view/popup/popup-without-comments-view.js';

import { render } from '../render.js';

export default class PopupPresenter {
  popup = new PopupWithoutCommentsView(this.movie, this.comments);

  init = (contentContainer, movie, commentsModel) => {
    this.contentContainer = contentContainer;
    this.movie = movie;
    this.comments = [...commentsModel.getComments()];

    render(this.popup, this.contentContainer);
  };
}
