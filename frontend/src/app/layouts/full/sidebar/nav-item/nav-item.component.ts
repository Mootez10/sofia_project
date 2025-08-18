import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  inject
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavItem } from './nav-item';
import { NavService } from 'src/app/services/nav.service';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, TranslateModule, TablerIconsModule, MaterialModule],
  templateUrl: './nav-item.component.html',
  styleUrls: [],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('150ms ease')),
    ]),
  ],
})
export class AppNavItemComponent implements OnChanges {
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() item!: NavItem;
  @Input() depth = 0;

  expanded = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;

  public navService = inject(NavService);
  public router = inject(Router);
  private translateservice = inject(TranslateService);

  ngOnChanges() {
    const url = this.navService.currentUrl?.() ?? this.router.url;
    if (this.item?.route && url) {
      this.expanded = url.indexOf(`${this.item.route}`) === 0;
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (item.route) this.router.navigate([item.route]);
    } else {
      this.expanded = !this.expanded;
    }

    window.scroll({ top: 0, left: 0, behavior: 'smooth' });

    if (!this.expanded && window.innerWidth < 1024) {
      this.notify.emit();
    }
  }

  openExternalLink(url?: string): void {
    if (url) window.open(url, '_blank');
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (this.expanded && window.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}
