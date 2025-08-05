import { Injectable } from '@angular/core';
import { Modal } from 'bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: { [key: string]: Modal } = {};

  registerModal(id: string, element: HTMLElement) {
    if (this.modals[id]) {
      this.modals[id].dispose(); // ✅ Dispose old instance if any
    }
    this.modals[id] = new Modal(element, {
      backdrop: 'static',
      keyboard: false
    });
  }

  showModal(id: string) {
    this.modals[id]?.show();
  }

  hideModal(id: string) {
    this.modals[id]?.hide();
  }

  isRegistered(id: string): boolean {
    return !!this.modals[id];
  }
}
