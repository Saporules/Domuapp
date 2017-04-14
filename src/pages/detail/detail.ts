import { Component } from '@angular/core';
import { NavController, ModalController,
  LoadingController, NavParams, Platform } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import { AddDomainModal } from  '../add-domain-modal/add-domain-modal';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
  domain: FirebaseObjectObservable<any>;
  domains: FirebaseListObservable<any>;
  domainId: any;
  domainUrl: any;
  domainName: any;
  domainCompany: any;
  domainExpDate: any;
  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
    public angfire: AngularFire, public loadingCtrl: LoadingController,
    public navParams: NavParams,public platform: Platform,
    public inAppBrowser: InAppBrowser) {
    this.platform = platform;
    this.domainId = navParams.get('domainId');
    this.domain = this.angfire.database.object(`domains/${this.domainId}`,{ preserveSnapshot: true });
    this.domain.subscribe( snapshot => {
      this.domainUrl = snapshot.val().url;
      this.domainName = snapshot.val().name;
      this.domainCompany = snapshot.val().company;
      this.domainExpDate = snapshot.val().expirationdate;
    });
    this.domains = navParams.get('domains');
  }

  ionViewDidLoad() {
  }

  editDetails() {
    let modal = this.modalCtrl.create(AddDomainModal,
      { 'domain':this.domain,'domains': this.domains, 'domainId': this.domainId });
    modal.present();

    modal.onDidDismiss(data => {
     console.log(data);
     this.domain = this.angfire.database.object(`domains/${this.domainId}`,{ preserveSnapshot: true });
     this.domain.subscribe( snapshot => {
       this.domainUrl = snapshot.val().url;
       this.domainName = snapshot.val().name;
       this.domainCompany = snapshot.val().company;
       this.domainExpDate = snapshot.val().expirationdate;
     });
   });
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

  visitWebSite(){
    let ref = this.inAppBrowser.create(this.domainUrl,'_blank',{toolbar: 'yes', toolbarposition: 'top'});
    ref.show();
  }

}
