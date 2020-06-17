import { TestBed } from '@angular/core/testing';
import { ɵPLATFORM_BROWSER_ID, ɵPLATFORM_SERVER_ID } from '@angular/common';
import { NgxEncryptCookieService } from './ngx-encrypt-cookie.service';
import Spy = jasmine.Spy;
import { PLATFORM_ID } from '@angular/core';

describe('NgxEncryptCookieService', () => {
  let cookie: NgxEncryptCookieService
  let platformId: string;
  const documentMock: Document = document;
  let documentCookieGetterSpy: Spy;
  let documentCookieSetterSpy: Spy;


  beforeEach(() => {

    documentCookieGetterSpy = spyOnProperty(documentMock, 'cookie', 'get').and.callThrough();
    documentCookieSetterSpy = spyOnProperty(documentMock, 'cookie', 'set').and.callThrough();

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useFactory: () => platformId },
      ]
    }

    );
    cookie = TestBed.get(NgxEncryptCookieService)

  });
  afterEach(() => {
    cookie.deleteAll();
    documentCookieGetterSpy.calls.reset();
    documentCookieSetterSpy.calls.reset();
  });

  it('should be created', () => {
    const service: NgxEncryptCookieService = TestBed.get(NgxEncryptCookieService);
    expect(service).toBeTruthy();
  });

  describe('Platform browser', () => {
    beforeAll(() => {
      platformId = ɵPLATFORM_BROWSER_ID;
    });
  
  describe('#check', () => {
    it('should return true if cookie exists on document', () => {
      documentCookieGetterSpy.and.returnValue('test=sample;');

      expect(cookie.check('test')).toEqual(true);
    });
    it('should look up cookie by encoded name', () => {
      documentCookieGetterSpy.and.returnValue('%3B%2C%2F%3F%3A%40%26%3D%2B%24=exists;');

      expect(cookie.check(';,/?:@&=+$')).toEqual(true);
    });
    it('should return false if cookie does not exist on document', () => {
      documentCookieGetterSpy.and.returnValue('test=sample;');

      expect(cookie.check('sample')).toEqual(false);
    });
    it('should check for values and not for keys', () => {
      documentCookieGetterSpy.and.returnValue('test=sample; test1=test123;');

      expect(cookie.check('test')).toEqual(true);
      expect(cookie.check('sample')).toEqual(false);
      expect(cookie.check('test1')).toEqual(true);
      expect(cookie.check('test123')).toEqual(false);
    });
  });

  describe('#get without encryption', () => {
    it('should return value of cookie', () => {
      documentCookieGetterSpy.and.returnValue('test=sample;');

      expect(cookie.get('test',false)).toEqual('sample');
    });
    it('should return decoded value of cookie', () => {
      const cookieString = [
        '%3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24',
        '-H%40ll%C3%B6_%20W%C3%B6rld-=-H%40ll%C3%B6_%20W%C3%B6rld-',
        'true=true',
        '%24uper%5ETEST(123)=%24uper%5ETEST(123)',
        'F()!!()%2Fsample=F()!!()%2Fsample',
        '*F.)%2Fo(o*=*F.)%2Fo(o*',
        '-O_o%7B1%2C2%7D=-O_o%7B1%2C2%7D',
        'B%3Far%7CFo%2Bo=B%3Far%7CFo%2Bo',
        'Hello%3DWorld%3B=Hello%3DWorld%3B',
        '%5Btest-_*.%5Dsample=%5Btest-_*.%5Dsample',
      ].join('; ');
      documentCookieGetterSpy.and.returnValue(cookieString);

      expect(cookie.get(';,/?:@&=+$',false)).toEqual(';,/?:@&=+$');
      expect(cookie.get('-H@llö_ Wörld-',false)).toEqual('-H@llö_ Wörld-');
      expect(cookie.get('$uper^TEST(123)',false)).toEqual('$uper^TEST(123)');
      expect(cookie.get('F()!!()/sample',false)).toEqual('F()!!()/sample');
      expect(cookie.get('*F.)/o(o*',false)).toEqual('*F.)/o(o*');
      expect(cookie.get('-O_o{1,2}',false)).toEqual('-O_o{1,2}');
      expect(cookie.get('B?ar|Fo+o',false)).toEqual('B?ar|Fo+o');
      expect(cookie.get('Hello=World;',false)).toEqual('Hello=World;');
      expect(cookie.get('[test-_*.]sample',false)).toEqual('[test-_*.]sample');
    });
    it('should fallback to original value if decoding fails', () => {
      documentCookieGetterSpy.and.returnValue('test=%E0%A4%A');

      expect(cookie.get('test',false)).toEqual('%E0%A4%A');
    });
    it('should return empty string for not set cookie', () => {
      documentCookieGetterSpy.and.returnValue('test=sample;');

      expect(cookie.get('sample',false)).toEqual('');
    });
  });
  
  describe('#get with encryption', () => {

    it('should return value of cookie', () => {
      // documentCookieGetterSpy.and.returnValue('test=sample;');
      cookie.set("test","sample",true,"secret key");

      expect(cookie.get('test',true,"secret key")).toEqual('sample');
    });
    
    it('should return decoded value of cookie', () => {
      const cookieString = [
        '%3B%2C%2F%3F%3A%40%26%3D%2B%24=hello%20world',
        '-H%40ll%C3%B6_%20W%C3%B6rld-=-H%40ll%C3%B6_%20W%C3%B6rld-',
        '%24uper%5ETEST(123)=%24uper%5ETEST(123)',
        'F()!!()%2Fsample=F()!!()%2Fsample',
        '*F.)%2Fo(o*=*F.)%2Fo(o*',
        '-O_o%7B1%2C2%7D=-O_o%7B1%2C2%7D',
        'B%3Far%7CFo%2Bo=B%3Far%7CFo%2Bo',
        'Hello%3DWorld%3B=Hello%3DWorld%3B',
        '%5Btest-_*.%5Dsample=%5Btest-_*.%5Dsample',
      ].join('; ');
      documentCookieGetterSpy.and.returnValue(cookieString);
      expect(cookie.get(';,/?:@&=+$',false)).toEqual('hello world');
      expect(cookie.get('-H@llö_ Wörld-',false)).toEqual('-H@llö_ Wörld-');
      expect(cookie.get('$uper^TEST(123)',false)).toEqual('$uper^TEST(123)');
      expect(cookie.get('F()!!()/sample',false)).toEqual('F()!!()/sample');
      expect(cookie.get('*F.)/o(o*',false)).toEqual('*F.)/o(o*');
      expect(cookie.get('-O_o{1,2}',false)).toEqual('-O_o{1,2}');
      expect(cookie.get('B?ar|Fo+o',false)).toEqual('B?ar|Fo+o');
      expect(cookie.get('Hello=World;',false)).toEqual('Hello=World;');
      expect(cookie.get('[test-_*.]sample',false)).toEqual('[test-_*.]sample');
    });
    it('should fallback to original value if decoding fails', () => {
      documentCookieGetterSpy.and.returnValue('test=%E0%A4%A');

      expect(cookie.get('test',false)).toEqual('%E0%A4%A');
    });
    it('should return empty string for not set cookie', () => {
      documentCookieGetterSpy.and.returnValue('test=sample;');

      expect(cookie.get('sample',true,'secret key')).toEqual('');
    });
    it('should return "key fail" if secret key is not passed oor null',()=>{
      expect(cookie.set("test","sample",true,"")).toBe("key fail")

    });
    it('should return encrypted value if encrypted=false passed',()=>{
     cookie.set("test","sample",true,'secret key');
      expect(cookie.get('test',false)).toBeTruthy()

    });
  });


  describe('#getAll', () => {
    it('should return empty object if cookies not set', () => {
      documentCookieGetterSpy.and.returnValue('');

      expect(cookie.getAll()).toEqual({});
    });
    it('should return object with decoded cookie names and values', () => {
      documentCookieGetterSpy.and.returnValue('test=sample; Hello=World; %3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24');

      expect(cookie.getAll()).toEqual({ test: 'sample', Hello: 'World', ';,/?:@&=+$': ';,/?:@&=+$' });
    });
    it('should return object with safely decoded cookie names and values', () => {
      documentCookieGetterSpy.and.returnValue(
        'test=%E0%A4%A; %E0%A4%A=%E0%A4%A; Hello=World; %3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24'
      );

      expect(cookie.getAll()).toEqual({
        test: '%E0%A4%A',
        '%E0%A4%A': '%E0%A4%A',
        Hello: 'World',
        ';,/?:@&=+$': ';,/?:@&=+$',
      });
    });
  });


  describe('#set without encryption', () => {
    it('should set cookie with default SameSite option', () => {
      cookie.set('test', 'sample',false);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;sameSite=Lax;');
    });
    it('should set cookie with encoded name and value', () => {
      cookie.set(';,/?:@&=+$', ';,/?:@&=+$',false);
      cookie.set('-H@llö_ Wörld-', '-H@llö_ Wörld-',false);
      cookie.set('$uper^TEST(123)', '$uper^TEST(123)',false);
      cookie.set('F()!!()/sample', 'F()!!()/sample',false);
      cookie.set('*F.)/o(o*', '*F.)/o(o*',false);
      cookie.set('-O_o{1,2}', '-O_o{1,2}',false);
      cookie.set('B?ar|Fo+o', 'B?ar|Fo+o',false);
      cookie.set('Hello=World;', 'Hello=World;',false);
      cookie.set('[test-_*.]sample', '[test-_*.]sample',false);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('%3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('-H%40ll%C3%B6_%20W%C3%B6rld-=-H%40ll%C3%B6_%20W%C3%B6rld-;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('%24uper%5ETEST(123)=%24uper%5ETEST(123);sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('F()!!()%2Fsample=F()!!()%2Fsample;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('*F.)%2Fo(o*=*F.)%2Fo(o*;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('-O_o%7B1%2C2%7D=-O_o%7B1%2C2%7D;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('B%3Far%7CFo%2Bo=B%3Far%7CFo%2Bo;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('Hello%3DWorld%3B=Hello%3DWorld%3B;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('%5Btest-_*.%5Dsample=%5Btest-_*.%5Dsample;sameSite=Lax;');
    });
    it('should set cookie with expires options in days', () => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('Sun, 15 Mar 2020 10:00:00 GMT'));
      cookie.set('test', 'sample',false,null, 2);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;expires=Tue, 17 Mar 2020 10:00:00 GMT;sameSite=Lax;');
      jasmine.clock().uninstall();
    });
    it('should set cookie with expires option from Date object', () => {
      const expiresDate = new Date('Mon, 15 Mar 2021 10:00:00 GMT');
      cookie.set('test', 'sample', false,null,expiresDate);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;expires=Mon, 15 Mar 2021 10:00:00 GMT;sameSite=Lax;');
    });
    it('should set cookie with path option', () => {
      cookie.set('test', 'sample', false,null,undefined, '/test');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;path=/test;sameSite=Lax;');
    });
    it('should set cookie with domain option', () => {
      cookie.set('test', 'sample', false,null,undefined, undefined, 'example.com');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;domain=example.com;sameSite=Lax;');
    });
    it('should set cookie with secure option', () => {
      cookie.set('test', 'sample',false,null, undefined, undefined, undefined, true);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;secure;sameSite=Lax;');
    });
    it('should set cookie with forced secure flag when SameSite option is "None"', () => {
      cookie.set('test', 'sample', false,null,undefined, undefined, undefined, false, 'None');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;secure;sameSite=None;');
    });
    it('should set cookie with SameSite option', () => {
      cookie.set('test', 'sample', false,null,undefined, undefined, undefined, false, 'Strict');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;sameSite=Strict;');
    });
    it('should set cookie with all options', () => {
      const expiresDate = new Date('Mon, 15 Mar 2021 10:00:00 GMT');
      cookie.set('test', 'sample', false,null,expiresDate, '/test', 'example.com', true, 'Strict');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith(
        'test=sample;expires=Mon, 15 Mar 2021 10:00:00 GMT;path=/test;domain=example.com;secure;sameSite=Strict;'
      );
    });
  });

  describe('#set with encryption', () => {
    it('should set cookie with default SameSite option', () => {
      cookie.set('test', 'sample',false);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;sameSite=Lax;');
    });
    it('should set cookie with encoded name and value', () => {
      cookie.set(';,/?:@&=+$', ';,/?:@&=+$',false);
      cookie.set('-H@llö_ Wörld-', '-H@llö_ Wörld-',false);
      cookie.set('$uper^TEST(123)', '$uper^TEST(123)',false);
      cookie.set('F()!!()/sample', 'F()!!()/sample',false);
      cookie.set('*F.)/o(o*', '*F.)/o(o*',false);
      cookie.set('-O_o{1,2}', '-O_o{1,2}',false);
      cookie.set('B?ar|Fo+o', 'B?ar|Fo+o',false);
      cookie.set('Hello=World;', 'Hello=World;',false);
      cookie.set('[test-_*.]sample', '[test-_*.]sample',false);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('%3B%2C%2F%3F%3A%40%26%3D%2B%24=%3B%2C%2F%3F%3A%40%26%3D%2B%24;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('-H%40ll%C3%B6_%20W%C3%B6rld-=-H%40ll%C3%B6_%20W%C3%B6rld-;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('%24uper%5ETEST(123)=%24uper%5ETEST(123);sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('F()!!()%2Fsample=F()!!()%2Fsample;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('*F.)%2Fo(o*=*F.)%2Fo(o*;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('-O_o%7B1%2C2%7D=-O_o%7B1%2C2%7D;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('B%3Far%7CFo%2Bo=B%3Far%7CFo%2Bo;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('Hello%3DWorld%3B=Hello%3DWorld%3B;sameSite=Lax;');
      expect(documentCookieSetterSpy).toHaveBeenCalledWith('%5Btest-_*.%5Dsample=%5Btest-_*.%5Dsample;sameSite=Lax;');
    });
    it('should set cookie with expires options in days', () => {
      jasmine.clock().uninstall();
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date('Sun, 15 Mar 2020 10:00:00 GMT'));
      cookie.set('test', 'sample',false,null, 2);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;expires=Tue, 17 Mar 2020 10:00:00 GMT;sameSite=Lax;');
      jasmine.clock().uninstall();
    });
    it('should set cookie with expires option from Date object', () => {
      const expiresDate = new Date('Mon, 15 Mar 2021 10:00:00 GMT');
      cookie.set('test', 'sample', false,null,expiresDate);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;expires=Mon, 15 Mar 2021 10:00:00 GMT;sameSite=Lax;');
    });
    it('should set cookie with path option', () => {
      cookie.set('test', 'sample', false,null,undefined, '/test');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;path=/test;sameSite=Lax;');
    });
    it('should set cookie with domain option', () => {
      cookie.set('test', 'sample', false,null,undefined, undefined, 'example.com');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;domain=example.com;sameSite=Lax;');
    });
    it('should set cookie with secure option', () => {
      cookie.set('test', 'sample',false,null, undefined, undefined, undefined, true);

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;secure;sameSite=Lax;');
    });
    it('should set cookie with forced secure flag when SameSite option is "None"', () => {
      cookie.set('test', 'sample', false,null,undefined, undefined, undefined, false, 'None');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;secure;sameSite=None;');
    });
    it('should set cookie with SameSite option', () => {
      cookie.set('test', 'sample', false,null,undefined, undefined, undefined, false, 'Strict');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith('test=sample;sameSite=Strict;');
    });
    it('should set cookie with all options', () => {
      const expiresDate = new Date('Mon, 15 Mar 2021 10:00:00 GMT');
      cookie.set('test', 'sample', false,null,expiresDate, '/test', 'example.com', true, 'Strict');

      expect(documentCookieSetterSpy).toHaveBeenCalledWith(
        'test=sample;expires=Mon, 15 Mar 2021 10:00:00 GMT;path=/test;domain=example.com;secure;sameSite=Strict;'
      );
    });
  });

  describe('#delete', () => {
    it('should delete cookie', () => {
      documentMock.cookie = 'test=sample';
      expect(documentMock.cookie).toContain('test=sample');
      cookie.delete('test');

      expect(documentMock.cookie).not.toContain('test=sample');
    });
    it('should invoke set method with fixed date and and pass other params through', () => {
      spyOn(cookie, 'set');
      cookie.delete('test', '/test','example.com', true, 'Lax');

      expect(cookie.set).toHaveBeenCalledWith(
        'test',
        '',
        false,
        '',
        new Date('Thu, 01 Jan 1970 00:00:01 GMT'),
        '/test',
        'example.com',
        true,
        'Lax'
      );
    });
  });


  describe('#deleteAll', () => {
    it('should delete all cookies', () => {
      documentMock.cookie = 'test=sample';
      documentMock.cookie = 'test1=test123';
      expect(documentMock.cookie).toEqual('test=sample; test1=test123');
      cookie.deleteAll();

      expect(documentMock.cookie).toEqual('');
    });
    it('should invoke delete method for each cookie and path params through', () => {
      spyOn(cookie, 'delete');
      documentMock.cookie = 'test=sample';
      documentMock.cookie = 'test1=test123';
      expect(documentMock.cookie).toEqual('test=sample; test1=test123');
      cookie.deleteAll('/test', 'example.com', true, 'Lax');

      expect(cookie.delete).toHaveBeenCalledWith('test', '/test', 'example.com', true, 'Lax');
      expect(cookie.delete).toHaveBeenCalledWith('test1', '/test', 'example.com', true, 'Lax');
    });
  });

});

describe('Platform server', () => {
  beforeAll(() => {
    platformId = ɵPLATFORM_SERVER_ID;
  });
  describe('#check', () => {
    it('should always return false ', () => {
      cookie.set('test', 'sample',false,null);

      expect(cookie.check('test')).toEqual(false);
      expect(cookie.check('sample')).toEqual(false);
    });
  });
  describe('#get without encryption', () => {
    it('should always return empty string', () => {
      cookie.set('test', 'sample',false,null);

      expect(cookie.get('test',false)).toEqual('');
      expect(cookie.get('sample',false)).toEqual('');
    });
  });
  describe('#get with encryption', () => {
    it('should always return empty string', () => {
      cookie.set('test', 'sample',true,"secret key");

      expect(cookie.get('test',true, "secret key")).toEqual('');
      expect(cookie.get('sample',true, "secret key")).toEqual('');
    });
  });
  describe('#getAll', () => {
    it('should always return empty object', () => {
      cookie.set('test', 'sample',false);

      expect(cookie.getAll()).toEqual({});
    });
  });
  describe(' without encryption', () => {
    it('should not set cookie', () => {
      cookie.set('test', 'sample',false);

      expect(documentCookieSetterSpy).not.toHaveBeenCalled();
    });
  });
  describe('#delete', () => {
    it('should not invoke set method to delete cookie', () => {
      cookie.delete('test');

      expect(documentCookieSetterSpy).not.toHaveBeenCalled();
    });
  });
  describe('#deleteAll', () => {
    it('should not invoke delete method', () => {
      cookie.deleteAll();

      expect(documentCookieSetterSpy).not.toHaveBeenCalled();
    });
  });
});
});