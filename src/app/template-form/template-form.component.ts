import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {
  usuario: any = {
    nome: null,
    email: null
  }
  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
  ) { }

  ngOnInit(): void {
  }
  onSubmit(formulario) {
    console.log(formulario);
    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value)).subscribe(res => {
      console.log(res);

    })
  }
  verificaValidTouched(campo) {
    return !campo.valid && campo.touched
  }
  aplicarCssErro(campo) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
    }
  }
  consultaCep(cep, form) {
    cep = cep.replace(/\D/g, '')
    console.log(cep);
    if (cep != null && cep !== "") {
      this.cepService.consultaCep(cep).subscribe((res: any) => {
        this.populaDadosForm(res, form)
      })
    }
  }
  populaDadosForm(dados, formulario) {
    // formulario.setValue({
    //   nome: formulario.value.nome,
    //   email: formulario.value.email,
    //   endereco: {
    //     cep: dados.cep,
    //     numero: "",
    //     complemento: "",
    //     rua: dados.logradouro,
    //     bairro: dados.bairro,
    //     cidade: dados.localidade,
    //     estado: dados.uf
    //   }
    // })
    formulario.form.patchValue({
      endereco: {
        cep: dados.cep,
        numero: "",
        complemento: "",
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }
}
