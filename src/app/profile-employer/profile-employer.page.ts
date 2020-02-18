
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import * as firebase from 'firebase/app';
import { JobdetailComponent } from '../jobdetail/jobdetail.component'
import 'firebase/auth';

import { Component, NgZone, OnInit } from '@angular/core';

// noinspection ES6UnusedImports
import { } from 'googlemaps';
import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { ProfileDataService, EmployerData } from './profile-data.service';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessagingService } from '../messaging.service';
import { FcmService } from '../fcm.service';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadComponent } from './file-upload/file-upload.component';

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
    selector: 'app-profile-employer',
    templateUrl: './profile-employer.page.html',
    styleUrls: ['./profile-employer.page.scss'],
    animations: [listAnimation]
})

export class ProfileEmployerPage implements OnInit {


    fullname: string = '';
    space: string = ' ';
    userData:any;
    userName: any;
    agriculture: string ='';
    art: string ='';
    business: string ='';
    civics: string ='';
    communications: string ='';
    computer: string ='';
    education: string ='';
    engineering: string ='';
    general: string ='';
    health: string ='';
    life: string ='';
    math: string ='';
    natural: string ='';
    social: string ='';

    phone: number = null;
    school: string = '';
    year: number = null;

    comData:any;
    com_name: string = '';
    com_location: string = '';
    com_email: string = '';
    com_website: string = '';
    com_size: string = '';
    com_description: string = '';
    logoURL: string = '';
    bannerURL:string = '';

    constructor(public authService: AuthService,
        public profileDataService: ProfileDataService,
        public zone: NgZone,
        public platform: Platform,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController,
        public toastCtrl: ToastController,
        public translateService: TranslateService,
        public router: Router,
        public afs: AngularFirestore,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.getUserName();
        this.getUserData();
        this.getCompanyData();

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
        // location.reload();
    }

    async getUserName(){
        const snapshot = await firebase.firestore().collection('users').get();
        snapshot.docs.map(doc => {
            if(doc.id == this.authService.currentUserInstance.uid){
                this.userName = doc.data();
            }
        });
        this.userName = this.authService.currentUserData;

        this.fullname = this.userName.name.firstName + this.space + this.userName.name.lastName;
        // console.log('first name:', this.fullname);
    }
    async getUserData() {
        const snapshot = await firebase.firestore().collection('employerData').get();
        snapshot.docs.map(doc => {
            console.log('sdfasdfsdasdfasd0', doc.id, this.authService.currentUserInstance.uid);
            if(doc.id == this.authService.currentUserInstance.uid){
                this.userData = doc.data();
                
            }
        });
        console.log('type',snapshot);
        if(this.userData.job.require.agriculture){
            this.agriculture = 'agriculture';
        } else if(this.userData.job.require.art){
            this.art = 'art';
        } else if(this.userData.job.require.business){
            this.business = 'business';
        } else if(this.userData.job.require.civics){
            this.civics = 'civics';
        } else if(this.userData.job.require.communications){
            this.communications = 'communications';
        } else if(this.userData.job.require.computer){
            this.computer = 'computer';
        } else if(this.userData.job.require.education){
            this.education = 'education';
        } else if(this.userData.job.require.engineering){
            this.engineering = 'engineering';
        } else if(this.userData.job.require.general){
            this.general = 'general';
        } else if(this.userData.job.require.health){
            this.health = 'health';
        } else if(this.userData.job.require.life){
            this.life = 'life';
        } else if(this.userData.job.require.math){
            this.math = 'math';
        } else if(this.userData.job.require.natural){
            this.natural = 'natural';
        } else if(this.userData.job.require.social){
            this.social = 'social';
        }

        this.phone = this.userData.phone;
        this.school = this.userData.school;
        this.year = this.userData.year;
    }

    async getCompanyData(){
        const snapshot = await firebase.firestore().collection('companyProfile').get();
        snapshot.docs.map(doc => {
            if(doc.id == this.authService.currentUserInstance.uid){
                this.comData = doc.data();
            }
        });
        console.log('data:', this.comData);
        this.com_name = this.comData.name;
        this.com_location = this.comData.com_location;
        this.com_email = this.comData.email;
        this.com_website = this.comData.website;
        this.com_size = this.comData.size;
        this.com_description = this.comData.description;
        this.logoURL = this.comData.logoURL;
        this.bannerURL = this.comData.bannerURL;
    }
}
