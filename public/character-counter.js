export default function countCharacters() {
    // window.onscroll = () => {
        charcountupdate()
  }


function charcountupdate() {
	
    const maxCharacterMessage = document.getElementById("max-character-message")
    const textBoxEl = document.getElementById("message")
    const textBoxTextContent = textBoxEl.value
    console.log(maxCharacterMessage);
    console.log(textBoxTextContent);
    let lng = textBoxEl.value.length
    textBoxEl.addEventListener("keyup", function() {
        let textBoxTextContent = textBoxEl.value
        let lng = textBoxEl.value.length
        maxCharacterMessage.textContent = lng + " of 1,000 characters"
        console.log(textBoxTextContent);
        console.log(lng);
    })
	// document.getElementById("max-character-message").innerHTML = lng + ' out of 1000 characters';
    // console.log("Here");
}

countCharacters()