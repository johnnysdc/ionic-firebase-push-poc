// import 'phonegap-plugin-push/types';
import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private push: Push,
    private alertCtrl: AlertController,
    private router: Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initPushNotification();
    });
  }

  initPushNotification() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }

    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push.createChannel({
      id: 'testchannel1',
      description: 'My first test channel',
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 3,
      // badge is used to if badge appears on the app
      // icon see https://developer.android.com/reference/android/app/NotificationChannel.html#setShowBadge(boolean).
      // false = no badge on app icon.
      // true = badge on app icon
      badge: false
    }).then(() => console.log('Channel created'));

    // Delete a channel (Android O and above)
    this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

    // Return a list of currently configured channels
    this.push.listChannels().then((channels) => console.log('List of channels', channels));

    // to initialize push notifications

    const options: PushOptions = {
      android: {
        senderID: '771423056010'
      },
      ios: {
        alert: 'true',
        badge: false,
        sound: 'true'
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('registration').subscribe((data: any) => {
      console.log('device token -> ' + data.registrationId);
      // TODO - send device token to server
    });

    pushObject.on('notification').subscribe((data: any) => {
      console.log('message -> ' + data.message);
      // if user using app and push notification comes
      if (data.additionalData.foreground) {
        // if application open, show popup
        const confirmAlert = this.alertCtrl.create({
          header: 'New Notification',
          message: data.message,
          buttons: [{
            text: 'Ignore',
            role: 'cancel'
          }, {
            text: 'View',
            handler: () => {
              // TODO: Your logic here
              this.router.navigate(['/tabs/tab1', { message: data.message }]);
              // this.router.navigateByUrl('details', { message: data.message });
              // this.nav.push(DetailsPage, { message: data.message });
            }
          }]
        });
        confirmAlert.then(x => console.log(x));
        // confirmAlert.present();
      } else {
        // if user NOT using app and push notification comes
        // TODO: Your logic on click of push notification directly
        this.router.navigate(['/tabs/tab1', { message: data.message }]);
        // this.nav.push(DetailsPage, { message: data.message });
        console.log('Push notification clicked');
      }
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin' + error));
  }
}
