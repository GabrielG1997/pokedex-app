import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-search',
  imports: [FormsModule,CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchByIdTerm: string = '';
  searchByTypeTerm: string = '';
  results: any[] = [];
  apiUrl: string  = '';
  isSingleResult: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}
  search() {
    if (this.searchByIdTerm.length > 0 && this.searchByTypeTerm.length == 0 ) {
      this.apiUrl = `https://pokeapi.co/api/v2/pokemon/${this.searchByIdTerm}`;
      this.isSingleResult = true;
    } else if(this.searchByTypeTerm.length > 0 && this.searchByIdTerm.length == 0) {
      this.apiUrl = `https://pokeapi.co/api/v2/type/${this.searchByTypeTerm}`;
      this.isSingleResult = false;
    }else if(this.searchByIdTerm.length > 0 && this.searchByTypeTerm.length > 0){
      alert('Search by ID/Name OR Type (Multiple search parameter detected)');
    }else{
      alert('Search by ID/Name or Type (search parameter is null)');
    }
    this.http.get(this.apiUrl).pipe(
      catchError((error) => {
        alert(`Error during requesition: ${error.error}: ${error.status}`);
        console.error('Error during requesition:', error);
        return throwError(() => new Error('Error to get data. Please, Try again.'));
      })
    ).subscribe((response: any) => {
      if (this.isSingleResult) {
        this.results = [response];
      } else {
        const requests = response.pokemon.map((p: any) =>
          this.http.get(p.pokemon.url).pipe(
            catchError((error) => {
              alert(`Error to fetch Pokemon details: ${p.pokemon.name} error: ${error}`);
              console.error(`Error to fetch Pokemon details: ${p.pokemon.name}`, error);
              return throwError(() => new Error('Error to fetch Pokemon details'));
            })
          )
        );
        forkJoin(requests).pipe(
          catchError((error) => {
            alert(`Error during Pokemon list processing, error: ${error}`);
            console.error('Error during Pokemon list processing: ', error);
            return throwError(() => new Error('Error during Pokemon list processing'));
          })
        ).subscribe({
          next: (pokemonDetails) => {
            this.results = pokemonDetails as any[];
          },
          error: (error) => {
            alert(`Error: ${error}`);
            console.error('Error: ', error);
          }
        });
      }
    });
  }
  viewDetails(pokemon: any) {
    if(this.isSingleResult){
      this.router.navigate(['/details', pokemon.id]);
    }else{
      this.router.navigate(['/details', pokemon.name]);
    }
  }
  returnToHome() {
    this.router.navigate(['']);
  }
}