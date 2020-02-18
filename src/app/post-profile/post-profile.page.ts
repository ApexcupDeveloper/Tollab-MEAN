import { Component, OnInit } from '@angular/core';
import { GuidelineComponent } from './guideline/guideline.component';
import { ModalController, Platform, PopoverController, LoadingController, ToastController } from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { AuthService, UserData, EmployerData } from '../auth/auth.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-profile',
  templateUrl: './post-profile.page.html',
  styleUrls: ['./post-profile.page.scss'],
})
export class PostProfilePage implements OnInit {

  e_phone: number=null;
  e_jobtitle: string='';

  agriculture: boolean;
  art: boolean;
  business: boolean;
  civics: boolean;
  communications: boolean;
  computer: boolean;
  education: boolean;
  engineering: boolean;
  general: boolean;
  health: boolean;
  life: boolean;
  math: boolean;
  natural: boolean;
  social: boolean;

  school: string='';
  year: number=null;

  // @Input() hasProvider: boolean;

  credential: firebase.auth.UserCredential;

  constructor(public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public profileDataService: ProfileDataService,
    public toastCtrl: ToastController,
    private angularFirestore: AngularFirestore,
    public router: Router) { }

  ngOnInit() {
  }
  async goGuide() {

    if(this.e_phone == null || this.e_jobtitle==''||this.school==''||this.year==null){
      alert('Please fill in the blanks!');
    } else {
      await this.storeEmployerData();

      const modal = await this.modalCtrl.create({
        component: GuidelineComponent,
        showBackdrop: true,
        backdropDismiss: true,
        keyboardClose: true,
        cssClass: 'modal-auto-height-auto-width'
      });
      await modal.present();
    }
  }

  private async storeEmployerData() {
    let phone: number;
    let title: string;
    let agriculture: boolean;
    let art: boolean;
    let business: boolean;
    let civics: boolean;
    let communications: boolean;
    let computer: boolean;
    let education: boolean;
    let engineering: boolean;
    let general: boolean;
    let health: boolean;
    let life: boolean;
    let math: boolean;
    let natural: boolean;
    let social: boolean;
    let school: string;
    let year: number;

    let userID: string;

    const credentials = this.credential;


    phone = this.e_phone;
    title = this.e_jobtitle;

    agriculture = this.agriculture;
    art = this.art;
    business = this.business;
    civics = this.civics;
    communications = this.communications;
    computer = this.computer;
    education = this.education;
    engineering = this.engineering;
    general = this.general;
    health = this.health;
    life = this.life;
    math = this.math;
    natural = this.natural;
    social = this.social;

    school = this.school;
    year = this.year;

    userID = this.authService.currentUserInstance.uid;

    if(agriculture === undefined ) agriculture = false;
    if(art === undefined) art = false;
    if(business === undefined) business = false;
    if(civics === undefined) civics = false;
    if(communications === undefined) communications = false;
    if(computer === undefined) computer = false;
    if(education === undefined) education = false;
    if(engineering === undefined) engineering = false;
    if(general === undefined) general = false;
    if(health === undefined) health = false;
    if(life === undefined) life = false;
    if(math === undefined) math = false;
    if(natural === undefined) natural = false;
    if(social === undefined) social = false;
    // await credentials.user.updateProfile({
    //   displayName: `${firstName} ${lastName}`
    // });

    const employerData: EmployerData = {  
      job: {
        title,
        require: {
          agriculture,
          art,
          business,
          civics,
          communications,
          computer,
          education,
          engineering,
          general,
          health,
          life,
          math,
          natural,
          social
        }
      },
      phone: phone,
      school: school,
      year: year,
      userID: userID
    };
    console.log('uid :', this.authService.currentUserInstance.uid);
    await this.authService.storeEmployerData(employerData);


    //   const userData: UserData = {
    //   createdAt: new Date(credentials.user.metadata.creationTime),
    //   name: {
    //     firstName,
    //     lastName
    //   },
    //   role: 'employer'
    // };
    // await this.authService.storeUserData(userData);
  }
}
