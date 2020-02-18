import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {ModalController, ToastController} from '@ionic/angular';

import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

import {environment} from '../../../../environments/environment';

import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-videos-modal',
    templateUrl: './videos-modal.component.html',
    styleUrls: ['./videos-modal.component.scss'],
})
export class VideosModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        videoId: string;
        title: string;
        thumbnailURL: string;
        description?: string;
    };

    public form = new FormGroup({
        url: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        description: new FormControl(null)
    });

    constructor(public modalCtrl: ModalController,
                public profileDataService: ProfileDataService,
                public authService: AuthService,
                public toastCtrl: ToastController,
                public httpClient: HttpClient) {
    }

    ngOnInit() {
        if (this.editMode) {
            this.form.setValue({
                url: 'https://www.youtube.com/watch?v=' + this.data.videoId,
                description: this.data.description
            });
        }
    }

    async onCancel() {
        await this.modalCtrl.dismiss();
    }

    async onSave() {
        await this.modalCtrl.dismiss();
        let message: string;
        const videoId = this.getYoutubeVideoId(this.form.value.url);
        try {
            const previousVideos = await this.getPreviousVideos();

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    videos: [...previousVideos]
                };
                updatedData.videos[this.index] = {
                    videoId,
                    title: (await this.getYoutubeVideoTitle(videoId).toPromise()).items[0].snippet.title,
                    thumbnailURL: await this.getYoutubeVideoThumbnailURL(videoId),
                    description: this.form.value.description
                };
            } else {
                updatedData = {
                    videos: [
                        ...previousVideos,
                        {
                            videoId,
                            title: (await this.getYoutubeVideoTitle(videoId).toPromise()).items[0].snippet.title,
                            thumbnailURL: await this.getYoutubeVideoThumbnailURL(videoId),
                            description: this.form.value.description
                        }
                    ]
                };
            }

            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Video was ${this.editMode ? 'edited' : 'added'} successfully!`;
        } catch (e) {
            message = `An error has occurred while ${this.editMode ? 'editing' : 'adding'} your data, please try again later!`;
            console.log(e);
        }
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000
        });
        await toast.present();
    }

    async onDelete() {
        await this.modalCtrl.dismiss();
        let message: string;
        try {
            const previousVideos = await this.getPreviousVideos();
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                videos: previousVideos.splice(this.index, 1)
            });
            message = 'Video was deleted successfully!';
        } catch (e) {
            message = 'An error has occurred while deleting your data, please try again later!';
            console.log(e);
        }
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000
        });
        await toast.present();
    }

    public async getPreviousVideos(): Promise<{
        videoId: string;
        title: string;
        thumbnailURL: string;
        description?: string;
    }[]> {
        return this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.videos ? studentData.videos : [];
            }))
            .toPromise();
    }

    public getYoutubeVideoId(url: string) {
        if (!url.includes('watch?v=')) {
            return url.split('/')[0].split('&')[0];
        }
        return url.split('watch?v=')[1].split('/')[0].split('&')[0];
    }

    public getYoutubeVideoThumbnailURL(id: string) {
        return 'https://img.youtube.com/vi/' + id + '/default.jpg';
    }

    public getYoutubeVideoTitle(id: string): Observable<{ items: { snippet: { title: string } }[] }> {
        return this.httpClient
            .get<{ items: { snippet: { title: string } }[] }>('https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key='
                + environment.firebaseConfig.apiKey + '&fields=items(snippet(title))&part=snippet').pipe(take(1));
    }
}
