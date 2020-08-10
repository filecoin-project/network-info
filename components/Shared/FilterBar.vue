<template>
  <div class="filter-bar">

    <input
      :value="filterValue"
      type="text"
      placeholder="Search"
      class="input"
      @input="$emit('setFilterValue', $event.target.value)"
      @focus="$emit('filterBarFocused')">

  </div>
</template>

<script>
// ====================================================================== Export
export default {
  name: 'FilterBar',

  props: {
    filterValue: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-bar {
  flex: 1;
  width: 100;
  background-color: white;
  border-radius: 0.5rem;
  margin-right: 1rem;
  max-width: 20rem;
  border: 1px solid $silver;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
}
</style>
