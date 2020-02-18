import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';

import {Observable} from 'rxjs';
import {first, switchMap} from 'rxjs/operators';

import {User} from 'firebase';
import {ModalController} from '@ionic/angular';
import {AuthService} from './auth.service';
import {ProfileDataService} from '../profile/profile-data.service';
import {SignUpComponent} from './sign-up/sign-up.component';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService,
                private modalCtrl: ModalController,
                private profileDataService: ProfileDataService) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot):
        Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        // TODO: MAYBE: Replace with angular fire auth guard!
        // TODO: Add logic to prompt the user to sign up if the additional info is not stored!
        return this.authService.currentUser.pipe(switchMap(async user => {
            return user ? (await this.profileDataService.getStudentData(user.uid).pipe(first()).toPromise()
                ? true : await this.completeUserRegistration()) : this.router.createUrlTree(['./']);
        }));
    }

    async completeUserRegistration() {
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
        return this.router.createUrlTree(['./']);
    }
}
