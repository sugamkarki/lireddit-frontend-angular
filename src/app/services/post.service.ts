import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}
  addPost(post: { title: string; content: string; image: File }) {
    console.log(post);
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http
      .post<{ message: string; post: Post }>(
        `${environment.API_URL}/post`,
        postData
      )
      .subscribe((res) => {
        console.log(res);
      });
  }
}
