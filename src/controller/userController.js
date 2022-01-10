import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

export const getJoin = (req, res) => {
  res.render('user/join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
  const { userId, password, password2, email, location } = req.body;
  if (password !== password2) {
    return res.status(400).render('user/join', {
      pageTitle: 'Join',
      errorMessage: 'Password field and password confirmation field do not match',
    });
  }
  const user = await User.create({
    userId,
    password,
    email,
    location,
  });
  res.status(200).redirect('/');
};

export const getLogin = (req, res) => {
  res.status(200).render('user/login', { pageTitle: 'Login' });
};

export const postLogin = async (req, res) => {
  const { userId, password } = req.body;
  const user = await User.findOne({ userId });
  if (!user) {
    return res
      .status(400)
      .render('user/login', { pageTitle: 'Login', errorMessage: 'User ID does not exist' });
  }
  const checkedPwd = await bcrypt.compare(password, user.password);
  if (!checkedPwd) {
    return res
      .status(400)
      .render('user/login', { pageTitle: 'Login', errorMessage: "Password don't match" });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.status(200).redirect('/');
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

export const getEditUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).render('404', { pageTitle: '404 Error' });
  }
  res.render('user/profile', { pageTitle: 'Profile', user });
};

export const postEditUser = async (req, res) => {
  const { id } = req.params;
  const { userId, email, location } = req.body;
  await User.findByIdAndUpdate(
    id,
    {
      userId,
      email,
      location,
    },
    { new: true }
  );
  res.redirect('/');
};

export const getTrueLeave = (req, res) => {
  res.render('user/trueLeave', { pageTitle: 'True Leave?' });
};

export const postTrueLeave = async (req, res) => {
  const { userId, password, lastWord } = req.body;
  const user = req.session.user;
  if (user.userId !== userId) {
    return res.status(400).render('user/trueLeave', {
      pageTitle: 'True Leave?',
      errorMessage: 'No matching accounts exist',
    });
  }
  const isMatchPwd = await bcrypt.compare(password, user.password);
  if (!isMatchPwd) {
    return res.status(400).render('user/trueLeave', {
      pageTitle: 'True Leave?',
      errorMessage: 'Passwords do not match',
    });
  }
  const confirmationWord = 'Wetube byebye';
  console.log(confirmationWord);
  console.log(lastWord);
  if (confirmationWord !== lastWord) {
    return res.status(400).render('user/trueLeave', {
      pageTitle: 'True Leave?',
      errorMessage: 'Last word do not match',
    });
  }
  await User.findByIdAndDelete(user._id);
  req.session.destroy();
  res.redirect('/');
};

export const getChangePwd = (req, res) => {
  res.render('user/changePwd', { pageTitle: 'Change Password' });
};

export const postChangePwd = async (req, res) => {
  const { originPwd, newPwd, confirmationPwd } = req.body;
  const user = req.session.user;
  const userData = await User.findById(user._id);
  if (!userData) {
    return res.redirect('/');
  }
  const isPwdMatch = await bcrypt.compare(originPwd, user.password);
  if (!isPwdMatch) {
    return res.status(400).render('user/changePwd', {
      pageTitle: 'Change Password',
      errorMessage: 'Old Password do not match',
    });
  }
  if (newPwd !== confirmationPwd) {
    return res.status(400).render('user/changePwd', {
      pageTitle: 'Change Password',
      errorMessage: 'Password field and password confirmation field do not match',
    });
  }
  if (originPwd === newPwd) {
    return res.status(400).render('user/changePwd', {
      pageTitle: 'Change Password',
      errorMessage: 'The new password is the same as the previous password and cannot be changed',
    });
  }
  const hashedNewPwd = await bcrypt.hash(newPwd, 5);
  await User.updateOne({ _id: user._id }, { password: hashedNewPwd });
  res.redirect('/');
};

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.CLIENT_ID,
    redirect_url: 'http://localhost:4000/users/github/finish',
    scope: 'read:user user:email',
  };
  const option = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${option}`;
  res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
  };
  const option = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${option}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();
  if ('access_token' in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const certifiedEmail = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!certifiedEmail) {
      return res.redirect('/login');
    }
    let user = await User.findOne({
      email: certifiedEmail.email,
    });
    if (!user) {
      user = await User.create({
        userId: userData.login,
        password: '',
        isSocial: true,
        email: certifiedEmail.email,
        location: userData.location ?? '',
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    return res.redirect('/login');
  }
  res.redirect('/');
};
