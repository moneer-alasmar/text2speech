// INIT SPEECH SYNTH API
const synth = window.speechSynthesis;

// DOM ELEMENTS
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// INIT VOICES ARRAY
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // LOOP THROUGH VOICES AND CREATE OPTIPON FOR EACH VOICE
  voices.forEach(voice => {
    // CREATE OPTION ELEMENT
    const option = document.createElement('option');

    // FILL OPTION WITH VOICE
    option.textContent = voice.name + '('+ voice.lang +')';

    // SET NEEDED OPTION ATTRIBUTES
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();

if(synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// SPEAK
const speak = () => {
  // CHECK IF SPEAKING
  if(synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if(textInput.value !== '') {
    // ADD CUSTOM BACKGROUND ANIMATION
    body.style.background = '#141414 url(img/wave.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';

    // GET SPEAK TEXT
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // SPEAK END
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#141414';
    }

    // SPEAK ERROR
    speakText.onerror = e => {
      console.error('Something went wrong');
    }

    // SELECTED VOICE
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

    // LOOP THROUGH VOICES
    voices.forEach(voice => {
      if(voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // SET PITCH AND RATE
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // SPEAK
    synth.speak(speakText);
  }
};

// (EVENT LISTENERS)

// TEXT FORM SUBMIT
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// RATE VALUE CHANGE
rate.addEventListener('change', e => rateValue.textContent = rate.value);
// PITCH VALUE CHANGE
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value);
// VOICE SELECT CHANGE
voiceSelect.addEventListener('change', e => speak());
