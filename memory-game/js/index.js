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
  };
  this.getEl = function(){
    if(!this.el) this.createEl();
    return this.el;
  };
  this.flip = function(){
    this.el.classList.toggle("card--flipped");
    this.opened=!this.opened;
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
  step : 0,
  openedCount : 0,
  results : [],
  init({selector=".game"}){
    this.results = JSON.parse(window.localStorage.getItem("results", this.results)) || [];
    this.rootElement = document.querySelector(selector);    
    this.render();
    this.start();
  },
  start(){     
    this.match =[];
    this.step = 0;
    this.gameStepsElement.children[0].innerText=this.step;
    this.generateCard();
    this.gameWinElement.classList.remove("game__win--show")
  },
  generateCard(){
    this.gameElement.innerHTML="";
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
    this.renderCards();

  },
  render(){
    this.gameElement= document.createElement("section");
    this.gameElement.classList.add("game__cards");
    this.gameStepsElement = document.createElement("div");
    this.gameStepsElement.classList.add("game__steps");
    this.gameStepsElement.innerHTML="Количество ходов: <span class='game__steps-count'>0</span>";
    this.gameWinElement = document.createElement("div");
    this.gameWinElement.classList.add("game__win");
    this.gameWinElement.innerHTML=`
      <div class="game__win-text">Победа!</div>
      <div class="game__win-steps">Затрачено ходов: <span class="game__win-steps-count"></span></div>
      <div class="game__win-action">
        <button class="game__play-btn">Играть еще</button>
        <button class="game__results-btn">Результаты</button>
      </div>
      <div class="game__results">        
        <span class="game__results-text">Результаты</span>
        <table class="game__results-table"></table>
        <button class="game__results-close">Закрыть</button>
      </div>
    `;
    this.rootElement.innerHTML="";
    this.rootElement.append(this.gameElement, this.gameStepsElement, this.gameWinElement);    

    this.gameElement.addEventListener("click", e => {
      if(this.lock) return;

      let card = e.target.closest(".card");
      if(!card || card.card.hasMatch || card.card.opened) return;

      this.openCard(card.card);

    });
    this.gameWinElement.addEventListener("click", e => {
      if(e.target.classList.contains("game__play-btn")) this.start();
      if(e.target.classList.contains("game__results-btn")) this.showResultsTable();
      if(e.target.classList.contains("game__results-close")){
        this.gameWinElement.querySelector(".game__results").classList.remove("game__results--show");
      }
    });
  },
  renderCards(){
    this.cards.forEach( val => this.gameElement.append(val.getEl()) );
  },
  openCard(cardObj){
    cardObj.open();
     
    this.match.push(cardObj);
    
    if(this.match.length==2){
      this.doStep();
      if(this.match[0].id===this.match[1].id){
        this.match.forEach(val => {val.hasMatch=true});
        this.openedCount+=2;
        if(this.openedCount==24){
          this.win();
        }
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

  },
  doStep(){
    this.step++;
    this.gameStepsElement.children[0].innerText=this.step;
  },
  win(){
    this.saveResults();
    this.gameWinElement.querySelector(".game__win-steps-count").innerText=this.step;
    let table = this.gameWinElement.querySelector(".game__results-table");
    table.innerHTML=`<tr><th>№</th><th>Ходы</th></tr>`;
    
    for(let i=0; i<this.results.length; i++){
      table.insertAdjacentHTML("beforeend",`<tr><td>${i+1}</td><td>${this.results[i]}</td></tr>`);
    }     
    this.gameWinElement.classList.add("game__win--show");
  },
  saveResults(){
    this.results.push(this.step);
    if(this.results.length>10){
      this.results.shift();
    }
    window.localStorage.setItem("results", JSON.stringify(this.results));
  },
  showResultsTable(){
    this.gameWinElement.querySelector(".game__results").classList.add("game__results--show");
  }

};


game.init({});

