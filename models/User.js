const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// const saltRounds = 10; // 암호화하는 salt 자릿수
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  nikname: {
    type: String,
    minlength: 3,
  }, //닉네임

  country: {
    type: String,
  }, //관심 국가, api 연결해야함.
  univ: {
    type: String,
  }, //관심 대학, api 연결필요.
});

// callback function 1개 = user
userSchema.methods.generateToken = function (cb) {
  const user = this;
  /*
    jsonwebtoken을 이용해서 token 생성하기 
    token 형태 
    user._id + 'secretToken' = token;
    user.token = token; 
  */
  let token = jwt.sign(user._id.toHexString(), "secretToken");
  // user token 값 저장 (값있을 경우=로그인, 비어있을경우=로그아웃)
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

/*
  methods 에서의 this 호출한애  // 여기선 userSchema
  statics 에서의 this 모델 그 자체 // 여기선 mongoose 모델  
*/
// 복호화
userSchema.statics.findByToken = function (token, cb) {
  const user = this;
  // 토큰을 decode 한다.
  // user._id + '' = token; 형태
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    // findOne mongoDB method
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      // 에러 있을 경우 error 콜백
      if (err) return cb(err);
      // 에러 없을 경우 user 정보 콜백함수로 보내줌
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

// 다른 파일에서도 사용 할 수 있도록 모듈을 export 해준다.
module.exports = { User };
