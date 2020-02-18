import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService, UserData, CompanyData, JobData } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, scan, switchMap, tap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.page.html',
  styleUrls: ['./confirm-email.page.scss'],
})
export class ConfirmEmailPage implements OnInit {

  constructor(public auth: AngularFireAuth,
    public authService: AuthService) { }

  currentEmail: any;
  ListEmail: any;

  ngOnInit() {
    this.getEmail();
  }
  resend(){
    this.auth.auth.currentUser.sendEmailVerification();
  }

  async getEmail(){
    this.currentEmail = [];
    const snapshot = await firebase.firestore().collection('users').get();
    this.ListEmail = snapshot.docs.map(doc => {
      const id = doc.id;
      const data = doc.data();
      // console.log('email: ', id, data);
      return { id, ...data };
    });
    this.ListEmail.map(temp => {
      if (temp.id === this.authService.currentUserInstance.uid) {
        this.currentEmail = temp.email;
      }
    });
    // console.log('email: ', this.currentEmail);
     return this.currentEmail;
  }

}
