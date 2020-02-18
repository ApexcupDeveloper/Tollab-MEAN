import {Injectable} from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {ToastController} from '@ionic/angular';
import {switchMap, tap} from 'rxjs/operators';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    private token: string;

    constructor(private angularFireMessaging: AngularFireMessaging,
                private angularFireFunctions: AngularFireFunctions,
                private toastCtrl: ToastController) {
    }

    private async makeToast(message) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 5000,
            showCloseButton: true,
            closeButtonText: 'Dismiss'
        });
        await toast.present();
    }

    getPermission() {
        return this.angularFireMessaging.requestToken.pipe(tap(token => this.token = token));
    }

    showMessages() {
        return this.angularFireMessaging.messages.pipe(tap(async msg => {
            const body: any = (msg as any).notification.body;
            await this.makeToast(body);
        }));
    }

    sub(topic: string) {
        this.angularFireMessaging.tokenChanges.pipe(switchMap(token => {
            if (!token || !token.length) {
                console.log('null token');
                return;
            }
            return this.angularFireFunctions.httpsCallable('subscribeToTopic')({token, topic})
                .pipe(tap(data => this.makeToast(`Subscribed to ${topic}`)));
        })).subscribe();
    }
}
