export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath?: string | null;
  creator: string;
  createdAt?: string;
}

// title: {
//   type: String,
//   required: true,
// },
// content: {
//   type: String,
//   required: true,
// },
// imagePath: {
//   type: String,
//   required: false,
// },
// creator: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "User",
//   required: true,
// },
// createdAt: {
//   type: Date,
//   default: new Date().getTime(),
// },
