import {Injectable} from '@angular/core';
import {FirebaseX} from '@ionic-native/firebase-x/ngx';
import {AngularFirestore} from '@angular/fire/firestore';
import {Platform, ToastController} from '@ionic/angular';
import {tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    notifications = [];

    constructor(private firebaseNative: FirebaseX,
                private angularFireStore: AngularFirestore,
                private platform: Platform,
                private toastCtrl: ToastController) {
    }

    private async getToken(uid: string) {
        let token;
        if (this.platform.is('cordova')) {
            token = await this.firebaseNative.getToken();
            if (this.platform.is('ios')) {
                await this.firebaseNative.grantPermission();
            }
        } else {

        }
        return await this.saveTokenToFireStore(token, uid);
    }

    private async saveTokenToFireStore(token: string, uid: string) {
        if (!token) {
            return;
        }
        const deviceRef = this.angularFireStore.collection('devices');
        const docData = {
            token,
            uid
        };
        return deviceRef.doc(token).set(docData);
    }

    private listenToNotifications() {
        return this.firebaseNative.onMessageReceived();
    }

    async getNotifications(uid: string) {
        await this.getToken(uid);
        return this.listenToNotifications().pipe(tap(async msg => {
            const toast = await this.toastCtrl.create({
                message: msg.body,
                duration: 3000
            });
            this.notifications.push(msg);
            await toast.present();
        }));
    }
}
