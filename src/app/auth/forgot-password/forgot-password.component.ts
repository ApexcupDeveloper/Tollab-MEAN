import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {

    form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email])
    });
    errorMsg = '';
    sent = false;

    constructor(private authService: AuthService) {
    }

    ngOnInit() {
    }

    async sendPasswordReset() {
        this.errorMsg = '';
        if (this.form.invalid) {
            this.errorMsg = '*Value has to be a valid email';
            return;
        }
        try {
            await this.authService.sendPasswordReset(this.form.value.email);
            this.sent = true;
        } catch (e) {
            console.log(e);
        }
    }
}
