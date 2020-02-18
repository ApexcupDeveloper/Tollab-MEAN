import {Component, NgZone, OnInit} from '@angular/core';

import {BehaviorSubject, Observable, of} from 'rxjs';

import {AuthService} from '../auth/auth.service';
// noinspection ES6UnusedImports
import {} from 'googlemaps';
import {AlertController, ModalController, Platform, ToastController} from '@ionic/angular';
import {ProfileDataService, StudentData} from './profile-data.service';
import {first, scan, switchMap, tap} from 'rxjs/operators';
import {EducationModalComponent} from './modals/education-modal/education-modal.component';
import {WorkExperienceModalComponent} from './modals/work-experience-modal/work-experience-modal.component';
import {SkillsModalComponent} from './modals/skills-modal/skills-modal.component';
import {GigsAndFreelanceModalComponent} from './modals/gigs-and-freelance-modal/gigs-and-freelance-modal.component';
import {VolunteerModalComponent} from './modals/volunteer-modal/volunteer-modal.component';
import {LeadershipModalComponent} from './modals/leadership-modal/leadership-modal.component';
import {AwardsAndAchievementsModalComponent} from './modals/awards-and-achievements-modal/awards-and-achievements-modal.component';
import {HobbiesModalComponent} from './modals/hobbies-modal/hobbies-modal.component';
import {VideosModalComponent} from './modals/videos-modal/videos-modal.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {MessagingService} from '../messaging.service';
import {FcmService} from '../fcm.service';
import {TranslateService} from '@ngx-translate/core';

const listAnimation = trigger('listAnimation', [
    state('open', style({
        opacity: 1
    })),
    state('closed', style({
        opacity: 0
    })),
    transition('open <=> closed', [animate('0.5s')])
]);

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
    animations: [listAnimation]
})
export class ProfilePage implements OnInit {

    public basicInfoEditMode = false;
    public cards = {
        skills: {
            title: 'profile.cards.skills.title',
            icon: 'profile.cards.skills.icon',
            editMode: false,
            dummyText: 'profile.cards.skills.dummyText'
        },
        education: {
            title: 'profile.cards.education.title',
            icon: 'profile.cards.education.icon',
            editMode: false
        },
        workExperience: {
            title: 'profile.cards.workExperience.title',
            icon: 'profile.cards.workExperience.icon',
            editMode: false,
            dummyText: 'profile.cards.workExperience.dummyText'
        },
        hobbies: {
            title: 'profile.cards.hobbies.title',
            icon: 'profile.cards.hobbies.icon',
            editMode: false,
            dummyText: 'profile.cards.hobbies.dummyText'
        },
        volunteer: {
            title: 'profile.cards.volunteer.title',
            icon: 'profile.cards.volunteer.icon',
            editMode: false,
            dummyText: 'profile.cards.volunteer.dummyText'
        },
        passion: {
            title: 'profile.cards.passion.title',
            icon: 'profile.cards.passion.icon',
            editMode: false,
            dummyText: 'profile.cards.passion.dummyText'
        },
        funFacts: {
            title: 'profile.cards.funFacts.title',
            icon: 'profile.cards.funFacts.icon',
            editMode: false,
            dummyText: 'profile.cards.funFacts.dummyText'
        },
        gigsAndFreelance: {
            title: 'profile.cards.gigsAndFreelance.title',
            icon: 'profile.cards.gigsAndFreelance.icon',
            editMode: false,
            dummyText: 'profile.cards.gigsAndFreelance.dummyText'
        },
        leadership: {
            title: 'profile.cards.leadership.title',
            icon: 'profile.cards.leadership.icon',
            editMode: false,
            dummyText: 'profile.cards.leadership.dummyText'
        },
        videos: {
            title: 'profile.cards.videos.title',
            icon: 'profile.cards.videos.icon',
            editMode: false,
            dummyText: 'profile.cards.videos.dummyText'
        },
        awardsAndAchievements: {
            title: 'profile.cards.awardsAndAchievements.title',
            icon: 'profile.cards.awardsAndAchievements.icon',
            editMode: false,
            dummyText: 'profile.cards.awardsAndAchievements.dummyText'
        }
    };
    public studentData: Observable<StudentData>;
    public location = '';
    public places: string[] = [];
    public placesAutoComplete = new google.maps.places.AutocompleteService();

