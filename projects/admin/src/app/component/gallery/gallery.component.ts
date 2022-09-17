import { AfterViewInit, Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ImagesDataSource } from './gallery-datasource';
import { Observable } from 'rxjs';

import { Image, ImageService } from '../../service/image.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource: ImagesDataSource;
  images: Observable<Image[]> | undefined;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private imageService: ImageService,
  ) {
    this.dataSource = new ImagesDataSource(imageService);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.images = this.dataSource.connect();
    this.changeDetectorRef.detectChanges();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter.next(filterValue.trim().toLowerCase());
  }

  applyName(image: Image, event: Event) {
    image.name = (event.target as HTMLInputElement).value;
    this.imageService.putImage(image)
    .subscribe((image: Image) => {
      this.dataSource.changeOne(image);
    })
  }

  addImage(imageInput: any): void {
    const file: File = imageInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      this.imageService.postImage(formData)
      .subscribe((image: Image) => {
        this.dataSource.addOne(image);
      })
    }
  }

  changeImage(image: Image, imageInput: any): void {
    const file: File = imageInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      this.imageService.changeImage(image, formData)
      .subscribe((image: Image) => {
        this.dataSource.changeOne(image);
      })
    }
  }

  deleteImage(image: Image): void {
    if (confirm('Do you really want to delete this image?')) {
      this.imageService.deleteImage(image)
      .subscribe(() => {
        this.dataSource.removeOne(image);
      })
    }
  }

}
