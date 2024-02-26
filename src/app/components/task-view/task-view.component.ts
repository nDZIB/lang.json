import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

type TranslationEntry = {
  key: string;
  en: string;
  fr: string;
}

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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

  constructor(private fb: FormBuilder) {

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

    if(event instanceof KeyboardEvent) {
      const index = +(event.target as HTMLInputElement).getAttribute('ariaRowIndex')!;
      ctrls.insert(index+1, this.createTranslationGroup())

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
    const map: Map<string, any[]> = new Map();
    json.forEach((translationPair: any) => {

      let {key, ...lations} = translationPair;
      for(let field in lations) {
        const data = map.get(field) || []

        const entry: any = {};
        entry[key] = lations[field];
        data.push(entry);

        map.set(field, data);
      }
    })

    return Object.fromEntries(map);
  }
}
