import { Component, OnInit } from '@angular/core';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { JobdetailComponent } from '../jobdetail/jobdetail.component'
import 'firebase/auth';

@Component({
  selector: 'app-detail-employer',
  templateUrl: './detail-employer.page.html',
  styleUrls: ['./detail-employer.page.scss'],
})
export class DetailEmployerPage implements OnInit {

  jobID: string;
  jobTitle: string;

  ListJob: any;
  currentJob: any;
  ListJobID: any;
  currentJobID: any;
  appliedStudent: any;
  ListStudent: any;
  public comData: any;
  public state: number;

  listData: any;
  appliedData:any;

  myjobtitle: string;
  inboxe: boolean = true;
  list1e: boolean = false;
  list2e: boolean = false;
  list3e: boolean = false;
  hirede: boolean = false;
  searchkey:string = '';
  temp: boolean;
  space: string = ' ';
  constructor(public router: Router,
    public modalCtrl: ModalController,
    public afs: AngularFirestore,
    private route: ActivatedRoute,
    public authService: AuthService) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(event => {
      this.jobID = event.jobID;
    });

    this.getCurrentJob();
    this.getAppliedStudent();
    this.getData();
    this.inboxe = true;

  }

  async getCurrentJob() {
    const snapshot = await firebase.firestore().collection('jobData').get();
    this.ListJob = snapshot.docs.map(doc => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });

    this.ListJob.map(temp => {
      if (temp.id == this.jobID) {
        this.currentJob = temp;
      }
    });
    this.jobTitle = this.currentJob.job_title;
  }

  async getAppliedStudent() {
    this.appliedStudent = [];
    const snapshot = await firebase.firestore().collection('appliedJob').get();
    this.ListStudent = snapshot.docs.map(doc => {
      const appliedID = doc.id;
      const data = doc.data();
      return { appliedID, ...data };
    });
    this.ListStudent.map(temp => {
      if (temp.employerID == this.authService.currentUserInstance.uid && temp.jobID == this.jobID) {
        this.appliedStudent.push(temp);
      }
    });
    console.log('applied :', this.appliedStudent);
  }
  async getData() {
    this.listData = [];
    this.appliedData = [];
    const snapshot = await firebase.firestore().collection('studentsData').get();
    snapshot.docs.map(doc => {
      this.appliedStudent.map(item=>{
        if(item.studentID == doc.id){
          const sid = item.studentID;
          const aid = item.appliedID;
          const level = item.level;
          const data = doc.data();
         this.listData.push({sid, aid, level, ...data}); 
        }
      })
    });
    console.log('listData :', this.listData);
    const snapshot1 = await firebase.firestore().collection('users').get();
    snapshot1.docs.map(doc => {
      this.listData.map(item=>{
        if(doc.id == item.sid){
          const name = doc.data().name.firstName + this.space + doc.data().name.lastName;
          const data = item;
          this.appliedData.push({name, ...data});
        }
      })
    });

    
    console.log('appliedData :', this.appliedData);
  }

  async goEdit() {
    await this.router.navigate(['/post']);
  }

  async goModal(title: string) {
    const modal = await this.modalCtrl.create({
      component: JobdetailComponent,
      componentProps: {
        title: title
      },
      showBackdrop: true,
      backdropDismiss: true,
      keyboardClose: true,
      cssClass: 'modal-auto-height-auto-width',
    });
    await modal.present();
  }

  async goClose() {

    if (confirm('Are you sure you want to delete this this job?')) {
      // Save it!
      this.appliedStudent.map(temp => {
        this.authService.deleteAppliedJob(temp.appliedID);
      })
      await this.authService.deleteJobData(this.jobID);
      location.reload();
      await this.router.navigate(['/detail-job']);
    } else {
      // Do nothing!
    }

  }
  async goSelect(appliedID: string){
    let level = 1;
    await this.authService.updateAppliedJob(appliedID, level).then((res)=>{
      alert('You have selected a student!');
      location.reload();
    })
  }
  async goChat(userID: string) {
    console.log('userID:', userID);
    await this.router.navigate(['/chat'], {
      queryParams: { userName: userID, myID:this.authService.currentUserInstance.uid}
    });
  }

  async inbox() {
    this.inboxe = true;
    this.list1e = false;
    this.list2e = false;
    this.list3e = false;
    this.hirede = false;
    this.state = 0;
  }
  async list1() {
    this.list1e = true;
    this.inboxe = false;
    this.list2e = false;
    this.list3e = false;
    this.hirede = false;
    this.state = 1;

  }
  async list2() {
    this.list2e = true;
    this.inboxe = false;
    this.list3e = false;
    this.list1e = false;
    this.hirede = false;
    this.state = 2;
  }
  async list3() {
    this.list3e = true;
    this.inboxe = false;
    this.list1e = false;
    this.list2e = false;
    this.hirede = false;
    this.state = 3;
  }
  async hired() {
    this.hirede = true;
    this.inboxe = false;
    this.list1e = false;
    this.list2e = false;
    this.list3e = false;
    this.state = 4;
  }

}
