const DEFAULT_PAGE_LIMIT = 50;

function getPagination(query) {
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const page = Math.abs(query.page) || 1;

  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = {
  getPagination,
};
