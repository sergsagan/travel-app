<script setup lang="ts">
const authStore = useAuthStore();

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div v-if="mounted">
    <div v-if="!authStore.loading && authStore.user" class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="btn m-1"
      >
        <div v-if="authStore.user.image" class="avatar">
          <div class="w-8 rounded-full">
            <img :src="authStore.user.image" :alt="authStore.user.name" width="40" height="40" class="w-10 h-10 rounded-full">
          </div>
        </div>
        {{ authStore.user.name }}
      </div>
      <ul tabindex="0" class="dropdown-content menu bg-base-200 rounded-box z-10 w-46 shadow-sm">
        <li>
          <NuxtLink to="/signOut">
            <Icon name="tabler:logout-2" size="24" />
            Sign out
          </NuxtLink>
        </li>
      </ul>
    </div>
    <button
      v-else
      :disabled="authStore.loading"
      class="btn btn-accent"
      @click="authStore.signIn"
    >
      Sign In with
      <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
      <Icon
        v-else
        name="tabler:brand-github"
        size="24"
      />
    </button>
  </div>
</template>
