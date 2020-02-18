import { Component, OnInit } from '@angular/core';
import { JobdetailComponent } from '../jobdetail/jobdetail.component'
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Input, Output, EventEmitter } from '@angular/core';
import { CardComponent } from './card/card.component'
import 'firebase/auth';

import { OnChanges, SimpleChanges } from '@angular/core';
// import paginate = require('jw-paginate');


@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})

export class JobsPage implements OnInit {

  public ListArray: any;
  public ListArrayID: any;
  public getCompanyData: any;
  public getAppliedJob: any;
  // public title: string;
  public flag: boolean;

  employmentType: string = '';
  jobType: string = '';
  job_search: string = '';
  loc_search: string = '';

  pageOfItems: Array<any>;
  pager: any = {};

  @Input() items: Array<any>;

  constructor(public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public router: Router,
    public authService: AuthService) {
  }

  ngOnInit() {
   this.getAllJob();
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  async getAllJob() {
    const snapshot = await firebase.firestore().collection('jobData').get();
    this.items = snapshot.docs.map(doc => doc.data());
    // console.log('List Data:', this.ListArray);
    this.ListArrayID = snapshot.docs.map(doc => doc.id);
    const snapshot1 = await firebase.firestore().collection('companyProfile').get();
    this.getCompanyData = snapshot1.docs.map(doc => doc.data());
    // this.onChangePage(this.getCompanyData);  
    // console.log('List Data:', this.getCompanyData);
    // return this.ListArray;

  }

  async goModal(title: string, description: string, employerID: string, jobID: string) {
    const modal = await this.modalCtrl.create({
      component: JobdetailComponent,
      componentProps: {
        title: title,
        description: description,
        employerID: employerID,
        jobID: jobID,
      },
      showBackdrop: true,
      backdropDismiss: true,
      keyboardClose: true,
      cssClass: 'modal-auto-height-auto-width',
    });
    await modal.present();
  }
}

