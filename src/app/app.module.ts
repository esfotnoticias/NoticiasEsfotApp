import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';

import { Camera } from '@ionic-native/camera/ngx';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { File } from '@ionic-native/file/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';
import {FileOpener} from '@ionic-native/file-opener/ngx'
import { DocumentViewer} from '@ionic-native/document-viewer/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
// import { FCM } from '@ionic-native/fcm/ngx';

import { FCM } from '@ionic-native/fcm/ngx';

import {AngularFireStorageModule} from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GooglePlus} from '@ionic-native/google-plus/ngx'


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    RouterModule,
    BrowserAnimationsModule
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    SocialSharing,
    File,
    FCM,
    FileTransfer,
    FileOpener,
    DocumentViewer,
    YoutubeVideoPlayer,
    GooglePlus,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
