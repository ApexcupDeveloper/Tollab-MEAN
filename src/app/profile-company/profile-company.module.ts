import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { ProfileCompanyPage } from './profile-company.page';

import { NgxSelectModule } from 'ngx-select-ex';
// import {UploaderComponent} from './uploader/uploader.component'
import {UploadTaskComponent} from './upload-task/upload-task.component'



const routes: Routes = [
  {
    path: '',
    component: ProfileCompanyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    NgxSelectModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileCompanyPage, UploadTaskComponent]
})
export class ProfileCompanyPageModule {}
