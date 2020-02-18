import {Component, OnInit} from '@angular/core';

import {AuthService} from '../../auth.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-facebook-log-in',
    templateUrl: './facebook-log-in.component.html',
    styleUrls: ['./facebook-log-in.component.scss'],
})
export class FacebookLogInComponent implements OnInit {

    constructor(public authService: AuthService, public modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    async onLogIn() {
        await this.authService.facebookLogin();
    }
}
