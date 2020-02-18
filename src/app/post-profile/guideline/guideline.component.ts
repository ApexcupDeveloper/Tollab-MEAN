import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AuthService } from '../../auth/auth.service'

@Component({
  selector: 'app-guideline',
  templateUrl: './guideline.component.html',
  styleUrls: ['./guideline.component.scss'],
})
export class GuidelineComponent implements OnInit {

  constructor(public auth: AngularFireAuth, public modalCtrl: ModalController, public navCtrl: NavController, private emailComposer: EmailComposer) { }

  ngOnInit() { }

  goConfirm() {
    this.modalCtrl.dismiss();
    // this.emailComposer.isAvailable().then((available: boolean) =>{
    //   if(available) {
    //     //Now we know we can send
    //     console.log('sent :')
    //   }
    //  });

    this.auth.auth.currentUser.sendEmailVerification();
         
    // var text = "Here";
    // let email = {
    //   to: 'apexcup@outlook.com',
    //   cc: 'apexcup199096@gmail.com',
    //   bcc: ['apexcup199096@gmail.com'],
    //   //  attachments: [
    //   //    'file://img/logo.png',
    //   //    'res://icon.png',
    //   //    'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
    //   //    'file://README.pdf'
    //   //  ],
    //   subject: 'Welcome to Tollab',
    //   body: 'Hi, Apex. Welcome to join to Our Site. Please click' + text.link("http://localhost:8000/company-add") + ' to verify your email',
    //   isHtml: true
    // }

    // // Send a text message using default options
    // this.emailComposer.open(email);
  }
}