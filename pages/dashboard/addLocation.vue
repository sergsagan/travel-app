<script setup lang="ts">

</script>

<template>
  <div class="container max-w-md mx-auto">
    <div class="my-4">
      <h1 class="text-lg">Add Location</h1>
      <p class="text-sm">
        A location is a place you have traveled or will travel to. It can be a city, country, state or point of interest. You can add specific times you visited this location after adding it.
      </p>
    </div>
    <form class="flex flex-col gap-1">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Location Name</legend>
        <input type="text" name="name" class="input w-full">
        <p class="fieldset-label"></p>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Description</legend>
        <textarea type="text" name="description" class="textarea w-full"/>
        <p class="fieldset-label"></p>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Latitude</legend>
        <input type="number" name="lat" class="input w-full">
        <p class="fieldset-label"></p>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Longitude</legend>
        <input type="number" name="long" class="input w-full">
        <p class="fieldset-label"></p>
      </fieldset>
      <div class="flex justify-end gap-2">
        <button type="button" class="btn btn-outline min-w-27.5"><Icon name="tabler:arrow-left" size="24" />Cansel</button>
        <button type="submit" class="btn btn-primary min-w-27.5">Add <Icon name="tabler:circle-plus-filled" size="24" /></button>
      </div>
    </form>
  </div>
</template>
