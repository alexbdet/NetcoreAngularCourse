import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { faBan, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/_services/account.service';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { BusyService } from 'src/app/_services/busy.service';
import { MembersService } from 'src/app/_services/members.service';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() member: Member;

  uploader: FileUploader;
  hasBaseDropzoneOver = false;
  baseUrl = environment.apiUrls.apiUrl;
  user: User;
  faTrash = faTrash;
  faBan = faBan;
  faUpload = faUpload;

  constructor(private accountService: AccountService, private busyService: BusyService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropzoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo', // TODO => env var
      authToken: 'Bearer ' + this.user.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onBeforeUploadItem = () => {
      this.busyService.busy();
    };

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.busyService.idle();

      if (response) {
        const photo: Photo = JSON.parse(response);
        this.member.photos.push(photo);

        if (photo.isMain) {
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
        }
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.user.photoUrl = photo.url;
      this.accountService.setCurrentUser(this.user);
      this.member.photoUrl = photo.url;
      this.member.photos.forEach(p => {
        if (p.isMain) p.isMain = false;
        if (p.id == photo.id) p.isMain = true;
      });
    });
  }

  deletePhoto(photo: Photo) {
    this.memberService.deletePhoto(photo.id).subscribe(() => {
      this.member.photos = this.member.photos.filter(p => p.id != photo.id);
    });
  }
}
