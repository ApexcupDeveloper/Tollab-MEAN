import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { PostProfilePage } from './post-profile.page';
import { GuidelineComponent } from './guideline/guideline.component';

const routes: Routes = [
  {
    path: '',
    component: PostProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PostProfilePage]
})
export class PostProfilePageModule { }
