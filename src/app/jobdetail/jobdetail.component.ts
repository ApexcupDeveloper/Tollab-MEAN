import { Component, OnInit, Input } from '@angular/core';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { AuthService, UserData, CompanyData, JobData, AppliedJob } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import 'firebase/auth';
import { JobsPage } from '../jobs/jobs.page'
// import { AppliedJobPage } from '../applied-job/applied-job.page'
// import { FirestoreService } from 'firestore.service';
import { User } from 'firebase/app';



@Component({
  selector: 'app-jobdetail',
  templateUrl: './jobdetail.component.html',
  styleUrls: ['./jobdetail.component.scss'],
})
export class JobdetailComponent implements OnInit {

  title: string;
  descript: string;
  description: string;
  employerID: string;
  jobID: string;
  flag: boolean;

  name: string;
  com_location: string;
  industry: string;
  size: string;
  logoURL: string;
  bannerURL: string;
  email: string;
  website: string;

  public ListArray: any;
  public getCompanyData: any;
  public getAppliedJob: any;

  constructor(public platform: Platform,
    public popoverCtrl: PopoverController,
    public modalCtrl: ModalController,
    public router: Router,
    // public par: AppliedJobPage,
    private firestore: AngularFirestore,
    public authService: AuthService) {
  }

  ngOnInit() {
    console.log('id-------------', this.descript, this.employerID, this.jobID);
    this.getAllJob();
    this.find();
  }

  async goApply() {
    this.modalCtrl.dismiss();
    this.AppliedJob();
    // this.par.getAlliedJobData();
    alert('Congratulation! You have applied this job. Please wait reply from employer.');
  }

  private async AppliedJob() {
    let employerID: string;
    let jobID: string;
    let studentID: string;
    let level: number;

    studentID = this.authService.currentUserInstance.uid;
    jobID = this.jobID;
    employerID = this.employerID;
    level = 0;

    const appliedJob: AppliedJob = {
      employerID: employerID,
      jobID: jobID,
      studentID: studentID,
      level: level
    };
    await this.authService.storeAppliedJob(appliedJob)
  };

  async getAllJob() {
    const snapshot = await firebase.firestore().collection('jobData').get();
    snapshot.docs.map(doc => {
      if(doc.id == this.jobID){
        this.ListArray = doc.data().description;
      }
    });


    const snapshot1 = await firebase.firestore().collection('companyProfile').get();
    snapshot1.docs.map(doc => {
      console.log('id:', doc.id, doc.data())
      if(doc.id == this.employerID){
        this.getCompanyData = doc.data();
        this.descript = doc.data().description;
        this.name = doc.data().name;
        this.com_location = doc.data().com_location;
        this.industry = doc.data().industry;
        this.email = doc.data().email;
        // console.log('here')
      }
    });
     console.log('here----', this.getCompanyData);
  }

  async find() {
    this.flag = false;
    const snapshot2 = await firebase.firestore().collection('appliedJob').get();
    this.getAppliedJob = snapshot2.docs.map(doc => doc.data());
    this.getAppliedJob.map(item => {
      if (item.studentID == this.authService.currentUserInstance.uid) {
        if (item.employerID == this.employerID) {
          if (item.jobID == this.jobID) {
            this.flag = true;
          }
        }
      }
    })
    // return this.flag;
  }
}
