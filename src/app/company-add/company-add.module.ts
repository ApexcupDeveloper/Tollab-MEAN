


import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TranslateModule} from '@ngx-translate/core';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {EducationModalComponent} from '../profile/modals/education-modal/education-modal.component';
import {WorkExperienceModalComponent} from '../profile/modals/work-experience-modal/work-experience-modal.component';
import {SkillsModalComponent} from '../profile/modals/skills-modal/skills-modal.component';
import {AwardsAndAchievementsModalComponent} from '../profile/modals/awards-and-achievements-modal/awards-and-achievements-modal.component';
import {GigsAndFreelanceModalComponent} from '../profile/modals/gigs-and-freelance-modal/gigs-and-freelance-modal.component';
import {HobbiesModalComponent} from '../profile/modals/hobbies-modal/hobbies-modal.component';
import {LeadershipModalComponent} from '../profile/modals/leadership-modal/leadership-modal.component';
import {VolunteerModalComponent} from '../profile/modals/volunteer-modal/volunteer-modal.component';
import {VideosModalComponent} from '../profile/modals/videos-modal/videos-modal.component';
import {CardDetailsComponent} from '../profile/card-details/card-details.component';
import { DropZoneDirective } from '../profile/file-upload/drop-zone.directive';
import {FileUploadComponent} from '../profile/file-upload/file-upload.component';
import {ComingSoonPageModule} from '../coming-soon/coming-soon.module';
import {SharedModule} from '../shared/shared.module';
import { CompanyAddPage } from './company-add.page';

const routes: Routes = [
    {
        path: '',
        component: CompanyAddPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule,
        ReactiveFormsModule,
        NgCircleProgressModule.forRoot({
            radius: 60,
            space: -10,
            toFixed: 0,
            maxPercent: 100,
            outerStrokeGradient: true,
            outerStrokeWidth: 10,
            outerStrokeColor: '#de7b04',
            outerStrokeGradientStopColor: '#fc981e',
            innerStrokeColor: '#e7e8ea',
            innerStrokeWidth: 10,
            title: '',
            subtitleColor: '#000000',
            subtitleFontSize: '20',
            animateTitle: false,
            animationDuration: 1000,
            showTitle: false,
            showUnits: false,
            showBackground: false,
            showZeroOuterStroke: false
        }),
        SharedModule
    ],
    declarations: [
      CompanyAddPage,
        EducationModalComponent,
        WorkExperienceModalComponent,
        SkillsModalComponent,
        AwardsAndAchievementsModalComponent,
        GigsAndFreelanceModalComponent,
        HobbiesModalComponent,
        LeadershipModalComponent,
        VolunteerModalComponent,
        VideosModalComponent,
        CardDetailsComponent,
        DropZoneDirective,
        FileUploadComponent
    ],
    entryComponents: [
        EducationModalComponent,
        WorkExperienceModalComponent,
        SkillsModalComponent,
        AwardsAndAchievementsModalComponent,
        GigsAndFreelanceModalComponent,
        HobbiesModalComponent,
        LeadershipModalComponent,
        VolunteerModalComponent,
        VideosModalComponent,
        FileUploadComponent
    ]
})
export class CompanyAddPageModule {
}