    public completeness = {
        percentage: 20,
        hint: new Observable<string>()
    };
    public propertiesPercentage = {
        biography: 15,
        degrees: 20,
        workExperience: 15,
        funFacts: 5,
        passion: 5,
        skills: 10,
        gigsAndFreelance: 5,
        volunteer: 10,
        leadership: 5,
        awardsAndAchievements: 5,
        hobbies: 5
    };

    basicInfoForm = new FormGroup({
        biography: new FormControl(null, Validators.maxLength(200)),
        location: new FormGroup({
            current: new FormControl(null),
            home: new FormControl(null)
        })
    });
    funFactsControl = new FormControl(null, Validators.maxLength(200));
    passionControl = new FormControl(null, Validators.maxLength(200));
    displayDetails = new BehaviorSubject<{ card: string, index: number }[]>([]);
    displayedDetailsList: Observable<{ card: string, index: number }[]>;
    noImage = false;
    message;

    constructor(public authService: AuthService,
                public profileDataService: ProfileDataService,
                public zone: NgZone,
                public platform: Platform,
                public alertCtrl: AlertController,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                public translateService: TranslateService) {
    }

    ngOnInit() {
        this.studentData = this.authService.currentUser.pipe(switchMap(user => {
            if (user) {
                return this.profileDataService.getStudentData(user.uid);
            }
            return;
        }));
        this.completeness.hint = this.studentData.pipe(switchMap(studentData => {
            if (studentData) {
                this.completeness.percentage = 0;
                Object.keys(this.propertiesPercentage).forEach(key => {
                    if (studentData.hasOwnProperty(key)) {
                        if (key === 'skills' && studentData.skills.languages
                            .concat(studentData.skills.technical, studentData.skills.mySkills).length) {
                            this.completeness.percentage += this.propertiesPercentage[key];
                        } else if (studentData[key] && studentData[key].length) {
                            this.completeness.percentage += this.propertiesPercentage[key];
                        }
                    }
                });
                // TODO: Fix this shit: Season 1 Part 2
                // TODO: Migrate percentages and hints to database
                if (!studentData.hasOwnProperty('biography') || !studentData.biography || !studentData.biography.length) {
                    return this.translateService.get('profile.hint.bio', {
                        percentage: this.completeness.percentage + 15
                    });
                } else if (!studentData.hasOwnProperty('workExperience') || !studentData.workExperience
                    || !studentData.workExperience.length) {
                    return this.translateService.get('profile.hint.workHistory', {
                        percentage: this.completeness.percentage + 15
                    });
                } else if (!studentData.hasOwnProperty('skills')
                    || !studentData.skills.languages.concat(studentData.skills.technical, studentData.skills.mySkills).length) {
                    return this.translateService.get('profile.hint.skills', {
                        percentage: this.completeness.percentage + 10
                    });
                } else if (!studentData.hasOwnProperty('gigsAndFreelance') || !studentData.gigsAndFreelance
                    || !studentData.gigsAndFreelance.length) {
                    return this.translateService.get('profile.hint.gigs', {
                        percentage: this.completeness.percentage + 5
                    });
                } else if (!studentData.hasOwnProperty('leadership')
                    || !studentData.leadership || !studentData.leadership.length) {
                    return this.translateService.get('profile.hint.leadership', {
                        percentage: this.completeness.percentage + 5
                    });
                } else if (!studentData.hasOwnProperty('passion') || !studentData.passion || !studentData.passion.length) {
                    return this.translateService.get('profile.hint.passion', {
                        percentage: this.completeness.percentage + 5
                    });
                } else if (!studentData.hasOwnProperty('funFacts') || !studentData.funFacts || !studentData.funFacts.length) {
                    return this.translateService.get('profile.hint.funFact');
                } else if (!studentData.hasOwnProperty('hobbies') || !studentData.hobbies || !studentData.hobbies.length) {
                    return this.translateService.get('profile.hint.hobbies', {
                        percentage: this.completeness.percentage + 5
                    });
                } else if (this.completeness.percentage === 100) {
                    return this.translateService.get('profile.hint.ready');
                }
            }
        }));
        this.displayedDetailsList = this.displayDetails.asObservable().pipe(scan((acc, value) => {
            let exists = false;
            const filteredList = acc.filter(item => {
                const isEqual = item.card === value[0].card && item.index === value[0].index;
                exists = isEqual ? isEqual : exists;
                return !isEqual;
            });
            if (exists) {
                return filteredList;
            }
            return acc.concat(value);
        }));
    }

