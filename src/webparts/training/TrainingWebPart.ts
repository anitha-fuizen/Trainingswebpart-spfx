/*eslint-disable*/
import {
  Version,
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  IPropertyPaneDropdownOption ,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'TrainingWebPartStrings';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
//import { ITrainingProps } from './components/ITrainingProps';


export interface ITrainingWebPartProps {
     description: string;
  }
export interface ISPLists
{
  value: ISPList[];
}
export interface ISPList
{
 
  // Title: string;
  trainingname:string;
  StartDate:string;
  EndDate:string;
  Apply:{
    Url:string;

  }
  
}
export default  class TrainingWebPart extends BaseClientSideWebPart<ITrainingWebPartProps> {

  
public dropdownOptions: IPropertyPaneDropdownOption[] = [];
  private _getListData(): Promise<ISPLists>
  {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('TrainingCalender')/Items?$select=trainingname,StartDate,EndDate,Apply",
   // return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('Training')/Items?$select=Title,Apply",
    SPHttpClient.configurations.v1
   )
   .then((response: SPHttpClientResponse) =>
       {
       return response.json();
        console.log(response.json())
       });
   }
   private _renderListAsync(): void
   {
    if (Environment.type === EnvironmentType.SharePoint ||
             Environment.type === EnvironmentType.ClassicSharePoint) {
     this._getListData()
       .then((response) => {
         this._renderList(response.value);
         console.log(response.value);
       }).catch((err)=>{console.log(err)})
}
 }
 private _renderList(items: ISPList[]): void
 {
  
  let  html: string = '<table border=2 width=80% style="font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;>';

  html+=`<th>TrainingName</th><th>StartDate</th><th>EndDate</th><th>Apply</th>`
   console.log(items)
  items.forEach((item: ISPList) => {

    
  //   html += `<tr>
  //    <td>${item.Title}</td>
     
  //   <td><a href=${item.Apply.Url} target="_blank">Nominate</a></td>
    
  //   </tr> `
  // });
  //  html += "</table>"; 
       
//   });


// html += "</table>"; 
    html += `<tr>
     <td>${item.trainingname}</td>
     <td>${item.StartDate}</td>
     <td>${item.EndDate}</td>
     <td><a href=${item.Apply.Url} target="_blank">Nominate</a></td>
    
    </tr> `
       
       
  });
html += "</table>"; 


  const listContainer: Element = this.domElement.querySelector('#BindspListItems');
  listContainer.innerHTML = html;
}

public render(): void {
  this.domElement.innerHTML = `
    <div class={styles.sharepointframe}>
  <div class={ styles.container }>
    <div class={ styles.row }>
      <div class={ column }>
     <span class={styles.title}></span>
        
        </div>
        <br/>
        <br/>
        <br/>
        <div id="BindspListItems" />
        </div>
        </div>
         
        </div>`;
        this._renderListAsync();
      

        
      
}
  protected get dataVersion(): Version {
  return Version.parse('1.0');
}
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
  return {
    pages: [
      {
        header: {
          description: strings.PropertyPaneDescription
        },
        groups: [
          {
            groupName: strings.BasicGroupName,
            groupFields: [
              PropertyPaneTextField('description', {
                label: strings.DescriptionFieldLabel
              }),
             
            ]
          }
        ]
      }
    ]
  };
}
}









