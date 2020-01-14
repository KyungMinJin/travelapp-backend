import Board from '../../models/board';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html';
import sanitize from 'sanitize-html';

const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    'h1',
    'h2',
    'b',
    'i',
    'u',
    's',
    'p',
    'ul',
    'ol',
    'li',
    'blockquote',
    'a',
    'img',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target'],
    img: ['src'],
    li: ['class'],
  },
  allowedSchemes: ['data', 'http'],
};

/* 게시물 작성
Post /api/board
{
	"boardClass": 1,
	"title": "수",
  "content" : "testingcont",
  "photos" : "asdfawefawef"
	"category": "미술",
} <=  최소 데이터
*/
export const write = async ctx => {
  const schema = Joi.object().keys({
    //객체가 다음 필드들을 가지고 있는지 검증
    boardClass: Joi.number().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    photos: Joi.string().required(),
    createdAt: Joi.date(),
    views: Joi.number(),
    category: Joi.string().required(),
    evaluation: Joi.number(),
    price: Joi.number(),
    durationStart: Joi.date(),
    durationEnd: Joi.date(),
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
    durationStart,
    durationEnd,
  } = ctx.request.body;
  const board = new Board({
    boardClass,
    title,
    content: sanitizeHtml(content, sanitizeOption),
    photos: removeHtmlexceptImg(photos),
    createdAt,
    views,
    category,
    evaluation,
    price,
    durationStart,
    durationEnd,
    user: ctx.state.user, //게시물 작성자
  });
  try {
    await board.save();
    ctx.body = board;
  } catch (e) {
    ctx.throw(500, e);
  }
};

const removeHtmlexceptImg = content => {
  const filtered = sanitizeHtml(content, {
    allowedTags: ['img'],
    allowedAttributes: {
      img: ['src', 'align', 'data-*'],
    },
    allowedSchemes: ['data', 'http', 'https'],
  });
  return filtered;
  // return filtered.length < 200 ? filtered: `${filtered.slice(0,200)}...`;
};

/** 게시물 조회
 * GET /api/board?board_class=&category=
 * /api/board?boardClass=1 -> 매거진
 * /api/board?boardClass=2 -> 이벤트
 * /api/board?boardClass=3 -> 스토어
 */
export const list = async ctx => {
  //query는 문자열이므로 숫자로 변환
  // 값 없으면 기본값 1
  const page = parseInt(ctx.query.page || '1', 10);

  if (page < 1) {
    ctx.status = 400;
    return;
  }

  const { boardClass, category } = ctx.query;
  // boardClass 유효하면 객체 안에 넣고, 아니면 넣지 않음
  const query = {
    ...(boardClass
      ? boardClass && category
        ? { boardClass: parseInt(boardClass), category: category }
        : { boardClass: parseInt(boardClass) }
      : {}),
  };

  try {
    const boards = await Board.find(query)
      .sort({ _id: -1 }) //역순으로 불러오기
      .limit(10) // 한번에 10개만 보이게
      .skip((page - 1) * 10)
      .lean() //JSON 형태로 조회
      .exec();
    const postCount = await Board.countDocuments(query).exec();
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    ctx.body = boards.map(post => ({
      ...post,
      // photos: sanitizeHtml(post.photos, sanitizeOption),
      content: removeHtmlexceptImg(post.content),
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};

/** 특정 게시물 조회
 * GET /api/board/:id
 */
export const read = ctx => {
  ctx.body = ctx.state.board;
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
    photos: Joi.string(),
    createdAt: Joi.date(),
    views: Joi.number(),
    category: Joi.string(),
    evaluation: Joi.number(),
    price: Joi.number(),
    durationStart: Joi.date(),
    durationEnd: Joi.date(),
  });

  //에러 처리
  const result = Joi.validate(ctx.request.body, schema);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const nextData = { ...ctx.request.body };
  if (nextData.content) {
    nextData.content = sanitizeHtml(nextData.content);
  }
  try {
    const board = await Board.findByIdAndUpdate(id, nextData, {
      new: true, //true 면 새 데이터를 반환 false 면 업데이트 전 데이터 반환
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

/**유효한 아이디인지 체크 */
export const getBoardById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }
  try {
    const board = await Board.findById(id);
    // 포스트가 존재하지 않을 때
    if (!board) {
      ctx.status = 404; //not found
      return;
    }
    ctx.state.board = board;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

//작성자의 게시물인지 확인
export const checkOwnPost = (ctx, next) => {
  const { user, board } = ctx.state;
  if (board.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};
