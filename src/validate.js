import materialize from './materialize'

class BanjiValidate {
  constructor(doc) {
    this.doc = doc;
    this.inputs = null;
    if(Object.keys(this.doc).length > 0) this.init()
    else console.log("error: doc empty")
  }
  init() {
    let keys = Object.getOwnPropertyNames(this.doc);
    //console.log(formInputs)
    keys.forEach(el => {
      this.inputs = document.forms[el].querySelectorAll("input");      
      let ids = Object.getOwnPropertyNames(this.doc[el]);
      if (this.inputs !== undefined && ids !== undefined) {
        ids.forEach((id, ind) => {
          let inputKeys = Object.getOwnPropertyNames(this.doc[el][id]);
          this.checkKeys(this.inputs[ind], inputKeys, el, id);
        })
      }
    })
  }
  checkKeys(input, keys, element, index) {
    //console.log(input, keys, element, index)
    let inputType = input.type;
    for(let key in keys) {
      switch(keys[key]) {
        case "required":
          if (this.doc[element][index]["required"] === false && input.value !== "") {
            input.required = false;
            this.inputCheckFill(input, "", false);
          } else if (this.doc[element][index]["required"] === true && input.value === ""){
            input.required = true;
            this.inputCheckFill(input, "Please fill in this field", true); 
          }
          break;
        case "minLength":
        case "maxLength":
          if (this.doc[element][index]["minLength"] > 0 && input.value.length < this.doc[element][index]["minLength"] && this.doc[element][index]["minLength"] !== undefined){
            this.inputCheckFill(input, `Length of text less than ${this.doc[element][index]["minLength"]}`, true); 
          } else if(input.value.length > this.doc[element][index]["maxLength"] && this.doc[element][index]["maxLength"] !== undefined) {
            this.inputCheckFill(input, `Length of text larger than ${this.doc[element][index]["maxLength"]}`, true); 
          }
          break;
        case "emailValidation":
          if (this.doc[element][index]["emailValidation"] === true && inputType === "email"){
            let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            
            if (!filter.test(input.value)) {
              this.inputCheckFill(input, "Email not written in proper way, please use following notation: user@example.com", true);
            } 
          }
          break;
        case "checkWriting":
          if (this.doc[element][index]["checkWriting"] === true && inputType === "password"){
            let filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
            
            if (!filter.test(input.value)) {
              this.inputCheckFill(input, "Password not written in proper way, please use following notation: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character", true);
            } 
          }
          break;
        case "compareWith":
          if (this.doc[element][index]["compareWith"].length > 0 && inputType === "password" && input.value !== null){
            let el = document.getElementById(`#${this.doc[element][index]["compareWith"]}`);
            
            if (el !== input.value && el !== null || el === undefined) {
              this.inputCheckFill(input, "Password doesn\'t match. Please check password again", true);
            } 
          }
          break;
      }
    }
  }
  inputCheckFill(inp, message, check) {
    if (check) {
      inp.classList.remove("input--ok");
      inp.classList.add("input--err");
      inp.parentNode.children[1].style.color = "red";
      inp.setCustomValidity(message)
      inp.focus();
    } else {
      inp.classList.add("input--ok");
      inp.classList.remove("input--err");
      inp.parentNode.children[1].style.color = "#26a69a";
    }
  }
}

document.querySelector("#submitted").addEventListener("click", () => {
  new BanjiValidate({
    "regular": {
      "firstName" : {
        "required": false,
        "minLength": 6,
        "maxLength": 30
      },
      "lastName" : {
        "required": true,
        "minLength": 4,
        
      },
      "email" : {
        "required": true,
        "emailValidation": true
      },
      "password" : {
        "required": true,
        "minLength": 8,
        "checkWriting": true
      },
      "confirmPassword" : {
        "required": true,
        "minLength": 8,
        "compareWith": "password"
      }
    }
  })
})
