import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { environment } from '../../environments/environment';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { NotificationsService } from '../notifications/notifications.service';
import { WindowService } from '../window.service';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';


import { auth } from 'firebase/app';

import { Observable, of } from 'rxjs';
import { switchMap, first, map } from 'rxjs/operators';

// @Injectable({ providedIn: 'root' });

export interface UserData {
    createdAt: Date;
    email: string;
    name: {
        firstName: string;
        lastName: string;
    };
    role: 'student' | 'employer';
    phoneNumber?: string;
    photoURL?: string;
    skills?: string[];
}

export interface CompanyData {
    name: string;
    industry: string;
    website: string;
    com_location: string;
    description: string;
    size: string;
    email: string;
    logoURL: string;
    bannerURL: string;
    userID: string;
};
export interface videoData {
    downloadURL: string;
    path: string;
    userID: string;
};
export interface JobData {
    submit_place: string;
    job_title: string;
    show_info: string;
    job_type: string;
    employment_type: string;
    duration: string;
    study_job: string;

    description: string;
    job_role: string;
    student_number: string;
    salary: string;
    job_location: string;
    resume: boolean;
    cover: boolean;
    transcript: boolean;

    userID: string;
};

export interface EmployerData {

    job: {
        title: string;
        require: {
            agriculture?: boolean;
            art?: boolean;
            business?: boolean;
            civics?: boolean;
            communications?: boolean;
            computer?: boolean;
            education?: boolean;
            engineering?: boolean;
            general?: boolean;
            health?: boolean;
            life?: boolean;
            math?: boolean;
            natural?: boolean;
            social?: boolean;
        };
    };
    phone: number;
    school?: string;
    year?: number;
    userID: string;
}

export interface AppliedJob {
    employerID: string;
    studentID: string;
    jobID: string;
    level: number;
}

interface GoogleProfile {
    email: string;
    family_name: string;
    given_name: string;
    granted_scopes: string;
    id: string;
    locale: string;
    name: string;
    picture: string;
    verified_email: string;
}

