import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = 'igSMiMqM1RzgPZbxYzujdfLT6ei2tlhl';

  private _historial: string[] = [];

  //TODO: Cambiar any por su tipo correspondiente. 
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor( private http: HttpClient ) {

    ///se puede escribir de dos maneras: haciendo una validación ó ...
    //if ( localStorage.getItem('historial') ) {
    //  this._historial = JSON.parse( localStorage.getItem('historial')! );
    //}
    ///...ó se puede resumir en una línea como:
    this._historial = JSON.parse( localStorage.getItem('historial')! ) || [];

    //y para el caso del array de resultados:
    this.resultados = JSON.parse( localStorage.getItem('resultados')! ) || [];

  }

  buscarGifs( query:string = '' ) {

    query = query.trim().toLocaleLowerCase();

    if ( !this._historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify( this._historial ) );

    }

    console.log(this._historial);

    this.http.get<SearchGifsResponse>(`https://api.giphy.com/v1/gifs/search?api_key=igSMiMqM1RzgPZbxYzujdfLT6ei2tlhl&q=${ query }&limit=10`)
      .subscribe( ( resp ) => {
        console.log( resp.data );
        this.resultados = resp.data;

        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );

      });      
  }


}
