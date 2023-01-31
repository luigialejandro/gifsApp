import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey:string = 'igSMiMqM1RzgPZbxYzujdfLT6ei2tlhl';

  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

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

    const params = new HttpParams()
      .set( 'api_key', this.apiKey )
      .set( 'limit', '10' )
      .set( 'q', query );

    console.log( params.toString );

    this.http.get<SearchGifsResponse>(` ${ this.servicioUrl }/search`, { params } )
      .subscribe( ( resp ) => {
        console.log( resp.data );
        this.resultados = resp.data;

        localStorage.setItem( 'resultados', JSON.stringify( this.resultados ) );

      });      
  }
}
