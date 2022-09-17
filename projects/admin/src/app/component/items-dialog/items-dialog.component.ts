import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { Item, ItemService } from '../../service/item.service';
import { Category, CategoryService } from '../../service/category.service';
import { Image, ImageService } from '../../service/image.service';

@Component({
  selector: 'app-items-dialog',
  templateUrl: './items-dialog.component.html',
  styleUrls: ['./items-dialog.component.scss']
})
export class ItemsDialogComponent {
  error: string | undefined;
  images: Image[] | undefined;
  categories: Category[] | undefined;
  category: Category | undefined;

  form: FormGroup = new FormGroup({
    _id: new FormControl({value: '', disabled: true}),
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    category: new FormControl({}, Validators.required),
    images: new FormControl([]),
    tags: new FormControl([]),
    price: new FormControl(0, Validators.required),
    tax: new FormControl(0, Validators.required),
    storage: new FormControl(0, Validators.required),
    shipping: new FormGroup({
      weight: new FormControl(0),
      width: new FormControl(0),
      height: new FormControl(0),
      length: new FormControl(0),
    }),
    options: new FormGroup({
    })
  });

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Item,
    private dialogRef: MatDialogRef<ItemsDialogComponent>,
    private itemService: ItemService,
    private imageService: ImageService,
    private categoryService: CategoryService,
  ) {
  }

  ngOnInit(): void {
    this.form.patchValue(this.data);

    this.categoryService.getCategories('', 0, 100, 'order', 'asc')
    .subscribe((data) => {
      this.categories = data;
      this.form.patchValue({
        category: this.categories.find((e) => e._id == this.data.category?._id),
      });
    });

    this.imageService.getImages('', 0, 100)
    .subscribe((data) => {
      this.images = data;
      this.form.patchValue({
        images: this.images.filter((e: Image) => {
          let match = this.data.images?.find((d) => d._id == e._id)
          return match;
        }),
      });
    });
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const tags = this.form.value.tags;
    if (value) {
      tags.push(value);
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string): void {
    const tags = this.form.value.tags;
    const index = tags.indexOf(tag);

    if (index >= 0) {
      tags.splice(index, 1);
    }
  }

  deleteItem(): void {
    this.itemService.deleteItem(this.form.getRawValue())
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
        this.itemService.postItem(this.form.value)
        .subscribe((item: Item) => {
          this.dialogRef.close({
            value: item,
            method: 'add'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      } else {
        this.itemService.putItem(this.form.getRawValue())
        .subscribe((item: Item) => {
          this.dialogRef.close({
            value: item,
            method: 'change'
          })
        }, (e) => {
          if (e) this.error = e;
        })
      }
    }
  }

}
