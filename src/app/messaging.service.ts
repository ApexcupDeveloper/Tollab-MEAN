import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import {BehaviorSubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {mergeMap, take} from 'rxjs/operators';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {AuthService} from './auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);

    constructor(private angularFireAuth: AngularFireAuth,
                private angularFirestore: AngularFirestore,
                private angularFireMessaging: AngularFireMessaging,
                private authService: AuthService) {
    }

    /*private updateToken() {
        this.angularFireAuth.authState.pipe(take(1)).subscribe(async user => {
            if (!user) {
                return;
            }
            const data = {[user.uid]: user.getIdToken()};
            await this.angularFirestore.collection('fcmTokens').add(data);
        });
    }*/

    requestPermission() {
        this.angularFireMessaging.requestToken
            .subscribe(
                async (token) => {
                    console.log('Permission granted! Save to the server!');
                    await this.angularFirestore.doc(`fcmTokens/${this.authService.currentUserInstance.uid}`).set({token});

                },
                (error) => {
                    console.error(error);
                },
            );
    }

    receiveMessage() {
        this.messaging.onMessage(payload => {
            console.log('Message received! ', payload);
            this.currentMessage.next(payload);
        });
    }

    deleteToken() {
        this.angularFireMessaging.getToken
            .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
            .subscribe(
                (token) => {
                    console.log('Deleted!');
                },
            );
    }
}
