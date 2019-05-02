import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString:string, propName:string,propName2:string): any {
    if(!filterString){
      return value;
    }
    const resultArray = [];
    for(let val of value){
      let matchString = val[propName].toLowerCase();
      if(matchString.indexOf(filterString.toLowerCase())>=0){
        resultArray.push(val);
      }
    }
    return resultArray;
  }

}
