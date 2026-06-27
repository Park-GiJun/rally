export interface Post {
  id: number;
  authorName: string;
  text: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
}

export interface CreatePostBody {
  text: string;
}
