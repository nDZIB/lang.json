import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { HttpClientModule } from '@angular/common/http';
import { LnjtranslateService } from '../../services/lnjtranslate/lnjtranslate.service';

type TranslationEntry = {
  key: string;
  en: string;
  fr: string;
}

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, FileUploadComponent, HttpClientModule],
  templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.scss'
})
export class TaskViewComponent {
  jsonString?: string;
  columns = [
    'key',
    'en',
    'fr'
  ]

  newLanguageForm: FormGroup;

  translationFile: FormGroup;
  formArray = new FormArray<any>([], [Validators.required]);

  constructor(private fb: FormBuilder, private trx: LnjtranslateService) {

    this.newLanguageForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)])
    })

    this.translationFile = new FormGroup({
      json: this.formArray
    })

  }

  get jsonData() {
    return this.formArray;
  }

  get groups(): FormControl<TranslationEntry>[][] {
    return (this.jsonData.controls as FormGroup[]).map(group => {
      let ctrls: FormControl[] = [];
      for (let ctrl in group.controls) {
        ctrls = [...ctrls, group.controls[ctrl] as FormControl]
      }

      return ctrls;
    })
  }

  insertEntry(event: any) {

    event.preventDefault();
    let ctrls = this.jsonData;

    if (event instanceof KeyboardEvent) {
      const index = +(event.target as HTMLInputElement).getAttribute('ariaRowIndex')!;
      ctrls.insert(index + 1, this.createTranslationGroup())

    } else {
      ctrls.push(this.createTranslationGroup())
    }



    this.translationFile.setControl('json', ctrls as FormArray)
  }

  createTranslationGroup() {
    let fgroup: any = {};

    this.columns.forEach((col) => {
      fgroup[col] = this.fb.control('')
    })

    return this.fb.group(fgroup as FormGroup)
  }

  createTranslationGroupFor(src: any) {
    let fgroup: any = {};

    this.columns.forEach((col) => {
      fgroup[col] = this.fb.control(src[col] || '')
    })

    return this.fb.group(fgroup as FormGroup)
  }

  persistFile() {
    this.jsonString = 'data:application/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.process(this.translationFile.value.json)))
  }

  addLanguage() {
    if (this.newLanguageForm.valid) {
      this.columns.push(this.newLanguageForm.value.name);

      this.newLanguageForm.reset();
    }

    // add form control on existing array
  }

  process(json: []) {
    const map: Map<string, any> = new Map();
    json.forEach((translationPair: any) => {

      let { key, ...lations } = translationPair;
      for (let field in lations) {
        const data = map.get(field) || {}

        const entry: any = {};
        data[key] = lations[field];

        map.set(field, data);
      }
    })

    return Object.fromEntries(map);
  }


  deleteEntry(index: number) {
    this.formArray.removeAt(index)
  }

  translate(src='en', target = 'fr') {
    const untranslated:any[] = [];
    this.formArray.value.forEach((entry: any) => {
      if(!entry[target]) {
        untranslated.push(entry);
      }
    })

    const request = untranslated.map(e => e[src]);

    this.trx.translate(request, target).subscribe(
      (response: any []) => {
        let data: any = {}
        response.forEach((entry: any, i: number) => {
          const key = untranslated[i].key;
          console.log(key, entry);

          data[key] = entry;
        })

        this.populateData(data, target)
      }
    )
  }

  populateData(data: any, language: string) {
    const translations: Map<string, any> = new Map();

    this.formArray.value.forEach((entry: any, index: number) => {
      translations.set(entry.key, {entry, index});
    });

    for (let key in data) {
      let values: any = { key }
      values[language] = data[key];

      const existingValue = translations.get(key)
      if (!!existingValue) {
        values = {...existingValue.entry};
        values[language] = data[key];

        this.formArray.at(existingValue.index).patchValue(values)
      } else {
        this.formArray.push(this.createTranslationGroupFor(values))
      }

    }
  }
}
