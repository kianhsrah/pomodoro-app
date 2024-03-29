const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    console.log("User is authenticated, proceeding to the next middleware/route handler.");
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    console.log("User is not authenticated, blocking access.");
    return res.status(401).send('You are not authenticated'); // User is not authenticated
  }
};

module.exports = {
  isAuthenticated
};