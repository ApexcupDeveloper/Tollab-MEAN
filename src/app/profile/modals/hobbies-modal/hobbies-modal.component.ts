import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {ProfileDataService} from '../../profile-data.service';
import {AuthService} from '../../../auth/auth.service';

@Component({
    selector: 'app-hobbies-modal',
    templateUrl: './hobbies-modal.component.html',
    styleUrls: ['./hobbies-modal.component.scss'],
})
export class HobbiesModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() data: string[] = [];

    public form = new FormGroup({
        hobby: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    });

    constructor(public modalCtrl: ModalController,
                public profileDataService: ProfileDataService,
                public authService: AuthService,
                public toastCtrl: ToastController) {
    }

    ngOnInit() {
    }

    async onCancel() {
        await this.modalCtrl.dismiss();
    }

    async onSave() {
        await this.modalCtrl.dismiss();
        let message: string;
        try {
            await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                hobbies: this.data
            });
            message = `Hobbies were ${this.editMode ? 'edited' : 'added'} successfully!`;
        } catch (e) {
            message = 'An error has occurred while adding your data, please try again later!';
            console.log(e);
        }
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000
        });
        await toast.present();
    }

    onAddHobby() {
        const hobby = this.form.value.hobby;
        if (this.form.controls.hobby.valid) {
            if (!this.data.includes(hobby)) {
                this.data.push(hobby);
            }
            this.form.reset();
        }
    }

    onRemoveHobby(index: number) {
        this.data.splice(index, 1);
    }
}
