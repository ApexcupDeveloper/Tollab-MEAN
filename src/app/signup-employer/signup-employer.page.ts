
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { AuthService, UserData } from '../auth/auth.service';
import { ProfileDataService } from '../profile/profile-data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup-employer',
  templateUrl: './signup-employer.page.html',
  styleUrls: ['./signup-employer.page.scss'],
})
export class SignupEmployerPage implements OnInit {

  e_email: string='';
  e_password: string='';
  e_password2: string='';
  e_firstname: string='';
  e_lastname: string='';
  @Input() hasProvider: boolean;

  isPasswordsMatch = true;
  credential: firebase.auth.UserCredential;
  emailExists = false;
  isPasswordShort = false;

  constructor(public authService: AuthService,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public profileDataService: ProfileDataService,
    public toastCtrl: ToastController,
    public router: Router) { }

  ngOnInit() {
  }

  passwordsMatch(): { [error: string]: boolean } {
    if (this.e_password !== this.e_password2) {
      alert('Password was not matched!');
      return { 'passwords-does-not-match': true };
    }
    return null;
  }

  async goSignup() {

    // const loading = await this.loadingCtrl.create();
    // await loading.present();
    // this.passwordsMatch();
    if(this.e_email==''||this.e_password==''||this.e_password2==''||this.e_firstname==''||this.e_lastname==''){
      alert('Please fill in the blanks')
    } else {
      this.passwordsMatch();
      try {
        if (!this.hasProvider) {
          this.isPasswordsMatch = true;
          this.emailExists = false;
          this.credential = await this.authService.emailSignUp(this.e_email, this.e_password);
          // console.log('signup data: ', this.e_email, this.e_password)
          console.log('Sign up crfedential: ', this.credential);
        }
        if (this.credential || this.hasProvider) {
          if (this.credential) {
            await this.storeUserData();
          }
          // await loading.dismiss();
          await this.router.navigate(['/post-profile']);
        }
      } catch (e) {
        if (!this.hasProvider) {
          this.emailExists = true;
        }
        // await loading.dismiss();
        console.log(e);
         alert('Email already exist!');
      }
    }
  }

  private async storeUserData() {
    let email: string;
    let firstName: string, lastName: string;
    let photoURL: string;
    const credentials = this.credential;

    email= this.e_email;
    firstName = this.e_firstname;
    lastName = this.e_lastname;
    photoURL = 'assets/svg/iconfinder_male3_403019.svg';

    await credentials.user.updateProfile({
      displayName: `${firstName} ${lastName}`,
      photoURL
    });
    const userData: UserData = {
      createdAt: new Date(credentials.user.metadata.creationTime),
      email: email,
      name: {
        firstName,
        lastName
      },
      role: 'employer',
      photoURL
    };
    await this.authService.storeUserData(userData);
    
  }
  
}


