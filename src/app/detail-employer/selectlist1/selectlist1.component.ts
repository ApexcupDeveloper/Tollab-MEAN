import { Component, OnInit, Input } from '@angular/core';
import { AuthService, UserData, CompanyData, JobData } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { JobdetailComponent } from '../../jobdetail/jobdetail.component'
import { DetailEmployerPage } from '../../detail-employer/detail-employer.page'
import 'firebase/auth';


@Component({
  selector: 'app-selectlist1',
  templateUrl: './selectlist1.component.html',
  styleUrls: ['./selectlist1.component.scss'],
})
export class Selectlist1Component implements OnInit {

  public ListStudent: any;
  public ListAppliedStudent: any;

  ListJob: any;
  currentJob: any;
  ListJobID: any;
  currentJobID: any;
  appliedStudent: any;
  appliedData: any;
  space: string = ' ';

  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public authService: AuthService,
    public detail: DetailEmployerPage
  ) {
  }

  @Input() student: any;

  ngOnInit() {
    // console.log('get data:', this.student);
    this.getList1();
  }

  async getList1() {
    this.appliedData = [];
    console.log('student:', this.student);
    this.student.map(item => {
      if (item.level == 1) {
        this.appliedData.push(item);
      }
    })
    console.log('student:', this.appliedData);
  }

  async goSelect(appliedID: string) {
    let level = 2;
    await this.authService.updateAppliedJob(appliedID, level).then((res) => {
      alert('You have selected a student!');
      this.detail.getCurrentJob();
      this.detail.getAppliedStudent();
      this.detail.getData();
      this.getList1();
    })
  }

  async goChat(userName: string) {

    await this.router.navigate(['/chat'], {
      queryParams: { userName: userName, myID: this.authService.currentUserInstance.uid }
    });
  }

}
