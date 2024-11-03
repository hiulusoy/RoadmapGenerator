import { Component, OnInit } from '@angular/core';
import { RoadmapService } from '../service/roadmap.service';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../service/quiz.service';

@Component({
  selector: 'app-roadmap-inspect',
  templateUrl: './roadmap-inspect.component.html',
  styleUrls: ['./roadmap-inspect.component.css'],
})
export class RoadmapInspectComponent implements OnInit {
  quizQuestions: any[] = [];
  currentQuestionIndex: number = 0;
  correctAnswersCount: number = 0;
  incorrectAnswersCount: number = 0;
  selectedAnswer: string = '';
  selectedAnswers: { [key: number]: string } = {}; // Kullanıcının seçtiği cevapları saklamak için

  roadmap: any = {}; // Initialize roadmap to an empty object
  selectedWeek: any = null; // Initialize selected week to null
  currentQuizId: string = ''; // Şu anki quiz ID
  quizResults: any; // Quiz sonucu

  constructor(private roadmapService: RoadmapService, private quizService: QuizService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const roadmapId = this.route.snapshot.paramMap.get('id');
    if (roadmapId) {
      this.fetchRoadmapById(roadmapId);
    }
  }

  fetchRoadmapById(id: string): void {
    this.roadmapService.getById(id).subscribe(
      (response) => {
        if (response && response.weeklySchedule) {
          this.roadmap = response;
          this.selectedWeek = response.weeklySchedule['Week 1'];
        } else {
          console.error('No valid roadmap data found in response.');
        }
      },
      (error) => {
        console.error('Failed to fetch roadmap data:', error);
      }
    );
  }

  selectWeek(weekKey: string): void {
    if (this.roadmap && this.roadmap.weeklySchedule && this.roadmap.weeklySchedule[weekKey]) {
      this.selectedWeek = this.roadmap.weeklySchedule[weekKey];
    }
  }

  getWeekKeys(): string[] {
    return this.roadmap && this.roadmap.weeklySchedule ? Object.keys(this.roadmap.weeklySchedule) : [];
  }

  completeRoadmap(): void {
    // Quizi getir ve modalı aç
    this.fetchQuiz();
  }

  fetchQuiz(): void {
    if (!this.selectedWeek) {
      console.error('No week selected');
      return;
    }

    const input_data = {
      description: this.selectedWeek.description,
      learningType: this.roadmap.learning_style,
      level: this.roadmap.level,
    };


    this.quizService.createOrGetQuiz(input_data).subscribe(
      (quizResponse) => {
        if (quizResponse && quizResponse.questions) {
          this.quizQuestions = quizResponse.questions.map((question: any) => {
            if (!question.options || question.options.length === 0) {
              question.options = ['Option A', 'Option B', 'Option C', 'Option D'];
            }
            return question;
          });
          this.currentQuizId = quizResponse._id;
          this.openQuizModal();
        } else {
          console.error('No valid quiz data found in response.');
        }
      },
      (error) => {
        console.error('Failed to fetch quiz data:', error);
      }
    );
  }

  openQuizModal(): void {
    const modal: any = document.getElementById('my_modal_5');
    if (modal) {
      modal.showModal();
    }
  }

  nextQuestion(): void {
    if (this.selectedAnswer) {
      this.selectedAnswers[this.currentQuestionIndex] = this.selectedAnswer;

      if (this.selectedAnswer === this.quizQuestions[this.currentQuestionIndex]?.correctAnswer) {
        this.correctAnswersCount++;
      } else {
        this.incorrectAnswersCount++;
      }
      this.selectedAnswer = ''; // Seçilen cevabı sıfırla
    }

    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      const previousAnswer = this.selectedAnswers[this.currentQuestionIndex];
      if (previousAnswer === this.quizQuestions[this.currentQuestionIndex]?.correctAnswer) {
        this.correctAnswersCount--;
      } else {
        this.incorrectAnswersCount--;
      }
      this.selectedAnswer = this.selectedAnswers[this.currentQuestionIndex] || '';
    }
  }

  finishQuiz(): void {
    if (!this.quizQuestions.length) {
      console.error('No questions available to submit.');
      return;
    }

    // Kullanıcının cevaplarını topla ve backend'e gönderilecek veri formatını oluştur.
    const userAnswers = this.quizQuestions.map((question, index) => {
      const selectedAnswer = this.selectedAnswers[index] || ''; // Eğer cevap yoksa, boş bırak
      const correctAnswerText = question.options[question.correctAnswer.charCodeAt(0) - 65];
      const selectedAnswerText = selectedAnswer ? question.options[selectedAnswer.charCodeAt(0) - 65] : 'No Answer';
      return {
        question: question.question,
        selectedAnswer: selectedAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect: selectedAnswerText === correctAnswerText,
      };
    });

    this.quizResults = {
      correctCount: userAnswers.filter((answer) => answer.isCorrect).length,
      incorrectCount: userAnswers.filter((answer) => !answer.isCorrect).length,
      answers: userAnswers,
    };

    this.showQuizSummaryModal();

    // Quiz modalını kapat
    const quizModal: any = document.getElementById('my_modal_5');
    if (quizModal) {
      quizModal.close();
    }
  }

  showQuizSummaryModal(): void {
    const modal: any = document.getElementById('quiz_summary_modal');
    if (modal) {
      modal.showModal();
    }
  }

  getCorrectAnswerLetter(question: string): string {
    // Doğru cevabı bulmak için, quizQuestions listesi üzerinden gidiyoruz.
    const currentQuestion = this.quizQuestions.find((q) => q.question === question);
    if (!currentQuestion) {
      return '';
    }

    // Doğru cevabı bul ve bu cevabın hangi seçenek olduğunu döndür.
    return currentQuestion.correctAnswer;
  }
}