    // TODO: Check google places!
    // TODO: Check if there is a better method and if ngZone is needed.
    onSearchPlace() {
        if (!this.location.length) {
            this.places = [];
            return;
        }
        this.placesAutoComplete.getPlacePredictions({input: this.location}, (predictions, status) => {
            this.places = [];
            this.zone.run(() => {
                // this.places.push(...predictions);
                console.log(predictions);
            });
        });
    }
    // TODO Fix this shit
    formatSubtitle(percent: number): Observable<string> {
        if (percent >= 100) {
            return this.translateService.get('profile.hint.congrats');
        } else {
            return of(percent + '%');
        }
    }

    /**
     * Creates and presents a modal to add or edit the student's info depending on the chosen modal.
     */
    async onDisplayModal(modalComponent: 'education'
        | 'workExperience'
        | 'skills'
        | 'gigsAndFreelance'
        | 'volunteer'
        | 'leadership'
        | 'awardsAndAchievements'
        | 'hobbies'
        | 'videos'
        | 'image',
                         index: number = -1,
                         data?: any,
                         size: number = -1) {
        const modalsList = {
            education: EducationModalComponent,
            workExperience: WorkExperienceModalComponent,
            skills: SkillsModalComponent,
            gigsAndFreelance: GigsAndFreelanceModalComponent,
            volunteer: VolunteerModalComponent,
            leadership: LeadershipModalComponent,
            awardsAndAchievements: AwardsAndAchievementsModalComponent,
            hobbies: HobbiesModalComponent,
            videos: VideosModalComponent,
            image: FileUploadComponent
        };

        const modalOptions = index === -1 ? {
            component: modalsList[modalComponent],
            cssClass: 'modal-auto-height-auto-width'
        } : {
            component: modalsList[modalComponent],
            cssClass: 'modal-auto-height-auto-width',
            componentProps: {
                editMode: true,
                index,
                data,
                size
            }
        };

        const modal = await this.modalCtrl.create(modalOptions);
        await modal.present();
    }

    onDisplayDetails(card: 'education'
        | 'workExperience'
        | 'gigsAndFreelance'
        | 'volunteer'
        | 'leadership'
        | 'awardsAndAchievements'
        | 'videos',
                     index: number) {
        this.displayDetails.next([{card, index}]);
    }

    async onSaveBasicInfo() {
        this.studentData.pipe(first()).subscribe(async studentData => {
            const previousBiography = studentData.hasOwnProperty('biography') ? studentData.biography : null;
            if (this.basicInfoForm.value.biography !== previousBiography) {
                let message;
                try {
                    await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, {
                        biography: this.basicInfoForm.value.biography
                    });
                    message = 'Your biography was edited successfully!';
                } catch (e) {
                    console.log(e);
                    message = 'An error occurred while editing your biography! Please try again later!';
                }
                const toast = await this.toastCtrl.create({
                    message,
                    duration: 3000
                });
                await toast.present();
            }
            this.basicInfoEditMode = false;
        });
    }

    async onSave(property: 'funFacts' | 'passion', studentData: StudentData) {
        const previousValue = studentData.hasOwnProperty(property) ? studentData[property] : null;

        let value: string;
        let updatedData: Partial<StudentData>;
        if (property === 'funFacts') {
            value = this.funFactsControl.value;
            updatedData = {
                funFacts: value
            };
        } else {
            value = this.passionControl.value;
            updatedData = {
                passion: value
            };
        }

        if (value !== previousValue) {
            let message;
            try {
                await this.profileDataService.updateStudentData(this.authService.currentUserInstance.uid, updatedData);
                message = 'Your profile was edited successfully!';
            } catch (e) {
                console.log(e);
                message = `An error occurred while editing your data! Please try again later!`;
            }
            const toast = await this.toastCtrl.create({
                message,
                duration: 3000
            });
            await toast.present();
        }
        this.cards[property].editMode = false;
    }
}
