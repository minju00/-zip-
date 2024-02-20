module.exports = {
  // 수정필요
  mongoURI:
    "mongodb+srv://Kangjijhye:KvAlworelzt0CSdO@1team.kr1i2d4.mongodb.net/",
  connectMongoDB: async () => {
    try {
      await mongoose.connect(module.exports.mongoURI);
      console.log("MongoDB connected");
    } catch (err) {
      console.error(err);
    }
  },
};
