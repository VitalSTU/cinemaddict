const getCommentsByIds = (ids, comments) => comments.filter((c) => ids.includes(c.id));

export { getCommentsByIds };
