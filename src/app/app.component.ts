import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Push } from '@ionic-native/push';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { AddDomainModal } from '../pages/add-domain-modal/add-domain-modal';
import { DetailPage } from '../pages/detail/detail';
import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LoginPage;
  myPush: any;
  myAlertCtrl: any;
  myPlatform: any;
  constructor(platform: Platform, statusBar: StatusBar, push: Push,sqlite: SQLite,
  splashScreen: SplashScreen, keyboard: Keyboard, alertCtrl: AlertController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleLightContent();
      splashScreen.hide();
      keyboard.disableScroll(true);
      keyboard.hideKeyboardAccessoryBar(false);
      this.myPush = push;
      this.myAlertCtrl = alertCtrl;
      this.myPlatform = platform;
      this.initPushNotification();
      sqlite.create({
        name: 'domu.db',
        location: "default"
      }).then((db: SQLiteObject) => {
        db.executeSql('create table userData(mail VARCHAR(32), uid VARCHAR(50))', {})
        .then(() => console.log('Executed SQL'))
        .catch(e => console.log("ERROR app.component.ts 44"+e));
      }).catch(e => console.log("ERROR app.component.ts 45"+e));
    });
  }

  initPushNotification(){
    if (!this.myPlatform.is('cordova')) {
      console.warn("Push notifications not initialized. Cordova is not available - Run in physical device");
      return;
    }
    let pushObject = this.myPush.init({
      android: {
        senderID: "YOUR_SENDER_ID"
      },
      ios: {
        alert: "true",
        badge: false,
        sound: "true"
      },
      windows: {}
    });

    pushObject.on('registration', (data) => {
      console.log("device token ->", data.registrationId);
      //TODO - send device token to server
    });
    pushObject.on('notification', (data) => {
      console.log('message', data.message);
      // let self = this;
      // //if user using app and push notification comes
      // if (data.additionalData.foreground) {
      //   // if application open, show popup
      //   let confirmAlert = this.myAlertCtrl.create({
      //     title: 'New Notification',
      //     message: data.message,
      //     buttons: [{
      //       text: 'Ignore',
      //       role: 'cancel'
      //     }, {
      //       text: 'View',
      //       handler: () => {
      //         //TODO: Your logic here
      //         self.nav.push(DetailsPage, {message: data.message});
      //       }
      //     }]
      //   });
      //   confirmAlert.present();
      // } else {
      //   //if user NOT using app and push notification comes
      //   //TODO: Your logic on click of push notification directly
      //   self.nav.push(DetailsPage, {message: data.message});
      //   console.log("Push notification clicked");
      // }
    });
    pushObject.on('error', (e) => {
      console.log(e.message);
    });
  }

}
