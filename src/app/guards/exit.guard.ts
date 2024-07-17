
import { CanDeactivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Component } from '@angular/core';

export interface OnExit{
  onExit : ()=> Observable<boolean | UrlTree> | Promise<boolean | UrlTree > | boolean | UrlTree
}

export const exitGuard: CanDeactivateFn<OnExit> = (component, currentRoute, currentState, nextState) => {

  return component.onExit?component.onExit():true
  //return true;
}
