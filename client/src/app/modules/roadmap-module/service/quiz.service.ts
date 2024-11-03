import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseService } from '../../../../shared/services/base.service';

@Injectable({
  providedIn: 'root',
})
export class QuizService extends BaseService {
  constructor(private http: HttpClient) {
    super(http);
  }

  /**
   * Özelliklere göre quiz getirir veya oluşturur
   * @param quizData Quiz oluşturma/gösterme için gerekli veriler
   * @returns Observable<any>
   */
  createOrGetQuiz(quizData: any): Observable<any> {
    return this.post<any, any>(`/quiz/create-or-get`, quizData);
  }

  /**
   * ID'ye göre quiz getirir
   * @param id Quiz ID
   * @returns Observable<any>
   */
  getById(id: string): Observable<any> {
    return this.get<any>(`/quiz/${id}`);
  }

  /**
   * Quiz sonuçlarını gönderir
   * @param quizSubmissionData Quiz gönderimi için gerekli veriler
   * @returns Observable<any>
   */
  submitQuiz(quizSubmissionData: any): Observable<any> {
    return this.post<any, any>('/quiz/submit', quizSubmissionData);
  }
}
