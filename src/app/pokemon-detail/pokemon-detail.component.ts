import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ClipboardModule } from '@angular/cdk/clipboard'
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-pokemon-detail',
  imports: [CommonModule, ClipboardModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrl: './pokemon-detail.component.css'
})
export class PokemonDetailComponent {
  pokemon: any;
  pokemonDetailsToCopy: string = '';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private clipboard: Clipboard
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    this.loadPokemon(id);
  }
  loadPokemon(id: string | null) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    this.http.get(apiUrl).subscribe((response) => (this.pokemon = response));
  }
  share(){
    this.pokemonDetailsToCopy = JSON.stringify({
      details:`https://pokeapi.co/api/v2/pokemon/${this.pokemon.id}`,
      id: this.pokemon.id,
      name: this.pokemon.name,
      image: this.pokemon.sprites?.front_default,
    });
    this.clipboard.copy(this.pokemonDetailsToCopy);
    alert('Pokémon shared!');
  }
  returnToSearch() {
    this.router.navigate(['/search']);
  }
}