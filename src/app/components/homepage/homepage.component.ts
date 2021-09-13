import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { mimeType } from 'src/app/helpers/mime-type.validator';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

enum Mode {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}
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
  post: Post = {} as Post;
  mode: Mode;
  postId: string | null = '';
  private postListenerSubscriber: Subscription;
  private authListenerSubscriber: Subscription;
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private toastr: ToastrService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.userId = authService.getUserId();
    // console.log(this.userId);
    this.mode = Mode.CREATE;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = Mode.EDIT;
        this.postId = paramMap.get('id');
        this.postService.getPost(this.postId ?? '').subscribe((response) => {
          this.post = response.post;
          console.log(this.post);
        });
      } else {
        this.mode = Mode.CREATE;
      }
    });
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
    if (this.mode === Mode.CREATE) {
      if (this.postForm.invalid) {
        this.toastr.error(
          'Fill out all fields and add an image too!!',
          'Error',
          {
            timeOut: 1000,
          }
        );
        return;
      }
      this.postService.addPost(this.postForm.value);
    } else {
      console.log(this.postForm.value);

      this.toastr.error('Fill out all fields', 'Error', {
        timeOut: 1000,
      });
      this.postService.updatePost(this.postId ?? '', this.postForm.value);
    }
    this.postForm.reset();
    this.post = {} as Post;
    this.router.navigate(['/']);
  }
  onDelete(id: string) {
    this.postService.deletePost(id);
  }
  onUpdate(id: string) {
    this.router.navigate([id]);
  }
}
