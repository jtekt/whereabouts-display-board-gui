<template>
  <div class="login_view">

    <div
      class="status_message"
      v-if="$store.state.authenticating">
      <div class="loader"/>
    </div>

    <form
      class="login_form"
      v-else-if="!$store.state.user"
      v-on:submit.prevent="login()">

      <div v-if="unauthorized_message" class="unauthorized_message">
        {{unauthorized_message}}
      </div>

      <input type="text" v-model="credentials.email" placeholder="e-mail address">
      <input type="password" v-model="credentials.password" placeholder="password">
      <input type="submit" value="login">
      <div class="info">
        デフォルトのパスワード：社員番号<br>
        （最初の００あってもなくても）
      </div>

    </form>
    <form
      class="login_form"
      v-else
      v-on:submit.prevent="logout()">

      <div class="">
        Logged in as: {{$store.state.user.name_kanji}}
      </div>

      <input type="submit" value="logout">

    </form>

    <!-- overlay to show connection problems -->
    <DisconnectionWarning/>

  </div>
</template>

<script>
import DisconnectionWarning from '@/components/DisconnectionWarning.vue'

export default {
  name: 'Login',
  components: {
    DisconnectionWarning
  },
  data(){
    return {
      credentials: {
        email: "",
        password: "",

      },

      unauthorized_message: "",
    }
  },
  mounted(){

  },
  sockets: {
    unauthorized(data) {
      console.log("unauthorized")
      this.unauthorized_message = data;

    },
  },
  methods: {
    login(){
      this.unauthorized_message = ""
      this.$socket.client.emit('credentials_authentication', {
        credentials: {
          email: this.credentials.email,
          password: this.credentials.password,
        }
      } )
    },
    logout(){
      this.unauthorized_message = "";
      this.$socket.client.emit('logout', {})
    },
  }
}
</script>

<style scoped>
form {
  margin: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}



form > * {
  margin: 20px;
  padding: 5px;
  width: 50vw;
  max-width: 300px;
  height: 40px;

  /* layout of content */
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}


input[type="text"], input[type="password"]{
  outline: none;
  border: none;
  color: #444444;
  border-bottom: 2px solid #666666;
  transition: border-color 0.25s;
}

input[type="text"]:focus, input[type="password"]:focus{
  border-bottom: 2px solid #c00000;
}

input[type="submit"]{
  border: 2px solid #666666;
  color: #444444;
  background-color: white;
  cursor: pointer;

  transition:
    border-color 0.25s,
    background-color 0.25s,
    color 0.25s;
}

input[type="submit"]:hover{
  border-color: #c00000;
  color: #c00000;
}

input[type="submit"]:active{
  background-color: #c00000;
  color: white;
}

.status_message {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 25px;
  font-size: 120%;
}

.unauthorized_message {
  color: #c00000;
}

</style>
