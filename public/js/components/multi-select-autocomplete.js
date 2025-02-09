export default function multiSelectAutocomplete() {
    return {
      query: '',
      items: ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Grapes', 'Strawberry'],
      selected: [],
      filteredItems: [],
      isOpen: false,
    
      search() {
        if (this.query.length > 0) {
          this.filteredItems = this.items.filter(item =>
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