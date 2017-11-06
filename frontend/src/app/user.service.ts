import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  signUp(username: string, password: string, password_check: string, captcha_key: string):
  Promise<{'success': boolean, 'error-code': number}> {
    const dataToSend = {
      'username': username,
      'password': password,
      'password_check': password_check,
      'g-recaptcha-response': captcha_key
    };

    return this.http.post('/api/signup', JSON.stringify(dataToSend), {headers: this.headers})
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  // TODO: Change this handleError
  handleError(error: any): Promise<any> {
    console.error(error.message);
    return Promise.reject(error.message);
  }
}
