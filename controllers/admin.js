const express = require('express'),
    router = express.Router(),
    pages = require("./pages");

router.get("/user",pages.admin_user);
router.get("/article",pages.admin_article);
router.get("/authority",pages.admin_authority);

module.exports = router;