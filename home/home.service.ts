import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }

  getUsers() {
    return this.http.get('/users')
      .map(res => res)
      .catch(err => Observable.throw(err));
  }
}
