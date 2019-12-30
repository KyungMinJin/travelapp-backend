import Board from '../../models/board';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

/**유효한 아이디인지 체크 */
export const checkObjectId = (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  return next();
};

/* 게시물 작성
Post /api/board
{
	"boardClass": 1,
	"title": "수",
	"content" : "testingcont",
	"category": "미술"
} <=  최소 데이터
*/
export const write = async ctx => {
  const schema = Joi.object().keys({
    //객체가 다음 필드들을 가지고 있는지 검증
    boardClass: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    photos: Joi.array().items(Joi.string()),
    createdAt: Joi.date(),
    views: Joi.number(),
    category: Joi.string().required(),
    evaluation: Joi.number(),
    price: Joi.number(),
    duration: Joi.string()
  });

  //검증하고 나서 검증 실패면 에러 처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  // REST API의 req body 는 ctx.request.body에서 조회할 수 있습니다.
  const {
    boardClass, // <= 후에 이 형식으로 맞추기
    title,
    content,
    photos,
    createdAt,
    views,
    category,
    evaluation,
    price,
    duration
  } = ctx.request.body;
  const board = new Board({
    boardClass,
    title,
    content,
    photos,
    createdAt,
    views,
    category,
    evaluation,
    price,
    duration
  });
  try {
    await board.save();
    ctx.body = board;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/** 게시물 조회
 * GET /api/board
 */
export const list = async ctx => {
  //query는 문자열이므로 숫자로 변환
  // 값 없으면 기본값 1
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  try {
    const boards = await Board.find()
      .sort({ _id: -1 }) //역순으로 불러오기
      .limit(10) // 한번에 10개만 보이게
      .skip((page - 1) * 10)
      .exec();
    const postCount = await Board.countDocuments().exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = boards;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/** 특정 게시물 조회
 * GET /api/board/:id
 */
export const read = async ctx => {
  const { id } = ctx.params;
  //주어진 id 로 게시물 찾기
  try {
    const board = await Board.findById(id).exec();
    if (!board) {
      ctx.status = 404; // 없는 게시물
      return;
    }
    ctx.body = board;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**특정 게시물 제거
 * DELETE /api/board/:id
 */
export const remove = async ctx => {
  const { id } = ctx.params;
  try {
    await Board.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

/**포스트 수정(교체)
 * PUT api/board/:id
 * {board_class, title, content, category, price, duration}
 */
export const replace = ctx => {
  //통째로
  // const { id } = ctx.params;
  // const index = board.findIndex(p => p.id.toString() === id);
  // if (index === -1) {
  //   ctx.status = 404;
  //   ctx.body = {
  //     message: '포스트가 존재하지 않습니다.'
  //   };
  //   return;
  // }
  // //전체 덮어씌우기
  // board[index] = {
  //   id,
  //   ...ctx.request.body
  // };
  // ctx.body = board[index];
};

/**특정 필드 변경
 * PATCH /api/board/:id
 * {board_class, title, content, category, price, duration}
 */
export const update = async ctx => {
  //주어진 필드만
  const { id } = ctx.params;

  const schema = Joi.object().keys({
    boardClass: Joi.number(),
    title: Joi.string(),
    content: Joi.string(),
    photos: Joi.array().items(Joi.string()),
    createdAt: Joi.date(),
    views: Joi.number(),
    category: Joi.string(),
    evaluation: Joi.number(),
    price: Joi.number(),
    duration: Joi.string()
  });

  //에러 처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const board = await Board.findByIdAndUpdate(id, ctx.request.body, {
      new: true //true 면 새 데이터를 반환 false 면 업데이트 전 데이터 반환
    }).exec();
    if (!board) {
      ctx.status = 404;
      return;
    }
    ctx.body = board;
  } catch (e) {
    ctx.throw(500, e);
  }
};
