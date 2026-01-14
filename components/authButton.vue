<script setup lang="ts">
import { createAuthClient } from "better-auth/client"
const authClient =  createAuthClient()

async function signIn() {
  await authClient.signIn.social({
    provider: 'github',
    callbackURL: '/dashboard',
  })
}
</script>

<template>
  <button @click="signIn" class="btn btn-accent">
    Sign In with
    <Icon name="tabler:brand-github" size="24" />
  </button>
</template>
