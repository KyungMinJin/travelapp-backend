import mongoose from 'mongoose';

function getCurrentDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var today = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  var milliseconds = date.getMilliseconds();
  return new Date(
    Date.UTC(year, month, today, hours, minutes, seconds, milliseconds)
  );
}

const { Schema } = mongoose;

const BoardSchema = new Schema({
  boardClass: Number,
  title: String,
  content: String,
  photos: [String], //링크
  createdAt: { type: Date, default: getCurrentDate() }, // 작성시간
  views: { type: Number, default: 0 }, //조회 수
  category: String,
  evaluation: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  duration: String,
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
    nickname: String
  }
});

const Board = mongoose.model('Board', BoardSchema);
export default Board;
