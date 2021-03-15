import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastrService: ToastrService) { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              console.log(error);
              console.log(Array.isArray(error));
              console.log(Array.isArray(error.error));
              if (error.error.errors) {
                const modalStateErrors = [];
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    modalStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else if (Array.isArray(error.error)) {
                const modalStateErrors = [];
                const errors: { description: string }[] = error.error;

                errors.forEach((e) =>  {
                  modalStateErrors.push(e.description);
                });

                throw modalStateErrors.flat();
              } else if (typeof (error.error) === 'object') {
                this.toastrError(error.statusText, error.status, 'Bad Request');
              }
              else {
                this.toastrError(error.error, error.status, 'Bad Request');
              }
              break;

            case 401:
              this.toastrError(error.statusText, error.status, 'Unauthorised');
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: error.error }
              };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              this.toastrService.error('Something unexpected went wrong.');
              console.log(error);
              break;
          }
        }
        return throwError(error);
      }));
  }

  private toastrError(statusText: string, status: string, defaultMessage: string) {
    this.toastrService.error(statusText === "OK" ? defaultMessage : statusText, status);
  }
}
