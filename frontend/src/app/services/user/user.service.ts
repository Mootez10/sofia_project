import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/users/${id}`);
  }

  // (optional) add other user APIs here (getUsers, createUser, etc.)
}
