const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')


// Redirect to github sign in page
// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github', 
  (req, res, next) => {
    // Get user id from url query
    const localUserId = req.query.userId
    // Pass state through so we can access it in callback request
    // Cannot put in session, gets wiped by github session
    passport.authenticate('github', {
      scope: ['user:email'],
      state: localUserId  
    })
    (req, res, next);
  }
);


// Request github again for access token 
router.get('/github/callback', 
  (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/' }, async (err, githubUser, info) => {
      if (err) return next(err);
      
      if (!githubUser) return res.redirect('/');

      // Gets user from state passed earlier
      const localUserId = req.query.state
      if (!localUserId) return res.status(400).send('Missing local user ID');

      const user = await User.findById(localUserId);
      if (!user) return res.status(404).send('User not found');

      console.log("ID", githubUser.id);
      console.log("USERNAME", githubUser.username)

      // Ensures same user doesn't create two accounts
      const originalUser = await User.findOne({ 'github.id': githubUser.id });

      if (originalUser && originalUser._id.toString() !== localUserId) {
        return res.redirect('http://localhost:5173/github-error');
      }

      // Puts github info in user DB
      user.github = {
        id: githubUser.id,
        username: githubUser.username,
        accessToken: githubUser.accessToken
      }
      
      await user.save()

      res.redirect('http://localhost:5173/github-success');

    })
    (req, res, next)
  }
)


module.exports = router