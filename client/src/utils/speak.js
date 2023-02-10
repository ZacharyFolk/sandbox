var synth = window.speechSynthesis;
var voices = synth.getVoices();

// the voices array is populated asynchronously, so it's possible that the voices array may not be available immediately when you retrieve it.
// You can check for the voiceschanged event to make sure that the voices have been fully loaded before you try to use them
synth.onvoiceschanged = function () {
  voices = synth.getVoices();
};

/**
 * Speaks whatever text is passed with optional parameters to control pitch,
 * rate, volume, and type of voice.  Note: volume defaults to 0.
 *
 * @param { string } text - The plain text to speak: *Required
 * @param { number } pitch - Value from 0-2: default=1
 * @param { number } rate - Value from 0.1-2: default=1
 * @param {number} volume - Value from 0-1: default=0
 * @param {number} voice - Value for index SpeechSynthesisVoice array from 0-21 : default=0
 * @returns {object} speech.voice - Object contains name and language data
 */
function say(text, pitch = 1, rate = 1, volume = 0, voice = 0) {
  if (volume === 0) return;
  if (synth.speaking) {
    synth.pause();
    synth.cancel();
  }
  let spokenText = text;
  if (Array.isArray(spokenText)) {
    spokenText = spokenText.join('.');
  }
  let speech = new SpeechSynthesisUtterance(spokenText);
  speech.voice = voices[voice];
  speech.pitch = pitch;
  speech.rate = rate;
  speech.volume = volume;
  speech.lang = 'en-US';
  synth.speak(speech);

  console.log('say function, voice:', voice);
  return speech;
}

function stopSpeaking() {
  console.log('stop talking');
  if (synth) {
    console.log('synth');
    synth.pause();
    synth.cancel();
  }
}

export { stopSpeaking };
export default say;
