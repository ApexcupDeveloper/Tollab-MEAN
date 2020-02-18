import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-gigs-and-freelance-modal',
    templateUrl: './gigs-and-freelance-modal.component.html',
    styleUrls: ['./gigs-and-freelance-modal.component.scss'],
})
export class GigsAndFreelanceModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() index: number;
    @Input() data: {
        company: string;
        title: string;
        startDate?: Date;
        endDate?: Date;
        details?: string;
    };

    public form = new FormGroup({
        company: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
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
            const previousGigs = await this.getPreviousGisAndFreelance();

            let updatedData;
            if (this.editMode) {
                updatedData = {
                    gigsAndFreelance: [...previousGigs]
                };
                updatedData.gigsAndFreelance[this.index] = this.form.value;
            } else {
                updatedData = {
                    gigsAndFreelance: [
                        ...previousGigs,
                        this.form.value
                    ]
                };
            }

            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
            message = `Gig/Freelance was ${this.editMode ? 'edited' : 'added'} successfully!`;
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
            const previousGigs = await this.getPreviousGisAndFreelance();
            previousGigs.splice(this.index, 1);
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                gigsAndFreelance: previousGigs
            });
            message = 'Gig/Freelance was deleted successfully!';
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

    public async getPreviousGisAndFreelance() {
        return this.profileDataService
            .getStudentData(this.authService.currentUserInstance.uid)
            .pipe(take(1), map(studentData => {
                return studentData.gigsAndFreelance ? studentData.gigsAndFreelance : [];
            }))
            .toPromise();
    }
}
