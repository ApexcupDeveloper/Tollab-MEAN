
import { Component, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AuthService, CompanyData, videoData } from '../auth/auth.service';
// noinspection ES6UnusedImports
import { } from 'googlemaps';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ProfileDataService, StudentData } from '../profile/profile-data.service';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import { VideosModalComponent } from '../profile/modals/videos-modal/videos-modal.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { TranslateService } from '@ngx-translate/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';


const listAnimation = trigger('listAnimation', [
  state('open', style({
    opacity: 1
  })),
  state('closed', style({
    opacity: 0
  })),
  transition('open <=> closed', [animate('0.5s')])
]);

@Component({

  selector: 'app-company-add',
  templateUrl: './company-add.page.html',
  styleUrls: ['./company-add.page.scss'],
  animations: [listAnimation]
})
export class CompanyAddPage implements OnInit {

  public basicInfoEditMode = false;

  public companyData: Observable<CompanyData>;
  public location = '';
  public places: string[] = [];
  public placesAutoComplete = new google.maps.places.AutocompleteService();

  public completeness = {
    percentage: 20,
    hint: new Observable<string>()
  };

  noImage = false;

  company_name: string = '';
  industry: string = '';
  website: string = '';
  com_location: string = '';
  description: string = '';
  size: string = '';
  email: string = '';
  logoURL: string = '';
  bannerURL: string = '';

  videoURL: string = '../../assets/videos/bg.mp4';
  path: string = '';

  constructor(public authService: AuthService,
    public profileDataService: ProfileDataService,
    public zone: NgZone,
    public platform: Platform,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public router: Router,
    public translateService: TranslateService) {
  }

  ngOnInit() {
    this.companyData = this.authService.currentUser.pipe(switchMap(user => {
      if (user) {
        return this.authService.getCompanyData(user.uid);
      }
      return;
    }));
  }

  /**
   * Creates and presents a modal to add or edit the student's info depending on the chosen modal.
   */

  async goCreate() {
    if (this.company_name == '' || this.industry == '' || this.website == '' || this.com_location == '' || this.description == '' || this.size == '' || this.email == ''){
      alert('Please fill in the blanks!');
    } else {
      await this.storeCompanyData();
      location.reload();
    }
  }

  private async storeVideoData() {
    let downloadURL: string;
    let path: string;
    let userID: string;

    downloadURL = this.videoURL;
    path = this.path;
    userID = this.authService.currentUserInstance.uid;

    const videoData: videoData = {
      downloadURL: downloadURL,
      path: path,
      userID: userID
    };
    await this.authService.storeVideoData(videoData);
    // await this.router.navigate(['/detail-job']);
  }

  private async storeCompanyData() {
    this.storeVideoData();
    let company_name: string;
    let industry: string;
    let website: string;
    let com_location: string;
    let description: string;
    let size: string;
    let email: string;
    let logoURL: string;
    let bannerURL: string;
    let userID: string;

    company_name = this.company_name;
    industry = this.industry;
    website = this.website;
    com_location = this.com_location;
    description = this.description;
    size = this.size;
    email = this.email;
    logoURL = 'assets/img/user.png';
    bannerURL = 'assets/img/YoungPros.jpg';
    userID = this.authService.currentUserInstance.uid;

    const companyData: CompanyData = {
      name: company_name,
      industry: industry,
      website: website,
      com_location: com_location,
      description: description,
      size: size,
      email: email,
      logoURL: logoURL,
      bannerURL: bannerURL,
      userID: userID
    };
    await this.authService.storeCompanyData(companyData);
    await this.router.navigate(['/detail-job']);
  }

  async onDisplayModal(modalComponent: 'image',
    index: number = -1,
    data?: any,
    size: number = -1) {
    const modalsList = {
      image: FileUploadComponent
    };

    const modalOptions = index === -1 ? {
      component: modalsList[modalComponent],
      cssClass: 'modal-auto-height-auto-width'
    } : {
        component: modalsList[modalComponent],
        cssClass: 'modal-auto-height-auto-width',
        componentProps: {
          editMode: true,
          index,
          data,
          size
        }
      };
    const modal = await this.modalCtrl.create(modalOptions);
    await modal.present();
  }
  async onDisplayModal1(modalComponent:  'image',
    index: number = -1,
    data?: any,
    size: number = -1) {
    const modalsList = {
      image: FileUploadComponent
    };

    const modalOptions = index === -1 ? {
      component: modalsList[modalComponent],
      cssClass: 'modal-auto-height-auto-width'
    } : {
        component: modalsList[modalComponent],
        cssClass: 'modal-auto-height-auto-width',
        componentProps: {
          editMode: true,
          index,
          data,
          size
        }
      };
    const modal = await this.modalCtrl.create(modalOptions);
    await modal.present();
  }
}
