import {Component, OnInit} from '@angular/core';
import {LogInComponent} from '../auth/log-in/log-in.component';
import {ModalController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.page.html',
    styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
    constructor(private modalCtrl: ModalController, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.activatedRoute.fragment.subscribe(fragment => {
            if (fragment) {
                document.querySelector('#' + fragment).scrollIntoView();
            }
        });
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

    onScrollToAbout() {
        document.querySelector('#about').scrollIntoView();
    }
}
