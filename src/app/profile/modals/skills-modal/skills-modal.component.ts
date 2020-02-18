import {Component, Input, OnInit} from '@angular/core';
import {ProfileDataService} from '../../profile-data.service';
import {ModalController, ToastController} from '@ionic/angular';
import {AuthService} from '../../../auth/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-skills-modal',
    templateUrl: './skills-modal.component.html',
    styleUrls: ['./skills-modal.component.scss'],
})
export class SkillsModalComponent implements OnInit {

    @Input() editMode: boolean;
    @Input() data: {
        languages: string[],
        technical: string[],
        mySkills: string[]
    } = {
        languages: [],
        technical: [],
        mySkills: []
    };

    public form = new FormGroup({
        languages: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        technical: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        mySkills: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
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
                skills: this.data
            });
            message = `Skill(s) was ${this.editMode ? 'edited' : 'added'} successfully!`;
        } catch (e) {
            message = `There was an error in ${this.editMode ? 'editing' : 'adding'} your skills, please try again later!`;
            console.log(e);
        }
        const toast = await this.toastCtrl.create({
            message,
            duration: 3000
        });
        await toast.present();
    }

    onAddSkill(skillType: 'languages' | 'technical' | 'mySkills') {
        const skill = this.form.value[skillType];
        if (this.form.controls[skillType].valid) {
            if (this.data.hasOwnProperty(skillType)) {
                if (!this.data[skillType].includes(skill)) {
                    this.data[skillType].push(skill);
                }
            } else {
                this.data[skillType] = [skill];
            }
            this.form.reset();
        }
    }

    onRemoveSkill(skillType: 'languages' | 'technical' | 'mySkills', index: number) {
        this.data[skillType].splice(index, 1);
    }
}
