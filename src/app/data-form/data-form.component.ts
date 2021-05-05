import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EstadoBr } from '../shared/models/estadoBr.model';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DropdownService } from '../shared/services/dropdown.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {
  formulario: FormGroup;
  // estados: EstadoBr[] = []
  estados: Observable<EstadoBr[]>
  cargos: any[]
  tecnologias: any[]
  newsletterOp: any[]
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cepService: ConsultaCepService,
    private dropdownService: DropdownService
  ) { }

  ngOnInit(): void {
    this.estados = this.dropdownService.getEstadosBr()
    this.cargos = this.dropdownService.getCargos()
    this.tecnologias = this.dropdownService.getTecnologias()
    this.newsletterOp = this.dropdownService.getNewsletter()
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ['s']
    })
  }
  onSubmit() {
    console.log(this.formulario.value);
    if (this.formulario.valid) {
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value)).subscribe(res => {
        console.log(res);
        this.resetar();
      }, error => {
        console.log(error);

      })
    } else {
      console.log("Formulario inválido");
      this.verificaValidacoesForm(this.formulario)
    }
  }
  verificaValidacoesForm(formGrupo: FormGroup) {
    Object.keys(formGrupo.controls).forEach(campo => {
      console.log(campo);
      const controle = formGrupo.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle)
      }
    })
  }
  resetar() {
    this.formulario.reset();
  }
  aplicarCssErro(campo: string) {
    return {
      'is-invalid': this.verificaValidTouched(campo),
    }
  }
  verificaValidTouched(campo: string) {
    return !this.formulario.get(campo).valid && (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
  }
  verificarEmailInvalido() {
    if (this.formulario.get('email').errors) {
      return this.formulario.get('email').errors['email'] && this.formulario.get('email').touched
    }
  }
  consultaCep() {
    let cep = this.formulario.get('endereco.cep').value

    if (cep != null && cep !== "") {
      this.cepService.consultaCep(cep).subscribe((res: any) => {
        this.populaDadosForm(res)
      })
    }
  }
  populaDadosForm(dados) {

    this.formulario.patchValue({
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
  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }
  setarCargo() {
    const cargo = { nome: "Dev", nivel: "Pleno", desc: "Dev Pl" }
    this.formulario.get('cargo').setValue(cargo)
  }
  setarTecnologias() {
    // const cargo = { nome: "Dev", nivel: "Pleno", desc: "Dev Pl" }
    this.formulario.get('tecnologias').setValue(['java', 'javascript', 'php'])
  }
  comparaCargos(obj1, obj2) {
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2
  }
}
