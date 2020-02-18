import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../auth.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-google-log-in',
    templateUrl: './google-log-in.component.html',
    styleUrls: ['./google-log-in.component.scss'],
})
export class GoogleLogInComponent implements OnInit {

    constructor(public authService: AuthService, public modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    async onLogIn() {
        await this.authService.googleLogin();
    }
}
