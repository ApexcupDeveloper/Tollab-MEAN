import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase/app';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import 'firebase/auth';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  myID = '';
  youID = '';
  message = '';
  creatTime: any;

  username = '';

  userID = '';
  userData: any;

  usersID: any;
  usersName: any;
  userNameList: any;
  flagUser = false;

  ListStudent: any = '';
  messageData: any;
  state = false;

  chatSubscription;
  messages: any[] = [];

  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public router: Router,
    public modalCtrl: ModalController,
    public afs: AngularFirestore,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {

  }



  container: HTMLElement;
  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.youID = queryParams.userName;
      this.myID = queryParams.myID;
    });

    this.getUserList();
    this.getMessage();

  }
  async getMessage() {
    if (this.youID === '') {
    } else {
      this.chatSubscription = this.db.list(`/chat/${this.myID}/${this.youID}`).valueChanges().subscribe(data => {
        this.messages = data;
      });
    }
  }
  async getUserList() {
    this.flagUser = false;

    this.usersID = [];
    this.messageData = [];
    this.usersName = [];
    this.userNameList = [];

    const snapshot = await firebase.firestore().collection('users').get();
    this.usersName = snapshot.docs.map(doc => {
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });

    this.usersID = await this.db.list(`chat/${this.myID}/`);
    this.usersID.snapshotChanges().subscribe(actions => {
      actions.forEach(action => {
        const key = action.key;
        const data = action.payload.val();
        if (key === this.youID) {
          this.flagUser = true;
        }
        this.messageData.push({ key, ...data });

        if (this.youID === '') {
          this.usersName.map(item => {
            if (item.id === key) {
              if (item.id !== this.youID) {
                this.userNameList.push(item);
              }
            }
          });
        }

      });
    });
    if (!this.flagUser) {
      this.usersName.map(item => {
        if (item.id === this.youID) {
          this.userNameList.push(item);
          this.flagUser = true;
        }
      });
    }
  }

  selectUser(index: number) {
    const selectedItem = this.userNameList[index];
    this.youID = selectedItem.id;

    this.userNameList.map(item => {
      item.state = false;
    });
    this.userNameList[index].state = !(this.userNameList[index].state);
    this.chatSubscription = this.db.list(`/chat/${this.myID}/${this.youID}`).valueChanges().subscribe(data => {
      this.messages = data;
    });

  }

  getDatetime() {
    const current = new Date();
    const timestamp = current.getTime();
    return timestamp;
  }

  sendMessage() {

    var value = this.message.length;
    if(value == 0){

    } else {
      if(this.youID==''){
        alert('Please select the user.');
        this.message = '';
      } else {
        this.creatTime = this.getDatetime();
        this.db.list(`/chat/${this.youID}/${this.myID}`).push({
          flag: 'to',
          creatTime: this.creatTime,
          message: this.message
        }).then(() => {
        }).catch(() => {
        });
        this.db.list(`/chat/${this.myID}/${this.youID}`).push({
          flag: 'from',
          creatTime: this.creatTime,
          message: this.message
        }).then(() => {
        }).catch(() => {
        });
        this.message = '';
      }
    }
  }

}
