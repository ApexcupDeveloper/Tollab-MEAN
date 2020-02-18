import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Device } from '@ionic-native/device/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { SharedModule } from './shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JobdetailComponent } from 'src/app/jobdetail/jobdetail.component';
import { GuidelineComponent } from 'src/app/post-profile/guideline/guideline.component';
import { CardComponent } from './jobs/card/card.component'
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FormsModule } from '@angular/forms';

// import { ChatPageModule } from './chat/chat.module';

import { ChatPage } from './chat/chat.page';
import { DropzoneDirective } from './dropzone.directive';


export function httpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    declarations: [AppComponent, JobdetailComponent, GuidelineComponent, DropzoneDirective],
    entryComponents: [JobdetailComponent, GuidelineComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule.enablePersistence(),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        AngularFireFunctionsModule,
        YouTubePlayerModule,
        SharedModule,
        FormsModule,
        

        //   EmailComposer,
        // RichTextModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        StatusBar,
        SplashScreen,
        EmailComposer,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        FirebaseX,
        FirebaseAuthentication,
        Device,
        Facebook,
        GooglePlus,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
