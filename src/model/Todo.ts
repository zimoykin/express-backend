import * as mongoose from "mongoose";

interface ITodo extends mongoose.Document {
    id: string;
    user: string;
    title: string;
    description: string;
    created: Date;
  }
  
  //Schema
  const TodoSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true
    }
  }, {timestamps : true});
  
  export const Todos = mongoose.model<ITodo>("Todos", TodoSchema);
  