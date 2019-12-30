import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  nickname: String,
  hashedPassword: String,
  history: [String]
});

UserSchema.methods.setPassword = async function(password) {
  const hash = await bcrypt.hash(password, 10);
  this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.statics.findByUsername = function(username) {
  return this.findOne({ username });
};

UserSchema.methods.serialize = function() {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

UserSchema.methods.generateToken = function() {
  const token = jwt.sign(
    //첫 파라미터에는 토큰 안에 넣고싶은 데이터 넣기
    {
      _id: this.id,
      username: this.username,
      nickname: this.nickname,
      history: this.history
    },
    process.env.JWT_SECRET, //두번째로는 암호
    {
      expiresIn: '7d' //7일 유효
    }
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
