let myform = document.querySelector('form');
let categoryInput = document.querySelector('#categoryMenu');
let difficultyInput = document.querySelector('#difficultyOptions');
let numberInput = document.querySelector('#questionsNumber');
let startButton = document.querySelector('#startQuiz');
let myRow = document.querySelector('.questions .container .row');
let myquiz;
let allquestion;

startButton.addEventListener("click", async function () {
  let category = categoryInput.value;
  let difficulty = difficultyInput.value;
  let number = numberInput.value;

  myquiz = new Quiz(category, difficulty, number);
  allquestion = await myquiz.getAllQuestions();
  
  myform.classList.replace("d-flex", "d-none");
  console.log(allquestion);

  let myquestion = new Question(0);
  myquestion.display();
  console.log(myquestion);
});

class Quiz {
  constructor(category, difficulty, number) {
    this.category = category;
    this.difficulty = difficulty;
    this.number = number;
    this.score = 0;
  }

  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.difficulty}`;
  }

  async getAllQuestions() {
    let response = await fetch(this.getApi());
    let data = await response.json();
    return data.results;
  }

  showResult() {
    return `
      <div class="question shadow-lg col-lg-12 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
        <h2 class="mb-0">${this.score == this.number ? `Congratulations 🎉` : `Your score is ${this.score}`}</h2>
        <button class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
      </div>
    `;
  }
}

class Question {
  constructor(index) {
    this.index = index;
    this.question = allquestion[index].question;
    this.correctAnswer = allquestion[index].correct_answer;
    this.incorrectAnswers = allquestion[index].incorrect_answers;
    this.category = allquestion[index].category;
    this.allAnswers = this.getAllAnswers();
    this.isAnswered = false;
  }

  getAllAnswers() {
    let allAnswers = [...this.incorrectAnswers, this.correctAnswer];
    allAnswers.sort();
    return allAnswers;
  }

  display() {
    const questionMarkup = `
      <div class="question shadow-lg col-lg-6 offset-lg-3 p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions">${this.index + 1} of ${allquestion.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
          ${this.allAnswers.map((li) => `<li>${li}</li>`).join('')}
        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${myquiz.score}</h2>
      </div>
    `;
    myRow.innerHTML = questionMarkup;
    
    let allChoices = document.querySelectorAll('.choices li');
    allChoices.forEach((li) => {
      li.addEventListener('click', () => {
        this.checkAnswer(li);
        this.nextQuestion();
      });
    });
  }

  checkAnswer(li) {
    if (!this.isAnswered) {
      this.isAnswered = true;
      if (li.innerHTML === this.correctAnswer) {
        li.classList.add('correct', 'animate__animated', 'animate__bounce');
        myquiz.score++;
      } else {
        li.classList.add('wrong', 'animate__animated', 'animate__shakeX');
      }
    }
  }

  nextQuestion() {
    this.index++;

    setTimeout(() => {
      if (this.index < allquestion.length) {
        let nextQuestion = new Question(this.index);
        nextQuestion.display();
      } else {
        let result = myquiz.showResult();
        myRow.innerHTML = result;
        document.querySelector(".again").addEventListener("click", function () {
          window.location.reload();
        });
      }
    }, 1500);
  }
}
