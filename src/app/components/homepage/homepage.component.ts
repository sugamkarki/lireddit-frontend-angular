import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { mimeType } from 'src/app/helpers/mime-type.validator';
import { PostService } from 'src/app/services/post.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  postForm: FormGroup;
  imagePreview: string | null = null;
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private postService: PostService
  ) {
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
}
