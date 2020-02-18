import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {ModalController} from '@ionic/angular';
import {SignUpComponent} from '../sign-up/sign-up.component';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
    public logInForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    constructor(public authService: AuthService, public modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    async onSubmit() {
        const credential = await this.authService.emailLogIn(this.logInForm.value.email, this.logInForm.value.password);
        if (credential) {
            await this.modalCtrl.dismiss();
        }
    }
    async onDisplaySignUp() {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({
            component: SignUpComponent,
            showBackdrop: true,
            backdropDismiss: true,
            keyboardClose: true,
            cssClass: 'modal-auto-height-auto-width'
        });
        await modal.present();
    }

    async sendResetPassword() {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({
            component: ForgotPasswordComponent,
            showBackdrop: true,
            backdropDismiss: true,
            keyboardClose: true,
            cssClass: 'modal-auto-height-auto-width'
        });
        await modal.present();
    }

   
}
