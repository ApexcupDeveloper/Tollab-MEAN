import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';
import {map, take} from 'rxjs/operators';

@Component({
    selector: 'app-leadership-modal',
    templateUrl: './leadership-modal.component.html',
    styleUrls: ['./leadership-modal.component.scss'],
})
export class LeadershipModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        organization: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        details?: string;
    };

    public form = new FormGroup({
        organization: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        title: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
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
            const previousLeadership = await this.getPreviousLeadershipWork();
            const value = this.form.value;

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    leadership: previousLeadership
                };
                updatedData.leadership[this.index] = value;
            } else {
                updatedData = {
                    leadership: [
                        ...previousLeadership,
                        value
                    ]
                };
            }

            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Leadership was ${this.editMode ? 'edited' : 'added'} successfully!`;
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
            const previousLeadershipWork = await this.getPreviousLeadershipWork();
            previousLeadershipWork.splice(this.index, 1);
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                leadership: previousLeadershipWork
            });
            message = 'Leadership work was deleted successfully!';
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

    public async getPreviousLeadershipWork(): Promise<{
        organization: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        details?: string;
    }[]> {
        return await this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.leadership ? studentData.leadership : [];
            })).toPromise();
    }
}
