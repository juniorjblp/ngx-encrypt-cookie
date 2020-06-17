import { Component } from '@angular/core';
import {NgxEncryptCookieService} from 'ngx-encrypt-cookie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers:[NgxEncryptCookieService]
})
export class AppComponent {
  title = 'cookietest';




  constructor(private cookie:NgxEncryptCookieService){

    
      let key = this.cookie.generateKey();
   
    this.cookie.set("ngfirecamp","test value",true,key);
  
    this.cookie.set("hello","hello cookie without  encryption",false);

    let otherKey = this.cookie.generateKey("256/32","hello all");

    this.cookie.set("customKey","something strange",true,"my secret key");

    let val = this.cookie.get("test",true,key);
    let val_1 = this.cookie.get("customKey",false,key)
    let val_2 = this.cookie.getAll();
   console.log(this.cookie.get('ngfirecamp',false));
   console.log(this.cookie.get('ngfirecamp',true,key));
    // this.cookie.delete("test");
    // this.cookie.set(';,/?:@&=+$','hello world',false)
    // console.log(this.cookie.get(';,/?:@&=+$',false))
    // this.cookie.deleteAll(); - deletes all cookies 

  }
}
