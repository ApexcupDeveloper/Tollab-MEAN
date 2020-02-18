import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';

@Component({
    selector: 'app-coming-soon',
    templateUrl: './coming-soon.page.html',
    styleUrls: ['./coming-soon.page.scss'],
})
export class ComingSoonPage implements OnInit {

    form = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email])
    });
    invalidSubmit = false;

    constructor(public angularFirestore: AngularFirestore, public toastCtrl: ToastController) {
    }

    ngOnInit() {
    }

    async onSubscribe() {
        if (this.form.valid) {
            let message: string;
            try {
                await this.angularFirestore.collection('emailSubscriptions').add(this.form.value);
                message = 'Subscription complete! We will keep you up with our latest updates!';
            } catch (e) {
                message = 'A problem has occurred while subscribing your email! Please try again later!';
            }
            const toast = await this.toastCtrl.create({message});
            await toast.present();
            this.invalidSubmit = false;
            return;
        }
        this.invalidSubmit = true;
    }
}
