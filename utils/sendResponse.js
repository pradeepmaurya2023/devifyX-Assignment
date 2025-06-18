// will send same strucuter response
const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ message, ...(data && { data }) });
};

module.exports = sendResponse;
