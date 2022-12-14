import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {

  getComments = async (movie) => await this
    ._load({url: `comments/${movie.id}`})
    .then(ApiService.parseResponse);

  addComment = async (movie, localConmment) => {
    const response = await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(this.#adaptToServer(localConmment)),
    });

    return await ApiService.parseResponse(response);
  };

  deleteComment = async (conmment) => {
    const response = await this._load({
      url: `comments/${conmment.id}`,
      method: Method.DELETE,
    });

    return response;
  };

  #adaptToServer = (localConmment) => {
    const adaptedComment = {
      ...localConmment,
    };

    delete adaptedComment.id;
    delete adaptedComment.author;
    delete adaptedComment.date;

    return adaptedComment;
  };
}
