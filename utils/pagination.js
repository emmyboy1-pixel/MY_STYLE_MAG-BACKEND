const paginate = (limit, page) => {
  return (page - 1) * limit;
};

export default paginate;
