<template>
  <form class="login_form" v-on:submit.prevent="$emit('login',credentials)">
    <input type="text" v-model="credentials.email" placeholder="e-mail address">
    <input type="password" v-model="credentials.password" placeholder="password">
    <input type="submit" value="login">
    <div class="info">
        デフォルトのパスワード：社員番号<br>（最初の００あってもなくても）
      </div>
  </form>
</template>

<script>
export default {
  name: 'LoginForm',
  data(){
    return {
      credentials: {
        email: "",
        password: "",
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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

</style>
