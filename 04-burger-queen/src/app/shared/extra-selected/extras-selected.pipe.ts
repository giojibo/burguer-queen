import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductExtra } from 'src/app/models/product-extra';

@Pipe({
  name: 'extrasSelected',
  standalone: true,

})
export class ExtrasSelectedPipe implements PipeTransform
{

  constructor(
    private translate: TranslateService,
  )
  {}

  transform(value: ProductExtra[]): string[]
  {
    let selectedExtras: string[] = [];

    value.forEach( extra =>
    {
      extra.blocks.forEach( block =>
      {
        if(block.options.length == 1 && block.options[0].activate)
        {
          selectedExtras.push(this.translate.instant(block.name));
        }
        else
        {
          const optionSelected = block.options.find(option => option.activate);
          if(optionSelected)
          {
            selectedExtras.push(this.translate.instant(block.name) + ': ' + this.translate.instant(optionSelected.name));
          }
        }
      })
    }
    )

    return selectedExtras;
  }

}
