import Router from 'koa-router';
import * as board from './board';

const api = new Router();

api.get('/test', ctx => {
  ctx.body = 'test 성공';
});

api.use('/board', board.routes());

//라우터 내보내기
export default api;
