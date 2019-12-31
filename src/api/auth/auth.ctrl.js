import Joi from 'joi';
import User from '../../models/user';

/**{
	"username": "jinkyungmin1",
	"nickname": "할수이써",
	"password": "mypass123"
} */
export const register = async ctx => {
  //회원가입
  const schema = Joi.object().keys({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(20)
      .required(),
    nickname: Joi.string().required(),
    password: Joi.string().required(),
    history: Joi.array().items(Joi.string())
  });

  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { username, nickname, password, history } = ctx.request.body;
  try {
    //username 존재하는지 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409;
      return;
    }

    const user = new User({
      username,
      nickname
    });
    await user.setPassword(password); //비밀번호 설정
    await user.save(); //저장

    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const login = async ctx => {
  // 로그인
  const { username, password } = ctx.request.body;

  //username, password가 없으면 에러 처리
  if (!username || !password) {
    ctx.status = 401; //Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    //계정 없으면 에러
    if (!user) {
      ctx.status = 401;
      return;
    }
    const valid = await user.checkPassword(password);
    //잘못된 비밀번호
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const check = async ctx => {
  //로그인 상태 확인
  const { user } = ctx.state;
  if (!user) {
    //로그인 중이 아님
    ctx.status = 401; //Unauthorized
    return;
  }
  ctx.body = user;
};

export const logout = async ctx => {
  //로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
