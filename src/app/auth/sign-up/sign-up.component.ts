import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInput, IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import { AuthService, UserData } from '../auth.service';
import { PhoneVerificationComponent } from '../phone-verification/phone-verification.component';
import { ProfileDataService } from '../../profile/profile-data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(IonSlides, { static: false }) slides: IonSlides;
    @ViewChild('emailInputField', { static: false }) emailInputField: IonInput;

    @Input() hasProvider: boolean;

    slideOpts = {
        allowSlideNext: false
    };

    step = 1;

    
    fullName = new FormGroup({
        firstName: new FormControl(
            null,
            [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
        ),
        lastName: new FormControl(
            null,
            [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
        )
    });

    education = new FormGroup({
        school: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        majors: new FormArray([
            new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
        ]),
        enrollDate: new FormControl(null, Validators.required),
        current: new FormControl(null),
        graduationDate: new FormControl(null, Validators.required)
    });

    today = new Date();
    twentyYearsLater = new Date(this.today.getFullYear() + 20, this.today.getMonth(), this.today.getDate());

    registration = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(
            null,
            [Validators.required, Validators.minLength(6), Validators.maxLength(32)]
        ),
        passwordConfirmation: new FormControl(
            null,
            [Validators.required, Validators.minLength(6), Validators.maxLength(32)]
        )
    }, this.passwordsMatch);

    credential: firebase.auth.UserCredential;
    emailExists = false;
    isPasswordShort = false;
    isPasswordsMatch = true;
    activeSlide = 'Full Name';
    private subscriptions = new Subscription();

    constructor(public authService: AuthService,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public profileDataService: ProfileDataService,
        public toastCtrl: ToastController,
        public router: Router) {
    }

    ngOnInit() {
        const sub1 = this.registration.valueChanges.subscribe(() => {
            const errors = this.registration.errors;
            const isPasswordGroupDirty: boolean = this.registration.controls.password.dirty
                && this.registration.controls.passwordConfirmation.dirty;
            const passwordErrors = this.registration.controls.password.errors;
            const isPasswordFieldDirty: boolean = this.registration.controls.password.dirty;
            this.isPasswordsMatch = !(isPasswordGroupDirty && errors && errors.hasOwnProperty('passwords-does-not-match'));
            this.isPasswordShort = isPasswordFieldDirty && passwordErrors && passwordErrors.hasOwnProperty('minlength');
        });
        this.subscriptions.add(sub1);
        if (this.hasProvider) {
            this.activeSlide = 'Education';
        } else {
            this.modalCtrl.getTop().then(modal => {
                modal.backdropDismiss = false;
                modal.keyboardClose = false;
            });
        }
    }

    async ngAfterViewInit() {
        const subscription = this.slides.ionSlideTransitionEnd.subscribe(async () => {
            const index = await this.slides.getActiveIndex();
            this.step = index + 1;
            if (!this.hasProvider && index === 1) {
                await this.emailInputField.setFocus();
            }
        });
        this.subscriptions.add(subscription);
    }

    async onGoBack() {
        if (this.step !== 1) {
            this.step -= 1;
            await this.slides.lockSwipeToNext(false);
            await this.slides.slidePrev();
            await this.slides.lockSwipeToNext(true);
        }
        if (this.hasProvider) {
            if (this.step === 1) {
                this.activeSlide = 'Education';
            }
        } else {
            if (this.step === 1) {
                this.activeSlide = 'Full Name';
            } else if (this.step === 2) {
                this.activeSlide = 'Education';
            } else if (this.step === 3) {
                this.activeSlide = 'Registration';
            }
        }
    }

    async onGoNext() {
        this.step += 1;
        await this.slides.lockSwipeToNext(false);
        await this.slides.slideNext();
        await this.slides.lockSwipeToNext(true);
    }

    passwordsMatch(registrationGroup: FormGroup): { [error: string]: boolean } {
        if (registrationGroup.controls.password.value !== registrationGroup.controls.passwordConfirmation.value) {
            return { 'passwords-does-not-match': true };
        }
        return null;
    }

    async onSignUp() {
        const loading = await this.loadingCtrl.create();
        await loading.present();
        try {
            if (!this.hasProvider) {
                this.isPasswordsMatch = true;
                this.emailExists = false;
                this.credential = await this.authService.emailSignUp(this.registration.value.email, this.registration.value.password);
                console.log('Sign up crfedential: ', this.credential);
            }
            if (this.credential || this.hasProvider) {
                if (this.credential) {
                    await this.storeUserData();
                }
                const success = await this.storeEducationData();
                await loading.dismiss();
                await this.modalCtrl.dismiss();
                if (success) {
                    const modal = await this.modalCtrl.create({
                        component: PhoneVerificationComponent,
                        showBackdrop: true,
                        backdropDismiss: true,
                        keyboardClose: true,
                        cssClass: 'modal-auto-height-auto-width'
                    });
                    await modal.present();
                    await modal.onDidDismiss;
                }
                await this.router.navigate(['/profile']);
            }
        } catch (e) {
            if (!this.hasProvider) {
                this.emailExists = true;
            }
            await loading.dismiss();
            console.log(e);
        }
    }

    private async storeUserData() {
        let email: any;
        let firstName: string, lastName: string;
        let photoURL: string;
        const credentials = this.credential;

        email = this.registration.controls.email;
        firstName = this.fullName.controls.firstName.value;
        lastName = this.fullName.controls.lastName.value;
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
            role: 'student',
            photoURL
        };
        await this.authService.storeUserData(userData);
    }

    private async storeEducationData() {
        let message: string;
        let success = true;

        try {
            const value = this.education.value;

            const updatedData = {
                degrees: [
                    value
                ]
            };

            await this.profileDataService.storeStudentData(this.authService.currentUserInstance.uid, updatedData);
            // TODO: Bilingual support
            message = 'Education information was added successfully!';
        } catch (e) {
            message = 'An error occurred while adding your education information, please try again later!';
            console.log(e);
            success = false;
        }
        const toast = await this.toastCtrl.create({
            message,
            duration: 10000,
            showCloseButton: true
        });
        await toast.present();
        return success;
    }

    onAddMajor() {
        (this.education.get('majors') as FormArray)
            .push(new FormControl(null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50)
            ]));
    }

    onRemoveMajor() {
        (this.education.get('majors') as FormArray).removeAt(1);
    }

    getMajorsFormArray(): FormArray {
        return this.education.get('majors') as FormArray;
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
