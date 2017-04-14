import { Component } from '@angular/core';
import { NavController, ModalController, ViewController,
  LoadingController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free';

import { DetailPage } from '../detail/detail';
import { AddDomainModal } from  '../add-domain-modal/add-domain-modal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  domains: FirebaseListObservable<any>;
  loader: any;
  user: any;
  constructor( public navCtrl: NavController, public modalCtrl: ModalController,
    public angfire: AngularFire, private statusbar: StatusBar,
    public loadingCtrl: LoadingController, private admobFree: AdMobFree ) {
    if (!this.isLoggedin()) {
      this.navCtrl.pop();
    }
    this.presentLoading();
    this.user = JSON.parse(window.localStorage.getItem('currentuser'));
    console.log(this.user.uid);
    this.domains = angfire.database.list('/domains', {
      query: {
        orderByChild:'user',
        equalTo: this.user.uid
      }
    });
    statusbar.styleLightContent();
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Loading domains...",
    });
    this.loader.present();
  }

  isLoggedin() {
    if (window.localStorage.getItem('currentuser')) {
      return true;
    }
  }

  addDomain() {
    let modal = this.modalCtrl.create(AddDomainModal, { 'domains': this.domains });
    modal.present();
  }

  showDetails(domainKey){
    console.log(domainKey);
    this.navCtrl.push(DetailPage,
      {'domains': this.domains, 'domainId': domainKey});
  }

  ionViewDidLoad(){
    this.loader.dismiss();
  }

  status(expirationdate){
    var expirationStatus;
    let dayDiff = this.daysDifference(new Date(expirationdate), new Date());
    if(dayDiff <= 0 ){
      expirationStatus = "red-status";
    }else if(dayDiff > 0 && dayDiff <= 50 ){
      expirationStatus = "yellow-status";
    }
    else if(dayDiff > 50){
      expirationStatus = "green-status";
    }

    return expirationStatus;
  }

  daysDifference(d1, d2){
    return Math.round((d1-d2)/(1000*60*60*24));
  }

  const bannerConfig: AdMobFreeBannerConfig = {
   // add your config here
   // for the sake of this example we will just use the test config
   isTesting: true,
   autoShow: true
  };

  this.admobFree.banner.config(bannerConfig);

  this.admobFree.banner.prepare()
    .then(() => {
      // banner Ad is ready
      // if we set autoShow to false, then we will need to call the show method here
    })
    .catch(e => console.log(e));
  }
}
