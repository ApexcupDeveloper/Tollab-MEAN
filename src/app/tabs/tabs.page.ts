import {Component, OnInit} from '@angular/core';
import {Platform} from '@ionic/angular';

import {NotificationsService} from '../notifications/notifications.service';
import {AuthService} from '../auth/auth.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {
    public messagesNo: number;
    public notificationNo: number;

    constructor(public notificationsService: NotificationsService, public platform: Platform, public authService: AuthService) {
    }

    ngOnInit(): void {
        // TODO: Do the same for messages!
        this.notificationNo = this.notificationsService.notifications.length;
    }
}
