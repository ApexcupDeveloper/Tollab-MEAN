import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonInput, IonSlides, ModalController, Platform} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Subscription, timer} from 'rxjs';
import {map} from 'rxjs/operators';

import * as firebase from 'firebase/app';

import {AuthService} from '../auth.service';

@Component({
    selector: 'app-phone-verification',
    templateUrl: './phone-verification.page.html',
    styleUrls: ['./phone-verification.page.scss'],
})
export class PhoneVerificationComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(IonSlides, {static: false}) slides: IonSlides;
    @ViewChild('firstDigit', {static: false}) firstDigit: IonInput;

    phoneNumber = new FormControl(null, [Validators.required, Validators.pattern(/^(05[69])[0-9]{7}/)]);
    verificationNumber = new FormGroup({
        firstDigit: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
        secondDigit: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
        thirdDigit: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
        fourthDigit: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
        fifthDigit: new FormControl(null, [Validators.required, Validators.maxLength(1)]),
        sixthDigit: new FormControl(null, [Validators.required, Validators.maxLength(1)])
    });

    slideOpts = {
        allowSlideNext: false
    };
    routerLink = '/log-in';
    public timer = 0;
    public subscriptions: Subscription[];
    public results: {
        verificationResult: { result: any, success: boolean },
        confirmationResult: { result: any, success: boolean }
    } = {
        verificationResult: null,
        confirmationResult: null
    };
    public windowRef: any;

    constructor(public authService: AuthService,
                public platform: Platform,
                public modalCtrl: ModalController) {
    }

    ngOnInit() {
        if (!this.platform.is('cordova')) {
            this.windowRef = this.authService.initializeRecaptcha();
        }
    }

    async ngAfterViewInit() {
        const sub1 = this.slides.ionSlideTransitionEnd.subscribe(async () => {
            const index = await this.slides.getActiveIndex();
            this.routerLink = index === 0 ? '/sign-up' : './';
            if (index === 1) {
                await this.firstDigit.setFocus();
            }
        });

        const sub2 = this.verificationNumber.valueChanges.subscribe(async () => {
            if (this.verificationNumber.valid) {
                const firstDigit = this.verificationNumber.value.firstDigit;
                const secondDigit = this.verificationNumber.value.secondDigit;
                const thirdDigit = this.verificationNumber.value.thirdDigit;
                const fourthDigit = this.verificationNumber.value.fourthDigit;
                const fifthDigit = this.verificationNumber.value.fifthDigit;
                const sixthDigit = this.verificationNumber.value.sixthDigit;

                const verificationCode = `${firstDigit}${secondDigit}${thirdDigit}${fourthDigit}${fifthDigit}${sixthDigit}`;

                this.results.confirmationResult = await this.authService
                    .verifyPhoneNumber(verificationCode, this.results.verificationResult.result);

                this.verificationNumber.setValue({
                    firstDigit: null,
                    secondDigit: null,
                    thirdDigit: null,
                    fourthDigit: null,
                    fifthDigit: null,
                    sixthDigit: null
                });

                // TODO: Add a message if the confirmation failed!

                if (this.results.confirmationResult.success) {
                    await this.slides.lockSwipeToPrev(true);
                    await this.modalCtrl.dismiss();
                } else if (this.results.confirmationResult.result.code === 'auth/credential-already-in-use') {
                    await this.onGoBack();
                } else {
                    await this.firstDigit.setFocus();
                }
            }
        });
        this.subscriptions = [sub1, sub2];
    }

    async onSendVerificationCode() {
        const country = '972';
        const num = `+${country}${this.phoneNumber.value.substr(1)}`;

        this.results.verificationResult = await this.authService.sendVerificationCode(num);
        if (this.results.verificationResult.success) {
            await this.onGoNext();
            this.resetTimer();
            /**
             * Checking if the phone number was auto verified
             */
            let credential: firebase.auth.UserCredential;
            try {
                credential = await this.authService.autoVerifyPhoneNumber(this.results.verificationResult.result);
            } catch (e) {
                if (e.code === 'auth/credential-already-in-use') {
                    await this.onGoBack();
                }
            }
            if (credential) {
                /**
                 * If the phone number is auto verified, the verification code input
                 * fields values are set to the verification code and the user is
                 * prompt to the home page.
                 */
                const verificationCode: string = this.results.verificationResult.result.code;
                /**
                 * Setting the verification code fields values.
                 */
                this.verificationNumber.setValue({
                    firstDigit: +verificationCode.charAt(0),
                    secondDigit: +verificationCode.charAt(1),
                    thirdDigit: +verificationCode.charAt(2),
                    fourthDigit: +verificationCode.charAt(3),
                    fifthDigit: +verificationCode.charAt(4),
                    sixthDigit: +verificationCode.charAt(5)
                });
                await this.modalCtrl.dismiss();
            }
        }
    }

    async onSelectNextDigitInput(input: IonInput) {
        await input.setFocus();
    }

    async onSelectPrevDigitInput(input: IonInput) {
        input.value = null;
        await input.setFocus();
    }

    public resetTimer() {
        const subscription = timer(0, 1000).pipe(map(time => {
            if (time <= 30) {
                return 30 - time;
            } else {
                /**
                 * To stop the timer and kill the subscription.
                 */
                subscription.unsubscribe();
            }
        })).subscribe(time => {
            this.timer = time;
        });
        this.subscriptions.push(subscription);
    }

    public async resendCode() {
        this.resetTimer();
        await this.onSendVerificationCode();
    }

    public async onGoBack() {
        await this.slides.lockSwipeToNext(false);
        await this.slides.slidePrev();
        await this.slides.lockSwipeToNext(true);
    }

    public async onGoNext() {
        await this.slides.lockSwipeToNext(false);
        await this.slides.slideNext();
        await this.slides.lockSwipeToNext(true);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });
    }
}
