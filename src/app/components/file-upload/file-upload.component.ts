import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  @Output() data = new EventEmitter();

  processFile(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = reader.result as string;
      // Process the contents (e.g., parse JSON)
      this.data.emit(JSON.parse(contents))
    };
    reader.readAsText(file);

  }
}
