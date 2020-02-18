
import { ProfileEmployerPage } from './profile-employer.page';

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {ComingSoonPageModule} from '../coming-soon/coming-soon.module';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: ProfileEmployerPage
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
      ProfileEmployerPage,
      FileUploadComponent
    ],
    entryComponents: [
        FileUploadComponent
    ]
})
export class ProfileEmployerPageModule {}
