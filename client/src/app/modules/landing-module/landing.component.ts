// landing.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AppState } from '../../+state/app.state';
import { selectCurrentUser } from '../../+state/app.selector';
import { environment } from '../../../environments/environement';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    // İhtiyaç duyulan başlangıç mantıkları burada
  }

  /**
   * "Start Learning" butonuna tıklandığında çağrılır.
   * Kullanıcının oturum açmış olup olmadığını kontrol eder ve yönlendirme yapar.
   * @param id Roadmap'in benzersiz kimliği
   */
  onGetStarted(id?: any): void {
    this.store
      .select(selectCurrentUser)
      .pipe(
        take(1), // Sadece bir değer almak için
        map((user) => !!user) // Kullanıcının oturum açmış olup olmadığını boolean değere çevirir
      )
      .subscribe(
        (isLoggedIn) => {
          if (isLoggedIn) {
            // Kullanıcı oturum açmışsa roadmap/inspect/:id sayfasına yönlendir
            this.router.navigate([`${environment.ROUTE_ROADMAP}/inspect/${id}`]);
          } else {
            // Kullanıcı oturum açmamışsa Login sayfasına yönlendir
            this.router.navigate([`${environment.ROUTE_PAGES}/${environment.ROUTE_AUTHENTICATION}/${environment.ROUTE_LOGIN}`]);
          }
        },
        (error) => {
          console.error('Kullanıcı durumu kontrol edilirken hata oluştu:', error);
          // Hata durumunda varsayılan bir sayfaya yönlendirme yapabilirsiniz
          this.router.navigate(['/roadmap-generator']);
        }
      );
  }
}
