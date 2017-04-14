import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = HomePage;
  tab2Root: any = SettingsPage;

  tab1Title = "";
  tab2Title = "";

  constructor(public navCtrl: NavController, statusbar: StatusBar) {
    statusbar.styleLightContent();
  }
}
