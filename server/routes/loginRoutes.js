const UserSchema = require('../models/UserSchema')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()


router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ msg: 'Email, password, and username are required' });
  }

  if (password.length < 8) {
    return res.status(400).json({ msg: 'Password should be at least 8 characters long' });
  }

  const existingEmail = await UserSchema.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ msg: 'Email already exists' });
  }

  const existingUsername = await UserSchema.findOne({ username });
  if (existingUsername) {
    return res.status(400).json({ msg: 'Username already exists' });
  }

  const newUser = new UserSchema({ email, password, username });
  bcrypt.hash(password, 7, async (err, hash) => {
    if (err) {
      return res.status(400).json({ msg: 'Error while saving the password' });
    }

    newUser.password = hash;
    const savedUserRes = await newUser.save();

    if (savedUserRes) {
      return res.status(200).json({ msg: 'User is successfully saved' });
    }
  });
});




router.post(`/login`, async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ msg: 'Something missing' })
  }

  const user = await UserSchema.findOne({ email: email }) // finding user in db
  if (!user) {
    return res.status(400).json({ msg: 'User not found' })
  }

  const matchPassword = await bcrypt.compare(password, user.password)
  if (matchPassword) {
    const userSession = { email: user.email } // creating user session to keep user loggedin also on refresh
    req.session.user = userSession // attach user session to session object from express-session

    return res
      .status(200)
      .json({ msg: 'You have logged in successfully', userSession }) // attach user session id to the response. It will be transfer in the cookies
  } else {
    return res.status(400).json({ msg: 'Invalid credential' })
  }
})

router.delete(`/logout`, async (req, res) => {
  req.session.destroy((error) => {
    if (error) throw error

    res.clearCookie('session-id') // cleaning the cookies from the user session
    res.status(200).send('Logout Success')
  })
})

router.get('/isAuth', async (req, res) => {
  try {
    if (req.session.user) {
      return res.json(req.session.user);
    } else {
      return res.status(401).json('Unauthorized');
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json('Internal Server Error');
  }
});

module.exports = router
