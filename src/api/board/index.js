import Router from 'koa-router';
import * as boardCtrl from './board.ctrl';

const board = new Router();

// const printInfo = ctx => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params
//   };
// };

// board.get('/', printInfo);
// board.post('/', printInfo);
// board.get('/:id', printInfo);
// board.get('/:id', printInfo);
// board.delete('/:id', printInfo);
// board.patch('/:id', printInfo);

board.get('/', boardCtrl.list);
board.post('/', boardCtrl.write);
board.get('/:id', boardCtrl.read);
board.get('/:id', boardCtrl.remove);
board.delete('/:id', boardCtrl.remove);
board.patch('/:id', boardCtrl.update);

export default board;
