import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Lyrics} from "../../interfaces/lyrics";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})

export class LyricsService{
  private listLyrics = new BehaviorSubject<Lyrics[]>([]);
  private localStorageLyricsList = 'lyricsList';
  private url: string = 'https://demo-lyrics-api.herokuapp.com';

  constructor( private http: HttpClient) {
  }

  getAllLyricsList():Observable<Lyrics[]>{
    if(localStorage.getItem(this.localStorageLyricsList)){
      this.listLyrics.next(JSON.parse(<string>localStorage.getItem(this.localStorageLyricsList)));
    } else {
      this.http.get<Lyrics[]>(this.url + '/api/lyrics')
        .pipe(
          tap((result: Lyrics[]) => {
            this.listLyrics.next(result);
            localStorage.setItem(this.localStorageLyricsList, JSON.stringify(this.listLyrics.value));
          })
        ).subscribe();
    }
    return this.listLyrics;
  }

  getLyricsById(id: number): any{
    if(localStorage.getItem(this.localStorageLyricsList)) {
      const lyricsList = JSON.parse(<string>(localStorage.getItem(this.localStorageLyricsList)));
      return lyricsList.find((item: any) => item.id.toString() === id.toString());
    } else {
      return this.http.get<Lyrics>(`${this.url}/api/lyrics/${id}`)
        .pipe(tap( (lyrics: Lyrics ) => {
          return lyrics;
        }))
    }
  }

  updateLyrics(lyrics: Lyrics): Observable<Lyrics>{
    return this.http.patch<Lyrics>(`${this.url}/api/lyrics/${lyrics.id}`, lyrics)
  }


  removeLyrics(id: string): Observable<void>{
    return this.http.delete<void>(`${this.url}/api/lyrics/${id}`)
  }

}