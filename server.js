const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require('dotenv').config({path:'variables.env'});

//connect 부분
mongoose.connect(process.env.MONGODB_URL,{useUnifiedTopology:true})
    .then(() => {
        console.log("Connected to database successfully");
    })
    .catch((err) => {
        console.error("Error connecting to database", err);
    });
    
const validCountry = ["가나","가봉","가이아나","감비아","캐나다"];
const validUniversity = ["대학1","대학2","대학3"];

//모델정의
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3, //최소길이
        unique: true // 중복되지 않은 유니크한 키로 사용할거임
    },
    country: {
        type: [{
            type : String,
            enum : validCountry
        }],
        validate: {
            validator: function(v) {
                return v.length <= 3; // 최대 3개의 국가
            },
            message: props => `${props.value} 3개 이상을 초과할 수 없음`
        }
    },
    university: {
        type: String,
        enum: validUniversity
    },
    url: Buffer // 대학교 재학증명서를 어떤식으로 받아야할지 잘 모르겠음..
});

const User = mongoose.model('User', userSchema);

// 새로운 사용자 넣음
const User1 = new User({
    name: "John Doe",
    country: ["가나", "캐나다"],
    university: "대학1",
    url: Buffer.from('pdf_data_here') // ????? 이 부분은 잘 모르겠음
});

const User2  = new User({
    name: "John",
    country: ["캐나다"],
    university: "대학3",
    url: Buffer.from('pdf_data_here') 
});
// 사용자 저장
User1.save()
    .then(() => {
        console.log("User created successfully");
    })
    .catch((err) => {
        console.error("Error creating user", err);
    });

    // 사용자 저장
User2.save()
.then(() => {
    console.log("User created successfully");
})
.catch((err) => {
    console.error("Error creating user", err);
});