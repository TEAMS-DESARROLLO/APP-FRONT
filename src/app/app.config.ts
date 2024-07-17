import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';


import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {  provideHttpClient, withInterceptors } from '@angular/common/http';

import { loggerInterceptor } from './providers/logger.interceptor';




export const appConfig: ApplicationConfig = {
  //providers: [provideRouter(routes), provideRouter(routesMenu), provideAnimations(), provideHttpClient()]
  providers: [provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([loggerInterceptor])), provideAnimations(), provideAnimations(), provideAnimations()]
};
