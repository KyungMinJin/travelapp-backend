import Router from 'koa-router';
import board from './board';
import auth from './auth';

const api = new Router();

api.use('/board', board.routes());
api.use('/auth', auth.routes());
//라우터 내보내기
export default api;
