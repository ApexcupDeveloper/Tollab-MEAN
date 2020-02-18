import { Component, OnInit, Input } from '@angular/core';
import { JobdetailComponent } from '../jobdetail/jobdetail.component'
import { ModalController, Platform, PopoverController, LoadingController } from '@ionic/angular';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage'
import { first, scan, switchMap, tap, finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { INgxSelectOption } from 'ngx-select-ex/ngx-select/ngx-select.interfaces'
// import {UploaderComponent} from './uploader/uploader.component'


@Component({
  selector: 'app-profile-company',
  templateUrl: './profile-company.page.html',
  styleUrls: ['./profile-company.page.scss'],
})
export class ProfileCompanyPage implements OnInit {

  public items: string[] = ['Agriculture', 'Arts & Design', 'Business', 'Civics & Govornment',
    'Communications', 'Computer Science', 'Education', 'Engineering', 'General Studies', 'Health Professions',
    'Life Science', 'Math & Physical Sciences', 'Natural Resources', 'Social Sciences'];

  public ngxValue: any = [];
  public ngxDisabled = false;

  public doSelectOptions = (options: INgxSelectOption[]) => console.log('MultipleDemoComponent.doSelectOptions', options);


  id: string;
  canEditCode: any;
  public companyData: any;
  name: string;
  com_location: string;
  industry: string;
  size: string;
  description: string;
  logoURL: string;
  bannerURL: string;
  email: string;
  website: string;
  perks: string;
  article: string = '';

  postJob: any;
  editArticle: boolean = false;

  fullname: string = '';
  space: string = ' ';
  userData: any;
  userName: any;
  agriculture: boolean = false;
  art: boolean = false;
  business: boolean = false;
  civics: boolean = false;
  communications: boolean = false;
  computer: boolean = false;
  education: boolean = false;
  engineering: boolean = false;
  general: boolean = false;
  health: boolean = false;
  life: boolean = false;
  math: boolean = false;
  natural: boolean = false;
  social: boolean = false;

  phone: number = null;
  school: string = '';
  year: number = null;

  videoURL: string = '';
  videoData: any;
  videoURLs: any;
  videos: any;
  ownerFlag: boolean = false;
  videoID: any;
  // name = 'Angular 6';
  safeSrc: SafeResourceUrl = '';
  bannerflag: boolean = false;
  logoflag: boolean = false;
  uploadflag: boolean = false;

  car;
  ifr;
  num: number = 0;

  constructor(public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public router: Router,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    public route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public authService: AuthService) { 
      
    }

  ngOnInit() {
    this.route.queryParams.subscribe(event => {
      this.id = event.id;
      console.log('sdfaasdf', this.id);
    });
    this.getCompanyData();
    this.getPostJob();
    this.getUserData();
    this.getImageData(); 
    this.getVideoData(); 
    this.getPerkData();
    // console.log('loading :', this.safeSrc);
  }

  isHovering: boolean;
  files: File[] = [];
  types: string = '';
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  onDrop(files: FileList) {
    for(let i = 0; i < files.length; i++) {
      this.files.push(files.item(i));
    }
  }


  async getCompanyData() {
    const snapshot1 = await firebase.firestore().collection('companyProfile').get();
    snapshot1.docs.map(doc => {
      if (this.id == doc.id) {
        this.companyData = doc.data();
        this.name = this.companyData.name;
        this.com_location = this.companyData.com_location;
        this.industry = this.companyData.industry;
        this.size = this.companyData.size;
        this.description = this.companyData.description;
        this.logoURL = this.companyData.logoURL;
        this.bannerURL = this.companyData.bannerURL;
        this.email = this.companyData.email;
        this.website = this.companyData.website;
        this.perks = this.companyData.perks;
      }
    });
    console.log('com data:', this.companyData);
  }

  async getPostJob() {
    this.postJob = [];
    const snapshot = await firebase.firestore().collection('jobData').get();
    snapshot.docs.map(doc => {
      if (this.id == doc.data().userID) {
        this.postJob.push(doc.data());
      }
    });
    // console.log('job data:', this.postJob);
    if(this.id == this.authService.currentUserInstance.uid){
      this.ownerFlag = true;
    } else {
      this.ownerFlag = false;
    }
  }
  async getImageData() {
    this.videoData = [];
    const snapshot = await (await firebase.firestore().collection('videos').get());
    snapshot.docs.map(doc => {
      if (this.id == doc.data().userID) {
        const id = doc.id;
        const data = doc.data();
        this.videoData.push({id, ...data});
      }
    });
    // console.log('video data111:', this.videoData);
  }

  async getVideoData() {
    this.videos = [];
    this.videoURLs = [];
    const snapshot = await (await firebase.firestore().collection('video').get());
    snapshot.docs.map(doc => {
      if (this.id == doc.data().userID) {
        const id = doc.id;
        const data = doc.data();
        this.videos.push({id, ...data});
      }
    });
    for(let i = 0; i < this.videos.length; i++){
      const data = this.sanitizer.bypassSecurityTrustResourceUrl(this.videos[i].videoURL);
      const id = this.videos[i].id;
      this.videoURLs.push({id, data});
    }
    // if(this.videoURL !== undefined) this.safeSrc =  this.sanitizer.bypassSecurityTrustResourceUrl(this.videoURL);
    console.log('youtube: ', this.videoURLs);
    // console.log('video data111:', this.videos);
  }
  goDeleteVideo(id: string){
    // alert(id);
    if (confirm('Are you sure you want to delete this video?')) {
      this.db.doc(`video/${id}`).delete();
      this.getVideoData();
    } else {
      // Do nothing!
    }
  }
  goDelete(id: string) {
    if (confirm('Are you sure you want to delete this job?')) {
      // Save it!
      // console.log('aid:', aid);
      this.db.doc(`videos/${id}`).delete();
      this.getImageData();
    } else {
      // Do nothing!
    }
  }
  goDeletePerk(id: string) {
    if (confirm('Are you sure you want to delete this perk?')) {
      // Save it!
      // console.log('aid:', aid);
      this.db.doc(`perks/${id}`).delete();
      this.perk = false;
      this.getPerkData();
    } else {
      // Do nothing!
    }
  }
  
  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL;

  goSave(){
    // alert(this.article);  
    if(this.article){
      const path = `task/${Date.now()}`;
      const data = this.article;
      this.db.collection('videos').add({ downloadURL: '', path, data, userID: this.authService.currentUserInstance.uid });
      this.editArticle = false;
      this.files = [];
      this.getImageData();
    } else {
      alert('Please insert the articles!');
    }
    
  }

  async getUserData() {
    const snapshot = await firebase.firestore().collection('employerData').get();
    snapshot.docs.map(doc => {
      // console.log('sdfasdfsdasdfasd0', doc.id, this.authService.currentUserInstance.uid);
      if (doc.id == this.id) {
        this.userData = doc.data();

      }
    });

    this.agriculture = false;
    this.art = false;
    this.business = false;
    this.civics = false;
    this.communications = false;
    this.computer = false;
    this.education = false;
    this.engineering = false;
    this.general = false;
    this.health = false;
    this.life = false;
    this.math = false;
    this.natural = false;
    this.social = false;

    if (this.userData.job.require.agriculture) {
      this.agriculture = true;
    }
    if (this.userData.job.require.art) {
      this.art = true;
    }
    if (this.userData.job.require.business) {
      this.business = true;
    }
    if (this.userData.job.require.civics) {
      this.civics = true;
    }
    if (this.userData.job.require.communications) {
      this.communications = true;
    }
    if (this.userData.job.require.computer) {
      this.computer = true;
    }
    if (this.userData.job.require.education) {
      this.education = true;
    }
    if (this.userData.job.require.engineering) {
      this.engineering = true;
    }
    if (this.userData.job.require.general) {
      this.general = true;
    }
    if (this.userData.job.require.health) {
      this.health = true;
    }
    if (this.userData.job.require.life) {
      this.life = true;
    }
    if (this.userData.job.require.math) {
      this.math = true;
    }
    if (this.userData.job.require.natural) {
      this.natural = true;
    }
    if (this.userData.job.require.social) {
      this.social = true;
    }

    this.phone = this.userData.phone;
    this.school = this.userData.school;
    this.year = this.userData.year;
  }
  canEditDescription: boolean;

  async goDes(des: string) {
    // alert(des);
    let id = this.authService.currentUserInstance.uid;
    let type = 'description';
    await this.authService.updateCompanyProfile(id, type, des).then((res) => {
      // alert('You have selected a student!');
      // location.reload();
      this.canEditDescription = false;
      this.getCompanyData();
    })
  }

  canEditEmail: boolean;
  async goEmail(email: string) {
    // alert(email);
    let id = this.authService.currentUserInstance.uid;
    let type = 'email';
    await this.authService.updateCompanyProfile(id, type, email).then((res) => {
      // alert('You have selected a student!');
      // location.reload();
      this.canEditEmail = false;
      this.getCompanyData();
    })
  }
  canEditWebsite: boolean;
  async goWebsite(website: string) {
    // alert(website);
    let id = this.authService.currentUserInstance.uid;
    let type = 'website';
    await this.authService.updateCompanyProfile(id, type, website).then((res) => {
      // alert('You have selected a student!');
      // location.reload();
      this.canEditWebsite = false;
      this.getCompanyData();
    })
  }
  require: boolean;
  async goRequire(require: any) {
    let id = this.authService.currentUserInstance.uid;
    await this.authService.updateEmployerData(id, require).then((res) => {
      this.getCompanyData();
      this.require = false;
    })
  }
  video: boolean;
  youtubeID: string = '';
  youURL: string = '';
  async goVideo(youtube: string) {
    // alert(youtube);
    this.youtubeID = youtube.substr(youtube.indexOf('=')+1, youtube.length);
    this.youURL = 'https://www.youtube.com/embed/' + this.youtubeID;
    // alert(this.youURL);
    // let id = this.authService.currentUserInstance.uid;

    let type = 'video';
    await this.authService.updateCompanyProfile(this.id, type, this.youURL).then((res) => {
      // alert('You have selected a student!');
      // location.reload();
      this.video = false;
      this.getVideoData();
    })
  }
  per: string;
  perk: boolean;
  async goPerk(perks: string) {
    // alert(perks);
    if(perks == ' ' || perks == undefined || perks == ''){
      alert("Please insert your company's perk!");
      this.per = '';
    } else {
      let type = 'perks';
      await this.authService.updateCompanyProfile(this.id, type, perks).then((res) => {
        // alert('You have selected a student!');
        // location.reload();
        // this.perk = false;
        this.getPerkData();
        this.per = '';
      })
    }
  }
  perkData: any;
  async getPerkData() {
    this.perkData = [];
    const snapshot = await firebase.firestore().collection('perks').get();
    snapshot.docs.map(doc => {
      // console.log('sdfasdfsdasdfasd0', doc.id, this.authService.currentUserInstance.uid);
      if (doc.data().userID == this.id) {
        const id = doc.id;
        const data = doc.data();
        this.perkData.push({id, ...data});
      }
    });
    // console.log('perk :', this.perkData);
  }
}
