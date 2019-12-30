import Board from '../../models/board';

/* 매거진 작성
Post /api/board
{board_class, title, content, category, price, duration} <= 후에 이 형식으로 맞추기
*/
export const write = async ctx => {
  // REST API의 req body 는 ctx.request.body에서 조회할 수 있습니다.
  const {
    board_class, // <= 후에 이 형식으로 맞추기
    title,
    content,
    photos,
    created_at,
    views,
    category,
    evaluation,
    price,
    duration
  } = ctx.request.body;
  const board = new Board({
    board_class,
    title,
    content,
    photos,
    created_at,
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
  try {
    const boards = await Board.find().exec();
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
export const remove = ctx => {
  // const { id } = ctx.params;
  // const index = board.findIndex(p => p.board_id.toString() === id);
  // //포스트 없으면 오류
  // if (index === -1) {
  //   ctx.status = 404;
  //   ctx.body = {
  //     message: '포스트가 존재하지 않습니다.'
  //   };
  //   return;
  // }
  // post.slice(index, 1);
  // ctx.status = 204; //NO content
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
export const update = ctx => {
  //주어진 필드만
  // const { id } = ctx.params;
  // const index = board.findIndex(p => p.id.toString() === id);
  // if (index === -1) {
  //   ctx.status = 404;
  //   ctx.body = {
  //     message: '포스트가 존재하지 않습니다.'
  //   };
  //   return;
  // }
  // //기존 값에 정보 덮기
  // board[index] = {
  //   ...board[index],
  //   ...ctx.request.body
  // };
  // ctx.body = board[index];
};
