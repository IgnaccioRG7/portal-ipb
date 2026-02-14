<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 - Página no encontrada</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-100 flex items-center justify-center min-h-screen dark:bg-gray-800">
  <div class="text-center flex flex-col justify-center items-center -translate-y-14">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
      <style>
        @keyframes lookAround {

          0%,
          100% {
            transform: translateX(0);
          }

          25% {
            transform: translateX(-0px);
          }

          50% {
            transform: translateX(0px);
          }

          75% {
            transform: translateX(-0px);
          }
        }

        @keyframes blinkEyes {

          0%,
          90%,
          100% {
            opacity: 1;
          }

          95% {
            opacity: 0;
          }
        }

        @keyframes wiggleEarLeft {

          0%,
          100% {
            transform: rotate(-10deg);
          }

          50% {
            transform: rotate(-20deg);
          }
        }

        @keyframes wiggleEarRight {

          0%,
          100% {
            transform: rotate(10deg);
          }

          50% {
            transform: rotate(20deg);
          }
        }

        @keyframes wiggleTail {

          0%,
          100% {
            d: path("M 60 135 Q 40 140, 30 150 Q 20 160, 25 170");
          }

          50% {
            d: path("M 60 135 Q 45 135, 35 145 Q 25 155, 28 170");
          }
        }

        @keyframes questionMark {

          0%,
          100% {
            transform: translateY(0px);
            opacity: 0.7;
          }

          50% {
            transform: translateY(-3px);
            opacity: 0.9;
          }
        }

        .mouse-body {
          animation: lookAround 3s ease-in-out infinite;
          transform-origin: center;
        }

        .eye {
          animation: blinkEyes 3s ease-in-out infinite;
        }

        .ear-left {
          animation: wiggleEarLeft 1.5s ease-in-out infinite;
          transform-origin: 80px 73px;
        }

        .ear-right {
          animation: wiggleEarRight 1.5s ease-in-out infinite;
          transform-origin: 120px 73px;
        }

        .tail {
          animation: wiggleTail 2s ease-in-out infinite;
        }

        .question {
          animation: questionMark 2s ease-in-out infinite;
          transform-origin: center;
        }
      </style>

      <!-- Tail -->
      <path class="tail" d="M 60 135 Q 40 140, 30 150 Q 20 160, 25 170"
        fill="none" stroke="#8B7355" stroke-width="3" stroke-linecap="round" />

      <!-- Mouse Body Group -->
      <g class="mouse-body">
        <!-- Body -->
        <ellipse cx="100" cy="120" rx="45" ry="35" fill="#A0826D" />

        <!-- Head -->
        <circle cx="100" cy="85" r="30" fill="#A0826D" />

        <!-- Ears -->
        <g class="ear-left">
          <ellipse cx="80" cy="65" rx="12" ry="18" fill="#A0826D" />
          <ellipse cx="80" cy="65" rx="7" ry="12" fill="#D4A5A5" />
        </g>

        <g class="ear-right">
          <ellipse cx="120" cy="65" rx="12" ry="18" fill="#A0826D" />
          <ellipse cx="120" cy="65" rx="7" ry="12" fill="#D4A5A5" />
        </g>

        <!-- Snout -->
        <ellipse cx="100" cy="95" rx="15" ry="12" fill="#8B7355" />

        <!-- Nose -->
        <ellipse cx="100" cy="92" rx="4" ry="3" fill="#4A4A4A" />

        <!-- Eyes -->
        <g class="eye">
          <circle cx="90" cy="80" r="4" fill="#2C2C2C" />
          <circle cx="110" cy="80" r="4" fill="#2C2C2C" />
          <circle cx="91" cy="79" r="1.5" fill="#FFFFFF" />
          <circle cx="111" cy="79" r="1.5" fill="#FFFFFF" />
        </g>

        <!-- Whiskers -->
        <line x1="70" y1="88" x2="50" y2="85" stroke="#4A4A4A" stroke-width="1" />
        <line x1="70" y1="92" x2="48" y2="92" stroke="#4A4A4A" stroke-width="1" />
        <line x1="70" y1="96" x2="50" y2="99" stroke="#4A4A4A" stroke-width="1" />

        <line x1="130" y1="88" x2="150" y2="85" stroke="#4A4A4A" stroke-width="1" />
        <line x1="130" y1="92" x2="152" y2="92" stroke="#4A4A4A" stroke-width="1" />
        <line x1="130" y1="96" x2="150" y2="99" stroke="#4A4A4A" stroke-width="1" />

        <!-- Front Paws -->
        <ellipse cx="80" cy="145" rx="8" ry="10" fill="#8B7355" />
        <ellipse cx="120" cy="145" rx="8" ry="10" fill="#8B7355" />
      </g>

      <!-- Question Mark (confused expression) -->
      <g class="question">
        <text x="145" y="70" font-family="Arial, sans-serif" font-size="35" fill="#6B5B4D" font-weight="bold">?</text>
      </g>
    </svg>
    <p class="text-xl text-gray-600 mb-4 dark:text-gray-300 font-light">La página que buscabas no esta disponible</p>
    <a href="{{ route('dashboard') }}" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 uppercase font-semibold">
      Volver al inicio
    </a>
  </div>
</body>

</html>