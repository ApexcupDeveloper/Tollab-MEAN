import { Component, OnInit, Input } from '@angular/core';
import { JobdetailComponent } from '../../jobdetail/jobdetail.component'
import { ModalController, Platform, PopoverController, LoadingController } from '@ionic/angular';
import { AuthService, UserData, CompanyData, JobData } from '../../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage'
import { first, scan, switchMap, tap, finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { INgxSelectOption } from 'ngx-select-ex/ngx-select/ngx-select.interfaces'
import { ProfileCompanyPage } from '../profile-company.page'

@Component({
  selector: 'app-upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.scss'],
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;
  @Input() articleData: string;
  @Input() types: string;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  endflag: boolean = true;
  downloadURL;


  constructor(public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public router: Router,
    public par: ProfileCompanyPage,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    public route: ActivatedRoute,
    public authService: AuthService) { }

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {
    console.log('type: ', this.types);
    console.log('file: ', this.file);
    const type = this.file.type;
    if(this.types == 'article'){
      if (this.articleData == undefined) {
        alert('Before select the image, please insert the description!')
      } else {
        if (type == 'image/jpeg' || type == 'image/png') {
          const path = `task/${Date.now()}_${this.file.name}`;
          const ref = this.storage.ref(path);
          this.task = this.storage.upload(path, this.file);
          this.percentage = this.task.percentageChanges();
          const data = this.articleData;
  
          this.snapshot = this.task.snapshotChanges().pipe(
            tap(console.log),
            finalize(async () => {
              this.downloadURL = await ref.getDownloadURL().toPromise();
              this.db.collection('videos').add({ downloadURL: this.downloadURL, path, data, userID: this.authService.currentUserInstance.uid })
              // alert('The video was uploaded successfully.');
              this.par.editArticle = false;
              this.par.files = [];
              this.endflag = false;
              this.par.getImageData();
            }),
          );
          // this.par.getImageData();
        } else {
          alert('You can upload only image files.');
          // this.par.editArticle = false;
          
        }
      }
    } else if (this.types == 'banner') {
        if (type == 'image/jpeg' || type == 'image/png') {
          const path = `task/${Date.now()}_${this.file.name}`;
          const ref = this.storage.ref(path);
          this.task = this.storage.upload(path, this.file);
          this.percentage = this.task.percentageChanges();
          const data = this.articleData;
  
          this.snapshot = this.task.snapshotChanges().pipe(
            tap(console.log),
            finalize(async () => {
              this.downloadURL = await ref.getDownloadURL().toPromise();
              this.db.doc(`companyProfile/${this.authService.currentUserInstance.uid}`).update({ bannerURL: this.downloadURL });
              // this.db.collection(`companyData/${this.authService.currentUserInstance.uid}`).valueChanges({ bannerURL: this.downloadURL })
              // alert('The video was uploaded successfully.');
              this.endflag = false;
              // this.par.bannerflag = false;
              this.par.files = [];
              this.par.getCompanyData();
            }),
          );
          // this.par.getImageData();
        } else {
          alert('You can upload only image files.');
          // this.par.editArticle = false;
        }
    }  else if (this.types == 'logo') {
      if (type == 'image/jpeg' || type == 'image/png') {
        const path = `task/${Date.now()}_${this.file.name}`;
        const ref = this.storage.ref(path);
        this.task = this.storage.upload(path, this.file);
        this.percentage = this.task.percentageChanges();
        const data = this.articleData;

        this.snapshot = this.task.snapshotChanges().pipe(
          tap(console.log),
          finalize(async () => {
            this.downloadURL = await ref.getDownloadURL().toPromise();
            this.db.doc(`companyProfile/${this.authService.currentUserInstance.uid}`).update({ logoURL: this.downloadURL });
            // this.db.collection(`companyData/${this.authService.currentUserInstance.uid}`).valueChanges({ bannerURL: this.downloadURL })
            // alert('The video was uploaded successfully.');
            this.endflag = false;
            // this.par.logoflag = false;
            this.par.files = [];
            this.par.getCompanyData();
          }),
        );
        // this.par.getImageData();
      } else {
        alert('You can upload only image files.');
        // this.par.editArticle = false;
      }
  }
  }

  isActive(snapshot) {
    return snapshot.state === 'running'
      && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
