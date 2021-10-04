import mongoose from "mongoose";

const whatsappSchema = new mongoose.Schema({
  message: {
    type: String,
  },
  name: String,
  timestamp: String,
  received: Boolean,
});

export default mongoose.model("messagecontent", whatsappSchema);
