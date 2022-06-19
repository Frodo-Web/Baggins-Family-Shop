const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require("passport");
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
    if (req.user) req.session.viewCount = (req.session.viewCount || 0) + 1;
    res.render('home', { title: "This is the homepage", views: req.session.viewCount });
});
router.get("/log-out", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});
router.get('/sign-up', (req, res) => {
    res.render('sign_up', { title: "This is the Sign Up page" });
});
router.post(
    "/",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );
router.post('/sign-up', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return next(err); }
        const user = new User({
            username: req.body.username,
            password: hashedPassword
          }).save(err => {
            if (err) { 
              return next(err);
            }
            res.redirect("/");
        });
    });

});
module.exports = router;