import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {finalize, take, tap} from 'rxjs/operators';
import {LoadingController, ModalController} from '@ionic/angular';
import {UploadTaskSnapshot} from '@angular/fire/storage/interfaces';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit, OnDestroy {
    task: AngularFireUploadTask;

    percentage: Observable<number>;
    snapshot: Observable<any>;
    downloadURLSubscription: Subscription;
    isHovering: boolean;
    fileList: FileList;
    loading;
    finalState: string;
    logoURL: string;

    constructor(public authService: AuthService,
                public angularFireStorage: AngularFireStorage,
                public modalCtrl: ModalController,
                public loadingCtrl: LoadingController) {
    }

    ngOnInit() {
    }

    onToggleHover(event: boolean) {
        this.isHovering = event;
    }

    onDropFile($event: FileList) {
        if (!this.snapshot) {
            this.fileList = $event;
        }
    }

    async onStartUpload() {
        (await this.modalCtrl.getTop()).backdropDismiss = false;
        (await this.modalCtrl.getTop()).keyboardClose = false;
        const file = this.fileList.item(0);

        if (file.type.split('/')[0] !== 'image') {
            console.log('Unsupported file type!');
            return;
        }

        const path = `${this.authService.currentUserInstance.uid}/user-image/${file.name}`;
        const fileRef = this.angularFireStorage.ref(path);
        this.task = fileRef.put(file, {customMetadata: {app: 'Uploaded by TollabCo PWA.'}});
        this.percentage = this.task.percentageChanges().pipe(tap(async percentage => {
            if (percentage === 100) {
                this.loading = await this.loadingCtrl.create();
                await this.loading.present();
            }
        }));
        this.snapshot = this.task.snapshotChanges().pipe(finalize(() => {
            this.downloadURLSubscription = fileRef.getDownloadURL().pipe(take(1)).subscribe(downloadURL => {
                if (this.loading) {
                    
                    // this.authService.currentUserInstance.updateProfile({photoURL: downloadURL});
                    this.logoURL = downloadURL;
                    this.authService.updateEmployer(this.authService.currentUserInstance.uid, this.logoURL);
                    // this.authService.currentUserInstance.updateProfile({bannerURL: downloadURL});
                    this.loading.dismiss();
                }
                this.modalCtrl.dismiss();
            });
        }));
    }

    isActive(snapshot: UploadTaskSnapshot) {
        return !!snapshot && snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
    }

    async onCancelUpload() {
        this.task.cancel();
        (await this.modalCtrl.getTop()).backdropDismiss = true;
        (await this.modalCtrl.getTop()).keyboardClose = true;
    }

    ngOnDestroy(): void {
        if (this.downloadURLSubscription) {
            this.downloadURLSubscription.unsubscribe();
        }
    }
}
