import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-volunteer-modal',
    templateUrl: './volunteer-modal.component.html',
    styleUrls: ['./volunteer-modal.component.scss'],
})
export class VolunteerModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        organization: string;
        startDate: Date;
        endDate: Date;
        details?: string;
    };

    public form = new FormGroup({
        organization: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        startDate: new FormControl(null),
        endDate: new FormControl(null),
        details: new FormControl(null)
    });

    constructor(public modalCtrl: ModalController,
                public profileDataService: ProfileDataService,
                public authService: AuthService,
                public toastCtrl: ToastController) {
    }

    ngOnInit() {
        if (this.editMode) {
            this.form.setValue(this.data);
        }
    }

    async onCancel() {
        await this.modalCtrl.dismiss();
    }

    async onSave() {
        await this.modalCtrl.dismiss();
        let message: string;
        try {
            const previousVolunteer = await this.getPreviousVolunteerWork();
            const value = this.form.value;

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    volunteer: previousVolunteer
                };
                updatedData.volunteer[this.index] = value;
            } else {
                updatedData = {
                    volunteer: [
                        ...previousVolunteer,
                        value
                    ]
                };
            }

            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Volunteer work was ${this.editMode ? 'edited' : 'added'} successfully!`;
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
            const previousVolunteerWork = await this.getPreviousVolunteerWork();
            previousVolunteerWork.splice(this.index, 1);
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                volunteer: previousVolunteerWork
            });
            message = 'Volunteer work was deleted successfully!';
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

    public async getPreviousVolunteerWork(): Promise<{
        organization: string;
        startDate: Date;
        endDate: Date;
        details?: string;
    }[]> {
        return await this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.volunteer ? studentData.volunteer : [];
            })).toPromise();
    }
}
