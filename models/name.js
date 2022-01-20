import mongoose from "mongoose";
const Name = mongoose.model("data", {
  name: {
    type: String,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

export default Name;
