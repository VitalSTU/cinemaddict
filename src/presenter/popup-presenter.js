import PopupWithoutCommentsView from '../view/popup/popup-without-comments-view';

import { render } from '../render.js';

export default class PopupPresenter {

  init = (contentContainer, commentsModel) => {
    this.contentContainer = contentContainer;
    this.comments = [...commentsModel.getComments()];

    render(new PopupWithoutCommentsView(), this.contentContainer);
  };
}
