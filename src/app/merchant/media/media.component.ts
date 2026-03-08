import { Component, Input, OnInit } from '@angular/core';
import { image_obj } from 'src/app/Models/googleMyBusiness.model'
import { ToastrService } from 'ngx-toastr';
import { GoogleMyBusinessService } from 'src/app/core/google-my-business.service'
import { SecurityService } from 'src/app/core/security.service';
@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {
  @Input() media_obj: image_obj[];
  @Input() merchantId: string;
  @Input() locationId: string;
  @Input() accountId: string;
  fileToUpload: File | null = null;
  coverLoading: boolean = false;
  logoLoading: boolean = false;


  image_obj = new image_obj()
  logo_image_obj = new image_obj()
  cover_image_obj = new image_obj()
  constructor(private securityService: SecurityService, private googleMyBusiness: GoogleMyBusinessService, private toaster: ToastrService,) {

  }

  ngOnInit(): void {

    console.log("media_obj in media tab ", this.media_obj)
    this.media_obj.map((image, index) => {
      this.image_obj = image

      if (this.image_obj.locationAssociation.category === 'COVER') {
        this.cover_image_obj = this.image_obj
        console.log("this.image_obj coverurl", this.logo_image_obj)
        // this.media_obj.splice(index, 1);
      }
      if (this.image_obj.locationAssociation.category === 'PROFILE') {
        this.logo_image_obj = this.image_obj
        console.log("this.image_obj logourl", this.cover_image_obj)
        // this.media_obj.splice(index, 1);
      }
    });

  }
  handleFileInput(event: Event, category: string) {
    if (category === 'COVER') {
      this.coverLoading = true;
    } else if (category === 'PROFILE') {
      this.logoLoading = true;
    }
    const inputElement = event.target as HTMLInputElement;
    const files: FileList | null = inputElement.files;

    if (files && files.length > 0) {
      this.fileToUpload = files.item(0);
      console.log("this fileToUpload", this.fileToUpload.size)
      if (this.fileToUpload.size < 10240) {
        if (category === 'COVER') {
          this.coverLoading = false;
        } else if (category === 'PROFILE') {
          this.logoLoading = false;
        }

        this.toaster.error("Image size must be  10240 Bytes.")
      }
      else {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            if (img.width < 250 || img.height < 250) {
              if (category === 'COVER') {
                this.coverLoading = false;
              } else if (category === 'PROFILE') {
                this.logoLoading = false;
              }

              this.toaster.error('Image dimensions should be at least 250 x 250 pixels.');
              // You can display an error message or take further action here
            } else {
              let media_data = {
                "merchantid": this.merchantId,
                "locationid": this.locationId,
                "accountid": this.accountId,
                "category": category,

              }

              this.googleMyBusiness.uploadMedia(this.securityService.securityObject.token, this.fileToUpload, media_data).subscribe((data: any) => {
                // console.log("data is ", data)
                this.toaster.success("Image uploaded successfully")
                const reader = new FileReader();
                if (category == "COVER" || category == "PROFILE") {
                  reader.readAsDataURL(this.fileToUpload);
                  reader.onload = () => {
                    if (category == "COVER") {
                      this.cover_image_obj.googleUrl = reader.result;
                    }
                    if (category == "PROFILE") {
                      this.logo_image_obj.googleUrl = reader.result;
                    }
                  };
                }
                // Set loading back to false after uploading is complete
                if (category === 'COVER') {
                  this.coverLoading = false;
                } else if (category === 'PROFILE') {
                  this.logoLoading = false;
                }

              }, (err) => {
                this.toaster.error("upload media data is in error")
                //this.toaster.error(ßssage);

                // Set loading back to false in case of an error
                if (category === 'COVER') {
                  this.coverLoading = false;
                } else if (category === 'PROFILE') {
                  this.logoLoading = false;
                }
              })
            }
          };
        };
        reader.readAsDataURL(this.fileToUpload)


      }
    }
    else {
      this.toaster.error("Image not selected correclty.")
    }
  }


  removeImage(image, type, index?) {


    const startIndex = image.name.lastIndexOf('/');
    image.name = image.name.substring(startIndex + 1);
    console.log("remove image ", image.name)
    this.googleMyBusiness.delMediaById(this.securityService.securityObject.token,
      {
        "merchantid": this.merchantId,
        "locationid": this.locationId,
        "accountid": this.accountId,
        "mediaid": image.name

      }
    ).subscribe((data: any) => {
      console.log("data is ", data)
      this.toaster.success("Image deleted successfully")
      if (index >= 0) {
        console.log("index is ", index)
        this.media_obj.splice(index, 1);
      }
      else {
        if (type == "COVER") {
          this.cover_image_obj.googleUrl = null;
        }
        if (type == "PROFILE") {
          this.logo_image_obj.googleUrl = null;
        }

      }
    }, (err) => {
      console.log("delete media data is in error")
      this.toaster.error("delete media data is in error")

    })
  }




}
