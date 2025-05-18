import './style.css'
import {Questions} from "/src/questions.js";

console.log(Questions)

const TIMEOUT = 4000;

const app = document.querySelector("#app");




// app.innerHTML = `<div>
// <h1> salut</h1>

// <input \>

// </div`

// const div = document.createElement("div");
// const title  = document.createElement("h1");
// // title.innerText = "betos";
// // title.className = "big-title";
// // title.style.background = "blue";
// div.appendChild (title);
// const input = document.createElement("input")
// div.appendChild(input)
// app.appendChild(div);
// // setInterval(()=> {
// //   input.value +="M"
// // },1000)



const startButton = document.querySelector("#start")

// const colors = ["red","blue","yellow"];
// app.addEventListener("click",()=>{
//   console.log("click app")
//   })

//   let i = 0;
// startButton.addEventListener("click",()=>{

//   const question = document.querySelector("#question") ?? document.createElement("p");
//   question.id = "question"
//   question.innerHTML = Questions[i].question;
//   app.insertBefore(question,startButton);
//   i++;
//   if (i > Questions.length - 1){
//     question.remove()
//     i = 0;
// }
// })

startButton.addEventListener("click",startQuiz)


function displayNextQuestionButton(callBack){

  let remainingTimeout = TIMEOUT;

  app.querySelector("button").remove();
  const getButtonText = () => `Next (${(remainingTimeout/1000)}s)`;

  const nextButton = document.createElement("button");
  nextButton.innerText = getButtonText();
  app.appendChild(nextButton);

 const interval = setInterval(() => {
    remainingTimeout -= 1000;
   nextButton.innerText = getButtonText();
},1000)

let timeOut = setTimeout(() =>{
  handleNextQuestion ();

  },TIMEOUT)

const handleNextQuestion  = () =>{

 
  clearInterval(interval);
  clearTimeout(timeOut);
  callBack ();
}

  nextButton.addEventListener("click",()=>{
    handleNextQuestion ();
  })

}

function disableAllAnswers() {
const radioInputs = document.querySelectorAll('input[type="radio"]');

for (const radio of radioInputs){
  radio.disabled = true;

}
}

function  startQuiz (event){
  let currentQuestion = 0; 
  let score  = 0;

  clean()
  displayQuestion(currentQuestion);

  function clean (){
    while(app.firstElementChild){
      app.firstElementChild.remove();
    }

    const progress = getProgressBar(Questions.length,currentQuestion); 
    app.appendChild (progress);
  }



  function displayQuestion (index){
    clean()
  const question = Questions[index];

   if(!question){
     //finish quiz
    displayFinishMessage();
    return;
   
   }
   const title = getTitleElement(question.question);
   app.appendChild(title);
   const answersDiv = createAnswer(question.answers);
   app.appendChild(answersDiv);
   const submitButton = getSubmitButton();

   submitButton.addEventListener("click",submit)
   app.appendChild(submitButton);
  } 

  function displayFinishMessage(){
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo !! Tu as terminé le Quiz";
    const  p  = document.createElement("p");
    p.innerText = `tu as eu ${score} sur ${Questions.length} points!`;
    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit () {
  const selectedAnswer = app.querySelector(`input[name="answer"]:checked`);
  disableAllAnswers();
  const value = selectedAnswer.value;
  const question = Questions[currentQuestion];
  const isCorrect = question.correct ===  value;

  if (!selectedAnswer) {
    alert("Please select an answer!");
    return;
  }


  if(isCorrect){
    score++;
  }
  showFeedBack (isCorrect,question.correct,value)
  
  displayNextQuestionButton(() => {
    currentQuestion ++;
    displayQuestion(currentQuestion);
  });
  const feedBack = getFeedBackMessage(isCorrect,question.correct);
  app.appendChild(feedBack);

  }


  function createAnswer (answers ){
   const answersDiv = document.createElement("div");
   answersDiv.classList.add("answers");

   for (const answer of answers){
    const label = getAnswerElement(answer);
    answersDiv.appendChild(label);
   }
   return answersDiv;
  }

}

function getTitleElement (text) {
 const title = document.createElement("h3")
 title.innerText = text;
 return title;
}

function formatId (text){
  return text.replaceAll (" ","-").replaceAll('"',"'").toLowerCase();
}


function getAnswerElement(text) {
  const id = formatId(text);

  const input = document.createElement("input");
  input.id = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);

  const label = document.createElement("label");
  label.setAttribute("for", id); // 🔧 lien correct vers l'input
  label.appendChild(document.createTextNode(" " + text)); // texte visible après l'input
  label.appendChild(input);
 

  return label;
}

// function getAnswerElement (text){
//   const label = document.createElement("label");
//   label.innerText = text;
//   const input = document.createElement("input");
//   const id = formatId(text);
//   input.id = id;
//   input.htmlFor = id;
//   input.setAttribute("type","radio");
//   input.setAttribute("name","answer");
//   input.setAttribute("value",text);
//   label.appendChild(input);

//   return label;
// }

function showFeedBack (isCorrect,correct,answer){
  const correctAnswerId = formatId(correct)
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  )

  const selectedAnswerId = formatId(answer)
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  )

  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect?"correct":"incorrect");
}
  

function getSubmitButton(){
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function getFeedBackMessage(isCorrect,correct){

  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect ? "Bravo,tu as eu la bonne réponse":`Désole... mais la bonne etait : ${correct}`;
  return paragraph;
}

function getProgressBar (max,value){
  const progress = document.createElement("progress");
  progress.setAttribute("max",max);
  progress.setAttribute("value",value);
  return progress;
}