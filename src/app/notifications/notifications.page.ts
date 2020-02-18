import {Component, OnInit} from '@angular/core';
import {NotificationsService} from './notifications.service';

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
    notifications = [];

    constructor(public notificationsService: NotificationsService) {
    }

    ngOnInit() {
        this.notifications = this.notificationsService.notifications;
    }

    onGoToNotification() {
        // TODO:Navigate to the appropriate page...maybe discard the function & just use a router link
    }
}
