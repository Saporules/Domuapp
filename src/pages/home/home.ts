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
  bannerConfig: AdMobFreeBannerConfig = {
    id: 'ca-app-pub-1786174152648654/5849573124',
   isTesting: true,
   autoShow: true
  }
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
    statusbar.styleLightContent(); //changes the color of the Status Bar
    this.admobFree.banner.config(this.bannerConfig); // prepares the publicity banner
    this.admobFree.banner.prepare();
  }


  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Loading domains...",
    });
    this.loader.present();
  }

  // function that checks if the user is Logged in.
  isLoggedin() {
    if (window.localStorage.getItem('currentuser')) {
      return true;
    }
  }

  // function opens the modal to register a new domain
  addDomain() {
    let modal = this.modalCtrl.create(AddDomainModal, { 'domains': this.domains });
    modal.present();
  }

  // function that sends the user to the domain details
  showDetails(domainKey){
    console.log(domainKey);
    this.navCtrl.push(DetailPage,
      {'domains': this.domains, 'domainId': domainKey});
  }

  ionViewDidLoad(){
    this.loader.dismiss();
    this.admobFree.banner.show();
  }

  // function that changes the color of the status based on the expiration date.
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

  //functions that calculates the difference between two dates.
  daysDifference(d1, d2){
    return Math.round((d1-d2)/(1000*60*60*24));
  }


}
