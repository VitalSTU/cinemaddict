import Observable from '../framework/observable.js';

export default class AbstractCommentsObservable extends Observable {

  /**
   * Delete one comment by its id
   * @abstract
   */
  deleteCommentById = () => {
    throw new Error('Abstract method not implemented: deleteCommentById');
  };
}
