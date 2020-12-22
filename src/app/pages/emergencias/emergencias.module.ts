import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmergenciasPageRoutingModule } from './emergencias-routing.module';

import { EmergenciasPage } from './emergencias.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmergenciasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EmergenciasPage]
})
export class EmergenciasPageModule {}
