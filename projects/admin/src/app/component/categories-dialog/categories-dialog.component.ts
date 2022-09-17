import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Category, CategoryService } from '../../service/category.service';
import { Image, ImageService } from '../../service/image.service';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrls: ['./categories-dialog.component.scss']
})
export class CategoriesDialogComponent {
  error: string | undefined;
  images: Image[] = [];
  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    image: new FormControl({}),
    order: new FormControl(0),
    active: new FormControl(true)
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Category,
    private dialogRef: MatDialogRef<CategoriesDialogComponent>,
    private categoryService: CategoryService,
    private imageService: ImageService,
  ) {
  }

  ngOnInit(): void {
    this.form.patchValue(this.data);

    this.imageService.getImages('', 0, 100)
    .subscribe((data) => {
      this.images = data;
      this.form.patchValue({
        image: this.images.find((d) => d._id == this.data.image?._id)
      });
    });
  }

  deleteCategory(): void {
    this.categoryService.deleteCategory(this.form.getRawValue())
    .subscribe(() => {
      this.dialogRef.close({
        value: this.form.getRawValue(),
        method: 'remove'
      })
    });

  }

  onSubmit(): void {
    if (this.form.valid) {
      if (!this.data._id) {
        this.categoryService.postCategory(this.form.value)
        .subscribe((category: Category) => {
          this.dialogRef.close({
            value: category,
            method: 'add'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      } else {
        this.categoryService.putCategory(this.form.getRawValue())
        .subscribe((category: Category) => {
          this.dialogRef.close({
            value: category,
            method: 'change'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      }
    }
  }

}
