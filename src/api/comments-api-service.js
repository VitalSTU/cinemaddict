import ApiService from '../framework/api-service.js';

const Method = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {

  getComments = async (movie) => {
    return this._load({url: `comments/${movie.id}`})
      .then(ApiService.parseResponse);
  };

  postComment = async (movie, localConmment) => {
    const response = await this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      headers: new Headers({'Content-Type': 'application/json'}),
      body: JSON.stringify(localConmment),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deleteComment = async (conmment) => {
    const response = await this._load({
      url: `comments/${conmment.id}`,
      method: Method.DELETE,
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };
}
