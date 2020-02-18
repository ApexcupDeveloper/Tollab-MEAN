import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComingSoonPage } from './coming-soon.page';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { strings } from '@angular-devkit/core';


//enterEmail = comingSoon.enterEmail | translate;


const routes: Routes = [
    {
        path: '',
        component: ComingSoonPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        SharedModule,
        TranslateModule
    ],
    declarations: [ComingSoonPage]
})
export class ComingSoonPageModule {
}
