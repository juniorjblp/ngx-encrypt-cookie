# NgxEncryptCookie

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.

# Installation

```
npm i ngx-encrypt-cookie --save
```

Then...

## Inject either in module or component

- you can import in app.module.ts or in your custom module shared service
- you can import in component level to use as singleton service.

## Usage

```
....
import {NgxEncryptCookieService} from 'ngx-secure-cookie'

@Component({
  ......
  providers: [NgxEncryptCookieService]
})
export class AppComponent {

  constructor(
    private cookie:NgxEncryptCookieService,
  ){

    var key = this.cookie.generateKey();

    this.cookie.set("test","test value",true,key);


    var otherKey = this.cookie.generateKey("256/32","hello all");

    this.cookie.set("customKey","test value without encryption",true,otherKey);

    var val = this.cookie.get("test",true,key);   // decrypted value
    var val_1 = this.cookie.get("customKey",false)  //encrypted value

    var val_2 = this.cookie.getAll();
    //returns all cookies - here it will return encrypted values also if cookie is having

    var val_3 = this.cookie.getAll(true,key);
     // returns all values - here if a cookie is having encrypted value it will decrypt.
    this.cookie.delete("test");

    this.cookie.deleteAll("/");
    this.cookie.deleteAll();

  }
}

```

## Methods :

### generateKey(keySize?: string, passPhrase?: string)

```

var key = this.cookie.generateKey("128/32","hello");

```

- @params keySize - to generate key of given size. Available keySize - `128/32, 256/32, 512/32` - `Default(128 / 32)`
- @params passPhrase - using passPhrase key will be generated of given keySize.

### check( name: string ): boolean;

```

const cookieExists: boolean = this.cookie.check('test');

```

- @params name - cookie name
- @params encryption - if cookie value encrypted pass true othwerwise false
- @params key string - pass key value if encrypted=true
- Checks if a cookie with the give name can be accessed or found.

### get( name: string,encryption?:boolean ): string;

```

const value: string = cookieService.get('test',false);

```

- @params name - Gets the value of the - with the specified name.

### getAll(encryption?:boolean,key?:string): { [key: string]: string }

```

const cookies = this.cookie.getAll(true,key);  // use if you have one encrypted value

const normalCookies = this.cookie.getAll()    // use this if you have zero encrypted value

```

- @param encryption boolean - if cookies having encrypted values. if you need `encrypted value pass false` otherwise pass the true to get decrypted value and if you set `encryption=true` , then `dont pass key` value it is unneccessary.
- @param key string - pass generated key or user defined key onlyif `encrypted=true`.
- Returns a map of key-value pairs for cookies that can be accessed.

### set( name: string, value: string, encrypt:boolean, key?:string, expires?: number | Date, path?: string, domain?: string, secure?: boolean, sameSite?: 'Lax' | 'Strict' | 'None' ): void;

```

this.cookie.set("test","test value",false);
this.cookie.set("test1","test value",true,key);

```

- Sets a cookie with the specified `name` and `value`.pass true or false to either `encrypt` values or not. It is good practice to specify a `path`. If you are unsure about the path value, use `'/'`. If no path or domain is explicitly defined, the current location is assumed. sameSite defaults to Lax.

## ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) NOTE:

- For security reasons, it is not possible to define cookies for other domains. Browsers do not allow this. Read this and this StackOverflow answer for a more in-depth explanation.

- Browsers do not accept cookies flagged sameSite = 'None' if secure flag isn't set as well. NgxSecureCookies will override the secure flag to true if sameSite='None'.

### delete( name: string, path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax' ): void;

```

this.cookie.delete('test');

```

- Deletes a cookie with the specified `name`. It is best practice to always define a `path`. If you are unsure about the path value, use `'/'`.

#### ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) Important:

- For security reasons, it is not possible to delete cookies for other domains. Browsers do not allow this. Read this and this StackOverflow answer for a more in-depth explanation.

### deleteAll( path?: string, domain?: string, secure?: boolean, sameSite: 'Lax' | 'None' | 'Strict' = 'Lax' ): void;

```

this.cookie.deleteAll("/");

```

- Deletes all cookies that can access. It is always a best practice to define a `path` to delete. If you are not sure about the path where the cookie store pass `'/'`.

## Licence:

- MIT

## About

- Name : Chaitanya
- Git : https://github.com/chaitanyasairam-d
- Blog : https://ngfirecamp.blogspot.com/
- Portfolio : https://dcsr-portfolio.herokuapp.com
