import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private baseUrl = `${environment.apiUrl}/api/roles`;
  private http = inject(HttpClient);

  createRole(role: { name: string; description: string; actions: string[] }) {
    return this.http.post(this.baseUrl, role);
  }

  getRoles() {
    return this.http.get(this.baseUrl);
  }

  // ✅ Get single role by ID
  getRoleById(id: string) {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // ✅ Update role
  updateRole(id: string, updatedRole: { name: string; description: string; actions: string[] }) {
    return this.http.put(`${this.baseUrl}/${id}`, updatedRole);
  }

  // ✅ Delete role
  deleteRole(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /**
 * Fetches the list of actions assigned to a specific role.
 *
 * @param id - The unique identifier of the role (string).
 *             This ID is used to request the actions linked to the given role from the backend.
 *
 * 
 * */

  getRoleWithActions(id: string) {
    return this.http.get(`${environment.apiUrl}/api/roles/${id}/actions`);
  }
}

