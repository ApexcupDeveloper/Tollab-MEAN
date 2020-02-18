import { Component, OnInit, Input } from '@angular/core';
import { AuthService, UserData, CompanyData, JobData } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ModalController, Platform, PopoverController } from '@ionic/angular';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { JobdetailComponent } from '../../jobdetail/jobdetail.component'
import 'firebase/auth';


@Component({
  selector: 'app-hired',
  templateUrl: './hired.component.html',
  styleUrls: ['./hired.component.scss'],
})
export class HiredComponent implements OnInit {

  public ListStudent: any;
  public ListAppliedStudent: any;

  ListJob: any;
  currentJob: any;
  ListJobID: any;
  currentJobID: any;
  appliedStudent: any;
  appliedData:any=[];
  space:string=' ';
  constructor(
    public router: Router,
    public modalCtrl: ModalController,
    public authService: AuthService
  ) {
   }

  @Input() student: any;

  ngOnInit() {
    // console.log('get data:', this.student);
    this.getHire();
  }

  async getHire(){
    this.appliedData=[];
    console.log('student:', this.student);
    this.student.map(item=>{
      if(item.level == 4){
        this.appliedData.push(item);
      }
    })
    console.log('student:', this.appliedData);
  }

  async goChat(userName: string) {

    await this.router.navigate(['/chat'], {
      queryParams: { userName: userName, myID:this.authService.currentUserInstance.uid}
    });
  }

}
