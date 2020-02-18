import { Component } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { first } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import 'firebase/analytics';

import { AuthService } from './auth/auth.service';
import { DataStorageService } from './data-storage.service';
import { LanguageService } from './language.service';
import { LogInComponent } from './auth/log-in/log-in.component';
import { ProfileDataService } from './profile/profile-data.service';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        public platform: Platform,
        public splashScreen: SplashScreen,
        public statusBar: StatusBar,
        public authService: AuthService,
        public dataStorageService: DataStorageService,
        public languageService: LanguageService,
        public modalCtrl: ModalController,
        private profileDataService: ProfileDataService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            /**
             * Initializing/Activating firebase analytics.
             */
            firebase.analytics();
            /**
             * Initializing the application's language.
             */
            this.languageService.initializeAppLanguage();
        });
    }

    /**
     * Logs out the user.
     */
    async onLogOut() {
        await this.authService.signOut();
    }

    async onDisplayLoginModal() {
        const modal = await this.modalCtrl.create({
            component: LogInComponent,
            showBackdrop: true,
            backdropDismiss: true,
            keyboardClose: true,
            cssClass: 'modal-auto-height-auto-width'
        });
        await modal.present();
    }

    async onClickProfile() {
        const user = this.authService.currentUserInstance;
        if (user) {
            if (!await this.profileDataService.getStudentData(user.uid).pipe(first()).toPromise()) {
                const modal = await this.modalCtrl.create({
                    component: SignUpComponent,
                    showBackdrop: true,
                    backdropDismiss: true,
                    keyboardClose: true,
                    cssClass: 'modal-auto-height-auto-width',
                    componentProps: {
                        hasProvider: true
                    }
                });
                await modal.present();
            }
        } else {
            await this.onDisplayLoginModal();
        }
    }
}
