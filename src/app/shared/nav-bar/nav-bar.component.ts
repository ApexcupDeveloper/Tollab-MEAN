import {Component, OnInit} from '@angular/core';
import {ModalController, Platform, PopoverController} from '@ionic/angular';
import {DropdownUserMenuComponent} from '../dropdown-user-menu/dropdown-user-menu.component';
import {AuthService} from '../../auth/auth.service';
import {LogInComponent} from '../../auth/log-in/log-in.component';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {

    constructor(public platform: Platform,
                public popoverCtrl: PopoverController,
                public authService: AuthService,
                public modalCtrl: ModalController) {
    }

    ngOnInit() {
    }

    async onPresentPopover(ev: any) {
        const popover = await this.popoverCtrl.create({
            component: DropdownUserMenuComponent,
            event: ev,
            translucent: true,
            backdropDismiss: true,
            showBackdrop: false,
            keyboardClose: true,
            mode: 'ios',
            cssClass: 'dropdown-user-menu'
        });
        return await popover.present();
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

    // async onDisplaySignupModal() {
    //     const modal = await this.modalCtrl.create({
    //         component: SignupComponent,
    //         showBackdrop: true,
    //         backdropDismiss: true,
    //         keyboardClose: true,
    //         cssClass: 'modal-auto-height-auto-width'
    //     });
    //     await modal.present();
    // }
}
