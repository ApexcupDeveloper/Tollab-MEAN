import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {CreateJobComponent} from './create-job/create-job.component';
import {Job, JobsService} from './jobs.service';
import {IonInfiniteScroll, ModalController} from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
    @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

    slideOpts = {
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        autoplay: {
            disableOnInteraction: false
        }
    };

    public role: 'student' | 'employer';
    public userSubscription: Subscription;

    constructor(public authService: AuthService, public jobsService: JobsService, public modalCtrl: ModalController) {
    }

    ngOnInit() {
        this.jobsService.init(this.infiniteScroll);
        this.userSubscription = this.authService.currentUser.subscribe(async user => {
            if (user) {
                this.role = (await this.authService.retrieveUserData(user.uid)).role;
            } else {
                this.role = 'student';
            }
        });
    }

    loadData($event) {
        this.jobsService.more($event);
    }

    async onCreateNewJob() {
        const modal = await this.modalCtrl.create({
            component: CreateJobComponent,
            cssClass: 'create-job-modal'
        });
        this.jobsService.modal = modal;
        await modal.present();
        await modal.onDidDismiss();
        this.jobsService.init(this.infiniteScroll);
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }

    onGoToJob(job: Job) {

    }
}
