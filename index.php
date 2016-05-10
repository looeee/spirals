<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="3D Playground">

    <title>3D Playground</title>

    <link rel="icon" type="image/png" href="favicon.png" />
    <link rel="stylesheet" type="text/css" href="styles/main.css" />
    <!--
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,700,900' rel='stylesheet' type='text/css'>
    <script src="//cdn.jsdelivr.net/lodash/4.6.1/lodash.min.js"></script>
    <script src="node_modules/whatwg-fetch/fetch.js"></script>
    -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/TweenMax.min.js"></script>
    <script src="node_modules/three/three.js"></script>
    <script src="scripts/vendor/stats.min.js"></script>


  </head>

  <body>
    <div id="title">
      <h1></h1>
    </div>

    <canvas id="canvas" class="fullscreen"></canvas>

  </body>

  <script src="scripts/main.js"></script>

</html>
