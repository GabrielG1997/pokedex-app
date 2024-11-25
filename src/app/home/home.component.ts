import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}
  goToSearch() {
    this.router.navigate(['/search']);
  }
  redirect(url: string) {
    window.open(url, '_blank');
  }
}
