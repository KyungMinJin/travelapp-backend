import Router from 'koa-router';
import * as boardCtrl from './board.ctrl';

const boards = new Router();

boards.get('/', boardCtrl.list);
boards.post('/', boardCtrl.write);
boards.get('/:id', boardCtrl.read);
boards.put('/:id', boardCtrl.replace);
boards.delete('/:id', boardCtrl.remove);
boards.patch('/:id', boardCtrl.update);

export default boards;
