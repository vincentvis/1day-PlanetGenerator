<template>
  <div class="logo_wrap">
    <div class="logo">
      <video autoplay loop poster="../assets/logo-bg.png">
        <source src="../assets/logo-bg-loop.mp4" type="video/mp4" />
      </video>
      <img src="../assets/logo1.png" class="logo-overlay" />
    </div>
    <p class="links">
      <RouterLink to="/presentation">PRESENTATION</RouterLink>
      <RouterLink to="/generator">GENERATOR</RouterLink>
      <RouterLink to="/final">FINAL</RouterLink>
    </p>
  </div>
</template>

<style scoped>
.logo_wrap {
  width: 100vw;
  height: 100vh;
}
.logo {
  position: relative;
  top: 50%;
  transform: translateY(-60%);
}
.logo video {
  margin: 0 auto;
  display: block;
}
.logo-overlay {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.links {
  text-align: center;
  position: relative;
  padding-top: 4em;
}
.links a {
  padding: 1em;
}
</style>
