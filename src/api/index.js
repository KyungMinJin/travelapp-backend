import Router from 'koa-router';
import board from './board';

const api = new Router();

api.use('/board', board.routes());

//라우터 내보내기
export default api;
