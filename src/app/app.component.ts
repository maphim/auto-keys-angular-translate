import { Component, VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

declare const $;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  listKey = {
    placeholder: {},
    label: {},
    button: {},
  };
  frm: FormGroup;

  constructor(readonly fb: FormBuilder) {
    this.frm = this.fb.group({
      template: '',
      key: '',
    });
  }

  private convertVietnameseCharacters(obj) {
    let str = obj.trim();
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/E|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/\W+/g, '_');
    return str;
  }

  private findVN(label: string): boolean {
    return (
      label &&
      label.search(
        /à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ|è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ|ì|í|ị|ỉ|ĩ|ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|ỳ|ý|ỵ|ỷ|ỹ|đ/i
      ) >= 0
    );
  }

  private cleanLabel(label) {
    return label.trim().replace(/(\r|\n|\t)+/, ' ');
  }

  public readTemplate() {
    const html = $(`<div>${this.frm.value.template}</div>`);
    const list = html.find(':not(option)');
    list.each((index, item) => {
      // replace placeholder
      if ($(item).attr('placeholder')) {
        const label = $(item).attr('placeholder');
        if (this.findVN(label)) {
          const key = this.convertVietnameseCharacters(label);
          this.listKey['placeholder'][key] = this.cleanLabel(label);
          $(item).attr('placeholder', `{{ 'placeholder.${key}' | translate }}`);
        }
      }
      // find label
      if ($(item).children().length === 0) {
        const label = $(item).text();
        if (this.findVN(label)) {
          const key = this.convertVietnameseCharacters(label);
          if ($(item).hasClass('ubtn-text')) {
            this.listKey['button'][key] = this.cleanLabel(label);
            $(item).text(`{{ 'button.${key}' | translate }}`);
          } else {
            this.listKey['label'][key] = this.cleanLabel(label);
            $(item).text(`{{ 'label.${key}' | translate }}`);
          }
        }
      }
    });

    this.frm.get('template').patchValue(html.html());
    this.frm.get('key').patchValue(JSON.stringify(this.listKey, null, '  '));
  }
}
