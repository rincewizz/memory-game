"use strict";

const icons = [
  "android",
  "angular",
  "c-plusplus",
  "chrome",
  "copyleft-pirate",
  "css-3",
  "docker",
  "firefox",
  "freebsd",
  "github-octocat",
  "github",
  "gnu",
  "gopher",
  "gulp",
  "html-5",
  "javascript",
  "kotlin",
  "linux-tux",
  "nodejs",
  "opensource",
  "python",
  "react",
  "sublimetext",
  "vue",
  "webpack"];

function Card(id){
  this.id=id;
  this.opened= false;
  this.createEl = function(wrap){
    this.el=document.createElement("div");
    this.el.classList.add("game__card", "card");
    this.el.card=this;
    this.el.innerHTML=`
      <div class="card__back"><img src="img/dev.svg" alt=""></div>
      <div class="card__front"><img src="img/${this.id}.svg" alt=""></div>
    `; 
    // this.eventOpened = new CustomEvent("opened");
    // this.el.addEventListener("click", () => {this.flip()} );
  };
  this.getEl = function(){
    if(!this.el) this.createEl();
    return this.el;
  };
  this.flip = function(){
    this.el.classList.toggle("card--flipped");
    this.opened=!this.opened;
    if (this.opened) {
      // this.el.dispatchEvent(this.eventOpened);
    }
  };
  this.open = function(){
    if(!this.opened) this.flip();
  };
  this.close = function(){
    if(this.opened) this.flip();
  };

}

let game = {
  cards: [],
  rootElement: null,
  gameElement: null,
  match : [],
  start({selector=".game"}){
    this.rootElement = document.querySelector(selector);
    this.generateCard();
    this.render();
  },
  generateCard(){
    this.cards=[];    
    let set = new Set();

    while(set.size < 12){
      let icon = icons[Math.floor(Math.random() * icons.length)];
      set.add( icon );
    }

    let arrCard = Array.from(set).map(val => {return {name:val, count: 2} } );

    for (let i=0; i<24; i++){
      let index = Math.floor(Math.random() * arrCard.length);

      this.cards.push(new Card( arrCard[index].name ));
      if(arrCard[index].count>1){
        arrCard[index].count--;
      }else{
        arrCard.splice(index,1);
      }      
    }

  },
  render(){
    this.gameElement= document.createElement("section");
    this.gameElement.classList.add("game__cards");
    this.rootElement.append(this.gameElement);

    this.renderCards();

    this.gameElement.addEventListener("click", e => {
      if(this.lock) return;

      let card = e.target.closest(".card");
      if(!card || card.card.hasMatch) return;

      card.card.open();
      this.match.push(card.card);
      
      if(this.match.length==2){

        if(this.match[0].id===this.match[1].id){
          this.match.forEach(val => {val.hasMatch=true});
          this.match=[];
        }else{
          this.lock=true;
          setTimeout( () => {
            this.match.forEach(val => {val.close()});
            this.match=[]; 
            this.lock=false;            
          }, 500);        
        }
        
      }

    });
  },
  renderCards(){
    this.cards.forEach( val => this.gameElement.append(val.getEl()) );
  },


};


game.start({});

