import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertController, ToastController} from '@ionic/angular';

import {TranslateService} from '@ngx-translate/core';

import {IonicSelectableComponent} from 'ionic-selectable';

import {AuthService} from '../../auth/auth.service';
import {Job, JobsService} from '../jobs.service';

@Component({
    selector: 'app-create-job',
    templateUrl: './create-job.component.html',
    styleUrls: ['./create-job.component.scss'],
})
export class CreateJobComponent implements OnInit {

    @ViewChild(IonicSelectableComponent, {static: false}) selectableComponent: IonicSelectableComponent;

    jobCreation = new FormGroup({
        title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        description: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        applicationsDueDate: new FormControl(null, [Validators.required]),
        applicationsDueTime: new FormControl(null, [Validators.required]),
        payment: new FormControl(null, [Validators.required, Validators.min(1)]),
        requiredSkills: new FormControl(null, [Validators.required])
    });
    formLabelsRef = 'tabs.home.publishNewJob.form.';
    skills: string[] = [
        'Front-End Development',
        'Back-End Development',
        'Full Stack Development',
        'Content Creation',
        'English Speaking'
    ];

    constructor(public authService: AuthService,
                public jobsService: JobsService,
                public alertCtrl: AlertController,
                public translateService: TranslateService,
                public toastCtrl: ToastController) {
    }

    ngOnInit() {
    }

    /**
     * Stores a new job to the firestore cloud.
     */
    async onCreateJob() {
        const date = new Date(this.jobCreation.controls.applicationsDueDate.value);
        const time = new Date(this.jobCreation.controls.applicationsDueTime.value);
        time.setDate(date.getDate());
        time.setMonth(date.getMonth());
        time.setFullYear(date.getFullYear());

        const job: Job = {
            applicationUntil: time,
            createdAt: new Date(),
            createdBy: this.authService.currentUserInstance.uid,
            description: this.jobCreation.controls.description.value,
            filled: false,
            payment: +this.jobCreation.controls.payment.value,
            requiredSkills: this.jobCreation.controls.requiredSkills.value,
            title: this.jobCreation.controls.title.value
        };
        console.log(job);
        // TODO: Show a prompt to confirm publishing the job!
        // TODO: Change the configure the validators.
        // TODO: Change payment input label to NIS per hours.
        // TODO: Retrieve the skills from firestore cloud.
        // TODO: Remove the no-border inspection disable tag.
        const header = await this.translateService.get('Add job?').toPromise();
        const message = `${await this.translateService.get(this.formLabelsRef + 'title').toPromise()}: ${job.title}<br>
        ${await this.translateService.get(this.formLabelsRef + 'description').toPromise()}: ${job.description}<br>
        ${await this.translateService.get(this.formLabelsRef + 'applicationUntil.date').toPromise()}: ${job.applicationUntil}<br>
        ${await this.translateService.get(this.formLabelsRef + 'payment').toPromise()}: ${job.payment}<br>
        ${await this.translateService.get(this.formLabelsRef + 'skills').toPromise()}: ${job.requiredSkills}`;
        const cancelBtnText = await this.translateService.get('alert.cancel').toPromise();
        const okBtnText = await this.translateService.get('alert.ok').toPromise();
        const alert = await this.alertCtrl.create({
            header,
            message,
            buttons: [
                {
                    text: cancelBtnText,
                    role: 'cancel'
                },
                {
                    text: okBtnText,
                    role: 'ok'
                }
            ]
        });
        await alert.present();
        const data = await alert.onDidDismiss();
        if (data.role === 'ok') {
            try {
                const toastMsg = await this.translateService.get('tabs.home.publishNewJob.success').toPromise();
                await this.jobsService.createJob(job);
                await (await this.toastCtrl.create({
                    message: toastMsg,
                    duration: 3000
                })).present();
                await this.jobsService.modal.dismiss();
            } catch (e) {
                const errorHeader = await this.translateService.get('alert.connectionError.header').toPromise();
                const errorMessage = await this.translateService.get('alert.connectionError.message').toPromise();
                const errorButton = await this.translateService.get('alert.okay').toPromise();
                const errorAlert = await this.alertCtrl.create({
                    header: errorHeader,
                    message: errorMessage,
                    buttons: [errorButton],
                });
                await errorAlert.present();
                console.log(e);
            }
        }
    }

    /**
     * Displays a form to add a new skill if it is not already found in the firestore cloud.
     * @param $event the event object from the DOM.
     */
    onShowAddSkillForm($event: { component: IonicSelectableComponent }) {
        $event.component.showAddItemTemplate();
    }

    /**
     * Pushes a new skill to the skills array and returns to the skills selection.
     */
    onAddSkill() {
        this.skills.push(this.selectableComponent.searchText);
        this.selectableComponent._select(this.selectableComponent.searchText);
        this.selectableComponent.hideAddItemTemplate();
    }
}
