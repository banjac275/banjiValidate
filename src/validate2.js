export class BanjiValidate2 {
    constructor(doc) {
      this.doc = doc;
      this.inputs = [];
      this.ids = [];
      this.okClass = "input--ok";
      this.errClass = "input--err"; 
      this.results = {};
      if(Object.keys(this.doc).length > 0) this.init()
      else console.log("error: doc empty")
    }
    init() {
      let keys = Object.getOwnPropertyNames(this.doc.form);
      keys.forEach(el => {    
        this.ids = Object.getOwnPropertyNames(this.doc.form[el]);
        if (this.ids.length > 0) {
          this.ids.forEach((id, ind) => {
            let input = document.querySelector("#" + this.ids[ind]);
            this.inputs.push(input);
            let inputKeys = Object.getOwnPropertyNames(this.doc.form[el][id]);
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
      if(!this.results.hasOwnProperty(input.id)) this.results[input.id] = {};
      let inputType = input.type;
      for(let key in keys) {
        if(input.value !== null) {
          switch(keys[key]) {
            case "required":
              (!this.doc.form[element][index]["required"]) ? input.required = false : input.required = true; 
              if(messageCheck === false && input.required && input.value.length < 1)
              {
                message = "Please fill this field";
                this.results[input.id].required = { fulfilled: false };
              } else this.results[input.id].required = { fulfilled: true };
              break;
            case "minLength":
              if(inputType !== "date") {
                if (this.doc.form[element][index]["minLength"] > 0 && input.value.length < this.doc.form[element][index]["minLength"]){
                    if(messageCheck === false) message = `Length of text less than ${this.doc.form[element][index]["minLength"]}`;       
                    this.results[input.id].minLength = { fulfilled: false };   
                } else this.results[input.id].minLength = { fulfilled: true };
              }
              break;
            case "maxLength":
              if(inputType !== "date") {
                if(input.value.length > this.doc.form[element][index]["maxLength"]) {
                    if(messageCheck === false) message = `Length of text larger than ${this.doc.form[element][index]["maxLength"]}`;
                    this.results[input.id].maxLength = { fulfilled: false };
                } else this.results[input.id].maxLength = { fulfilled: true };
              }
              break;
            case "emailValidation":
              if (this.doc.form[element][index]["emailValidation"] && inputType === "email"){
                let filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                
                if (!filter.test(input.value)) {
                  if(messageCheck === false) message = "Email not written in proper way, please use following notation: user@example.com";
                  this.results[input.id].emailValidation = { fulfilled: false };
                } else this.results[input.id].emailValidation = { fulfilled: true };
              }
              break;
            case "checkWriting":
              if (this.doc.form[element][index]["checkWriting"] === true && inputType === "password"){
                let filter = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
                
                if (!filter.test(input.value)) {
                  if(messageCheck === false) message = "Password not written in proper way, please use following notation: " +
                  "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character";
                  this.results[input.id].checkWriting = { fulfilled: false };
                } else this.results[input.id].checkWriting = { fulfilled: true };
              }
              break;
            case "compareWith":
              if (this.doc.form[element][index]["compareWith"].length > 0 && inputType === "password"){
                let id = "#" + this.doc.form[element][index]["compareWith"];
                let el = document.querySelector(id);
                
                if (el.value !== input.value && el !== null || el === undefined) {
                  if(messageCheck === false) message = "Password doesn\'t match. Please check password again";
                  this.results[input.id].compareWith = { fulfilled: false };
                } else if(el === null) {
                  message = "Password is impropper.";
                  this.results[input.id].compareWith = { fulfilled: false };
                } else this.results[input.id].compareWith = { fulfilled: true };
              }
              break;
            case "minVal":
              if(input.value < this.doc.form[element][index]["minVal"] && inputType === "number") {
                message = `Number mustn\'t be under ${this.doc.form[element][index]["minVal"]}`;
                this.results[input.id].minVal = { fulfilled: false };
              }
              else this.results[input.id].minVal = { fulfilled: true };
              break;
            case "maxVal":
              if(input.value > this.doc.form[element][index]["maxVal"] && inputType === "number") {
                message = `Number mustn\'t be above ${this.doc.form[element][index]["maxVal"]}`;
                this.results[input.id].maxVal = { fulfilled: false };
              }
              else this.results[input.id].maxVal = { fulfilled: true };
              break;
          }
          (input.value.length > 0) ? this.results[input.id][keys[key]].dirty = true : this.results[input.id][keys[key]].dirty = false;
        }
        if(message !== "") messageCheck = true;
      }
      (messageCheck === true && this.doc.options["handleErrors"]) ? this.inputCheckFill(input, message, true) : this.inputCheckFill(input, message, false);
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
      if (this.inputs.length > 0 && this.ids.length > 0) {
        this.ids.forEach((id, ind) => {
          this.inputs[ind].addEventListener("change", () => {
            let inputKeys = Object.getOwnPropertyNames(this.doc.form[element][id]);
            this.checkKeys(this.inputs[ind], inputKeys, element, id);
          })
        
        })
      }
    }
    returnResults() {
        return this.results;
    }
  }