import mongoose from 'mongoose';

const { Schema } = mongoose;

const BoardSchema = new Schema({
  boardClass: Number,
  title: String,
  content: String,
  photos: [String], //링크
  createdAt: { type: Date, default: Date.now }, // 작성시간
  views: { type: Number, default: 0 }, //조회 수
  category: String,
  evaluation: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  duration: String
});

const Board = mongoose.model('Board', BoardSchema);
export default Board;
