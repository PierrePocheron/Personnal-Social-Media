import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Person } from '@src/app/models/person.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private readonly apiUrl = 'http://localhost:8080/api/me';

  constructor(private http: HttpClient) {}

  getMe(): Observable<Person> {
    return this.http.get<Person>(this.apiUrl);
  }
}
