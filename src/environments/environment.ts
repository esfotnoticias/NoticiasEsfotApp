// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  url: 'http://192.168.100.176:3000',
  // url : 'http://newsapi.org/v2/everything?q=bitcoin&from=2020-09-03&sortBy=publishedAt&apiKey=62cce356fd8040f8816eb0f70c9c981d',
  firebaseConfig: {
    apiKey: 'AIzaSyCtlolZn7Ofu6DkusbjHmduLUOzQr5MQOo',
    authDomain: 'noticias-esfot.firebaseapp.com',
    databaseURL: 'https://noticias-esfot.firebaseio.com',
    projectId: 'noticias-esfot',
    storageBucket: 'noticias-esfot.appspot.com',
    messagingSenderId: '327299033473',
    appId: '1:327299033473:web:e1131b221e12fffd792080',
    measurementId: 'G-2CD90GPEQ3'
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
