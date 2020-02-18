import { Component, OnInit } from '@angular/core';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})

export class PostPage implements OnInit {

  public companyData: Observable<CompanyData>;

  public comData: any;

  constructor(public router: Router,
    public authService: AuthService) {
  }

  submit_place: string = '';
  job_title: string = '';
  show_info: string = '';
  job_type: string = '';
  employment_type: string = '';
  duration: string = '';
  study_job: string = '';

  description: string = '';
  job_role: string = '';
  student_number: string = '';
  salary: string = '';
  job_location: string = '';
  resume: boolean = false;
  cover: boolean = false;
  transcript: boolean = false;

  // startDate: string;
  // endDate: string;

  ngOnInit() {
    this.getCompanyData();
  }

  async getCompanyData() {

    const snapshot = await firebase.firestore().collection('companyProfile').get();
    this.comData = snapshot.docs.map(doc => doc.data())
    console.log('Here-----', this.comData);
    //  return snapshot.docs.map(doc => doc.data());
  }

  async goCreateJob() {
    if (this.submit_place == '' || this.job_title == '' || this.show_info == '' ||
      this.job_type == '' || this.employment_type == '' || this.duration == '' || 
      this.study_job == '' || this.description == '' || this.job_role == '' || 
      this.student_number == '' || this.salary == '' || this.job_location == '') {
        alert('You have to fill all fields!');
    } else {
       await this.storeJobData();
       location.reload();
    }
   
  }

  private async storeJobData() {
    let submit_place: string;
    let job_title: string;
    let show_info: string;
    let job_type: string;
    let employment_type: string;
    let duration: string;
    let study_job: string;

    let description: string;
    let job_role: string;
    let student_number: string;
    let salary: string;
    let job_location: string;
    let resume: boolean;
    let cover: boolean;
    let transcript: boolean;

    let userID: string;
    let com_name: string;
    let com_location: string;

    submit_place = this.submit_place;
    job_title = this.job_title;
    show_info = this.show_info;
    job_type = this.job_type;
    employment_type = this.employment_type;
    duration = this.duration;
    study_job = this.study_job;

    description = this.description;
    job_role = this.job_role;
    student_number = this.student_number;
    salary = this.salary;
    job_location = this.job_location;
    resume = this.resume;
    cover = this.cover;
    transcript = this.transcript;

    userID = this.authService.currentUserInstance.uid;

    const jobData: JobData = {
      submit_place: submit_place,
      job_title: job_title,
      show_info: show_info,
      job_type: job_type,
      employment_type: employment_type,
      duration: duration,
      study_job: study_job,

      description: description,
      job_role: job_role,
      student_number: student_number,
      salary: salary,
      job_location: job_location,
      resume: resume,
      cover: cover,
      transcript: transcript,

      userID: userID,
    };
    await this.authService.addJob(jobData);
    await this.router.navigate(['/detail-job']);
  }

}
