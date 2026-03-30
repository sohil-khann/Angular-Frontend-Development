import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Needed for [(ngModel)] two-way binding in the template

/*
  Category is a UNION TYPE.
  This means category can be ONLY one of these values.
  It prevents invalid category strings like 'TV' or 'Camera'.
*/
type Category = 'All' | 'Laptop' | 'Mobile' | 'Accessories';

@Component({
  // Selector used in parent template like:
  // <app-product-filter></app-product-filter>
  selector: 'app-product-filter',

  // Standalone component (no NgModule needed)
  standalone: true,

  /*
    Imports used inside this component template:
    - FormsModule: enables [(ngModel)] for dropdown/input two-way binding
  */
  imports: [FormsModule],

  // HTML + CSS files for this component
  templateUrl: './product-filter.html',
  styleUrls: ['./product-filter.css']
})
export class ProductFilter {

  /*
    @Input() categories (Parent → Child)
    - Parent (StoreContainer) sends the category list
    - Example: [categories]="categories"
    - Used to populate the dropdown items
  */
  @Input() categories: Category[] = [];

  /*
    @Input() selectedCategory (Parent → Child)
    - Parent sends the currently selected category
    - Example: [selectedCategory]="selectedCategory"
    - This is bound to dropdown using [(ngModel)]
  */
  @Input() selectedCategory: Category = 'All';

  /*
    @Input() searchText (Parent → Child)
    - Parent sends current search text (if any)
    - Example: [searchText]="searchText"
    - This is bound to textbox using [(ngModel)]
  */
  @Input() searchText = '';

  /*
    @Output() filtersChanged (Child → Parent)
    - This is a custom event emitted to parent
    - It sends an object: { category, searchText }
    - Parent listens like: (filtersChanged)="onFiltersChanged($event)"
  */
  @Output() filtersChanged = new EventEmitter<{ category: Category; searchText: string }>();

  /*
    Called when user clicks "Reset"
    - Resets filter values to defaults
    - Then calls apply() to notify parent immediately
    - Parent will refresh the product grid based on default filters
  */
  reset() {
    this.selectedCategory = 'All'; // reset category
    this.searchText = '';          // reset search text
    this.apply();                  // notify parent with default values
  }

  /*
    Called when user clicks "Apply" (or when you want to apply filters)
    - Emits the current category and searchText to the parent
    - The child does NOT filter products itself
    - The parent (StoreContainer) does the filtering
  */
  apply() {
    this.filtersChanged.emit({
      category: this.selectedCategory,
      searchText: this.searchText
    });
  }
}