import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import firebase from 'firebase';

import { DetailPage } from  '../detail/detail';

@Component({
  selector: 'page-add-domain-modal',
  templateUrl: 'add-domain-modal.html'
})
export class AddDomainModal {
  domains: FirebaseListObservable<any>;
  domain: FirebaseObjectObservable<any>;
  domainId:any;
  name:any;
  company:any;
  expirationdate:any;
  user:any;
  yearsString:any;
  userIsEditing = false;
  titleText = "New";
  buttonText = "Create New";
  constructor(public viewCtrl: ViewController, public angfire: AngularFire,
  public navParams: NavParams){
    if(navParams.get('domain')!== undefined){
      this.userIsEditing = true;
      this.titleText = "Edit";
      this.buttonText = "Save";
      this.domainId = navParams.get('domainId');
      this.domain = this.angfire.database.object(`domains/${this.domainId}`, { preserveSnapshot: true });
      this.domain.subscribe(snapshot => {
        this.name = snapshot.val().name;
        this.company = snapshot.val().company;
        this.expirationdate = snapshot.val().expirationdate;
      });
    }
    this.domains = navParams.get('domains');
    this.user = JSON.parse(window.localStorage.getItem('currentuser'));
    let currentYear = new Date().getFullYear();
    this.yearsString = currentYear+","+(currentYear+1)+","+(currentYear+2)+","+
    (currentYear+3)+","+(currentYear+4)+","+(currentYear+5);
  }

  createDomain() {
    if(!this.userIsEditing){
      let userUid = this.user.uid;
      let newDomain = {
        name: this.name,
        company: this.company,
        expirationdate: this.expirationdate,
        createdat: firebase.database.ServerValue.TIMESTAMP,
        updatedat: firebase.database.ServerValue.TIMESTAMP,
        url: "http://"+this.name,
        user: userUid
      }
      console.log(newDomain);
      this.domains.push(newDomain).then((response)=>{
        console.log(response);
        this.dismiss();
      }).catch((err)=>{
        console.log(err);
      });
    }else{
      let editedDomain = {
        name: this.name,
        company: this.company,
        expirationdate: this.expirationdate,
        updatedat: firebase.database.ServerValue.TIMESTAMP,
        url: "http://"+this.name,
      }
      console.log(editedDomain);
      this.domain.update(editedDomain).then((response)=>{
        console.log(response);
        this.dismiss();
      }).catch((err)=>{
        console.log(err);
      });
    }
  }

  dismiss() {
   this.viewCtrl.dismiss();
  }
}
