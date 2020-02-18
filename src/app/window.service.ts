import {Injectable} from '@angular/core';
import * as firebase from 'firebase/app';

declare global {
    interface Window {
        recaptchaVerifier: any;
        confirmationResult: firebase.auth.ConfirmationResult;
    }
}

@Injectable({
    providedIn: 'root'
})
export class WindowService {

    constructor() {
    }

    get windowRef() {
        return window;
    }
}
