import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {HomePage} from './home.page';
import {TranslateModule} from '@ngx-translate/core';


import {CreateJobComponent} from './create-job/create-job.component';
import {IonicSelectableModule} from 'ionic-selectable';

const routes: Routes = [
    {
        path: '',
        component: HomePage
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
        IonicSelectableModule
    ],
    declarations: [HomePage, CreateJobComponent],
    entryComponents: [CreateJobComponent]
})
export class HomePageModule {
}
