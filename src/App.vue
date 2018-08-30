<template>
  <v-app>
    <main-layout v-if="isInitialized" @logOut="resetApp()"></main-layout>
    <v-content v-else>
      <v-container fluid>
      <p>Lets initialize the app!</p>
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model="username"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          v-model="dbUrl"
          label="Database Url"
          required
        ></v-text-field>
        <v-btn :disabled="!valid" @click="saveData">Ready!</v-btn>
      </v-form>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import MainLayout from './components/layout/MainLayout.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    data() {
      return {
        valid: true,
        dbUrl: null,
        username: null
      }
    },
    methods: {
      saveData() {
        this.initializeApp({username: this.username, dbUrl: this.dbUrl});
      },
      ...mapActions({
        resetApp: 'resetApp',
        initializeApp: 'initializeApp'
      })
    },
    computed: {
      ...mapGetters({
        appSettings: 'appSettings'
      }),
      isInitialized() {
        return this.appSettings.dbUrl && this.appSettings.username;
      }
    },
    components: {
      mainLayout: MainLayout,
    }
  }
</script>
