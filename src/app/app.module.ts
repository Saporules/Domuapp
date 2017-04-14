import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { AddDomainModal } from '../pages/add-domain-modal/add-domain-modal';
import { DetailPage } from '../pages/detail/detail';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Push } from '@ionic-native/push';
import { SQLite } from '@ionic-native/sqlite';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAZHXsWSH85b-oGL2oAZxSarFf0okdiz8I",
  authDomain: "project-8428472664211896459.firebaseapp.com",
  databaseURL: "https://project-8428472664211896459.firebaseio.com",
  storageBucket: "project-8428472664211896459.appspot.com",
  messagingSenderId: "790533773052"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddDomainModal,
    DetailPage,
    LoginPage,
    TabsPage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddDomainModal,
    DetailPage,
    LoginPage,
    TabsPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    InAppBrowser,
    Push,
    SQLite,
    AdMobFree,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
