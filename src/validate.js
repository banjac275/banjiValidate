import materialize from './materialize'
import { BanjiValidate2 } from './validate2';

class BanjiValidate {
  constructor(doc) {
    this.doc = doc;
    this.inputs = [];
    this.ids = null;
    this.okClass = "input--ok";
    this.errClass = "input--err"; 
    if(Object.keys(this.doc).length > 0) this.init()
    else console.log("error: doc empty")
  }
  init() {
    let keys = Object.getOwnPropertyNames(this.doc.forms);
    keys.forEach(el => {    
      this.ids = Object.getOwnPropertyNames(this.doc.forms[el]);
      if (this.ids !== undefined) {
        this.ids.forEach((id, ind) => {
          let input = document.querySelector("#" + this.ids[ind]);
          this.inputs.push(input);
          (this.doc.forms[el][id]["dirty"] === undefined) ? this.doc.forms[el][id]["dirty"] = false : this.doc.forms[el][id]["dirty"] = true;
          let inputKeys = Object.getOwnPropertyNames(this.doc.forms[el][id]);
          this.checkKeys(input, inputKeys, el, id);
        })
        this.keyPressControl(el);
      }
    })
    let options = Object.getOwnPropertyNames(this.doc.options);
    if(options.length > 0 || options !== null || options !== undefined) {
      options.forEach(el => {
        switch(el) {
          case "customClassOk":
            if (this.doc.options["customClassOk"].length > 0){
              this.okClass = this.doc.options["customClassOk"];
              this.inputs.forEach(inp => {
                if (inp.classList.contains("input--ok")) {
                  inp.classList.remove("input--ok");
                  inp.classList.add(this.okClass);
                }
              })
            }
            break;
          case "customClassError":
            if (this.doc.options["customClassError"].length > 0){
              this.errClass = this.doc.options["customClassError"];
              this.inputs.forEach(inp => {
                if (inp.classList.contains("input--err")) {
                  inp.classList.remove("input--err");
                  inp.classList.add(this.errClass);
                }
              })
            } 
            break;
        }
      })
    }
  }
  checkKeys(input, keys, element, index) {
    let message = "";
    let messageCheck = false;
    let inputType = input.type;
    for(let key in keys) {
      if(input.value !== null) {
        switch(keys[key]) {
          case "required":
            if (this.doc.forms[element][index]["required"] === false && input.value !== "") {
              input.required = false;
            } else if (this.doc.forms[element][index]["required"] === true && input.value === ""){
              input.required = true; 
            if(messageCheck === false) message = "Please fill this field";
            }
            break;
          case "minLength":
          case "maxLength":
            if (this.doc.forms[element][index]["minLength"] > 0 && input.value.length < this.doc.forms[element][index]["minLength"] && this.doc.forms[element][index]["minLength"] !== undefined && inputType !== "date"){
              if(messageCheck === false) message = `Length of text less than ${this.doc.forms[element][index]["minLength"]}`;          
            } else if(input.value.length > this.doc.forms[element][index]["maxLength"] && this.doc.forms[element][index]["maxLength"] !== undefined && inputType !== "date") {
              if(messageCheck === false) message = `Length of text larger than ${this.doc.forms[element][index]["maxLength"]}`;
            }
            break;
          case "emailValidation":
            if (this.doc.forms[element][index]["emailValidation"] === true && inputType === "email"){
              let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
              
              if (!filter.test(input.value)) {
                if(messageCheck === false) message = "Email not written in proper way, please use following notation: user@example.com";
              } 
            }
            break;
          case "checkWriting":
            if (this.doc.forms[element][index]["checkWriting"] === true && inputType === "password"){
              let filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
              
              if (!filter.test(input.value)) {
                if(messageCheck === false) message = "Password not written in proper way, please use following notation: " +
                "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
              } 
            }
            break;
          case "compareWith":
            if (this.doc.forms[element][index]["compareWith"].length > 0 && inputType === "password"){
              let id = "#" + this.doc.forms[element][index]["compareWith"];
              let el = document.querySelector(id);
              
              if (el.value !== input.value && el !== null || el === undefined) {
                if(messageCheck === false) message = "Password doesn\'t match. Please check password again";
              } else if(el === null) message = "Password is impropper.";
            }
            break;
          case "minVal":
          case "maxVal":
            if(input.value < this.doc.forms[element][index]["minVal"] && inputType === "number") message = `Number mustn\'t be under ${this.doc.forms[element][index]["minVal"]}`;
            else if(input.value > this.doc.forms[element][index]["maxVal"] && inputType === "number") message = `Number mustn\'t be above ${this.doc.forms[element][index]["maxVal"]}`;
            else message = "";
            break;
          case "dirty":
            if(this.doc.forms[element][index]["dirty"] === false) {
              ["keyup", "focus", "click"].forEach(ev => {
                input.addEventListener(ev, () => {
                  if(message !== "") this.doc.forms[element][index]["dirty"] = true;
                })
              })
            }
            break;
        }
      }
      if(message !== "" && this.doc.forms[element][index]["dirty"]) messageCheck = true;
    }
    (messageCheck === true) ? this.inputCheckFill(input, message, true) : this.inputCheckFill(input, message, false);
  }
  inputCheckFill(inp, message, check) {
    let notificationContainer = inp.parentNode.children;
    if (check) {
      inp.classList.remove(this.okClass);
      inp.classList.add(this.errClass);
      inp.parentNode.children[2].style.color = "red";
      notificationContainer[1].innerHTML = message; 
      inp.focus();
    } else {
      inp.classList.add(this.okClass);
      inp.classList.remove(this.errClass);
      inp.parentNode.children[2].style.color = "#26a69a";
      notificationContainer[1].innerHTML = "";
    }
  }
  keyPressControl(element) {
    if (this.inputs.length > 0 && this.ids !== undefined) {
      this.ids.forEach((id, ind) => {
        if(this.inputs[ind].type === "number") {
          this.inputs[ind].addEventListener("change", () => {
            let inputKeys = Object.getOwnPropertyNames(this.doc.forms[element][id]);
            this.checkKeys(this.inputs[ind], inputKeys, element, id);
          })
        } 
        this.inputs[ind].addEventListener("keyup", () => {
          let inputKeys = Object.getOwnPropertyNames(this.doc.forms[element][id]);
          this.checkKeys(this.inputs[ind], inputKeys, element, id);
        })
      })
    }
  }
}//initialization
let validated = new BanjiValidate2({
  "form": {
    "regular": {
      "firstName" : {
        "required": true,
        "minLength": 6,
        "maxLength": 30
      },
      "lastName" : {
        "required": true,
        "minLength": 4
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
      },
      "date" : {
        "required": false
      },
      "numbers" : {
        "required": true,
        "minVal": 1,
        "maxVal": 15
      }
    }
  },
  "options": {
    "customClassOk": "input--ok-custom",
    "customClassError": "input--err-custom",
    "handleErrors": false
  }    
})

document.querySelector("#submitted").addEventListener("click", () => {
  validated.init()
  console.log(validated.returnResults())
})
