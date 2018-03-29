const express = require('express'),
      router = express.Router(),
      pages = require("./pages");

router.get("/index",pages.index);
router.get("/myblog",pages.myblog);

module.exports = router;