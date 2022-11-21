let keys = [
  new Audio('./sounds/key1.mp3'),
  new Audio('./sounds/key2.mp3'),
  new Audio('./sounds/key3.mp3'),
  new Audio('./sounds/key4.mp3'),
];

function typeSound() {
  let i = Math.floor(Math.random() * keys.length);
  console.log(keys[i]);
  keys[i].currentTime = 0;
  keys[i].play();
}

export { typeSound };
