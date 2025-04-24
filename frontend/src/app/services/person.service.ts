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

  getMainUser(): Observable<Person> {
    return this.http.get<Person>('http://localhost:8080/api/persons/main');
  }


  getMe(): Observable<Person> {
    return this.http.get<Person>(this.apiUrl);
  }

  getPersonById(id: string): Observable<Person> {
    return this.http.get<Person>(`http://localhost:8080/api/persons/${id}`);
  }

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>('http://localhost:8080/api/persons')
  }
}
