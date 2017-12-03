import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  checkUserExists(username: string): Promise<{'available': boolean}> {
    const dataToSend = {
      'username': username
    };

    return this.http.post('/api/user/check/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  signIn(username: string, password: string, captcha_key: string):
  Promise<{'success': boolean, 'error-code': number}> {
    const dataToSend = {
      'username': username,
      'password': password,
      'g-recaptcha-response': captcha_key
    };

    return this.http.post('/api/user/sign_in/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  signUp(username: string, email: string, password: string, captcha_key: string):
  Promise<{'success': boolean, 'error-code': number}> {
    const dataToSend = {
      'username': username,
      'email': email,
      'password': password,
      'g-recaptcha-response': captcha_key
    };

    return this.http.post('/api/user/sign_up/', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(UserService.handleError);
  }

  // TODO: Change this handleError
  private static handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }
}
