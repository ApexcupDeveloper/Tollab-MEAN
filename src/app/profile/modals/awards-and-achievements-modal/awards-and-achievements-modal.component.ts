import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';
import {map, take} from 'rxjs/operators';

@Component({
    selector: 'app-awards-and-achievements-modal',
    templateUrl: './awards-and-achievements-modal.component.html',
    styleUrls: ['./awards-and-achievements-modal.component.scss'],
})
export class AwardsAndAchievementsModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        title: string;
        date: Date;
        details?: string;
    };

    public form = new FormGroup({
        title: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        date: new FormControl(null, Validators.required),
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
            const previousAwards = await this.getPreviousAwards();
            const value = this.form.value;

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    awardsAndAchievements: previousAwards
                };
                updatedData.awardsAndAchievements[this.index] = value;
            } else {
                updatedData = {
                    awardsAndAchievements: [
                        ...previousAwards,
                        value
                    ]
                };
            }
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Award/Achievement was ${this.editMode ? 'edited' : 'added'} successfully!`;
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
            const previousAwards = await this.getPreviousAwards();
            previousAwards.splice(this.index, 1);
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                awardsAndAchievements: previousAwards
            });
            message = 'Award/Achievement was deleted successfully!';
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

    public async getPreviousAwards(): Promise<{
        title: string;
        date: Date;
        details?: string;
    }[]> {
        return await this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.awardsAndAchievements ? studentData.awardsAndAchievements : [];
            })).toPromise();
    }
}
