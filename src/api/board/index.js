import Router from 'koa-router';
import * as boardCtrl from './board.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const boards = new Router();

boards.get('/', boardCtrl.list);
// boards.post('/', boardCtrl.write);
//아래로 하면 로그인 해야 게시물 작성 가능
boards.post('/', checkLoggedIn, boardCtrl.write);

const board = new Router(); // /api/board/:id
board.get('/', boardCtrl.read);
// boards.delete('/:id', boardCtrl.remove);
board.delete('/', checkLoggedIn, boardCtrl.checkOwnPost, boardCtrl.remove);
// boards.patch('/:id', boardCtrl.update);
board.patch('/', checkLoggedIn, boardCtrl.checkOwnPost, boardCtrl.update);

boards.use('/:id', boardCtrl.getBoardById, board.routes());

export default boards;
