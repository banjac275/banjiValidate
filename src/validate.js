import materialize from './materialize'

class BanjiValidate {
  constructor(doc) {
    this.doc = doc;
    if(Object.keys(this.doc).length > 0) this.init()
    else console.log("error: doc empty")
  }
  init() {
    let keys = Object.getOwnPropertyNames(this.doc);
    //console.log(formInputs)
    keys.forEach(el => {
      let formInputs = document.forms[el].querySelectorAll("input");
      let ids = Object.getOwnPropertyNames(this.doc[el]);
      if (formInputs !== undefined && ids !== undefined) {
        ids.forEach((id, ind) => {
          let inputKeys = Object.getOwnPropertyNames(this.doc[el][id]);
          this.checkKeys(formInputs[ind], inputKeys, el, id);
        })
      }
    })
  }
  checkKeys(input, keys, element, index) {
    console.log(input, keys, element, index)
    for(let key in keys) {
      switch(keys[key]) {
        case "required":
          if (this.doc[element][index]["required"] === false) {
            input.required = false;
          } else {
            input.required = true; 
            input.style.borderBottom = "1px solid red";
            input.focus();
          }
          console.log(input);
          break;
      }
    }
  }
}

document.addEventListener("submit", (e) => {
  e.preventDefault();
  new BanjiValidate({
    "regular": {
      "firstName" : {
        "required": true,
        "minLength": true,
        "model": "",
        "invalid": true,
        "dirty": false,
        "anyDirty": false,
        "error": false,
        "anyError": false,
        "pending": false
      }
    }
  })
})
