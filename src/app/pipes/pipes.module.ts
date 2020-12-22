import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { FechalastPipe } from './fechalast.pipe';
import { TextoPortadaPipe } from './texto-portada.pipe';
import { ViewtimePipe } from './viewtime.pipe';


@NgModule({
  declarations: [DomSanitizerPipe, FechalastPipe, TextoPortadaPipe, ViewtimePipe],
  exports: [ DomSanitizerPipe, FechalastPipe,TextoPortadaPipe,ViewtimePipe]
})
export class PipesModule { }
