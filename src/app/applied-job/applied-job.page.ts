import { Component, OnInit } from '@angular/core';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { JobdetailComponent } from '../jobdetail/jobdetail.component'
import 'firebase/auth';


@Component({
  selector: 'app-applied-job',
  templateUrl: './applied-job.page.html',
  styleUrls: ['./applied-job.page.scss'],
})
export class AppliedJobPage implements OnInit {

  ListJob: any;
  AppliedJobData: any;
  appliedAllData: any;

  mySubscription: any;
  policies: any;
  id: string = '';
  public isUserLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public router: Router,
    public modalCtrl: ModalController,
    public afs: AngularFirestore,
    private route: ActivatedRoute,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.id = queryParams.id;
    });
    this.getAlliedJobData();

  }
  async getAlliedJobData() {
    this.AppliedJobData = [];
    const snapshot = await firebase.firestore().collection('jobData').get();
    snapshot.docs.map(doc => {
      firebase.firestore().collection('appliedJob').where('studentID','==',`${this.id}`).where('jobID','==', `${doc.id}`).get().then(item=>{
        item.docs.map(temp=>{
          const aplliedID = temp.id;
          const data = temp.data();
          const data_job = doc.data();
          this.AppliedJobData.push({aplliedID, data, data_job});
        })
      })
    });
    console.log('listJob---- :',this.AppliedJobData);
    this.appliedAllData = [];
    const snapshot1 = await firebase.firestore().collection('companyProfile').get();
    snapshot1.docs.map(doc => {
      this.AppliedJobData.map(item => {
        if (doc.id == item.data_job.userID) {
          this.appliedAllData.push({ item, ...doc.data() });
        }
      })
    });
    console.log('allData :', this.appliedAllData);
  }
  goClose(aid: string) {
    if (confirm('Are you sure you want to delete this this job?')) {
      // Save it!
      // console.log('aid:', aid);
      this.authService.deleteAppliedJob(aid);
      this.getAlliedJobData();
    } else {
      // Do nothing!
    }

  }
}
