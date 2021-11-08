import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { BottomSheetComponent } from './component/bottom-sheet/bottom-sheet.component';


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    BottomSheetComponent
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
   ],
  providers: [ MenuItems ]
})
export class SharedModule { }
