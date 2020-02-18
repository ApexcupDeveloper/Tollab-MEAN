import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { DetailEmployerPage } from './detail-employer.page';
import { InboxComponent } from './inbox/inbox.component';
import { Selectlist1Component } from './selectlist1/selectlist1.component';
import { Selectlist2Component } from './selectlist2/selectlist2.component';
import { Selectlist3Component } from './selectlist3/selectlist3.component';
import { HiredComponent } from './hired/hired.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
const routes: Routes = [
  {
    path: '',
    component: DetailEmployerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    Ng2SearchPipeModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailEmployerPage,
    InboxComponent,
    Selectlist1Component,
    Selectlist2Component,
    Selectlist3Component,
    HiredComponent
  ]
})
export class DetailEmployerPageModule { }