interface FacebookProfile {
    id: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    name: string;
    name_format: string;
    picture: string;
    short_name: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy {

    reference: any;

    // TODO: Change user, user credential and user data to observables. Confirm if needed!
    private readonly user: Observable<firebase.User>;
    private readonly employer: Observable<firebase.User>;
    private userData: UserData;
    private employerData: EmployerData;
    private companyData: CompanyData;
    private jobData: JobData;
    private videoData: videoData;
    private appliedJob: AppliedJob;
    private windowRef: Window;
    private readonly authSubscription: Subscription;
    private notificationsSubscription: Subscription;
    private userDataSubscription: Subscription;

    constructor(private windowService: WindowService,
        private angularFireAuth: AngularFireAuth,
        private angularFirestore: AngularFirestore,
        private firebaseNative: FirebaseX,
        private firebaseAuthentication: FirebaseAuthentication,
        private facebook: Facebook,
        private googlePlus: GooglePlus,
        private platform: Platform,
        private router: Router,
        private afs: AngularFirestore,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private translateService: TranslateService,
        private notificationsService: NotificationsService) {
        /**
         * The auth service's user is the user signed in using angular fire auth.
         * Subscription to the change of authentication status observable is
         * necessary to stop receiving notifications if the user signed out.
         */
        this.user = this.angularFireAuth.user.pipe(tap(async user => {
            if (user) {
                await this.retrieveUserData(user.uid);
                await this.retrieveCompanyData(user.uid);
                await this.retrieveJobData(user.uid);
                // await this.currentCompanyData(user.uid);
                // await this.getJobCount();
                const credentials = await this.angularFireAuth.auth.getRedirectResult();

                if (credentials && credentials.user && credentials.additionalUserInfo.isNewUser) {

                    let profile;
                    let userData: UserData;

                    if (credentials.additionalUserInfo.providerId.includes('google')) {
                        profile = credentials.additionalUserInfo.profile as GoogleProfile;
                        userData = {
                            createdAt: new Date(credentials.user.metadata.creationTime),
                            email: profile.id,
                            name: {
                                firstName: profile.given_name,
                                lastName: profile.family_name
                            },
                            role: 'student',
                            photoURL: profile.picture
                        };
                    } else if (credentials.additionalUserInfo.providerId.includes('facebook')) {
                        profile = credentials.additionalUserInfo.profile as FacebookProfile;
                        userData = {
                            createdAt: new Date(credentials.user.metadata.creationTime),
                            email: profile.email,
                            name: {
                                firstName: profile.first_name,
                                lastName: profile.last_name
                            },
                            role: 'student',
                            photoURL: profile.picture
                        };
                    }
                    await this.storeUserData(userData);
                    await this.retrieveUserData(user.uid);
                    await this.router.navigate(['/profile']);
                }

                // TODO: Check this!!
                if (this.notificationsSubscription) {
                    this.notificationsSubscription.unsubscribe();
                }
                const notificationsObservable = await this.notificationsService.getNotifications(user.uid);
                this.notificationsSubscription = notificationsObservable.subscribe();
                // console.log({user, userData: this.userData});
                return this.angularFirestore.doc<any>(`users/${user.uid}`).valueChanges();
            } else {
                this.userData = null;
            }
        }));
        if (this.platform.is('cordova')) {
            this.authSubscription = this.firebaseAuthentication.onAuthStateChanged().pipe(tap(user => {
                if (!user) {
                    if (this.notificationsSubscription) {
                        this.notificationsSubscription.unsubscribe();
                    }
                }
            })).subscribe();
        }
    }

    ngOnInit(): void {
    }

    /**
     * Creates a loading element and presents it.
     */
    private async presentLoading(): Promise<HTMLIonLoadingElement> {
        const loading = await this.loadingCtrl.create();
        await loading.present();
        return loading;
    }

    /**
     * Creates an alert element and presents it.
     * @param header The alert's header(title).
     * @param message The alert's message(body).
     * @param buttons The alert's buttons e.g: Okay, Close, Cancel, etc.
     */
    async presentAlert(header: string, message: string, buttons: string[]) {
        header = await this.translateService.get(header).toPromise();
        message = await this.translateService.get(message).toPromise();
        const buttonsLoop = async () => {
            for (let button of buttons) {
                button = await this.translateService.get(button).toPromise();
                buttons.pop();
                buttons.push(button);
            }
        };
        await buttonsLoop();
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons
        });
        await alert.present();
    }

    /**
     * Logs the user in using OAUTH 2.
     * @return A firebase.auth.UserCredential object
     * if the login is successful.
     */
    async socialProviderLogin(provider: 'google' | 'facebook') {
        const loading = await this.presentLoading();
        try {
            if (provider === 'google') {
                await (this.platform.is('cordova') ? this.nativeGoogleLogin() : this.webGoogleLogin());
            } else {
                await (this.platform.is('cordova') ? this.nativeFacebookLogin() : this.webFacebookLogin());
            }
            await loading.dismiss();
        } catch (e) {
            console.log(e);
            await loading.dismiss();
            if (!e.hasOwnProperty('code') || e.code !== 'auth/popup-closed-by-user') {
                await this.presentAlert(
                    'alert.connectionError.header',
                    'alert.connectionError.message',
                    ['alert.okay']
                );
            }
        }
    }

    /**
     * Logs the user in using google.
     * @return A firebase.auth.UserCredential object
     * if the login is successful.
     */
    async googleLogin() {
        await this.socialProviderLogin('google');
    }

    /**
     * Logs the user in using google on mobile phones.
     * @return A Promise that resolves to a firebase.auth.UserCredential
     * object when login succeeds.
     */
    private async nativeGoogleLogin(): Promise<firebase.auth.UserCredential> {
        const googlePlusUser = await this.googlePlus.login({
            webClientId: environment.webClientId,
            offline: true,
            scopes: 'profile email'
        });
        return await this.angularFireAuth.auth.signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(googlePlusUser.idToken)
        );
    }

    /**
     * Logs the user in using google on browsers.
     * @return A Promise that resolves to a firebase.auth.UserCredential
     * object when login succeeds.
     */
    private async webGoogleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider();
        await this.angularFireAuth.auth.signInWithRedirect(provider);
    }

    /**
     * Logs the user in using facebook.
     * @return A firebase.auth.UserCredential object
     * if the login is successful.
     */
    async facebookLogin() {
        await this.socialProviderLogin('facebook');
    }

    /**
     * Logs the user in using facebook on mobile phones.
     * @return A Promise that resolves to a firebase.auth.UserCredential
     * object when login succeeds.
     */
    private async nativeFacebookLogin(): Promise<firebase.auth.UserCredential> {
        const facebookLoginResponse: FacebookLoginResponse = await this.facebook.login(['public_profile', 'email']);
        return await this.angularFireAuth.auth.signInWithCredential(
            firebase.auth.FacebookAuthProvider.credential(facebookLoginResponse.authResponse.accessToken));
    }

    /**
     * Logs the user in using facebook on browsers.
     * @return A Promise that resolves to a firebase.auth.UserCredential
     * object when login succeeds.
     */
    private async webFacebookLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        await this.angularFireAuth.auth.signInWithRedirect(provider);
    }

    /**
     * Logs the user in using email and password.
     * @param email The user's input email.
     * @param password The user's input password.
     * @return A Promise that resolves to a firebase.auth.UserCredential
     * object when login succeeds.
     */
    async emailLogIn(email: string, password: string) {
        const loading = await this.presentLoading();
        const credential = await this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
        await loading.dismiss();
        return credential;
    }

    /**
     * Creates a new user using email and password.
     * @param email The user's input email.
     * @param password The user's input password.
     * @return A Promise that resolves to a firebase.auth.UserCredential
     * object when sign up succeeds.
     */
    async emailSignUp(email: string, password: string) {
        const loading = await this.presentLoading();
        try {

            const credential = await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
            await loading.dismiss();
            return credential;

        } catch (e) {
            await loading.dismiss();
            if (e.code == 'auth/email-already-in-use') {
                throw e;
            } else {
                await this.presentAlert(
                    'alert.connectionError.header',
                    'alert.connectionError.message',
                    ['alert.okay']
                );
                return null;
            }
        }
    }

    /**
     * Stores additional user info into firestore cloud after signing in for the first time.
     */
    async storeUserData(userData: UserData) {
        const uid = (await this.user.pipe(take(1)).toPromise()).uid;
        const userRef: AngularFirestoreDocument<UserData> = this.angularFirestore.doc(`users/${uid}`);
        await userRef.set(userData);
        this.userData = userData;
        return this.userData;
    }
    //apex
    async storeEmployerData(employerData: EmployerData) {
        const userRef: AngularFirestoreDocument<EmployerData> = this.angularFirestore.doc(`employerData/${this.currentUserInstance.uid}`);
        await userRef.set(employerData);
        this.employerData = employerData;
        return this.employerData;

    }

    async storeCompanyData(companyData: CompanyData) {
        console.log('companyData :', companyData);
        console.log('uid :', this.currentUserInstance.uid)
        const userRef: AngularFirestoreDocument<CompanyData> = this.angularFirestore.doc(`companyProfile/${this.currentUserInstance.uid}`);
        await userRef.set(companyData);
        this.companyData = companyData;
        return this.companyData;

    }

    getCompanyData(uid: string) {
        return this.angularFirestore.collection('companyProfile').doc<CompanyData>(uid).valueChanges();
    }

    async retrieveCompanyData(uid: string) {
        //   console.log('?????????????????????????');
        const comRef: AngularFirestoreDocument<CompanyData> = this.angularFirestore.doc(`companyProfile/${uid}`);
        this.companyData = await comRef.valueChanges().pipe(take(1)).toPromise();
        // console.log('here company :', this.companyData);
        return this.companyData;
    }

    async storeJobData(jobData: JobData) {
        // console.log('jobData :', jobData);
        // console.log('uid :', this.currentUserInstance.uid)
        const userRef: AngularFirestoreDocument<JobData> = this.angularFirestore.doc(`jobData`);
        await userRef.set(jobData);
        this.jobData = jobData;
        return this.jobData;
    }
    async storeVideoData(videoData: videoData) {
        // console.log('jobData :', jobData);
        // console.log('uid :', this.currentUserInstance.uid)
        const userRef: AngularFirestoreDocument<videoData> = this.angularFirestore.doc(`videos`);
        await userRef.set(videoData);
        this.videoData = videoData;
        return this.videoData;
    }

    async retrieveJobData(uid: string) {

        const snapshot = await firebase.firestore().collection('jobData').get();
        return snapshot.docs.map(doc => doc.data());

    }

    async deleteJobData(uid: string) {
        console.log('id ----', uid);
        const userRef: AngularFirestoreDocument<JobData> = this.angularFirestore.doc(`jobData/${uid}`);
        await userRef.delete();
    }

    async addJob(jobData: JobData) {
        console.log('data add :', jobData);
        const snapshot = await firebase.firestore().collection('jobData').add(jobData);
        // console.log('-------->', snapshot.docs.map(doc => doc.data()));
        // return snapshot.docs.map(doc => doc.data());
        return this.jobData;
    }


    /**
     * Returns the user's additional info stored in firestore cloud.
     */
    async retrieveUserData(uid: string) {
        const userRef: AngularFirestoreDocument<UserData> = this.angularFirestore.doc(`users/${uid}`);
        this.userData = await userRef.valueChanges().pipe(take(1)).toPromise();
        return this.userData;
    }

    /**
     * Updates the additional user info in the firestore cloud.
     */
    async updateUserData(userData: Partial<UserData>) {
        const uid = (await this.user.toPromise()).uid;
        const userRef: AngularFirestoreDocument<UserData> = this.angularFirestore.doc(`users/${uid}`);
        await userRef.update(userData);
        this.userData = { ...this.userData, ...userData };
        return this.userData;
    }

    // async updateEmployer(employerData: Partial<EmployerData>) {
    //     const uid = (await this.user.toPromise()).uid;
    //     const userRef: AngularFirestoreDocument<EmployerData> = this.angularFirestore.doc(`employerData/${uid}`);
    //     await userRef.update(employerData);
    //     this.employerData = { ...this.employerData, ...employerData };
    //     return this.employerData;
    // }

    async updateEmployer(_id: string, _value: string) {
        let doc = this.afs.collection('options', ref => ref.where('id', '==', _id));
        doc.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, data };
            }))).subscribe((_doc: any) => {
                let id = _doc[0].payload.doc.id; //first result of query [0]
                this.afs.doc(`employerData/${id}`).update({ logoURL: _value });
            })
    }
    async updateEmployer1(_id: string, _value: string) {
        let doc = this.afs.collection('options', ref => ref.where('id', '==', _id));
        doc.snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, data };
            }))).subscribe((_doc: any) => {
                let id = _doc[0].payload.doc.id; //first result of query [0]
                this.afs.doc(`employerData/${id}`).update({ bannerURL: _value });
            })
    }


    async storeAppliedJob(appliedJob: AppliedJob) {
        console.log('data add :', appliedJob);
        const snapshot = await firebase.firestore().collection('appliedJob').add(appliedJob);
        return this.appliedJob;
    }

    async updateAppliedJob(appliedID: string, level: number) {
        this.angularFirestore.doc(`appliedJob/${appliedID}`).update({ level: level });
        return this.appliedJob;
    }

    async updateEmployerData(id: string, req: any) {
        // this.angularFirestore.doc(`employerData/${id}`).update({ require : require });
        let i: number;
        let job: any;
        let agriculture: boolean = false;
        let art: boolean = false;
        let business: boolean = false;
        let civics: boolean = false;
        let communications: boolean = false;
        let computer: boolean = false;
        let education: boolean = false;
        let engineering: boolean = false;
        let general: boolean = false;
        let health: boolean = false;
        let life: boolean = false;
        let math: boolean = false;
        let natural: boolean = false;
        let social: boolean = false;
        for (i = 0; i < req.length; i++) {
            switch (req[i]) {

                case 'Agriculture':
                    agriculture = true
                    break;
                case 'Arts & Design':
                    art = true;
                    break;
                case 'Business':
                    business = true
                    break;
                case 'Civics & Govornment':
                    civics = true
                    break;
                case 'Communications':
                    communications = true
                    break;
                case 'Computer Science':
                    computer = true
                    break;
                case 'Education':
                    education = true
                    break;
                case 'Engineering':
                    engineering = true
                    break;
                case 'General Studies':
                    general = true
                    break;
                case 'Health Professions':
                    health = true
                    break;
                case 'Life Science':
                    life = true
                    break;
                case 'Math & Physical Sciences':
                    math = true
                    break;
                case 'Natural Resources':
                    natural = true
                    break;
                case 'Social Sciences':
                    social = true
                    break;
            }
        }

            job = {
              require: {
                agriculture,
                art,
                business,
                civics,
                communications,
                computer,
                education,
                engineering,
                general,
                health,
                life,
                math,
                natural,
                social
              }
            };
        this.angularFirestore.doc(`employerData/${id}`).update({job});
        return this.employerData;
    }

    async updateCompanyProfile(id: string, type: string, des: string) {

        // this.angularFirestore.doc(`companyProfile/${id}`).update({ type : des });
        if (type == 'description') {
            this.angularFirestore.doc(`companyProfile/${id}`).update({ description: des });
        } else if (type == 'email') {
            this.angularFirestore.doc(`companyProfile/${id}`).update({ email: des });
        } else if (type == 'website') {
            this.angularFirestore.doc(`companyProfile/${id}`).update({ website: des });
        } else if (type == 'video') {
            this.angularFirestore.collection('video').add({ videoURL: des, userID: id });
        } else if (type == 'perks') {
            this.angularFirestore.collection('perks').add({ perk: des, userID: id });
        }

        return this.companyData;
    }

    async deleteAppliedJob(appliedID: string) {
        this.angularFirestore.doc(`appliedJob/${appliedID}`).delete();
        return this.appliedJob
    }


    private async oAuthLogin(provider) {
        const credential = await this.angularFireAuth.auth.signInWithPopup(provider);
        return this.updateUserData(credential.user);
    }
    /**
     * Signs the user out.
     */
    async signOut() {
        const loading = await this.presentLoading();
        await this.angularFireAuth.auth.signOut();
        if (this.platform.is('cordova')) {
            await this.googlePlus.logout();
            await this.facebook.logout();
            // TODO: Make sure this is right!!
            await this.firebaseAuthentication.signOut();
        }
        if (this.notificationsSubscription) {
            this.notificationsSubscription.unsubscribe();
        }
        if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
        }
        this.userData = null;
        await loading.dismiss();
        await this.router.navigate(['/']);
    }

    /**
     * Returns an Observable of the user.
     */
    get currentUser(): Observable<firebase.User> {

        return this.user;

    }

    async getUser() {
        return this.user.pipe(first()).toPromise();
    }

    get currentUserInstance() {
        return this.angularFireAuth.auth.currentUser;
    }


    /**
     * Returns the current user's additional info.
     */
    get currentUserData() {
        //  console.log('user data :', this.userData.role)

        return this.userData;


    }

    get currentCompanyData() {
        //   console.log('company data :', this.companyData)
        //    return this.retrieveCompanyData(this.currentUserInstance.uid);
        return this.companyData;
    }


    get currentJobData() {
        //    console.log('job data :', this.jobData)
        //    return this.retrieveCompanyData(this.currentUserInstance.uid);
        return this.jobData;
    }

    /**
     * Initializes an invisible recaptcha verifier.
     */
    initializeRecaptcha() {
        this.windowRef = this.windowService.windowRef;
        this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container',
            {
                size: 'invisible'
            }
        );
        return this.windowRef;
    }

    /**
     * Sends a verification code to the input phone number.
     * @param phoneNumber Input phone number in e164 format.
     */
    async sendVerificationCode(phoneNumber: string): Promise<{ result: any, success: boolean }> {
        const loading = await this.presentLoading();
        try {
            let verificationResult: firebase.auth.ConfirmationResult | any;
            if (this.platform.is('cordova')) {
                verificationResult = await this.firebaseNative.verifyPhoneNumber(phoneNumber, 30000);
            } else {
                const appVerifier = await this.windowRef.recaptchaVerifier;
                verificationResult = await this.angularFireAuth.auth.currentUser.linkWithPhoneNumber(phoneNumber, appVerifier);
                this.windowRef.confirmationResult = verificationResult;
            }
            await loading.dismiss();
            return { result: verificationResult, success: true };
        } catch (e) {
            await this.presentPhoneVerificationAlert(e, loading);
            return { result: e, success: false };
        }
    }

    /**
     * Verifies the phone number automatically if that is supported.
     * Note: Android devices support auto verification.
     * @param verificationResult The confirmation result returned
     * from sending a verification code to the phone number.
     */
    async autoVerifyPhoneNumber(verificationResult) {
        let confirmationResult: firebase.auth.UserCredential = null;
        if (this.platform.is('cordova') && verificationResult.instantVerification) {
            const loading = await this.presentLoading();
            const code = verificationResult.code;
            const verificationId = verificationResult.verificationId;
            const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
            try {
                confirmationResult = await firebase.auth().currentUser.linkWithCredential(credential);
                await loading.dismiss();
            } catch (e) {
                await this.presentPhoneVerificationAlert(e, loading);
                throw e;
            }
        }
        return confirmationResult;
    }

    /**
     * Verifies the phone number with the input verification code.
     * @param verificationCode Input verification code.
     * @param verificationResult The confirmation result returned
     * from sending a verification code to the phone number.
     */
    async verifyPhoneNumber(verificationCode: string, verificationResult): Promise<{ result: any, success: boolean }> {
        const loading = await this.presentLoading();
        try {
            let confirmationResult: any;
            if (this.platform.is('cordova')) {
                const verificationId = verificationResult.verificationId;
                const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
                confirmationResult = await firebase.auth().currentUser.linkWithCredential(credential);
            } else {
                confirmationResult = await this.windowRef.confirmationResult.confirm(verificationCode);
            }
            await loading.dismiss();
            return { result: confirmationResult, success: true };
        } catch (e) {
            await this.presentPhoneVerificationAlert(e, loading);
            return { result: e, success: false };
        }
    }

    private async presentPhoneVerificationAlert(e, loading: HTMLIonLoadingElement) {
        let header: string, message: string;
        if (e.code === 'auth/credential-already-in-use') {
            header = 'alert.usedPhoneNumber.header';
            message = 'alert.usedPhoneNumber.message';
        } else {
            // TODO: MAYBE! Add an alert for sending too many requests!
            header = 'alert.connectionError.header';
            message = 'alert.connectionError.message';
        }
        await loading.dismiss();
        await this.presentAlert(
            header,
            message,
            ['alert.okay']
        );
    }

    /**
     * Sends password reset email
     * @param email duuuuhh
     */
    async sendPasswordReset(email: string) {
        await this.angularFireAuth.auth.sendPasswordResetEmail(email);
    }

    async verifyPasswordResetCode(code: string) {
        await this.angularFireAuth.auth.verifyPasswordResetCode(code);
    }

    async confirmPasswordReset(code: string, password: string) {
        await this.angularFireAuth.auth.confirmPasswordReset(code, password);
    }

    /**
     * Unsubscribe from all the observables' subscriptions.
     */
    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
        if (this.notificationsSubscription) {
            this.notificationsSubscription.unsubscribe();
        }
        if (this.userDataSubscription) {
            this.userDataSubscription.unsubscribe();
        }
    }
}
