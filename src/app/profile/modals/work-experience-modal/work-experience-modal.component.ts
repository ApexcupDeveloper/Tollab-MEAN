import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, take} from 'rxjs/operators';

@Component({
    selector: 'app-work-experience-modal',
    templateUrl: './work-experience-modal.component.html',
    styleUrls: ['./work-experience-modal.component.scss'],
})
export class WorkExperienceModalComponent implements OnInit, AfterViewInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        company: string;
        position: string;
        startDate: string;
        current: boolean;
        endDate?: string;
        website?: string;
        details?: string;
    };

    public form = new FormGroup({
        company: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        position: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        startDate: new FormControl(null, Validators.required),
        current: new FormControl(null),
        endDate: new FormControl(null),
        website: new FormControl(null),
        details: new FormControl(null)
    });

    constructor(public modalCtrl: ModalController,
                public profileDataService: ProfileDataService,
                public authService: AuthService,
                public toastCtrl: ToastController) {
    }

    ngOnInit() {
    }

    ngAfterViewInit(): void {
    }

    async onCancel() {
        await this.modalCtrl.dismiss();
    }

    async onSave() {
        await this.modalCtrl.dismiss();
        let message: string;
        try {
            const previousJobs = await this.getPreviousJobs();

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    workExperience: [...previousJobs]
                };
                updatedData.workExperience[this.index] = this.form.value;
            } else {
                updatedData = {
                    workExperience: [...previousJobs, this.form.value]
                };
            }

            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Job was ${this.editMode ? 'edited' : 'added'} successfully!`;
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
            const previousJobs = await this.getPreviousJobs();
            previousJobs.splice(this.index, 1);
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                workExperience: previousJobs
            });
            message = 'Job was deleted successfully!';
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

    public async getPreviousJobs() {
        return this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.workExperience ? studentData.workExperience : [];
            }))
            .toPromise();
    }
}
