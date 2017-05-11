import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2';
import { StatusBar } from '@ionic-native/status-bar';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  storage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public angfire: AngularFire, private statusbar: StatusBar) {
    statusbar.styleLightContent();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  // function to log out from domu app
  logout() {
    this.angfire.auth.logout().then((response) => {
      window.localStorage.clear();
      this.navCtrl.push(LoginPage);
    });
  }

}
