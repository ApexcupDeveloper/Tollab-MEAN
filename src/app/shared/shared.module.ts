import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavBarComponent} from './nav-bar/nav-bar.component';
import {FooterComponent} from './footer/footer.component';
import {DropdownUserMenuComponent} from './dropdown-user-menu/dropdown-user-menu.component';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LogInComponent} from '../auth/log-in/log-in.component';
import {SignUpComponent} from '../auth/sign-up/sign-up.component';
import {ReactiveFormsModule} from '@angular/forms';
import {GoogleLogInComponent} from '../auth/log-in/google-log-in/google-log-in.component';
import {FacebookLogInComponent} from '../auth/log-in/facebook-log-in/facebook-log-in.component';
import {PhoneVerificationComponent} from '../auth/phone-verification/phone-verification.component';
import {ForgotPasswordComponent} from '../auth/forgot-password/forgot-password.component';



@NgModule({
    declarations: [
        NavBarComponent,
        FooterComponent,
        DropdownUserMenuComponent,
        LogInComponent,
        GoogleLogInComponent,
        FacebookLogInComponent,
        SignUpComponent,
        PhoneVerificationComponent,
        ForgotPasswordComponent,

    ],
    entryComponents: [
        DropdownUserMenuComponent,
        LogInComponent,
        SignUpComponent,
        PhoneVerificationComponent,
        ForgotPasswordComponent,

    ],
    imports: [
        CommonModule,
        IonicModule,
        RouterModule,
        ReactiveFormsModule,
        TranslateModule
    ],
    exports: [
        NavBarComponent,
        FooterComponent,

    ]
})
export class SharedModule {
}
