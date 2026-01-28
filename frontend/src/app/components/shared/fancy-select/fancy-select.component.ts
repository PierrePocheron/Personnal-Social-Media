import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type FancySelectOption = {
  label: string;
  value: string;
  subtitle?: string;
};

@Component({
  selector: 'app-fancy-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fancy-select.component.html',
  styleUrls: ['./fancy-select.component.scss'],
})
export class FancySelectComponent {
  @Input() options: FancySelectOption[] = [];
  @Input() placeholder = 'Sélectionner...';
  @Input() disabled = false;

  @Input() model!: string;
  @Output() modelChange = new EventEmitter<string>();

  search = '';
  dropdownOpen = false;
  highlightedIndex = 0;

  get filteredOptions(): FancySelectOption[] {
    const searchLower = this.search.toLowerCase();
    return this.options.filter(opt =>
      opt.label.toLowerCase().includes(searchLower)
    );
  }

  get selectedLabel(): string {
    const found = this.options.find(opt => opt.value === this.model);
    return found?.label ?? this.placeholder;
  }

  toggleDropdown() {
    if (this.disabled) return;
    this.dropdownOpen = !this.dropdownOpen;
    this.highlightedIndex = 0;
    this.search = '';
  }

  select(value: string) {
    this.model = value;
    this.modelChange.emit(value);
    this.dropdownOpen = false;
  }

  handleKeydown(event: KeyboardEvent) {
    const total = this.filteredOptions.length;

    if (event.key === 'ArrowDown') {
      this.highlightedIndex = (this.highlightedIndex + 1) % total;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = (this.highlightedIndex - 1 + total) % total;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      const selected = this.filteredOptions[this.highlightedIndex];
      if (selected) {
        this.select(selected.value);
      }
      event.preventDefault();
    } else if (event.key === 'Escape') {
      this.dropdownOpen = false;
      event.preventDefault();
    }
  }
}
