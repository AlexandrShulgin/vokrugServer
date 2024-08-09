const axios = require('axios');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const querystring = require('querystring');

const getToken = async (code) => {
  const client_id = '85d13ff8593a461a9d0d6328dc713073';
  const client_secret = '673144e468a44d69952bff4f32df0f25';
  const redirect_uri = 'http://5.35.44.198:3000/auth/callback';

  const authHeader = `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`;

  const response = await axios.post('https://oauth.yandex.ru/token', querystring.stringify({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect_uri
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authHeader
    }
  });

  return response.data;
};

const getUserInfo = async (token) => {
  const response = await axios.get('https://login.yandex.ru/info', {
    headers: {
      'Authorization': `OAuth ${token}`
    }
  });
  return response.data;
};

const yandexAuth = async (req, res) => {
  const { code } = req.body;

  try {
    const tokenData = await getToken(code);
    const userInfo = await getUserInfo(tokenData.access_token);
    let user = await User.findOne({ y_id: userInfo.id });
    if (!user) {
      user = new User({
        y_id: userInfo.id,
        email: userInfo.default_email,
        display_name: userInfo.display_name,
        avatar_id: userInfo.default_avatar_id,
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { yandexAuth };
