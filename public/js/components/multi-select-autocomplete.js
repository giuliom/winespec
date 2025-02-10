export default function multiSelectAutocomplete() {
  return {
    query: '',
    items: ['Red', 'White', 'Rosé'],
    selected: [],
    filteredItems: [],
    isOpen: false,
    // Define your template as a property
    template: `
      <div class="tags" x-show="selected.length">
        <template x-for="(item, index) in selected" :key="index">
          <span class="tag">
            <span x-text="item"></span>
            <button type="button" @click="remove(index)">&times;</button>
          </span>
        </template>
      </div>
      <input
        type="text"
        x-model="query"
        @input="search()"
        @keydown.escape="isOpen = false"
        placeholder="Search..."
        class="w-full px-4 py-2 border rounded mt-2"
      />
      <div x-show="isOpen" @click.outside="isOpen = false" class="autocomplete-suggestions">
        <template x-for="(item, index) in filteredItems" :key="index">
          <div class="autocomplete-suggestion" x-text="item" @click="select(item)"></div>
        </template>
      </div>
    `,
    init() {
      // Inject our defined template into the element
      this.$el.insertAdjacentHTML('beforeend', this.template);
    },
    search() {
      if (this.query.length > 0) {
        this.filteredItems = this.items.filter(
          item =>
            item.toLowerCase().includes(this.query.toLowerCase()) &&
            !this.selected.includes(item)
        );
        this.isOpen = this.filteredItems.length > 0;
      } else {
        this.filteredItems = [];
        this.isOpen = false;
      }
    },
    select(item) {
      this.selected.push(item);
      this.query = '';
      this.filteredItems = [];
      this.isOpen = false;
    },
    remove(index) {
      this.selected.splice(index, 1);
    }
  };
}