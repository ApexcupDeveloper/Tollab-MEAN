import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppliedJobPage } from './applied-job.page';

const routes: Routes = [
  {
    path: '',
    component: AppliedJobPage
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
  declarations: [AppliedJobPage]
})
export class AppliedJobPageModule {}
