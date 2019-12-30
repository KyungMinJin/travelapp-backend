import Router from 'koa-router';
import * as boardCtrl from './board.ctrl';

const boards = new Router();

boards.get('/', boardCtrl.list);
boards.post('/', boardCtrl.write);

const board = new Router(); // /api/board/:id
boards.get('/:id', boardCtrl.read);
boards.delete('/:id', boardCtrl.remove);
boards.patch('/:id', boardCtrl.update);

boards.use('/:id', boardCtrl.checkObjectId, board.routes());

export default boards;
