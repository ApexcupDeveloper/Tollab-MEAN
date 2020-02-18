import { Component, OnInit } from '@angular/core';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-detail-job',
  templateUrl: './detail-job.page.html',
  styleUrls: ['./detail-job.page.scss'],
})
export class DetailJobPage implements OnInit {

  public companyData: Observable<CompanyData>;

  ListJob: any;
  currentJob: any;
  public comData: any;

  flag: boolean = false;

  myjobtitle: string;


  constructor(public router: Router,
    public authService: AuthService) { 
      this.flag = false;
      this.getAllJob();
      this.getCompanyData();
    }

  ngOnInit() {
  
  }

  async getAllJob() {
    this.currentJob = [];
    const snapshot = await firebase.firestore().collection('jobData').get();
    this.ListJob = snapshot.docs.map(doc => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });
    this.ListJob.map(temp => {
      if (temp.userID === this.authService.currentUserInstance.uid) {
        this.currentJob.push(temp);
        this.flag = true;
      }
      return this.currentJob;
    });
  }

  async getCompanyData() {
    const snapshot = await firebase.firestore().collection('companyProfile').get();
    this.comData = snapshot.docs.map(doc => doc.data())
  }

  async goPost() {
    await this.router.navigate(['/post']);
  }

  async goDetail(jobID: string) {

    await this.router.navigate(['/detail-employer'], {
      queryParams: { jobID: jobID}
    });
  }

}
