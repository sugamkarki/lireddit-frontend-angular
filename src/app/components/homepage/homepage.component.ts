import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/helpers/mime-type.validator';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  imagePreview: string | null = null;
  isAuthenticated: boolean;
  userId: string | null = null;
  posts: any = [];
  private postListenerSubscriber: Subscription;
  private authListenerSubscriber: Subscription;
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private toastr: ToastrService,
    private postService: PostService
  ) {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.userId = authService.getUserId();
    console.log(this.userId);
    this.postService.getAllPosts();
    this.authListenerSubscriber = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.isAuthenticated = isAuthenticated;
        this.userId = authService.getUserId();
      });
    this.titleService.setTitle('Lireddit');
    this.postForm = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required],
      }),
      content: new FormControl('', {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.postListenerSubscriber = this.postService
      .getPostSubscribale()
      .subscribe((posts) => {
        this.posts = posts;
        console.log(this.posts);
      });
  }
  ngOnDestroy(): void {
    this.authListenerSubscriber.unsubscribe();
    this.postListenerSubscriber.unsubscribe();
  }
  ngOnInit(): void {}
  onImagePicked(event: Event) {
    // @ts-ignore
    const file = event.target.files[0];
    this.postForm.patchValue({ image: file });
    // @ts-ignore
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onAddPost() {
    if (this.postForm.invalid) {
      this.toastr.error('Fill out all fields and add an image too!!', 'Error', {
        timeOut: 1000,
      });
      return;
    }
    this.postService.addPost(this.postForm.value);
  }
  onDelete(id: string) {
    this.postService.deletePost(id);
  }
}
