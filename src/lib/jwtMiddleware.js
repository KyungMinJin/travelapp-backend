import jwt from 'jsonwebtoken';
import User from '../models/user';

const jwtMiddleware = (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    ctx.state.user = {
      _id: decoded._id,
      username: decoded.username,
      nickname: decoded.nickname,
      history: decoded.history
    };
    //토큰 유효기간 3.5일 이내면 재발급
    const now = Math.floor(Date.now() / 1000);
    return next();
  } catch (e) {
    // 토큰 검증 실패
    return next();
  }
};

export default jwtMiddleware;
