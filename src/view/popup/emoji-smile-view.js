import { createElement } from '../../render';

const createEmojiSmileTemplate = () => '<img src="images/emoji/smile.png" width="55" height="55" alt="emoji-smile">';

export default class EmojiSmileView {
  getTemplate() {
    return createEmojiSmileTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
