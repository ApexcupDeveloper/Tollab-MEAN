import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-dropdown-user-menu',
    templateUrl: './dropdown-user-menu.component.html',
    styleUrls: ['./dropdown-user-menu.component.scss'],
})
export class DropdownUserMenuComponent implements OnInit {

    constructor(public authService: AuthService, public popoverCtrl: PopoverController) {
    }

    ngOnInit() {
    }

    /**
     * Logs out the user.
     */
    async onLogOut() {
        await this.popoverCtrl.dismiss();
        await this.authService.signOut();
    }

}
