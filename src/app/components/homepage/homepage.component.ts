import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { mimeType } from 'src/app/helpers/mime-type.validator';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  postForm: FormGroup;
  imagePreview: string | null = null;
  constructor(private titleService: Title) {
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
  onAddPost() {}
}
