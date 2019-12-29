let boardId = 1; //초기 값
let photoId = 1;
//배열 초기 데이터
const board = [
  {
    board_id: 1,
    board_class: 1,
    title: '제목',
    content: '내용',
    post_date: '2019-12-28',
    photo_id: 1,
    clicked_count: 1,
    category: 1,
    eval: 0,
    price: 24.99,
    duration: '2019-09-01 ~ 2020-03-03'
  }
];

/* 매거진 작성
Post /api/board
{board_class, title, content, category, price, duration} <= 후에 이 형식으로 맞추기
*/
export const write = ctx => {
  // REST API의 req body 는 ctx.request.body에서 조회할 수 있습니다.
  const {
    board_class, // <= 후에 이 형식으로 맞추기
    title,
    content,
    post_date,
    clicked_count,
    category,
    eval,
    price,
    duration
  } = ctx.request.body;
  boardId += 1;
  photoId += 1;
  const post = {
    board_id: boardId,
    board_class,
    title,
    content,
    post_date,
    photo_id: photoId,
    clicked_count,
    category,
    eval,
    price,
    duration
  };
  board.push(post);
  ctx.body = post;
};

/** 게시물 조회
 * GET /api/board
 */
export const list = ctx => {
  ctx.body = board;
};

/** 특정 게시물 조회
 * GET /api/board/:id
 */
export const read = ctx => {
  const { id } = ctx.params;
  //주어진 id 로 게시물 찾기
  const post = board.find(p => p.board_id.toString() === id);
  //포스트가 없으면 오류 반환
  if (!post) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.'
    };
    return;
  }
  ctx.body = post;
};

/**특정 게시물 제거
 * DELETE /api/board/:id
 */
export const remove = ctx => {
  const { id } = ctx.params;
  const index = board.findIndex(p => p.board_id.toString() === id);
  //포스트 없으면 오류
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.'
    };
    return;
  }
  post.slice(index, 1);
  ctx.status = 204; //NO content
};

/**포스트 수정(교체)
 * PUT api/board/:id
 * {board_class, title, content, category, price, duration}
 */
export const replace = ctx => {
  //통째로
  const { id } = ctx.params;
  const index = board.findIndex(p => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.'
    };
    return;
  }
  //전체 덮어씌우기
  board[index] = {
    id,
    ...ctx.request.body
  };
  ctx.body = board[index];
};

/**특정 필드 변경
 * PATCH /api/board/:id
 * {board_class, title, content, category, price, duration}
 */
export const update = ctx => {
  //주어진 필드만
  const { id } = ctx.params;
  const index = board.findIndex(p => p.id.toString() === id);
  if (index === -1) {
    ctx.status = 404;
    ctx.body = {
      message: '포스트가 존재하지 않습니다.'
    };
    return;
  }
  //기존 값에 정보 덮기
  board[index] = {
    ...board[index],
    ...ctx.request.body
  };
  ctx.body = board[index];
};
