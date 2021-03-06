import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postSubscribable: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  private posts: any;
  private post: any;
  constructor(private http: HttpClient) {}
  addPost(post: { title: string; content: string; image: File }) {
    console.log(post);
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    this.http
      .post<{
        message: string;
        posts: {
          _id: string;
          title: string;
          content: string;
          imagePath: string;
          creator: User;
        };
      }>(`${environment.API_URL}/post`, postData)
      .subscribe((res: any) => {
        // console.log(res);
        this.postSubscribable.next(res.posts);
      });
  }
  updatePost(id: string, post: { title: string; content: string }) {
    console.log(post);
    this.http
      .patch<{ message: string; post: any }>(
        `${environment.API_URL}post/${id}`,
        post
      )
      .subscribe((res) => {
        this.getAllPosts();
      });
  }
  getAllPosts() {
    this.http
      .get<{
        message: string;
        posts: {
          _id: string;
          title: string;
          content: string;
          imagePath: string;
          creator: User;
        };
      }>(`${environment.API_URL}/post`)
      .subscribe((res) => {
        // @ts-ignore
        this.postSubscribable.next(res.posts);
      });
  }
  getPost(id: string) {
    return this.http.get<{ message: string; post: any }>(
      `${environment.API_URL}post/${id}`
    );
  }
  getPostSubscribale() {
    return this.postSubscribable.asObservable();
  }
  deletePost(id: string) {
    console.log(id);
    this.http.delete(`${environment.API_URL}post/${id}`).subscribe((res) => {
      this.getAllPosts();
    });
  }
}
