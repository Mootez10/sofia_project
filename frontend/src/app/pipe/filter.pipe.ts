import { Pipe, PipeTransform } from '@angular/core';

interface FilterableItem {
  displayName: string;
}

@Pipe({ name: 'appFilter', standalone: true, pure: true })
export class FilterPipe implements PipeTransform {
  transform(items: FilterableItem[], searchText: string): FilterableItem[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLocaleLowerCase();

    return items.filter((it) => {
      return it.displayName.toLocaleLowerCase().includes(searchText);
    });
  }
}
