import { Injectable} from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot , Router, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  isLoggedIn$: Observable<boolean>;
  constructor(private authService: AuthService, private router: Router){
    this.isLoggedIn$ = this.authService.isLoggedIn()
  }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    return this.authService.isLoggedIn().pipe(map(logged => {
      if(logged) {
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
      
    }))
    
  }
}
