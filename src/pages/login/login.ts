import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  email:any;
  password:any;
  confirm_pw:any;
  signUpIsPushed = false;
  loader:any;
  confirmationClass = "not-equals";

  constructor(public navCtrl: NavController, public navParams: NavParams,
  public angfire: AngularFire, private toastCtrl: ToastController,
  public loadingCtrl: LoadingController, private statusBar: StatusBar,
  public sqlite: SQLite) {
    if (!this.isLoggedin()) {
      console.log('You are not logged in');
    }else if(this.isLoggedin()){
      this.navCtrl.push(TabsPage);
    }
    statusBar.styleDefault();
    this.sqlite.echoTest().then(r=>console.log(r)).catch((e)=>console.log("ERROR login.ts +38"+e));
  }

  isLoggedin() {
    if (window.localStorage.getItem('currentuser')) {
      return true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  ionViewWillEnter(){
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(56px)';
      });
    } // end if
  }

  ionViewDidLeave(){
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(0)';
      });
    } // end if
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Logging in...",
    });
    this.loader.present();
  }

  login() {
    if (!this.signUpIsPushed) {
      if (this.checkLoginFields('login')) {
        this.presentLoading();
        this.angfire.auth.login({
          email: this.email,
          password: this.password
        },
          {
            provider: AuthProviders.Password,
            method: AuthMethods.Password
          }).then((response) => {
            console.log('Login success' + JSON.stringify(response));
            let currentuser = {
              email: response.auth.email,
              uid: response.uid
            };
            window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
            this.loader.dismiss();
            this.navCtrl.push(TabsPage);
          }).catch((error) => {
            console.log(error);
            this.loader.dismiss();
        });
      }
    }else{
      this.signUpIsPushed = false;
    }
  }

  signUp() {
    if (this.signUpIsPushed == false){
      this.signUpIsPushed = true
    }else{
      if(this.checkLoginFields("signup")){
        this.angfire.auth.createUser({
          email: this.email,
          password: this.confirm_pw
        }).then((response)=>{
          let currentuser = {
            email: response.auth.email,
            uid: response.uid
          };
          window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
          this.navCtrl.push(TabsPage);
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
  }

  checkLoginFields(type){
    if (this.checkEmail()){
      if(this.checkPassword()){
        if(type == "signup"){
          if(this.checkConfirmPw()){
            return true;
          }else{
            this.presentToast('confirm_pw');
            return false;
          }
        }else{
          return true;
        }
      }else{
        this.presentToast('password');
        return false;
      }
    }else{
      this.presentToast('email');
      return false;
    }
  }
  checkEmail(){
    console.log(this.email);
    if (this.email === undefined || this.email === ''){
      return false;
    } else if(this.email !== undefined || this.email !== ''){
      return true;
    }
  }
  checkPassword(){
    if (this.password === undefined || this.password === ''){
      return false;
    } else if(this.password !== undefined || this.password !== ''){
      return true;
    }
  }

  checkConfirmPw(){
    if (this.confirm_pw === undefined || this.confirm_pw === '' || this.confirmationClass == "not-equals"){
      return false;
    } else if(this.confirm_pw !== undefined && this.confirm_pw !== '' &&
      this.confirmationClass == "equals"){
      return true;
    }
  }


  checkPasswordConfirmation(){
    if(this.confirm_pw == this.password){
      this.confirmationClass="equals";
    }else{
      this.confirmationClass="not-equals";
    }
  }

  presentToast(userCase) {
    var toast;
    switch (userCase){
      case "email":
        toast = this.toastCtrl.create({
          message: 'You must enter a valid email address',
          showCloseButton: true,
          position: 'middle',
          cssClass: 'alert-toast'
        });
      break;
      case "password":
        toast = this.toastCtrl.create({
          message: 'You cannot send an empty password',
          showCloseButton: true,
          position: 'middle',
          cssClass: 'alert-toast'
        });
      break;
      case "confirm_pw":
        toast = this.toastCtrl.create({
          message: 'Password must be the same in both fields',
          showCloseButton: true,
          position: 'middle',
          cssClass: 'alert-toast'
        });
      break;
      default:
      break;
    }

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
