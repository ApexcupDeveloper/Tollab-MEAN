import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';
import {map, take} from 'rxjs/operators';

@Component({
    selector: 'app-education-modal',
    templateUrl: './education-modal.component.html',
    styleUrls: ['./education-modal.component.scss'],
})
export class EducationModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        school: string;
        majors: string[];
        enrollDate: Date;
        current: boolean;
        graduationDate: Date;
    };
    @Input() size: number;

    public form = new FormGroup({
        school: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        majors: new FormArray([
            new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
        ]),
        enrollDate: new FormControl(null, Validators.required),
        current: new FormControl(null),
        graduationDate: new FormControl(null, Validators.required)
    });

    constructor(public modalCtrl: ModalController,
                public profileDataService: ProfileDataService,
                public authService: AuthService,
                public toastCtrl: ToastController) {
    }

    ngOnInit() {
        if (this.editMode) {
            if (this.data.majors.length > 1) {
                this.onAddMajor();
            }
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
            const previousDegrees = await this.getPreviousDegrees();
            const value = this.form.value;

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    degrees: [...previousDegrees]
                };
                updatedData.degrees[this.index] = value;
            } else {
                updatedData = {
                    degrees: [
                        ...previousDegrees,
                        value
                    ]
                };
            }

            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Education information was ${this.editMode ? 'edited' : 'added'} successfully!`;
        } catch (e) {
            message = `An error occurred while ${this.editMode ? 'editing' : 'adding'} your education information, please try again later!`;
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
            const previousDegrees = await this.getPreviousDegrees();
            previousDegrees.splice(this.index, 1);
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                degrees: previousDegrees
            });
            message = 'Degree was deleted successfully!';
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

    public async getPreviousDegrees(): Promise<{
        school: string;
        majors: string[];
        enrollDate: Date;
        current: boolean;
        graduationDate: Date;
    }[]> {
        return this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.degrees ? studentData.degrees : [];
            }))
            .toPromise();
    }

    onAddMajor() {
        (this.form.get('majors') as FormArray)
            .push(new FormControl(null, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50)
            ]));
    }

    onRemoveMajor() {
        (this.form.get('majors') as FormArray).removeAt(1);
    }

    getMajorsFormArray(): FormArray {
        return this.form.get('majors') as FormArray;
    }
}
