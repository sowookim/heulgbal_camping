const {
  generateAccessToken,
  generateRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require('../TokenFunction');

const { user } = require('../../models/users');

module.exports = async (req, res) => {
  const { business_number, password } = req.body;
  
  const userInfo = await user.findOne({where: {business_number, password}});

  // 입력받은 정보가 데이터베이스에 있는 정보와 일치 하지 않을 경우
  if (!userInfo) return res.status(401).send('id or password is not authorized')
  // 로그인 성공시 쿠키로 JWT 토큰 전달
  else {
    const data = {
    business_number: userInfo.dataValues.business_number,
    password: userInfo.dataValues.password,
    name: userInfo.dataValues.name,
    email: userInfo.dataValues.email,
    phone: userInfo.dataValues.phone,
    business_name: userInfo.dataValues.business_name,
    business_address: userInfo.datavalues.business_address,
    email_authrization: userInfo.dataValues.email_authrization,
    type: userInfo.dataValues.type,
    };

    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);

    sendAccessToken(res, accessToken, data);
    sendRefreshToken(res, refreshToken);
  };

};