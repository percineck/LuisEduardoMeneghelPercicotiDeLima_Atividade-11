import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Contact } from 'src/app/models/Contact';
import { Group } from 'src/app/models/Group';

interface FormGroupData {
  name: FormControl;
}
interface FormContactData {
  
  idGroup: FormControl;
  name: FormControl;
  phone: FormControl;
}

@Component({
  selector: 'app-contatos',
  templateUrl: './contatos.component.html',
  styleUrls: ['./contatos.component.css']
})

export class ContatosComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { 
    this.formContact = this.formBuilder.group({
     
      idGroup: ['',Validators.required],
      name: ['', Validators.required],
      phone: [
        '', 
        Validators.required,
        Validators.pattern(/^\(\d{2}\) \d{4,5}[-\s]?\d{4}$/),
      ],
      
    });
    this.formGroup= this.formBuilder.group({
          name: ['', Validators.required],
        });
  }
  data:Contact=new Contact();
  loading = true;
  submitting = false;
  formContact: FormGroup<FormContactData>;
  formGroup: FormGroup<FormGroupData>;
  showGroups=false;
  groups: Group[] = [
    {id:1,name:"Família"},
    {id:2,name:"Trabalho"},
    {id:3,name:"Amigos"},
  ];
  contacts: Contact[] = [];
  ngOnInit(): void {
    try {
      const obj=JSON.parse(localStorage.getItem('groups')||"") as Group[];
      if(obj){
        this.groups=obj
      }
    } catch (error) { }

    try {
      const obj=JSON.parse(localStorage.getItem('contacts')||"")as Contact[];
      if(obj){
        this.contacts=obj
      }
    } catch (error) { }

    try {
      const paramId:number=parseInt(this.route.snapshot.paramMap.get('id')||"") ;
      const contact=this.contacts.find(contato => contato.id === paramId);
      if(contact){
        this.data=contact;
        this.formGroup.patchValue(contact);
      }
    } catch (error) { }
  }
  save(){
    if (this.formContact.valid) {
      this.submitting = true;
      const value = this.formContact.value;
      Object.assign(this.data, value);
      if(this.data.id){
        this.update();
      }
      else{
        this.create();
      }
      this.clean();
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
      this.submitting = false;
    } else alert('Verifique os campos antes de continuar!');
  }
  generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  create(){
    this.data.id=this.generateRandomNumber(0,100);
    this.contacts.push({...this.data})
  }
  update(){
    const index = this.contacts.findIndex(c => c.id === this.data.id);
    if (index >= 0 && index < this.contacts.length) {
      this.contacts[index]=({...this.data})
    }
  }
  clean(){
    this.data=new Contact();
    this.formContact.reset();
    this.formGroup.reset();
  }
  editItem(id?:number){
    this.router.navigate(['/cadastro-contatos', id]);
  }
  deleteItem(id?:number){
    const index = this.contacts.findIndex(c => c.id === id);
    if (index >= 0 && index < this.contacts.length) {
      this.contacts.splice(index, 1);
    }
    this.clean();
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
  refreshGroups(groups: Group[]){
    this.showGroups=false;
    this.groups=groups;
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }
  onShowGroups(){
    this.showGroups=true;
  }
  getGroupName(id?:number){
    if(id){
      const index = this.groups.findIndex(c => c.id === id);
      if (index >= 0 && index < this.groups.length) {
        return this.groups[index]?.name;
      }
    }
    return "";
  }
  get controls() {
    return this.formContact.controls;
  }
  get controlsGroup() {
    return this.formGroup.controls;
  }
}
