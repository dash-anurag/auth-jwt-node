const router = require("express").Router();
const verify = require("./privateRoutes");

router.get("/", verify, (req, res) => {
  try {
    res.json({
      posts: {
        title: "my-first-post",
        description: "You are getting this data that means you are logged in",
      },
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
